import React from 'react';
import { Cookies } from 'react-cookie';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import Clock from 'react-live-clock';
import configRest from './config.json';

class PassarReceitas extends React.Component {
     
    constructor(props) {
      
        super(props);
        this.state ={
            name : "",
            foto : "",
            email :"",

            Emailvalue: '',
            medicinName:'',

            loading:false,

            valid: 0,
            data: [],


            receitasDiv:[],




        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
        this.handleChange5 = this.handleChange5.bind(this);

        this.handleChange6 = this.handleChange6.bind(this);
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

        if(cookies.get('valid')!=1 || cookies.get('med')!=1 ){
          window.location.href='./';
        }else{
            this.setState({ name:cookies.get('name'), foto:cookies.get('foto'), email: cookies.get('email')});
        }
      }


    handleChange(event) { 
        this.setState({loading:true})
        fetch('http://localhost:3001/getUserByEmail?e='+this.state.Emailvalue.replace(/\s/g, '') )
        .then(response => response.json())
        .then(data1 => {
            if(data1.valid==1){
                this.setState({valid:1, data : data1.result, loading:false})
            }else{
                this.setState({valid:0, data : [], loading:false})
            }
      })
    }

    handleChange6(event) { 
        this.setState({loading:true})
        var s = this.state.receitasDiv.toString();
        fetch(configRest.QRCode+"/sign?prescription=" + s)
        .then(response => response.json())
        .then(data1 => {   
            fetch('http://localhost:3001/addReceita?e='+this.state.Emailvalue.replace(/\s/g, '') + "&r=" + s + "&i=" + data1.base64)
            .then(response => response.json())
            .then(data => {  
                window.location.href='./';
            })
      })
    }





    handleChange4(event) {   
        var joined = this.state.receitasDiv.concat(this.state.medicinName);
        this.setState({medicinName:'', receitasDiv:joined});
    }


    handleChange5 = (event, i) => {
        var array = [...this.state.receitasDiv];
        var index = array.indexOf(i)
        console.log("APAGA----" +index + " ---- " + i);
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({receitasDiv: array});
        }
      }



    handleChange2(event) {    this.setState({Emailvalue: event.target.value});  }
    handleChange3(event) {    this.setState({medicinName: event.target.value});  }

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
                              <a class="active dcjq-parent" href="/PassarReceita">
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
                    <div class="container">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                        <div class="login-wrap">
                            <input type="text" class="form-control" placeholder="Email"  id="name" autofocus value={this.state.value} onChange={this.handleChange2} />
                            <br/>
                            <button class="btn btn-theme btn-block" onClick={this.handleChange}>Search</button>
                            <hr/>
                        
                        </div>
                        <div class="content-panel" style={{backgroundColor:"white" , boxShadow:"1px 4px 4px 3px #aab2bd"}}>
                        {this.state.loading ? 
                            <h2 style={{marginLeft:"10px"}}>Loading....</h2>
                        :
                            this.state.valid==0 ? 
                                 <h2 style={{marginLeft:"10px"}}>Search a valid email</h2>

                            :


                                <div>
                                     {this.state.data[0].medico==1? <div style={{marginLeft:"30px"}}><h2>This user is a medic!!!!</h2> <br></br></div>: <h2></h2>}
                                <h2 style={{marginLeft:"10px"}}>Email: {this.state.data[0].email}</h2>
                                <h2 style={{marginLeft:"10px"}}>NºUtente: {this.state.data[0].utente}</h2>
                                <br/>
                                <br/>   
                                <div style={{marginLeft:"30px"}}><h2>Prescription</h2></div>
                                {this.state.receitasDiv.length>0?
                                <ul class="task-list" style={{marginLeft:"30px"}}>
                                   
                                {this.state.receitasDiv.map( (d)=>
                                            <li>
                                              <div class="task-title">
                                                <h2>{d} <button value={d} class="btn btn-danger btn-xs" onClick={(event) => this.handleChange5(event, d)}><i class="fa fa-trash-o "></i></button></h2>
                                               
                                              </div>
                                            </li>

                                    )} 
                                </ul>
                                :
                                <div><h2></h2></div>
                                }
                                <br/> 
                                <br/> 
                                <div  style={{marginLeft:"30px"}}><h2>New Medicin</h2></div>
                                <div class="row mt mb" style={{marginLeft:"25px"}}>
                                <div class="col-lg-2 col-md-4 col-sm-12" >
                                    <input type="text" class="form-control" placeholder="Medicin Name"  id="name" autofocus value={this.state.medicinName} onChange={this.handleChange3} />
                               
                                </div>
                                <div class="col-lg-2 col-md-4 col-sm-12" >
                                <button class="btn btn-theme btn-block" style={{width:"70px"}}onClick={this.handleChange4}>Add</button>
                               
                                </div>
                                <div class="col-lg-6 col-md-4 col-sm-12" >
                              
                                </div>
                                <div class="col-lg-2 col-md-4 col-sm-12" >
                                <button class="btn btn-theme btn-block" style={{width:"100px", backgroundColor:"red"}}onClick={this.handleChange6}>Save</button>
                               
                                </div>
                                </div>
                                <br/>
                                </div>
                        }
                           
                        </div>
                    </div>
                </section>
                </div>
            );
        
    }
  }

  export default PassarReceitas;