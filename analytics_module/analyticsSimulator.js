//const request = require('request');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

let i = 1;
//for a million users we will update 10 users ratio's and top 3 interests per second via http calls to the analytics route
const userRatioInterestUpdateGenerator = (i) => {
  //const nums = Math.ceil(Math.random() * 100000);
  //const nums = i;
  const interest = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const ratio = Math.ceil(Math.random() * 8);
  return { 
    userId: i, 
    interests: [interest[0], interest[1], interest[2]],
    numAds: ratio, 
  };
};

//Send via SQS to the queue from analytics to aggregator who will poll form queue
const sendMessage = (i) => {
  const params = {
    MessageBody: JSON.stringify(userRatioInterestUpdateGenerator(i)),
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/854541618844/analytics_aggregator',
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Updating: ', params.MessageBody);
      console.log('Success', data.MessageId);
    }
  });
};


//Analytics will send this 1 messages a second
// setInterval(sendMessage, 1000);
setInterval(()=> { sendMessage(i); i++; }, 1000);

// Old code to be sent to the server API, reformatted to use SQS
// setInterval(() => {
//   const options = {
//     method: 'post',
//     body: userRatioInterestUpdateGenerator(),
//     json: true,
//     url: 'http://localhost:3000/analytics',
//   };

//   request(options, (err, res, body) => {
//     if (err) { console.log(err); }
//     console.log(body);
//   });
// }, 1000);


