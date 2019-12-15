import React, {Component} from 'react'
import axios from 'axios';
import { Redirect } from "react-router-dom";






class DeleteModal extends Component{
  constructor( props ) {
    super( props );

    this.state = {    
      redirect:false,
    };
    this.cancel="";
  }

  deleteClickHandler = event =>{
    this.fetchSearchResults();
  }



  fetchSearchResults = () => {
        
    const searchUrl = this.props.targetApiUrl;
    
    if (this.cancel) {
      this.cancel.cancel();
    }
    this.cancel = axios.CancelToken.source();
    fetch(searchUrl, {
      method : "delete",
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
    },}).then((res) => {
      
         this.setState({
          redirect: true  
        });
      })
    };
  
    render() {
      if(this.state.redirect){
        return <Redirect to={this.props.returnLink}/>
      }
      
      return <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle">Confirm action</h5>
          
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>

        </div>
          <div className="modal-body">
            Are you sure to delete {this.props.entityName}?
          </div>
          <div className="modal-footer">
          
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
  
          <div>
            
              <input type="button" name="delete Char" data-dismiss="modal" className="btn btn-danger"value="Delete Char" onClick={this.deleteClickHandler} /> 
            
          </div>
      
        </div>
      </div>
    </div>
  </div>
    }
}

export default DeleteModal;