Router.route('/claim/:id/:action', {
  name: 'claim',
  waitOn: function () {
    return Meteor.subscribe('ingredients', null, HospoHero.getCurrentAreaId(Meteor.userId()));
  },
  data: function () {
    Session.set("thisWeek", this.params.week);
    Session.set("editStockTake", false);
  }
}, {where: 'server'});