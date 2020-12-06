package buildBody

import (
	"time"
    "strings"
    "log"
    "math/big"
	"crypto/rand"
	"fmt"
)

//content type application/xml
//charset=utf-8
var mkcalendar_content = `<create xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:I="http://apple.com/ns/ical/">
<set>
  <prop>
	<resourcetype>
	  <collection />
	  <C:calendar />
	</resourcetype>
	<C:supported-calendar-component-set>
	  <C:comp name="VEVENT" />
	</C:supported-calendar-component-set>
	<displayname>Calendar</displayname>
	<C:calendar-description>calendar</C:calendar-description>
	<I:calendar-color>#ff0000ff</I:calendar-color>
  </prop>
</set>
</create>`

// content type text/calendar
//charset=utf-8

//returns 201 code and etag
var put_content = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ES2020//CalDAV Client//EN
BEGIN:VEVENT
UID:%s
DTSTAMP:%s
DTSTART:%s
DTEND:%s
SUMMARY:%s
END:VEVENT
END:VCALENDAR
`

var report_content = `
<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
    <d:prop>
        <d:getetag />
        <c:calendar-data />
    </d:prop>
    <c:filter>
        <c:comp-filter name="VCALENDAR">
            <c:comp-filter name="VEVENT" />
        </c:comp-filter>
    </c:filter>
</c:calendar-query>`


func Build_REPORT() string{
	return report_content
}

func Build_PUT(date string, summary string, ics string) (string, string){
	
	var uuid string
	if strings.EqualFold(ics, ""){
		uuid = generate_uuid()
	}else{
		uuid = ics
	}


	time_n := time.Now()
	d_stamp := time_n.Format(time.RFC3339)
    d_stamp = strings.Replace(d_stamp, "-", "", -1)
    d_stamp = strings.Replace(d_stamp, ":", "", -1)
	
	ndate,err := time.Parse(time.RFC3339,date)
    
    if err != nil{
        log.Println(err)
    }
    
	
	ndate_end := ndate.Add(time.Minute * 30)

	date_start := ndate.Format(time.RFC3339)
	date_start = strings.Replace(date_start, "-", "", -1)
	date_start = strings.Replace(date_start, ":", "", -1)
	date_end := ndate_end.Format(time.RFC3339)
	date_end = strings.Replace(date_end, "-", "", -1)
	date_end = strings.Replace(date_end, ":", "", -1)



	reqBody := fmt.Sprintf(put_content, uuid, d_stamp,date_start, date_end, summary)

	log.Println(reqBody)


	return uuid, reqBody
}
func Build_MKCALENDAR() string{
	return mkcalendar_content
}



func generate_uuid() string{
	charset := "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 32)
	for i := range b {
        numb, err := rand.Int(rand.Reader, big.NewInt(32))
        _ = err
		b[i] = charset[numb.Int64()]
	}
	return string(b)
}