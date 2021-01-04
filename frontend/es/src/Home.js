import React from 'react';
import { Cookies } from 'react-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import Clock from 'react-live-clock';
import Popup from 'reactjs-popup';
import configRest from './config.json';

class Home extends React.Component {
     
    constructor(props) {
      
        super(props);
        this.state ={
          name : "",
          loading : true,
          foto : "",
          email :"",
          selectedDate : "",

          events: [],

          LoadingNew : true,
        };

        this.handleChange = this.handleChange.bind(this);

      }
      componentDidMount(){

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
        this.setState({selectedDate: year + "-" + month + "-" + date});

        const script = document.createElement('script');
        const script2 = document.createElement('script');
        const script3 = document.createElement('script');


        script2.src = "lib/fullcalendar/fullcalendar.min.js";
        script2.async = true;
        document.body.appendChild(script2);
        

        script3.src = "lib/calendar-conf-events.js";
        script3.async = true;
        document.body.appendChild(script3);


   
        script3.src = "lib/jquery/jquery.min.js";
        script3.async = true;
        document.body.appendChild(script3);

        script.src = "lib/common-scripts.js";
        script.async = true;

        document.body.appendChild(script);

        const cookies = new Cookies();
        console.log(cookies.get('foto'));
        if(cookies.get('valid')!=1){
          window.location.href='./login';
        }else{
          fetch('http://localhost:3001/jwt?e='+ cookies.get('email') )
            .then(response => response.json())
            .then(data1 => {
              fetch(configRest.Calendar + '/get?token='+ data1.token + "&date=" + this.state.selectedDate )
              .then(response => response.json())
              .then(data => {
                var ss  = [];
                data.Events.map((s)=>{
                  let dat = new Date (s.Date);
                  s.Date = dat;
                  ss.push(s);
                  this.setState({ events :  ss });
                });
              })        
            })
          .then( s => {
            this.setState({LoadingNew : false ,loading:false , name:cookies.get('name'), foto:cookies.get('foto'), email: cookies.get('email')});
          });
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
        window.location.href='./login';
      }

     handleChange(event) {   
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
      
      this.setState({LoadingNew: true, events :  [], selectedDate: event.getFullYear() + "-" + mes  + "-"  + dia})
      
      fetch('http://localhost:3001/jwt?e='+this.state.email )
            .then(response => response.json())
            .then(data1 => {
              console.log(data1)
              fetch(configRest.Calendar + '/get?token='+ data1.token + "&date=" + event.getFullYear() + "-" + mes  + "-"  + dia )
              .then(response => response.json())
              .then(data => {
                var ss  = [];
                data.Events.map((s)=>{
                  let dat = new Date (s.Date);
                  s.Date = dat;
                  ss.push(s);
                  this.setState({ events :  ss });
                });
          })
          .then(response =>   this.setState({LoadingNew: false,selectedDate: event.getDate() + " " +(event.getMonth() +1 )+ " " + event.getFullYear()}))    
          })
    }


    render() {

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
                              <a class="active dcjq-parent" href="/">
                              <i class="fa fa-home"></i>
                              <span>Home</span>
                              </a>
                          </li>
                        
                          <li class="mt">
                              <a href="/Farm">
                              <i class="fa fa-medkit"></i>
                              <span>Nas Próximidades</span>
                              </a>
                          </li>

                          <li class="mt">
                              <a  href="/PassarReceita">
                              <i class="fa fa-medkit"></i>
                              <span>Receita</span>
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
                                  tileClassName={({ date, view }) => {return 'lowlight'}}
                                />
                              </div>
                            </div>
                          </div>
                          <br></br>
                          <div class="panel-body">

                            {this.state.LoadingNew ?
                              <h5>Loading.....</h5>
                              :
                              this.state.events === null ?
                              <div class="col-md-12">
                                <h3>Sem consultas</h3>
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
                                      <th><font style={{fontSize : "30pt"}}>Name</font></th>
                                      <th><font style={{fontSize : "30pt"}}>Email</font></th>
                                      <th><font style={{fontSize : "30pt"}}>Número de utente</font></th>
                                      <th><font style={{fontSize : "30pt"}}>Ligar</font></th>
                                    </tr>
                                  </thead>
                                  <tbody>

                                {this.state.events.map((data) => 
                                   <tr>
                                   <td><font style={{fontSize : "30pt"}}>{data.Date.getHours()}:00</font></td>
                                   <td><font style={{fontSize : "30pt"}}>{data.Summary.split("|")[1]}</font></td>
                                   <td><font style={{fontSize : "30pt"}}>{data.Summary.split("|")[0]}</font></td>
                                   <td><font style={{fontSize : "30pt"}}>{data.Summary.split("|")[2]}</font></td>
                                   <td><Popup
                                          trigger={ <button><font style={{fontSize : "30pt"}}>Ligar</font></button>}
                                          modal
                                        >
                                            <div className="col-md-12" style={{width:"1000px",backgroundColor:"#d1f4ff"}}>
                                              <div className="row">
                                                <div className="col-md-9" style={{marginLeft:"10px"}}>
                                                   <br></br>
                                                   <br></br>
                                                </div>
                                                <div className="col-md-6" style={{marginLeft:"40px"}}>
                                                  <h3>João Teixeira está a Ligar</h3>
                                                </div>
                                                <div  className="col-md-2">
                                                  <button style={{backgroundColor:"#30c830ba"}}><font style={{fontSize : "30pt"}}>Atender</font></button>
                                                </div>
                                                <div  className="col-md-2">
                                                  <button  style={{backgroundColor:"rgba(206, 63, 63, 0.73)"}}><font style={{fontSize : "30pt"}}>Desligar</font></button>
                                                </div>
                                                <div className="col-md-9" style={{marginLeft:"10px"}}>
                                                   <br></br>
                                                   <br></br>
                                                   <br></br>
                                                </div>
                                              </div>
                                            </div>            
                                        </Popup></td>
                                   </tr>  
                                )}                    
                              </tbody>
                            </table>
                          </div>
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

  export default Home;