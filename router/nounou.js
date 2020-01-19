/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
const express = require('express');

/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * route.METHOD (PATH, HANDLER)
 *
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
const nounou = express.Router();

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

process.env.SECRET_KEY = "secret";


// register
nounou.post("/register", (req, res) => {
    const nounoudata = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      adresse: req.body.adresse,
      ville: req.body.ville,
      code_postal: req.body.code_postal,
      telephone: req.body.telephone,
      email: req.body.email,
      mdp: req.body.mdp,
      capacite_d_accueil: req.body.capacite_d_accueil,
      a_deja_eu_des_chats: req.body.a_deja_eu_des_chats,
      a_deja_eu_des_animaux: req.body.a_deja_eu_des_animaux,
      non_fumeur: req.body.non_fumeur,
      peut_consacrer_n_heure_par_jour: req.body.peut_consacrer_n_heure_par_jour,
      description: req.body.description,
      statut_disponible: req.body.statut_disponible,
    };
    // find out if nounou exists or not
        db.nounou.findOne({
        where: {email: req.body.email}
    })
        .then(user => {
            if (!user) {
                // make hash of mdp in bcrypt, salt 10
                const hash = bcrypt.hashSync(nounoudata.mdp, 10);
                nounoudata.mdp = hash;
                db.nounou.create(nounoudata)
                    .then(user => {
                        // dataValue = terme propre à node.js
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.json({token: token})
                    })
                    .catch(err => {
                        res.send('error ' + err)
                    })
            } else {
                res.json({
                    error: "user already exists"
                })
            }
        })
        .catch(err => {
            res.json({
                error: "error" + err
            })
        })

});

// login
// tu me fais cette action => trouve-moi un utilisateur dont l'email 
// correspond à celui envoyé dans l'interface
nounou.post("/login", (req, res) => {
    db.nounou.findOne({
        where: {email: req.body.email}
    })
    // ensuite si tu trouves, tu me retournes la réponse
        .then(user => {
           if (user.banni == 0) {
             // si le mot de passe crypté correspond à celui récup par la requete
             // dans ce cas là tu me signes un token, un token contient toutes les infos de la nounou
             if (bcrypt.compareSync(req.body.mdp, user.mdp)) {
            //    console.log("ok");
            //    console.log(user);
               let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                 expiresIn: 1440
               });
               res.json({ token: token });
               // si les deux mdp ne correspondent pas, tu envoies une erreur
             } else {
                res.status(404).json({error: "Connexion refusée, erreur dans l'email ou dans le mot de passe"});   
             }
           } else {
             res.json({
               banni: "Vous êtes banni, vous n'avez plus accès au site"});
           }
        })
        // si tu n'as pas réussi à trouver l'employé, tu me renvoies l'erreur
        .catch(err => {
            res.send('error' + err)
        })
});


// // update : BANNIR
// nounou.put("/banById", (req, res) => {

//     if (req.body.banni == true) {
//       req.body.banni = 1;
//     } else {
//       req.body.banni = 0;
//     }

//   db.nounou
//     .findOne({
//       where: { idNounou: req.body.idNounou }
//     })
//     .then(user => {
//       if (user) {
//         user.update({
//           banni: req.body.banni=1
//         });
//         res.json("Vous venez de bannir cet utilisateur");
//       } else {
//         res.json({
//           error: "L'utilisateur ne peut pas être banni"
//         });
//       }
//     })
//     .catch(err => {
//       res.send("error" + err);
//     });
// });


// update : BAN AND UN-BAN
nounou.put("/banUnBanById", (req, res) => {
  
  db.nounou
    .findOne({
      where: { idNounou: req.body.idNounou }
    })
    .then(user => {
      if (user) {
          user
            .update({
              banni: req.body.banni
            })
            .then(user => {
              db.nounou
                .findOne({
                  where: { idNounou: req.body.idNounou }
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
nounou.put("/makeUnMakeAdminById", (req, res) => {
//   if (req.body.admin == true) {
//     req.body.admin = 1;
//   } else {
//     req.body.admin = 0;
//   }
  db.nounou
    .findOne({
      where: { idNounou: req.body.idNounou }
    })
      
      
    .then(user => {
      if (user) {
        user
          .update({
            admin: req.body.admin
          })
          .then(user => {
            db.nounou
              .findOne({
                where: { idNounou: req.body.idNounou }
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

// update : UN-MAKEADMIN
nounou.put("/unMakeAdminById", (req, res) => {

    if (req.body.admin == true) {
      req.body.admin = 1;
    } else {
      req.body.admin = 0;
    }

  db.nounou
    .findOne({
      where: { idNounou: req.body.idNounou }
    })
    .then(user => {
      if (user) {
        user.update({
          admin: req.body.admin=0
        });
        res.json("Cet utilisateur n'est plus admin");
      } else {
        res.json({
          error: "Impossible de retirer le statut 'admin' à cet utilisateur"
        });
      }
    })
    .catch(err => {
      res.send("error" + err);
    });
});


// update (un post fonctionnerait aussi)
nounou.post("/updateByEmail", (req, res) => {
    db.nounou.findOne({
        where: {email: req.body.email}
    })
        .then(user => {
           if(user){
                user.update({
                nom: req.body.nom,
                prenom: req.body.prenom,
                adresse: req.body.adresse,
                ville: req.body.ville,
                code_postal: req.body.code_postal, 
                capacite_d_accueil: req.body.capacite_d_accueil,
                telephone: req.body.telephone,
                a_deja_eu_des_chats: req.body.a_deja_eu_des_chats,
                a_deja_eu_des_animaux: req.body.a_deja_eu_des_animaux,
                non_fumeur: req.body.non_fumeur,
                peut_consacrer_n_heure_par_jour: req.body.peut_consacrer_n_heure_par_jour,
                description: req.body.description,
                statut_disponible: req.body.statut_disponible,
               })
               res.json("la mise à jour par email a été effectuée avec succès")
           }
           else {
               res.json({
                   error: "can't update this nounou, the account does not exist"
               })
           }
        })
        .catch(err => {
            res.send('error' + err)
        })
});

// update 
nounou.put("/updateById/:id", (req, res) => {
    db.nounou.findOne({
        where: {idNounou: req.params.id}
    })
        .then(user => {
            if(user){
                // cette update là est propre aux ORM, ici le nôtre, c'est sequelize
                user.update({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    adresse: req.body.adresse,
                    ville: req.body.ville,
                    code_postal: req.body.code_postal,
                    email: req.body.email,
                    capacite_d_accueil: req.body.mdp, capacite_d_accueil,
                    telephone: req.body.telephone,
                    a_deja_eu_des_chats: req.body.a_deja_eu_des_chats,
                    a_deja_eu_des_animaux: req.body.a_deja_eu_des_animaux,
                    non_fumeur: req.body.non_fumeur,
                    peut_consacrer_n_heure_par_jour: req.body.peut_consacrer_n_heure_par_jour,
                
                })
                res.json("la mise à jour via Id a été effectuée avec succès")
            }
            else {
                res.json({
                    error: "Impossible de mettre à jour ce compte nounou car le compte n'existe pas."
                })
            }
        })
        .catch(err => {
            res.send('error' + err)
        })
});


// update3, update du mdp
nounou.put("/updateMDPById/:id", (req, res) => {
    db.nounou.findOne({
        where: {idNounou: req.params.id}
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
                   error: "can't update this password, the account does not exist"
               })
           }
        })
        .catch(err => {
            res.send('error ' + err)
        })
});

// delete nounou
nounou.delete("/deleteById/:id", (req,res) =>{
    // find the nounou you want to delete
    db.nounou.findOne({
        where:{idNounou: req.params.id}
    }).then(nounou =>{
        // if nounou exists :
        if(nounou) {
            // delete nounou
            nounou.destroy().then(() => {
                // send back the confirmation that nounou is deleted
                res.json("nounou supprimée via son ID")
            })
            // catch if error
                .catch(err => {
                    // send back the error to inform in json
                    res.json("erreur " + err)
                })
        }
        else {
            // send back the error message to inform that you can't delete this nounou, it does not exist in your database
            res.json({error : "impossible de supprimer cette nounou, elle n'existe pas dans la base de données"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});


// delete nounou // dans les parenthèses c'est nous qui choisissons le chemin utilisé, cela correspondra à ce qu'on mettra dans l'interface ou postman
nounou.delete("/deleteBy/:email", (req,res) =>{
    // find the nounou you want to delete
    db.nounou.findOne({
        where:{email: req.params.email}
    }).then(nounou =>{
        // if nounou exists :
        if(nounou) {
            // delete this nounou
            nounou.destroy().then(() => {
                // send back the confirmation that nounou is deleted
                res.json("nounou supprimée via son email")
            })
            // catch if error
                .catch(err => {
                    // send back the error to info that in json
                    res.json("erreur" + err)
                })
        }
        else {
            // send back the error message to inform that you can't delete this nounou because it does not exist in your database
            res.json({error : "impossible de supprimer cette nounou, elle n'existe pas dans la base de données"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});

// find by email nounou
nounou.get("/getOneByEmail", (req,res) =>{
    // find the employe by email
    db.nounou.findOne({
        attributes:{
            exclude:["mdp", "telephone", "admin", "created_at", "updated_at","idLogement"]
        },
        where:{email: req.body.email},
        include: [{
            model: db.logement,
        }]
    }).then(nounou =>{
        // if nounou exists :
        if(nounou) {
            res.json({
                nounou: nounou
            })
        }
        else {
            // send back this nounou it does not exist in your database
            res.json({error : "Cette nounou n'existe pas dans ta liste"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});
// find by id nounou
nounou.get("/getOneById/:id", (req,res) =>{
    // find the nounou by email
    db.nounou.findOne({
        attributes:{
            exclude:["mdp", "telephone", "admin", "created_at", "updated_at","idLogement"]
        },
        where:{idNounou: req.params.id},
        include: [{
            model: db.logement,
        }]
    }).then(nounou =>{
        // if nounou exists :

        if(nounou) {
            res.json({
                nounou: nounou
            })
        }
        else {
            // send back this nounou it does not exist in your database
            res.json({error : "Cette nounou n'existe pas dans la liste"})
        }
    })
        .catch(err =>{
            // send back the message error
            res.json("erreur" + err);
        })
});

// afficher toutes les nounous sans afficher les champs précisés dans exclude 
nounou.get("/All", (req,res) =>{
    // find the nounou by email
    db.nounou.findAll({
        attributes:{
            // exclude:["mdp", "telephone", "admin", "created_at", "updated_at","idLogement"]
        },
        include: [{
            model: db.logement,
        }]
    })
    .then(nounous =>{
        res.json(nounous)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur" + err);
        })
});

// afficher toutes les nounous par ville
nounou.get("/AllByVille/:ville", (req,res) =>{
    // find the nounou by email
    db.nounou.findAll({
            where:{ville: req.params.ville},
            attributes:{
            exclude:["mdp", "telephone", "admin", "created_at", "updated_at","idLogement"]
        },
        include: [{
            model: db.logement,
        }]
    })
    .then(nounous =>{
        res.json(nounous)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur " + err);
        })
});

// afficher toutes les nounous par code postal
nounou.get("/AllByCodePostal/:code_postal", (req,res) =>{
    // find the nounou by email
    db.nounou.findAll({
            where:{code_postal: req.params.code_postal},
            attributes:{
            exclude:["mdp", "telephone", "admin", "created_at", "updated_at","idLogement"]
        },
        include: [{
            model: db.logement,
        }]
    })
    .then(nounous =>{
        res.json(nounous)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur " + err);
        })
});

nounou.get("/AllByStatut", (req,res) =>{
    // find the nounou by email
    db.nounou.findAll({
            where:{statut_disponible: req.body.statut},
            attributes:{
            exclude:["mdp", "telephone", "admin", "created_at", "updated_at","idLogement"]
        },
        include: [{
            model: db.logement,
        }]
    })
    .then(nounous =>{
        res.json(nounous)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur " + err);
        })
});

// afficher toutes les nounous DISPONIBLES par ville
nounou.get("/AllByVilleEtStatut", (req,res) =>{
    db.nounou.findAll({
            attributes: {exclude:["mdp", "telephone", "admin", "created_at", "updated_at"]},
            where: {
            [Op.and]: [{ville:req.body.ville}, {statut_disponible:req.body.statut_disponible}]
               },
            include: [{
                model: db.logement,
            }]
    })
    .then(nounous =>{
        res.json(nounous)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur " + err);
        })
});


// afficher toutes les nounous DISPONIBLES par ville, classée par leur capacité d'accueil décroissante
nounou.post("/AllByVilleStatutCapaDaccueil", (req,res) =>{
    // console.log(req.body)

    if (req.body.statut_disponible == true) {
        req.body.statut_disponible = 1
    } else {
        req.body.statut_disponible = 0
    }
    if (req.body.non_fumeur == true) {
        req.body.non_fumeur = 1
    } else {
        req.body.non_fumeur = 0
    }
    if (req.body.sans_enfant == true) {
        req.body.sans_enfant = 1
    } else {
        req.body.sans_enfant = 0
    }
    if (req.body.sans_animal == true) {
        req.body.sans_animal = 1
    } else {
        req.body.sans_animal = 0
    }
    db.nounou.findAll({
            attributes: {exclude:["mdp", "telephone", "admin", "created_at", "updated_at"]},
            where: {
            [Op.and]: [{ville:req.body.ville}, {statut_disponible:req.body.statut_disponible}, {non_fumeur:req.body.non_fumeur},
                    {banni: 0 }, {capacite_d_accueil: { [Op.gte]:req.body.capacite_d_accueil}} ]}  ,         
               
            include: [{
                model: db.logement,
                attributes: {exclude:["createdAt", "updatedAt"]},
                where: {
                    [Op.and]: [{sans_enfant:req.body.sans_enfant}, {sans_animal:req.body.sans_animal}]
                       },
            }],
            
    })
    .then(nounous =>{
        // console.log(nounous)
        res.json(nounous)
    })
        .catch(err => {
            res.json("erreur " + err);
        })
});

// afficher toutes les nounous DISPONIBLES par code postal
nounou.get('/AllByCPEtStatut', (req, res) => {
    db.nounou.findAll({
        attributes: {exclude: ['mdp', 'telephone', 'admin', 'created at', 'updated_at']},
        where: {
            [Op.and]: [{code_postal: req.body.cp}, {statut_disponible:req.body.statut}]
        },
        include: [{
            model: db.logement,
        }]
    })
    .then(nounous => {
        res.json(nounous)
    })
    .catch(err => {
        res.json ('erreur ' + err);
    })
})

// afficher toutes les nounous DISPONIBLES par ville et capacité d'accueil
nounou.get("/AllByVilleEtStatutEtCapacite", (req,res) =>{
    db.nounou.findAll({
            attributes: {exclude:["mdp", "telephone", "admin", "created_at", "updated_at"]},
            where: {
            [Op.and]: [{ville:req.body.ville}, {statut_disponible:req.body.statut_disponible}, {capacite_d_accueil: req.body.mdp, capacite_d_accueil,
            }]
               },
            include: [{
                model: db.logement,
            }]
    })
    .then(nounous =>{
        res.json(nounous)
    })
        .catch(err =>{
            // send back the error message 
            res.json("erreur " + err);
        })
});

module.exports = nounou;

/************************************** end router module ****************************************************
 *****************************************************************************************************************/
