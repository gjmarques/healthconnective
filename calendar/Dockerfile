FROM golang:alpine

RUN mkdir /calendar_app
COPY . /calendar_app

WORKDIR /calendar_app

RUN apk add git

RUN go get -u github.com/go-sql-driver/mysql

RUN go build src/start_server.go

CMD ["./start_server"]
