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
 * @param {string} roleName
 * @returns {any}
 */
Roles.getRoleByName = function (roleName) {
  return Meteor.roles.findOne({name: roleName});
};

/**
 * Return roles by permission key or array of permission keys
 * @param {string/Array} actions
 * @param {string} [areaId] area's ID
 * @returns CollectionCursor
 */
Roles.getRolesByAction = function (actions, areaId) {
  const area = Areas.findOne({_id: areaId});

  if (Array.isArray(actions)) {
    actions = {$in: actions};
  }

  var $or = [{'default': true}];

  if (areaId) {
    $or.push({'relations.organizationId': area.organizationId});
  }

  return Meteor.roles.find({actions: actions, $or: $or});
};

/**
 *
 * @param {string/Array} actions
 * @param {string} areaId area's ID
 * @returns CollectionCursor
 */
Roles.getUsersByActionForArea = function (actions, areaId) {
  var permissionRolesIds = Roles.getRolesByAction(actions, area._id).map(function (role) {
    return role._id
  });

  var rolesQuery = {};
  rolesQuery[areaId] = {$in: permissionRolesIds};

  return Meteor.users.find({
    roles: rolesQuery
  });
};

/**
 * Returns role permissions
 * @param roleId
 * @returns {*|Roles.permissions|{}|Array}
 */
Roles.getPermissionsById = function (roleId) {
  var role = Roles.getRoleById(roleId);
  return role ? role.permissions : [];
};

/**
 * Check whether role has action
 * @param roleId
 * @param action
 * @returns {boolean}
 */
Roles.hasAction = function (roleId, action) {
  return !!Meteor.roles.findOne({
    _id: roleId,
    actions: action
  });
};