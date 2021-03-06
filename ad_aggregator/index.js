const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database-mysql');
const Promise = require('bluebird');
// const AWS = require('aws-sdk');
// AWS.config.loadFromPath('./config.json');
//const sqsAnalytics = require('./sqs_analytics.js')
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Main router that takes in a userID and returns them the ads.
// app.post('/clientgenerator', (req, res) => {
//   //get the user ratio and top interests
//   //polls incoming sqs calls
//   db.findUser(req.body.user_id) 
//     .then((result) => {
//       //bid simulation here which is finding the ads that will be returned to client
//       //sends information to advertisements
//       return db.queryAds(result[0].user_ratio, Math.ceil(Math.random() * 1000))
//     })
//     .then((results) => {
//       //return the ads to the client here
//       //polls results from advertiesments and sends it back to client
//       console.log('Here are the ' + results.length + ' ads requested: ', results);
//       res.send(results);
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });

//  This is where analytics will update a users ratio and top interest
app.post('/analytics', (req, res) => {
  console.log('Server has recieved updates: ', req.body);
  //Poll from the analytics sqs queue and run the updateUser Database query
  
  // db.updateUser(req.body.user_id, req.body.user_ratio, req.body.user_interest1, req.body.user_interest2, req.body.user_interest3, () => {
  //   console.log('users ratio and category has been updated');
  // });
  //sqsAnalytics.receiveMessageAnalytics(); //find out how to get this to work
  //This part should be running in a setInterval where it will poll from the queue every so minutes
  //and will be updating the database based off that
  res.send('Server has updated user ratios and interests');
});

app.get("/", (req, res) => res.json({message: "Connected to Server!"}));

// This is where we add advertisments into the advertisements table
app.post('/ads', (req, res) => {
  //here is where we add ad's to the advertisements table
  //we will update the database with the new ads here
  //as well as any changes to the status of the specific ads
  res.send('Server responds back');
});

// This is where the ad component will update us that certain ads should be retired
app.post('/ads', (req, res) => {
  console.log('deactivating ads');
  res.send('Some ads has been deactivated!');
});

const runMe = () => {
  return {user_id: 123, user_ratio: 4, user_category: 'food'};
}

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = {
  runMe,
  app
};