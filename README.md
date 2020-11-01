Directory service is composed of a Django server and a PostGIS database:
DO NOT USE docker-compose, known issues with Django connecting to database.

-Run Django server:

  python3 manage.py runserver

-Create PostGIS container:

  docker run --name "postgis" -p 5432:5432 -d -t kartoza/postgis




## Calendar Service

#### Starting service for the first time


- In calendar/ run:



```
$ docker build -t calendarapp:latest .

```

- This will containerize our calendar app.
- Now we are able to start our app and related dependencies.
- Run:


```
$ docker compose up -d

```

 - This will create the user database and start our service itself.
 - Run

```
$ docker ps -a

```

And check for an output similar to this

```
CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                     PORTS                               NAMES
8cc42a8c2f9a        calendarapp:latest    "./start_server"         18 seconds ago      Up 17 seconds              0.0.0.0:9091->9091/tcp              calendar_service
ed053a3e57db        adminer               "entrypoint.sh docke…"   19 seconds ago      Up 17 seconds              0.0.0.0:9093->8080/tcp              db_mysql_adminer
77c111dcd377        mysql:8.0             "docker-entrypoint.s…"   19 seconds ago      Up 17 seconds              33060/tcp, 0.0.0.0:9094->3306/tcp   db_mysql_calendar
```



