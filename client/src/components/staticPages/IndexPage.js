import React, { Component } from "react";
import HeaderLinks from "../HeaderLinks"

// import "./App.css";


class IndexPage extends Component {
  render() {
    console.log("rendering index page");
    return <div>
        <HeaderLinks/>
        <main>
        <h1>Welcome to anime Fanbase!</h1>

        <p>Start using my application by signing-in or signing-up in the right top corner!</p>


        <p></p>
        <p></p>
        <p>Only authorizeted users can access characters information. <br/> If you don't see characters menu, 
        please pay attention to the right top corner! </p>
        <p></p>
        <p>This is my first web-page!</p>
        <p>This is my first web-page!</p>
        <p>This is my first web-page!</p>
        <p>This is my first web-page!</p>
        <p>This is my first web-page!</p>
        <p>This is my first web-page!</p>
        <p>This is my first web-page!</p>
        <p>This is my first web-page!</p>

    </main>
  </div>
  }
}

export default IndexPage;