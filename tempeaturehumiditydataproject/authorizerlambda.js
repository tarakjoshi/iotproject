exports.handler =  async (event, context, callback) => {
    console.log('event: '+ JSON.stringify(event));
    
    let pwd =event.protocolData.mqtt.password;
    let clientId = event.protocolData.mqtt.clientId;
    let buff =  Buffer.from(pwd, 'base64');
    let pwdText = buff.toString('ascii');
    let principalId = event.connectionMetadata.id;

    //set client id and confirmation text in lambda env or you can also use SSM param for this purpose
    //here for simplicity i have used lambda env variables
    //ToDo:More security can be added

if(clientId === process.env.CLIENT_ID && pwdText === process.env.CONFIRM_TEXT){
    console.log("Allowing to Publish");
    var callback_resp = generateAuthResponse('Allow',principalId);
    console.log("callback_resp "+JSON.stringify(callback_resp));
     callback(null,callback_resp);
}
else{
    console.log("Denying to Publish");
     callback(null, generateAuthResponse('Deny',principalId));
}

}
var generateAuthResponse = function(effect,principalId) {

    var authResponse = {};
    authResponse.isAuthenticated = true;
    authResponse.principalId = '<<PrincipalId>>';

    var policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    var statement = {};
    statement.Action = 'iot:*';
    statement.Effect = effect;
    statement.Resource = "arn:aws:iot:<<region>>:<<accountno>>:*";
    policyDocument.Statement[0] = statement;
    authResponse.policyDocuments = [policyDocument];
    authResponse.disconnectAfterInSeconds = 3600;
    authResponse.refreshAfterInSeconds = 300;

    return authResponse;
}