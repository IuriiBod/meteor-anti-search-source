Meteor.startup(function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
        Meteor.subscribe('organizationInfo'),
        Meteor.subscribe('userAllUnavailabilities'),
        Meteor.subscribe('userAllLeaveRequests'),
        Meteor.subscribe('usersList', currentAreaId)
    ];
});