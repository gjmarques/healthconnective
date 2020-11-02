## Calendar Service

#### Building the videocall service 

In $REPO_DIR/videocall/ run:

```
$ docker build -t videocall:latest .

```

- This will build and containerize our videoconference call service.
- In future versions a docker-compose will be available as well as a helm-chart.
- This can be done only in the first time.

#### Running the videocall service

To run the app use this command

```
$ docker run --name videocall -d -p 8008:8008 videocall
```

And check for an output similar to this with the command
```
$ docker ps
```

```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
5e2938573495        videocall           "docker-entrypoint.s…"   4 seconds ago       Up 4 seconds        0.0.0.0:8008->8008/tcp   videocall
```
#### Stopping and removing the videocall service

To stop the container use either one of the following commands
```
$ docker stop videocall
$ docker container stop $(docker ps -aqf "name=videocall") 
```

To remove the container use one of the following commands (don't forget to stop it)
```
$ docker rm videocall
$ docker container rm $(docker ps -aqf "name=videocall") 
```

#### Troubleshooting

Not much works so open an issue I guess... ¯\\\_(ツ)_/¯
