Roles = {};

/**
 * Returns role by ID
 * @param roleId
 * @returns {any}
 */
Roles.getRoleById = function (roleId) {
  return Meteor.roles.findOne({_id: roleId});
};

/**
 * Returns role by its name
 * @param roleName
 * @returns {any}
 */
Roles.getRoleByName = function(roleName) {
  return Meteor.roles.findOne({name: roleName});
};

/**
 * Return roles by permission key or array of permission keys
 * @param actions
 * @returns Array
 */
Roles.getRolesByAction = function(actions) {
  if(Array.isArray(actions)) {
    actions = {$in: actions};
  }

  return Meteor.roles.find({
    actions: actions
  });
};

/**
 * Returns role permissions
 * @param roleId
 * @returns {*|Roles.permissions|{}|Array}
 */
Roles.getPermissionsById = function(roleId) {
  var role = Roles.getRoleById(roleId);
  return role ? role.permissions : [];
};

/**
 * Check whether role has action
 * @param roleId
 * @param action
 * @returns {boolean}
 */
Roles.hasAction = function(roleId, action) {
  return !!Meteor.roles.findOne({
    _id: roleId,
    actions: action
  });
};