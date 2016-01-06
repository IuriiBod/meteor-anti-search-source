Meteor.methods({
  '__StaleSession.retainTokenForPinLogin': function (tokenToRetain) {
    if (this.userId) {
      //check if current user has specified token
      var isTokenValid = !!Meteor.users.findOne({
        _id: this.userId,
        'services.resume.loginTokens.hashedToken': tokenToRetain
      });

      if (isTokenValid) {
        //retain token
        Meteor.users.update({_id: this.userId}, {
          $push: {'services.resume.pinTokens': tokenToRetain}
        });
      }
    }
  },

  '__StaleSession.restoreTokenForPinLogin': function (token) {
    //check if current user has specified token

    //todo: [SECURITY] probably I should receive here user ID too (just in case)
    var userToLogin = Meteor.users.findOne({
      'services.resume.loginTokens.pinTokens': tokenToRetain
    });

    if (userToLogin) {
      Meteor.users.update({_id: this.userId}, {
        $pull: {'services.resume.pinTokens': token},
        $push: {
          'services.resume.loginTokens': {
            hashedToken: token,
            when: new Date()
          }
        }
      });
    }
  }
});
