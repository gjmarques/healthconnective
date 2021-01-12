import React from 'react';
import { Cookies } from 'react-cookie';
import FacebookLogin from 'react-facebook-login';
import './App.css';
import configRest from './config.json';

class Login extends React.Component {
     
      constructor(props) {
        super(props);
        this.state ={
          name : "",
          loading : true
        };
      }

      componentDidMount(){
        const cookies = new Cookies();
        console.log(cookies.get('valid'));
        if(cookies.get('valid')==1){
          window.location.href='./';
        }else{
         this.setState({loading:false});
        }
      }

      responseFacebook2 = (response) => {
      }
       responseFacebook = (response) => {
        const cookies = new Cookies();
        cookies.set('name', response.name);
        cookies.set('foto', response.picture.data.url);
        cookies.set('email', response.email);
        cookies.set('token', response.token);
        console.log(response);
        fetch(configRest.autenticacao + '/verify?email=' + response.email)
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  if(data.valid===1){
                    cookies.set('valid', 1);
                    cookies.set('nUtente', data.result[0].utente);
                     cookies.set('med', data.result[0].medico);
                     window.location.href='./';
                  }else{
                    window.location.href='./Register';
                  }
                }); 
      }
    
    render() {
     
        if(this.state.loading){
          return (<h1>loading......</h1>)
        }else{
         
        
            return (
              <div>

                   <header class="header black-bg">
                    <a href="/" class="logo"><b>Health<span>Connect</span></b></a>
                  </header>

              <section id="main-content">
               <section class="wrapper site-min-height">
                <div class="row mt mb">
                  <div class="col-lg-12">
                  <div class="col-lg-8 col-md-4 col-sm-12" >
                    <div class="dmbox"style={{height:"705px", backgroundImage: "url('https://blog.vitta.com.br/wp-content/uploads/2019/12/voce-sabe-o-que-faz-um-medico-1.jpg')" , backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat'}}>
                   
                    <br></br>
                     <h1  style={{fontSize:"45pt", color:"#22242A"}}><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font style={{color:"#22242A"}}>Health</font><font style={{color:"#4ECDC4"}}>Connect</font></b></h1>
                     <br></br> <br></br> <br></br>
                     <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img style={{width:"90px", height:"90px"}} src="https://2.bp.blogspot.com/-m2fsUQx3D5w/Vhe7E-bm4pI/AAAAAAAACXw/M5AIfnVuui8/s1600/attention-307030_640.png"/></h1>
                      <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This platform was developed as an<br></br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; academic project</h1>
                     <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It is not affiliated with any medical entity</h1>
                     </div> 
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-12">
                    <div class="dmbox" style={{width:"330px", height:"305px"}}>
                      <form class="form-login" >
                        <h2 class="form-login-heading" style={{marginTop:"-78px"}}><b>sign in now with facebook</b></h2>

                        <div class="login-wrap">
                          <FacebookLogin
                            appId="861638111331940"
                            autoLoad={true}
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btnFacebook"
                          />
                      <hr/>
                      </div>      
                     </form>     
                     </div>   
                    </div>
                    <div class="col-lg-8 col-md-4 col-sm-12" style={{width:"330px", height:"205px"}}>
                  </div>
                  <div class="col-lg-8 col-md-4 col-sm-12" style={{width:"330px", height:"205px"}}>
                  </div>
                 
             
                    <div class="col-lg-2 col-md-4 col-sm-12" style={{marginTop:"20px"}}>
                    <div class="dmbox" style={{ height:"340px"}}>
                        <div class="service-icon">
                        <i class="dm-icon " style={{backgroundColor:"#4ECDC4"}}><img src="https://cdn1.iconfinder.com/data/icons/ios-11-glyphs/30/video_call-512.png" style={{color:"white",marginLeft:"7px",marginTop:"28px",width:"50px", height:"50px"}}></img></i>
                        </div>
                        <h3 style={{fontSize:"20pt"}}>Video Call    </h3> <br></br>
                        <h5 style={{fontSize:"13pt"}}>Have your appointment in the security of your home. Or any other place with internet access.</h5>
                      </div>
                    </div>

                    
                    <div class="col-lg-2 col-md-4 col-sm-12" style={{marginTop:"20px"}}>
                    <div class="dmbox" style={{ height:"340px"}}>
                        <div class="service-icon">
                        <i class="dm-icon " style={{backgroundColor:"#4ECDC4"}}><img src="https://i.pinimg.com/originals/27/bc/96/27bc965b6aa4487db8d202e18494eebc.png" style={{color:"white",marginTop:"20px",width:"60px", height:"60px"}}></img></i>
                        </div>
                        <h3 style={{fontSize:"20pt"}}>Schedule Appointment</h3>
                        <h5 style={{fontSize:"13pt"}}>Schedule your Appointment in minutes. You can even choose your favorite medic.</h5>
                      </div>
                    </div>

                    <div class="col-lg-2 col-md-4 col-sm-12" style={{marginTop:"20px"}}>
                    <div class="dmbox" style={{ height:"340px"}}>
                        <div class="service-icon">
                        <i class="dm-icon " style={{backgroundColor:"#4ECDC4"}}><img src="https://pngimg.com/uploads/gps/gps_PNG42.png" style={{color:"white",marginLeft:"2px",marginTop:"25px",width:"40px", height:"50px"}}></img></i>
                        </div>
                        <h3 style={{fontSize:"20pt"}}>Nearby</h3>
                        <br></br>
                        <h5 style={{fontSize:"13pt"}}>There are things that cannot be resolved remotely. Check hospitals, dentists, pharmacies, among others facilities nearby.</h5>
                      </div>
                    </div>
                    <div class="col-lg-2 col-md-4 col-sm-12" style={{marginTop:"20px"}}>
                    <div class="dmbox" style={{ height:"340px"}}>
                        <div class="service-icon">
                          <i class="dm-icon " style={{backgroundColor:"#4ECDC4"}}><img src="https://www.flaticon.com/svg/static/icons/svg/45/45357.svg" style={{color:"white",marginLeft:"3px",marginTop:"28px",width:"50px", height:"50px"}}></img></i>
                        </div>
                        <h3 style={{fontSize:"20pt"}}>Medical Prescriptions</h3>
                        <h5 style={{fontSize:"13pt"}}>Easy to access eletronic medical prescriptions. Say goodbye to doctors' bad handwriting.</h5>
                      </div>
                    </div>
              </div>
              </div>
                   
            </section>
          </section>
          </div>
       
                );
          }
        }
        
       
    
  }

  export default Login;