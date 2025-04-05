# Readme

"typeorm": "typeorm-ts-node-commonjs",
"seed": "ts-node src/database/seeders/index.ts",
"start:dev": "nodemon --watch src/** --ext ts,json --ignore src/**/\*.spec.ts --exec ts-node src/server.ts",
"dev": "nodemon --watch src --exec ts-node src/server.ts",
"migration:run": "yarn typeorm migration:run -- -d src/config/dbconfig.ts"
