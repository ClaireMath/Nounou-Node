/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
const express = require('express');

/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * route.METHOD (PATH, HANDLER)
 *
 * * GET : The GET method requests a representation of the specified ressource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web ressource identified by the URI. The data POSTed might be, for example, an annotation for existing ressources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing ressource, it is modified; if the URI does not point to an existing ressource, then the server can create the ressource with that URI.[24]
 * DELETE : The DELETE method deletes the specified ressource.
 * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific ressource.
 * PATCH : The PATCH method applies partial modifications to a ressource.
 *
 * @type { Router }
 */
const avis = express.Router();

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

// Add new avis sur une nounou (c'est le maitre qui note)
avis.post("/newAvisOnN", (req, res) => {
    const avisdata = {
        type_de_personne_notee: "nounou",
        note: req.body.note,
        commentaire: req.body.commentaire,
        idMaitre:req.body.id_maitre,
        idNounou:req.body.id_nounou,
        idGarde: req.body.id_garde
    };    
        db.avis.create(avisdata)  
            .then(avis => {
                            
                res.json({avis: avis})
            })
            .catch(err => {
                res.send('error ' + err)
            })
});

// update 
avis.put("/update", (req, res) => {
    db.avis.findOne({
        where: {idAvis: req.body.id_avis}
    })
        .then(avis => {
           if(avis){
              avis.update({
                type_de_personne_notee: req.body.type_de_personne_notee,
                note: req.body.note,
                commentaire: req.body.commentaire,
                idMaitre:req.body.id_maitre,
                idNounou:req.body.id_nounou      
               })
               res.json(
                   "mise à jour par l'id de l'avis effectuée avec succès"
               )
           }
           else {
               res.json({
                   error: "can't update this avis, it does not exist"
               })
           }
        })
        .catch(err => {
            res.send('error ' + err)
        })
});

// get all avis d'un maitre précis
 
avis.get("/AllAvisByMaitre", (req,res) =>{
    db.avis.findAll({
        where: { 
            [Op.and]: [{type_de_personne_notee: "maitre"} , {idMaitre:req.body.id_maitre}]
            }, 
            order: [["note", "desc"]],
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(aviss =>{
        res.json(aviss)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});

avis.get("/AllAvisByNounou/:id", (req,res) =>{
    // console.log(req.params);
    db.avis.findAll({
        where: { 
            [Op.and]: [{type_de_personne_notee: "nounou"} , {idNounou:req.params.id}]
            }, 
            include: [{
                model: db.maitre,
            }],
            order: [["note", "desc"]],
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(aviss =>{
        res.json(aviss)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});


// // delete avis via id
avis.delete("/delete", (req,res) =>{
    // find the avis you want to delete
    db.avis.findOne({
        where:{idAvis: req.body.id_avis}
    }).then(avis =>{
        // if avis exists :
        if(avis) {
            // delete avis
            avis.destroy().then(() => {
                // send back the confirmation that avis is deleted
                res.json("avis supprimé via ID")
            })
            // catch if error
                .catch(err => {
                    // send back the error to inform in json
                    res.json("erreur" + err)
                })
        }
        else {
            // send back the error message to inform that you can't delete this avis, it does not exist in your database
            res.json({error : "impossible de supprimer cet avis, il n'existe pas dans la base de données"})
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


module.exports = avis;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
