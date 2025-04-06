migration-file=CreateUsersTable
entity-name=Users
compose-file=docker-compose.dev.yaml
app-container-name=finance_core_app:

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
	docker compose -f $(compose-file) down -v

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
