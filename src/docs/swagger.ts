import createSwaggerPath from './path';
import createSwaggerSchema from './schema';

const swaggerDocInfo: object = {
  description:
    'Restfull API documentation for the Finance Core App.',
  version: '1.0.0',
  title: 'Finance Core API',
  contact: {
    email: '',
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
  },
};

export const swaggerDocLocalApi: object = {
  openapi: '3.0.0',
  info: swaggerDocInfo,
  servers: [
    {
      url: '/api/v1/',
      description: 'Private API',
    },
  ],
  paths: createSwaggerPath(),
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: createSwaggerSchema(),
  },
};

export const swaggerDocGatewayApi: object = {
  openapi: '3.0.0',
  info: swaggerDocInfo,
  servers: [
    {
      url: 'url gateway',
      description: 'API Gateway',
    },
  ],
  paths: createSwaggerPath(),
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: createSwaggerSchema(),
  },
};
