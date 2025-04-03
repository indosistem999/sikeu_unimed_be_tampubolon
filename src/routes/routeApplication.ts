import { AuthController } from '../app/modules';
import MainRoutes from '../config/mainRoute';
import RouteHealtCheck from './routeHealtCheck'

class RouteApplication extends MainRoutes {
  private readonly tagVersion: string = '/api/v1';
  public routes(): void {
    this.router.use(RouteHealtCheck)
    // this.router.use(`${this.tagVersion}/auth`, AuthController);
  }
}

export default RouteApplication;
