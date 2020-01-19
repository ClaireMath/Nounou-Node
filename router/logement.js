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
const logement = express.Router();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../database/db');

const Sequelize = require('sequelize');
// sequilze.op permet de récupérer tous les opérateurs
const Op = Sequelize.Op
/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start route module ****************************************************
 *****************************************************************************************************************/

// create new accomodation :
logement.post("/create", (req, res) => {
    const logementdata = {
        type_de_logement: req.body.type_de_logement,
        superficie: req.body.superficie,
        nombre_d_habitants: req.body.nombre_d_habitants,
        sans_enfant: req.body.sans_enfant,
        sans_animal: req.body.sans_animal,
        acces_a_l_exterieur: req.body.acces_a_l_exterieur,
       
        idNounou:req.body.id_nounou
    };
    // find out if logement exists or not
    db.logement.findOne({
        where: { idNounou:req.body.id_nounou }
    })
        .then(flat => {
            if (!flat) {
                db.logement.create(logementdata)
                    .then(flat => {
                        
                        res.json({flat: flat})
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                flat.update(logementdata)
                .then(flat => {
                res.json({flat: flat})
                })
                .catch(err => {
                    res.json({
                        error: "error" + err
                    })   
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});


// update 
logement.put("/update/:idNounou", (req, res) => {
    db.logement.findOne({
        where: { idNounou:req.params.id_nounou }
    })
        .then(flat => {
           if(flat){
                flat.update({
                type_de_logement: req.body.type_de_logement,
                   superficie: req.body.superficie,
                   nombre_d_habitants: req.body.nombre_d_habitants,
                   sans_enfant: req.body.sans_enfant,
                   sans_animal: req.body.sans_animal,
                   autres_animaux_vivants_dans_l_appartement: req.body.autres_animaux_vivants_dans_l_appartement,
                   acces_a_l_exterieur: req.body.acces_a_l_exterieur,
        
                  
                   idNounou:req.body.id_nounou   
               })
               res.json(
                   "mise à jour via l'id Nounou effectuée avec succès")
           }
           else {
               res.json({
                   error: "can't update this accomodation, the flat does not exist"
               });
           }
        })
        .catch(err => {
            res.send('error ' + err)
        })
});

   // get one by idNounou
logement.get("/getOneByIdNounou/:idNounou", (req,res) =>{
    db.logement.findOne({
        where: { idNounou:req.params.idNounou },
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(flat =>{
        res.json(flat)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});


module.exports = logement;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
