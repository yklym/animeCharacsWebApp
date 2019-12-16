import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import HeaderLinks from "../HeaderLinks";


class CreateTitlePage extends Component {
    constructor( props ) {
        super( props );
        this.fileInput = React.createRef();
        this.state = {
          name: "",
          yearOfPublishing: 2000,
          rating: 5,
          image: undefined,
          imageUrl: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
      }
   
    
    handleSubmit = event => {
        event.preventDefault()
        
        
        const userData = { 
            name :this.state.name,
            yearOfPublishing:this.state.yearOfPublishing,
            rating:this.state.rating,
            titlePict: this.state.image, }
        
        const formData  = new FormData();

        for(const name in userData) {
            formData.append(name, userData[name]);
        }

        return fetch("/api/v1/titles", {
            method: 'post',
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
      this.setState({image : files[0],
                    imageUrl : URL.createObjectURL(files[0])
    });

  }

    render() {
        let userRole;
        if(this.state.redirect){
            return <Redirect to={`/titles/${this.state.redirect}`}/>;
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
            <label >Year Of Publishing:
                <input type="number" min="1" max="3000" name="yearOfPublishing" value={this.state.yearOfPublishing} onChange={this.handleChange} required />
            </label>
        </div>

        <div className="form-group">
            <label >Rating:
                <input type="number" min="1" max="5" name="rating" value={this.state.rating} onChange={this.handleChange} required />
            </label>
        </div>
        
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
    <input type="submit" className="btn btn-primary" value="Create new title" />

    </form>
    </main>

    </div>
}
}
  
export default CreateTitlePage;
