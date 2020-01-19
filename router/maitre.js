/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
const express = require('express');

/**
 * Routing refers to determining how an application responds to a maitre request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * route.METHOD (PATH, HANDLER)
 *
 * * GET : The GET method requests a representation of the specified ressource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web ressource identified by the URI. The data POSTed might be, for example, an annotation for existing ressources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing ressource, it is modified; if the URI does not point to an existing ressource, then the server can create the ressource with that URI.[24]
 * DELETE : The DELETE method deletes the specified ressource.
 * TRACE : The TRACE method echoes the received request so that a maitre can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific ressource.
 * PATCH : The PATCH method applies partial modifications to a ressource.
 *
 * @type { Router }
 */
const maitre = express.Router();

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('../database/db');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start route module ****************************************************
 *****************************************************************************************************************/

 // le process va générer une clef secrète et on le renome secret
 process.env.SECRET_KEY = "secret";

 // add new maitre
 maitre.post("/newMaitre", (req, res) => {
    const maitredata = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      mdp: req.body.mdp,
    };
        // try to find out if maitre exists in base
        db.maitre.findOne({
            where: {email: req.body.email}
        })
        .then(maitre => {
            // if maitre isn't in base so
            if (!maitre) {
                const hash = bcrypt.hashSync(maitredata.mdp, 10);
                maitredata.mdp = hash;
                // we create new maitre add data "maitredata"
                db.maitre.create(maitredata)
                    .then(maitre => {
                        let token = jwt.sign(maitre.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                        });
                
                        res.json({token: token});
            })
            // if error then catch it and send the error msg back to site or postman
            .catch(err => {
                res.json({error: "error 1 " + err})
            })
        }  else {
            // else  : if maitre already in your list
    // send back response in json error : maitre already in your list
    res.json({error: "maitre already in your list"})
    alert('Votre compte existe déjà.')
                }
            })
    // if error catch then and send back to site or postman
    .catch(err => {
        res.json({
            error: "error 2 " + err
      })
    })
})


////////////////////////////////////////////////////////////////////////////////////////
// login
// tu me fais cette action => trouve-moi un utilisateur dont l'email 
// correspond à celui envoyé dans l'interface
maitre.post("/login", (req, res) => {
    db.maitre.findOne({
        where: { email: req.body.email }
    })
        // ensuite si tu trouves, tu me retournes la réponse
        .then(user => {
            if (user.banni == 0) {
                // si le mot de passe crypté correspond à celui récup par la requête             
                // dans ce cas là tu me signes un token
                    if (bcrypt.compareSync(req.body.mdp, user.mdp)) {
                    // dataValues (récupère les données de l'utilisateur recherché sur le findOne)
                    let token = jwt.sign(
                        user.dataValues,
                        process.env.SECRET_KEY,
                        {
                            expiresIn: 1440
                        }
                    );
                    res.json({ token: token });
                    // si les deux mdp ne correspondent pas, tu envoies une erreur
                } else {
                    res.status(404).json({error: "Connexion refusée, erreur dans l'email ou dans le mot de passe"});   
                }
            } else {
                res.json({ 
                    banni: "Vous êtes banni, vous n'avez plus accès au site" })
            }
            })
        // si tu n'as pas réussi à trouver le maitre, tu me renvoies l'erreur
    .catch(err => {
            res.send('erreur' + err)
        })
});

// // update 0 
// maitre.put("/updateProfileMaitreChat", (req, res) => {
   
//     const maitredata = {
//         nom: req.body.nom,
//         prenom: req.body.prenom,
//         adresse: req.body.adresse,
//         ville: req.body.ville,
//         code_postal: req.body.code_postal,
//         email: req.body.email,
//         telephone: req.body.telephone,
//         nombre_de_chats: req.body.nombre_de_chats,
//         // mdp: req.body.mdp,
//         statut_disponible: req.body.statut_disponible,
//         token: req.body.token
//     };
//         // try to find out if maitre exists in base
//         db.maitre.findOne({
//             where: {email: req.body.email}
//         })
//         .then(maitre => {
//             if (maitre) {
//                 const hash = bcrypt.hashSync(maitredata.mdp, 10);
//                 maitredata.mdp = hash;
//                     db.chat.findOne({
//                     where: { 
//                         [Op.and]: [{prenom_chat:req.body.prenom_chat}, {idMaitre:req.body.id_maitre}]
//                             }
//                                 }) 

//                         // we create catdata to add in database
//                         const catdata = {
//                             prenom_chat: req.body.prenom_chat,
//                             sterilise: req.body.sterilise,
//                             tolere_les_chats: req.body.tolere_les_chats,
//                             tolere_les_animaux: req.body.tolere_les_animaux,
//                             a_peur_des_enfants: req.body.a_peur_des_enfants,
//                             probleme_de_sante_particulier: req.body.probleme_de_sante_particulier,
//                             description: req.body.description,
//                             idMaitre: nouveauMaitre.idMaitre
//                         };
                     
//                             db.chat.create(catdata)
//                               // then get back new cats add in datebase
//                                   .then(cat => {
//                                       // then link maitre with cat
//                                       db.maitre.findOne({
//                                           // if needeed, use the attributes
//                                           attributes: {
//                                               // the col we need to get back
//                                               include: [],
//                                               // the col we don't need to get back
//                                               exclude: []
//                                           },
//                                           // with this include, we add the model of how we want to make join
//                                           // like : select * form tbl_user Left join  tbl_cat on tbl_user.id =  tbl_cat.id
//                                           include: [{
//                                               model: db.chat,
//                                           }],
                                             
//                                                  // where id = data.id // then : where id maitre = id maitre new maitre we add in database
//                                                  where: {idMaitre: cat.idMaitre}
//                                              })
//                                             // then sent back maitre in json
//                                                 .then(maitre => {
//                                                     let token = jwt.sign(maitre.dataValues, process.env.SECRET_KEY, {
//                                                         expiresIn: 1440
//                                                     });
//                                                     // that will be in json {
//                                                     // maitre: {
//                                                     // nom: "",
//                                                     // prenom: "",
//                                                     // etc ...,
//                                                     // tbl_cat: {etc ...}}
//                                                     res.json({token: token});
//                                                 })
//                                                 // if error then catch it and send the error msg back to site or postman
//                                                 .catch(err => {
//                                                     res.json({
//                                                         error: "error 1 " + err
//                                                     })
//                                                     })
//                                                 })
//                                   })
//                                         // if error catch then and send back to site or postman
//                                         .catch(err => {
//                                             res.json({
//                                                 error: "error 2 " + err
//                                             })
                            
//                                                     })   
//             }
//             // else  : if maitre already in your list
//             else {
//                 // send back response in json error : maitre already in your list
//                 res.json({error: "maitre already in your list"})
//             }
//         })
//         .catch(err => {
//             res.json({
//                 error: "error 3 " + err
//             })
//             });
// });
// update : BAN AND UN-BAN
maitre.put("/banUnBanById", (req, res) => {
  db.maitre
    .findOne({
      where: { idMaitre: req.body.idMaitre }
    })
    .then(user => {
      if (user) {
          user
            .update({
              banni: req.body.banni
            })
            .then(user => {
              db.maitre
                .findOne({
                  where: { idMaitre: req.body.idMaitre }
                })
                .then(user => {
                  
                  res.json(user);
                })
                .catch(err => {
                  res.send("error " + err);
                });
            })
            .catch(err => {
              res.send("error " + err);
            });
      } else {
        res.json({
          error: "Impossible de modifier le statut 'banni'."
        });
      }
    })
    .catch(err => {
      res.send("error" + err);
    });
});

// update : MAKE AND UNMAKE ADMIN
maitre.put("/makeUnMakeAdminById", (req, res) => {
//   if (req.body.admin == true) {
//     req.body.admin = 1;
//   } else {
//     req.body.admin = 0;
//   }
  db.maitre
    .findOne({
      where: { idMaitre: req.body.idMaitre }
    })
      
      
    .then(user => {
      if (user) {
        user
          .update({
            admin: req.body.admin
          })
          .then(user => {
            db.maitre
              .findOne({
                where: { idMaitre: req.body.idMaitre }
              })
              .then(user => {
                res.json(user);
              })
              .catch(err => {
                res.send("error " + err);
              });
          })
          .catch(err => {
            res.send("error " + err);
          });
      } else {
        res.json({
          error: "Impossible de modifier le statut 'admin'."
        });
      }
    })
    .catch(err => {
      res.send("error" + err);
    });
});

// update1 (.post ou .put fonctionnent tout les deux)
maitre.post("/updateByEmail", (req, res) => {
    db.maitre.findOne({
        where: {email: req.body.email}
    })
        .then(user => {
           if(user){
                // make hash of mdp in bcrypt, salt 10
                const hash = bcrypt.hashSync(req.body.mdp, 10);
                user.update({
                nom: req.body.nom,
                prenom: req.body.prenom,
                adresse: req.body.adresse,
                ville: req.body.ville,
                code_postal: req.body.code_postal,
                telephone: req.body.telephone,
                email: req.body.email,
                mdp: req.body.mdp,        
                nombre_de_chats: req.body.nombre_de_chats,
                statut_disponible: req.body.statut_disponible
               })
               res.json(
                "mise à jour par email effective"
            )
           }
           else {
               res.json({
                   error: "can't update this maitre, the account does not exist"
               })
           }
        })
        .catch(err => {
            res.send('error ' + err)
        })
});

// update2 via id   (.post fonctionne aussi) là, on dit à la route qu'on va faire une mise à jour
// dans l'url de postman : localhost:6001/maitre/update/2 (pour changer la ligne qui a l'id 2)
maitre.put("/updateById/:id", (req, res) => {
    db.maitre.findOne({
        where: {id_maitre: req.params.id}
    })
        .then(user => {
            if(user){
                // make hash of mdp in bcrypt (pour encrypter le mdp), salt 10
                const hash = bcrypt.hashSync(req.body.mdp, 10);
                // propre à tous les ORM, et là en l'occurrence, le nôtre c'est sequelize
                // cet update là cest pour procéder à la mise à jour dans la base
                user.update({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    adresse: req.body.adresse,
                    ville: req.body.ville,
                    code_postal: req.body.code_postal,
                    email: req.body.email,
                    telephone: req.body.telephone,
                    nombre_de_chats: req.body.a_deja_eu_des_chats,
                    mdp: req.body.mdp,
                    statut_disponible: req.body.statut_disponible
                })
                res.json(
                    "mise à jour par id effective"
                )
            }
            else {
                res.json({
                    error: "Impossible de mettre à jour ce compte maitre car le compte n'existe pas."
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});

// update3 update du mdp
maitre.put("/updateMDPById/:id", (req, res) => {
    db.maitre.findOne({
        where: {idMaitre: req.params.id}
    })
        .then(user => {
           if(user){
                // make hash of mdp in bcrypt, salt 10
                const hash = bcrypt.hashSync(req.body.mdp, 10);
                user.update({
                mdp: hash        
               })
               res.json(
                "mise à jour du mdp par email effective"
            )
           }
           else {
               res.json({
                   error: "can't update this maitre, the account does not exist"
               })
           }
        })
        .catch(err => {
            res.send('error ' + err)
        })
});

// // delete maitre
maitre.delete("/deleteById/:id", (req,res) =>{
    // find the maitre you want to delete
    db.maitre.findOne({
        where:{id_maitre: req.params.id}
    }).then(maitre =>{
        // if maitre exists :
        if(maitre) {
            // delete maitre
            maitre.destroy()
            .then(() => {
                // send back the confirmation that maitre is deleted
                res.json("maitre supprimé via l'id")
            })
            // catch if error
                .catch(err => {
                    // send back the error to inform that in json
                    res.json("erreur " + err)
                })
        }
        else {
            // send back the error message to inform that you can't delete this maitre, it does not exist in your database
            res.json({error : " impossible de supprimer ce maitre, il n'existe pas dans la base de données"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur " + err);
        })
});


// // delete maitre via email
maitre.delete("/deleteBy/:email", (req,res) =>{
    // find the maitre you want to delete
    db.maitre.findOne({
        where:{email: req.params.email}
    }).then(maitre =>{
        // if maitre exists :
        if(maitre) {
            // delete this maitre
            maitre.destroy().then(() => {
                // send back the confirmation that maitre is deleted
                res.json("maitre supprimé via son email")
            })
            // catch if error
                .catch(err => {
                    // send back the error to info that in json
                    res.json("erreur" + err)
                })
        }
        else {
            // send back the error message to inform that you can't deleted this maitre because it does not exist in your database
            res.json({error : "impossible de supprimer ce maitre, il n'existe pas dans la base de données"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});


// find by id maitre
maitre.get("/getOneById/:id", (req,res) =>{
    // find the employe by email
    db.maitre.findOne({
        attributes:{
            exclude:["mdp", "telephone", "admin", "created_at", "updated_at","idLogement"]
        },
        where:{idMaitre: req.params.id},
        include: [{
            model: db.chat,
        }]
    }).then(maitre =>{
        // if maitre exists :

        if(maitre) {
            res.json({
                maitre: maitre
            })
        }
        else {
            // send back this nounou it does not exist in your database
            res.json({error : "Ce maitre n'existe pas dans la liste"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});

// find by email maitre
maitre.get("/displayByEmail/:email", (req,res) =>{
    // find the maitre by email
    db.maitre.findAll({
        attributes:{
        exclude:["mdp","created_at", "updated_at","telephone","admin", "banni"]
    },
        where:{email: req.params.email},
        include: [{
            model: db.chat,
        }],
    }).then(maitre =>{
        // if maitre exists :
        if(maitre) {
            res.json({
                maitre: maitre
            })
        }
        else {
            // send back this maitre it does not exist in your database
             res.json({error : "Ce maitre n'existe pas dans ta liste"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});

// find maitre by name
maitre.get("/displayByName/:nom", (req,res) =>{
    // find the maitre by name
       db.maitre.findAll({
        attributes:{
            exclude:["mdp","created_at", "updated_at","telephone","admin", "banni"]
        }, 
        where:{nom: req.params.nom},
        include: [{
            model: db.chat,
        }],
        include: [{
            model: db.avis,
        }],
    }).then(maitre =>{
        // if maitre exists :
        if(maitre) {
            res.json({
                maitre: maitre
            })
        }
        else {
            // send back this maitre it does not exist in your database
             res.json({error : "Ce maitre n'existe pas dans ta liste (via nom)"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});

// get all Maitres
maitre.get("/displayAll", (req,res) =>{
    db.maitre.findAll({
        attributes:{
            // exclude:["mdp","created_at", "updated_at","telephone", "admin", "banni"]
            exclude:[]

        },
        include: [{
            model: db.chat,
            // include: [{
            //     model: db.avis
            // }]
        }]
    })
    .then(maitres =>{
        res.json(maitres)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});

// // afficher tous les maitres par ville
// maitre.get("/All/:ville", (req,res) =>{
//     // find the maitre by email
//     db.maitre.findAll({
//         attributes:{
//             exclude:["password","created_at", "updated_at","telephone","admin", "banni"]
//         },
//         where:{ville: req.params.ville},
//         include: [{
//             model: db.chat
//         }],
//         include: [{
//             model: db.avis,
//         }]
//     })
//     .then(maitres =>{
//         res.json(maitres)
//     })
//         .catch(err =>{
//             // send back the error message 
//             res.json("erreur " + err);
//         })
// });

// // afficher tous les maitres par code postal
// maitre.get("/displayByCp/:code_postal", (req,res) =>{
//     // find the maitre by email
//     db.maitre.findAll({
//             where:{code_postal: req.params.code_postal},
//             attributes:{
//             exclude:["mdp","created_at", "updated_at","telephone", "admin", "banni"],
//         },
//         include: [{
//             model: db.chat,
//         }],
//         include: [{
//             model: db.avis,
//         }]
//     })
//     .then(maitres =>{
//         res.json(maitres)
//     })
//         .catch(err =>{
//             // send back the error message 
//             res.json("erreur " + err);
//         })
// });

// afficher tous les maitres par status 
// maitre.get("/AllByStatut", (req,res) =>{
//     // find the maitre by email
//     db.maitre.findAll({
//             where:{statut_disponible: req.body.statut_disponible},
//             attributes:{
//             exclude:["mdp","created_at", "updated_at","telephone", "admin", "banni"]
//         },
//         include: [{
//             model: db.chat,
//         }],
//         include: [{
//             model: db.avis,
//         }]
//     })
//     .then(maitres =>{
//         res.json(maitres)
//     })
//         .catch(err =>{
//             // send back the error message 
//             res.json("erreur " + err);
//         })
// });


// ok afficher toutes les maitres DISPONIBLES par ville
maitre.post("/AllByVilleEtStatut", (req,res) =>{
    // console.log(req.body);
    if (req.body.chat.tolere_les_chats == true) {
        req.body.chat.tolere_les_chats = 1;
    } else {
        req.body.chat.tolere_les_chats = 0;
    }
    if (req.body.chat.tolere_les_animaux == true) {
      req.body.chat.tolere_les_animaux = 1;
    } else {
      req.body.chat.tolere_les_animaux = 0;
    }
    if (req.body.chat.a_peur_des_enfants == false) {
      req.body.chat.a_peur_des_enfants = 1;
    } else {
      req.body.chat.a_peur_des_enfants = 0;
    }
    db.maitre
      .findAll({
        attributes: {
          exclude: ["mdp", "created_at", "updated_at", "telephone"]
        },
        where: {
          [Op.and]: [
            { banni: 0 },
            { ville: req.body.maitre.ville },
            { statut_disponible: req.body.maitre.statut_disponible }
          ]
        },
        include: [
          {
            model: db.chat,
            where: {
              [Op.and]: [
                { tolere_les_chats: req.body.chat.tolere_les_chats },
                { tolere_les_animaux: req.body.chat.tolere_les_animaux },
                { a_peur_des_enfants: req.body.chat.a_peur_des_enfants }
              ]
            }
            // model: db.avis,
            // order: [["note", "desc"]]
          }
        ]
        // include: [{
        //     model: db.avis,
        //     order: [["note", "desc"]]
        // }] on ne peut pas lier 3 tables ensemble via le include
      })
      .then(maitres => {
        res.json(maitres);
      })
      .catch(err => {
        // send back the error message
        res.json("erreur " + err);
      });
});

// afficher toutes les maitres DISPONIBLES par code postal
maitre.get('/AllByCPEtStatut', (req, res) => {
    db.maitre.findAll({
        attributes: {exclude: ['mdp', 'created at', 'updated_at', "telephone", "admin", "banni"]},
        where: {
            [Op.and]: [{code_postal: req.body.cp}, {statut_disponible:req.body.statut}]
        },
        include: [{
            model: db.chat,
        }],
        include: [{
            model: db.avis,
        }]
    })
    .then(maitres => {
        res.json(maitres)
    })
    .catch(err => {
        res.json ('erreur ' + err);
    })
})


module.exports = maitre;

/************************************** end router module ****************************************************
*****************************************************************************************************************/
