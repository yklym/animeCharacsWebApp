import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import HeaderLinks from "./HeaderLinks";


class ErrorBlock extends Component{
  render(){
        
          return <div className="alert alert-danger">
                <strong> 
                  <h3>Wrong inputs!</h3>
                <ul>
                  {this.props.loginErr ? <li>Login is not unique</li> : <></>}
                  {this.props.passErr  ? <li>Passwords are different</li> : <></>}
                </ul>
                </strong>
          </div> 
  }
}

class LoginPage extends Component {
    constructor( props ) {
        super( props );
        this.state = {
          login: "",
          fullname: "",
          password1: "",
          password2: "",
          redirect: false,
          loginErr: false,
          passErr: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);


      }

      handleSubmit = event => {

        event.preventDefault()

        if(this.state.password1 !== this.state.password2){
          this.setState({passErr: true});
          return;
        }

        const userData = this.state;
        
        return fetch("/api/v1/auth/register", {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)

        }).then(resp => {
            if(resp.status === 400){
              this.setState({loginErr : true});
              throw new Error("login is not unique");
            } else {    
              this.setState({redirect: true});
            }
        }).catch(err=>{console.log(err);})
      }
     
    handleChange = event => {
        this.setState({
        [event.target.name]: event.target.value,
        loginErr:false,
        passErr:false
    });
    }
    

    render() {
        let userRole;
        if(this.state.redirect){
            return <Redirect to='/'/>;
        }
            return <div>            
              <HeaderLinks/>
            <main className="loginFormMain">
            
            <form className= "register">
                <div className="container">
                  <h1>Register</h1>
                  <p>Please fill in this form to create an account.</p>
                  
                  <hr/>
              
                  <label>
                      <b>Login</b>
                      <input type="text" placeholder="Enter Login" maxLength="20" name="login" value={this.state.login} onChange={this.handleChange} required pattern="^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$" ></input>
                  </label>
                  
        
                  <label>
                      <b>Fullname</b>
                      <input type="text" placeholder="Enter Fullname" maxLength="20" name="fullname" value={this.state.fullname} onChange={this.handleChange} required pattern="^(\w\w+)\s(\w+)$"></input>
                  </label>
                  
              
                  <label >
                      <b>Password</b>
                     <input type="password" placeholder="Enter Password" maxLength="20" name="password1" value={this.state.password1}  onChange={this.handleChange} required pattern="^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"></input>
                  </label>

                   <label >
                      <b>Password</b>
                  <input type="password" placeholder="Enter Password" maxLength="20" name="password2" value={this.state.password2} onChange={this.handleChange} required pattern="^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"></input>
                  </label>
              
                  
                  <hr/>
                  {(this.state.loginErr || this.state.passErr)
                  ? <ErrorBlock loginErr={this.state.loginErr} passErr={this.state.passErr} />
                  : <></>
                  }
                  <hr/>
                  
                  <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>
                  <button type="submit" className="registerbtn" onClick ={this.handleSubmit}>Register</button>
                </div>
                
                <div className="container signin">
                  <p>Already have an account? <Link to="/auth/login">Sign in</Link>.</p>
                </div>
              </form>
        
          </main>
          </div>
    }
  }
  
  export default LoginPage;

