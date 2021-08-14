const fs = require('fs');
const AWS = require('aws-sdk');
var s3 = new AWS.S3({ signatureVersion: 'v4', });
var docClient = new AWS.DynamoDB.DocumentClient();
/*
Below code is just sample for illustration purpose only.To load dynamically sensorid can be calculated based on the date of the month
and then can be used to query dynamodb 
*/
var params = {
    TableName : "<<dynamodbtablename>>",
    KeyConditionExpression: "#id = :sensorid",
    ExpressionAttributeNames:{
        "#id": "sensorid"
    },
    ExpressionAttributeValues: {
        ":sensorid": 'sensor1-822021'
    }
};

exports.handler = async (event) => {
    
    var jsonToWriteTemp={};
    jsonToWriteTemp.data=[];
    await docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        var i=1;
        data.Items.forEach(function(item) {
            let actualData={};
            actualData.data=i;
            actualData.temperature = item.temperature;
            actualData.humidity =item.humidity;
            jsonToWriteTemp.data.push(actualData);
            i++;
        });
    }
}).promise();

    
    console.log(JSON.stringify(jsonToWriteTemp));
    
    await uploadFile(Buffer.from(JSON.stringify(jsonToWriteTemp)));

    const response = {
        statusCode: 200,
        body: JSON.stringify('File Saved! Please check s3 bucket'),
    };
    return response;
};



const uploadFile = async (jsonToWrite) => {
    console.log("Uploading File in s3")

    const params = {
        Bucket: '<<bucketname>>',
        Key: 'data.json',
        Body: jsonToWrite
    };

    const data = await s3.upload(params).promise()
    const { Location } = data
    console.log('File uploaded successfully' + Location);

};


