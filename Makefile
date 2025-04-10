migration-file=AddGenderToUserTable
entity-name=Users
compose-file=docker-compose.dev.yaml
app-container-name=finance_core_app
app-pm-name=sikeu-dev

local-migration-create:
	yarn typeorm migration:create  ./src/database/migrations/$(migration-file)

local-entity-create:
	yarn typeorm entity:create ./src/database/models/$(entity-name)

run-dev:
	npm run dev

seeder:
	npm run seed


# Docker Command
app-build:
	docker compose -f $(compose-file) up -d --build 

app-deploy:
	docker compose -f $(compose-file) up -d --build --remove-orphans --force-recreate

app-rebuild:
	docker compose -f $(compose-file) build --no-cache

app-deploy-watch:
	docker compose -f $(compose-file) up --build  --remove-orphans --force-recreate

app-down:
	docker compose -f $(compose-file) down

app-logs:
	docker logs -f $(app-container-name)

app-check:
	docker exec -it $(app-container-name) sh

migration-generate:
	docker exec -it finance_core_app yarn run migration:generate

migration-run:
	docker exec -it finance_core_app yarn run migration:run


seed:
	docker exec -it finance_core_app yarn run seed

create-migration:
	docker exec -it finance_core_app yarn run typeorm-ts-node-commonjs migration:create ./src/database/migrations/$(migration-file)

restart-app:
	docker restart finance_core_app 

restart-db:
	docker restart finance_mysql 

pm-dev:
	pm2 start npm --name sikeu-api -- run dev

pm-log:
	pm2 logs $(app-pm-name)
