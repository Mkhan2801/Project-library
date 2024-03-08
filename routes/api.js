/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

require('dotenv').config();
const { MongoClient } = require('mongodb');

const ObjectID = require('mongodb').ObjectId;

async function myDB(callback) {
    const URI = process.env.DB; // Declare MONGO_URI in your .env file
    const client = new MongoClient(URI, {});

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await callback(client);

    } catch (e) {
        // Catch any errors
        console.error(e);
    }
}


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      console.log(req.body)
      let title = req.body.title;
      myDB(async client => {
        const myDataBase = await client.db('test').collection("project");
        myDataBase.find().toArray().then((data) => {
          console.log(data)
          res.json(data)
        })
    })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      console.log(req.body)
      let _id =new ObjectID();
      let commentcount = 0;
      let inputData = { _id,title,commentcount };
      myDB(async client => {
        const myDataBase = await client.db('test').collection("project");
        myDataBase.insertOne(inputData)
          .then((data, err) => {
            if (data.modifiedCount == 1) {
              return res.json({
                result: 'successfully updated', _id
              })
            }
           // return res.json({ error: "could not update", "_id": input._id })

          })

      })
   } )
    
    .delete(function(req, res){
      console.log(req.body+"3")
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      console.log(req.body+"4")
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      console.log(req.body+"5")
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      console.log(req.body+"6")
      //if successful response will be 'delete successful'
    });
  
};
