


start_service:
	docker-compose up -d
	go run src/start_server.go
	#python3 -m radicale --storage-filesystem-folder=~/.var/lib/radicale/collections --server-hosts 0.0.0.0:9095


build_calendar_service:
	docker build -t calendarapp:latest .


stop_service:
	docker-compose stop
	
install_radicale:
	python3 -m pip install --upgrade https://github.com/Kozea/Radicale/archive/master.tar.gz
