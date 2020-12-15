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
    "encoding/json"
    "log"
    "os"
    "io"
    "path/filepath"
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
        return  "", err

    }
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        email :=  claims["email"].(string)
        

        return email, nil
    } else {
        return "", err
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
    tokenString := r.Form.Get("token")
    
    
        
        
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

func TestICSFile(w http.ResponseWriter, r *http.Request){

    err := r.ParseForm()
    
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    ics := r.Form.Get("ics")

    log.Println(ics)
    
    path, path_err := filepath.Abs("")
    
    _ = path_err
    log.Println(path)
    file_path := path + "/src/cal_files/xvvv1.ics"

    log.Println(file_path)
	if _, err := os.Stat(file_path); os.IsNotExist(err) {
        log.Println("file does not exist")
        w.WriteHeader(http.StatusNotFound)
        return
        
    }

    //Check if file exists and open
	Openfile, err := os.Open(file_path)
	defer Openfile.Close() //Close after function return
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
    
    //Get the Content-Type of the file
	//Create a buffer to store the header of the file in
	FileHeader := make([]byte, 512)
	//Copy the headers into the FileHeader buffer
	Openfile.Read(FileHeader)
	//Get content type of file
	FileContentType := http.DetectContentType(FileHeader)

	//Get the file size
	FileStat, _ := Openfile.Stat()                     //Get info from file
	FileSize := strconv.FormatInt(FileStat.Size(), 10) //Get file size as a string

	//Send the headers
	w.Header().Set("Content-Disposition", "attachment; filename="+ics + ".ics")
	w.Header().Set("Content-Type", FileContentType)
	w.Header().Set("Content-Length", FileSize)

	//Send the file
	//We read 512 bytes from the file already, so we reset the offset back to 0
	Openfile.Seek(0, 0)
	io.Copy(w, Openfile) //'Copy' the file to the client
	return
    

}

func IsQueryTermOK(term string) bool{
    if regexerr != nil{
        return false
    }else{
        var isOK = re.MatchString(term)
        
        if isOK{
            return false
        }else{
            return true
        }
    }

}


func Transform_date(date string) (string, error) {


    date_form,err := time.Parse(time.RFC3339,date)

    if err != nil{
        log.Println(err)
        return "", nil
    }

    new_date := date_form.Format(time.RFC3339)    
    new_date = strings.Replace(new_date, "-", "", -1)
    new_date = strings.Replace(new_date, ":", "", -1)

    return new_date, nil
}



func ChangeEvent(id_user string, etag_old string, date_old string, ics_old string, etag_new string, date_new string, ics_new string, db_Pointer *sql.DB) bool{
    
    update, err := db_Pointer.Prepare("UPDATE Users_cal SET ics=?, date_start=?, etag=? WHERE id_user=? AND ics=? AND etag=? AND date_start=?")
    if err != nil {
        log.Println(err)
        return false
    }
    
    //execute
    _ , err_exec := update.Exec(ics_new, date_new, etag_new, id_user, ics_old, etag_old, date_old)
    if err_exec != nil {
        log.Println(err_exec)
        return false
    }


    return true
}


func AddEvent(id_user string, etag string, date string, ics string, db_Pointer *sql.DB) bool{
    

    insert, err := db_Pointer.Prepare("INSERT INTO Users_cal(id_user, ics, date_start, etag) VALUES (?, ?, ?, ?);")
    if err != nil {
        log.Println(err.Error())
        return false
    }
    
    //execute
    res, err := insert.Exec( id_user, ics, date, etag)
    _ = res
    if err != nil {
        log.Println(err.Error())
        return false
    }


    return true
}



func DelEvent(id_user string , etag string , ics string, db_Pointer *sql.DB) bool{
    
    del, err := db_Pointer.Prepare("DELETE FROM Users_cal WHERE id_user=? AND etag=? AND ics=?;")
    if err != nil {
        log.Println(err)
        return false
    }
    
    //execute
    res, err := del.Exec(id_user,etag,ics)
    _ = res
    if err != nil {
        log.Println(err)
        return false
    }


    return true
}

func AddUser(email string,  db_Pointer *sql.DB) bool{
    
    insert, err := db_Pointer.Prepare("INSERT INTO Users(email) SELECT * FROM (SELECT '" + email+ "') AS tmp WHERE NOT EXISTS (SELECT email FROM Users WHERE email = '" + email +"') LIMIT 1;")
    if err != nil {
        log.Println(err)
        return false
    }
    
    //execute
    res, err := insert.Exec()
    _ = res
    if err != nil {
        log.Println(err)
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
        log.Println(err)
        return "", "", ""
    }

    return id, ics, etag
}



func isUserinDatabase(email string, db_Pointer *sql.DB) string{
    sqlStatement := "SELECT id_user FROM Users WHERE email = ? ;"


    result_row := db_Pointer.QueryRow(sqlStatement, email)
    var id string
    err := result_row.Scan(&id)
    if err != nil {
        log.Println(err)
        return "-1"
    }

    return id
}


func hasConflit(email string, date string, db_Pointer *sql.DB) bool{
    sqlStatement := "SELECT U.id_user FROM Users AS U JOIN Users_cal AS UC ON U.id_user = UC.id_user WHERE U.email = ? AND UC.date_start = ?;"


    result_row := db_Pointer.QueryRow(sqlStatement, email, date)
    var id string
    
    err := result_row.Scan(&id)
    if err != nil {
        log.Println(err)
        return false
    }

    return true
    
}



func hasConflitAll(date string, db_Pointer *sql.DB) []string{
    sqlStatement := "SELECT id_user, email FROM Users  WHERE id_user NOT IN (SELECT id_user FROM Users_cal WHERE date_start = '" + date +"' );"

    log.Println(date)
    result_row, err_sql := db_Pointer.Query(sqlStatement)
    _ = err_sql
    emails := make([]string, 0)
    var email string
    var id string

    for result_row.Next(){
        err := result_row.Scan(&id, &email)
        if err != nil {
            log.Println(err)
            return emails
        }

        emails = append(emails, email)

        log.Println(id + "  " + email)
    }
    
    

    return emails
    
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
        
        date := r.Form.Get("date")
        
        
        not_conflit := hasConflitAll(date, db_Pointer)
        
        json_emails, err_json := json.Marshal(not_conflit)

        _ = err_json
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(string(json_emails)))
        return
    }
}

func AddUserInfo(w http.ResponseWriter, r *http.Request) bool{
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusInternalServerError)
        w.Write([]byte(`{"error": ` + err.Error()    +`}`))
        return false
    }else{
        err := r.ParseForm()

        if err != nil {
            w.WriteHeader(http.StatusBadRequest)
            CloseConnectionDB(db_Pointer)
            w.Write([]byte(`{"error": ` + err.Error()    +`}`))
        
            return false
        }

        email, jwt_err :=  parseJWT_Token(r.Form.Get("token"))
        

        if jwt_err != nil {
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusBadRequest)
            log.Println("token error")
            return false

        }

        added := AddUser(email, db_Pointer)

        if !added{
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusBadRequest)
            log.Println("not added")
            return false
           
        }
        id_user_avail := isUserinDatabase(email, db_Pointer)
            
        if strings.EqualFold(id_user_avail, "-1"){
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusInternalServerError)
            log.Println("AddEntry - User not added to DB")
            return false
        }
        addedCal := req.Mk_cal(id_user_avail) 
            
        if !addedCal{
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusInternalServerError)
            log.Println("AddEntry - Cannor create calendar")
            return false
        


        }

        CloseConnectionDB(db_Pointer)    
        w.WriteHeader(http.StatusOK)
            
        return true
    }

}


func Get_ics(w http.ResponseWriter, r *http.Request){

    err := r.ParseForm()
    
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }
    ics := r.Form.Get("ics")

    log.Println(ics)
    
    path, path_err := filepath.Abs("")
    
    _ = path_err
    log.Println(path)
    file_path := path + "/src/cal_files/" +ics + ".ics"

    log.Println(file_path)
	if _, err := os.Stat(file_path); os.IsNotExist(err) {
        log.Println("file does not exist")
        w.WriteHeader(http.StatusNotFound)
        return
        
    }

    //Check if file exists and open
	Openfile, err := os.Open(file_path)
	defer Openfile.Close() //Close after function return
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
    
    //Get the Content-Type of the file
	//Create a buffer to store the header of the file in
	FileHeader := make([]byte, 512)
	//Copy the headers into the FileHeader buffer
	Openfile.Read(FileHeader)
	//Get content type of file
	FileContentType := http.DetectContentType(FileHeader)

	//Get the file size
	FileStat, _ := Openfile.Stat()                     //Get info from file
	FileSize := strconv.FormatInt(FileStat.Size(), 10) //Get file size as a string

	//Send the headers
	w.Header().Set("Content-Disposition", "attachment; filename="+ics + ".ics")
	w.Header().Set("Content-Type", FileContentType)
	w.Header().Set("Content-Length", FileSize)

	//Send the file
	//We read 512 bytes from the file already, so we reset the offset back to 0
	Openfile.Seek(0, 0)
	io.Copy(w, Openfile) //'Copy' the file to the client
	return
    

}
func AddEntry(w http.ResponseWriter, r *http.Request) bool{
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusInternalServerError)
        w.Write([]byte(`{"error": ` + err.Error()    +`}`))
        return false
    }else{
        err := r.ParseForm()

        
        if err != nil {
            w.WriteHeader(http.StatusBadRequest)
            CloseConnectionDB(db_Pointer)
            w.Write([]byte(`{"error": ` + err.Error()    +`}`))
            log.Println(err)
            return false
        }

        email, jwt_err :=  parseJWT_Token(r.Form.Get("token"))


        if strings.EqualFold(email, "") || jwt_err != nil{
            log.Println(jwt_err)
            w.WriteHeader(http.StatusBadRequest)
            CloseConnectionDB(db_Pointer)
            w.Write([]byte(`{"error": ` + jwt_err.Error()    +`}`))
        
            return false
        }else{
            if !IsQueryTermOK(email){
                log.Println("inj")
                w.WriteHeader(http.StatusBadRequest)
                CloseConnectionDB(db_Pointer)
                w.Write([]byte(`{"error": sql injection refused }`))
        
                return false
            }
        }
        
        
        
        id_user_avail := isUserinDatabase(email, db_Pointer)
        summary := r.Form.Get("summary")
        date := r.Form.Get("date")
        
        if strings.EqualFold(id_user_avail,"-1") {
            

            log.Println("Add entry - user with email " + email + " not present in the database")
            //create user first
            added := AddUser(email, db_Pointer)
            
            if !added{

                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusInternalServerError)
                log.Println("AddEntry - User not added to DB")
                return false
            }

            id_user_avail = isUserinDatabase(email, db_Pointer)
            
            if strings.EqualFold(id_user_avail, "-1"){
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusInternalServerError)
                log.Println("AddEntry - User not added to DB")
                return false
            }


            addedCal := req.Mk_cal(id_user_avail) 
            
            if !addedCal{
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusInternalServerError)
                log.Println("AddEntry - Cannor create calendar")
                return false
            


            }
        }

        conflit := hasConflit(email, date, db_Pointer)
        
        if conflit{
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusConflict)
            log.Println("AddEntry - Conflict in dates")
            return false
            

        }

        //add entry to calendar  
        uuid, etag, err_put := req.Put_new_cal(id_user_avail, date, summary, "")
        if err_put != nil{
            log.Println(err_put)
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusInternalServerError)
            log.Println("AddEntry - Event not added to calendar server")
            return false
            
        }

        addedEv := AddEvent(id_user_avail, etag, date, uuid, db_Pointer)

        CloseConnectionDB(db_Pointer)
        
        if !addedEv{
            w.WriteHeader(http.StatusInternalServerError)

            log.Println("AddEntry - Event not added to DB")
            return false
        }

        w.WriteHeader(http.StatusOK)
        return true

    }
}


func ModifyEntry(w http.ResponseWriter, r *http.Request){
    db_Pointer, err := OpenConnectionDB()

    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        log.Println(err)
        return
    }else{
        err_form := r.ParseForm()
        if err_form != nil {
            log.Println(err_form)
            w.WriteHeader(http.StatusBadRequest)
        }
        email, jwt_err :=  parseJWT_Token(r.Form.Get("token"))
        
        if strings.EqualFold(email,"") || jwt_err != nil{
            log.Println(jwt_err)
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
        if strings.EqualFold(id_user_avail, "-1"){

            w.WriteHeader(http.StatusForbidden)
            CloseConnectionDB(db_Pointer)
            return

        }
        init_date := r.Form.Get("old_date")
        init_date_form,err_parse := time.Parse(time.RFC3339,init_date)


        log.Println(err_parse)
        old_date := init_date_form.Format(time.RFC3339)    
        old_date = strings.Replace(old_date, "-", "", -1)
        old_date = strings.Replace(old_date, ":", "", -1)

        new_date := r.Form.Get("new_date")
       

        summary := r.Form.Get("summary")
        
        id_user, ics, etag_old := getEtag(email, init_date, db_Pointer)
        

        //log.Printf("%s %s %s", id_user, ics, etag_old)

        ics_new, etag_new, err_modify := req.Put_new_cal(id_user, new_date, summary, ics)
        


        //log.Printf("%s %s ", ics_new, etag_new)

        changed_event := ChangeEvent(id_user, etag_old, init_date, ics, etag_new, new_date, ics_new, db_Pointer)
        
        
        if !changed_event || err_modify != nil {

            log.Println(err_modify)
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
        log.Println(err)
        CloseConnectionDB(db_Pointer)
        w.WriteHeader(http.StatusInternalServerError)
    }else{
        err_form := r.ParseForm()
        if err_form != nil {
            log.Println(err_form)
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusBadRequest)
        }
        email, jwt_err :=  parseJWT_Token(r.Form.Get("token"))

        if strings.EqualFold(email, "") || jwt_err != nil {
            log.Println(jwt_err)
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
        if strings.EqualFold(id_user_avail,"-1") {
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusForbidden)
            return   
        }else{
            //get date to delete
            date := r.Form.Get("date")
            if strings.EqualFold(date, ""){
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusBadRequest)
                return
            }
            ndate,err_parse := time.Parse(time.RFC3339,date)

            if err_parse != nil{
                log.Println(err_parse)
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusBadRequest)
                return

            }
            
            date_event := ndate.Format(time.RFC3339)
	        date_event = strings.Replace(date_event, "-", "", -1)
	        date_event = strings.Replace(date_event, ":", "", -1)
	
            id, ics, etag := getEtag(email, date, db_Pointer)

            log.Printf("%s %s %s", id, ics, etag)
           
            deleted := req.Delete_from_cal(id, etag, ics)

            
            if !deleted{
                CloseConnectionDB(db_Pointer)
            
                w.WriteHeader(http.StatusInternalServerError)
                return

            }

            del := DelEvent(id, etag, ics, db_Pointer)
            CloseConnectionDB(db_Pointer)
            
            if !del{
            
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
        log.Println(err)
        CloseConnectionDB(db_Pointer)
        w.WriteHeader(http.StatusInternalServerError)
    }else{
        err_form := r.ParseForm()
        if err_form != nil {
            log.Println(err_form)
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusBadRequest)
        }
        email, jwt_err :=  parseJWT_Token(r.Form.Get("token"))

        
        if strings.EqualFold(email, "") || jwt_err != nil {
            log.Println(jwt_err)
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
        if strings.EqualFold(id_user_avail,"-1") {
            CloseConnectionDB(db_Pointer)
            w.WriteHeader(http.StatusForbidden)
            return   
        }else{
            //get date
            date := r.Form.Get("date")
            if strings.EqualFold(date, ""){
                CloseConnectionDB(db_Pointer)
                w.WriteHeader(http.StatusBadRequest)
                return
            }
            CloseConnectionDB(db_Pointer)
            transformed_date := strings.Replace(date, "-", "", -1)
            

           
            json_string, err_report := req.Report_cal(id_user_avail, transformed_date)
            
            if err_report != nil{
                log.Println(err_report)
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
    db.SetMaxOpenConns(100)
    db.SetMaxIdleConns(100)

    err = db.Ping()
    if err != nil {
        return nil,err
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
