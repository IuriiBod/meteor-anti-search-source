Namespace('HospoHero', {
  isInOrganization: function (userId) {
    userId = userId ? userId : Meteor.userId();
    var user = Meteor.users.findOne({_id: userId});
    return user && user.relations && user.relations.organizationId ? user.relations.organizationId : false;
  },

  isOrganizationOwner: function (userId) {
    if (!userId) {
      try {
        userId = Meteor.userId();
      } catch (error) {
        return false;
      }
    }
    var orgId = HospoHero.isInOrganization(userId);
    return !!Organizations.findOne({_id: orgId, owner: userId});
  },

  isInRole: function (roleName, userId, areaId) {
    userId = userId ? userId : Meteor.userId();
    if (!userId) {
      return false;
    }
    if (!areaId) {
      var user = Meteor.users.findOne({_id: userId});
      areaId = user && user.currentAreaId ? user.currentAreaId : 'defaultRole';
    }

    var query = {
      _id: userId
    };
    var role = Roles.getRoleByName(roleName);

    if (role) {
      query['roles.' + areaId] = role._id;
      return !!Meteor.users.findOne(query);
    } else {
      return false;
    }
  },

  isOwner: function (userId, areaId) {
    return HospoHero.isInRole('Owner', userId, areaId);
  },

  isManager: function (userId, areaId) {
    return HospoHero.isInRole('Manager', userId, areaId) ||
      HospoHero.isOrganizationOwner(userId) ||
      HospoHero.isOwner(userId, areaId);
  },

  isWorker: function (userId, areaId) {
    return HospoHero.isInRole('Worker', userId, areaId);
  },

  isMe: function (userId) {
    var currentUserId = Meteor.userId();
    if (currentUserId) {
      return (currentUserId == userId);
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
    if (typeof user == "string") {
      userNameString = user;
      user = Meteor.users.findOne({_id: user});
    }

    if (user) {
      if (user.profile.firstname && user.profile.lastname) {
        return user.profile.firstname + " " + user.profile.lastname;
      } else {
        return user.username;
      }
    } else {
      return userNameString;
    }
  }
});