/************************************** Start Require modules  **********************************************
 *****************************************************************************************************************/

/**
 *Express.js
 * is a framework for building web applications based on Node.js.
 * This is the standard framework for server development in Node.js.
 **/

const express = require("express");

// /**
//  * Node.js body parsing middleware.
//  *Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
//  *Note As req.body's shape is based on user-controlled input, all properties and values in this object are untrusted and should be validated before trusting. For example, req.body.foo.toString() may fail in multiple ways, for example the foo property may not be there or may not be a string, and toString may not be a function and instead a string or other user input.
//  * @type {Parsers}
//  */
const bodyParser = require("body-parser");

// // require router
const maitre = require("../router/maitre");
const chat = require("../router/chat");
const logement = require("../router/logement");
const nounou = require("../router/nounou");
const avis = require("../router/avis");


// si on ne les crée pas dans les modeles, on ne les met pas ici.
// const garder = require("../router/garder");


// require cors

/**
 Cross-Origin Resource Sharing (CORS) is a W3C specification that allows cross-domain requests from compatible browsers.
 If the API you are querying is compatible with CORS, you will be able to access the API even if it is not on the same domain as your application.

 CORS are compatible with :

 -------------------
 -------------------
 Chrome 3+
 Firefox 3.5+
 Opera 12+
 Safari 4+
 Internet Explorer 8+

 ---------------------
 ----------------------

 To use CORS it is necessary to send to the server access control headers that it will inspect to approve or not the request.
 These access control headers will describe the context of the request, its HTTP method, its origin, its custom headers, ...
 **/

const cors = require("cors");

/************************************** end  Require modules  ****************************************************
 *****************************************************************************************************************/


/********************************************************start make server with all params  ****************************************************
 ************************************************************************************************************************************************/

/** that the port where you can call to use you server in local **/

// cette ligne est pour que le server choisisse un port lui meme qui sera dispo, et on suggère le 3000 si dispo.
// const port = process.env.PORT || 3000;
const port = 6001;

// app = express
const app = express();
// in our app we use cors
app.use(cors());

// in our app we use bodyParser in json
app.use(bodyParser.json());

// store it in a variable named bodyParser. 
 
 //The middleware to handle url encoded data is returned by bodyParser.urlencoded({extended: false}) .
 //extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays.
 app.use(bodyParser.urlencoded({extended: false}));

// we will then prefix for our routes
// we will call every route we need in this app here
// on met les prefixes qui iront des routes dans l'interface ou dans postman, 
// ce nest pas la route elle-même mais le prefixe de la route.
// app fait référence à l'API c'est à dire postman ou ton interface
// donc lui dit : app va utiliser le prefix /maitre pour le fichier maitre
// après on écrit la variable correspondant à notre route déclarée plus haut
app.use("/maitre", maitre);
app.use("/chat", chat);
app.use("/logement", logement);
app.use("/nounou", nounou);
app.use("/avis", avis);
// app.use("/sejour", sejour);


// we say our app to start to listen in the port and send back to us the msg with port info
app.listen(port, function () {
    console.log("server start on " + port)
});

/******************************************************** End make server with all parmars  ****************************************************
 ************************************************************************************************************************************************/
