//--------------------HOME
Router.route('/', {
  name: 'home',
  template: 'home',
  path: '/',
  waitOn: function() {
    if(Meteor.userId()) {
      return [
        Meteor.subscribe('shifts', 'future', Meteor.userId(), HospoHero.getCurrentAreaId(Meteor.userId())),
        Meteor.subscribe('shifts', 'past', Meteor.userId(), HospoHero.getCurrentAreaId(Meteor.userId())),
        Meteor.subscribe('shifts', 'opened', null, HospoHero.getCurrentAreaId(Meteor.userId())),
        Meteor.subscribe('sections', HospoHero.getCurrentAreaId(Meteor.userId())),
        Meteor.subscribe('usersList', HospoHero.getCurrentAreaId(Meteor.userId())),
        Meteor.subscribe('comments', Meteor.userId(), HospoHero.getCurrentAreaId(Meteor.userId())),
        Meteor.subscribe('newsfeeds'),
        Meteor.subscribe('daily', moment().format('YYYY-MM-DD'), HospoHero.getCurrentAreaId(Meteor.userId()), Meteor.userId())
      ];
    }
  },
  data: function() {
    Session.set('editStockTake', false);
  },
  fastRender: true
});