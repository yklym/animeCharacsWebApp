import React from "react";
import "./App.css";
import { Route, Switch } from 'react-router-dom'


import characSetsPage from "./components/characSet/CharacSetPage"
import IndexPage from './components/staticPages/IndexPage'
import AboutPage from './components/staticPages/AboutPage'
import ApiPage from "./components/staticPages/ApiPage"
import RegisterPage from "./components/RegisterPage"
import LoginPage from './components/LoginPage'
// USERS
import UsersPage from "./components/user/UsersPage"
import UserPage from "./components/user/UserPage"
import UpdateUserPage from "./components/user/updateUser"

// CHARAC
import CreateCharacterPage from "./components/character/NewCharacterPage"
import UpdateCharacterPage from "./components/character/updateCharacter"
import CharactersPage from './components/character/CharactersPage'
import CharacterPage from './components/character/CharacterPage'
// TITLE
import CreateTitlePage from "./components/title/NewTitlePage"
import TitlesPage from './components/title/TitlesPage'
import TitlePage from './components/title/TitlePage'


export default function App() {
  return (
    <div>

    <Switch>
      {/* Static */}
      <Route exact path="/" component={IndexPage} />
      <Route exact path="/about" component={AboutPage} />
      
      {/* AUTH */}
      <Route exact path="/auth/login" component={LoginPage} />
      <Route exact path="/auth/register" component={RegisterPage} />
      

      {/* Character */}
      <Route exact path="/characters" component={CharactersPage} />
      <Route exact path="/characters/:id" component={CharacterPage} />
      <Route exact path="/newCharacter" component={CreateCharacterPage} />
      <Route exact path="/updateCharacter/:id" component={UpdateCharacterPage} />

      {/* Titles */}
      <Route exact path="/titles" component={TitlesPage} />
      <Route exact path="/titles/:id" component={TitlePage} />
      <Route exact path="/newTitle" component={CreateTitlePage} />


      {/* USERS */}
      <Route exact path="/users/:id" component={UserPage} />
      <Route exact path="/updateUser/:id" component={UpdateUserPage} />
      <Route exact path="/users" component={UsersPage} />


      <Route exact path="/v1ApiInfo" component={ApiPage} />
      <Route exact path="/characSets" component={characSetsPage} />
      {/* <Route exact path="/newTitle" component={CharactersPage} />
      <Route exact path="/titles/:id" component={CharacterPage} />
      <Route exact path="/titles" component={CharactersPage} />
      <Route exact path="/users" component={CharactersPage} /> */}

    </Switch>
    </div>
  )
}
