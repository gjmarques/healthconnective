package requests



import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
    "time"
    "errors"
    "regexp"
	"net/http"
	"bytes"
	"strconv"
	build "../build_req"
)

const (
	calendar_address = "http://192.168..:5232/"
)

func Mk_cal(id_user_avail int){

	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	var buf bytes.Buffer
    buf.WriteString(build.Build_MKCALENDAR())
    encodedStr := base64.StdEncoding.EncodeToString([]byte(strconv.Itoa(id_user_avail) + ":" + strconv.Itoa(id_user_avail)))
    fmt.Println(encodedStr)

	

    req, err := http.NewRequest(method, calendar_address + id_user_avail + "/calendar", &buf)
    req.Header.Add("Authorization", "Basic " + encodedStr)
    req.Header.Add("Content-Type", "application/x-www-form-urlencoded")


	if err != nil{

	}
	
	res, err = client.Do(req)
    if err != nil {
        fmt.Println(err)
        return
    }

}

func Put_cal(id_user_avail int, date string, summary string){

	uuid, reqBody := build.Build_PUT(date, summary)
	
	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	var buf bytes.Buffer
    buf.WriteString(reqBody)
    encodedStr := base64.StdEncoding.EncodeToString([]byte(strconv.Itoa(id_user_avail) + ":" + strconv.Itoa(id_user_avail)))
    fmt.Println(encodedStr)

	

    req, err := http.NewRequest(method, calendar_address + id_user_avail + "/calendar/" + uuid +".ics", &buf)
    req.Header.Add("Authorization", "Basic " + encodedStr)
    req.Header.Add("Content-Type", "application/x-www-form-urlencoded")


	if err != nil{

	}
	
	res, err = client.Do(req)
    if err != nil {
        fmt.Println(err)
        return
    }
}

func Propfind_cal(){
	req, err := http.NewRequest(calendar_address + id_user_avail + "/calendar","application/xml", bytes.NewBuffer([]byte(build.Build_MKCALENDAR(email))))
    
}

func Report_cal(id_user_avail int){
	req, err := http.NewRequest("REPORT",calendar_address + id_user_avail + "/calendar", bytes.NewBuffer([]byte(build.Build_REPORT())))
	if err != nil{

	}
	req.Header.Add("Content-Type", "application/xml")
	resp, err = req.Do(req)
}


func Delete_from_cal(id_user_avail int, etag string, ics string){
	req, err := http.NewRequest("DELETE",calendar_address + id_user_avail + "/calendar/" + ics + ".ics", nil)
	if err != nil{

	}
	req.Header.Add("If-Match", etag)
	resp, err = req.Do(req)
	

    
}