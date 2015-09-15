Meteor.methods({
  "getAuthToken": function () {
    var Client = Meteor.npmRequire('node-google-prediction');
    var client = new Client({claimSetISS: "135160182081-plkk2djriqo90v2l41461a9b03qb0tmt@developer.gserviceaccount.com",
                             path: "/home/brmk/Projects/herochef/private/hero-chef-secret.pem"
                            });

    var syncToken = Meteor.wrapAsync(client.accessTokenRequest);
    return syncToken()
  }
});