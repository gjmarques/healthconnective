import React from 'react';
import { Cookies } from 'react-cookie';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import Clock from 'react-live-clock';
import Popup from 'reactjs-popup';
import configRest from './config.json';

class MedAva extends React.Component {
     
    constructor(props) {
      
        super(props);
        this.state ={
          name : "",
          loading : true,
          foto : "",
          mail : "",
          date : "",
          medicos : null,
          numero : "",
        };
    

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

        const cookies = new Cookies();

        if(cookies.get('valid')!=1){
          window.location.href='./login';
        }else{
         
          //var  d = this.props.match.params.d;
          const querystring = window.location.search;
          var d = new URLSearchParams(querystring).get("data");
          console.log("asd" + d)
         
          fetch(configRest.Calendar + '/available?date=' + d)
          .then(response => response.json())
          .then(data => {
            console.log(data)
            this.setState({ medicos :  data });
          })
          .then( e => {
            this.setState({loading:false , name:cookies.get('name'), foto:cookies.get('foto'), email : cookies.get('email'), date: d, numero : cookies.get('nUtente')});
            fetch('http://localhost:3001/temConsulta?e='+ this.state.email + "&d=" + this.state.date)
            .then(response => response.json())
            .then(data => {
              if(data.valid === 1){
                window.location.href="./"
              }
            } )
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


     
  
    render() {
  

        if(this.state.loading){
            return(<a>Loading.....</a>);
        }else{
          console.log(this.state.events); 
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
                           <br/>
                           <br/>
                        </li>
                             
                        </ul>

                    </div>
                    </aside>    

           
            <section id="main-content">
              <section class="wrapper">
                <h3><i class="fa fa-angle-right"></i> Adicionar consulta</h3>

                <div class="row mt">
  
                  <aside class="col-lg-12 mt">
                    <section class="panel " >
                   

                      <br></br>
                      <div class="panel-body">
                  
                      
                          <div class="col-md-12">
                          <div class="content-panel" style={{backgroundColor:"#f2f2f214" , boxShadow:"1px 4px 4px 3px #aab2bd"}}>
                            <h1><i class="fa fa-angle-right" style={{marginLeft:"10px"}}></i>  &nbsp;&nbsp; {this.state.selectedDate}</h1>
                            <hr/>
                            <table class="table">
                              <thead>
                                <tr>
                                  <th><font style={{fontSize : "30pt"}}>Email</font></th>
                                  <th><font style={{fontSize : "30pt"}}>Adcionar</font></th>
                                </tr>
                              </thead>
                              <tbody>
                                
                                      {this.state.medicos.map((data) => 
                                          <tr>
                                          <td><font style={{fontSize : "30pt"}}>{data}</font></td>
                                          <td>
                                        <Popup
                                              trigger={ <button><font style={{fontSize : "30pt"}}>Adicionar consulta</font></button>}
                                              modal
                                             
                                            >
                                           
                                                <div className="col-md-12" style={{width:"1000px",backgroundColor:"#d1f4ff"}}>
                                                 
                                                  
                                                  <div className="row">
                                                  <div className="col-md-9" style={{marginLeft:"10px"}}>
                                                       <br></br>
                                                       <br></br>
                                                      
                                                      </div>
                                                      <div className="col-md-6" style={{marginLeft:"40px"}}>
                                                  <h3>Tem a certeza que pertende adicionar esta consulta com {data}?</h3>
                                                      </div>
                                                      <div  className="col-md-2">
                                                      <button style={{backgroundColor:"#30c830ba"}} onClick={() => {

                                                              fetch('http://localhost:3001/jwt?e='+ data )
                                                              .then(response => response.json())
                                                              .then(data1 => {
                                                                fetch(configRest.Calendar + '/add?token='+ data1.token + "&date=" + this.state.date + "&summary=" + this.state.email +"|" + this.state.name +"|" + this.state.numero)
                                                                .then(response => response.status===200? response.json() :    window.location.href='./')
                                                                .then(data2 => {
                                                                  console.log(data2);
                                                                  fetch('http://localhost:3001/addConsulta?e='+ this.state.email + "&d=" + this.state.date + "&m=" + data + "&i="+  data2.ics)
                                                                  .then(response => window.location.href='./')
                                                                })
                                                          })
                                                      }}><font style={{fontSize : "30pt"}}>Adicionar</font></button>
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

  export default MedAva;