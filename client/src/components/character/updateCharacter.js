import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import HeaderLinks from "../HeaderLinks";


class UpdateCharacterPage extends Component {
    constructor( props ) {
        super( props );

        
        this.fileInput = React.createRef();

        this.state = {
          name: "dddddd",
          fullname: "dddddd",
          characDescr: "Character description......",
          alias : "-",
          age: -1,
          image: undefined,
        };
        this.handleSubmit = this.handleSubmit.bind(this);


      }

    componentDidMount(){
        let queryStrArr = this.props.location.pathname.split("/");
        let characId = queryStrArr[queryStrArr.length - 1];
    
        const searchUrl = `/api/v1/characters/${characId}`;
    
        fetch(searchUrl, {
            method: "get",
            headers: {
              'Authorization': `Bearer ${localStorage.token}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          }).then(row=>row.json())
          .then((res) => {
             this.setState({
              character: res,
              name: res.name,
              fullname: res.fullname,
              description: res.description,
              alias : res.alias,
              age: res.age,
              imageUrl: res.image,
              characId : characId,
              image: undefined,  
            });
          })
          .catch((error) => {
          });
        }
    
     
    onFilesError =  (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    
    
    handleSubmit = event => {
        event.preventDefault()
        const userData = { name :this.state.name,
            fullname:this.state.fullname,
            age: this.state.age,
            image: this.state.image,
            description: this.state.description,
            alias:this.state.alias,
            imageUrl:  this.state.imageUrl,
            prevChar : this.state.character
        }
        
        const formData  = new FormData();

        for(const name in userData) {
            formData.append(name, userData[name]);
        }

        return fetch(`/api/v1/characters/${this.state.characId}`, {
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
  cancelUpdateHandler = ()=>{
      this.setState({redirect: `${this.state.characId}`})
  }
    
  
    
  

  render() {
    let userRole;
    if(this.state.redirect){
        return <Redirect to={`/characters/${this.state.redirect}`}/>;
    }
    const charac = this.state
    
    return <div> <HeaderLinks/> 
      <main>
    <form className= "new-charac-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>
    <div className="new-charac-input-div">

    <div className="form-group-big">

        <div className="form-group">
            <label>
                Name:
                <input type="text" className="form-control" value={charac.name} name="name" onChange={this.handleChange} required pattern="^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"/>
            </label>
        </div>

    <div className="form-group">
        <label >Full Name:
            <input type="text"  className="form-control" value={charac.fullname} name="fullname" onChange={this.handleChange} required pattern="^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"/>
        </label>
    </div>

    
    <div className="form-group">
        <label >Age:
            <input type="number" min="1" max="9999999" name="age" value={charac.age} onChange={this.handleChange} required />
        </label>
    </div>

    <div className="form-group">
        <label >Alias:
            <input type="text"  className="form-control" value={charac.alias} name="alias" onChange={this.handleChange} required pattern="^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"/>
        </label>
    </div>
    
</div>
<div className="form-group-big">
         <legend>Description</legend>
         <textarea name="description" value={this.state.description}  onChange={this.handleChange}></textarea>

</div>
<div className="form-group-big">
         <legend>Photo</legend>
         <button type="button" className="btn btn-info">
            <label htmlFor="createCharacImageInput" >Choose a file</label>  
         </button>
         <div>
            <img className="formPreviewImage" src={this.state.imageUrl} alt="" />
         </div>
         {/* Not Visible */}
         <input type="file" name="characPict" id="createCharacImageInput" ref={this.fileInput} onChange={this.handleFileInput} className="image-inputfile"/>

</div>

</div>
    <br/>
    <hr/>
    
    <input type="submit" className="btn btn-warning" value="Update Character"/>
    <input type="submit" className="btn btn-secondary" value="Cancel" onClick = {this.cancelUpdateHandler}/>

</form>
</main>

</div>
}
}
  
export default UpdateCharacterPage;
