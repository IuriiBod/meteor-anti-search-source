/**
 * Return permission object by key
 * @param key i.e. JOB_VIEW_ITEMS
 */
Roles.getPermissionByKey = function(key) {
  var permissionKey;
  var permissionValues;

  key = key.toLowerCase();                                                            // job_view_items
  permissionKey = key.split('_', 1).toString();                                       // job
  permissionKey = permissionKey.slice(0,1).toUpperCase() + permissionKey.slice(1);    // Job

  permissionValues = key.split('_').slice(1);                                         // [view, items]

  var permissionValue = _.reduce(permissionValues, function(memo, value) {
    if(memo == '') {
      return value;
    } else {
      return memo + value.slice(0, 1).toUpperCase() + value.slice(1);
    }
  }, '');                                                                             // viewItems

  return Roles.permissions[permissionKey][permissionValue];
};

/**
 * Return all permissions in format [{value: permission.code, text: permission.title}, ...]
 * @returns {Array}
 */
Roles.getPermissions = function() {
  var permissions = [];

  _.map(Roles.permissions, function(value) {
    _.map(value, function(role) {
      permissions.push({ value: role.code, text: role.title, details: role.details });
    });
  });
  return permissions;
};

/**
 * Return roles array
 * @returns {Array}
 */
Roles.getRoles = function() {
  return Meteor.roles.find({}, {sort: {name: 1}}).fetch();
};

/**
 * Returns role by ID
 * @param id
 * @returns {any}
 */
Roles.getRoleById = function (roleId) {
  return Meteor.roles.findOne({_id: roleId});
};

Roles.getRoleByName = function(roleName) {
  return Meteor.roles.findOne({name: roleName});
};

/**
 * Returns role permissions
 * @param roleId
 * @returns {*|Roles.permissions|{}|Array}
 */
Roles.getPermissionsById = function(roleId) {
  var role = this.getRoleById(roleId);
  if(role) {
    return role.permissions;
  }
};

/**
 * Insert a new role into roles collection
 * @param name
 * @param permissions
 * @returns {boolean}
 */
Roles.addRole = function(name, permissions) {
  if(Meteor.roles.find({name: name}).count() > 0) {
    alert('The role with name "' + name + '" already exists!');
    return false;
  }

  Meteor.roles.insert({
    name: name,
    permissions: permissions
  });
  return true;
};

/**
 * Edit role
 * @param id
 * @param updateObject
 */
Roles.editRole = function(id, updateObject) {
  Meteor.roles.update({_id: id}, {$set: updateObject});
};

/**
 * Delete role by ID
 * @param id
 */
Roles.deleteRole = function(id) {
  if(confirm('Are you sure to delete this role? All users with this role will be changed on Worker role.')) {
    Meteor.roles.remove({_id: id});
  }
};

//  setUserOnRole: function() {},
//
//  removeUserFromRole: function() {},

Roles.userIsInRole = function(roleName, userId, areaId) {
  var role = this.getRoleByName(roleName);
  var searchObject = {
    _id: userId,
    roles: {}
  };

  if(areaId) {
    searchObject.roles[areaId] = role._id;
  } else {
    searchObject.roles.defaultRole = role._id;
  }

  if(Meteor.users.findOne(searchObject)) {
    return true;
  } else {
    return false;
  }
};

//c7km3fztaazbJ4sWg

//  canUser: function(perms) {}
//};