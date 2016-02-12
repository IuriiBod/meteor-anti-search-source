Router.route('/task', {
  name: 'taskList',
  template: 'taskList',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId();
    if (currentAreaId) {
      return [
        Meteor.subscribe('taskList'),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('jobItems', null, currentAreaId, 'active'),
        Meteor.subscribe('menuList', currentAreaId, 'all', 'all'),
        Meteor.subscribe('allSuppliers', currentAreaId)
      ];
    }
  }
});