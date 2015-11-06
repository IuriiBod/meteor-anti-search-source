var checkError = function (message) {
  throw new Meteor.Error(500, 'Check error: ' + message);
};

logger = Meteor.isServer ? logger : {
  error: function () {
    console.log('ERROR: ', arguments);
  }
};