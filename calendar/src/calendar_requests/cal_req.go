package requests



import (
	"net/http"
	"fmt"
	"bytes"
	//"strconv"
	"errors"
	"encoding/base64"
    "container/list"
	build "../build_req"
)

const (
	calendar_address = "http://192.168.1.97:5232/"
)


type Multistatus struct {
    XMLName  xml.Name `xml:"multistatus"`
    Responses []Response `xml:"response"`
} 

type Response struct {
    Href     string `xml:"href"`
    PropS []PropStat `xml:"propstat"`
} 

type PropStat struct {
    PropE []Prop `xml:"prop"`
    Status string `xml:"status"`
}

type Prop struct {
    Getetag string `xml:"getetag"`
    CalendarData string `xml:"calendar-data"`
} 

type Events struct {
	Events []Event
}
type Event struct {
	Summary string
	Date string
}


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



func Put_new_cal(id_user_avail string, date string, summary string), ics string (string, string, error){

	if strings.EqualFold(ics,""){
		uuid, reqBody := build.Build_PUT(date, summary, "")
	}else{
		uuid, reqBody := build.Build_PUT(date, summary, ics)

	}
	
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
	if res.StatusCode == 201{
		etag := strings.Trim(res.Header["Etag"][0], "\"")
	}else{
		return "", "", errors.New("")	
	}

	return uuid, etag, nil
}

func Propfind_cal(){
	//req, err := http.NewRequest(calendar_address + id_user_avail + "/calendar","application/xml", bytes.NewBuffer([]byte(build.Build_MKCALENDAR(email))))
    
}

func Report_cal(id_user_avail string) (string, error){

	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	var buf bytes.Buffer
    buf.WriteString(build.Build_REPORT())
    encodedStr := base64.StdEncoding.EncodeToString([]byte(id_user_avail + ":" + id_user_avail))
	
	


	req, err1 := http.NewRequest("REPORT",calendar_address + id_user_avail + "/calendar", &buf)
	_ = err1
	req.Header.Add("Authorization", "Basic " + encodedStr)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return "", errors.New("")
	}


	var xml_data Multistatus

    body, _ = ioutil.ReadAll(res.Body)
    if err != nil {
        fmt.Println(err)
        return
    }
    //fmt.Println(string(body))
    
	var ev Events
    if err := xml.Unmarshal([]byte(body), &xml_data); err != nil {}
	
	for _, r := range xml_data.Responses {
		calData := strings.Split(r.PropS[0].PropE[0].CalendarData, "\n")


		date := strings.Split(calData[6],":")[1]
		summary := strings.Split(calData[8],":")[1]
		
		append(ev.Events, Event{summary, date})
		
	}   
	
	json_res, err := json.Marshal(ev) 

	if err != nil {
		return "", errors.New("")

	}

	return json_res, nil

	
	
	
}


func Delete_from_cal(id_user_avail string, etag string, ics string) bool{
	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	req, err := http.NewRequest("DELETE",calendar_address + id_user_avail + "/calendar/" + ics + ".ics", nil)
	if err != nil{
		return false
	}
	req.Header.Add("If-Match", etag)
	resp, err := client.Do(req)
	
	if err != nil {
        fmt.Println(err)
        return false
	}
	
	if resp.StatusCode != 200{
		return false
	}

	return true
    
}