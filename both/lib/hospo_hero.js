Namespace('HospoHero', {
  getBlazeTemplate: function (selector) {
    if (selector && $(selector).length > 0) {
      return Blaze.getView($(selector)[0])._templateInstance;
    }
  },

  checkMongoId: function (id) {
    check(id, String);
    if (!/[0-9a-zA-Z]{17}/.test(id)) {
      throw new Meteor.Error("Expected MongoID");
    }
  },

  checkDate: function (date) {
    if (!moment(date).isValid()) {
      throw new Meteor.Error("Expected date");
    }
  },

  alert: function (err) {
    if (err) {
      console.log(err);
      if (err.reason) {
        return alert(err.reason);
      } else if (err.error) {
        return alert(err.error);
      } else if (err.message) {
        return alert(err.message);
      } else {
        return alert('');
      }
    }
  },

  isInOrganization: function(userId) {
    userId = userId ? userId : Meteor.userId();
    var user = Meteor.users.findOne({_id: userId});
    return user && user.relations && user.relations.organizationId ? user.relations.organizationId : false;
  },

  isOrganizationOwner: function(userId) {
    var orgId = HospoHero.isInOrganization(userId);
    userId = userId ? userId : Meteor.userId();
    return !!Organizations.findOne({_id: orgId, owner: userId});
  },

  isInRole: function(roleName, userId, areaId) {
    userId = userId ? userId : Meteor.userId();
    if (!userId) {
      return false;
    }
    if (!areaId) {
      var user = Meteor.users.findOne({_id: userId});
      areaId = user && user.defaultArea ? user.defaultArea : 'defaultRole';
    }
    return Roles.userIsInRole(roleName, userId, areaId);
  },

  isAdmin: function(userId, areaId) {
    return HospoHero.isInRole('Admin', userId, areaId);
  },

  isManager: function(userId, areaId) {
    return HospoHero.isInRole('Manager', userId, areaId) ||
      HospoHero.isOrganizationOwner();
  },

  isWorker: function(userId, areaId) {
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

  getDefaultArea: function (userId) {
    var user = userId ? Meteor.users.findOne({_id: userId}) : Meteor.user();
    return user && user.defaultArea ? user.defaultArea : false;
  },

  getCurrentArea: function () {
    var defaultArea = HospoHero.getDefaultArea();
    return defaultArea ? Areas.findOne({_id: defaultArea}) : false;
  },

  getRelationsObject: function (areaId) {
    var area = areaId ? Areas.findOne({_id: areaId}) : HospoHero.getCurrentArea();
    return {
      organizationId: area.organizationId,
      locationId: area.locationId,
      areaId: area._id
    };
  }
});