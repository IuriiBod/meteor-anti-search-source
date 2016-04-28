var hasUserPermissionInArea = function (areaId, permission) {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, permission);
};

Meteor.methods({
  createArea: function (areaInfo) {
    var defaultAreaProperties = {
      createdAt: Date.now(),
      inactivityTimeout: 600000
    };

    var newAreaDocument = _.extend(areaInfo, defaultAreaProperties);

    check(newAreaDocument, HospoHero.checkers.AreaDocument);

    let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);
    if (!permissionChecker.isOrganizationOwner(newAreaDocument.organizationId)) {
      throw new Meteor.Error(403, 'User not permitted to create area');
    }

    // Create areaInfo
    var areaId = Areas.insert(newAreaDocument);
    logger.info('Area has been created', {areaId: areaId});
  },

  editArea: function (updatedArea) {
    check(updatedArea, HospoHero.checkers.AreaDocument);

    if (!hasUserPermissionInArea(updatedArea._id, 'edit areas')) {
      logger.error(403, 'User not permitted to edit areas');
    }

    Areas.update({_id: updatedArea._id}, {$set: updatedArea});
    logger.info('Area has been updated', {areaId: updatedArea._id, userId: Meteor.userId()});
  },

  deleteArea: function (areaId) {
    check(areaId, HospoHero.checkers.MongoId);

    if (!hasUserPermissionInArea(areaId, 'edit areas')) {
      logger.error('User not permitted to delete this area');
      throw new Meteor.Error(403, 'User not permitted to delete this area');
    }

    check(areaId, HospoHero.checkers.MongoId);

    let getDocumentId = document => document._id;

    //updating user in Meteor.users collection requires user id
    var areaMembersIds = Meteor.users.find({
      'relations.areaIds': areaId
    }, {
      fields: {_id: 1}
    }).map(getDocumentId);

    Meteor.users.update({
      _id: {$in: areaMembersIds}
    }, {
      $pull: {'relations.areaIds': areaId}
    }, {
      multi: true
    });

    var usersIdsWithCurrentAreaId = Meteor.users.find({currentAreaId: areaId}).map(getDocumentId);

    Meteor.users.update({
      _id: {$in: usersIdsWithCurrentAreaId}
    }, {
      $unset: {currentAreaId: ''}
    }, {
      multi: true
    });

    //todo: implement removing of prediction models in area
    //var googlePrediction = new GooglePredictionApi(locationId);
    //googlePrediction.removePredictionModel();

    var removeDocumentsRelatedToArea = function (areaId) {
      //this eval is safe
      var globals = Function('return this')();// jshint ignore:line
      for (var globalObject in globals) {
        if (globals[globalObject] instanceof Meteor.Collection) {
          globals[globalObject].remove({'relations.areaId': areaId});
        }
      }
    };

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

    if (!hasUserPermissionInArea(addedUserInfo.areaId, 'invite users')) {
      throw new Meteor.Error(403, 'User not permitted to add users to area');
    }

    let userToAdd = Meteor.users.findOne({_id: addedUserInfo.userId});

    if (userToAdd) {
      var area = Areas.findOne({_id: addedUserInfo.areaId});

      //check if user already added
      if (userToAdd.relations && userToAdd.relations.areaIds &&
        userToAdd.relations.areaIds.indexOf(addedUserInfo.areaId) > -1) {
        throw new Meteor.Error(`${userToAdd.profile.fullName} is already invited to ${area.name}`);
      }

      var updateUserDocument = {
        $set: {
          [`roles.${addedUserInfo.areaId}`]: addedUserInfo.roleId
        },
        $addToSet: {
          'relations.organizationIds': area.organizationId,
          'relations.locationIds': area.locationId,
          'relations.areaIds': addedUserInfo.areaId
        }
      };

      Meteor.users.update({_id: addedUserInfo.userId}, updateUserDocument);

      // Send notification to the invited user
      new NotificationSender(
        'New invitation',
        'add-user-to-area',
        {areaName: area.name}
      ).sendBoth(addedUserInfo.userId);
    } else {
      throw new Meteor.Error('User not found');
    }
  },

  removeUserFromArea: function (userId, areaId) {
    check(userId, HospoHero.checkers.MongoId);
    check(areaId, HospoHero.checkers.MongoId);

    if (!hasUserPermissionInArea(areaId, 'invite users')) {
      throw new Meteor.Error(403, 'User not permitted to remove users from area');
    }

    let userToRemove = Meteor.users.findOne({_id: userId});

    var updateObject = {
      $pull: {
        'relations.areaIds': areaId
      },
      $unset: {
        [`roles.${areaId}`]: ''
      }
    };

    if (userToRemove.currentAreaId === areaId) {
      updateObject.$unset.currentAreaId = '';
    }

    Meteor.users.update({_id: userId}, updateObject);
  }
});