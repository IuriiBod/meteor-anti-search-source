//--------------------HOME
Router.route('/', {
  name: 'dashboard',
  template: 'dashboard',
  path: '/',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    if (currentAreaId) {
      return [
        // todo:roster this should be refactored 
        // https://trello.com/c/7SDSb8o0/855-refactor-shifts-subscriptions
        Meteor.subscribe('shifts', 'future', Meteor.userId(), currentAreaId),
        Meteor.subscribe('shifts', 'past', Meteor.userId(), currentAreaId),
        Meteor.subscribe('shifts', 'opened', null, currentAreaId),
        Meteor.subscribe('daily', HospoHero.dateUtils.shortDateFormat(moment()), currentAreaId, Meteor.userId()),

        Meteor.subscribe('sections', currentAreaId),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('comments', Meteor.userId(), currentAreaId),
        Meteor.subscribe('newsfeeds'),
        Meteor.subscribe('usersLeaveRequests',currentAreaId),
        Meteor.subscribe('usersUnavailabilities',currentAreaId)
      ];
    }
  }
});