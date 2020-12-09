import React from 'react';
import { Cookies } from 'react-cookie';
import FacebookLogin from 'react-facebook-login';


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
        console.log();
        if(cookies.get('valid')===1){
          window.location.href='./';
        }else{
         this.setState({loading:false});
        }
      }

      Login = e => {
        const cookies = new Cookies();
        cookies.set('name', 'joao');
        window.location.href='./';
      }

    
    render() {
      const responseFacebook = (response) => {
        const cookies = new Cookies();
        cookies.set('name', response.name);
        cookies.set('foto', response.picture.data.url);
        cookies.set('email', response.email);
        cookies.set('token', response.token);
        console.log(response);
        fetch('http://localhost:3001/verify?email=' + response.email)
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
        if(this.state.loading){
          return (<h1>loading......</h1>)
        }else{
         
       
            return (
                <div id="login-page">
                    <div class="container">
                    <form class="form-login" >
                        <h2 class="form-login-heading">sign in now</h2>
                        <div class="login-wrap">
                                <br/>
                                <br/>
                                <FacebookLogin
                                  appId="861638111331940"
                                  autoLoad={true}
                                  fields="name,email,picture"
                                  callback={responseFacebook}
                                  cssClass="btn btn-theme btn-block"
                                  icon="fa-facebook"
                                /> <hr/>
        
                                
                        </div>
                        
        
                     </form>
                </div>
              </div>
                );
          }
        }
        
       
    
  }

  export default Login;