Router.route('usersSettings', {
  path: '/settings/users',
  template: "adminMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return Meteor.subscribe('usersList', currentAreaId);
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go('/');
    }
    return {
      template: 'usersList',
      title: 'Users'
    }
  }
});

Router.route('rolesSettings', {
  path: '/settings/roles',
  template: "adminMainView",
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go('/');
    }

    return {
      template: 'rolesSettings',
      title: 'Roles'
    }
  }
});

Router.route('sectionsSettings', {
  path: '/settings/sections',
  template: "adminMainView",
  waitOn: function () {
    return Meteor.subscribe('sections', HospoHero.getCurrentAreaId(Meteor.userId()));
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go('/');
    }
    return {
      template: 'sections',
      title: 'Sections'
    }
  }
});

Router.route('stockAreasSettings', {
  path: '/settings/stock-areas',
  template: "adminMainView",
  waitOn: function () {
    return Meteor.subscribe('allAreas', HospoHero.getCurrentAreaId(Meteor.userId()));
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go('/');
    }
    return {
      template: 'stockAreas',
      title: 'Stock Areas'
    }
  }
});

Router.route('inactivityTimeoutSettings', {
  path: '/settings/inactivity-timeout',
  template: "adminMainView",
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go('/');
    }
    return {
      template: 'inactivityTimeoutField',
      title: 'Inactivity Timeout'
    }
  }
});

Router.route('posSettings', {
  path: '/settings/pos-mapping',
  template: "adminMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('menuItemsForPosLinking', currentAreaId),
      Meteor.subscribe('posMenuItems', currentAreaId)
    ]
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go('/');
    }
    return {
      template: 'posMenuLinking',
      title: 'POS / Menu Linking'
    }
  }
});

Router.route('archivingSettings', {
  path: '/settings/archiving',
  template: "adminMainView",
  waitOn: function () {
    return [
      Meteor.subscribe('locationsOfOrganization'),
      Meteor.subscribe('areasOfOrganization')
    ];
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.isManager()) {
      Router.go('/');
    }
    return {
      template: 'locationAreaArchiving',
      title: 'Locations/Areas archiving'
    }
  }
});