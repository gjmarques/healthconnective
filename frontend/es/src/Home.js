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
        this.setState({selectedDate: year + "-" + month + "-" + date});

        

        const cookies = new Cookies();
    
        if(cookies.get('valid')!=1){
          window.location.href='./login';
        }else{
          fetch(configRest.autenticacao + '/jwt?e='+ cookies.get('email') )
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
      
      fetch(configRest.autenticacao + '/jwt?e='+this.state.email )
            .then(response => response.json())
            .then(data1 => {
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
                  <header className="header black-bg" style={{backgroundColor: "#132639"}}>
                    <div className="sidebar-toggle-box">
                      <div className="fa fa-bars tooltips" data-placement="right" data-original-title="Toggle Navigation" style={{color:"white"}}></div>
                    </div>
                    <a href="/" className="logo"><b>Health<span>Connect</span></b></a>
                    <div className="top-menu">
                    <ul className="nav pull-right top-menu">
                        <li><a className="logout" onClick={this.Logout}>Logout</a></li>
                      </ul>
                      <ul className="nav pull-right top-menu">
                        <li><a className="logout" style={{backgroundColor:'#99ccff'}} href="/profile"> <i className="fa fa-user"></i>  Profile</a></li>
                      </ul>
                    </div>
                  </header>

                  <aside >
                    <div id="sidebar" className="nav-collapse collapse" style={{backgroundColor: "#204060"}}>
                        <ul className="sidebar-menu" id="nav-accordion">
                          <div style={{color:"white", textAlign:"center"}}>
                            <h3 style={{color:"white", alignContent:"center"}}>
                              <Clock format="HH:mm" interval={1000} ticking={true}  />
                            </h3> 
                           <br></br>
                          </div>
                      
                          <p className="centered"><a href="profile.html"><img src={this.state.foto} className="img-circle" width="80"/></a></p><div></div>
                          <h5 className="centered">{this.state.name}</h5>
                          <li className="mt">
                              <a className="active dcjq-parent" href="/">
                              <i className="fa fa-calendar-o"></i>
                              <span>Home</span>
                              </a>
                          </li>
                        
                          <li className="mt">
                              <a href="/Farm">
                              <i className="fa fa-map-marker"></i>
                              <span>Nearby</span>
                              </a>
                          </li>

                          <li className="mt">
                              <a href="/Receitas">
                              <i className="fa fa-medkit"></i>
                              <span>Prescriptions</span>
                              </a>
                          </li>
                      
                          <li className="mt">
                            <br/>
                            <br/>
                          </li>
                             
                        </ul>

                    </div>
                  </aside>    

           
                <section id="main-content">
                  <section className="wrapper">
                    <h3><i className="fa fa-angle-right"></i> Calendar</h3>
                    <div className="row mt">
                      <aside className="col-lg-12 mt">
                        <section className="panel " >
                          <div className="panel-body">
                            <div className="col-md-12">
                              <div className="content-panel" style={{backgroundColor:"#f2f2f214" , boxShadow:"1px 4px 4px 3px #aab2bd"}}>
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
                          <div className="panel-body">

                            {this.state.LoadingNew ?
                              <h5>Loading.....</h5>
                              :
                              this.state.events === null ?
                              <div className="col-md-12">
                                <h3>Sem consultas</h3>
                              </div>
                              : 
                              <div className="col-md-12">
                              <div className="content-panel" style={{backgroundColor:"#f2f2f214" , boxShadow:"1px 4px 4px 3px #aab2bd"}}>
                                <h1><i className="fa fa-angle-right" style={{marginLeft:"10px"}}></i>  &nbsp;&nbsp; {this.state.selectedDate}</h1>
                                <hr/>
                                <table className="table">
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
                                   {data.Date.getHours()<10?
                                      <td style={{textAlign:"center", width:"110px"}}> <button   style={{width:"80px"}} className="btn btn-success"  onClick={() => window.open("https://dccef509b668.ngrok.io/chat.html?id=" + this.state.email + "-0" + data.Date.getHours() + ":00", "popup",'width=1000,height=700,scrollbars=no,resizable=no')}><font style={{fontSize : "20pt"}}><i className="fa fa-phone"></i></font></button> </td>
                                   
                                   :
                                      <td style={{textAlign:"center", width:"110px"}}> <button   style={{width:"80px"}} className="btn btn-success" onClick={() => window.open("https://dccef509b668.ngrok.io/chat.html?id=" + this.state.email + "-" + data.Date.getHours() + ":00", "popup",'width=1000,height=700,scrollbars=no,resizable=no')}><font style={{fontSize : "20pt"}}><i className="fa fa-phone"></i></font></button> </td>
                                   }
                      
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