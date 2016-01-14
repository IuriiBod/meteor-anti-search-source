Migrations.add({
  version: 46,
  name: "Removing gender, name and address fields from profile and username field in users collection.",
  up: function() {
    var usersWithFullName = [];
    var usersWithFirstName = [];

    Meteor.users.update({}, {
      $unset: {
        'profile.gender': 1,
        'profile.address': 1,
        'profile.name': 1
      }
    }, {
      multi: true
    });

    Meteor.users.find().forEach(function(user) {
      if (user.profile.firstname && user.profile.lastname) {
        Meteor.users.update({
          _id: user._id
        }, {
          $set: {
            profile: {
              firstname: user.profile.firstname.trim(),
              lastname: user.profile.lastname.trim()
            }
          },
          $unset: {
            username: 1
          }
        });
      } else {
        var trimUserName = user.username.trim();
        var result = trimUserName.indexOf(" ");
        if (result > 0) {
          usersWithFullName.push({id: user._id, fullname: trimUserName});
        } else {
          usersWithFirstName.push({id: user._id, firstname: trimUserName})
        }
      }
    });

    usersWithFirstName.forEach(function(user) {
      Meteor.users.update({
        _id: user.id
      }, {
        $set: {
          profile: {
            firstname: user.firstname,
            lastname: ''
          }
        },
        $unset: {
          username: 1
        }
      });
    });

    usersWithFullName.forEach(function(user) {
      var splitFullName = user.fullname.split(' ');
      var lastName = splitFullName[2] ? splitFullName[1] + splitFullName[2] : splitFullName[1];
      Meteor.users.update({
        _id: user.id
      }, {
        $set: {
          profile: {
            firstname: splitFullName[0],
            lastname: lastName
          }
        },
        $unset: {
          username: 1
        }
      });
    });
  }
});