var LoginTokens = Match.Where(function (loginTokens) {
  check(loginTokens, [{
    userId: String,
    token: String
  }]);

  return loginTokens.length < 51;// probably this is enough
});


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
  },

  '__StaleSession.checkLoginTokens': function (loginTokens) {
    check(loginTokens, LoginTokens);

    var validtokens = loginTokens.filter(function (loginTokenEntry) {
      var  user =  Meteor.users.findOne({_id: loginTokenEntry.userId});
      if(user && user.services && user.services.resume && user.services.resume.loginTokens) {

        // searched token usually placed as last element of array
        var loginTokens =  user.services.resume.loginTokens;
        for(var i = loginTokens.length - 1; i>0; i--){
            var hashStampedToken = Accounts._hashStampedToken({
              token: loginTokenEntry.token,
              when: loginTokens[i].when
            });
            if(loginTokens[i].hashedToken === hashStampedToken.hashedToken) {return true;}
        }
      }
      return false;
    });
    return validtokens;
  }
});
