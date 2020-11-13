package buildBody

import(
	"math/rand"
	"time"
)

//content type application/xml
//charset=utf-8
mkcalendar_content := `<?xml version="1.0" encoding="utf-8" ?>
<C:mkcalendar xmlns:D="DAV:"
			  xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:set>
	<D:prop>
	  <D:displayname> %s Events</D:displayname>
	  <C:calendar-description xml:lang="en"
>Calendar restricted to events.</C:calendar-description>
	  <C:supported-calendar-component-set>
		<C:comp name="VEVENT"/>
	  </C:supported-calendar-component-set>
	  <C:calendar-timezone><![CDATA[BEGIN:VCALENDAR
PRODID:-//ES2020//CalDAV Client//EN
VERSION:2.0
BEGIN:VTIMEZONE
TZID:WET
LAST-MODIFIED:%s
BEGIN:STANDARD
DTSTART:19671029T020000
RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:Western European Time
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19870405T020000
RRULE:FREQ=YEARLY;BYDAY=1SU;BYMONTH=4
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:Western Daylight Time
END:DAYLIGHT
END:VTIMEZONE
END:VCALENDAR
]]></C:calendar-timezone>
	</D:prop>
  </D:set>
</C:mkcalendar>`


// content type text/calendar
//charset=utf-8

//returns 201 code and etag
put_content := `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ES2020//CalDAV Client//EN
BEGIN:VEVENT
UID: %s
DTSTAMP:%s
DTSTART:%s
DTEND: %s
SUMMARY: %s
END:VEVENT
END:VCALENDAR
`

report_content := `
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


func build_PROPFIND(){}



func build_REPORT(){
	return report_content
}

func build_PUT(date string, summary string){

	uuid := generate_uuid()
	time_n := time.Now()
	d_stamp = time_n.Format(time.RFC3339)
    d_stamp = strings.Replace(d_stamp, "-", "", -1)
    d_stamp = strings.Replace(d_stamp, ":", "", -1)
	
	ndate,err := time.Parse(time.RFC3339,date)
    
    if err != nil{
        fmt.Println(err)
    }
    
	
	ndate_end := ndate.Add(time.Minute * 30)

	date_start := ndate.Format(time.RFC3339)
	date_start = strings.Replace(date_start, "-", "", -1)
	date_start = strings.Replace(date_start, ":", "", -1)
	date_end := ndate_end.Format(time.RFC3339)
	date_end = strings.Replace(date_end, "-", "", -1)
	date_end = strings.Replace(date_end, ":", "", -1)

	return fmt.Sprintf(put_content, uuid, d_stamp,date_start, date_end, summary)

}
func build_MKCALENDAR(email string){
	time_now := time.Now().Format(time.RFC3339)
    formatted_time := strings.Replace(time_now, "-", "", -1)
    formatted_time = strings.Replace(new_date, ":", "", -1)
	return fmt.Sprintf(mkcalendar_content, email, formatted_time)
}



func generate_uuid(){
	charset = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, 20)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}