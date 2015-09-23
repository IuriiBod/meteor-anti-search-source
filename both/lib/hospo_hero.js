Namespace('HospoHero', {
  getBlazeTemplate: function(selector) {
    if(selector && $(selector).length > 0) {
      return Blaze.getView($(selector)[0])._templateInstance;
    }
  },

  checkMongoId: function(id) {
    check(id, String);
    if(!/[0-9a-zA-Z]{17}/.test(id)) {
      throw new Meteor.Error("Expected MongoID");
    }
  },

  isInRole: function(roleName, userId, areaId) {
    userId = userId ? userId : Meteor.userId();
    if(!userId) {
      return false;
    }

    if(!areaId) {
      var user = Meteor.users.findOne({_id: userId});
      if(user && user.defaultArea) {
        areaId = user.defaultArea;
      } else {
        areaId = 'defaultRole';
      }
    }
    return Roles.userIsInRole(roleName, userId, areaId);
  },

  isAdmin: function(userId, areaId) {
    return this.isInRole('Admin', userId, areaId)
  },

  isManager: function(userId, areaId) {
    return this.isInRole('Manager', userId, areaId)
  },

  isWorker: function(userId, areaId) {
    return this.isInRole('Worker', userId, areaId)
  },

  isInOrganization: function(userId) {
    userId = userId ? userId : Meteor.userId();
    if(!userId) {
      return false;
    }

    var user = Meteor.users.findOne({_id: userId});
    if(user && user.relations && user.relations.organizationId) {
      return user.relations.organizationId;
    } else {
      return false;
    }
  },

  isOrganizationOwner: function(orgId, userId) {
    userId = userId ? userId : Meteor.userId();
    orgId = !orgId ? HospoHero.isInOrganization(userId) : orgId;
    if(!orgId) {
      return false;
    }
    return Organizations.find({_id: orgId, owner: userId}).count() > 0;
  },

  getOrganization: function(organizationId) {
    organizationId = organizationId ? organizationId : HospoHero.isInOrganization();
    return Organizations.findOne({_id: organizationId});
  },

  getCurrentArea: function() {
    var user = Meteor.user();
    if(user && user.defaultArea) {
      return Areas.findOne({_id: user.defaultArea});
    }
  },

  getRelationsObject: function(areaId) {
    var area = areaId ? Areas.findOne({_id: areaId}) : HospoHero.getCurrentArea();
    return {
      organizationId: area.organizationId,
      locationId: area.locationId,
      areaId: area._id
    };
  }
});