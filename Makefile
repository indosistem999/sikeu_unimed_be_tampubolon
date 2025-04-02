migration-file=CreateUsersTable
entity-name=Users
compose-file-local=docker-compose.dev.yml

local-migration-create:
	yarn typeorm migration:create  ./src/database/migrations/$(migration-file)

local-entity-create:
	yarn typeorm entity:create ./src/database/models/$(entity-name)

run-dev:
	npm run dev

seeder:
	npm run seed


deploy-local-watch:
	docker compose -f $(compose-file-local) up --remove-orphans --force-recreate

down-local:
	docker compose -f $(compose-file-local) down -v

local-logs:
	docker logs -f 