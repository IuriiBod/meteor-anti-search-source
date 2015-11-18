Namespace('HospoHero', {
    /**
     * Check whether user is able to perform specified action
     * @param {String} action
     * @param {String} [userId]
     * @returns {Function|Boolean}
     */
    canUser: function () {
        var action = arguments[0];

        var hasPermission = function (action, userId) {
            var roleIds = Meteor.roles.find({
                $or: [
                    {actions: action},
                    {actions: 'all rights'}
                ]
            }).map(function (role) {
                return role._id;
            });

            var temp = {};
            temp['roles.' + HospoHero.getCurrentAreaId()] = {$in: roleIds};

            var query = {
                _id: userId,
                $or: [
                    {'roles.defaultRole': {$in: roleIds}},
                    temp
                ]
            };

            return !!Meteor.users.findOne(query);
        };

        var checkPermission = function (userId) {
            // Organization's owner can't be rosted
            return (action !== 'can be rosted' && HospoHero.isOrganizationOwner(userId)) || hasPermission(action, userId);
        };

        // arguments[1] - userId
        return arguments.length > 1 ? checkPermission(arguments[1]) : checkPermission;
    }
});