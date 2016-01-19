Meteor.methods({
  createArea: function (areaInfo) {
    var defaultAreaProperties = {
      createdAt: Date.now(),
      inactivityTimeout: 600000
    };
    var newAreaDocument = _.extend(areaInfo, defaultAreaProperties);
    check(newAreaDocument, HospoHero.checkers.AreaDocument);

    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, 'User not permitted to create area');
    }

    // Create areaInfo
    var areaId = Areas.insert(newAreaDocument);
    logger.info('Area has been created', {areaId: areaId});
  },

  editArea: function (updatedArea) {
    check(updatedArea, HospoHero.checkers.AreaDocument);

    var userId = Meteor.userId();
    if (!HospoHero.canUser('edit areas', userId)) {
      logger.error(403, 'User not permitted to edit areas');
    }

    Areas.update({_id: updatedArea._id}, {$set: updatedArea});
    logger.info('Area has been updated', {areaId: updatedArea._id, userId: Meteor.userId()});
  },

  deleteArea: function (areaId) {
    if (!HospoHero.isOrganizationOwner()
        && !HospoHero.isManager(Meteor.userId(), areaId)) {
      logger.error('User not permitted to delete this area');
      throw new Meteor.Error(403, 'User not permitted to delete this area');
    }

    check(areaId, HospoHero.checkers.MongoId);


    //updating user in Meteor.users collection requires user id
    var usersIdsRelatedToArea = Meteor.users
        .find({'relations.areaIds': areaId}, {fields: {_id: 1}})
        .map(function (user) { return user._id });

    Meteor.users.update({
      _id: {$in: usersIdsRelatedToArea}
    },{
      $pull: {'relations.areaIds': areaId}
    },{
      multi: true
    });

    Meteor.users.update({
      _id: {$in: usersIdsRelatedToArea},
      currentAreaId: areaId
    },{
      $unset: {currentAreaId: ''}
    },{
      multi: true
    });

    var removeDocumentsRelatedToArea = function (areaId) {
      var globals = Function('return this')();
      for (var globalObject in globals) {
        if (globals[globalObject] instanceof Meteor.Collection) {
          globals[globalObject].remove({'relations.areaId': areaId});
        }
      }
    };

    Invitations.remove({areaId: areaId});

    removeDocumentsRelatedToArea(areaId);

    Areas.remove({_id: areaId});
    logger.info('Area has been removed', {areaId: areaId});
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

    if (!HospoHero.canUser('invite users')) {
      throw new Meteor.Error(403, 'User not permitted to add users to area');
    }

    var area = Areas.findOne({_id: addedUserInfo.areaId});

    var updateUserDocument = {
      $set: {},
      $addToSet: {}
    };

    updateUserDocument.$set['roles.' + addedUserInfo.areaId] = addedUserInfo.roleId;

    updateUserDocument.$set['relations.organizationId'] = area.organizationId;

    updateUserDocument.$addToSet['relations.locationIds'] = area.locationId;
    updateUserDocument.$addToSet['relations.areaIds'] = addedUserInfo.areaId;

    Meteor.users.update({_id: addedUserInfo.userId}, updateUserDocument);

    // Send notification to the invited user
    new NotificationSender(
      'New invitation',
      'add-user-to-area',
      {areaName: area.name}
    ).sendBoth(addedUserInfo.userId);
  },

  removeUserFromArea: function (userId, areaId) {
    if (!HospoHero.canUser('invite users')) {
      throw new Meteor.Error(403, 'User not permitted to remove users from area');
    }

    check(userId, HospoHero.checkers.MongoId);
    check(areaId, HospoHero.checkers.MongoId);

    var updateObject = {
      $pull: {
        'relations.areaIds': areaId
      },
      $unset: {}
    };

    updateObject.$unset['roles.' + areaId] = '';

    if (!!Meteor.users.findOne({_id: userId, currentAreaId: areaId})) {
      updateObject.$unset.currentAreaId = '';
    }

    Meteor.users.update({_id: userId}, updateObject);
  }
});