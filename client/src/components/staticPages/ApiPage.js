import React, { Component } from "react";
import HeaderLinks from "../HeaderLinks"

class AboutPage extends Component {
  render() {
    return <div>
      <HeaderLinks/>
        <main> 

<p>Keywords before request methods mean:</p>
<pre>AUTH - authorized user
ADMIN - Administrator user
</pre>
<p>
Each requst returns JSON and status codes 200, 201, 400, 404<br/>
In case of errors, returns them in json-format including standart Mongoose errors<br/>
</p>

<i>AUTH/me - returns info about authorizated user</i>
<i>/ - indicates working of api by sending init message</i>

<h3>USERS</h3>
<ol>
    <li>
        <h4>ADMIN/GET /users<i>?page</i></h4> - returns all users list paginated by 4. <i>page</i> - page number, if
        bigger than pages amount returns last page
    </li>
    <li>
        <h4>ADMIN/GET /users/<i>ID</i></h4> - returns user by <i>ID</i>. If <i>ID</i> is invalid returns error
    </li>
    <li>
        <h4>ADMIN/POST /users</h4> - inserts new user by user obj stored in body. Returns created user.
        <pre>
            "login"
            "password"
            "role" - 1 or 0, case other returns error, optional default 0 
            "fullname" - optional default "-"
            "userPic" : required file, if none returns error
        </pre>
    </li>
    <li>
        <h4>ADMIN/PUT /users/
            <i>ID</i>
        </h4> - updates user by <i>ID</i> obj stored in body. Returns updated user.
        <pre>
                "login"
                "password"
                "role" - 1 or 0, case other returns error, optional default 0 
                "fullname" - optional default "-"
                "userPic" : required file, if none returns error
            </pre>
    </li>
</ol>


<h3>TITLE</h3>
<ol>
    <li>
        <h4>AUTH/GET /titles<i>?page</i></h4> - returns all titles list paginated by 4. <i>page</i> - page number, if
        bigger than pages amount returns last page
    </li>
    <li>
        <h4>ADMIN/GET /titles/<i>ID</i>></h4> - returns titles by <i>ID</i>. If <i>ID</i> is invalid returns error
    </li>
    <li>
        <h4>ADMIN/POST /titles</h4> - inserts new titles by titles obj stored in body.
        <pre>
            "rating" - optional default -1
            "yearOfPublishing" - optional default -1
            "name" - optional default "-"
            "titlePic" : required file, if none returns error
        </pre>
    </li>
    <li>
        <h4>ADMIN/PUT /titles/
            <i>ID</i>
        </h4> - updates title by <i>ID</i> obj stored in body.
        <pre>
            "rating" - optional default -1
            "yearOfPublishing" - optional default -1
            "name" - optional default "-"
            "titlePic" : required file, if none returns error
            </pre>
    </li>
</ol>

<h3>CHARACTER</h3>
<ol>
    <li>
        <h4>AUTH/GET /characters<i>?page</i></h4> - returns all characters list paginated by 4. <i>page</i> - page
        number, if
        bigger than pages amount returns last page
    </li>
    <li>
        <h4>ADMIN/GET /characters/<i>ID</i>></h4> - returns characters by <i>ID</i>. If <i>ID</i> is invalid returns
        error
    </li>
    <li>
        <h4>ADMIN/POST /characters</h4> - inserts new characters by characters obj stored in body.
        <pre>
            "alias" - optional default "-"
            "name" - optional default "-"
            "fullname" - optional default "-"
            "age" - optional default -1
            "characPic" : required file, if none returns error
        </pre>
    </li>
    <li>
        <h4>ADMIN/PUT /characters/
            <i>ID</i>
        </h4> - updates user by <i>ID</i> obj stored in body.
        <pre>
            "alias" - optional default "-"
            "name" - optional default "-"
            "fullname" - optional default "-"
            "age" - optional default -1
            "characPic" : required file, if none returns error
            </pre>
    </li>
</ol>
    </main>
  </div>
  }
}

export default AboutPage;