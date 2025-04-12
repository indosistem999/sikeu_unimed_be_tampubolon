import { createServer, Server } from 'http';
import { App } from './app';
import { Config as cfg } from './constanta';
import { gracefullShutdown } from './gracefullShutdown';
import path from 'path';
import fs from 'fs';
import AppDataSource from './config/dbconfig';
import { Logger } from './config/logger';

const application = new App();
const server: Server = createServer(application.app);


const localesPath = path.join(__dirname, '../dist/lang/locales');

if (!fs.existsSync(localesPath)) {
  fs.mkdirSync(localesPath, { recursive: true });
}


process.on('unhandledRejection', (reason, promise) => {
  console.log(
    process.stderr.fd,
    `Caught rejection: ${promise}\nException reason: ${reason}`
  );

  process.exit(1); // PM2 will catch this exit and restart
});

process.on('rejectionHandled', (promise) => {
  console.log(process.stderr.fd, `Rejection: ${promise}`);
});



process.on('uncaughtException', (err) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\nException origin: ${origin}`
  );

  process.exit(1); // PM2 will catch this exit and restart
});



process.on('SIGTERM', async () => {
  console.log('\nGracefully shutting down from SIGINT (Ctrl-C)');
  // some other closing procedures go here
  try {
    await AppDataSource.destroy();
    Logger().info('Database connection closed.');
  } catch (dbError) {
    Logger().error('Error closing database:', dbError);
  }

  process.exit(0);
});


/** Start the server */
server.listen(cfg.AppPort, () => {
  console.log(`Server is running at http://localhost:${cfg.AppPort}`);
});
