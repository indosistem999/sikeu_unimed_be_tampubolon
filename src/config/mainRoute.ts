import { Router } from 'express';

interface RestApiInterface {
  routes(): void;
}

abstract class MainRoutes implements RestApiInterface {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  abstract routes(): void;
}

export default MainRoutes;
