import { Server } from 'http';
import AppDataSource from './config/ormconfig';
import { rabbitMqConfig } from './config/rabbitmq';
import { Logger } from './config/logger';

export const gracefullShutdown = async (server: Server): Promise<void> => {
  console.log('Initiating graceful shutdown...');

  // Close the HTTP server
  server.close(async (err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }

    console.log('HTTP server closed.');

    // Close the database connection
    try {
      await AppDataSource.destroy();
      Logger().info('Database connection closed.');
    } catch (dbError) {
      Logger().error('Error closing database:', dbError);
    }

    // Close RabbitMQ
    // try {
    //   await rabbitMqConfig.close();
    //   Logger().info('RabbitMQ connection closed.');
    // } catch (rmqError) {
    //   Logger().error('Error closing RabbitMQ:', rmqError);
    // }

    console.log('Application shutdown complete.');
    process.exit(0);
  });

  // Force shutdown if timeout is reached
  setTimeout(() => {
    console.error('Shutdown timeout exceeded. Forcing shutdown...');
    process.exit(1);
  }, 10000).unref(); // `unref()` prevents this timer from keeping the Node.js process alive
};
