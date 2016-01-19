Router.route('/task-list', {
  name: 'taskList',
  template: 'taskList',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId();
    return [
      Meteor.subscribe('taskList'),
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('jobItems', null, currentAreaId, 'active'),
      Meteor.subscribe('menuList', currentAreaId, 'all', 'all'),
      Meteor.subscribe('allSuppliers', currentAreaId)
    ];
  }
});