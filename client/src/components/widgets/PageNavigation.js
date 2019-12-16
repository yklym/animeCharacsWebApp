import React, { Component } from "react";
import { Redirect } from "react-router-dom";


export default (props) => {
	const {
		      showPrevLink,
              showNextLink,
              pagesCount,
		      handlePrevClick,
		      handleNextClick,
              loading,
              currPage,
	      } = props;
        
        if(!pagesCount){
          return <div></div>
        }
    return <ul className="pagination pg-amber justify-content-center" id = "characsPagUl">
          <li className="page-item">
              <a className={`nav-link ${ showPrevLink ? '' : 'disabled'}${ loading ? 'greyed-out' : '' }`}onClick={handlePrevClick} aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </a>
            </li>
          
        <li className="page-item  disabled active characPag"><a className="page-link">{currPage}/{pagesCount}</a></li>
            
            <li className="page-item">
              <a className={`nav-link${ showNextLink ? '' : ' disabled'}${ loading ? 'greyed-out' : '' }`} onClick={handleNextClick} aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
          
};

