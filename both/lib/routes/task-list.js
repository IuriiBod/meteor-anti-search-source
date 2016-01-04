Router.route('/task-list', {
  name: 'taskList',
  template: 'taskList',
  waitOn: function () {
    return Meteor.subscribe('usersList', HospoHero.getCurrentAreaId());
  }
});