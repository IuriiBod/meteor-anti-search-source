Meteor.methods({
  '__StaleSession.loginWithPin': function (userId, pinCode) {
    //check if current user has specified pin
    var user = Meteor.users.findOne({
      _id: userId,
      pinCode: pinCode
    });

    if (_.isUndefined(user)) {
      throw new Meteor.Error(401, 'Wrong pin code');
    } else {
      return true;
    }
  },

  '__StaleSession.retainTokenForPinLogin': function () {
    if (this.userId) {
      //check if current user has specified token
      var stampedToken = Accounts._generateStampedLoginToken();
      var hashStampedToken = Accounts._hashStampedToken(stampedToken);

      Meteor.users.update({_id: this.userId}, {
        $push: {'services.resume.loginTokens': hashStampedToken}
      });

      return stampedToken.token;
    }
  }
});
