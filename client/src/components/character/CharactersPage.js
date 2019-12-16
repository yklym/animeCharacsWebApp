import React, { Component } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios';
import PageNavigation from "../widgets/PageNavigation"
import { Redirect } from "react-router-dom";
import jwtDecode from "jwt-decode"
import HeaderLinks from "../HeaderLinks.js"
import queryString from 'query-string'

class CharacterCard extends Component{
    render(){

        let characImg = this.props.charac.image;
        let characName = this.props.charac.name;
        let characId = this.props.charac._id;

        
        return <div className="card border-dark mb-3">
            <div className="card-img-wrapper">
              <Link to={"/characters/" + characId}>
                <img src={`${characImg}`} className="card-img-top"  alt="..."></img>
              </Link>
            </div>
        
            <div className="card-body justify-content-between">
            <h5 className="card-title">{characName}</h5>
            <Link to={"/characters/" + characId}>
                <button className="btn btn-secondary">Details</button>
            </Link> 
            </div>
        </div>
    }
}



class CharactersPage extends Component {
  constructor( props ) {
    super( props );

      let userRole = -1;
      let username = "";
        
      if(!localStorage.token){
          userRole = -1;
      } else {
          let user = jwtDecode(localStorage.token);
          userRole = user.role;
          username = user.username;
      }

    this.state = {
      query: '',
      results: {},
      error: '',
      message: '',
      loading: false,
      totalResults: 0,
      pagesCount: 0,
      currentPageNo: 0,
      userRole: userRole,
      username: username,
      
    };
    this.cancel = '';
  }

  getPagesCount = (total, denominator) => {
    const divisible = total % denominator === 0;
    const valueToBeAdded = divisible ? 0 : 1;
    return Math.floor(total / denominator) + valueToBeAdded;
  };

  handlePageClick = (type) => {
    // event.preventDefault();
    const updatedPageNo =
            'prev' === type
              ? this.state.currentPageNo - 1
              : this.state.currentPageNo + 1;
    if (!this.state.loading) {
      this.setState({ loading: true, message: '' }, () => {
        //console("Updating!!");
        //console(updatedPageNo);
        this.fetchSearchResults(updatedPageNo, this.state.query);
      });
    }
  };
  renderSearchResults = () => {
    const {results, query} = this.state;
    
    if (results && Object.keys(results).length && results.length) {

      const cardsArray = results.map(charac=>{
        //console("CHARAC");
        //console(charac);
        return <CharacterCard charac = {charac}/>
      });

      return <div className="entities-wrapper" id = "characters-div">{cardsArray}</div>;
    } else {
        //console("NO RESULTS");
        return <div class="alert alert-warning">
        <h2>  No results for <strong> {query}</strong></h2>
      </div>
     
    }
  };
  componentDidMount(){
    this.fetchSearchResults(1, "");
  }


  handleOnInputChange = (event) => {
    const query = event.target.value;
    if ( ! query ) {
      this.setState({ query, results: {}, totalResults: 0, totalPages: 0, currentPageNo: 0, message: '' } );
      this.fetchSearchResults(1, query);
    } else {
      this.setState({ query, loading: true, message: '' }, () => {
        this.fetchSearchResults(1, query);
      });
    }
  };
    

  fetchSearchResults = (pageNumber, query ) => {
    pageNumber = pageNumber || 1;
    const values = queryString.parse(this.props.location.search)

  const searchUrl = `/api/v1/characters?page=${pageNumber}${query? `&search=${query}` : ""}${values.titleId ? `&titleId=${values.titleId}` : ""}`;
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
      
			const resultNotFoundMsg = !res.data.resCharacs.length
				? 'There are no more search results. Please try a new search.'
        : '';
			this.setState({
        currentPageNo : pageNumber,
        results: res.data.resCharacs,
        pagesCount: res.data.pagesAmount,
				message: resultNotFoundMsg,
				loading: false,
			});
		})
		.catch((error) => {
			if (axios.isCancel(error) || error) {
				this.setState({
					loading: false,
					message: 'Failed to fetch results.Please check network',
				});
			}
		});
  };


  render() { 
    const { query, loading,  currentPageNo, pagesCount, userRole, username } = this.state;
    const showPrevLink = 1 < currentPageNo;
    const showNextLink = pagesCount > currentPageNo;
    if(userRole ===-1){
      return <Redirect to='/auth/login'/>;
    }

    return <div>
            <HeaderLinks/>
      {/* <div></div> */}
      <div className="filter-box">
        <aside className="filters">
          <p>Some filters here</p>
          {this.props.isAdmin ? <form action = "/newCharacter" method = "GET">
              <input type="submit" className="btn btn-info" value="New Title"></input>
            </form> : <></>}
            </aside>
        <aside className="filters">
        <p>And here</p>
      </aside>
      </div>

      <main className="entities-main">
        
    <input type="text" name="search" value={query} id="characSearch" className= "entitySearch" placeholder="Search.." onChange={this.handleOnInputChange}/>
    
    <div className="card-deck">

      {/* characters */}
      { this.renderSearchResults() }

    </div>
    {/* PAGINATION */}
       <PageNavigation
        loading={loading}
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        currPage = {currentPageNo}
        pagesCount = {pagesCount}
        handlePrevClick={() => this.handlePageClick('prev')}
        handleNextClick={() => this.handlePageClick('next')}/>
      {this.state.userRole ===1 ?
       <div className="adminButtons">
         <p>Admin abilities:</p>
        <Link to="/newCharacter" className="btn btn-success">Create charac</Link>
        
            <button type="button" className="btn btn-info" >
            Some admin Feature</button>
            <button type="button" className="btn btn-warning" >
            Another admin Feature</button>
            </div> : <></>}
  </main>
  </div>
  }
};

export default CharactersPage;

