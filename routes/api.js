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
    .get(function (req, res) {
      myDB(async client => {
        const myDataBase = await client.db('test').collection("project");
        myDataBase.find().toArray().then((data) => {
          res.json(data)
        })
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(function (req, res) {
      let title = req.body.title;
      console.log(req.body)
      let _id = new ObjectID().toString();
      let commentcount = 0;
      let comments = [];
      let inputData = { _id, title, commentcount, comments };
      if(title){
        myDB(async client => {
          const myDataBase = await client.db('test').collection("project");
          myDataBase.insertOne(inputData)
            .then((data, err) => {
              if (data.modifiedCount == 1) {
                return res.send({
                  result: 'successfully updated', _id
                })
              }
              else (res.json({ error: "could not update", "_id": _id }))
              // return res.json({ error: "could not update", "_id": input._id })
  
            })
  
        })
      }else{
        res.json({result:'ERRER'})
      }

      
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      myDB(async client => {
        const myDataBase = await client.db('test').collection("project");
        myDataBase.deleteMany()
          .then((data, err) => {
            res.send({ result: 'complete delete successful' });
          })
      })





    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      if(bookid){
        myDB(async client => {
          const myDataBase = await client.db('test').collection("project");
          myDataBase.findOne({ _id: bookid }).then((data) => {
            res.json(data)
          })
        })
      }
      else{
        res.json({result:'ERR'})
      }
      
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (bookid || comment) {
        myDB(async client => {
          const myDataBase = await client.db('test').collection("project");
          myDataBase.updateOne({ _id: bookid },{$inc:{commentcount:1},$push:{comments:comment}}).then((data) => {
            if(data.acknowledged){
              myDataBase.findOne({ _id: bookid }).then((data) => {
                res.json(data)
              })
            }
          })
        })
      }
      else {
        res.json({result:'err'})
      }




      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      if(bookid){
        myDB(async client => {
          const myDataBase = await client.db('test').collection("project");
          myDataBase.deleteOne({ _id: bookid }).then((data) => {
            console.log(data)
            res.json(data)
          })
        })
      }
      else{
        res.json({result:'ERR'})
      }
      
      //if successful response will be 'delete successful'







    });

};
