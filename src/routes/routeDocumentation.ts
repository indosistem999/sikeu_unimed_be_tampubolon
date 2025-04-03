import MainRoutes from '../config/mainRoute';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocLocalApi } from '../docs/swagger';

class RouteDocumentation extends MainRoutes {
  public routes(): void {
    this.router.use(
      '/documentation',
      swaggerUi.serveFiles(swaggerDocLocalApi),
      swaggerUi.setup(swaggerDocLocalApi)
    );
  }
}

export default RouteDocumentation;
