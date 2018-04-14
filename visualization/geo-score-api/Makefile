install:
	docker-compose run --rm server pip install -r requirements.txt --user --upgrade

start:
	docker-compose up server

db/init:
	docker-compose run --rm server python src/manage.py db init

db/connect:
	docker exec -it geoscoreapi_db_1 psql -Upostgres

db/migrate:
	docker-compose run --rm server python src/manage.py db migrate

db/upgrade:
	docker-compose run --rm server python src/manage.py db upgrade

db/downgrade:
	docker-compose run --rm server python src/manage.py db downgrade
