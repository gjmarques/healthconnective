FROM golang:alpine

RUN mkdir /calendar_app
COPY . /calendar_app

WORKDIR /calendar_app

RUN apk add git

RUN go get -u github.com/go-sql-driver/mysql

RUN go get -u github.com/dgrijalva/jwt-go

RUN go build src/start_server.go

EXPOSE 9091

CMD ["./start_server"]
