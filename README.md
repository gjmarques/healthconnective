DO NOT USE docker-compose, known issues with Django connecting to database.

Run Django server:

python3 manage.py runserver

Create PostGIS container:

docker run --name "postgis" -p 5432:5432 -d -t kartoza/postgis