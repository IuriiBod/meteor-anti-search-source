Namespace('HospoHero', {
  /**
   * Check whether user is able to perform specified action
   *
   * DEPRECATED!
   *
   * @param {String} action
   * @param {String} [userId]
   * @returns {Function|Boolean}
   */
  canUser: function () {
    var action = arguments[0];

    var hasPermission = function (action, userId) {
      try {
        userId = userId || Meteor.userId();
      } catch (err) {
        return false;
      }

      var user = Meteor.users.findOne(userId);

      if (!user || !user.currentAreaId) {
        return false;
      }

      if (user.roles) {
        var roleId = user.roles[user.currentAreaId];
        return Roles.hasAction(roleId, action);
      } else {
        return false;
      }
    };

    var checkPermission = function (userId) {
      // Organization's owner can't be rosted
      return (action !== 'be rosted' && HospoHero.isOrganizationOwner(userId)) || hasPermission(action, userId);
    };

    // arguments[1] - userId
    return arguments.length > 1 ? checkPermission(arguments[1]) : checkPermission;
  }
});
