const user = require('./models/user');
const character = require("./models/character");
const title = require("./models/title");

const mongoose = require('mongoose');
const fs = require("fs");
const express = require('express');
const path = require("path");
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');

const pageSize = 4;

const app = express();
app.use(express.static('public'));
// GET 
let viewsDir = path.join(__dirname, 'views');
// view engine setup
app.engine('mustache', mustache(path.join(viewsDir, 'partials')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(busboyBodyParser({
  limit: '5mb'
}));






app.get('/about', function (req, res) {
  console.log('about.html send');
  res.render("about", {});
});

app.get('/', function (req, res) {
  console.log('index.html send');
  res.render("index", {});
});

app.get('/users', function (req, res) {
  console.log('users.html send');
  user.getAll().then(userList => {
    res.render("users", {
      users: userList
    });
  }).catch(err => {
    console.log("Err in /users: " + err);
  });
});


app.get('/users/:id(\\d+)', function (req, res) {
  let id = parseInt(req.params.id);
  console.log('users #' + id + ' page send');
  user.getById(id).then(userObj => {
    res.render("user", userObj);
  }).catch(err => {
    res.status(404).send(err);
  });
});


app.get('/characters', function (req, res) {
  let currPageNumber = parseInt(req.query.page);
  let searchWord = req.query.search;
  let currTitle = req.query.title;
  // console.log(currTitle);
  if (!currPageNumber) {
    currPageNumber = 1;
  }
  if (!searchWord) {
    searchWord = "";
  }
  if (!currTitle) {
    currTitle = "";
  }
  character.getAllByString(searchWord).then(characterList => {
    
    let pagesList = new Array();
    if (currTitle) {
      characterList = characterList.filter(elem => elem.titles.includes(currTitle));
    }
    let pagesAmount = Math.ceil(characterList.length / pageSize);
    if (pagesAmount <= 6) {
      for (let i = 1; i < pagesAmount + 1; i++) {
        console.log(pagesList);
        pagesList.push({
          number: i,
          // ads parametr if last search wasnt empty :
          href: '/characters/?page=' + i + (searchWord ? ('&search=' + searchWord) : "") + (currTitle ? ('&title=' + currTitle) : "")
        });

      }
    } else {
      for (let i = currPageNumber - 3; i < currPageNumber + 3; i++) {
        if (i <= 0) i = 1;
        if (i >= pagesAmount) break;

        pagesList.push({
          number: i,
          // ads parametr if last search wasnt empty
          href: '/characters/?page=' + i + (searchWord ? ('&search=' + searchWord) : "") + (currTitle ? ('&title=' + currTitle) : "")
        });
        // console.log("pagesList:" + pagesList);
        // console.log("im two");
      }
    }
    let pageBufIndex = (currPageNumber - 1) * pageSize;
    let resCharacs = characterList.splice(pageBufIndex, pageSize);

    let nextPageHref = '<a href="/characters/?page=' +
      (currPageNumber + 1) + (searchWord ? ('&search=' + searchWord) : "") +
      (currTitle ? "&title=" + currTitle : "") + '">&raquo;</a>';

    let prevPageHref = '<a href="/characters/?page=' +
      (currPageNumber - 1) + (searchWord ? ('&search=' + searchWord) : "") +
      (currTitle ? "&title=" + currTitle : "") + '">&laquo;</a>';
    // let prevPageHref = "/characters/page" + (currPageNumber - 1);
    if (currPageNumber <= 1) {
      prevPageHref = '<a href="/characters/?page=1' +
        (searchWord ? ('&search=' + searchWord) : "") +
        (currTitle ? "&title=" + currTitle : "") + '">&laquo;</a>';
    }
    if (currPageNumber >= pagesAmount) {
      nextPageHref = '<a href="/characters/?page=' +
        pagesAmount + (searchWord ? ('&search=' + searchWord) : "") +
        (currTitle ? "&title=" + currTitle : "") + '">&raquo;</a>';
    }

    let resultHtml1 = `<div class="resulting-box"><bold><italic>`;
    let resultHtml2 = `</italic></bold></div>`;

    let searchResult = resultHtml1 +
      (searchWord ? ("Results for: " + searchWord) : "") +
      (currTitle ? (" Title id: " + currTitle) : "") +
      resultHtml2;

    if (resCharacs.length === 0) {
      prevPageHref = "";
      nextPageHref = "";
      searchResult = resultHtml1 +'No results,  <italic>' + (searchWord ? searchWord : "") + (currTitle ? " TItle: " + currTitle : "") + resultHtml2;
    }
    if (!searchWord) {
      // searchResult = "";
      searchWord = "search";
    }
    // console.log(searchResult);
    res.render('characters', {
      pages: pagesList,
      characters: resCharacs,
      nextHref: nextPageHref,
      prevHref: prevPageHref,
      searchWord: searchWord,
      searchResult: searchResult
    });

  }).catch(err => {
    console.log(err);
    res.status(404).send("err");
  });

});

app.get('/characters/:id', function (req, res) {
  let id = req.params.id;
  character.getById(id).then(characObj => {
    console.log('character # ' + id + ' page send');
    res.render("character", characObj);
  }).catch(err => {
    console.log(err);
    res.status(404).send("err");
  });
});

app.get('/api/users', function (req, res) {

  console.log('users json send');
  user.getAll().then(userList => {
    res.json(userList);
  }).catch(err => {
    res.status(404).send("Error 404" + err);
  });
});

// /api/users/:id -> {User}
app.get('/api/users/:id', function (req, res) {
  let id = parseInt(req.params.id);
  console.log('user #' + id + ' json send');
  user.getById().then(targetUser => {
    res.json(targetUser);
  }).catch(err => {
    res.status(404).send("Error 404" + err);
  });

});



// Lab 4 

app.get('/newCharacter', function (req, res) {
  console.log("new character page send");
  res.render('characters_new', {});
});

app.post('/admin/deleteCharac', function (req, res) {
  let characId = req.headers.referer.split("/").pop();
  console.log(characId);
  character.deleteById(characId).then(result => {
    console.log(result);
    res.redirect('/characters');
  }).catch(err => {
    res.status(404).send(err);
  });

});

app.post('/admin/createCharac', function (req, res) {
  let avaFile = req.files.characPict;

  let dateTmp = new Date();
  let newCharac = new character(null, req.body.name,
    req.body.fullname,
    req.body.fullname,
    [],
    -1,
    req.body.age,
    dateTmp.toISOString(),
    "--");
  character.insert(newCharac).then(charac => {
    let newCharacId = charac._id;
    newCharac.image = '/data/fs/' + newCharacId + "/" + avaFile.name;
    character.update(newCharacId, newCharac).then(() => {
      let dir = path.join(__dirname, 'data/fs/') + newCharacId;
      console.log(dir);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.writeFileSync(dir + "/" + avaFile.name, avaFile.data);
      } else {
        return new Promise.reject("Problems while saving file");
      }

      res.redirect("/characters/" + newCharacId);
    });
  }).catch(err => {
    res.status(404).send(err);
  });

});

app.get('/data/fs/*', function (req, res) {

  try {
    res.sendFile(path.join(__dirname, req.originalUrl));
  } catch (err) {
    res.status(404).send("err");
  }
});


// @part Title
app.get('/titles', function (req, res) {
  let currPageNumber = parseInt(req.query.page);
  let searchWord = req.query.search;
  if (!currPageNumber) {
    currPageNumber = 1;
  }
  if (!searchWord) {
    searchWord = "";
  }
  title.getAllByString(searchWord).then(titleList => {
    let pagesAmount = Math.ceil(titleList.length / pageSize);

    let pagesList = new Array();

    if (pagesAmount <= 6) {
      for (let i = 1; i < pagesAmount + 1; i++) {
        pagesList.push({
          number: i,
          // ads parametr if last search wasnt empty :
          href: '/titles/?page=' + i + (searchWord ? ('&search=' + searchWord) : "")
        });

      }
      // console.log("pagesList it # 1:" + pagesList[0]);
      // console.log("im one");
      // console.log("1");
    } else {
      for (let i = currPageNumber - 3; i < currPageNumber + 3; i++) {
        if (i <= 0) i = 1;
        if (i >= pagesAmount) break;

        pagesList.push({
          number: i,
          // ads parametr if last search wasnt empty
          href: '/titles/?page=' + i + (searchWord ? ('&search=' + searchWord) : "")
        });
        // console.log("pagesList:" + pagesList);
        // console.log("im two");
      }
    }

    let pageBufIndex = (currPageNumber - 1) * pageSize;
    let resTitles = titleList.splice(pageBufIndex, pageSize);

    let nextPageHref = '<a href="/titles/?page=' + (currPageNumber + 1) + (searchWord ? ('&search=' + searchWord) : "") + '">&raquo;</a>';
    let prevPageHref = '<a href="/titles/?page=' + (currPageNumber - 1) + (searchWord ? ('&search=' + searchWord) : "") + '">&laquo;</a>';
    // let prevPageHref = "/characters/page" + (currPageNumber - 1);
    if (currPageNumber <= 1) {
      prevPageHref = '<a href="/titles/?page=1' + (searchWord ? ('&search=' + searchWord) : "") + '">&laquo;</a>';
    }
    if (currPageNumber >= pagesAmount) {
      nextPageHref = '<a href="/titles/?page=' + (pagesAmount - 1) + (searchWord ? ('&search=' + searchWord) : "") + '">&raquo;</a>';
    }

    let searchResult = '<div class="resulting-box"><bold>Results for: <italic>' + searchWord + "</italic></bold></div>";
    
    if (resTitles.length === 0) {
      prevPageHref = "";
      nextPageHref = "";
      searchResult = '<div class="resulting-box"><bold>No results for: <italic>' + searchWord + "</italic></<italic></div>";
    }
    if (!searchWord) {
      searchResult = "";
      searchWord = "search";
    }
    // @todo 
    console.log(searchResult);
    res.render('titles', {
      pages: pagesList,
      titles: resTitles,
      nextHref: nextPageHref,
      prevHref: prevPageHref,
      searchWord: searchWord,
      searchResult: searchResult
    });

  }).catch(err => {
    console.log(err);
    res.status(404).send("err");
  });

});

app.get('/titles/:id', function (req, res) {
  let titleId = req.params.id;
  title.getById(titleId).then(titleObj => {

    character.getAll().then(characs => {

      characs.forEach(elem => {
        if (elem.titles.includes(titleId)) {
          elem.add = false;
          elem.delete = true;
        } else {
          elem.add = true;
          elem.delete = false;
        }
        elem.characHref = `/characters/${elem._id}`;
      });

      let charsHref = '/characters/?page="1"&title=' + titleId;


      console.log('title # ' + titleId + ' page send');
      res.render("title", {
        titleName: titleObj.name,
        titleImage: titleObj.image,
        yearOfPublishing: titleObj.yearOfPublishing,
        rating: titleObj.rating,
        characters: characs,
        charsHref: charsHref,
        
      });
    });
  }).catch(err => {
    console.log(err);
    res.status(404).send("err");
  });
});


app.post('/admin/deleteTitle', function (req, res) {
  let titleId = req.headers.referer.split("/").pop();
  title.deleteById(titleId).then(result => {
    console.log("deleting title " + titleId + result);
    res.redirect('/titles');
  }).catch(err => {
    res.status(404).send(err);
  });

});

app.post('/admin/createTitle', function (req, res) {
  let avaFile = req.files.characPict;
  let dateTmp = new Date();
  // constructor(id = -1, name = "", authorAdmin = -1, characters = [], rating = -1, yearOfPublishing = -1, addedAt = "", image = "") {

  let newTitle = new title(-1, req.body.name, null, [], req.body.rating, req.body.yearOfPublishing, dateTmp.toISOString(), "--");
  title.insert(newTitle).then(tit => {
    let newTitleId = tit._id;
    newTitle.image = '/data/fs/' + newTitleId + "/" + avaFile.name;
    title.update(newTitleId, newTitle).then(() => {
      let dir = path.join(__dirname, 'data/fs/') + newTitleId;
      console.log(dir);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.writeFileSync(dir + "/" + avaFile.name, avaFile.data);
      } else {
        return new Promise.reject("Problems while saving file");
      }

      res.redirect("/titles/" + newTitleId);
    });
  }).catch(err => {
    console.log(err);
    res.status(404).send(err);
  });

});


app.get('/newTitle', function (req, res) {
  console.log("new title page send");
  res.render('titleNew', {});
});

app.post('/admin/title/addCharac/:characId', function (req, res) {
  let titleId = req.headers.referer.split("/").pop();
  let characId = req.params.characId;
  character.getById(characId).then((charac) => {
    charac.titles.push(titleId);
    character.update(characId, charac).then(() => {

      title.getById(titleId).then(tit => {
        tit.characters.push(characId);
        title.update(titleId, tit).then(() => res.redirect(`/titles/${titleId}#adminCollapse`));
      });

    });


  }).catch(err => {
    console.log(err);
    res.status(404).send(err);
  });
});

app.post('/admin/title/deleteCharac/:characId', function (req, res) {
  let titleId = req.headers.referer.split("/").pop();
  let characId = req.params.characId;
  character.getById(characId).then((charac) => {
    charac.titles.splice(charac.titles.indexOf(titleId), 1);
    character.update(characId, charac).then(() => {
      title.getById(titleId).then(tit => {
        tit.characters.splice(tit.characters.indexOf(characId), 1);
        title.update(titleId, tit).then(() => res.redirect(`/titles/${titleId}#adminCollapse`));
      });
    });
  }).catch(err => {
    console.log(err);
    res.status(404).send(err);
  });
});

// -------------------------------------------------------
const dbUrl = 'mongodb://localhost:27017/lab5';
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(dbUrl, connectOptions)
  .then(() => console.log('Mongo database connected'))
  .catch(() => console.log('ERROR: Mongo database not connected'));

app.listen(3004, () => console.log('Started server'));