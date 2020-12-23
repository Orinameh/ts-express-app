import App from './app';
import PostsController from './posts/posts.controller';
import validateEnv from './utils/validateEnv';
import AuthenticationController from './authentication/authentication.controller';
import UserController from './users/user.controller';
import ReportController from './report/report.controller';

validateEnv();

const app = new App(
    [
        new PostsController(), 
        new AuthenticationController(),
        new UserController(),
        new ReportController()
   ]
    );

app.listen();