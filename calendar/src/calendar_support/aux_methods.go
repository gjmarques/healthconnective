package AuxMethods



import(
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
    "time"
    "errors"
    "regexp"
	"net/http"

)
const (  
    db_address = "root:es2020@tcp(localhost:9094)/CalendarUsers"
)

var IsLetter = regexp.MustCompile("[a-z@._0-9]+$").MatchString

func AddUser(email string, PersonName string, db_Pointer *sql.DB) bool{
    insert, err := db_Pointer.Prepare("INSERT INTO users(email, PersonName) VALUES (?, ?)")
    if err != nil {
        return false
    }
    
    //execute
    res, err := insert.Exec( email, PersonName)
    if err != nil {
        return false
    }


    return true
}
}

func isUserinDatabase(email string, db_Pointer *sql.DB) bool{
    sqlStatement := "SELECT * FROM users WHERE email = ?;"


    result_row :=db_Pointer.QueryRow(sqlStatement, email)
    
    err := result_row.Scan()
    if err != nil {
        if err == sql.ErrNoRows {
            return false
        } else {
            return false
        }
    }

    return true
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
        }
        user_avail := isUserinDatabase(email, db_Pointer)
        if user_avail{
            //add entry to calendar
        }else{
            //create user first
            added := AddUser(email, r.PostForm.Get("NameUser"), db_Pointer)
            
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
        uuid := r.PostForm.Get("uuid")
        user_avail := isUserinDatabase(uuid, db_Pointer)
        if user_avail{
            //modify entry in calendar
        }else{
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusOK)
            w.Write([]byte(`{"error": "User not present in the database"}`))
        }

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
