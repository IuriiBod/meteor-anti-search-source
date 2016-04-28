Accounts.onCreateUser(function (options, user) {
  return new UserAccount().create(options,user);
});

Accounts.onLogin(function (loginInfo) {
  Meteor.users.update({_id: loginInfo.user._id}, {$set: {lastLoginDate: new Date()}});
});

AntiSearchSource.allow('users', {
  maxLimit: 15,
  securityCheck (userId) {
    return !!userId;
  },
  allowedFields: ['profile.fullName', 'emails.address']
});

class UserAccount {
  constructor(){
    this._defaultPin = '1111';
  }

  _createAccountUser(options,user)  {
    user.profile = options.profile;
    user.pinCode = user.profile.pinCode;
    delete user.profile.pinCode;
    return user;
  }

  _createServiceUser(user) {
    let serviceName =  this._getServiceName(user);
    let email = this._getServicesEmail(user.services[serviceName]);
    var existingUser = Meteor.users.findOne({'emails.address':email});
    if (!existingUser) {
      this._setUserProfile(user,user.services[serviceName],serviceName);
      this._setUserEmail(user,email);
      user.pinCode = this._defaultPin;
      return user;
    } else {
      this._setUserProfile(existingUser,user.services[serviceName],serviceName);
      existingUser.services[serviceName] = user.services[serviceName];
      Meteor.users.remove({_id: existingUser._id});
      delete existingUser._document;
      return existingUser;
    }
  }

  _getServiceName(user){
    if(user.services.facebook){
      return 'facebook';
    }else if(user.services.google){
      return 'google';
    }else if(user.services.microsoft){
      return 'microsoft';
    }
  }

  _getServicesEmail(service){
    return service.email ? service.email : service.emails.preferred;
  }

  _setUserProfile(user,service,serviceName) {
    user.profile = user.profile || {};
    /*jshint -W106 */
    if(serviceName === 'google'){
      user.profile.fullName = user.profile.fullName || `${service.given_name} ${service.family_name}`;
      user.profile.image = user.profile.image || service.picture;
    }
    if(serviceName === 'facebook'){
      user.profile.fullName =  user.profile.fullName || `${service.first_name} ${service.last_name}`;
      user.profile.image = user.profile.image || `http://graph.facebook.com/${service.id}/picture/?type=large`;
    }
    if(serviceName === 'microsoft'){
      user.profile.fullName =  user.profile.fullName || `${service.first_name} ${service.last_name}`;
    }
    /*jshint +W106 */
  }


  _setUserEmail(user,email) {
    user.emails = [{address: null}];
    user.emails[0].address = email;
    user.emails[0].verified = false;
  }

  create(options,user) {
    if(user.services.password){
      return this._createAccountUser(options,user);
    }else {
      return this._createServiceUser(user);
    }
  }
}