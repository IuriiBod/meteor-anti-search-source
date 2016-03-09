Router.route('/task', {
  name: 'taskList',
  template: 'taskList',
  waitOn: function () {
    var area = HospoHero.getCurrentArea();
    if (area) {
      var currentAreaId = area._id;
      return [
        Meteor.subscribe('taskList'),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('jobItems', null, currentAreaId, 'active'),
        Meteor.subscribe('menuList', currentAreaId, 'all', 'all'),
        Meteor.subscribe('allSuppliers', currentAreaId),
        Meteor.subscribe('meetings', Meteor.userId(), area.locationId),
        Meteor.subscribe('projects', Meteor.userId())
      ];
    }
  }
});