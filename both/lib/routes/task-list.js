Router.route('/task-list', {
  name: 'taskList',
  template: 'taskList',
  waitOn: function () {
    return [
      Meteor.subscribe('taskList', Meteor.userId()),
      Meteor.subscribe('usersList', HospoHero.getCurrentAreaId())
    ];
  }
});