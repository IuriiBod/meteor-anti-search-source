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
 * @param {string|Array} actions
 * @param {string|Array} areaIds area's ID
 * @returns CollectionCursor
 */
Roles.getUsersByActionForArea = function (actions, areaIds) {

  if (!Array.isArray(areaIds)) {
    areaIds = [areaIds];
  }

  var rolesIds = [];
  areaIds.forEach(function (areaId) {
    var currentAreaRoles = Roles.getRolesByAction(actions, areaId).map(function (role) {
      return role._id
    });

    rolesIds = rolesIds.concat(currentAreaRoles);
  });

  var query = {};
  query.$or = areaIds.map(function (areaId) {
    var queryEntry = {};
    queryEntry['roles.' + areaId] = {$in: rolesIds};
    return queryEntry;
  });

  return Meteor.users.find(query);
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