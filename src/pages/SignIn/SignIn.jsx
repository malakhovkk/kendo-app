import React from 'react';
import './SignIn.css';
import FormMain from "../../components/FormMain";

export default function SignIn() {
  return (
    <div className="container">

      <div className="login-wrapper">
        <img className="logo" src="./vinopark.png"/>
        <FormMain/>
      </div>
      
    </div>
  )
}
