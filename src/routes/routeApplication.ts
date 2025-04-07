
import MainRoutes from '../config/mainRoute';
import { IsProduction } from '../constanta';
import { swaggerDocLocalApi } from '../docs/swagger';
import swaggerUi from 'swagger-ui-express'
import RouteHealtCheck from './routeHealtCheck';

// Controller
import AuthController from '../app/modules/auth/auth.controller';
import MasterModuleController from '../app/modules/master_module/masterModule.controller';
import MasterIdentityController from '../app/modules/master_identity/masterIdentity.controller';
import MasterMenuController from '../app/modules/master_menu/masterMenu.controller'
import WorkUnitController from '../app/modules/work_unit/workUnit.controller';

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

    // API Master Identity
    this.router.use(`${tagVersionOne}/master-identity`, MasterIdentityController)

    // API Module
    this.router.use(`${tagVersionOne}/master-module`, MasterModuleController)

    // API Menu
    this.router.use(`${tagVersionOne}/master-menu`, MasterMenuController);

    // API Master Work Unit
    this.router.use(`${tagVersionOne}/work-unit`, WorkUnitController)
  }
}

export default new RouteApplication().router;
