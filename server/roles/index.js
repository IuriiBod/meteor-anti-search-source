Meteor.methods({
  addRole: function (name, actions) {
    check(name, String);
    check(actions, [String]);

    let relationsObject = HospoHero.getRelationsObject();

    let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);
    if (!permissionChecker.isOrganizationOwner(relationsObject.organizationId)) {
      throw new Meteor.Error(403, 'User has no permissions to create roles');
    }

    name = name.trim();
    if (Meteor.roles.find({name: name}).count() > 0) {
      throw new Meteor.Error("The role with name " + name + " already exists!");
    }

    Meteor.roles.insert({
      name: name,
      actions: actions,
      relations: relationsObject
    });
    return true;
  },

  editRole: function (id, updateObject) {
    check(id, HospoHero.checkers.MongoId);
    check(updateObject, {
      name: String,
      actions: [String]
    });

    let relationsObject = HospoHero.getRelationsObject();
    let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);
    if (!permissionChecker.isOrganizationOwner(relationsObject.organizationId)) {
      throw new Meteor.Error(403, 'User has no permissions to edit roles');
    }

    Meteor.roles.update({_id: id}, {$set: updateObject});
  },

  deleteRole: function (roleToDeleteId) {
    check(roleToDeleteId, HospoHero.checkers.MongoId);

    let relationsObject = HospoHero.getRelationsObject();
    let permissionChecker = new HospoHero.security.PermissionChecker(this.userId);
    if (!permissionChecker.isOrganizationOwner(relationsObject.organizationId)) {
      throw new Meteor.Error(403, 'User has no permissions to delete roles');
    }

    var roleToDelete = Roles.getRoleById(roleToDeleteId);
    var currentAreaId = roleToDelete.relations.areaId;
    var worker = Roles.getRoleByName('Worker');

    Meteor.roles.remove({_id: roleToDeleteId});

    Meteor.users.update({
      [`roles.${currentAreaId}`]: roleToDeleteId
    }, {
      $set: {
        [`roles.${currentAreaId}`]: worker._id
      }
    });
  }
});