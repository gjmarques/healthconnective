import React from 'react';
import 'react-calendar/dist/Calendar.css';
import './App.css';


class Chat_room extends React.Component {

      componentDidMount(){
        const script1 = document.createElement('script');
        
        script1.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.3/socket.io.js";
        script1.async = true;
        document.body.appendChild(script1);

       
        const script2 = document.createElement('script');
        
        script2.src = "lib/VideoCall/chat.js";
        script2.async = true;
        document.body.appendChild(script2);


        const script3 = document.createElement('script');
        
        script3.src = "https://cdn.socket.io/socket.io-3.0.1.min.js";
        script3.async = true;
        document.body.appendChild(script3);

      }

      
     

    render() {

    
            return (
           
                <div>
               
               

                        <div id="video-chat-room">
                            <video id="user-video"></video>
                            <video id="peer-video"></video>
                        </div>

            
                </div>
            );
        
    }
  }

  export default Chat_room;