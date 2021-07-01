import './App.css';
import {MicrophoneIcon, SearchIcon } from '@heroicons/react/outline'
import { useState, useEffect } from 'react';
import axios from "axios";
import firebase from './firebase'


function App() {

  //using react hooks
  const [url, setUrl] = useState(""); 
  const [number, setNumber] = useState(); 
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState();
  const [showLogin, setshowLogin] = useState(false);



  const handleLogout = (e) => {
    // e.preventDefault();
    // firebase.auth.signOut()
    // .then(() => {
    //   alert('uuser has successfully logged out');
    // })
  }
  // useEffect(() => {
  //   firebase.auth.onAuthStateChanged(user =>{
  //     if(user) {
  //       console.log(user);
  //     }
  //     else{
  //       console.log("not logged in");
  //     }
  // })
    
  // }, [])
  

  //handling the API calls
  const handleSubmit = async(event) => {
    event.preventDefault();
    setshowLogin(true)
}



  //handling the onchange events
  const handleChange = (event) =>{
    setUrl(event.target.value);
  }

  const configureCaptcha = () =>{
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
        console.log("verified");
      },
      defaultCountry: 'IND'
    });
  }


  const onSignInSubmit = (e) => {
    e.preventDefault();
    //calling recaptcha
    configureCaptcha();

    const phoneNumber = "+91" + number;
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          console.log("Otp sent!")
          alert('OTP has been sent');
          // ...
        }).catch((error) => {
          // Error; SMS not sent
          console.log("SMS error",error);
        });
  }

  const onSubmitOtp = (e) => {
    e.preventDefault();
    const code = OTP;
    window.confirmationResult.confirm(code).then((result) => {
      // User signed in successfully.
      const user = result.user;
      console.log(JSON.stringify(user));
      alert("User is verified")
      setshowLogin(false)

      //calling the API
      axios.get(`http://localhost:5000/monitorurl?url=${url}&email=${email}`)
    .then(response => {
      console.log(response)
    })
    .catch(error => {
      console.log(error)
    })
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
    });
  }

  // function sendEmail(e){
  //   e.preventDefault();
  //   emailjs.sendForm('service_0itqh7d', 'template_1ig71cm', e.target, 'user_CrKcj2LJr4LH0bMkQRcVD')
  //   .then((result) => {
  //       console.log(result.text);
  //   }, (error) => {
  //       console.log(error.text);
  //   });
  // } 


  return (
    <div >
      <head>
        <title>Google2.0</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </head>
    {/* header-section */}
    <header className="flex w-full p-5 justify-between text-sm text-gray-700">
    {/* div left */}
      <div className="flex space-x-4 items-center">
        <p className="link">About</p>
        <p className="link">Store</p> 

      </div>
    {/* DIV RIGHT */}
      <div className="flex space-x-4 items-center">
        <p className="link">Gmail</p>
        <form onSubmit={handleLogout}> 
        <button className="btn" id="sign-in-button" >Logout</button>
        </form>

    {/* icons */}
      </div> 
     
    </header>
    
    {/* body-section */}
    <form className="flex flex-col items-center mt-44 flex-grow" >
      <img
        src="https://www.google.co.uk/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
        width={300}
        height={100}
        />

        <div className="flex w-full mt-5 hover:shadow-lg focus-within:shadow-lg max-w-md rounded-full border border-gray-200 px-5 py-3 items-center sm:max-w-xl">
          <SearchIcon 
            className="h-5 mr-3 text-gray-500"
          />
          <input type="text" name="url" className="focus:outline-none flex-grow " value={url} onChange={handleChange}/>
          <MicrophoneIcon className="h-5" />

        </div>

        {/* buttons */}
        <div className="flex flex-col w-1/2 space-y-2 justify-center mt-8 sm:space-y-0 sm:flex-row sm-x-4">
        <button onClick={handleSubmit} className="btn">Monitor</button>
        </div>
      
    </form>
    
    <div className="lex flex-col items-center pl-44 flex-grow" style={{display: showLogin ? 'flex' : 'none'}}>
   
        <form className="flex flex-col items-center  flex-grow" onSubmit={onSignInSubmit}>
          <div  id="sign-in-button "></div>
          <div className="flex w-full mt-5 hover:shadow-lg focus-within:shadow-lg max-w-md rounded-full border border-gray-200 px-5 py-3 items-center sm:max-w-xl">

          <input className="focus:outline-none flex-grow"  type="number" name="number" placeholder="Mobile number" value={number} required onChange={(e) => setNumber(e.target.value)}/>
          <MicrophoneIcon className="h-5" />

        </div>
        <div className="flex w-full mt-5 hover:shadow-lg focus-within:shadow-lg max-w-md rounded-full border border-gray-200 px-5 py-3 items-center sm:max-w-xl">

          <input className="focus:outline-none flex-grow"  type="email" name="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)}/>
          <MicrophoneIcon className="h-5" />

        </div>
        <div className="flex flex-col w-1/2 space-y-2 justify-center mt-8 sm:space-y-0 sm:flex-row sm-x-4">
        <button className="btn" type="submit">Submit</button>
        </div>
          
        </form>

        
        <form className="flex flex-col items-center  flex-grow" onSubmit={onSubmitOtp}>
        
        <div  id="sign-in-button "></div>
          <div className="flex w-full mt-5 hover:shadow-lg focus-within:shadow-lg max-w-md rounded-full border border-gray-200 px-5 py-3 items-center sm:max-w-xl">

          <input className="focus:outline-none flex-grow" type="number" name="otp" placeholder="OTP Number" value={OTP} required onChange={(e) => setOTP(e.target.value)}/>
          <MicrophoneIcon className="h-5" />

        </div>
        <div className="flex flex-col w-1/2 space-y-2 justify-center mt-8 sm:space-y-0 sm:flex-row sm-x-4">
        <button className="btn" type="submit">Submit OTP</button>
        </div>
        </form>
      </div>
    {/* footer-section */}
    
     
    </div>
  );
}

export default App;
