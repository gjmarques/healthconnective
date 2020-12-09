import React from 'react';
import { Cookies } from 'react-cookie';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import Clock from 'react-live-clock';
import Popup from 'reactjs-popup';


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
          hora: 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
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
        this.setState({selectedDate: year + "-" + month  + "-"  +date });

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
          var dd = []
          fetch('http://localhost:3001/getConsultas?e='+ cookies.get('email'))
          .then(response => response.json())
          .then(data => {
            if(data.valid === 1){
              this.setState({ events :  data.result })
            }
            
          })
          .then( s => {
            
            this.state.events.map((data) =>{
              console.log(this.state.selectedDate )
              console.log(data.date.split("T")[0] )
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
        
        this.setState({LoadingNew: true, evsent :  [], selectedDate: event.getFullYear() + "-" + mes  + "-"  + dia})

        var dd = []
        this.state.events.map((data) =>{
          console.log("this.state.selectedDate" )
          if( event.getFullYear() + "-" + mes  + "-"  + dia ===  data.date.split("T")[0]){
            dd.push(data)
            console.log("this.state.selectedDate33" )
          }
        }
        )

         this.setState({LoadingNew: false, evsent : dd})



 
             
      }

      handleChange2(event) {   
        var h = this.state.hora;
        if(h === 23){
            this.setState({hora : 0});
        }else{
            h = h+1;
            this.setState({hora : h});
        }
      }

      handleChange3(event) {   
        var h = this.state.hora;
        if(h ===0){
            this.setState({hora : 23});
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
        window.location.href='./login';
      }

    render() {
        console.log(this.state.evsent)
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
                            <h3>Sem consultas</h3>
                            <Popup
                                          trigger={ <button><font style={{fontSize : "30pt"}}>Adicionar Consulta</font></button>}
                                          modal
                                         
                                        >
                                       
                                            <div className="col-md-12" style={{width:"1000px",backgroundColor:"#d1f4ff"}}>
                                             
                                              
                                              <div className="row" style={{marginTop:"55px", marginBottom:"55px", marginLeft:"100px"}}>
                                            
                                                  <div className="col-md-2" style={{marginLeft:"40px"}}>
                                                    <h3>Hora</h3>
                                                  </div>
                                                  <div  className="col-md-1">
                                                  <button style={{backgroundColor:"#30c830ba"}} onClick={this.handleChange2}><font style={{fontSize : "30pt"}}><i className="fa fa-toggle-up"></i></font></button>
                                                  </div>
                                                  <div  className="col-md-1">
                                                  {this.state.hora < 10 ?
                                                        <h3>0{this.state.hora}:00 </h3>
                                                        :
                                                        <h3> {this.state.hora}:00 </h3>
                                                  } 
                                                 </div> 
                                                 <div  className="col-md-1" >
                                                  <button  style={{marginLeft:"25px", backgroundColor:"rgba(206, 63, 63, 0.73)"}} onClick={this.handleChange3}><font style={{fontSize : "30pt"}}><i className="fa fa-toggle-down"></i></font></button>
                                                  </div>
                                                <div  className="col-md-2">
                                                  <button style={{marginLeft:"45px",backgroundColor:"#30c830ba"}} onClick={this.handleChange4}><font style={{fontSize : "30pt"}}><i className="fa fa-search">Pesquisar</i></font></button>
                                                </div>

                                            
                                              
                                                 
                                              </div>
                                              </div>
                                               
                                              
                                            
                                            
                                          
                                        </Popup>
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
                                </tr>
                              </thead>
                              <tbody>
                              {this.state.evsent.map((data) => 
                                   <tr>
                                   <td><font style={{fontSize : "30pt"}}>{data.date.split('T')[1].split(':')[0]}:00</font></td>
                                 <td><font style={{fontSize : "30pt"}}>{data.medico}</font></td>
                                   </tr>  
                                )}
  
  
                                                        
                              </tbody>
                            </table>
                          </div>
                          <div class="col-md-12">
                            <br></br>
                          </div>
                          <div class="col-md-12">
                        
                            <Popup
                                          trigger={ <button><font style={{fontSize : "30pt"}}>Adicionar Consulta</font></button>}
                                          modal
                                         
                                        >
                                       
                                            <div className="col-md-12" style={{width:"1000px",backgroundColor:"#d1f4ff"}}>
                                             
                                              
                                              <div className="row" style={{marginTop:"55px", marginBottom:"55px", marginLeft:"100px"}}>
                                            
                                                  <div className="col-md-2" style={{marginLeft:"40px"}}>
                                                    <h3>Hora</h3>
                                                  </div>
                                                  <div  className="col-md-1">
                                                  <button style={{backgroundColor:"#30c830ba"}} onClick={this.handleChange2}><font style={{fontSize : "30pt"}}><i className="fa fa-toggle-up"></i></font></button>
                                                  </div>
                                                  <div  className="col-md-1">
                                                  {this.state.hora < 10 ?
                                                        <h3>0{this.state.hora}:00 </h3>
                                                        :
                                                        <h3> {this.state.hora}:00 </h3>
                                                  } 
                                                 </div> 
                                                 <div  className="col-md-1" >
                                                  <button  style={{marginLeft:"25px", backgroundColor:"rgba(206, 63, 63, 0.73)"}} onClick={this.handleChange3}><font style={{fontSize : "30pt"}}><i className="fa fa-toggle-down"></i></font></button>
                                                  </div>
                                                <div  className="col-md-2">
                                                  <button style={{marginLeft:"45px",backgroundColor:"#30c830ba"}} onClick={this.handleChange4}><font style={{fontSize : "30pt"}}><i className="fa fa-search">Pesquisar</i></font></button>
                                                </div>

                                            
                                              
                                                 
                                              </div>
                                              </div>
                                               
                                              
                                            
                                            
                                          
                                        </Popup>
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

  export default Home2;