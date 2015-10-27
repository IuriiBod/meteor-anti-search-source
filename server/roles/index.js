Meteor.methods({
  addRole: function (name, actions) {
    if(!HospoHero.isManager()) {
      throw new Meteor.Error(403, 'User has no permissions to create roles');
    }

    if (Meteor.roles.find({name: name}).count() > 0) {
      throw new Meteor.Error("The role with name " + name + " already exists!");
    }

    Meteor.roles.insert({
      name: name,
      actions: actions,
      relations: HospoHero.getRelationsObject()
    });
    return true;
  },

  editRole: function (id, updateObject) {
    if(!HospoHero.isManager()) {
      throw new Meteor.Error(403, 'User has no permissions to edit roles');
    }

    Meteor.roles.update({_id: id}, {$set: updateObject});
  },

  deleteRole: function (roleToDeleteId) {
    if(!HospoHero.isManager()) {
      throw new Meteor.Error(403, 'User has no permissions to delete roles');
    }
    var roleToDelete = Roles.getRoleById(roleToDeleteId);
    var currentAreaId = roleToDelete.relations.areaId;
    var worker = Roles.getRoleByName('Worker');

    var query = {};
    query['roles.' + currentAreaId] = roleToDeleteId;

    var $set = {};
    $set['roles.' + currentAreaId] = worker._id;

    Meteor.roles.remove({_id: roleToDeleteId});
    Meteor.users.update(query, { $set: $set });
  }
});