import React, { Component } from "react";
import { NavLink } from 'react-router-dom'
import { updateAuth} from "./myTools"



class HeaderLinks extends Component {
    constructor( props ) {
        super( props );
        
        this.state = {
            userRole : null,
            username : null,
            userId : null,
        };
        this.cancel = '';
        this.logOutHandle =this.logOutHandle.bind(this);   
      }

      componentDidMount = () =>{
        updateAuth().then(res=>{
            this.setState({
                userRole : res.role,
                username : res.username,
                userId : res._id,
            });  
        });
      }
      
      logOutHandle(ev){
          ev.preventDefault();

          localStorage.removeItem("token")
          let currUser = updateAuth();

          this.setState({
            userRole : currUser.role,
            username : currUser.username,
            userId : currUser._id,
        });
        }

    render() {
        if(this.state.userRole === 1){
            return (
            <div className="myNav">
                <NavLink exact className="navlink"  activeClassName="navlink-active"  to="/">Home</NavLink>
                <NavLink exact className="navlink"  activeClassName="navlink-active" to="/about">About</NavLink>
                <NavLink exact className="navlink" activeClassName="navlink-active" to="/users">Users</NavLink>
                <NavLink exact className="navlink" activeClassName="navlink-active" to="/characters">Characters</NavLink>
                <NavLink exact className="navlink" activeClassName="navlink-active" to="/titles">Titles</NavLink>

                <NavLink exact className="navlink login" to="/" onClick={this.logOutHandle}>Log Out</NavLink>
                <NavLink exact className="navlink login" to={`/users/${this.state.userId}`}>{this.state.username}</NavLink>
                
            </div>)} 
            else if(this.state.userRole === 0){
                return (
                <div className="myNav">
                    <NavLink exact className="navlink" activeClassName="navlink-active" to="/">Home</NavLink>
                    <NavLink exact className="navlink" activeClassName="navlink-active" to="/about">About</NavLink>
                    <NavLink exact className="navlink" activeClassName="navlink-active" to="/titles">Titles</NavLink>
                    <NavLink exact className="navlink" activeClassName="navlink-active" to="/characters">Characters</NavLink>
                    
                    <NavLink exact className="navlink login" to="/" onClick={this.logOutHandle}>Log Out</NavLink>
                    <NavLink exact className="navlink login" to={`/users/${this.state.userId}`}>{this.state.username}</NavLink>                    
                </div>)} 
            else {
                return (
                <div className="myNav">
                    <NavLink exact className="navlink" activeClassName="navlink-active" to="/">Home</NavLink>
                    <NavLink exact className="navlink" activeClassName="navlink-active" to="/about">About</NavLink>
                          
                    <NavLink exact className="navlink login" activeClassName="navlink-active" to="/auth/login">Log in</NavLink>
                    <NavLink exact className="navlink login" activeClassName="navlink-active" to="/auth/register">Sign up</NavLink>
                    
                </div>)} 
    }
  }
  
  export default HeaderLinks;

