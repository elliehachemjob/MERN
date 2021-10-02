import React, { useState,useRef,useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axios from "axios"
import "./App.css";

const App = () => {
  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const Chat = () => <div>
  <div>
      <button   className='btn5'  variant='danger' onClick={() => closeConnection()}>Leave Chat</button>
  </div>
  <div className='chat'>
      <MessageBox/>
      <SendMsgForm/>
  </div>
</div>





const MessageBox = () => {
 
  return <div className='message-box' >
      {messages.map((m) =>
          <div  className='user-message'>
              <div className='message bg-primary'>{m.message}</div>
              <div className='from-user'>{m.user}</div>
          </div>
      )}
  </div>
}


const SendMsgForm = () => {
  const [message, setMessage] = useState('');


  return(
         <div>

          <input className="css-input6" type="user" placeholder="Send your message..."
              onChange={e => setMessage(e.target.value)} value={message} />
              <button  className="btn3" onClick={()=>{  sendMessage(message); setMessage('');}} variant="primary" type="submit" disabled={!message}> Send </button>
              </div>
              )
}

  const SignUpForm = () => {

    const [user, setUser] = useState();
    const [room, setRoom] = useState("AllClients");
    const [password, setPassword] = useState("hi");
    const [sendEmailVerification ,setSendEmailVerification] = useState()



    let UpperCase = /^(?=.*[A-Z])/;
    let lowerCase = /^(?=.*[a-z])/;
    let numbers = /^(?=.*[0-9])/;
    let special = /^(?=.*[$@$!%*#?&])/;

    const signUpHandler = ()=>{

      // if (!password.match(UpperCase) || !password.match(lowerCase) || !password.match(numbers) || !password.match(special) || password.length <= 9 || password === ""  ) {
      //   alert("password must contain Upper/lower case,Numbers,Special Charachters")}


    

      axios
      .post(
        `http://localhost:5000/register`,
        {
          email: user,
          password:password
        },
     
      )
      .then((res) => {
        console.log(` data is ${res.data}`)  
        if(res.data===1){
          alert("register success")
          joinRoom(user, room)
        }   
        else{
         alert("email already exist")
        }
      })
      .catch((e) => {
        console.log(e)
        if(e){
          alert("already exist")
        }
      });
       }

      



      const loginHandler = ()=>{

        // if (!password.match(UpperCase) || !password.match(lowerCase) || !password.match(numbers) || !password.match(special) || password.length <= 9 || password === ""  ) {
        //   alert("password must contain Upper/lower case,Numbers,Special Charachters")}
  
     
  
        axios
        .post(
          `http://localhost:5000/login`,
          {
            email: user,
            password:password
          },
       
        )
        .then((res) => {
      
          if(res.data===1){
            alert("sucess ")
            joinRoom(user, room)
          }
          else{
            alert("email is not found ")
            
          }

        })
        .catch((e) => {

          console.log(e);
        });
         }
 

    return (
          <div className="form">
            <input className="css-input1"placeholder="email" onChange={e => setUser(e.target.value)} />
            <input className="css-input2"placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <input className="css-input3" placeholder="email" onChange={e => setUser(e.target.value)} />
            <input className="css-input4" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <input className="css-input5" placeholder="Send Email Veirifcation" onChange={e => setSendEmailVerification(e.target.value)} />
        <button  className="btn1"  onClick ={signUpHandler}  variant="primary" type="submit" disabled={!user || !room || !sendEmailVerification}>Sign Up</button>
        <button   className="btn2" onClick={loginHandler}  variant="primary" type="submit" disabled={!user || !room }>Login</button>
        </div>
    )
    
}

  const joinRoom = async (user, room) => {
    try {
    
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:44382/chat") 
        .build();

      connection.on("ReceiveMessage", (user, message) => {
     
        setMessages((messages) => [...messages, { user, message }]);
      });

     

      connection.onclose((e) => {
  
        setConnection();
        setMessages([]);
        setUsers([]);
      });


      await connection.start();
      await connection.invoke("JoinRoom", { user, room }); 
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };


  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message); 
    } catch (e) {
      console.log(e);
    }
  };


  const closeConnection = async () => {
    try {
      await connection.stop();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="app">
      <h2>Real Time Chat App</h2>
      <hr className="line" />
      { 
     
        !connection ? (
          <SignUpForm joinRoom={joinRoom} /> 
        ) : (
          <Chat
            sendMessage={sendMessage}
            messages={messages}
            users={users}
            closeConnection={closeConnection}
          />
        ) 
      }
    </div>
  );
};

export default App;
