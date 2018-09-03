import * as express from 'express';
import HomeController from '../controllers/HomeController'

class Routes {
  public router: express.Router

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes(): void {
    this.router.get('/api/v1', HomeController.get);
    this.router.post('/api/v1', HomeController.create);
    this.router.delete('/api/v1', HomeController.delete);
  }
}

export default new Routes;