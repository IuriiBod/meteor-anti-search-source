Meteor.methods({
  createArea: function(area) {
    var user = Meteor.user();

    if(!Roles.hasPermission(Roles.permissions.Area.edit)) {
      return false;
    }

    area.createdAt = Date.now();
    // Create area
    return Areas.insert(area);
  },
  deleteArea: function(id) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to delete areas");
      throw new Meteor.Error(403, "User not permitted to delete areas");
    }
    Areas.remove({_id: id});

    // TODO: Write the code to delete users which is related to area
  },

  updateAreaName: function(id, val) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to edit area name");
      throw new Meteor.Error(403, "User not permitted to edit area name");
    }
    Areas.update({_id: id}, {$set: {name: val}});
  },

  addUserToArea: function(userId, areaId, roleId) {
    var updateObject = {
      roles: {}
    };
    updateObject.roles[areaId] = roleId;

    Meteor.users.update({_id: userId}, {
      $set: updateObject
    });

    return Areas.findOne({_id: areaId});
  }
});