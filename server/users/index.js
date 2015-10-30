Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};
  user.isActive = true;
  if(user.services.google) {
      user.emails = [{ "address": null}];
      user.emails[0].address = user.services.google.email;
      user.emails[0].verified = user.services.google.verified_email;
      user.username = options.profile.name;
      user.profile.firstname = options.profile.name;
      if(options.profile.picture) {
        user.profile.image = options.profile.picture;
      }
  }
  if(user.profile.pinCode) {
    user.pinCode = user.profile.pinCode;
    delete user.profile.pinCode;
  }
  
  // if this is the first user ever, make him an owner
  var role = Roles.getRoleByName('Owner');
  user.roles = {defaultRole: role._id};
  return user;
});

Meteor.methods({
  inputPinCode: function (pinCode) {
    var user = Meteor.users.findOne({
      _id: this.userId,
      pinCode: pinCode
    });
    if (_.isUndefined(user)) {
      throw new Meteor.Error(401, "Wrong pin code");
    }
    else {
      return true;
    }
  },
  changePinCode: function (newPinCode) {
    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        pinCode: newPinCode
      }
    });
  },

  editBasicDetails: function(id, editDetails) {
    if(!HospoHero.isManager()) {
      logger.error("User not permitted to edit users details");
      throw new Meteor.Error(403, "User not permitted to edit users details");
    }
    if(!id) {
      logger.error('No user has found');
      throw new Meteor.Error(401, "User not found");
    }
    var userDoc = Meteor.users.findOne(id);
    if(!userDoc) {
      logger.error('User does not exist');
      throw new Meteor.Error(401, "User does not exist");
    }
    if(!editDetails) {
      logger.error('Edit details not found');
      throw new Meteor.Error(401, "Edit details not found");
    }

    var query = {};
    if(editDetails.username) {
      query['username'] = editDetails.username;
      query['profile.name'] = editDetails.username;
    }
    if(editDetails.email) {
      query['emails.0.address'] = editDetails.email;
    }
    if(editDetails.phone) {
      query['profile.phone'] = editDetails.phone;
    }
    if(editDetails.weekdaysrate) {
      query['profile.payrates.weekdays'] = editDetails.weekdaysrate;
    }
    if(editDetails.saturdayrate) {
      query['profile.payrates.saturday'] = editDetails.saturdayrate;
    }
    if(editDetails.sundayrate) {
      query['profile.payrates.sunday'] = editDetails.sundayrate;
    }
    if(editDetails.shiftsPerWeek) {
      query['profile.shiftsPerWeek'] = editDetails.shiftsPerWeek;
    }
    if(editDetails.profileImage) {
      query['profile.image'] = editDetails.profileImage;
    }
    if(editDetails.firstname) {
      query['profile.firstname'] = editDetails.firstname;
    }
    if(editDetails.lastname) {
      query['profile.lastname'] = editDetails.lastname;
    }
    if(Object.keys(query).length > 0) {
      Meteor.users.update({"_id": id}, {$set: query});
      logger.info("Users details updated ", editDetails);
    }
  },

  changeStatus: function(id) {
    if(!HospoHero.isManager()) {
      logger.error("User not permitted to change user status");
      throw new Meteor.Error(403, "User not permitted to create jobs");
    }
    var userDoc = Meteor.users.findOne(id);
    if(!userDoc) {
      logger.error("User not found", id);
      throw new Meteor.Error("User not found");
    }
    var isActive = !userDoc.isActive;

    Meteor.users.update({"_id": id}, {$set: {isActive: isActive}});
    if(isActive) {
      logger.info("User status activated", id);
    } else {
      logger.info("User status de-activated", id);
    }
  },

  resignDate: function(type, id, val) {
    if(!HospoHero.isManager()) {
      logger.error("User not permitted to resign workers");
      throw new Meteor.Error(403, "User not permitted to resign workers");
    }

    check(id, HospoHero.checkers.MongoId);
    if(!Meteor.users.findOne(id)) {
      logger.error("User not found ", id);
      throw new Meteor.Error("User not found ", id);
    }

    val = HospoHero.dateUtils.shiftDate(val);

    if(type == "set" || type == "update") {
      Meteor.users.update({ _id: id }, {
        $set: {
          "profile.resignDate": val.getTime(),
          isActive: false
        }
      });

      Shifts.update({
        assignedTo: id,
        shiftDate: {
          $gte: val
        }
      }, {
        $set: {
          assignedTo: "null"
        }
      }, {
        multi: true
      });
    } else if(type == "remove") {
      Meteor.users.update({ _id: id }, {
        $unset: {
          "profile.resignDate": ""
        },
        $set: {
          isActive: true
        }
      });
    } else {
      var nextShifts = Shifts.find({assignedTo: id, shiftDate: {$gte: val}}).fetch();
      if (nextShifts && nextShifts.length > 0) {
        return nextShifts;
      }
      if(type == "set" || type == "update") {
        Meteor.users.update({_id: id}, {$set: {"profile.resignDate": val, "isActive": false}});
      }
    }
  },

  changeDefaultArea: function(areaId) {
    if(Meteor.userId() && areaId) {
      Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: {
          currentAreaId: areaId
        }
      });
    }
  },

  changeUserRole: function(userId, newRoleId) {
    if(!HospoHero.isManager()) {
      logger.error("User not permitted to change roles");
      throw new Meteor.Error(403, "User not permitted to change roles");
    }

    check(userId, HospoHero.checkers.MongoId);
    if(!Meteor.users.findOne(userId)) {
      throw new Meteor.Error("User not found ", userId);
    }

    check(newRoleId, HospoHero.checkers.MongoId);
    if(!Meteor.roles.findOne(newRoleId)) {
      throw new Meteor.Error("Role not found", newRoleId);
    }

    var updateQuery = {};
    updateQuery["roles." + HospoHero.getCurrentAreaId()] = newRoleId;

    Meteor.users.update({ _id: userId }, {$set: updateQuery});
  }
});

