package requests



import (
	"net/http"
	"fmt"
	"bytes"
	//"strconv"
	"errors"
	"encoding/base64"
	build "../build_req"
)

const (
	calendar_address = "http://192.168.1.97:5232/"
)

func Mk_cal(id_user_avail string) bool{

	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	var buf bytes.Buffer
    buf.WriteString(build.Build_MKCALENDAR())
    encodedStr := base64.StdEncoding.EncodeToString([]byte(id_user_avail + ":" + id_user_avail))
    fmt.Println(encodedStr)

	

    req, err := http.NewRequest("MKCOL", calendar_address + id_user_avail + "/calendar", &buf)
    req.Header.Add("Authorization", "Basic " + encodedStr)
    req.Header.Add("Content-Type", "application/x-www-form-urlencoded")


	if err != nil{
		return false
	}
	
	res, err := client.Do(req)
    if err != nil {
        fmt.Println(err)
        return false
	}
	
	_ = res

	return true
}

func Put_cal(id_user_avail string, date string, summary string) (string, string, error){

	uuid, reqBody := build.Build_PUT(date, summary)
	
	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	var buf bytes.Buffer
    buf.WriteString(reqBody)
    encodedStr := base64.StdEncoding.EncodeToString([]byte(id_user_avail + ":" + id_user_avail))
    fmt.Println(encodedStr)

	

    req, err := http.NewRequest("PUT", calendar_address + id_user_avail + "/calendar/" + uuid +".ics", &buf)
    req.Header.Add("Authorization", "Basic " + encodedStr)
    req.Header.Add("Content-Type", "application/x-www-form-urlencoded")


	if err != nil{
		fmt.Println(err)
        return "", "", errors.New("")
	}
	
	res, err := client.Do(req)
    if err != nil {
        fmt.Println(err)
        return "", "", errors.New("")
	}
	
	_ = res

	return uuid, "", nil
}

func Propfind_cal(){
	//req, err := http.NewRequest(calendar_address + id_user_avail + "/calendar","application/xml", bytes.NewBuffer([]byte(build.Build_MKCALENDAR(email))))
    
}

func Report_cal(id_user_avail string, ics string) (string, error){

	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	var buf bytes.Buffer
    buf.WriteString(build.Build_REPORT())
    encodedStr := base64.StdEncoding.EncodeToString([]byte(id_user_avail + ":" + id_user_avail))
	
	

	if ics != ""{
		req, err1 := http.NewRequest("REPORT",calendar_address + id_user_avail + "/calendar/" + ics + ".ics", &buf)
		_ = err1
		req.Header.Add("Authorization", "Basic " + encodedStr)
		req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
		res, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return "", errors.New("")
		}

		_ = res
	
	}else{
		req, err1 := http.NewRequest("REPORT",calendar_address + id_user_avail + "/calendar", &buf)
		_ = err1
		req.Header.Add("Authorization", "Basic " + encodedStr)
		req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
		res, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return "", errors.New("")
		}
    

		
		_ = res	
	}

	return "", nil

	
	
	
}


func Delete_from_cal(id_user_avail string, etag string, ics string) (string, error){
	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	req, err := http.NewRequest("DELETE",calendar_address + id_user_avail + "/calendar/" + ics + ".ics", nil)
	if err != nil{

	}
	req.Header.Add("If-Match", etag)
	resp, err := client.Do(req)
	
	if err != nil {
        fmt.Println(err)
        return "", errors.New("1")
	}
	
	_ = resp

	return "", nil
    
}