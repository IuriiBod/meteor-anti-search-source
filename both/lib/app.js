Namespace('HospoHero', {
  isInRole: function(roleName, userId, areaId) {
    if(userId === null && Meteor.userId()) {
      userId = Meteor.userId();
    } else if(userId === null && !Meteor.userId()) {
      return false;
    }

    if(!areaId) {
      var user = Meteor.users.findOne({_id: userId});
      areaId = user.defaultArea ? user.defaultArea : 'defaultRole';
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
    if(!orgId) {
      return false;
    }
    userId = userId ? userId : Meteor.userId();

    if(Organizations.find({_id: orgId, owner: userId}).count() > 0) {
      return true;
    } else {
      return false;
    }
  }
});