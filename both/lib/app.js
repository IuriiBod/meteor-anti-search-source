Namespace('HospoHero', {
  isInRole: function(roleName, userId, areaId) {
    if(userId === null && Meteor.userId()) {
      userId = Meteor.userId();
    } else if(userId === null && !Meteor.userId()) {
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
    var user = Meteor.users.findOne({_id: userId});
    if(user && user.relations && user.relations.organizationId) {
      return user.relations.organizationId;
    } else {
      return false;
    }
  },

  isOrganizationOwner: function(orgId, userId) {
    userId = userId ? userId : Meteor.userId();
    orgId = !orgId ? this.isInOrganization(userId) : orgId;
    if(!orgId) {
      return false;
    }
    if(Organizations.find({_id: orgId, owner: userId}).count() > 0) {
      return true;
    } else {
      return false;
    }
  },

  getCurrentArea: function() {
    var user = Meteor.user();
    if(user && user.defaultArea) {
      return user.defaultArea;
    }
  }
});
