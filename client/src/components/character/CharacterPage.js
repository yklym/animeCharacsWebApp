import React, { Component } from "react";
import axios from 'axios';
import ModalDelete from "../widgets/ModalDelete"
import { Link } from "react-router-dom";
import HeaderLinks from "../HeaderLinks.js"
import {getCurrUserObj} from "../myTools"
class CharacterPage extends Component {
    
    constructor( props ) {
        super( props );
        let queryStrArr = this.props.location.pathname.split("/");
        let characId = queryStrArr[queryStrArr.length - 1];
        
        
        let currUser = getCurrUserObj();
        this.state = {
          userId : currUser._id,
          userRole: currUser.role,
          tgLogin: currUser.tgLogin,
          characId : characId
        };
        this.cancel="";
      }
      componentDidMount(){
        this.fetchSearchResults();
      }
    
      fetchSearchResults = () => {
        const searchUrl = `/api/v1/characters/${this.state.characId}`;
        
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
              character: res.data  
            });
          })
          .catch((error) => {
          });
        };

  handleSubscription = ()=>{
    return fetch("/api/v1/createSubscription", {
            method: 'post',
            headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({characId : this.state.character._id,
              userId: this.state.userId
            })

        }).then(resp => {
            console.log(resp);
            return resp.json();
        }).then(data=>{
          console.log(data);
          this.setState({
              character: data  
            });
        })
  }

  handleUnSubscription = ()=>{
    return fetch("/api/v1/deleteSubscription", {
            method: 'post',
            headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              {
              characId : this.state.character._id,
              userId: this.state.userId
            })

        }).then(resp => {
            console.log(resp);
            return resp.json();
        }).then(data=>{
          console.log(data);
          this.setState({
              character: data  
            });
        })
  }

  renderTgButton = ()=>{
    if(this.state.character.subscribers.includes(this.state.userId)){
      return <div className="adminButtons">
      <p>User Buttons:</p>
      <button type="button" className="btn btn-danger"onClick = {this.handleUnSubscription} >Unsubscribe</button>
    </div>
    } else {
      return <div className="adminButtons">
      <p>User Buttons:</p>
      <button type="button" className="btn btn-primary" onClick = {this.handleSubscription}>Subscribe</button>
    </div>
    }
  }


  render() { 
    if(!this.state.character){
      return <div><h1>ERROR</h1></div>
    }
    const charac = this.state.character;
    return <div>
      <HeaderLinks/>
      <main>
    <h2>{`${charac.fullname}`}</h2>
    <div className="entitiy-page-wrapper">

        <div className="entity-page-image">
            <img src={charac.image} alt=""/>
        </div>

        <div className="entity-page-info">
            <div className="table">
                <table>
                  <tbody>

                    <tr>
                        <td>name:</td>
                        <td>{charac.name}</td>
                    </tr>
                    <tr>
                        <td>fullname:</td>
                        <td>{charac.fullname}</td>
                    </tr>
                    <tr>
                        <td>Was added:</td>
                        <td>{new Date(charac.addedAt).toDateString()}</td>
                    </tr>
                    </tbody>

                </table>
            </div>
            <div className="table">
                <table>
                  <tbody>
                    <tr>
                        <td>Age:</td>
                        <td>{charac.age}</td>
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

            <h3>Character Bio</h3>
        <div className="entity-page-main">
            {charac.description}
        </div>
        

        

       
        <h3>Photo collection:</h3>
        

        <div className="entity-page-footer">
            <p>Some other text and abilities here without border and block</p>
        </div>

        {this.state.tgLogin ? this.renderTgButton() : <></>}


        {this.state.userRole===1 
        ? <div className="adminButtons">
            <p>Admin abilities:</p>
            
            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModalCenter">
              Delete charac</button>

              <button type="button" className="btn btn-warning"><Link to={`/updateCharacter/${charac._id}`}>Update charac</Link></button>
          </div> 
        : <></>}


    </div>



</main>
    {this.state.userRole===1 ? <ModalDelete entityName={`character ${charac.name}`}
                                            targetApiUrl={`/api/v1/characters/${charac._id}`}
                                            returnLink={`/characters`}
    /> : <></>}
</div>
  }
};

export default CharacterPage;

// PHOTO GALLARY
// <div className="entity-page-photo-collection">

//<div className="entity-page-image">
//{/* {{! <img src="../images/maushi1.jpeg" alt=""> }} */}
//</div>
//<div className="entity-page-image">
//{/* {{! <img src="../images/maushi2.jpeg" alt=""> }} */}
//</div>
//<div className="entity-page-photo-collection">

//</div> 
// </div>