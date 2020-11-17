package AuxMethods



import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
    "time"
    "errors"
    "regexp"
	"net/http"
    "bytes"
    req "../calendar_requests"

)
const (  
    db_address = "root:es2020@tcp(localhost:9094)/CalendarUsers"
)

var re, regexerr = regexp.Compile("[^A-Za-z@._0-9 ]+")    

func IsQueryTermOK(term string) bool{
    if regexerr != nil{
        return false
    }else{
        var isOK = re.MatchString(term)
        
        if isOK{
            return true
        }else{
            return false
        }
    }

}

func AddUser(email string, PersonName string, db_Pointer *sql.DB) bool{
    
    insert, err := db_Pointer.Prepare("INSERT INTO users(email, PersonName) VALUES (?, ?)")
    if err != nil {
        return false
    }
    
    //execute
    res, err := insert.Exec( email, PersonName)
    _ = res
    if err != nil {
        return false
    }


    return true
}

func getEtag(email string, date string) (string, string, string){
    sqlStatement := "SELECT U.id_user, UC.ics, UC.etag FROM Users AS U JOIN Users_cal AS UC WHERE U.email = ? AND UC.date_start= ?;"


    result_row :=db_Pointer.QueryRow(sqlStatement, email, date)
    var id
    var ics
    var etag 
    err := result_row.Scan(&id, &ics, &etag)
    if err != nil {
        return -1
    }

    return id, ics, etag
}

func isUserinDatabase(email string, db_Pointer *sql.DB) bool{
    sqlStatement := "SELECT id_user FROM users WHERE email = ?;"


    result_row :=db_Pointer.QueryRow(sqlStatement, email)
    var id 
    err := result_row.Scan(&id)
    if err != nil {
        return -1
    }

    return id
}

func AddEntry(w http.ResponseWriter, r *http.Request){
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"error": "Could not access database"}`))
        return
    }else{
        err := r.ParseForm()
        if err != nil {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusOK)
            w.Write([]byte(`{"error": "Could not access database"}`))
            CloseConnectionDB(db_Pointer)
            return 
        }
        email := r.PostForm.Get("email")
        if email == ""{
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusOK)
            w.Write([]byte(`{"error": "Wrong request params"}`))
            CloseConnectionDB(db_Pointer)
            return
        }else{
            if !IsQueryTermOK(email){
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusOK)
                w.Write([]byte(`{"error": "Wrong request params"}`))
                CloseConnectionDB(db_Pointer)
                return
            }
        }
        id_user_avail := isUserinDatabase(email, db_Pointer)
        if id_user_avail != -1 {
            //add entry to calendar
            summary := r.PostForm.Get("summary")
            date := r.PostForm.Get("date")
            uuid, put_body = build.Build_PUT(date, summary)
            if err != nil{
                
                
            }
        }else{
            //get Users name
            name_user := r.PostForm.Get("NameUser")
            if !IsQueryTermOK(name_user){
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusOK)
                w.Write([]byte(`{"error": "Wrong request params"}`))
                CloseConnectionDB(db_Pointer)
                return
            }
            //create user first
            added := AddUser(email, name_user, db_Pointer)
            
            CloseConnectionDB(db_Pointer)
            if !added{
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusOK)
                w.Write([]byte(`{"error": "Could not access database"}`))  
                return 
            }   
        }

    }
}


func ModifyEntry(w http.ResponseWriter, r *http.Request){
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
   		w.Write([]byte(`{"error": "Could not access database"}`))
    }else{
        err := r.ParseForm()
        if err != nil {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusOK)
            w.Write([]byte(`{"error": "Could not access database"}`))
        }
        email := r.PostForm.Get("email")
        if email == ""{
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusOK)
            w.Write([]byte(`{"error": "Wrong request params"}`))
            CloseConnectionDB(db_Pointer)
            return
        }else{
            if !IsQueryTermOK(email){
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusOK)
                w.Write([]byte(`{"error": "Wrong request params"}`))
                CloseConnectionDB(db_Pointer)
                return
            }
        }

    }
}


func DeleteEntry(w http.ResponseWriter, r *http.Request){
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
   		w.Write([]byte(`{"error": "Could not access database"}`))
    }else{
        err := r.ParseForm()
        if err != nil {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusOK)
            w.Write([]byte(`{"error": "Could not access database"}`))
        }
        email := r.PostForm.Get("email")
        if email == ""{
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusOK)
            w.Write([]byte(`{"error": "Wrong request params"}`))
            CloseConnectionDB(db_Pointer)
            return
        }else{
            if !IsQueryTermOK(email){
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusOK)
                w.Write([]byte(`{"error": "Wrong request params"}`))
                CloseConnectionDB(db_Pointer)
                return
            }
        }
        id_user_avail := isUserinDatabase(email, db_Pointer)
        if id_user_avail != -1 {
            //add entry to calendar
            
            if err != nil{
                
                
            }
        }else{
            //get date to delete
            date := r.PostForm.Get("date")
            if date == ""{
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusOK)
                w.Write([]byte(`{"error": "Wrong request params"}`))
                CloseConnectionDB(db_Pointer)
                return
            }

            ndate,err := time.Parse(time.RFC3339,date)

            if err != nil{


            }
            
            date_event := ndate.Format(time.RFC3339)
	        date_event = strings.Replace(date_event, "-", "", -1)
	        date_event = strings.Replace(date_event, ":", "", -1)
	
            id, ics, etag := getEtag(email, date_event)

            cod, err := req.Delete_from_cal(id, ics, etag)
            
            
        }
}


func OpenConnectionDB() (*sql.DB, error) {
    db, err := sql.Open("mysql", db_address)
    if err != nil {
        return nil,errors.New("Cannot open database")
    }
    
    db.SetConnMaxLifetime(time.Minute * 3)
    db.SetMaxOpenConns(10)
    db.SetMaxIdleConns(10)

    err = db.Ping()
    if err != nil {
        return nil,errors.New("Database not available")
    }

    return db, nil
}



func CloseConnectionDB( db_Pointer *sql.DB) (int, error) {
    
    err := db_Pointer.Close()
    if err != nil {
        return -1 ,errors.New("Could not close DB connection")
    }

    return 0, nil

}
