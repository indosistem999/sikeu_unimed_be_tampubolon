import AuthController from '../app/modules/auth/auth.controller';
import MainRoutes from '../config/mainRoute';
import { IsProduction } from '../constanta';
import { swaggerDocLocalApi } from '../docs/swagger';
import swaggerUi from 'swagger-ui-express'
import RouteHealtCheck from './routeHealtCheck'

const tagVersionOne: string = '/api/v1';

class RouteApplication extends MainRoutes {
  public routes(): void {
    this.router.use(RouteHealtCheck)

    if (!IsProduction) {
     this.router.use(
        '/documentation',
        swaggerUi.serveFiles(swaggerDocLocalApi),
        swaggerUi.setup(swaggerDocLocalApi)
      );
    }

    this.router.use(`${tagVersionOne}/auth`, AuthController);
  }
}

export default new RouteApplication().router;
