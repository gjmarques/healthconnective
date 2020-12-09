package requests



import (
	"net/http"
	"fmt"
	"bytes"
	//"strconv"
	"errors"
	"log"
	"encoding/base64"
	"encoding/xml"
	"strings"
	"io/ioutil"
	"encoding/json"
	"sort"
    //"container/list"
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
    
	

    req, err := http.NewRequest("MKCOL", calendar_address + id_user_avail + "/calendar", &buf)
    req.Header.Add("Authorization", "Basic " + encodedStr)
    req.Header.Add("Content-Type", "application/x-www-form-urlencoded")


	if err != nil{
		return false
	}
	
	res, err := client.Do(req)
    if err != nil {
        log.Println(err)
        return false
	}
	
	if res.StatusCode != 201{
		return false
	}

	return true
}



func Put_new_cal(id_user_avail string, date string, summary string, ics string) (string, string, error){

	//log.Printf("%s %s %s %s", id_user_avail, date, summary, ics)

	var uuid, reqBody string
	if strings.EqualFold(ics,""){
		uuid, reqBody = build.Build_PUT(date, summary, "")
	}else{
		uuid, reqBody = build.Build_PUT(date, summary, ics)

	}
	



	
	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	var buf bytes.Buffer
    buf.WriteString(reqBody)
    encodedStr := base64.StdEncoding.EncodeToString([]byte(id_user_avail + ":" + id_user_avail))
    
	

    req, err := http.NewRequest("PUT", calendar_address + id_user_avail + "/calendar/" + uuid +".ics", &buf)
    req.Header.Add("Authorization", "Basic " + encodedStr)
    req.Header.Add("Content-Type", "application/x-www-form-urlencoded")


	if err != nil{
		log.Println(err)
        return "", "", errors.New("")
	}
	
	var etag string
	res, err := client.Do(req)
    if err != nil {
        log.Println(err)
        return "", "", errors.New("")
	}
	if res.StatusCode == 201{
		etag = strings.Trim(res.Header["Etag"][0], "\"")
	}else{
		return "", "", errors.New("")	
	}

	return uuid, etag, nil
}

/*
func Report_cal_free_busy(id_user_avail string, date string) (bool, error){
	client := &http.Client {
        Transport: &http.Transport{
            DisableCompression: true,
        },
	}
	
	var buf bytes.Buffer
    buf.WriteString(build.Build_FreeBusy(date))
    encodedStr := base64.StdEncoding.EncodeToString([]byte(id_user_avail + ":" + id_user_avail))
	
	


	req, err1 := http.NewRequest("REPORT",calendar_address + id_user_avail + "/calendar", &buf)
	_ = err1
	req.Header.Add("Authorization", "Basic " + encodedStr)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return false, errors.New("")
	}

	body, err := ioutil.ReadAll(res.Body)
    if err != nil {
        fmt.Println(err)
        return false, err
    }
	log.Println(string(body))

	var xml_data Multistatus

    if err := xml.Unmarshal([]byte(body), &xml_data); err != nil {}
	


	if xml_data.Responses != nil{
		return true, nil
	}	

	return true, nil
}

*/

func Report_cal(id_user_avail string, date string) (string, error){

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

    body, _ := ioutil.ReadAll(res.Body)
    if err != nil {
        log.Println(err)
        return "", errors.New("")
    }
    //fmt.Println(string(body))
	
	var ev Events
    if err := xml.Unmarshal([]byte(body), &xml_data); err != nil {}
	

	for _, r := range xml_data.Responses {
		calData := strings.Split(r.PropS[0].PropE[0].CalendarData, "\n")


		date_ev := strings.Split(calData[5],":")[1]
		summary := strings.Split(calData[8],":")[1]
		if strings.EqualFold(strings.Split(date_ev, "T")[0], date) {
			ev.Events = append(ev.Events, Event{summary, get_date_back(date_ev)})
		}
	}   

	if ev.Events == nil{
		ev.Events = make([]Event, 0)
	}else{
		sort.SliceStable(ev.Events, func(i, j int) bool {
			return ev.Events[i].Date < ev.Events[j].Date
		})

	}



	json_res, err := json.Marshal(ev) 

	if err != nil {
		log.Println(err)
		return "", errors.New("")

	}

	return string(json_res), nil

	
	
	
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
	
	resp, err := client.Do(req)
	
	if err != nil {
        log.Println(err)
        return false
	}
	
	if resp.StatusCode != 200{
		log.Println(resp)
		return false
	}

	return true
    
}


func get_date_back(date string) string{
	return date[0:4] + "-" + date[4:6] + "-" + date[6:11]  + ":" + date[11:13] + ":" + date[13:16]
}