package main

import (
	supp "./calendar_support"
	"fmt"
	//"strconv"
	"net/http"
	"time"
	"log"
	
)


func processAdd(w http.ResponseWriter, r *http.Request){
	if r.Method == "POST"{
		supp.AddEntry(w,r)
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

func processTestAdd(w http.ResponseWriter, r *http.Request){
	if r.Method == "POST"{
		w.WriteHeader(http.StatusOK)
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}


func processTestRetrieve(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"events": [{ date: 20160829T091233001Z , subject: "Consulta Maria" }, { date: 20160829T091333001Z, subject: "Consulta Mário"}, { date: 20160829T0101233001Z, subject : "Consulta João"}]}`))

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
	http.HandleFunc("/testadd", processTestAdd)
	http.HandleFunc("/testretrieve", processTestRetrieve)
	
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