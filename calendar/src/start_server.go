package main

import (
	supp "./calendar_support"
	"fmt"
	//"strconv"
	"net/http"
	"time"
	"log"
	"strings"
	"strconv"
	
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
	if r.Method == "POST"{
		w.WriteHeader(http.StatusOK)
	}else{
		w.WriteHeader(http.StatusUnauthorized)
	}
}


func processTestGet(w http.ResponseWriter, r *http.Request){
	if r.Method == "GET"{
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		return_string := `{ "Events: [ `

		date_test := time.Now()
		for i:=0; i<4; i++ {               
			
			time_now := date_test.Format(time.RFC3339)
			
			
			new_date := strings.Replace(time_now, "-", "", -1)
			new_date = strings.Replace(new_date, ":", "", -1)
			
			return_string = return_string + ` {Summary : "Consulta Maria` + strconv.Itoa(i) + `", Date: "` + new_date + `"}`   
			
			if i != 3{
				return_string = return_string + ","
			}
			date_test = date_test.Add(time.Minute * 60)
		}        

		return_string = return_string + `]}`



		w.Write([]byte(return_string))

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



func main(){

	fmt.Printf("Starting server...")
	http.HandleFunc("/add", processAdd)
	http.HandleFunc("/get", processGet)
	http.HandleFunc("/modify", processModify)
	http.HandleFunc("/delete", processDelete)
	http.HandleFunc("/testadd", processTestAdd)
	http.HandleFunc("/testget", processTestGet)
	http.HandleFunc("/testdelete", processTestDelete)
	http.HandleFunc("/testmodify", processAdd)
	
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
