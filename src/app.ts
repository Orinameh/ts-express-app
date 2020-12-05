import * as express from "express";
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as cookieParser from "cookie-parser";
import Controller from './interfaces/controller.interface';
import errorMiddleware from './exceptions/error.middleware';


class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json()); //This makes req.body available
        this.app.use(cookieParser()); //This makes req.cookies available
    }

    private initializeControllers(controllers) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router)
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
      }

    private connectToTheDatabase() {
        const {
            MONGO_USER,
            MONGO_PASSWORD,
            DB_NAME
        } = process.env;
        //   DB connection
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.zjwof.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }).then(() => {
            console.log("mongodb is connected");
        }).catch((error) => {
            console.log("mondb not connected");
            console.log(error);
        });

    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
}

export default App;
