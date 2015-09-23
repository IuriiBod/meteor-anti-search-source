Meteor.methods({
  createArea: function (area) {
    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to create area");
    }
    if (Areas.find({locationId: area.locationId, name: area.name}).count() > 0) {
      throw new Meteor.Error("The area with the same name already exists!");
    }
    // Create area
    return Areas.insert({
      name: area.name,
      locationId: area.locationId,
      organizationId: area.organizationId,
      status: area.status,
      createdAt: Date.now()
    });
  },
  deleteArea: function (id) {
    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to delete area");
    }
    Areas.remove({_id: id});

    Meteor.users.update({defaultArea: id}, {
      $unset: {
        defaultValue: ''
      }
    });
    // TODO: Write the code to delete users which is related to area
  },

  updateAreaName: function (id, val) {
    if (!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to update area");
    }
    var area = Areas.findOne({_id: id});
    if (Areas.find({locationId: area.locationId, name: val}).count() > 0) {
      throw new Meteor.Error("The area with the same name already exists!");
    }
    Areas.update({_id: id}, {$set: {name: val}});
  },

  /**
   * Add the existing user to the area and notify him
   * @param userId
   * @param areaId
   * @param roleId
   */
  addUserToArea: function (userId, areaId, roleId) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to remove users from area");
    }

    // Add user to the area
    var area = Areas.findOne({_id: areaId});
    var $set = {
      roles: {}
    };

    var $addToSet = {};

    $set.roles[areaId] = roleId;
    $set["relations.organizationId"] = area.organizationId;

    var user = Meteor.users.findOne({_id: userId});
    if(!user.relations.locationIds || user.relations.locationIds.length == 0) {
      $set.relations.locationIds = [area.locationId];
    } else {
      $addToSet["relations.locationIds"] = area.locationId;
    }

    if(!user.relations.areaIds || user.relations.areaIds.length == 0) {
      $set.relations.areaIds = [areaId];
    } else {
      $addToSet["relations.areaIds"] = areaId;
    }

    console.log('SET', $set);

    console.log('ADD', $addToSet);

    Meteor.users.update({_id: userId}, {$set: $set});

    if(Object.keys($addToSet).length > 0) {
      Meteor.users.update({_id: userId}, {$addToSet: $addToSet});
    }

    // Send notification to the invited user
    var options = {
      type: 'update',
      read: false,
      title: 'You\'ve been added to the ' + area.name + ' area.',
      createdBy: Meteor.userId(),
      text: null,
      actionType: 'update',
      to: userId
    };
    Notifications.insert(options);

    // Send an email to the invited user
    var sender = Meteor.user();
    var text = 'Hi ' + user.username + ',<br><br>';
    text += 'You\'ve been added to the ' + area.name + ' area. You\'ll see this in your area list when you next log in.<br><br>';
    text += 'If you have any questions let me know.<br>';
    text += sender.username;

    Email.send({
      "to": user.emails[0].address,
      "from": sender.emails[0].address,
      "subject": "[Hero Chef] Added to the " + area.name + " area",
      "html": text
    });
  },

  removeUserFromArea: function(userId, areaId) {
    if(!HospoHero.isOrganizationOwner()) {
      throw new Meteor.Error(403, "User not permitted to remove users from area");
    }

    if(!userId || !areaId) {
      throw new Meteor.Error("User ID or Area ID is empty!");
    }

    var updateObject = {
      $pull: {
        'relations.areaIds': areaId
      },
      $unset: {
        roles: {}
      }
    };
    updateObject.$unset.roles[areaId] = '';

    if(Meteor.users.find({_id: userId, defaultArea: areaId}).count() > 0) {
      updateObject.$unset.defaultArea = '';
    }

    Meteor.users.update({_id: userId}, updateObject);
  }
});