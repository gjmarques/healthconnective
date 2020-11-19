package AuxMethods

import (
	"testing"
	//"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"fmt"
	"math/big"
    "crypto/rand"
    
)

var email string = generate_uuid() + "@mail.com"
var id string
var etag string = generate_uuid()
var ics string = generate_uuid()
var date string = "20201212T100000Z"

func TestAddUser(t *testing.T){

	fmt.Println("Starting Test 1...")
	db_Pointer, err := OpenConnectionDB()

	

	added := AddUser(email, "Teste2", db_Pointer) 
	 
	if added{
		sqlStatement := "SELECT id_user, email, PersonName FROM Users WHERE email = ? ;"


		result_row :=db_Pointer.QueryRow(sqlStatement, email)
		
		var email_sql string
		var name string
		err = result_row.Scan(&id, &email_sql, &name)
		fmt.Println("id:" +  id )

		fmt.Println("email:" +  email_sql )
		
		fmt.Println("name:" +  name )
		
		if email_sql != email{
			t.Log("User not added",err)
			t.Fail()
		}else{
			fmt.Println("Test Passed with Success")

		}
	}else{
		
		t.Log("User not added",nil)
		t.Fail()

	}

	CloseConnectionDB(db_Pointer)
	fmt.Println("Ended Test 1...")


}


func TestAddEvent(t *testing.T){
	fmt.Println("Started Test 2...")
	db_Pointer, err := OpenConnectionDB()


	
	added := AddEvent(id, etag, date, ics, db_Pointer )
	 
	if added{
		sqlStatement := "SELECT U.id_user, UC.ics, UC.etag FROM Users AS U JOIN Users_cal AS UC WHERE U.email = ? AND UC.date_start= ?;"


		result_row :=db_Pointer.QueryRow(sqlStatement, email, date)
		var id_2 string
		var ics_2 string
		var etag_2 string
		err = result_row.Scan(&id_2, &ics_2, &etag_2)
		fmt.Println("id:" +  id_2 )

		fmt.Println("ics:" +  ics_2 )
		
		fmt.Println("etag:" +  etag_2 )
		
		if ics != ics_2 &&  etag != etag_2 && id != id_2 {
			fmt.Println("WRONG ICS AND ETAG ")
			t.Log("", err)
			t.Fail()
		}else{
			fmt.Println("Test Passed with Success")

		}
	}else{
		
		t.Log("User not added",nil)
		t.Fail()

	}

	CloseConnectionDB(db_Pointer)
	fmt.Println("Ended Test 2...")
}


func TestGetEtagEvent(t *testing.T){
	fmt.Println("Started Test 3...")
	db_Pointer, err := OpenConnectionDB()
	id_2, ics_2, etag_2 := getEtag(email, date, db_Pointer) 
	fmt.Println("id:" +  id_2 )

	fmt.Println("ics:" +  ics_2 )
	
	fmt.Println("etag:" +  etag_2 )

	if ics != ics_2 &&  etag != etag_2 && id != id_2 {
		fmt.Println("WRONG ICS AND ETAG ")
		t.Log("", err)
		t.Fail()
	}else{
		fmt.Println("Test Passed with Success")
	}

	CloseConnectionDB(db_Pointer)
	fmt.Println("Ended Test 3...")
}



func generate_uuid() string{
	charset := "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 32)
	for i := range b {
        numb, err := rand.Int(rand.Reader, big.NewInt(32))
        _ = err
		b[i] = charset[numb.Int64()]
	}
	return string(b)
}