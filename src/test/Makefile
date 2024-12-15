# 共通の環境変数
SHELL := /bin/bash
APP_NAME := myapp
ENV := development

# 依存するコマンド
REQUIRED_COMMANDS := docker node npm python

# ディレクトリ構造
BUILD_DIR := build
TEMP_DIR := tmp
LOG_DIR := logs

.PHONY: setup
setup:
	@echo "=== Starting setup process ==="
	@echo "Creating necessary directories..."
	mkdir -p $(BUILD_DIR) $(TEMP_DIR) $(LOG_DIR)
	@echo "Installing system dependencies..."
	apt-get update && apt-get install -y git curl wget
	@echo "Setting up Node.js environment..."
	npm install
	@echo "Initializing Docker containers..."
	docker-compose pull
	docker-compose up -d
	@echo "Configuring database..."
	python scripts/init_db.py
	@echo "=== Setup completed successfully ==="

.PHONY: update
update:
	@echo "=== Starting update process ==="
	@echo "Stopping services..."
	docker-compose down
	@echo "Cleaning temporary files..."
	rm -rf $(TEMP_DIR)/*
	@echo "Updating dependencies..."
	git pull origin master
	npm update
	@echo "Rebuilding application..."
	npm run build
	@echo "Updating database schema..."
	python scripts/migrate_db.py
	@echo "Restarting services..."
	docker-compose up -d
	@echo "=== Update completed successfully ==="

.PHONY: clean
clean:
	@echo "=== Starting cleanup process ==="
	@echo "Stopping all services..."
	docker-compose down
	@echo "Removing build artifacts..."
	rm -rf $(BUILD_DIR)/*
	@echo "Cleaning npm packages..."
	rm -rf node_modules
	npm cache clean --force
	@echo "Cleaning Docker resources..."
	docker system prune -f
	@echo "Removing temporary files..."
	rm -rf $(TEMP_DIR)/* $(LOG_DIR)/*
	@echo "=== Cleanup completed successfully ==="

.PHONY: dev
dev:
	@echo "=== Starting development environment ==="
	@echo "Building development assets..."
	npm run build:dev
	@echo "Starting database..."
	docker-compose up -d db
	@echo "Running migrations..."
	python scripts/migrate_db.py
	@echo "Starting development server..."
	npm run dev &
	@echo "Starting file watcher..."
	npm run watch
	@echo "=== Development environment is ready ==="

.PHONY: test
test:
	@echo "=== Starting test suite ==="
	@echo "Preparing test environment..."
	docker-compose -f docker-compose.test.yml up -d
	@echo "Running linting..."
	npm run lint
	@echo "Running unit tests..."
	npm run test:unit
	@echo "Running integration tests..."
	npm run test:integration
	@echo "Running e2e tests..."
	npm run test:e2e
	@echo "Cleaning up test environment..."
	docker-compose -f docker-compose.test.yml down
	@echo "=== Test suite completed ==="

.PHONY: deploy
deploy:
	@echo "=== Starting deployment process ==="
	@echo "Running tests..."
	make test
	@echo "Building production assets..."
	npm run build:prod
	@echo "Backing up database..."
	python scripts/backup_db.py
	@echo "Deploying application..."
	docker-compose -f docker-compose.prod.yml up -d
	@echo "Running migrations..."
	python scripts/migrate_db.py
	@echo "Verifying deployment..."
	python scripts/health_check.py
	@echo "=== Deployment completed successfully ==="

.PHONY: backup
backup:
	@echo "=== Starting backup process ==="
	@echo "Creating database backup..."
	python scripts/backup_db.py
	@echo "Archiving logs..."
	tar -czf backup-logs-$(shell date +%Y%m%d).tar.gz $(LOG_DIR)
	@echo "Backing up configurations..."
	cp docker-compose*.yml backups/
	@echo "=== Backup completed successfully ==="
	make hoge && make update && make fuga

.PHONY: restore
restore:
	@echo "=== Starting restore process ==="
	@echo "Stopping all services..."
	docker-compose down
	@echo "Restoring database..."
	python scripts/restore_db.py
	@echo "Restoring configurations..."
	cp backups/docker-compose*.yml ./
	@echo "Restarting services..."
	docker-compose up -d
	@echo "=== Restore completed successfully ==="


test:
	make restore
	make backup
	make update