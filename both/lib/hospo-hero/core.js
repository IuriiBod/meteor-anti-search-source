Namespace('HospoHero', {
  isInOrganization: function (userId) {
    userId = userId ? userId : Meteor.userId();
    var user = Meteor.users.findOne({_id: userId});
    return user &&
    user.relations &&
    user.relations.organizationIds ?
      user.relations.organizationIds.length === 1 ?
        user.relations.organizationIds[0] : HospoHero.getOrganizationIdBasedOnCurrentArea()
      : false;
  },

  isOrganizationOwner: function (userId) {
    if (!userId) {
      try {
        userId = Meteor.userId();
      } catch (error) {
        return false;
      }
    }
    return !!Organizations.findOne({owners: userId});
  },

  getOrganizationIdBasedOnCurrentArea: function (userId) {
    return HospoHero.getCurrentArea(userId).organizationId;
  },

  isInRole: function (roleName, userId, areaId) {
    userId = userId ? userId : Meteor.userId();
    if (!userId) {
      return false;
    }
    if (!areaId) {
      var user = Meteor.users.findOne({_id: userId});
      areaId = user && user.currentAreaId || false;
    }

    var query = {
      _id: userId
    };
    var role = Roles.getRoleByName(roleName);

    if (areaId && role) {
      query['roles.' + areaId] = role._id;
      return !!Meteor.users.findOne(query);
    } else {
      return false;
    }
  },

  getOrganization: function (organizationId) {
    organizationId = organizationId ? organizationId : HospoHero.isInOrganization();
    return Organizations.findOne({_id: organizationId});
  },

  getCurrentAreaId: function (userId) {
    userId = userId ? userId : Meteor.userId();
    var user = userId ? Meteor.users.findOne({_id: userId}) : Meteor.user();
    return user && user.currentAreaId ? user.currentAreaId : false;
  },

  getCurrentArea: function (userId) {
    var currentAreaId = HospoHero.getCurrentAreaId(userId);
    return currentAreaId ? Areas.findOne({_id: currentAreaId}) : false;
  },

  getRelationsObject: function (areaId) {
    var area = areaId ? Areas.findOne({_id: areaId}) : HospoHero.getCurrentArea();
    return {
      organizationId: area.organizationId,
      locationId: area.locationId,
      areaId: area._id
    };
  },

  // Returns username. user can be user ID or user object
  username: function (user) {
    var userNameString = '';
    if (_.isString(user)) {
      userNameString = user;
      user = Meteor.users.findOne({_id: user});
    }

    if (_.isObject(user)) {
      if (user.profile.firstname && user.profile.lastname) {
        return user.profile.firstname + " " + user.profile.lastname;
      } else if (user.profile.firstname && !user.profile.lastname) {
        return user.profile.firstname;
      } else {
        return 'No name';
      }
    } else {
      return userNameString;
    }
  }
});