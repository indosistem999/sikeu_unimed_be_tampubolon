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
app-deploy:
	docker compose -f $(compose-file) up -d --remove-orphans --force-recreate

app-deploy-watch:
	docker compose -f $(compose-file) up --remove-orphans --force-recreate

app-down:
	docker compose -f $(compose-file) down -v

app-logs:
	docker logs -f $(app-container-name)

app-check:
	docker-compose -f $(compose-file) exec -T $(app-container-name) bash
