Namespace('HospoHero');

Namespace('HospoHero', {
  isInRole: function(roleName, userId, areaId) {
    if(userId === null && Meteor.userId()) {
      userId = Meteor.userId();
    } else if(userId === null && !Meteor.userId()) {
      return false;
    }

    if(areaId) {
      return Roles.userIsInRole(roleName, userId, areaId);
    } else {
      return Roles.userIsInRole(roleName, userId);
    }
  },

  isAdmin: function(userId, areaId) {
    return this.isInRole('Admin', userId, areaId)
  },

  isManager: function(userId, areaId) {
    return this.isInRole('Manager', userId, areaId)
  },

  isWorker: function(userId, areaId) {
    return this.isInRole('Worker', userId, areaId)
  }
});