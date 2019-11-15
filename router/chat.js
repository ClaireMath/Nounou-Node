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
const chat = express.Router();

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

process.env.SECRET_KEY = "secret";


// Add new
chat.post("/newCat", (req, res) => {
    const chatdata = {
        prenom_chat: req.body.prenom_chat,
        sterilise: req.body.sterilise,
        photo: req.body.photo,
        tolere_les_chats: req.body.tolere_les_chats,
        tolere_les_animaux: req.body.tolere_les_animaux,
        a_peur_des_enfants: req.body.a_peur_des_enfants,
        probleme_de_sante_particulier: req.body.probleme_de_sante_particulier,
        description: req.body.description,
        idMaitre:req.body.id_maitre
    };
    // find out if chat exists or not
    // select * from chat where renom = 'matou' AND idMaitre = '25'
    db.chat.findOne({
        where: { 
            [Op.and]: [{prenom_chat:req.body.prenom_chat}, {idMaitre:req.body.id_maitre}]
                }
                    })
        .then(chat => {
            if (!chat) {
                db.chat.create(chatdata)
                    .then(cat => {
                        // then link maitre with cat
                        db.maitre.findOne({
                            // if needeed, use the attributes
                            attributes: {
                                // the col we need to get back
                                include: [],
                                // the col we don't need to get back
                                exclude: []
                            },
                                                           
                                   // where id = data.id // then : where id maitre = id maitre new maitre we add in database
                                   where: {idMaitre: cat.idMaitre}
                               })
                               .then (newCat => {
                                   res.json({cat});
                               })
                        
                               .catch(err => {
                                   res.send('error 1' + err)
                               })
                    })
                    .catch(err => {
                        res.send('error 2' + err)
                    })
            } else {
                chat.update(chatdata)
                .then(chat => {
                res.json(chat)
                  alert("votre chat a été mis à jour")  
                })
                .catch(err => {
                    res.send({
                        error: "error" + err
                    })
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error 3" + err
            })
        })
});

// update (un post fonctionnerait aussi)
chat.put("/update", (req, res) => {
    db.chat.findOne({
        where: { 
    [Op.and]: [{prenom_chat:req.body.prenom_chat}, {idMaitre:req.body.id_maitre}]
}
    })
        .then(chat => {
           if(chat){
              chat.update({
                // prenom_chat: req.body.prenom_chat,
                photo: req.body.photo,
                sterilise: req.body.sterilise,
                tolere_les_chats: req.body.tolere_les_chats,
                tolere_les_animaux: req.body.tolere_les_animaux,
                a_peur_des_enfants: req.body.a_peur_des_enfants,
                probleme_de_sante_particulier: req.body.probleme_de_sante_particulier,
                description: req.body.description      
               })
               res.json(
                   "mise à jour par le prénom du chat et l'id de son Maitre effectuée avec succès"
               )
           }
           else {
               res.json({
                   error: "can't update this cat, the account does not exist"
               })
           }
        })
        .catch(err => {
            res.send('error ' + err)
        })
});


// update du prénom
chat.put("/updatePrenom", (req, res) => {
    db.chat.findOne({
        where: { 
    [Op.and]: [{idChat:req.body.id_chat}, {idMaitre:req.body.id_maitre}]
}
    })
        .then(chat => {
           if(chat){
              chat.update({
                prenom_chat: req.body.prenom_chat,
                photo: req.body.photo,
                sterilise: req.body.sterilise,
                tolere_les_chats: req.body.tolere_les_chats,
                tolere_les_animaux: req.body.tolere_les_animaux,
                a_peur_des_enfants: req.body.a_peur_des_enfants,
                probleme_de_sante_particulier: req.body.probleme_de_sante_particulier,
                description: req.body.description      
               })
               res.json(
                   "mise à jour du prénom du chat via l'id du chat effectuée avec succès"
               )
           }
           else {
               res.json({
                   error: "can't update this cat, the account does not exist"
               })
           }
        })
        .catch(err => {
            res.send('error ' + err)
        })
});

// get one cat via its idCat
chat.get("/getOneById/:id_chat", (req,res) =>{
    db.chat.findOne({
        where: {idChat: req.params.id_chat},
        
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(chats =>{
        res.json(chats)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});

// get one cat from a specific owner
chat.get("/getOneByMaitre", (req,res) =>{
    db.chat.findOne({
        where: { 
            [Op.and]: [{prenom_chat:req.body.prenom_chat}, {idMaitre:req.body.id_maitre}]
        },
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(chats =>{
        res.json(chats)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});


// get all chats
chat.get("/AllChats", (req,res) =>{
    db.chat.findAll({
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(chats =>{
        res.json(chats)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});

// get all chats d'un maitre précis
 
chat.get("/AllChatsByMaitre/:id_maitre", (req,res) =>{
    db.chat.findAll({
        where: {idMaitre: req.params.id_maitre},
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(chats =>{
        res.json(chats)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});

chat.get("/AllChatsByPrenom", (req,res) =>{
    db.chat.findAll({
        where: { 
            prenom_chat:req.body.prenom_chat
        },
        attributes:{
            exclude:["created_at", "updated_at"]
        }
    })
    .then(chats =>{
        res.json(chats)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});


// update by idChat
chat.put("/updateById/:idChat", (req, res) => {
    db.chat.findOne({
        where: {idChat: req.params.idChat}
    })
                .then(chat => {
                    if(chat){
                    db.chat.update({
                    prenom_chat: req.body.prenom_chat,
                    sterilise: req.body.sterilise,
                    tolere_les_chats: req.body.tolere_les_chats,
                    tolere_les_animaux: req.body.tolere_les_animaux,
                    a_peur_des_enfants: req.body.a_peur_des_enfants,
                    probleme_de_sante_particulier: req.body.probleme_de_sante_particulier,
                    description: req.body.description 
                })
                res.json(
                    "mise à jour par id effective"
                )}

            else {
                res.json({
                    error: "Impossible de mettre à jour ce compte chat car le compte n'existe pas."
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
    });


// // delete chat via id
chat.delete("/delete/:id", (req,res) =>{
    // find the chat you want to delete
    db.chat.findOne({
        where:{idChat: req.params.id}
    }).then(chat =>{
        // if chat exists :
        if(chat) {
            // delete chat
            chat.destroy().then(() => {
                // send back the confirmation that chat is deleted
                res.json("chat supprimé via ID")
            })
            // catch if error
                .catch(err => {
                    // send back the error to inform in json
                    res.json("erreur" + err)
                })
        }
        else {
            // send back the error message to inform that you can't delete this chat, it does not exist in your database
            res.json({error : "impossible de supprimer ce chat, il n'existe pas dans la base de données"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});


// delete by prénom et id maitre
chat.delete("/deleteByPrenomEtIDMaitre", (req, res) => {
    db.chat.findOne({
        where: { 
    [Op.and]: [{prenom_chat:req.body.prenom_chat}, {idMaitre:req.body.id_maitre}]
}
    })
    .then(chat =>{
                // if chat exists :
                if(chat) {
                    // delete this chat
                    chat.destroy().then(() => {
                        // send back the confirmation that chat is deleted
                        res.json("chat supprimé via prénom et id maitre")
                    })
                    // catch if error
                        .catch(err => {
                            // send back the error to info that in json
                            res.json("erreur" + err)
                        })
                }
                else {
                    // send back the error message to inform that you can't delete this chat because it does not exist in your database
                    res.json({error : "impossible de supprimer cette chat, elle n'existe pas dans la base de données"})
                }
            })
                .catch(err =>{
                    // send back the message error
                    res.json("erreur" + err);
                })
        });


module.exports = chat;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
