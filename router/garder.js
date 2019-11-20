/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
const express = require('express');

// /**
//  * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
//  * Each route can have one or more handler functions, which are executed when the route is matched.
//  * Route definition takes the following structure:
//  * route.METHOD (PATH, HANDLER)
//  *
//  * * GET : The GET method requests a representation of the specified ressource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
//  * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
//  * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web ressource identified by the URI. The data POSTed might be, for example, an annotation for existing ressources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
//  * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing ressource, it is modified; if the URI does not point to an existing ressource, then the server can create the ressource with that URI.[24]
//  * DELETE : The DELETE method deletes the specified ressource.
//  * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
//  * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific ressource.
//  * PATCH : The PATCH method applies partial modifications to a ressource.
//  *
//  * @type { Router }
//  */
const garder = express.Router();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../database/db');

const Sequelize = require('sequelize');
// sequilze.op permet de récupérer tous les opérateurs
const Op = Sequelize.Op
const fn = Sequelize.fn
/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start route module ****************************************************
 *****************************************************************************************************************/

// Add new
garder.post("/new", (req, res) => {
  console.log(req.body);
  const garderdata = {
    debut: req.body.debut,
    fin: req.body.fin,
    message: req.body.message,
    statut: 0,
    idChat: req.body.id_chat,
    idNounou: req.body.id_nounou
  };
    
    garderdata.idChat.forEach(idChat => {
        garderdata.idChat = idChat;
    db.garder
      .create(garderdata)
      .then(garder => {
        res.json({ garder: garder });
      })
      .catch(err => {
        res.send("error " + err);
      });
  });
});;

// update 
garder.put("/update", (req, res) => {
    db.garder.findOne({
        where: {idgarder: req.body.id_garder}
    })
        .then(garder => {
           if(garder){
              garder.update({
                debut: req.body.debut,
                fin: req.body.fin,
                message: req.body.message,
                statut: req.body.statut,
                idChat: req.body.id_chat,
                idNounou: req.body.id_nounou
              });
               res.json(
                 "mise à jour de la garde par l'id effectuée avec succès"
               );
           }
           else {
               res.json({
                   error: "can't update this garder, it does not exist"
               })
           }
        })
        .catch(err => {
            res.send('error ' + err)
        })
});

// get all garder d'un maitre précis
 
garder.get("/AllgarderByMaitre", (req,res) =>{
    db.garder.findAll({
        where: { 
            [Op.and]: [{type_de_personne_notee: "maitre"} , {idMaitre:req.body.id_maitre}]
            }, 
            order: [["note", "desc"]],
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(garders =>{
        res.json(garders)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});

garder.get("/AllgarderByNounou", (req,res) =>{
    db.garder.findAll({
        where: { 
            [Op.and]: [{type_de_personne_notee: "nounou"} , {idNounou:req.body.id_nounou}]
            }, 
            order: [["note", "desc"]],
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(garders =>{
        res.json(garders)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});


// // delete garder via id
garder.delete("/delete", (req,res) =>{
    // find the garder you want to delete
    db.garder.findOne({
        where:{idgarder: req.body.id_garder}
    }).then(garder =>{
        // if garder exists :
        if(garder) {
            // delete garder
            garder.destroy().then(() => {
                // send back the confirmation that garder is deleted
                res.json("garder supprimé via ID")
            })
            // catch if error
                .catch(err => {
                    // send back the error to inform in json
                    res.json("erreur" + err)
                })
        }
        else {
            // send back the error message to inform that you can't delete this garder, it does not exist in your database
            res.json({error : "impossible de supprimer cet garder, il n'existe pas dans la base de données"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});


// // delete by prénom et id maitre
// chat.delete("/deleteByPrenomEtIDMaitre", (req, res) => {
//     db.chat.findOne({
//         where: { 
//     [Op.and]: [{prenom_chat:req.body.prenom_chat}, {idMaitre:req.body.id_maitre}]
// }
//     })
//     .then(chat =>{
//                 // if chat exists :
//                 if(chat) {
//                     // delete this chat
//                     chat.destroy().then(() => {
//                         // send back the confirmation that chat is deleted
//                         res.json("chat supprimé via prénom et id maitre")
//                     })
//                     // catch if error
//                         .catch(err => {
//                             // send back the error to info that in json
//                             res.json("erreur" + err)
//                         })
//                 }
//                 else {
//                     // send back the error message to inform that you can't delete this chat because it does not exist in your database
//                     res.json({error : "impossible de supprimer cette chat, elle n'existe pas dans la base de données"})
//                 }
//             })
//                 .catch(err =>{
//                     // send back the message error
//                     res.json("erreur" + err);
//                 })
//         });


module.exports = garder;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
