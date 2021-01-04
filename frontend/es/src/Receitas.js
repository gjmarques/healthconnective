import React from 'react';
import { Cookies } from 'react-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import Clock from 'react-live-clock';
import Popup from 'reactjs-popup';
import configRest from './config.json';

class Receitas extends React.Component {
     
    constructor(props) {
      
        super(props);
        this.state ={
          name : "",
          loading : true,
          foto : "",
          email :"",


          data : [],
        };


      }
      componentDidMount(){

      
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
          fetch('http://localhost:3001/getUserReceitas?e='+ cookies.get('email') )
            .then(response => response.json())
            .then(data1 => {
                if(data1.valid==1){
                    this.setState({loading:false , name:cookies.get('name'), foto:cookies.get('foto'), email: cookies.get('email'), data : data1.result});
           
                }else{
                    this.setState({loading:false , name:cookies.get('name'), foto:cookies.get('foto'), email: cookies.get('email'), data : []});
           
                }
                
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
        console.log("ASDASD" )
        console.log(this.state.data)
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
                              <a  href="/">
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
                              <a class="active dcjq-parent" href="/Farm">
                              <i class="fa fa-medkit"></i>
                              <span>Receitas</span>
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
                <div class="container">
                    <br></br>  <br></br>  <br></br> 
                <div class="row mt mb">
                
                         
                    {this.state.data.map(
                        (d) => 
                       
                            <div class="col-lg-4 col-md-4 col-sm-12" style={{marginTop:"20px"}} onClick={ ()=> window.location.href="data:image/png;base64," + d.image.replace(/\s/g, '+')}>
                            <div class="dmbox" style={{ height:"400px",  boxShadow:"1px 4px 4px 3px #aab2bd"}} >
                            <h2>Medicin</h2>
                            {d.receita.split(",").map(
                                (g) => <h3 style={{fontSize:"20pt"}}>- {g}</h3>
                            )}
                                
                               
                              </div>
                            </div>
         

                    )}
             </div>
                </div>
                </section>
                </div>
            );
        }
    }
  }

  export default Receitas;