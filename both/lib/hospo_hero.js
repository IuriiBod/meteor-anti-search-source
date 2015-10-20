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

  // Alert error message
  error: function (err) {
    if (err) {
      console.log(err);
      if (err.reason) {
        return sweetAlert("Error!", err.reason, "error");
      } else if (err.error) {
        return sweetAlert("Error!", err.error, "error");
      } else if (err.message) {
        return sweetAlert("Error!", err.message, "error");
      } else {
        return sweetAlert("Error!", err, "error");
      }
    } else {
      return sweetAlert("Error!", "", "error");
    }
  },

  // Alert success message
  success: function(message) {
    sweetAlert("Success!", message, "success");
  },

  // Alert info message
  info: function(message) {
    sweetAlert("Info!", message, "info");
  },

  isInOrganization: function(userId) {
    userId = userId ? userId : Meteor.userId();
    var user = Meteor.users.findOne({_id: userId});
    return user && user.relations && user.relations.organizationId ? user.relations.organizationId : false;
  },

  isOrganizationOwner: function(userId) {
    userId = userId ? userId : Meteor.userId();
    var orgId = HospoHero.isInOrganization(userId);
    return !!Organizations.findOne({_id: orgId, owner: userId});
  },

  isInRole: function(roleName, userId, areaId) {
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

    query['roles.' + areaId] = role._id;
    return !!Meteor.users.findOne(query);
  },

  isOwner: function(userId, areaId) {
    return HospoHero.isInRole('Owner', userId, areaId);
  },

  isManager: function(userId, areaId) {
    return HospoHero.isInRole('Manager', userId, areaId) ||
        HospoHero.isOrganizationOwner(userId) ||
        HospoHero.isOwner(userId, areaId);
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

  getCurrentAreaId: function (userId) {
    userId = userId ? userId : Meteor.userId();
    var user = userId ? Meteor.users.findOne({_id: userId}) : Meteor.user();
    var result = user && user.currentAreaId ? user.currentAreaId : false;
    return result;
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
  username: function(user) {
    if(typeof user == "string") {
      user = Meteor.users.findOne({_id: user});
    }

    if(user) {
      if (user.profile.firstname && user.profile.lastname) {
        return user.profile.firstname + " " + user.profile.lastname;
      } else {
        return user.username;
      }
    } else {
      return '';
    }
  }
});