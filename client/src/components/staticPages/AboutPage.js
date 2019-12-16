import React, { Component } from "react";
import HeaderLinks from "../HeaderLinks"

class AboutPage extends Component {
  render() {
    return <div>
      <HeaderLinks/>
        <main>
        <h3>We glad to see you on anime fanbase website!</h3>
        <p>This is my coursework, done by Klymenko Yaroslav, 2-term student 
          of Kyiv Polytechnical Institute, Faculty of Aplied Math
        </p>
        <p>
        <h4>Contact me via:</h4>
        <ul>
          <li><b>Email :</b> yaroslaw.klymko@gmail.com</li>
          <li><b>Telegramm :</b> @Meow_meow_meov</li>
        </ul>
        </p>
        <p></p>
        <p>Start using my application by signing-in or signing-up in the right top corner!</p>
        <p></p>
        <p>Nya, cawai!</p>
        <p>Nya, cawai!</p>
        <p>Nya, cawai!</p>
    </main>
  </div>
  }
}

export default AboutPage;