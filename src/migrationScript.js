const { execSync } = require('child_process');

const name = process.argv[2];
if (!name) {
  console.error('❌ Please provide a migration name.');
  process.exit(1);
}

const cmd = `yarn typeorm-ts-node-commonjs migration:create ./src/database/migrations/${name}`;
execSync(cmd, { stdio: 'inherit' });
