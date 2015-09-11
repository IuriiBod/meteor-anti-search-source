//creating a global server logger
if(Meteor.isServer) {
  logger = Meteor.npmRequire('winston');
}

