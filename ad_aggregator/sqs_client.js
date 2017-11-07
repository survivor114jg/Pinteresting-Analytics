const express = require('express');
const AWS = require('aws-sdk');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const db = require('../database-mysql');
const Promise = require('bluebird');
AWS.config.loadFromPath('../config.json');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const queueURL = {
  request: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_request',
  receive: 'https://sqs.us-west-1.amazonaws.com/854541618844/client_response',
};

const sendMessage = (ads) => {
  const params = {
    MessageBody: JSON.stringify(ads),
    QueueUrl: queueURL.receive,
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Aggregator sent back ads to client!');
      console.log('Success', data.MessageId);
    }
  });
};

const receiveMessage = () => {
  const params = {
    AttributeNames: [
      'SentTimestamp',
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
      'All',
    ],
    QueueUrl: queueURL.request,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 5,
  };

  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('Received Error', err);
    } else if (data.Messages) {

      let result = JSON.parse(data.Messages[0].Body);
      db.findUser(result.userId)
        .then((userInfo) => {
          console.log(`UserId:${result.userId}, Ratio wanted: ${userInfo[0].user_ratio}, Adinterest: [${userInfo[0].user_interest1_id}, ${userInfo[0].user_interest2_id}, ${userInfo[0].user_interest3_id}]`)
          return db.queryAdsInt(userInfo[0].user_ratio, userInfo[0].user_interest1_id)
        })
        .then((ads) => {
          console.log(`UserId:${result.userId}, will be receiving these ads: `, ads);
          //send message to client SQS HERE, should work!
          //needs formatting
          let userJD = [9875, 9876, 9877][Math.floor(Math.random() * 3)];
          //this is for jordans client component to test with these specific users
          sendMessage({
            id: userJD,
            ads: ads
          });
          return ads;
        })
        .then((ads) => {
          console.log('COMPLETE');
          ads.forEach((ad) => {
            console.log('Ad group id that needs balance to increase: ', ad.ad_group_id);
          })
          // update the balance for ad_group
          // we know the ad_group_ids and we need to increase their balance by cpm
          
          //if balance > ad_group_budget  RETIRE
        });

      const deleteParams = {
        QueueUrl: queueURL.request,
        ReceiptHandle: data.Messages[0].ReceiptHandle,
      };
      sqs.deleteMessage(deleteParams, (err, data) => {
        if (err) {
          console.log('Delete Error', err);
        } else {
          console.log('Message Deleted', data);
        }
      });
    }
  });
};

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }
} else {
  setInterval(receiveMessage, 5000);
  console.log(`There are ${numCPUs} threads avavilable`);  
  const app = express();

  app.listen(5000);

  console.log(`Worker ${process.pid} started`);
}