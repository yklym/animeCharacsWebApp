import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import HeaderLinks from "./HeaderLinks";



class LoginPage extends Component {
    constructor( props ) {
        super( props );
        this.state = {
          username: "",
          password: "",
          redirect: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);


      }

      handleSubmit = event => {
        event.preventDefault()
        console.log("HANDLE FORM SUBMIT");

        const userData = { username :this.state.username, password:this.state.password }
        
        return fetch("/api/v1/auth/login", {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)

        }).then(resp => {
            console.log(resp);
            return resp.json();
        })
          .then(data => {
              console.log("DATA:");
              console.log(data.response.token);
            if (data.message) {
            //  @TODOтут ваша логика
            } else {
                localStorage.setItem("token", data.response.token);
                this.setState({redirect: true});
            }
          }).catch(err=>{console.log(err);})
      }
     
    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    }
    

    render() {
        let userRole;
        console.log("RENDERING LOGIN PAGE");
        if(this.state.redirect){
            console.log("LOGIN PAGE REDIRECT IS TRUE");
            return <Redirect to='/'/>;
        }
        // if(localStorage.token){
        //     console.log("LOGIN PAGE RENDER TOKEN IN STOR");
        //     return <Redirect to='/'/>;
        // }
            return <div>
            <HeaderLinks/>
            <main className="loginFormMain">

                <form className= "register" onSubmit={this.handleSubmit}>
                    <div className="container">
                        <h1>Login</h1>
                        <p>Please fill in this form to login.</p>
                        <hr/>
                
                        <label for="email"><b>login</b></label>
                        <input type="text" placeholder="Enter login" name="username" maxlength="10" 
                        required
                        value={this.state.username}
                        onChange={this.handleChange}/>
                
                        <label for="psw"><b>Password</b></label>
                    
                        <input type="password" placeholder="Enter Password" maxlength="15" name="password" 
                        value={this.state.password}
                        onChange={this.handleChange} 
                        required />

                    <button type="submit" className="registerbtn" >Login</button>
                    </div>
            
                </form>
        </main>          
    </div>
    }
  }
  
  export default LoginPage;

