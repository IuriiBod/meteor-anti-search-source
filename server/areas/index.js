Meteor.methods({
  createArea: function (areaInfo) {
    check(areaInfo, HospoHero.checkers.AreaDocument);

    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to create area");
    }

    if (!!Areas.findOne({locationId: areaInfo.locationId, name: areaInfo.name})) {
      logger.error('The area with the same name already exists!');
      throw new Meteor.Error('The area with the same name already exists!');
    }

    var defaultAreaProperties = {
      createdAt: Date.now(),
      inactivityTimeout: 600000
    };

    var newAreaDocument =_.extend(areaInfo, defaultAreaProperties);

    // Create areaInfo
    var areaId = Areas.insert(newAreaDocument);
    logger.info('Area has been created', { areaId: areaId });
  },

  editArea: function(updatedArea) {
    check(updatedArea, HospoHero.checkers.AreaDocument);

    var userId = Meteor.userId();
    if(!HospoHero.canUser('edit areas', userId)) {
      logger.error(403, 'User not permitted to edit areas');
    }

    var newInactivityTimeout = updatedArea.inactivityTimeout;
    if(newInactivityTimeout) {
      updatedArea.inactivityTimeout = minutesToMs(newInactivityTimeout);
    }

    Areas.update({ _id: updatedArea._id }, { $set: updatedArea });
    logger.info('Area has been updated', { areaId: updatedArea._id });
  },

  deleteArea: function (areaId) {
    check(areaId, HospoHero.checkers.MongoId);

    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to delete area");
    }

    Areas.remove({_id: areaId});
    Meteor.users.update({"relations.areaIds": areaId}, {$pull: {"relations.areaIds": areaId}});
    Meteor.users.update({currentAreaId: areaId}, {$unset: {currentAreaId: 1}});

    logger.info('Area has been removed', { areaId: areaId });
  },

  /**
   * Add the existing user to the area and notify him
   * @param {Object} addedUserInfo
   * @param {String} addedUserInfo.userId - The ID of added user
   * @param {String} addedUserInfo.areaId - The ID of area
   * @param {String} addedUserInfo.roleId - The ID of assigned role
   */
  addUserToArea: function (addedUserInfo) {
    var mongoIdChecker = HospoHero.checkers.MongoId;
    check(addedUserInfo, {
      userId: mongoIdChecker,
      areaId: mongoIdChecker,
      roleId: mongoIdChecker
    });

    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to remove users from area");
    }

    var area = Areas.findOne({_id: addedUserInfo.areaId});

    var updateUserDocument = {
      $set: {
        roles: {}
      },
      $addToSet: {}
    };

    updateUserDocument.$set.roles[addedUserInfo.areaId] = addedUserInfo.roleId;
    updateUserDocument.$set['relations.organizationId'] = area.organizationId;

    updateUserDocument.$addToSet['relations.locationIds'] = area.locationId;
    updateUserDocument.$addToSet['relations.areaIds'] = addedUserInfo.areaId;

    // TODO: Uncoment
    //Meteor.users.update({_id: userId}, updateUserDocument);

    // Send notification to the invited user
    var options = {
      type: 'invitation',
      title: "You've been added to the " + area.name + " area",
      to: addedUserInfo.userId
    };

    // TODO: Uncoment
    //HospoHero.sendNotification(options);

    // Send an email to the invited user
    var emailSender = new EmailSender({
      to: addedUserInfo.userId,
      from: Meteor.userId(),
      subject: "Added to the " + area.name + " area",
      emailType: 'invite user',
      params: {
        areaName: area.name
      }
    });
    emailSender.send();
  },

  removeUserFromArea: function (userId, areaId) {
    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to remove users from area");
    }

    check(userId, HospoHero.checkers.MongoId);
    check(areaId, HospoHero.checkers.MongoId);

    var updateObject = {
      $pull: {
        'relations.areaIds': areaId
      },
      $unset: {
        roles: {}
      }
    };
    updateObject.$unset.roles[areaId] = '';

    if (!!Meteor.users.findOne({_id: userId, currentAreaId: areaId})) {
      updateObject.$unset.currentAreaId = '';
    }

    Meteor.users.update({_id: userId}, updateObject);
  }
});

var minutesToMs = function (minutes) {
  return minutes * 60000;
};