Namespace('HospoHero', {
  handleMethodResult: function (onSuccess) {
    return function (err, res) {
      if (err) {
        HospoHero.error(err);
      } else {
        if (_.isFunction(onSuccess)) {
          onSuccess(res);
        }
      }
    };
  },

  // Alert error message
  error: function (err) {
    if (err) {
      console.log(err);
      if (err.reason) {
        return sweetAlert("Error!", err.reason, "error");
      } else if (err.error) {
        return sweetAlert("Error!", err.error, "error");
      } else if (err.message) {
        return sweetAlert("Error!", err.message, "error");
      } else {
        return sweetAlert("Error!", err, "error");
      }
    } else {
      return sweetAlert("Error!", "", "error");
    }
  },

  // Alert success message
  success: function (message) {
    sweetAlert("Success!", message, "success");
  },

  // Alert info message
  info: function (message) {
    sweetAlert("Info!", message, "info");
  },

  // Returns username. user can be user ID or user object
  username: function(user) {
    if(typeof user == "string") {
      user = Meteor.users.findOne({_id: user});
    }

    if(user) {
      if (user.profile.firstname && user.profile.lastname) {
        return user.profile.firstname + " " + user.profile.lastname;
      } else {
        return user.username;
      }
    } else {
      return '';
    }
  }
});

Template.registerHelper('username', HospoHero.username);