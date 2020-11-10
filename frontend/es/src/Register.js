import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { Cookies } from 'react-cookie';
import FacebookLogin from 'react-facebook-login';

class Register extends React.Component {
     
      constructor(props) {
        super(props);
        this.state ={
          name : "",
          loading : true,
          email : "",
          nUtente : 0,
          med : 0,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      componentDidMount(){
        const cookies = new Cookies();
        console.log();
        if(cookies.get('valid')==1){
          window.location.href='./';
        }else{
         this.setState({loading:false});
         this.setState({name:cookies.get('name') , email:cookies.get('email')});
        }
      }

        handleChange(event) {   
           this.setState({nUtente: event.target.value});  
        }

        handleChange2(event) {   
            if(this.state.med==0){
                this.setState({med:1});
            }else{
                this.setState({med:0});
            }
        }

      handleSubmit(event) {
        const cookies = new Cookies();
        fetch('http://localhost:3001/add?e=' + this.state.email + "&u=" + this.state.nUtente + "&m=" + this.state.med)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          cookies.set('valid', 1);
          cookies.set('nUtente', this.state.nUtente);
          cookies.set('med', this.state.med);
          window.location.href='./';
        });
        event.preventDefault();
      }
    render() {
        if(this.state.loading){
          return (<h1>loading......</h1>)
        }else{
         
       
            return (
                <div id="login-page">
                    <div class="container">
                    <form class="form-login" >
                        <h2 class="form-login-heading">Registo</h2>
                        <div class="login-wrap">
                                <br/>
                                <br/>
                                <h4 class="mt">{this.state.name}</h4>
                                <h4 class="mt">{this.state.email}</h4>
                                <br/>
                                <input onChange={this.handleChange} value={this.state.nUtente} type="text" class="form-control" placeholder="NºUtente" autofocus=""/> 
                                <br/>
                               
                                <h4> <span class="check"><input type="checkbox" class="checked" onChange={this.handleChange2}/></span><a> Médico</a></h4>
                                
                                <hr/>
                                <button class="btn btn-theme btn-block" onClick={this.handleSubmit}> Guardar</button> 
                                
                        </div>
                        
        
                     </form>
                </div>
              </div>
                );
          }
        }
        
       
    
  }

  export default Register;