package AuxMethods



import (
	"database/sql"
    _ "github.com/go-sql-driver/mysql"
    "github.com/dgrijalva/jwt-go"
    "time"
    "errors"
    "regexp"
    "net/http"
    "strconv"
    "strings"
    "math/rand"
    //"fmt"
    //"bytes"
    req "../calendar_requests"

)
const (  
    db_address = "root:es2020@tcp(localhost:9094)/CalendarUsers"
)

var re, regexerr = regexp.Compile("[^A-Za-z@._0-9 ]+")    


func parseJWT_Token(token_jwt string) (string, error){
     tokenString := token_jwt

    // Parse takes the token string and a function for looking up the key. The latter is especially
    // useful if you use multiple keys for your application.  The standard is to use 'kid' in the
    // head of the token to identify which key to use, but the parsed token (head and claims) is provided
    // to the callback, providing flexibility.
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // Don't forget to validate the alg is what you expect:
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, errors.New("Unexpected signing method")
        }

        //return []byte("secret-key"), error
        return []byte("calendar") , nil
    })

    if err != nil{
        return "", "", errors.New("1")

    }
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        email :=  claims["email"].(string)
        

        return email, nil
    } else {
        return "", errors.New("1")
    }
}


func TestGet(w http.ResponseWriter, r *http.Request){
    
    
    null_or_not := rand.Intn(2)
    
    
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)

    return_string := `{ "Events": [`

    if null_or_not == 0{
        
        date_test := time.Now()
        for i:=0; i<4; i++ {               
            
            time_now := date_test.Format(time.RFC3339)
            
            
            return_string = return_string + ` {"Summary" : "Consulta Maria` + strconv.Itoa(i) + `", "Date": "` + time_now + `"}`   
            
            if i != 3{
                return_string = return_string + ","
            }
            date_test = date_test.Add(time.Minute * 60)
        }        
    }
    return_string = return_string + `]}`



    w.Write([]byte(return_string))
}

func TestJwt(w http.ResponseWriter, r *http.Request){    
    err := r.ParseForm()
    
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    tokenString := r.PostForm.Get("token")
    
    
        
        
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
    // Don't forget to validate the alg is what you expect:
    if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, errors.New("Unexpected signing method")
    }

    //return []byte("secret-key"), error
    return []byte("calendar") , nil
    })

    if err != nil{
        w.WriteHeader(http.StatusInternalServerError)
        return

    }
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        email :=  claims["email"].(string)
        
        w.WriteHeader(http.StatusOK)
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"Email" : "` + email + `"}`))
        return
        
    }else{
        w.WriteHeader(http.StatusInternalServerError)
        return
        
        
    }
}

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

func ChangeEvent(id_user string, etag_old string, date_old string, ics_old string, etag_new string, date_new string, ics_new string, db_Pointer *sql.DB) bool{
    
    update, err := db_Pointer.Prepare("UPDATE Users_cal SET ics=?, date_start=?, etag=? WHERE id_user=? AND ics=? AND etag=? AND date_start=?")
    if err != nil {
        return false
    }
    
    //execute
    res, err := update.Exec(ics_new, date_new, etag_new, id_user, ics_old, etag_old, date_old)
    if err != nil {
        return false
    }


    return true
}


func AddEvent(id_user string, etag string, date string, ics string, db_Pointer *sql.DB) bool{
    
    insert, err := db_Pointer.Prepare("INSERT INTO Users_cal(id_user, ics, date_start, etag) VALUES (?, ?, ?, ?);")
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
    
    insert, err := db_Pointer.Prepare("INSERT INTO Users(email, PersonName) VALUES (?, ?);")
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


func hasConflit(email string, date string, db_Pointer *sql.DB) bool{
    sqlStatement := "SELECT U.id_user FROM Users AS U JOIN Users_cal AS UC ON WHERE U.email = ? AND UC.date_start = ?;"


    result_row := db_Pointer.QueryRow(sqlStatement, email, date)
    var id string
    
    err := result_row.Scan(&id)
    if err != nil {
        return false
    }

    return true
    
}


func IsAvailable(w http.ResponseWriter, r *http.Request){
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
        date := r.PostForm.Get("date")
        
        
        conflit := hasConflit(email, date, db_Pointer)
        
        if conflit{
            w.WriteHeader(http.StatusBadRequest)
            return
        }
        
        w.WriteHeader(http.StatusOK)
        return
    }
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

        email, jwt_err :=  parseJWT_Token(r.PostForm.Get("token"))


        if strings.EqualFold(email, "") || jwt_err != nil{
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
        name_user := r.PostForm.Get("name_user")

        if strings.EqualFold(id_user_avail,"-1") {
            
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
            
            if strings.EqualFold(id_user_avail, "-1"){
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusInternalServerError)
                return
            }
        }

        
        //add entry to calendar  
        uuid, etag, err := req.Put_new_cal(id_user_avail, date, summary, "")
        if err != nil{
            
            
        }

        addedEv := AddEvent(id_user_avail, etag, date, uuid, db_Pointer)

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
        email, jwt_err :=  parseJWT_Token(r.PostForm.Get("token"))
        
        if strings.EqualFold(email,"") || jwt_err != nil{
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
        
        
        summary := r.PostForm.Get("summary")
        
        id_user, ics, etag_old := getEtag(email, old_date, db_Pointer)
        
        ics_new, etag_new, err_modify := req.Put_new_cal(id_user, date, summary, ics)
        
        changed_event := ChangeEvent(id_user, etag_old, init_date, ics, etag_new, new_date, ics_new, db_Pointer)
        
        
        if !changed_event {
             w.WriteHeader(http.StatusInternalServerError)
            return
        }
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
        email, jwt_err :=  parseJWT_Token(r.PostForm.Get("token"))

        if strings.EqualFold(email, "") || jwt_err != nil {
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
            if strings.EqualFold(date, ""){
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

           
            deleted := req.Delete_from_cal(id, ics, etag)


            if !deleted{
                w.WriteHeader(http.StatusInternalServerError)
                return

            }
            
            w.WriteHeader(http.StatusOK)
            return

            
            
        }
    }
}


func Get_entries(w http.ResponseWriter, r *http.Request){
    
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
        email, jwt_err :=  parseJWT_Token(r.PostForm.Get("token"))

        
        if strings.EqualFold(email, "") || jwt_err != nil {
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
            if strings.EqualFold(date, ""){
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
            
            json_string, err_report := req.Report_cal(id_user_avail, date)
            
            if err_report != nil{
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusBadRequest)
                return

            }
            
             w.WriteHeader(http.StatusOK)
            w.Header().Set("Content-Type", "application/json")
            w.Write([]byte(json_string))
            
            return
        
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
