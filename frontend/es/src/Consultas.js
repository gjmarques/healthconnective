import React, { Component } from 'react';
import { Cookies } from 'react-cookie';


class Consultas extends React.Component {
     
    constructor(props) {
        super(props);
        this.state ={
          name : "",
          loading : true
        };
      }
      componentDidMount(){

        const script = document.createElement('script');

        script.src = "lib/common-scripts.js";
        script.async = true;

        document.body.appendChild(script);

        
        const cookies = new Cookies();
        console.log();
        if(cookies.get('valid')==1){
          window.location.href='./login';
        }else{
            this.setState({loading:false});
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
                         <h5 class="centered">João Teixeira</h5>
                        <li class="mt">
                            <a href="/">
                            <i class="fa fa-home"></i>
                            <span>Home</span>
                            </a>
                        </li>
                        <li class="mt">
                            <a class="active dcjq-parent" href="/consultas">
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
              </div>
            );
        }
    }
  }

  export default Consultas;