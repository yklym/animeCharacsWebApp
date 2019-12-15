import React, { Component } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios';
import PageNavigation from "../widgets/PageNavigation"
import { Redirect } from "react-router-dom";
import {getCurrUserObj} from "../myTools"
import HeaderLinks from "../HeaderLinks.js"

class TitleCard extends Component{
    render(){

        let titleImg = this.props.title.image;
        let titleName = this.props.title.name;
        let titleId = this.props.title._id;

        
        return <div className="card border-dark mb-3">
            <div className="card-img-wrapper">
              <Link to={"/titles/" + titleId}>
                <img src={`${titleImg}`} className="card-img-top"  alt="..."></img>
              </Link>
            </div>
        
            <div className="card-body justify-content-between">
            <h5 className="card-title">{titleName}</h5>
            <Link to={"/titles/" + titleId}>
                <button className="btn btn-secondary">Details</button>
            </Link> 
            </div>
        </div>
    }
}



class TitlesPage extends Component {
  constructor( props ) {
    super( props );

    let currUser = getCurrUserObj();

    this.state = {
      query: '',
      results: {},
      error: '',
      message: '',
      loading: false,
      totalResults: 0,
      pagesCount: 0,
      currentPageNo: 0,
      userRole: currUser.role,
      username: currUser.username,
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
        this.fetchSearchResults(updatedPageNo, this.state.query);
      });
    }
  };

  renderSearchResults = () => {
    const {results, query} = this.state;
    // console.log("state");
    // console.log(this.state);
    
    if (results && Object.keys(results).length && results.length) {

      const cardsArray = results.map(title=>{
        //console("CHARAC");
        //console(charac);
        return <TitleCard title = {title}/>
      });
      return <div className="entities-wrapper" id = "characters-div">{cardsArray}</div>;
    
    } else {
        return <div className="alert alert-warning">
        <h2>  No results for <strong> {query}</strong></h2>
      </div>
    }
  };

  componentDidMount(){
    this.fetchSearchResults(1, "");
  }

  handleOnInputChange = (event) => {
    const query = event.target.value;
    if (!query) {
      this.setState({ query, results: {}, totalResults: 0, totalPages: 0, currentPageNo: 0, message: '' } );
      this.fetchSearchResults(1, query);
    } else {
      this.setState({ query, loading: true, message: '' }, () => {
        this.fetchSearchResults(1, query);
      });
    }
  };
    

  fetchSearchResults = (pageNumber, query ) => {
  // ${titleId ? `&title=${titleId}` : ""}
  // By default the limit of results is 20
    pageNumber = pageNumber || 1;
    
// const searchUrl = `https://pixabay.com/api/?key=12413278-79b713c7e196c7a3defb5330e&q=${query}${pageNumber}`;
  const searchUrl = `/api/v1/titles?page=${pageNumber}${query? `&search=${query}` : ""}`;
  //console(`Seach url: ${searchUrl}`);
  if (this.cancel) {
  // Cancel the previous request before making a new request
    this.cancel.cancel();
  }
  
	// Create a new CancelToken
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
      //console(`Fetch res:`);
      //console(res);
			const resultNotFoundMsg = !res.data.resTitles.length
				? 'There are no more search results. Please try a new search.'
        : '';
			this.setState({
        currentPageNo : pageNumber,
        results: res.data.resTitles,
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
    
    const { query, loading,  currentPageNo, pagesCount, userRole} = this.state;
// showPrevLink will be false, when on the 1st page, hence Prev link be shown on 1st page.
    const showPrevLink = 1 < currentPageNo;
// showNextLink will be false, when on the last page, hence Next link wont be shown last page.
    const showNextLink = pagesCount > currentPageNo;
    //console(showNextLink);
    //console(pagesCount + " total ==== curr  " + currentPageNo);
    if(userRole !== 1 && userRole !== 0 ){
      return <Redirect to='/auth/login'/>;
    }

    return <div>
    <HeaderLinks/>

      <div className="filter-box">
        <aside className="filters">
          <p>Some filters here</p>
        </aside>
        <aside className="filters">
        <p>And here</p>
      </aside>
      </div>
  
      <main className="entities-main">
        
    <input type="text" name="search" value={query} id="characSearch" className= "entitySearch" placeholder="Search.." onChange={this.handleOnInputChange}/>
    
    <div className="card-deck">

      {/* titles */}
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
        <Link to="/newTitle" className="btn btn-success">Create title</Link>
        
            <button type="button" className="btn btn-info" >
            Some admin Feature</button>
            <button type="button" className="btn btn-warning" >
            Another admin Feature</button>
            </div> : <></>}
  </main>
  </div>
  }
};

export default TitlesPage;

