Namespace('HospoHero', {
  getOrganizationIdBasedOnCurrentArea: function (userId) {
    return HospoHero.getCurrentArea(userId).organizationId;
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

  /**
   * Returns user's full name
   *
   * @param {Object|string} user user's ID or document
   * @returns {string}
   */
  username: function (user) {
    let fullNameStr = false;
    let appendName = namePart =>
      fullNameStr = (fullNameStr ? fullNameStr : '') + namePart;

    if (_.isString(user)) {
      user = Meteor.users.findOne({_id: user});
    }

    if (_.isObject(user) && user.profile) {
      if (user.profile.firstname) {
        appendName(user.profile.firstname);
      }

      if (user.profile.lastname) {
        appendName(' ' + user.profile.lastname);
      }
    }

    return fullNameStr || 'No name';
  }
});