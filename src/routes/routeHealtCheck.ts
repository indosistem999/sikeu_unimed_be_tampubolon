/* eslint-disable import/no-unresolved */
import { Request, Response } from 'express';
import MainRoutes from '../config/mainRoute';
import { sendSuccessResponse } from '../lib/utils/response.util';
import { Config as cfg, IsProduction } from '../constanta';
import { getDurationInMilliseconds } from '../lib/utils/common.util';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocLocalApi } from '../docs/swagger';

class RouteHealtCheck extends MainRoutes {
  public routes(): void {
    this.router.get('/', (req: Request, res: Response) => {

      const rows: any = {
        response_time: `${getDurationInMilliseconds()}(ms)`,
        uptimes: process.uptime(),
        timestamp: new Date().toISOString()
      }
      if (!IsProduction) {
        rows.documentation = `http://${req.get('host')}/documentation`;
      }

      sendSuccessResponse(res, 200, `Welcome to api ${cfg.AppName}`, rows);
    });


    if (!IsProduction) {
      this.router.use(
        '/documentation',
        swaggerUi.serveFiles(swaggerDocLocalApi),
        swaggerUi.setup(swaggerDocLocalApi)
      );
    }
  }
}

export default new RouteHealtCheck().router;
