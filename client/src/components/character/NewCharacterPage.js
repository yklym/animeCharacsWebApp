import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import HeaderLinks from "../HeaderLinks";


class CreateCharacterPage extends Component {
    constructor( props ) {
        super( props );
        this.fileInput = React.createRef();
        this.state = {
          name: "",
          fullname: "",
          characDescr: "Character description......",
          age: -1,
          alias: "",
          image: undefined,
          imageUrl: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);


      }
   
    
    handleSubmit = event => {
        event.preventDefault()
        
        console.log("HANDLE FORM SUBMIT");
        
        const userData = { name :this.state.name,
            fullname:this.state.fullname,
            description:this.state.characDescr,
            age: this.state.age,
            alias : this.state.alias,
            characPic: this.state.image, }
        console.log(userData);
        
        const formData  = new FormData();

        for(const name in userData) {
            formData.append(name, userData[name]);
        }

        return fetch("/api/v1/characters", {
            method: 'post',
            headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        },
            body: formData
        }).then(resp => {
            console.log(resp);
            return resp.json();
        })
          .then(data => {
              console.log("DATA:");
              console.log(data);

              this.setState({redirect: data._id});

          }).catch(err=>{console.log(err);})
      }
   
  handleChange = event => {
      this.setState({[event.target.name]: event.target.value});
      console.log("Handling input");
      console.log(this.state);
  }
  handleFileInput = e =>{
    //   console.log(e.target.files);
      const files = Array.from(e.target.files);
      console.log();
      this.setState({image : files[0],
                    imageUrl : URL.createObjectURL(files[0])
    });

  }

  
    
  
    
  

    render() {
        let userRole;
        console.log("RENDERING New CHarac PAGE");
        if(this.state.redirect){
            console.log("LOGIN PAGE REDIRECT IS TRUE");
            return <Redirect to={`/characters/${this.state.redirect}`}/>;
        }
        
        return <div> <HeaderLinks/> 
          <main>
        <form className= "new-charac-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>
        <div className="new-charac-input-div">

        <div className="form-group-big">

            <div className="form-group">
                <label>
                    Name:
                    <input type="text" className="form-control" placeholder="Enter name" name="name" onChange={this.handleChange} required pattern="^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"/>
                </label>
            </div>

        <div className="form-group">
            <label >Full Name:
                <input type="text"  className="form-control" placeholder="Enter Fullname" name="fullname" onChange={this.handleChange} required pattern="^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"/>
            </label>
        </div>

        
        <div className="form-group">
            <label >Age:
                <input type="number" min="1" max="9999999" name="age" value={this.state.age} onChange={this.handleChange} required />
            </label>
        </div>

        <div className="form-group">
            <label >Alias:
                <input type="text"  className="form-control" placeholder="Enter Alias" name="alias" onChange={this.handleChange} required pattern="^(?=.{2,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"/>
            </label>
        </div>
        
    </div>
    <div className="form-group-big">
             <legend>Description</legend>
             <textarea name="characDescr" value={this.state.characDescr}  onChange={this.handleChange}></textarea>

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
    <input type="submit" className="btn btn-primary" value="Create new character" />

    </form>
    </main>

    </div>
}
}
  
export default CreateCharacterPage;
