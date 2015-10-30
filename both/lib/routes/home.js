//--------------------HOME
Router.route('/', {
  name: 'home',
  template: 'home',
  path: '/',
  waitOn: function() {
    if(Meteor.userId()) {
      var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
      return [
        Meteor.subscribe('shifts', 'future', Meteor.userId(), currentAreaId),
        Meteor.subscribe('shifts', 'past', Meteor.userId(), currentAreaId),
        Meteor.subscribe('shifts', 'opened', null, currentAreaId),
        Meteor.subscribe('sections', currentAreaId),
        Meteor.subscribe('usersList', currentAreaId),
        Meteor.subscribe('comments', Meteor.userId(), currentAreaId),
        Meteor.subscribe('newsfeeds'),
        Meteor.subscribe('daily', moment().format('YYYY-MM-DD'), currentAreaId, Meteor.userId())
      ];
    }
  },
  data: function() {
    Session.set('editStockTake', false);
  },
  fastRender: true
});