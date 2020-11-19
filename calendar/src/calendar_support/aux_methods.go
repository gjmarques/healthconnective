package AuxMethods



import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
    "time"
    "errors"
    "regexp"
    "net/http"
    //"strconv"
    "strings"
    //"bytes"
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


func AddEvent(id_user string, etag string, date string, ics string, db_Pointer *sql.DB) bool{
    
    insert, err := db_Pointer.Prepare("INSERT INTO Users_cal(id_user, ics, date_start, etag) VALUES (?, ?, ?, ?)")
    if err != nil {
        return false
    }
    
    //execute
    res, err := insert.Exec( id_user, ics, date, etag)
    _ = res
    if err != nil {
        return false
    }


    return true
}

func AddUser(email string, PersonName string, db_Pointer *sql.DB) bool{
    
    insert, err := db_Pointer.Prepare("INSERT INTO Users(email, PersonName) VALUES (?, ?)")
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

func getEtag(email string, date string, db_Pointer *sql.DB) (string, string, string){
    sqlStatement := "SELECT U.id_user, UC.ics, UC.etag FROM Users AS U JOIN Users_cal AS UC WHERE U.email = ? AND UC.date_start= ?;"


    result_row :=db_Pointer.QueryRow(sqlStatement, email, date)

    var id string
    var ics string
    var etag string
    err := result_row.Scan(&id, &ics, &etag)
    if err != nil {
        return "", "", ""
    }

    return id, ics, etag
}

func isUserinDatabase(email string, db_Pointer *sql.DB) string{
    sqlStatement := "SELECT id_user FROM Users WHERE email = ?;"


    result_row := db_Pointer.QueryRow(sqlStatement, email)
    var id string
    err := result_row.Scan(&id)
    if err != nil {
        return "-1"
    }

    return id
}

func AddEntry(w http.ResponseWriter, r *http.Request){
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusInternalServerError)
        w.Write([]byte(`{"error": "Could not access database"}`))
        return
    }else{
        err := r.ParseForm()
        if err != nil {
            w.WriteHeader(http.StatusBadRequest)
            CloseConnectionDB(db_Pointer)
            return 
        }
        email := r.PostForm.Get("email")
        if email == ""{
            w.WriteHeader(http.StatusBadRequest)
            CloseConnectionDB(db_Pointer)
            return
        }else{
            if !IsQueryTermOK(email){
                w.WriteHeader(http.StatusBadRequest)
                CloseConnectionDB(db_Pointer)
                return
            }
        }
        id_user_avail := isUserinDatabase(email, db_Pointer)
        summary := r.PostForm.Get("summary")
        date := r.PostForm.Get("date")

        if id_user_avail == "-1" {
            
            //get Users name
            name_user := r.PostForm.Get("NameUser")
            if !IsQueryTermOK(name_user){
                w.WriteHeader(http.StatusBadRequest)
                CloseConnectionDB(db_Pointer)
                return
            }
            //create user first
            added := AddUser(email, name_user, db_Pointer)
            
            if !added{

                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusInternalServerError)
                return 
            }

            id_user_avail := isUserinDatabase(email, db_Pointer)
            
            if id_user_avail == "-1"{
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusInternalServerError)
                return
            }
        }

        
        //add entry to calendar  
        ics, putErr := req.Put_cal(id_user_avail, date, summary)
        if putErr == ""{
            
            
        }


        //get etag
        etag, err := req.Report_cal(id_user_avail, ics)


        addedEv := AddEvent(id_user_avail, etag, date, ics, db_Pointer)

        CloseConnectionDB(db_Pointer)
        
        if !addedEv{
            w.WriteHeader(http.StatusInternalServerError)
            return 
        }

        w.WriteHeader(http.StatusOK)
        return

    }
}


func ModifyEntry(w http.ResponseWriter, r *http.Request){
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }else{
        err := r.ParseForm()
        if err != nil {
            w.WriteHeader(http.StatusBadRequest)
        }
        email := r.PostForm.Get("email")
        if email == ""{
            w.WriteHeader(http.StatusBadRequest)
            CloseConnectionDB(db_Pointer)
            return
        }else{
            if !IsQueryTermOK(email){
                w.WriteHeader(http.StatusBadRequest)
                CloseConnectionDB(db_Pointer)
                return
            }
        }


        init_date := r.PostForm.Get("old_date")
        init_date_form,err := time.Parse(time.RFC3339,init_date)

        old_date := init_date_form.Format(time.RFC3339)    
        old_date = strings.Replace(old_date, "-", "", -1)
        old_date = strings.Replace(old_date, ":", "", -1)

        new_date := r.PostForm.Get("new_date")
        new_date_form,err := time.Parse(time.RFC3339,new_date)

        date := new_date_form.Format(time.RFC3339)    
        date = strings.Replace(date, "-", "", -1)
        date = strings.Replace(date, ":", "", -1)

        id, ics, etag := getEtag(email, old_date, db_Pointer)

        _ = id
        _ = ics
        _ = etag

    }

    w.WriteHeader(http.StatusOK)
    return

}


func DeleteEntry(w http.ResponseWriter, r *http.Request){
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        CloseConnectionDB(db_Pointer)
        w.WriteHeader(http.StatusInternalServerError)
    }else{
        err := r.ParseForm()
        if err != nil {
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusBadRequest)
        }
        email := r.PostForm.Get("email")
        if email == ""{
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusBadRequest)
            return
        }else{
            if !IsQueryTermOK(email){
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusBadRequest)
                return
            }
        }
        id_user_avail := isUserinDatabase(email, db_Pointer)
        if id_user_avail != "-1" {
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusForbidden)
            return   
        }else{
            //get date to delete
            date := r.PostForm.Get("date")
            if date == ""{
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusBadRequest)
                return
            }
            CloseConnectionDB(db_Pointer)
            ndate,err := time.Parse(time.RFC3339,date)

            if err != nil{
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusBadRequest)
                return

            }
            
            date_event := ndate.Format(time.RFC3339)
	        date_event = strings.Replace(date_event, "-", "", -1)
	        date_event = strings.Replace(date_event, ":", "", -1)
	
            id, ics, etag := getEtag(email, date_event, db_Pointer)

           
            cod, err := req.Delete_from_cal(id, ics, etag)

            _ = cod

            if err != nil{
                w.WriteHeader(http.StatusInternalServerError)
                return

            }
            
            
        }
    }
}


func Get_entries(w http.ResponseWriter, r *http.Request){

    return
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
