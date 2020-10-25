FROM golang:alpine

RUN mkdir /calendar_app
COPY . /calendar_app

WORKDIR /calendar_app/src

###RUN go build start_server.go

CMD ["go","run","start_server.go"]