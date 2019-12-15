const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

const apiRoute = require("./routes/api");
app.use("/api/v1", apiRoute);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(busboyBodyParser({
  limit: '5mb'
}));

const path = require('path');

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});





// @part Running-------------------------------------------------------
const dbUrl = process.env["MONGODB_URI"] || 'mongodb://localhost:27017/lab5';
const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(dbUrl, connectOptions)
  .then(() => console.log('Mongo database connected'))
  .catch(() => console.log('ERROR: Mongo database not connected'));

// let portTmp = process.env["PORT"] || 3002;
const port = process.env.PORT || 5000;
app.listen(port, () => console.log('App is listening on port ' + port));
// app.listen(port);

