
import MainRoutes from '../config/mainRoute';
import { IsProduction } from '../constanta';
import { swaggerDocLocalApi } from '../docs/swagger';
import swaggerUi from 'swagger-ui-express'
import RouteHealtCheck from './routeHealtCheck';
import AuthController from '../app/modules/auth/auth.controller';
import MasterModuleController from '../app/modules/master_module/masterModule.controller';

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

    // API Auth
    this.router.use(`${tagVersionOne}/auth`, AuthController);

    // API Module
    this.router.use(`${tagVersionOne}/master-module`, MasterModuleController)
  }
}

export default new RouteApplication().router;
