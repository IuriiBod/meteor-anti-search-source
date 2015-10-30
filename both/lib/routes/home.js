//--------------------HOME
Router.route('/', {
  name: 'home',
  template: 'home',
  path: '/',
  waitOn: function() {
    if(Meteor.userId()) {
      return [
        Meteor.subscribe('organizationInfo'),
        Meteor.subscribe('shifts', 'future', Meteor.userId()),
        Meteor.subscribe('shifts', 'past', Meteor.userId()),
        Meteor.subscribe('shifts', 'opened'),
        Meteor.subscribe('sections', HospoHero.getCurrentAreaId(Meteor.userId())),
        Meteor.subscribe('usersList'),
        Meteor.subscribe('comments', Meteor.userId()),
        Meteor.subscribe('newsfeeds'),
        Meteor.subscribe('daily', moment().format('YYYY-MM-DD'), Meteor.userId())
      ];
    }
  },
  data: function() {
    Session.set('editStockTake', false);
  }
});