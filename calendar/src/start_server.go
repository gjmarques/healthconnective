package main

import(
	"fmt"
	//"strconv"
	"net/http"
	"time"
	"log"
	
)


func process(w http.ResponseWriter, r *http.Request){
	//tmp.ProcessRequests(w,r)
	
}





func main(){

	fmt.Printf("Starting server...")
	http.HandleFunc("/add", process)
	http.HandleFunc("/get", process)
	http.HandleFunc("/modify", process)
	http.HandleFunc("/retrieve", process)
	
	s := &http.Server{
		Addr			:	"localhost:9091",
		//Handler 		: 	MyHandler
		ReadTimeout		:	10 * time.Second,
		WriteTimeout	:	10 * time.Second,
		MaxHeaderBytes	: 	1 << 20,
	}

	fmt.Printf("\nServer Listening at localhost:9091")
	
	log.Fatal(s.ListenAndServe())

	
	
	
}