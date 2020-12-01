package requests

import (
	"testing"
	"fmt"
)


var user_id = "999999"


var date
var etag
var ics

func CreateCalendar(t *testing.T){
	created := Mk_cal(user_id) 

	if !created {
		fmt.Println("calendar could not be created for user " + user_id)
		t.Fail()
	}else{
		fmt.Println("calendar created for user " + user_id)
		
	}
}


func CreateEvent(t *testing.T){

	time_n := time.Now()
	time_n2 := time_n.Add(time.Minute * 30)
	date = time_n2.Format(time.RFC3339)
    date = strings.Replace(date, "-", "", -1)
    date = strings.Replace(date, ":", "", -1)
	
	var err error
	ics, etag, err = (user_id, date,"testing", "")

	if err != nil{
		fmt.Println("Cannot create Event ")
		t.Fail()
	}else{
		fmt.Println("Event created with success")
	}

}


func GetEvents(t *testing.T){
	json_string, err := Report_cal(user_id)

	if err != nil{
		fmt.Println("Could not get events")
		t.Fail()
	}else{
		fmt.Println(json_string)
	}
}


func DeleteEvent(t *testing.T){
	deleted := Delete_from_cal(user_id, etag, ics)

	if !deleted{
		fmt.Println("Event not deleted")
		t.Fail()
	}else{
		fmt.Println("Event deleted")
	}
}