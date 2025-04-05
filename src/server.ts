import { createServer, Server } from 'http';
import { App } from './app';
import { Config as cfg } from './constanta';
import { gracefullShutdown } from './gracefullShutdown';
import path from 'path';
import fs from 'fs';

const application = new App();
const server: Server = createServer(application.app);


const localesPath = path.join(__dirname, '../dist/lang/locales');

if (!fs.existsSync(localesPath)) {
  fs.mkdirSync(localesPath, { recursive: true });
}

/** Start the server */
server.listen(cfg.AppPort, () => {
  console.log(`Server is running at http://localhost:${cfg.AppPort}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => gracefullShutdown(server));
process.on('SIGTERM', () => gracefullShutdown(server));
