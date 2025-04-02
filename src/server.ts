import { createServer, Server } from 'http';
import { App } from './app';
import { Config as cfg } from './constanta';
import { gracefullShutdown } from './gracefullShutdown';

const application = new App();
const server: Server = createServer(application.app);

/** Start the server */
server.listen(cfg.AppPort, () => {
  console.log(`Server is running at http://localhost:${cfg.AppPort}`);
});

// Handle graceful shutdown
// process.on('SIGINT', () => gracefullShutdown(server));
// process.on('SIGTERM', () => gracefullShutdown(server));
