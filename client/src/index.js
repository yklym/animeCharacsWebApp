import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import Header from "./components/widgets/Header"


ReactDOM.render(
    <BrowserRouter>
    <Header></Header>
    <App />
    </BrowserRouter>
, document.getElementById('root'));


