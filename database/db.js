// Sequelize est un ORM ((object-relational mapping ou ORM) c'est un type de
// programme informatique qui se place en interface entre un programme 
// applicatif et une bdd relationnelle pour simuler une bdd orientée objet.) permet d'interagir avec la base de données.
 const Sequelize = require('sequelize');
 
/************************************** Start connexion to database  **********************************************
 *****************************************************************************************************************/
// make our const db ;
const db ={};

// conn to database
/**
//  * new Sequelize({database},{username},{password},options{
//  *     host:{hostname}, => maintenant local host, mais quand le site sera en ligne, le nom de domaine ou l'adresse IP.
//  *     dialect:  one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' , The dialect of the database you are connecting to. One of mysql, postgres, sqlite and mssql.
//  *     port: if you haven't changed your mysql default port, then it is 3306, or if you change it make sure to use your port,
//  *     pool: { sequelize connection pool configuration
//  *         max: { 5 (number of max conn in you database)}, Maximum number of connection in pool default: 5
//  *         min: {0 } Minimum number of connection in pool,default: 0,
//  *         acquire: {30000 } The maximum time, in milliseconds, that pool will try to get connection before throwing error, default 60000,
//  *         idle: { 10000 } The maximum time, in milliseconds, that a connection can be idle before being released.
//  *     }
//  *
//  * @type {Sequelize} // pour dire quel type d'objet cela retourne => sequelize
//  */
// Création d'une nouvelle instance de sequelize
const dbinfo = new Sequelize("nounou", "root", "will74root2019", {
  host: "localhost",
  // le type de base de données mysql, mongodb, nosql...
  dialect: "mysql",
  port: 3306,
  pool: {
    // nombre de connections possibles à la fois à la bdd
    max: 5,
    min: 0,
    // délai max de non réponse
    acquire: 30000,
    idle: 10000
  }
});

dbinfo.authenticate()   // pour tester si la connexion est établie
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


/************************************** end connexion to database **********************************************
 *****************************************************************************************************************/

//models/tables
/**
 *
 ************************************** Start Require models/tables **********************************************
 *****************************************************************************************************************
 * require every table in database
 * we need it in this file to make associations
 * we also require the associations table we make, we need some data in that table
 *
 */

db.maitre = require('../models/maitre')(dbinfo,Sequelize);
db.chat = require('../models/chat')(dbinfo,Sequelize);
db.nounou = require('../models/nounou')(dbinfo,Sequelize);
db.logement = require('../models/logement')(dbinfo,Sequelize);
db.avis = require('../models/avis')(dbinfo,Sequelize);
db.garde = require('../models/garde')(dbinfo,Sequelize);




// /**
//  * There are four type of associations available in Sequelize
//  *to
//  * BelongsTo     :  associations are associations where the foreign key for the one--one relation exists on the source model.
//  * HasOne        :  associations are associations where the foreign key for the one-to-one relation exists on the target model.
//  * HasMany       :  associations are connecting one source with multiple targets.
//  *                  The targets however are again connected to exactly one specific source.
//  * 
//  *                  c'est lui qui crée les tables intermédiaires. Il faut les écrire dans les deux sens.
//  * BelongsToMany :  associations are used to connect sources with multiple targets. Furthermore the targets can also have connections to multiple sources.
//  *
//  ************************************** Start Relation **********************************************
//  ***********************************************************************************************
//  */

db.maitre.hasOne(db.chat,{foreignKey: "idMaitre"});


db.chat.hasMany(db.garde, { foreignKey: "idChat" });
db.nounou.hasMany(db.garde, { foreignKey: "idNounou" });
// db.garde.hasOne(db.nounou, { foreignKey: "idNounou" })
// db.garde.hasOne(db.chat, { foreignKey: "idChat" })
// db.maitre.hasMany(db.garde, { foreignKey: "idMaitre" });

db.nounou.hasOne(db.logement,{foreignKey: "idNounou"});

db.garde.hasOne(db.avis, { foreignKey: "idGarde" });
db.nounou.hasOne(db.avis,{foreignKey: "idNounou"});
db.maitre.hasOne(db.avis,{foreignKey: "idMaitre"});
db.avis.belongsTo(db.nounou,{foreignKey: "idNounou"});
db.avis.belongsTo(db.maitre,{foreignKey: "idMaitre"});
db.avis.belongsTo(db.garde,{foreignKey: "idGarde"});

// db.nounou.hasOne(db.garde,{foreignKey: "idNounou"});
// db.chat.hasOne(db.garde,{foreignKey: "idChat"});
/**************************************************** End of block Relation ***************************************************
*******************************************************************************************************************************/

db.dbinfo = dbinfo;
db.Sequelize = Sequelize;


/**
 * Sync all defined models to the DB.
 * similar for sync: you can define this to always force sync for models
  */

// dbinfo.sync({ force: true });

/**
 * The module.exports or exports is a special object which is included in every JS file in the Node.js application by default.
 * module is a variable that represents current module and exports is an object that will be exposed as a module.
 * So, whatever you assign to module.exports or exports, will be exposed as a module.
**/
module.exports = db;
