import React, { Component } from 'react';
import { Cookies } from 'react-cookie';


class Profile extends React.Component {
     
    constructor(props) {
        super(props);
        this.state ={
          name : "",
          loading : true,
          nutente: 0,
          email: "",
          foto : "",
        };
      }
      componentDidMount(){

        const script = document.createElement('script');

        script.src = "lib/common-scripts.js";
        script.async = true;

        document.body.appendChild(script);

        
        const cookies = new Cookies();
        console.log();
        if(cookies.get('valid')!=1){
          window.location.href='./login';
        }else{
            this.setState({loading:false});
            this.setState({name:cookies.get('name'), email : cookies.get('email'), nutente: cookies.get('nUtente'), foto : cookies.get('foto')});
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
        const cookies = new Cookies();
        console.log(cookies.get('name'));
        if(this.state.loading){
            return(<a>Loading.....</a>);
        }else{
            return (
                <div>
                                    
                    <header class="header black-bg">
                    <div class="sidebar-toggle-box">
                        <div class="fa fa-bars tooltips" data-placement="right" data-original-title="Toggle Navigation"></div>
                    </div>

                    <a href="/" class="logo"><b>Health<span>Connect</span></b></a>


                    <div class="top-menu">
                    <ul class="nav pull-right top-menu">
                        <li><a class="logout" onClick={this.Logout}>Logout</a></li>
                        </ul>
                        <ul class="nav pull-right top-menu">
                        <li><a class="logout" style={{backgroundColor:'#99ccff'}} href="/login"> <i class="fa fa-user"></i>  Profile</a></li>
                        </ul>
                    </div>
                    </header>
                      <aside>
                    <div id="sidebar" class="nav-collapse ">
               
                        <ul class="sidebar-menu" id="nav-accordion">
                        <p class="centered"><a href="profile.html"><img src={this.state.foto} class="img-circle" width="80"/></a><div></div></p>
                        
                         <h5 class="centered">{this.state.name}</h5>
                        <li class="mt">
                            <a class="dcjq-parent" href="/">
                            <i class="fa fa-home"></i>
                            <span>Home</span>
                            </a>
                        </li>
                        <li class="mt">
                            <a href="/consultas">
                            <i class="fa fa-plus-square"></i>
                            <span>Consultas</span>
                            </a>
                        </li>
                        <li class="mt">
                            <a href="/Farm">
                            <i class="fa fa-medkit"></i>
                            <span>Postos Farmaceuticos</span>
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
                        <section class="wrapper site-min-height">
                            <div class="row mt">
                            <div class="col-lg-12">
                                <div class="row content-panel">   
                                <div class="col-md-4 profile-text">
                                    <h3>{this.state.name}</h3>
                                    <p></p>
                                    <br/> 
                                </div>
                                </div>
                                <br/>
   
                              </div>
         
            <div class="row content-panel">
            <div class="panel-heading">
                <ul class="nav nav-tabs nav-justified">
                
                <li class="active">
                    <a data-toggle="tab" href="#contact" class="contact-map" aria-expanded="true">Informação Pessoal</a>
                </li>
                <li class="">
                    <a data-toggle="tab" href="#edit" aria-expanded="false">Editar </a>
                </li>
                </ul>
            </div>
         
              <div class="panel-body">
                <div class="tab-content">     
                  <div id="contact" class="tab-pane active">
                    <div class="row">
                    <div class="col-lg-8 col-lg-offset-2 detailed">
                        <h4  class="mb">Informação Pessoal</h4>
                        <div class="col-lg-8 col-lg-offset-2 detailed">
                          <h3>
                          <font style={{ color: '#48CFAD', fontWeight: 'bold' }}>Nome: </font> {this.state.name}<br/> <br/><font style={{ color: '#48CFAD',  fontWeight: 'bold' }}>Email: </font> {this.state.email} <br/><br/> <font style={{ color: '#48CFAD',  fontWeight: 'bold' }}>Nº Utente: </font> {this.state.nutente} <br/> 
                          </h3>
                        </div>
                      </div>        
                    </div>
                  </div>
                  <div id="edit" class="tab-pane">
                    <div class="row">   
                      <div class="col-lg-8 col-lg-offset-2 detailed">
                        <h4 class="mb">Editar</h4>
                        <form role="form" class="form-horizontal">
                          <div class="form-group">
                            <label class="col-lg-2 control-label">Nº Utente</label>
                            <div class="col-lg-6">
                            <input type="text" placeholder=" " id="country" class="form-control"/>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="col-lg-8 col-lg-offset-2 detailed mt">        
                          <div class="form-group">
                            <div class="col-lg-offset-2 col-lg-6">
                              <button class="btn btn-theme" type="submit">Save</button>
                             
                            </div>
                          </div>

                      </div>
                    </div>
                  </div>
         
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

  export default Profile;