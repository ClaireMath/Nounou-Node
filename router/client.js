// /************************************** Start Require module ****************************************************
//  *****************************************************************************************************************/
// /**
//  *Express.js
//  * is a framework for building web applications based on Node.js.
//  * This is the standard framework for server development in Node.js.
//  **/
// const express = require("express");
// /**
//  * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
//  * Each route can have one or more handler functions, which are executed when the route is matched.
//  * Route definition takes the following structure:
//  * client.METHOD (PATH, HANDLER)
//  *
//  * GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
//  * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
//  * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
//  * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.[24]
//  * DELETE : The DELETE method deletes the specified resource.
//  * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
//  * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
//  * PATCH : The PATCH method applies partial modifications to a resource.
//  *
//  * @type { Router }
//  */
// const client = express.Router();

// //create db
// const db = require("../database/db");
// const Sequelize = require('sequelize');

// // sequilze.op permet de récupérer tous les opérateurs
// const Op = Sequelize.Op
// /************************************** End Require module ****************************************************
//  *****************************************************************************************************************/

// /************************************** Start client router ****************************************************
//  *****************************************************************************************************************/
// // pour effectuer une recherche lorsqu'on n'a qu'une information partielle, comme une adresse email incomplète
//  client.get('/find/:email', (req, res) => {
//     db.client.findAll(  {
//         where: {
//             email: {
//             [Op.like]: '%'+req.params.email
//             //    [Op.like]:  '%gmail.com%' juste pour gmail en particulier, il ne prendra que gmail
//             // en particulier
//             // exemple: pour chercher l'adresse aicha@orange.fr  si on n'a que cette partie de l'adresse:
//             //   cha@o  on notera %cha@o% si on n'a que la fin, on ne mettra pas le % à la fin
//         }}
//     })
//     .then(client => {
//         res.json(client)
//     })
//     .catch(err => {
//         console.log(err);
//         res.json(err);
//     })
// });


// // pour trouver, récupérer un élément qui possède 1 ID ET un email précis
// // (la spécificité qu'on cherche est à préciser dans le champs ou dans l'url de postman )
// client.get('/find/:id/:email', (req, res) => {
//     db.client.findAll(  {
//         where: {
//             [Op.and]: [{id:req.params.id}, {email:req.params.email}]
//         }
//     })
//     .then(client => {
//         res.json(client)
//     })
//     .catch(err => {
//         console.log(err);
//         res.json(err);
//     })
// });


// // get All clients without cat
// client.get("/All", (req, res) => {
//     // Find all clients with out their cat
//     db.client.findAll({
//         // if you neec you use
//         attributes: {
//             include: [],
//             exclude: []
//         },
//     })
//     // get list of All clients in your database
//         .then(clients => {
//             // send back response in json list of clients
//             res.json(clients)
//         })
//         // catch error if something happened
//         .catch(err => {
//             // send back error
//             res.send("error" + err)
//         })
// });


// //get All clients and their cats
// // pour le "/getAll" c'est nous qui choisissons ce que l'on met, 
// // c'est ça qu'il faudra ajouter dans l'url de postman ou dans notre interface pour getter les infos
// client.get("/getAll", (req, res) => {
//     // Find All clients with their cats
//     db.client.findAll({
//         all: true,   // pour forcer à récupérer les infos de toutes les tables associées au client
//         attributes: {
//             include: [],
//             // don't need to show this file
//             exclude: ["updated_at", "created_at"]
//         },
//         include: [{
//             // get cat of clients
//             model: db.cat,
//             include: [{
//                 model: db.marque,
//             }],
//             attributes: {
//                 include: [],
//                 // don't need to show this file
//                 exclude: ["clientId", "updated_at", "created_at"]
//             },
//         }],
//     })
//     // get clients
//         .then(clients => {
//             // send back clients
//             res.json(clients);
//         })
//         // if error, catch and send back to user'sapp to show him, there's an error
//         .catch(err => {
//             res.json({
//                 error: "error " + err
//             })
//         })
// });

// // add new maitre and cat
// maitre.post("/new", (req, res) => {
// // create data marque if needed, to add new data in table marque
//     const marque =
//         {marque: req.body.marque};
//     // create data maitre if needed, to add new data in table maitre
//     const maitredata = { nom: req.body.nom,
//                          prenom: req.body.prenom,
//                          email: req.body.email,
//                          tel: req.body.tel };
//     // try to find out if maitre exists in base
//     db.maitre.findOne({
//         where: {email: req.body.email}
//     }).then(maitre => {
//         // if maitre isn't in base so
//         if (!maitre) {
//             // we create new maitre add data "maitredata"
//             db.maitre.create(maitredata)
//             // send back data maitre
//                 .then(data => {
//                     // now we try to find if marque is in the base
//                     db.marque.findOne({
//                         // where marque = marque
//                         where: {marque: req.body.marque}
//                     })
//                     // then send marque when get back // smarque est une variable qui s'autodéclare
//                     // on aurait pu mettre res ou response mais c'était deja utilisé
//                         .then(smarque => {
//                             // if marque is not in base so do this
//                             if (!smarque) {
//                                 // we create new marque add data "marque"
//                                 db.marque.create(marque)
//                                 // then send back marque
//                                     .then(smarque => {
//                                         // after then we create cardata to add in database
//                                         const cardata = {
//                                             marqueId: smarque.id,
//                                             modele: req.body.model,
//                                             type_moteur: req.body.type_moteur,
//                                             numero_plaque: req.body.numero_plaque,
//                                             annee: req.body.annee,
//                                             couleur: req.body.couleur,
//                                             maitreId: data.id
//                                         };
//                                         // now we try to find out if this cat is alreaday in database or not
//                                         db.cat.findOne({
//                                             // with this numero plaque
//                                             where: {numero_plaque: req.body.numero_plaque}
//                                         })
//                                         // then we get cat
//                                             .then(cat => {
//                                                 // if cat isn't in data base, add a new one
//                                                 if (!cat) {
//                                                     // create new record in table cat
//                                                     db.cat.create(cardata)
//                                                     // then get back new cats add in datebase
//                                                         .then(cat => {
//                                                             // then get back maitre with cat
//                                                             db.maitre.findOne({
//                                                                 // if needeed, use the attributes
//                                                                 attributes: {
//                                                                     // the col we need to get back
//                                                                     include: [],
//                                                                     // the col we don't need to get back
//                                                                     exclude: []
//                                                                 },
//                                                                 // this include we add the modele with how we want to make join
//                                                                 // like : select * form tbl_user Left join  tbl_cat on tbl_user.id =  tbl_cat.id
                                                                
//                                                                 // cet include signifie que dans maitre, on va ajouter les données de la cat
//                                                                 include: [{
//                                                                     // model = propre à node, c'est le modèle par rapport à la base de données
//                                                                     model: db.cat,
//                                                                     through: {
//                                                                         attributes: ["marqueId"]
//                                                                     },
//                                                                     attributes: {
//                                                                         include: [],
//                                                                         // mask maitreId
//                                                                         exclude: ["maitreId"]
//                                                                     },

//                                                                 }],
//                                                                 // where id = data.id // then : where id maitre = id maitre new maitre we add in database s
//                                                                 where: {id: data.id}
//                                                                 // (juste pour le maitre en cours d'ajout)
//                                                             })
//                                                             // then sent back maitre in json
//                                                                 .then(maitre => {
//                                                                     // that will be in json {
//                                                                     // maitre: {
//                                                                     // nom: "",
//                                                                     // prenom: "",
//                                                                     // etc ...,
//                                                                     // tbl_cat: {etc ...}}
//                                                                     res.json({maitre: maitre});
//                                                                 })
//                                                                 // if error then catch it and send the error msg back to site or postman
//                                                                 .catch(err => {
//                                                                     res.json({
//                                                                         error: "error " + err
//                                                                     })
//                                                                 })
//                                                         })
//                                                 }
//                                                 // show message
//                                                 else {
//                                                     // the error message will be sent in json
//                                                     res.json({
//                                                         message: "this cat is already in your list so you can't add it."
//                                                     })
//                                                 }
//                                             })

//                                     })
//                                     // if error catch then and send back to site or postman
//                                     .catch(err => {
//                                         res.json({
//                                             error: "error " + err
//                                         })
//                                     })
//                             } else {
//                                 // then we create data car to add in database
//                                 var cardata = {
//                                     marqueId: smarque.id,
//                                     modele: req.body.model,
//                                     type_moteur: req.body.type_moteur,
//                                     numero_plaque: req.body.numero_plaque,
//                                     annee: req.body.annee,
//                                     couleur: req.body.couleur,
//                                     maitreId: data.id
//                                 };
//                                 // now we try to find is cat is in database
//                                 db.cat.findOne({
//                                     where: {numero_plaque: req.body.numero_plaque}
//                                 })

//                                     .then(cat => {
//                                         // if not cat with this numero plaque so we create new cat
//                                         if (!cat) {
//                                             // create new cat
//                                             db.cat.create(cardata)
//                                                 .then(cat => {
//                                                     // find maitre with cat
//                                                     db.maitre.findOne({
//                                                         attributes: {
//                                                             include: [],
//                                                             exclude: []
//                                                         },
//                                                         include: [{
//                                                             // get cat with maitre
//                                                             model: db.cat,
//                                                             attributes: {
//                                                                 include: [],
//                                                                 // don't get cliendId in response
//                                                                 exclude: ["maitreId"]
//                                                             },
//                                                         }],
//                                                         // where id  = id
//                                                         where: {id: data.id}
//                                                     })
//                                                     // then get maitre with cat
//                                                         .then(maitre => {
//                                                             // send back response in json maitre
//                                                             res.json({maitre: maitre});
//                                                         })
//                                                         // catch if error
//                                                         .catch(err => {
//                                                             // send back response in json  error
//                                                             res.json({
//                                                                 // message = " error = 'error  + err'"
//                                                                 error: "error " + err
//                                                             })
//                                                         })
//                                                 })
//                                         }
//                                         // else send response message
//                                         else {
//                                             res.json({
//                                                 // send back message error to show user app this cat is alreaday in your liste
//                                                 message: "this cat is already in your list so you can't add it."
//                                             })
//                                         }
//                                     })
//                             }
//                             // catch error send back error and show error
//                         }).catch(err => {
//                         // sebd back response in json
//                         res.json({
//                             // error : error + err
//                             error: "error " + err
//                         })
//                     })
//                 })
//                 // catch error send back error
//                 .catch(err => {
//                     // send back response in json
//                     res.json({error: "can't add maitre in your database" + err})
//                 })
//         }
//         // esle  : if maitre allready in yous liste
//         else {
//             // send back respose in json error : maitre allready in your liste
//             res.json({error: "maitre already in your list"})
//         }
//     })
// });


// // update maitre in params his id
// // Je vais faire une mise à jour de maitre via son id
// // je modifie les infos dans .then et la réponse retournée sera en format json
// // .then cest la suite de ce quon demande, la suite du déroulement des choses
// // le premier .then est relié au maitre, le 2ème au update
// //  exmple : localhost:{your port}/{your prefix}/{name_maitre}/{id }
// maitre.put("/update/:id", (req, res) => {
//     // find one client
//     db.client.findOne({
//         where: {id: req.params.id}
//     })
//     // if this client already in your database then update
//         .then(() => {
//             // make update client with body and id parmas
//             db.client.update(
//                 {
//                     nom: req.body.nom,
//                     prenom: req.body.prenom,
//                     email: req.body.email,
//                     tel: req.body.tel
//                 },
//                 {
//                     where: {id: req.params.id},
//                     returning: true,  // si tu as réussi à faire les updates, tu m'envoies 1 sinon 0.
//                     plain: true  // Envoie moi toutes les données que tu as modifié sans exception (sur le site dans le format json (=en)).
//                 })
//             //
//                 .then(() => {
//                     // then find new data of your client and update
//                     db.client.findOne({
//                         where: {id: req.params.id}
//                     })
//                         .then(client => {
//                             res.send(client);
//                         })
//                         .catch(err => {
//                             res.json({
//                                 error: "error " + err
//                             })
//                         })
//                 })
//                 .catch(err => {
//                     res.json("error " + err)
//                 })
//         })
//         .catch(err => {
//             res.json({
//                 error: "can't update client" + err
//             })
//         })
// });

// // delete  one client
// client.delete("/delete/:id", (req, res) => {
//     //find one client where id = id
//     db.client.findOne({
//         where: {id: req.params.id}
//     })
//     // then get var client
//         .then((client) => {
//             // if not client
//             if (!client) {
//                 // send back error message error
//                 // response in json send back error : this client does not exist in your list so you can't delete
//                 res.json({
//                     error: "this client does not exist in your base"
//                 })
//             } else {
//                 // if client exist so delete it where id = params.id
//                 client.destroy()
//                 // send back message in json to confime that your client is deleeted !
//                     .then(() => {
//                         res.json({status: "client deleted"})
//                     })
//                     // if error catch it and  send back in json to show the user of app you can't delete client you have some probleme
//                     .catch(err => {
//                         res.json({
//                             error: "error" + err
//                         })
//                     })
//             }
//         })
//         // if error catch it and  send back in json to show the user of app you can't delete client you have some probleme
//         .catch(err => {
//             res.json({
//                 error: "error" + err
//             })
//         })
// });


// module.exports = client;

// /************************************** end route client ****************************************************
//  *****************************************************************************************************************/


