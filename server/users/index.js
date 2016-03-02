var canUserEditUsers = function (areaId = null) {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit users');
};

Meteor.methods({
  changePinCode: function (newPinCode) {
    Meteor.users.update({
      _id: this.userId
    }, {
      $set: {
        pinCode: newPinCode
      }
    });
  },

  editBasicDetails: function (id, editDetails) {
    check(id, HospoHero.checkers.MongoId);

    let currentAreaId = HospoHero.getCurrentAreaId(this.userId);
    let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);
    if (!permissionChecker.hasPermissionInArea(currentAreaId, "edit user's payrate")) {
      logger.error("User not permitted to edit users details");
      throw new Meteor.Error(403, "User not permitted to edit users details");
    }

    if (!id) {
      logger.error('No user has found');
      throw new Meteor.Error(401, "User not found");
    }
    var userDoc = Meteor.users.findOne(id);
    if (!userDoc) {
      logger.error('User does not exist');
      throw new Meteor.Error(401, "User does not exist");
    }
    if (!editDetails) {
      logger.error('Edit details not found');
      throw new Meteor.Error(401, "Edit details not found");
    }

    var query = {};
    if (editDetails.email) {
      query['emails.0.address'] = editDetails.email;
    }
    if (editDetails.phone) {
      query['profile.phone'] = editDetails.phone;
    }
    if (editDetails.weekdaysrate) {
      query['profile.payrates.weekdays'] = editDetails.weekdaysrate;
    }
    if (editDetails.saturdayrate) {
      query['profile.payrates.saturday'] = editDetails.saturdayrate;
    }
    if (editDetails.sundayrate) {
      query['profile.payrates.sunday'] = editDetails.sundayrate;
    }
    if (editDetails.shiftsPerWeek) {
      query['profile.shiftsPerWeek'] = editDetails.shiftsPerWeek;
    }
    if (editDetails.profileImage) {
      query['profile.image'] = editDetails.profileImage;
    }
    if (editDetails.firstname) {
      query['profile.firstname'] = editDetails.firstname;
    }
    if (editDetails.lastname) {
      query['profile.lastname'] = editDetails.lastname;
    }
    if (Object.keys(query).length > 0) {
      Meteor.users.update({"_id": id}, {$set: query});
      logger.info("Users details updated ", editDetails);
    }
  },

  resignDate: function (type, id, val) {
    let currentAreaId = HospoHero.getCurrentAreaId(this.userId);
    let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);
    if (!permissionChecker.hasPermissionInArea(currentAreaId, "edit user's payrate")) {
      logger.error("User not permitted to resign workers");
      throw new Meteor.Error(403, "User not permitted to resign workers");
    }

    check(id, HospoHero.checkers.MongoId);
    if (!Meteor.users.findOne(id)) {
      logger.error("User not found ", id);
      throw new Meteor.Error("User not found ", id);
    }

    val = new Date(val);

    if (type === "set" || type === "update") {
      Meteor.users.update({_id: id}, {
        $set: {
          "profile.resignDate": val.getTime()
        }
      });

      Shifts.update({
        assignedTo: id,
        startTime: {
          $gte: val
        }
      }, {
        $set: {
          assignedTo: "null"
        }
      }, {
        multi: true
      });
    }
  },

  changeDefaultArea: function (areaId) {
    if (Meteor.userId() && areaId) {
      Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: {
          currentAreaId: areaId
        }
      });
    }
  },

  changeUserRole: function (userId, newRoleId, areaId) {
    check(userId, HospoHero.checkers.MongoId);
    check(newRoleId, HospoHero.checkers.MongoId);

    areaId = areaId || HospoHero.getCurrentAreaId();

    if (!canUserEditUsers(areaId)) {
      logger.error("User not permitted to change roles");
      throw new Meteor.Error(403, "User not permitted to change roles");
    }

    var area = Areas.findOne({_id: areaId});

    /**
     * check if the user is organization owner
     * and there is at least one owner besides him
     */
    var organization = Organizations.findOne({
      _id: area.organizationId,
      owners: userId
    });

    if (!!organization && organization.owners.length === 1) {
      throw new Meteor.Error('This is the last organization owner. You can remove it.');
    }

    Meteor.users.update({_id: userId}, {
      $set: {
        [`roles.${areaId}`]: newRoleId
      }
    });

    var updateOrganizationQuery;

    // when selected role is Owner - add userId to the organization's owners
    if (Roles.hasAction(newRoleId, 'all rights')) {
      updateOrganizationQuery = {$addToSet: {owners: userId}};
    } else {
      updateOrganizationQuery = {$pull: {owners: userId}};
    }
    Organizations.update({_id: area.organizationId}, updateOrganizationQuery);
  },

  toggleUserTrainingSection: function (userId, sectionId, isAddingSection) {
    check(userId, HospoHero.checkers.MongoId);
    check(sectionId, HospoHero.checkers.MongoId);
    check(isAddingSection, Boolean);

    if (!canUserEditUsers()) {
      logger.error('User not permitted to edit other users', {userId: Meteor.userId()});
      throw new Meteor.Error('User not permitted to edit other users', {userId: Meteor.userId()});
    }

    var query = {
      [isAddingSection ? '$addToSet' : '$pull']: {
        'profile.sections': sectionId
      }
    };
    Meteor.users.update({_id: userId}, query);
  }
});

