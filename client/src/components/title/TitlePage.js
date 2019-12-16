import React, { Component } from "react";
import axios from 'axios';
import ModalDelete from "../widgets/ModalDelete"
import { Link, Redirect } from "react-router-dom";
import HeaderLinks from "../HeaderLinks.js"
import {getCurrUserObj} from "../myTools"

class AdminTableElement extends Component{
  constructor( props ) {
    super( props );
    this.state = {
        charac : this.props.character,
    };
    this.cancel="";

  }
  addCharClickHandler = event => {
    event.preventDefault();    
    // /admin/title/deleteCharac/:characId
    this.cancel = axios.CancelToken.source();

    const searchUrl = `/api/v1/admin/title/addCharac/${this.props.character._id}`;
        fetch(searchUrl, {
          method : "post",  
          cancelToken: this.cancel.token,
          headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          })
          .then((res) => {
            this.props.rerender();
          })
          .catch((error) => {
          });
  }
  deleteCharClickHandler = event => {
    event.preventDefault();    
    const searchUrl = `/api/v1/admin/title/addCharac/${this.props.character._id}`;
        axios
          .post(searchUrl, {

            headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          })
          .then((res) => {
             this.setState({
              status: res.status  
            });
          })
          .catch((error) => {
          });
  }
  // /admin/title/deleteCharac/{{_id}}
  render(){
    return  <tr>
    <td><Link to ={`/characters/${this.props.character._id}`}>{this.props.character.name}</Link></td>
    <td>{this.props.character.alias}</td>
    <td>{this.props.character.titles[0]}</td>
    <td>
    { this.state.charac.titles.includes(this.props.titleId)
        ?<form action="/admin/title/deleteCharac/{{_id}}" method = "POST" onSubmit={this.deleteCharClickHandler}>
        <p style={{display:"none"}}>B </p>
        <input type="submit" className="btn btn-danger" value="Delete char" />

        </form>

        :<form action="/admin/title/addCharac/{{_id}}" method = "POST" onSubmit={this.addCharClickHandler}>
        <p style={{display:"none"}}>A </p>
        <input type="submit" className="btn btn-primary" value="Add char" />

    </form>
        
    }    
    </td>
  </tr>

  }
}

class AdminTable extends Component{
  constructor( props ) {
    super( props );
    this.state = {
      characters : [],
      titleId : this.props.titleId,          
    };
    
  }
  componentDidMount(){
    const searchUrl = `/api/v1/charactersGetAll`;
        axios
          .get(searchUrl, {
            headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          })
          .then((res) => {

             this.setState({
              characters: res.data  
            });
          })
          .catch((error) => {
          });

  }
  rerenderTable = () =>{
    const searchUrl = `/api/v1/charactersGetAll`;
        axios
          .get(searchUrl, {
            headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          })
          .then((res) => {

             this.setState({
              characters: res.data  
            });
          })
          .catch((error) => {
          });

  }
  renderSearchResults = () => {
    const results = this.state.characters;
    
    
    if (results && Object.keys(results).length && results.length) {

      const cardsArray = results.map(charac=>{
        return <AdminTableElement titleId={this.props.titleId} character={charac} rerender={this.rerenderTable}/>
      });
    return <tbody>{cardsArray}</tbody>
    
    } else {
        return <thead><tr>
        <th>  No characs</th></tr></thead>
    }
  };

  render() {
    return <div style = {{width : "80%"}}>
    <button data-toggle="collapse" data-target="#adminCollapse" className= "btn-success">Admining</button>
    <div id="adminCollapse" className="collapse show">

        <div className="container" width="100%">
            <table className="table table-striped table-bordered" id="dataTable" width="100%" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Alias</th>
                        <th>Title Example</th>
                        <th>Action</th>

                    </tr>
                </thead>
                { this.renderSearchResults() }
                
            </table>
        </div>
    </div>
</div>
  }
}
class TitlePage extends Component {
    
    constructor( props ) {
        super( props );
        let queryStrArr = this.props.location.pathname.split("/");
        let titleId = queryStrArr[queryStrArr.length - 1];
        
        
        let currUser = getCurrUserObj();;

        this.state = {
          userRole: currUser.role,
          titleId : titleId          
        };
        this.cancel="";
      }
      componentDidMount(){
        this.fetchSearchResults();
      }
    
      fetchSearchResults = () => {
        const searchUrl = `/api/v1/titles/${this.state.titleId}`;
        
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
              title: res.data  
            });
          })
          .catch((error) => {
          });
        };



  render() { 
    if(!this.state.title){
      return <div><h1>ERROR</h1></div>
    }
    //console(this.state);
    const title = this.state.title;

    return <div>
      <HeaderLinks/>
      <main>
    <h2>{`${title.name}`}</h2>
    <div className="entitiy-page-wrapper">

        <div className="entity-page-image">
            <img src={title.image} alt=""/>
        </div>

        <div className="entity-page-info">
            <div className="table">
                <table>
                  <tbody>

                    <tr>
                        <td>name:</td>
                        <td>{title.name}</td>
                    </tr>
                    <tr>
                        <td>Year of publishing:</td>
                        <td>{title.yearOfPublishing}</td>
                    </tr>
                    <tr>
                        <td>Was added:</td>
                        <td>{new Date(title.addedAt).toDateString()}</td>
                    </tr>
                    </tbody>

                </table>
            </div>
            <div className="table">
                <table>
                  <tbody>
                    <tr>
                        <td>Rating:</td>
                        <td>{title.rating}</td>
                    </tr>
                    <tr>
                        <td>Characs:</td>
                        <td><Link to={`/characters?titleId=${title._id}`}>*click*</Link></td>
                    </tr>
                    <tr>
                        <td>Info:</td>
                        <td>---</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>


        <div className="entity-page-footer">
            <p>Some other text and abilities here without border and block</p>
        </div>


        {this.state.userRole===1 ?
          <div className="adminButtons">
            <p>Admin abilities:</p>
            
            <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModalCenter">
              Delete title</button>

              <button type="button" className="btn btn-warning"><Link to={`/updateTitle/${title._id}`}>Update Title</Link></button>
          </div> 
          
          : <></>}
          {this.state.userRole===1 ?
          <div className="adminButtons">
            <AdminTable titleId ={title._id}/>
          </div>
          
          : <></>}


      </div>

</main>
    {this.state.userRole===1 ? <ModalDelete entityName={`title ${title.name}`}
                                            targetApiUrl={`/api/v1/titles/${title._id}`}
                                            returnLink={`/titles`}
    /> : <></>}
</div>
  }
};

export default TitlePage;
