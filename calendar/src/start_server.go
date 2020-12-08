package main

import (
	supp "./calendar_support"
	"fmt"
	"net/http"
	"time"
	"log"
)




func processRegister(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
		supp.AddUserInfo(w,r)
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}


func processAdd(w http.ResponseWriter, r *http.Request){

	
	if r.Method == "GET"{
		supp.AddEntry(w,r)
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}

func processModify(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
		supp.ModifyEntry(w,r)
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}


func processGet(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
		supp.Get_entries(w,r)
	}else{
		w.WriteHeader(http.StatusUnauthorized) 
	}
}

func processDelete(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
		supp.DeleteEntry(w,r)
	}else{
		w.WriteHeader(http.StatusUnauthorized) 
	}
}

func processTestAdd(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
		w.WriteHeader(http.StatusOK)
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}

func processTestJwt(w http.ResponseWriter, r *http.Request){
    if r.Method == "GET"{
        supp.TestJwt(w,r)
        
        
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}

func processTestGet(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
        
        supp.TestGet(w,r)

	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}	
}




func processTestDelete(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
		w.WriteHeader(http.StatusOK)
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}	
}

func processAvailable(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
        supp.IsAvailable(w,r)
        
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}	
}







func main(){

	fmt.Printf("Starting server...")
	http.HandleFunc("/register", processRegister)
	http.HandleFunc("/add", processAdd)
	http.HandleFunc("/get", processGet)
	http.HandleFunc("/modify", processModify)
	http.HandleFunc("/delete", processDelete)
    http.HandleFunc("/available", processAvailable)
	http.HandleFunc("/testadd", processTestAdd)
	http.HandleFunc("/testget", processTestGet)
	http.HandleFunc("/testdelete", processTestDelete)
	http.HandleFunc("/testmodify", processAdd)
    http.HandleFunc("/testjwt", processTestJwt)
	
	s := &http.Server{
		Addr			:	"0.0.0.0:9091",
		//Handler 		: 	MyHandler
		ReadTimeout		:	10 * time.Second,
		WriteTimeout	:	10 * time.Second,
		MaxHeaderBytes	: 	1 << 20,
	}

	fmt.Printf("\nServer Listening at *:9091")
	
	log.Fatal(s.ListenAndServe())

	
	
	
}
