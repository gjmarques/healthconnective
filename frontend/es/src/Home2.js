import React from 'react';
import { Cookies } from 'react-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import Clock from 'react-live-clock';
import Popup from 'reactjs-popup';
import configRest from './config.json';


class Home2 extends React.Component {
     
    constructor(props) {
      
        super(props);
        this.state ={
          name : "",
          loading : true,
          foto : "",
          
          selectedDate : "",
          LoadingNew : true,
          events: [],
          evsent:[],
          hora: 9,


          valid_data: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
      }
      componentDidMount(){

        const script = document.createElement('script');
        const script2 = document.createElement('script');
        const script3 = document.createElement('script');



        script.src = "lib/common-scripts.js";
        script.async = true;
        document.body.appendChild(script);


        script2.src = "lib/fullcalendar/fullcalendar.min.js";
        script2.async = true;
        document.body.appendChild(script2);
        

        script3.src = "lib/calendar-conf-events.js";
        script3.async = true;
        document.body.appendChild(script3);


   
        script3.src = "lib/jquery/jquery.min.js";
        script3.async = true;
        document.body.appendChild(script3);



        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        if(newDate.getDate()<10){
          date = "0" + newDate.getDate() 
        }else{
          date = newDate.getDate() 
        }
        if(newDate.getMonth() + 1 <10){
          month = "0" + (newDate.getMonth() +1 )
        }else{
          month =  (newDate.getMonth() +1 )
        }
        this.setState({selectedDate: year + "-" + month  + "-"  +date });

        const cookies = new Cookies();

        if(cookies.get('valid')!=1){
          window.location.href='./login';
        }else{
          var dd = []
          fetch(configRest.autenticacao + '/getConsultas?e='+ cookies.get('email'))
          .then(response => response.json())
          .then(data => {
            if(data.valid === 1){
              this.setState({ events :  data.result })
            }
            
          })
          .then( s => {
            
            this.state.events.map((data) =>{
              if(this.state.selectedDate ===  data.date.split("T")[0]){
                dd.push(data)
              }
            }
            )
            this.setState({LoadingNew : false,loading:false , name:cookies.get('name'), foto:cookies.get('foto')});
          })
          .then((d23)=> this.setState({evsent : dd}))
        }
      }
     async handleChange(event) {   

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        let vv = true;


        var dia = "";
        var mes = "";
        if(event.getDate()<10){
          dia = "0" + event.getDate() 
        }else{
          dia = event.getDate() 
        }
        if(event.getMonth() + 1 <10){
          mes = "0" + (event.getMonth() +1 )
        }else{
          mes =  (event.getMonth() +1 )
        }

        
        if(year<event.getFullYear()){
          vv  = false;
        }else if(year==event.getFullYear() && event.getMonth() +1<month){
          vv  = false;
        }else if(year==event.getFullYear() && event.getMonth() +1==month && event.getDate()<date+2){
          vv  = false;
        }
        
        this.setState({valid_data:vv,LoadingNew: true, evsent :  [], selectedDate: event.getFullYear() + "-" + mes  + "-"  + dia})

        var dd = []
        this.state.events.map((data) =>{
          if( event.getFullYear() + "-" + mes  + "-"  + dia ===  data.date.split("T")[0]){
            dd.push(data)
          }
        })
        this.setState({LoadingNew: false, evsent : dd})    
      }

      handleChange2(event) {   
        var h = this.state.hora;
        if(h === 17){
            this.setState({hora : 9});
        }else{
            h = h+1;
            this.setState({hora : h});
        }
      }

      handleChange3(event) {   
        var h = this.state.hora;
        if(h ===9){
            this.setState({hora : 17});
        }else{
            h = h-1;
            this.setState({hora : h});
        }
      }

      handleChange4(event) {   
        if( this.state.hora<10){
          window.location.href='./med?data=' + this.state.selectedDate + "T0" + this.state.hora + ":00:00Z";
        }else{
          window.location.href='./med?data=' + this.state.selectedDate + "T" + this.state.hora + ":00:00Z";
        }
      }
      
      Logout = e => {
        const cookies = new Cookies();
        cookies.remove('name');
        cookies.remove('foto');
        cookies.remove('email');
        cookies.remove('valid');
        cookies.remove('nUtente');
        cookies.remove('med');
        window.location.href='./';
      }

    render() {
        const cookies = new Cookies();
        if(this.state.loading){
            return(<a>Loading.....</a>);
        }else{
            return (
                <div>
                     
                    <header class="header black-bg">
                      <div class="sidebar-toggle-box">
                        <div class="fa fa-bars tooltips" data-placement="right" data-original-title="Toggle Navigation" style={{color:"white"}}></div>
                      </div>
                      <a href="/" class="logo"><b>Health<span>Connect</span></b></a>
                      <div class="top-menu">
                        <ul class="nav pull-right top-menu">
                          <li><a class="logout" onClick={this.Logout}>Logout</a></li>
                        </ul>
                        <ul class="nav pull-right top-menu">
                          <li><a class="logout" style={{backgroundColor:'#99ccff'}} href="/profile"> <i class="fa fa-user"></i>  Profile</a></li>
                        </ul>
                      </div>
                    </header>
                      <aside>
                    <div id="sidebar" class="nav-collapse ">
               
                        <ul class="sidebar-menu" id="nav-accordion">
                          <div style={{color:"white", textAlign:"center"}}>
                            <h3 style={{color:"white", alignContent:"center"}}>
                              <Clock format="HH:mm" interval={1000} ticking={true}  />
                            </h3> 
                            <br></br>
                          </div>
                      
                        <p class="centered"><a href="profile.html"><img src={this.state.foto} class="img-circle" width="80"/></a><div></div></p>
                        <h5 class="centered">{this.state.name}</h5>
                        <li class="mt">
                              <a   class="active dcjq-parent" href="/">
                              <i class="fa fa-calendar-o"></i>
                              <span>Home</span>
                              </a>
                          </li>
                        
                          <li class="mt">
                              <a  href="/Farm">
                              <i class="fa fa-map-marker"></i>
                              <span>Nearby</span>
                              </a>
                          </li>

                          <li class="mt">
                              <a href="/Receitas">
                              <i class="fa fa-medkit"></i>
                              <span>Prescriptions</span>
                              </a>
                          </li>

                     
                        <li class="mt">
                           <br/>
                           <br/>
                        </li>
                             
                        </ul>

                    </div>
                    </aside>    

           
            <section id="main-content">
              <section class="wrapper">
                <h3><i class="fa fa-angle-right"></i> Calendar</h3>

                <div class="row mt">
  
                  <aside class="col-lg-12 mt">
                    <section class="panel " >
                      <div class="panel-body">
                      <div class="col-md-12">
                        <div class="content-panel" style={{backgroundColor:"#f2f2f214" , boxShadow:"1px 4px 4px 3px #aab2bd"}}>
                        <Calendar
                          onChange={
                              this.handleChange
                            }

                            tileClassName={({ date, view }) => {
                              var g = 'lowlight'
                              var dia = "";
                              var mes = "";
                              if(date.getDate()<10){
                                dia = "0" + date.getDate() 
                              }else{
                                dia = date.getDate() 
                              }
                              if(date.getMonth() + 1 <10){
                                mes = "0" + (date.getMonth() +1 )
                              }else{
                                mes =  (date.getMonth() +1 )
                              }

                              var d = date.getFullYear()+ "-" + mes + "-" + dia
                              this.state.events.map((data) => {
                                if(d=== data.date.split("T")[0]){
                                  g = 'highlight'
                                }
                              })
                              
                              return  g
                          
                            }}
                        />
                      </div>
                      </div>
                      </div>

                      <br></br>
                      <div class="panel-body">
                      {this.state.LoadingNew ?
                          <h5>Loading.....</h5>
                          :
                        this.state.evsent.length === 0 ?

      
                          <div class="col-md-12">
                            <h3>No medical appointments</h3>
                            { this.state.valid_data? 
                 
                              <Popup
                                  trigger={ <button><font style={{fontSize : "30pt"}}>Add Appointment</font></button>}
                                  modal 
                                >
                                    <div className="col-md-12" style={{width:"1000px",backgroundColor:"#d1f4ff"}}>
                                      <div className="row" style={{marginTop:"55px", marginBottom:"55px", marginLeft:"100px"}}>
                                          <div className="col-md-2" style={{marginLeft:"40px"}}>
                                            <h3><b>Hora</b></h3>
                                          </div>
                                          <div  className="col-md-1">
                                          <button style={{backgroundColor:"#2F323A"}} onClick={this.handleChange2}><font style={{fontSize : "30pt"}}><i className="fa fa-plus-square-o" style={{color:"white"}}></i></font></button>
                                          </div>
                                          <div  className="col-md-1">
                                          {this.state.hora < 10 ?
                                                <h3><b>0{this.state.hora}:00 </b></h3>
                                                :
                                                <h3><b> {this.state.hora}:00 </b></h3>
                                          } 
                                          </div> 
                                          <div  className="col-md-1" >
                                          <button  style={{marginLeft:"25px", backgroundColor:"#2F323A"}} onClick={this.handleChange3}><font style={{fontSize : "30pt"}}><i className="fa fa-minus-square-o" style={{color:"white"}}></i></font></button>
                                          </div>
                                        <div  className="col-md-2">
                                          <button style={{marginLeft:"45px",backgroundColor:"#2F323A"}} onClick={this.handleChange4}><font style={{fontSize : "30pt", color:"white"}}>Pesquisar</font></button>
                                        </div>
                                      </div>
                                    </div>
                                </Popup>
                            :
                            <div>
                                <h4>Medical appointments must be scheduled 2 days in advance</h4>
                            </div>
                          }
                          </div>
                          : 
                          <div class="col-md-12">
                          <div class="content-panel" style={{backgroundColor:"#f2f2f214" , boxShadow:"1px 4px 4px 3px #aab2bd"}}>
                            <h1><i class="fa fa-angle-right" style={{marginLeft:"10px"}}></i>  &nbsp;&nbsp; {this.state.selectedDate}</h1>
                            <hr/>
                            <table class="table">
                              <thead>
                                <tr>
                                  <th><font style={{fontSize : "30pt"}}>Hora</font></th>
                                  <th><font style={{fontSize : "30pt"}}>Email</font></th>
                                  <th><font style={{fontSize : "30pt"}}>Download</font></th>
                                  <th><font style={{fontSize : "30pt"}}>Call</font></th>
                                  <th><font style={{fontSize : "30pt"}}>Cancel</font></th>
                                  
                                </tr>
                              </thead>
                              <tbody>
                              {this.state.evsent.map((data) => 
                                   <tr>
                                   <td style={{ width:"180px"}}><font style={{fontSize : "30pt"}}>{data.date.split('T')[1].split(':')[0]}:00</font></td>
                                    <td><font style={{fontSize : "30pt"}}>{data.medico}</font></td>
                                    <td style={{textAlign:"center", width:"240px"}}> <button   style={{width:"80px"}} class="btn btn-primary" onClick={() => window.location.href=configRest.Calendar + "/ics?ics=" + data.downloadid}><font style={{fontSize : "20pt"}}><i class="fa fa-download"></i></font></button> </td>
                                    <td style={{textAlign:"center", width:"110px"}}> <button   style={{width:"80px"}} class="btn btn-success" onClick={() => window.open("https://dccef509b668.ngrok.io/chat.html?id=" + data.medico + "-" + data.date.split('T')[1].split(':')[0] + ":00", "popup",'width=1000,height=700,scrollbars=no,resizable=no')}><font style={{fontSize : "20pt"}}><i class="fa fa-phone"></i></font></button> </td>
                                    
                                    <td style={{textAlign:"center", width:"150px"}}>
                                    <Popup
                                          trigger={ <button  style={{width:"80px"}} class="btn btn-danger"><font style={{fontSize : "20pt"}}><i class="fa fa-trash-o"></i></font></button>}
                                          modal
                                        >
                                            <div className="col-md-12" style={{width:"1000px",backgroundColor:"#d1f4ff"}}> 
                                                 <div className="row">
                                                 <div className="col-md-9" style={{marginLeft:"10px"}}>
                                                      <br></br>
                                                      <br></br>
                                                     </div>
                                                     <div className="col-md-6" style={{marginLeft:"40px"}}>
                                                 <h3>Are you sure you want to cancel this appointment with {data.medico}?</h3>
                                                     </div>
                                                     <div  className="col-md-2">
                                                     <button style={{backgroundColor:"#30c830ba"}} onClick={() => {
                                                        fetch(configRest.autenticacao + '/jwt?e='+ data.medico )
                                                        .then(response => response.json())
                                                        .then(data1 => {
                                                          fetch(configRest.Calendar + '/delete?token='+ data1.token + "&date=" + data.date)
                                                          .then(response => {
                                                            console.log(response)
                                                            if(response.status === 200 || response.status === 500){
                                                              fetch(configRest.autenticacao + '/remConsulta?e='+ data.email + "&d=" + data.date )
                                                              .then(response => response.json())
                                                             .then(data => window.location.href="./")
                                                            }else{
                                                              window.location.href="./"
                                                            }
                                                          })
                                                        })
                                                        }}><font style={{fontSize : "30pt"}}>Cancelar</font></button>
                                                     </div>
                                                     <div className="col-md-9" style={{marginLeft:"10px"}}>
                                                      <br></br>
                                                      <br></br>
                                                      <br></br>
                                                     </div>
                                                 </div>
                                              </div>
                                        </Popup>
                                    </td>
                                  
                                   </tr>  
                                )}                            
                              </tbody>
                            </table>
                          </div>
                          <div class="col-md-12">
                            <br></br>
                          </div>
                          { this.state.valid_data? 
                              <div class="col-md-12">
                              <Popup
                                  trigger={ <button><font style={{fontSize : "30pt"}}>Add Appointment</font></button>}
                                  modal 
                                >
                                    <div className="col-md-12" style={{width:"1000px",backgroundColor:"#d1f4ff"}}>
                                      <div className="row" style={{marginTop:"55px", marginBottom:"55px", marginLeft:"100px"}}>
                                          <div className="col-md-2" style={{marginLeft:"40px"}}>
                                            <h3><b>Hora</b></h3>
                                          </div>
                                          <div  className="col-md-1">
                                          <button style={{backgroundColor:"#2F323A"}} onClick={this.handleChange2}><font style={{fontSize : "30pt"}}><i className="fa fa-plus-square-o" style={{color:"white"}}></i></font></button>
                                          </div>
                                          <div  className="col-md-1">
                                          {this.state.hora < 10 ?
                                                <h3><b>0{this.state.hora}:00 </b></h3>
                                                :
                                                <h3><b> {this.state.hora}:00 </b></h3>
                                          } 
                                          </div> 
                                          <div  className="col-md-1" >
                                          <button  style={{marginLeft:"25px", backgroundColor:"#2F323A"}} onClick={this.handleChange3}><font style={{fontSize : "30pt"}}><i className="fa fa-minus-square-o" style={{color:"white"}}></i></font></button>
                                          </div>
                                        <div  className="col-md-2">
                                          <button style={{marginLeft:"45px",backgroundColor:"#2F323A"}} onClick={this.handleChange4}><font style={{fontSize : "30pt", color:"white"}}>Pesquisar</font></button>
                                        </div>
                                      </div>
                                    </div>
                                </Popup>
                            </div>
                            :
                            <div>
                              <h4>Medical appointments must be scheduled 2 days in advance</h4>
                            </div>
                          }
                          
                        </div>
                        }
                      </div>
                      <br></br>
                      <br></br>
                      <br></br>
                    </section>
                  </aside>
                </div>
                </section>
              </section>
              </div>
            );
        }
    }
  }

  export default Home2;