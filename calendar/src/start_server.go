package main

import(
	//"./calendar_support"
	"fmt"
	//"strconv"
	"net/http"
	"time"
	"log"
	
)


func processAdd(w http.ResponseWriter, r *http.Request){
	if r.Method == "POST"{

	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}

func processModify(w http.ResponseWriter, r *http.Request){
	if r.Method == "POST"{

	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}

func processRetrieve(w http.ResponseWriter, r *http.Request){
	if r.Method == "POST"{

	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}

func processGet(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{

	}else{
		w.WriteHeader(http.StatusUnauthorized) 
	}
}





func main(){

	fmt.Printf("Starting server...")
	http.HandleFunc("/add", processAdd)
	http.HandleFunc("/get", processGet)
	http.HandleFunc("/modify", processModify)
	http.HandleFunc("/retrieve", processRetrieve)
	
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