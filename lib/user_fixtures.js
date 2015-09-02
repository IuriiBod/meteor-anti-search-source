Meteor.startup(function() {
  if (process.env.NODE_ENV == 'development') {
    var user = Meteor.users.findOne({username: "admin"});
    if (user) {
      var id = user._id;

      if (user.isAdmin === false) {
        Meteor.users.update({_id: id}, {$set: {
          isWorker: false,
          isAdmin: true,
          isManager: false
        }});

        console.log("We have a new admin user!");
      }
    } else {
      var id = Accounts.createUser({
        username: 'admin',
        password: 'admin',
        email: 'admin@admin.com',
        profile: {
          name: 'Alonoslav Tabatartv'
        }
      });

      Meteor.users.update({_id: id}, {$set: {
        isWorker: false,
        isAdmin: true,
        isManager: false
      }});

      console.log("We have a new admin user!");
    }
  }
});
