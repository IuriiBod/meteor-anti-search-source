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
  var organizationId = HospoHero.isInOrganization();
  if(organizationId) {
    return Meteor.roles.find({
      name: {
        $ne: 'Owner'
      },
      $or: [
        { default: true },
        { "relations.organizationId": organizationId }
      ]
    }, {sort: {name: 1}}).fetch();
  }
};

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
 * @param permissions
 * @returns Array
 */
Roles.getRolesByPermissions = function(permissions) {
  if(Array.isArray(permissions)) {
    permissions = {$in: permissions};
  }

  return Meteor.roles.find({
    permissions: permissions
  }).fetch();
};

Roles.getRoleByUserId = function(userId) {
  userId = userId ? userId : Meteor.userId();
  var user = Meteor.users.findOne(userId);

  if(user && user.currentAreaId) {
    if(user.roles[user.currentAreaId]) {
      return Roles.getRoleById(user.roles[user.currentAreaId]);
    } else if(user.roles.defaultRole) {
      return Roles.getRoleById(user.roles.defaultRole);
    } else {
      return false;
    }
  }
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
    alert("The role with name " + name + " already exists!");
    return false;
  }

  Meteor.roles.insert({
    name: name,
    permissions: permissions,
    relations: HospoHero.getRelationsObject()
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
  var role = Roles.getRoleByName(roleName);
  var orArray = [];

  if(areaId) {
    var orObject = {};
    orObject["roles." + areaId] = role._id;
    orArray.push(orObject);
  }
  orArray.push({"roles.defaultRole": role._id});

  return !!Meteor.users.findOne({
    _id: userId,
    $or: orArray
  });
};

Roles.hasPermission = function(permissions) {
  var role = Meteor.role();
  if(!role) {
    return false;
  }

  var isPermitted = false;
  if(Array.isArray(permissions)) {
    isPermitted = _.reduce(permissions, function(memo, perm) {
      return role.permissions.indexOf(perm) > -1;
    }, false);
  } else {
    isPermitted = role.permissions.indexOf(permissions) > -1;
  }
  return isPermitted;
};