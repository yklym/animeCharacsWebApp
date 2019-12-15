import React, { Component } from "react";
import axios from 'axios';
import ModalDelete from "../widgets/ModalDelete"
import { Link, Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode"
import HeaderLinks from "../HeaderLinks.js"
import {getUserRole, updateAuth, getCurrUserObj} from "../myTools"

class CharacterPage extends Component {
    
    constructor( props ) {
        super( props );
        
        let queryStrArr = this.props.location.pathname.split("/");
        let pageUserId = queryStrArr[queryStrArr.length - 1];
        
        let currUser = getCurrUserObj();
        this.state = {
          pageUserId : pageUserId ,
          userRole : currUser.role,
          userId : currUser._id,
          username : currUser.username,
        };
        this.cancel="";
      }
     
      componentDidMount = () => {
          this.fetchSearchResults();
      } 

      fetchSearchResults = () => {
        const searchUrl = `/api/v1/users/${this.state.pageUserId}`;
        
        if (this.cancel) {
          this.cancel.cancel();
        }

        this.cancel = axios.CancelToken.source();
        axios
          .get(searchUrl, {
            cancelToken: this.cancel.token,
            headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          })
          .then((res) => {
             this.setState({
              user: res.data  
            });
          })
        };



  render() { 
      if(!this.state.userId){
          return <Redirect to="/"/>
      }
    if(!this.state.user){
      return <div><h1>ERROR</h1></div>
    }
    const user = this.state.user;
    const content = `CONTENT HERE `
    return <div>
      <HeaderLinks/>
    <main>
        <div className="entitiy-page-wrapper">

        <div className="entity-page-image">
            <img src={user.image} alt=""/>
        </div>

        <div className="entity-page-info">
            <div className="table">
                <table>
                  <tbody>

                    <tr>
                        <td>Fullname:</td>
                        <td>{user.fullname}</td>
                    </tr>
                    <tr>
                        <td>Login:</td>
                        <td>{user.login}</td>
                    </tr>
                    <tr>
                        <td>Registration date:</td>
                        <td>{new Date(user.registeredAt).toDateString()}</td>
                    </tr>
                    </tbody>

                </table>
            </div>
            <div className="table">
                <table>
                  <tbody>
                    <tr>
                        <td>User role:</td>
                        <td>{user.role 
                            ? "Admin"
                            : "User"}</td>
                    </tr>
                    <tr>
                        <td>Info:</td>
                        <td>---</td>
                    </tr>
                    <tr>
                        <td>Info:</td>
                        <td>---</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        {this.state.pageUserId === user._id 
        ? <div className="adminButtons">
        <p>Config:</p>
        
        {/* SETTINGS */}
          <Link className="btn btn-warning" to={`/updateUser/${user._id}`}>Update info</Link>
        </div>
        : <></>
        }
        {/* ADMIN */}
        {this.state.userRole === 1 
        ? <div className="adminButtons">
        <p>Admin features:</p>
        
        {/* @todo delete user, add modal */}
        <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModalCenter">
          Delete charac</button>
          {user.role === 0 
          ?<button type="button" class="btn btn-primary">Make Admin</button> 
          :<button type="button" class="btn btn-primary">Make User</button> 
          }
          
          <Link className="btn btn-warning" to={`/updateUser/${user._id}`}>Update info</Link>
        </div>
        : <></>
        }
        
    {/* #isAdmin
      #isUserAdmin
        <div><form action = "/admin/makeAdminUser" method = "POST">
            <input type="submit" name="makeUser" className="btn btn-danger"value="Make user">
        </form> </div>
      /isUserAdmin
      ^isUserAdmin
        <div><form action = "/admin/makeUserAdmin" method = "POST">
            <input type="submit" name="makeAdmin" className="btn btn-danger"value="Make admin">
        </form> </div>
      /isUserAdmin
    /isAdmin */}
  </main>
</div>
  }
};

export default CharacterPage;

