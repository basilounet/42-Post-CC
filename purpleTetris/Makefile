##========== COLORS ==========##

BASE_COLOR		=	\033[0;39m
BLACK			=	\033[30m
GRAY			=	\033[0;90m
DARK_GRAY		=	\033[37m
RED				=	\033[0;91m
DARK_GREEN		=	\033[32m
DARK_RED		=	\033[31m
GREEN			=	\033[0;92m
ORANGE			=	\033[0;93m
DARK_YELLOW		=	\033[33m
BLUE			=	\033[0;94m
DARK_BLUE		=	\033[34m
MAGENTA			=	\033[0;95m
DARK_MAGENTA	=	\033[35m
CYAN			=	\033[0;96m
WHITE			=	\033[0;97m
BLACK_ORANGE	=	\033[38;2;187;62;3m

help:
	@ clear
	@ echo "$(ORANGE)┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[ HELP ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"
	@ echo 			"┃ - $(BLUE)help:$(CYAN) Show command list.						$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)up: $(CYAN)Build and start services.					$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)down: $(CYAN)End services.							$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)re: $(CYAN)End and restart services.					$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)logs: $(CYAN)Create logfiles with docker logs.				$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)rm_logs: $(CYAN)Delete the logs files.					$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)clean: $(CYAN)Clean all.							$(ORANGE)┃"
	@ echo 			"┃ - $(BLUE)fre: $(CYAN)Clean and re up all.						$(ORANGE)┃"
	@ echo "$(ORANGE)┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"


up:
	@ clear
	@ echo "$(RED)Replacing IP addr in .env...$(BASE_COLOR)"
	@ echo "URL: http://$(shell hostname -I | head -n 1 | awk '{print $$1}'):5000"
	@ sed -i -E "s/(ADDR=\")[0-9]{1,3}(\.[0-9]{1,3}){3}(\")/\1$(shell hostname -I | head -n 1 | awk '{print $$1}')\3/g" ./src/.env
	@# cp ./src/.env ./src/front/transcendenceFront/.env
	@ echo "$(DARK_GREEN)IP addr replaced!$(BASE_COLOR)"
	@ echo "$(RED)Building project...$(BASE_COLOR)"
	@ docker compose -f ./src/docker-compose.yml --progress quiet build
	@ echo "$(DARK_GREEN)Build done !$(BASE_COLOR)"
	@ echo "$(RED)Starting services...$(BASE_COLOR)"
	@ docker compose -f ./src/docker-compose.yml --progress quiet up -d
	@ echo "$(DARK_GREEN)Services started !$(BASE_COLOR)"

down: 
	@ clear
	@ echo "$(RED)Ending services...$(BASE_COLOR)"
	@ docker compose -f ./src/docker-compose.yml --progress quiet down
	@ echo "$(DARK_GREEN)Services ended !$(BASE_COLOR)"

logs:
	@ echo "$(RED)Creating logs...$(BASE_COLOR)"
	@ echo "$(ORANGE)Front:$(BASE_COLOR)"
	@ docker logs front
	@ echo "$(ORANGE)Back:$(BASE_COLOR)"
	@ docker logs back
	@ echo "$(DARK_GREEN)Logs created!$(BASE_COLOR)"

rm_logs:
	@ echo "$(RED)Deleting logs...$(BASE_COLOR)"
	@ if docker image ls | grep -q back; then \
		echo "" > $$(docker inspect --format='{{.LogPath}}' back); \
	fi
	@ if docker image ls | grep -q front; then \
		echo "" > $$(docker inspect --format='{{.LogPath}}' front); \
	fi
	@ echo "$(GREEN)Logs deleted!$(BASE_COLOR)"

tests:
	@ if ! docker ps | grep -q back; then \
		echo "$(DARK_RED)Back image not found! Please run 'make up' first.$(BASE_COLOR)"; \
	else \
		echo "$(RED)Running tests for back...$(BASE_COLOR)"; \
		cd src/back/redTetrisBack && npm i && npm run testcov ; cd ../../..; \
		echo "$(DARK_GREEN)Tests for back completed!$(BASE_COLOR)"; \
		echo "$(RED)Running tests for front...$(BASE_COLOR)"; \
		cd src/front/redTetrisFront && npm i && npm run testcov ; cd ../../..; \
		echo "$(DARK_GREEN)Tests for front completed!$(BASE_COLOR)"; \
 	fi

clean: down
	@ echo "$(RED)Removing all docker image...$(BASE_COLOR)"
	@ docker system prune -af >/dev/null
	@ if [ -n "$$(docker ps -qa)" ]; then \
		echo "$(RED)Stopping and removing running docker...$(BASE_COLOR)"; \
		docker stop $$(docker ps -qa) >/dev/null; \
		docker rm $$(docker ps -qa) >/dev/null; \
	fi
	@ if [ -n "$$(docker images -qa)" ]; then \
		echo "$(RED)Removing images...$(BASE_COLOR)"; \
		docker rmi -f $$(docker images -qa) >/dev/null; \
	fi
	@ if [ -n "$$(docker volume ls -q)" ]; then \
		echo "$(RED)Removing volumes...$(BASE_COLOR)"; \
		docker volume rm $$(docker volume ls -q) >/dev/null; \
	fi
	@ if [ -n "$$(docker network ls -q --filter "type=custom")" ]; then \
		echo "$(RED)Removing custom networks...$(BASE_COLOR)"; \
		docker network rm $$(docker network ls -q --filter "type=custom") 2>/dev/null; \
	fi
	@ echo "$(GREEN)All cleaned!$(BASE_COLOR)"

re: down up

fre: clean up

.PHONY:
	help up down logs rm_logs tests clean re