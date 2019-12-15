import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import HeaderLinks from "../HeaderLinks";

class UpdateUserPage extends Component {
    constructor( props ) {
        super( props );

        this.fileInput = React.createRef();

        this.state = {
          login: "",
          fullname: "",
          image: undefined,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
      }

    componentDidMount(){
        let queryStrArr = this.props.location.pathname.split("/");
        let userId = queryStrArr[queryStrArr.length - 1];
    
        const searchUrl = `/api/v1/users/${userId}`;
    
        fetch(searchUrl, {
            method: "get",
            headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          }).then(row=>row.json())
          .then((res) => {
             this.setState({
              targetUser: res,
              tgLogin :res.tgLogin, 
              login: res.login,
              fullname: res.fullname,
              imageUrl : res.image,
              chatId : res.chatId,
              subscribes : res.subscribes,
            });
          })
          .catch((error) => {
          });
        }

    handleSubmit = event => {
        event.preventDefault()
        
        const userData = {
            password : this.state.targetUser.password,
            registeredAt : this.state.targetUser.registeredAt,
            fullname: this.state.fullname,
            login: this.state.login,
            tgLogin : this.state.tgLogin,
            chatId : this.state.chatId,
            image: this.state.image,
            imageUrl:  this.state.imageUrl,
            subscribes : this.state.subscribes
        }
        
        const formData  = new FormData();

        for(const name in userData) {
            formData.append(name, userData[name]);
        }

        return fetch(`/api/v1/users/${this.state.targetUser._id}`, {
            method: 'put',
            headers: {
            'Authorization': `Bearer ${localStorage.token}`,
        },
            body: formData
        }).then(resp => {
            return resp.json();
        })
          .then(data => {
              this.setState({redirect: data._id});
          }).catch(err=>{console.log(err);})
      }
   
  handleChange = event => {
      this.setState({[event.target.name]: event.target.value});
  }
  
  handleFileInput = e =>{
      const files = Array.from(e.target.files);      
      this.setState({
        image : files[0],
        imageUrl : URL.createObjectURL(files[0]),
    });

  }
  cancelUpdateHandler = (event)=>{
        event.preventDefault();
      this.setState({redirect: `${this.state.targetUser._id}`})
  }

  render() {
    if(this.state.redirect){
        return <Redirect to={`/users/${this.state.redirect}`}/>;
    }
    
    return <div> <HeaderLinks/> 
      <main>
    <form className= "new-charac-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>
    <div className="new-charac-input-div">

    <div className="form-group-big">

        <div className="form-group">
            <label>
                Fullname:
                <input type="text" className="form-control" value={this.state.fullname} name="fullname" onChange={this.handleChange} required pattern="^(\w\w+)\s(\w+)$"/>
            </label>
        </div>

    <div className="form-group">
        <label >Login:
            <input type="text"  className="form-control" value={this.state.login} name="login" onChange={this.handleChange} required pattern="^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"/>
        </label>
    </div>
    <div className="form-group">
        <label >Telegramm Login:
            <input type="text"  className="form-control" value={this.state.tgLogin} name="tgLogin" onChange={this.handleChange} pattern="^(?=.{1,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"/>
        </label>
    </div>
    
</div>

<div className="form-group-big">
         <legend>Photo</legend>
         <button type="button" className="btn btn-info">
            <label htmlFor="createCharacImageInput">Choose a file</label>  
         </button>
         <div>
            <img className="formPreviewImage" src={this.state.imageUrl} alt="" />
         </div>
         {/* Not Visible */}
         <input type="file" name="userImage" id="createCharacImageInput" ref={this.fileInput} onChange={this.handleFileInput} className="image-inputfile"/>

</div>

</div>
    <br/>
    <hr/>
    
    <input type="submit" className="btn btn-warning" value="Update User"/>
    <input type="submit" className="btn btn-secondary" value="Cancel" onClick = {this.cancelUpdateHandler}/>

</form>
</main>

</div>
}
}
  
export default UpdateUserPage;
