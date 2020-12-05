import HttpException from './HttpException';

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong credentials provided');
  }
}

export default WrongAuthenticationTokenException;