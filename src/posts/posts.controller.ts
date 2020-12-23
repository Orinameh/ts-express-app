import PostNotFoundException from '../exceptions/PostNotfoundException';
import * as express from 'express';
import Post from './post.interface';
import postModel from './posts.model';
import HttpException from '../exceptions/HttpException';
import validationMiddleware from '../middleware/validation.middleware';
import CreatePostDto from './post.dto';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';

class PostsController {
    public path = '/posts';
    public router = express.Router();
    private post = postModel;


    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);

        // this.router.post(this.path, validationMiddleware(CreatePostDto), this.createAPost);
        // this.router.patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost);
        // this.router.delete(`${this.path}/:id`, validationMiddleware(CreatePostDto), this.deletePost);
        this.router
        .all(`${this.path}/*`, authMiddleware)
        .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
        .delete(`${this.path}/:id`, validationMiddleware(CreatePostDto), this.deletePost)
        .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createAPost);

    }


    private createAPost = async (request: RequestWithUser, response: express.Response): Promise<express.Response> => {
        try {
            const postData: Post = request.body;
            const createdPost = new this.post({...postData, author: request.user._id});
            const savedPost = await createdPost.save();
            await savedPost.populate({ path: 'author', select: 'name email' }).execPopulate();
            if (!savedPost) {
                return response.status(400).json({ message: 'Bad request' });
            }
            return response.status(201).json({
                message: 'Post created',
                post: savedPost
            });

        } catch (error) {
            // console.log(error)
            return response.status(500).json({ message: 'something bad happened', error });
        }

    }

    private getAllPosts = async (request: express.Request, response: express.Response) => {
        try {
            const posts: Post[] = await this.post.find().populate('author', 'name email').exec();

            if (!posts) {
                response.status(400).json({ message: 'Bad request' })
            }
            response.status(200).json({ message: 'Get all posts', posts });

        } catch (error) {
            console.log(error)
            response.status(500).json({ message: 'something bad happened' });

        }

    }

    private getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        this.post.findOne({ _id: id }).exec()
            .then((post) => {
                if(post) {
                    response.status(200).json({ post });
                } else {
                    next(new PostNotFoundException(id));
                }
            }).catch(err => {
                next(new HttpException(500, err));

            });
    };

    private modifyPost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id: string = request.params.id;
        const postData: Post = request.body;
        this.post.findOneAndUpdate({_id: id}, postData)
          .then((post) => {
            if(post) {
                response.status(200).json({message: 'Post updated', post });
            } else {
                next(new PostNotFoundException(id));
            }
          }).catch(err => {
            next(new HttpException(500, err));

        });
    };

    private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.params.id;
            const delPost = await this.post.findByIdAndDelete(id).exec();
            response.status(200).json({ message: 'Post deleted', data: delPost});
        } catch (error) {
            // response.status(500).json({ message: 'something bad happened', error });
            next(new HttpException(500, error));
            
        }
          
      }

}

export default PostsController;