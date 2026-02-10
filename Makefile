.PHONY: run stop logs build

# Help
help: ## Display this help screen
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run: ## Start the application with Docker Compose
	docker compose up --build -d
	@echo "Application running at http://localhost:8080"

stop: ## Stop the application
	docker compose down

logs: ## View logs
	docker compose logs -f

build: ## Rebuild the Docker image without starting
	docker compose build

test: ## Run tests inside the container
	docker compose run --rm app go test ./...

clean: ## Remove Docker containers and images
	docker compose down --rmi all --volumes
