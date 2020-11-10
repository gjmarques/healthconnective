import React, { Component } from 'react';
import { Cookies } from 'react-cookie';


class Farm extends React.Component {
     
    constructor(props) {
        super(props);
        this.state ={
            name : "",
            loading : true,
            lat : 0,
            long: 0,
            data : null,
            foto : "",
          };
      }
      componentDidMount(){

        const script = document.createElement('script');

        script.src = "lib/common-scripts.js";
        script.async = true;

        document.body.appendChild(script);

        
        const cookies = new Cookies();
        this.setState({name:cookies.get('name'), foto: cookies.get('foto')})

        console.log();
        if(cookies.get('valid')!=1){
          window.location.href='./login';
        }else{
            
            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({loading:false});
                this.setState({lat: position.coords.latitude, long: position.coords.longitude});
                fetch('https://api.mydomain.com')
                .then(response => response.json())
                .then(data => this.setState({ data:data , loading:false}));
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
        const cookies = new Cookies();
        console.log(cookies.get('name'));
       
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
                        <li><a class="logout" style={{backgroundColor:'#99ccff'}} href="/profile"> <i class="fa fa-user"></i>  Profile</a></li>
                        </ul>
                    </div>
                </header>

                <aside>
                    <div id="sidebar" class="nav-collapse ">
                        <ul class="sidebar-menu" id="nav-accordion">
                        <p class="centered"><a href="profile.html"><img src={this.state.foto} class="img-circle" width="80"/></a><div></div></p>
                        
                         <h5 class="centered">{this.state.name}</h5>
                        <li class="mt">
                            <a href="/">
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
                            <a class="active dcjq-parent" href="/">
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

                {this.state.loading  ?  
                    <section id="main-content">
                     <div class="container">
                        <div class="row">
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div class="col-lg-6 col-lg-offset-3 p404 centered">
                            <img src="img/load.gif" alt="" ></img>

                        </div> 
                        </div> 
                        </div> 
                    </section>
                   
                :
               
                <section id="main-content">
                <section class="wrapper site-min-height">
                    <h3><i class="fa fa-angle-right"></i> Postos Farmaceuticos</h3>
                    <div class="row mt">
                    <div class="col-lg-12">
                        <div class="row">
                        {this.state.data==null  ?  
                                <div class="col-lg-12 col-md-4 col-sm-4 mb">
                                    <div class="product-panel-2 pn">
                                    <br/>
                                    <br/>
                                    <br/>
                                    <h1 class="mt"><a >Não Tem nenhum posto farmaceutico nas proximidades</a></h1>
                                    </div>
                                </div>  
                        :
                                this.state.data.map(data =>
                                    <div class="col-lg-4 col-md-4 col-sm-4 mb">
                                        <div class="product-panel-2 pn">
                                        <br/>
                                        <br/>
                                        <br/>
                                        <h1 class="mt"><a target={"_blank"} href={"https://www.google.com/search?q="} >Farmácia Nova</a></h1>
                                        <h3>Rua Oliveira</h3>
                                        </div>
                                    </div>  
                                )
                        }
                       
                    </div>
                    </div>
                    </div>
                    
                </section> 
                </section>

    }

                
          </div>
            );
        }
  }
  export default Farm;
/*
  export default Farm;



      componentDidMount(){  

        const script = document.createElement('script');

        script.src = "lib/common-scripts.js";
        script.async = true;

        document.body.appendChild(script);

        
        const cookies = new Cookies();
        console.log();
        if(cookies.get('name')==undefined){
          window.location.href='./login';
        }else{
            

            navigator.geolocation.getCurrentPosition((position) => {
                this.setState({lat: position.coords.latitude, long: position.coords.longitude, loading:false});
            });

        }

      }

      Logout = e => {
        const cookies = new Cookies();
        cookies.remove('name');
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
                        <li><a class="logout" style={{backgroundColor:'#99ccff'}} onClick={this.Logout}> <i class="fa fa-user"></i>  Profile</a></li>
                        </ul>
                    </div>
                    </header>

                    <aside>
                    <div id="sidebar" class="nav-collapse ">
               
                        <ul class="sidebar-menu" id="nav-accordion">
                         <h5 class="centered">João Teixeira</h5>
                        <li class="mt">
                            <a href="/">
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
                            <a href="/">
                            <i class="fa fa-medkit"></i>
                            <span>Postos Farmaceuticos</span>
                            </a>
                        </li>
                        <li class="mt">
                            <a href="/">
                            <i class="fa fa-dashboard"></i>
                            <span>My Profile</span>
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
                        <h3><i class="fa fa-angle-right"></i> Postos Farmaceuticos</h3>
                        <div class="row mt">
                        <div class="col-lg-12">
                            <div class="row">
                            <div class="col-lg-4 col-md-4 col-sm-4 mb">
                                <div class="product-panel-2 pn">
                                <br/>
                                <br/>
                                <br/>
                                <h1 class="mt">Latitude</h1>
                                <h3>{this.state.lat}</h3>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4 mb">
                                <div class="product-panel-2 pn">
                                <br/>
                                <br/>
                                <br/>
                                <h1 class="mt">Longitude</h1>
                                <h3>{this.state.long}</h3>
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

  export default Farm;*/