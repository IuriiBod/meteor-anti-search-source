//--------------------HOME
Router.route('/', {
  name: 'dashboard',
  template: 'dashboard',
  path: '/',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    if (currentAreaId) {
      return [
        Meteor.subscribe('shifts', 'future', Meteor.userId(), currentAreaId),
        Meteor.subscribe('shifts', 'past', Meteor.userId(), currentAreaId),
        Meteor.subscribe('shifts', 'opened', null, currentAreaId),
        Meteor.subscribe('sections', currentAreaId),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('comments', Meteor.userId(), currentAreaId),
        Meteor.subscribe('newsfeeds'),
        Meteor.subscribe('daily', HospoHero.dateUtils.shortDateFormat(moment()), currentAreaId, Meteor.userId()),
        Meteor.subscribe('userAllLeaveRequests', Meteor.userId())
      ];
    }
  }
});