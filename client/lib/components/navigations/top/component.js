var component = FlowComponents.define('topNavbar', function (props) {
});

component.state.count = function () {
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}}).fetch();
  return notifications.length;
};

component.state.notifications = function () {
  return Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 5});
};

component.state.areaColor = function () {
  var area = HospoHero.getCurrentArea();
  if(area) {
    return area.color;
  }
};

component.state.settingsMenuItems = function () {
  return [
    {
      route: 'usersSettings',
      title: 'Users'
    },
    {
      route: 'rolesSettings',
      title: 'Roles'
    },
    {
      route: 'sectionsSettings',
      title: 'Sections'
    },
    {
      route: 'stockAreasSettings',
      title: 'Stock Areas'
    },
    {
      route: 'inactivityTimeoutSettings',
      title: 'Inactivity Timeout'
    },
    {
      route: 'posSettings',
      title: 'POS / Menu Linking'
    },
    {
      route: 'archivingSettings',
      title: 'Locations/Areas archiving'
    }
  ];
};

component.state.profileMenuItems = function () {
  return [
    {
      route: 'profile',
      title: 'My Profile',
      params: {
        _id: Meteor.userId()
      }
    },
    {
      route: 'switchUser',
      title: 'Switch User'
    },
    {
      route: 'logout',
      title: 'Logout'
    }
  ];
};