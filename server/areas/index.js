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

  addUserToArea: function (userId, areaId, roleId) {
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