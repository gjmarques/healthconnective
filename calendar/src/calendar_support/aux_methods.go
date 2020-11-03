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
    db_address = "engenhariaServicos2020:calendario@tcp(localhost:9092)/calendario_users"
)

var IsLetter = regexp.MustCompile(`^[0-9]+$`).MatchString

func isUserinDatabase(uuid string, db_Pointer *sql.DB) bool{
    sqlStatement := "SELECT * FROM users WHERE uuid = ?;"


    result_row :=db_Pointer.QueryRow(sqlStatement, uuid)
    
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
            //add entry to calendar
        }else{
            //create user first
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