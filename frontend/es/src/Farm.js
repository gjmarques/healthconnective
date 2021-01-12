import React from 'react';
import { Cookies } from 'react-cookie';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import { Icon, map } from "leaflet";
import Clock from 'react-live-clock';
import configRest from './config.json';


export const icon = new Icon({
    iconUrl: "https://www.pinclipart.com/picdir/big/17-171343_maps-clipart-map-pin-google-maps-marker-blue.png",
    iconSize: [25, 40]
  });

  export const icon2 = new Icon({
    iconUrl: "https://www.clker.com/cliparts/M/V/V/f/0/b/google-maps-marker-for-residencelamontagne.svg.hi.png",
    iconSize: [25, 40]
  });

  export const icon3 = new Icon({
    iconUrl: "https://www.clker.com/cliparts/R/B/J/Z/k/m/map-marker-hi.png",
    iconSize: [25, 40]
  });

  export const icon4 = new Icon({
    iconUrl: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
    iconSize: [40, 40]
  });

class Farm extends React.Component {
     
    constructor(props) {
        super(props);
 
        this.state ={
            name : "",
            loading : true,
            lat :0,
            long: 0,

            farmdata : [],
            dentistadata :  [],
            fisiodata :  [],
            hospitaldata :  [],



            foto : "",

            farm : true,
            dentista : true,
            fisio : true,
            hospital : true,
          };

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleChange4 = this.handleChange4.bind(this);
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
        this.setState({name:cookies.get('name'), foto: cookies.get('foto')})

        if(cookies.get('valid')!=1){
          window.location.href='./login';
        }else{
             navigator.geolocation.getCurrentPosition((position) => {
                this.setState({lat: position.coords.latitude, long: position.coords.longitude});
                
             fetch(configRest.Directory+ '/get?distance=30000&lat='+position.coords.latitude + '&lon=' + position.coords.longitude)
                .then(response => response.json())
                .then((data) => {
                    var sfarmdata = []
                    var sdentdata = []
                    var sfisiodata = []
                    var shospdata = []
                    console.log(configRest.Directory+ '/get?distance=30000&lat='+position.coords.latitude + '&lon=' + position.coords.longitude);
          
                    data.map( (d) => {
                       
                        d.tokens.map((s)=>{
                            if(s == "pharmacy"){ sfarmdata.push(d); this.setState({farmdata : sfarmdata});}
                            if(s == "dentist") {sdentdata.push(d); this.setState({dentistadata : sdentdata});}
                            if(s == "fisiotherapist") {sfisiodata.push(d); this.setState({fisiodata : sfisiodata});}
                            if(s == "hospital") {shospdata.push(d); this.setState({hospitaldata : shospdata});}
                        });
                        
                    } )
                        this.setState({ loading:false})
    

                    
                });
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

      handleChange(event) {   
        if(this.state.farm){
            this.setState({farm:false});
        }else{
            this.setState({farm:true});
        }
    }

    handleChange2(event) {   
        if(this.state.dentista){
            this.setState({dentista:false});
        }else{
            this.setState({dentista:true});
        }
    }

    handleChange3(event) {   
        if(this.state.fisio){
            this.setState({fisio:false});
        }else{
            this.setState({fisio:true});
        }
    }

    handleChange4(event) {   
        if(this.state.hospital){
            this.setState({hospital:false});
        }else{
            this.setState({hospital:true});
        }
    }

    render() {
        const cookies = new Cookies();
       console.log(this.state);

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
                              <i class="fa fa-calendar-o"></i>
                              <span>Home</span>
                              </a>
                          </li>
                        
                          <li class="mt">
                              <a class="active dcjq-parent"  href="/Farm">
                              <i class="fa fa-map-marker"></i>
                              <span>Nearby</span>
                              </a>
                          </li>

                          <li class="mt">
                          <a href="/Receitas">
                              <i class="fa fa-medkit"></i>
                              <span>Prescriptions</span>
                              </a>
                          </li>
                        <li class="mt">
                        <br/>
                        <br/>
                        </li>
                        </ul>
                    </div>
                </aside>  

                {this.state.loading || this.state.lat==0 ?  
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
                    <h3><i class="fa fa-angle-right"></i> Nearby</h3>
                    <div class="row mt">
                    <div class="col-lg-12">
                    <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4 mb">
                    <MapContainer 
                        center={[this.state.lat, this.state.long]} zoom={13} scrollWheelZoom={false}
            
                    
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {this.state.farm ?
                            this.state.farmdata.map((data) =>
                            <Marker 
                                position={[data.location.lat, data.location.lon]}
                                icon={icon}
                            >
                                <Popup>
                                 <a href={"https://www.google.com/search?q=" +data.name}  target="_blank">{data.name}</a>
                                </Popup>
                            </Marker>
                            )
                            
                        :
                        <div></div>
                        }

                        {this.state.dentista ?
                         this.state.dentistadata.map((data) =>
                            <Marker 
                                position={[data.location.lat, data.location.lon]}
                                icon={icon2}
                            >
                                <Popup>
                                <a href={"https://www.google.com/search?q=" +data.name} target="_blank">{data.name}</a>
                                </Popup>
                            </Marker>
                         )
                         
                    
                        :
                        <div></div>
                        }

                        {this.state.fisio ?

                         this.state.fisiodata.map((data) =>
                             <Marker 
                                    position={[data.location.lat, data.location.lon]}
                                    icon={icon3}

                                
                                >
                                    <Popup>
                                    <a href={"https://www.google.com/search?q=" +data.name} target="_blank">{data.name}</a>
                                    </Popup>
                                </Marker>
                            )
                            
                        :
                        <div></div>
                        }

                            {this.state.hospital ?

                            this.state.hospitaldata.map((data) =>
                                <Marker 
                                    position={[data.location.lat, data.location.lon]}
                                    icon={icon4}

                                
                                >
                                    <Popup>
                                    <a href={"https://www.google.com/search?q=" +data.name} target="_blank">{data.name}</a>
                                    </Popup>
                                </Marker>
                            )
                            
                            :
                            <div></div>
                            }
                        
                        
                    </MapContainer>
                    </div> 
                    <div class="col-lg-4 col-md-4 col-sm-4 mb">
                    </div> 
                    <div class="col-lg-2 col-md-4 col-sm-4 mb"></div>
                    <div class="col-lg-2 col-md-4 col-sm-4 mb">
                        
                        <div class="product-panel-2 pn">
                        <br/>
                        <h1 class="mt"><a >Hide</a></h1>
                        <h4> <span class="check"><input type="checkbox" class="checked" onChange={this.handleChange} /></span>  <font style={{ color: '#6991FD', fontWeight: 'bold' }}>Pharmacies</font></h4>
                        <h4> <span class="check"><input type="checkbox" class="checked" onChange={this.handleChange2} /></span>  <font style={{ color: '#FDF569', fontWeight: 'bold' }}>Dentist</font></h4>
                        <h4> <span class="check"><input type="checkbox" class="checked" onChange={this.handleChange3} /></span>  <font style={{ color: '#956CFF', fontWeight: 'bold' }}>Physiotherapist</font></h4>
                        <h4> <span class="check"><input type="checkbox" class="checked" onChange={this.handleChange4} /></span>  <font style={{ color: '#f73838', fontWeight: 'bold' }}>Hospital</font></h4>
                        
                        
                        </div>
                        </div>  
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
