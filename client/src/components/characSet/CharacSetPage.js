import React, { Component } from "react";
import { Link } from 'react-router-dom'
import axios from 'axios';
import PageNavigation from "../widgets/PageNavigation"
import { Redirect } from "react-router-dom";
import {getCurrUserObj} from "../myTools"
import HeaderLinks from "../HeaderLinks.js"

class TitleCard extends Component{
    render(){
        return <tr>
        <th>{this.props.characSet.name}</th>
        <th>{this.props.characSet.characs.map(id=>{
          return <Link to={`/characters/${id}`}>*click*</Link>
        })}</th>
      </tr>
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
    if (results && Object.keys(results).length && results.length) {

      const cardsArray = results.map(characSet=>{
        return <TitleCard characSet = {characSet}/>
      });
      return <tbody>{cardsArray}</tbody>;
    
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
    pageNumber = pageNumber || 1;
  const searchUrl = `/api/v1/characSets?page=${pageNumber}${query? `&search=${query}` : ""}`;
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
			const resultNotFoundMsg = !res.data.resCharacSets.length
				? 'There are no more search results. Please try a new search.'
        : '';
			this.setState({
        currentPageNo : pageNumber,
        results: res.data.resCharacSets,
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
    const showPrevLink = 1 < currentPageNo;
    const showNextLink = pagesCount > currentPageNo;
    if(userRole !== 1 && userRole !== 0 ){
      return <Redirect to='/auth/login'/>;
    }

    return <div>
    <HeaderLinks/>  
  <main>
  <input type="text" name="search" value={query} id="characSearch" className= "entitySearch" placeholder="Search.." onChange={this.handleOnInputChange}/>
    <div class="table">
      <table>
        <thead>
        <tr class="table-head">
          <th>Name:</th>
          <th>Characs:</th>
        </tr>
        </thead>
        { this.renderSearchResults() }
        
      </table>
    </div>
       <PageNavigation
        loading={loading}
        showPrevLink={showPrevLink}
        showNextLink={showNextLink}
        currPage = {currentPageNo}
        pagesCount = {pagesCount}
        handlePrevClick={() => this.handlePageClick('prev')}
        handleNextClick={() => this.handlePageClick('next')}/>
  </main>
</div>
  }
};

export default TitlesPage;

