// ---------------------JOB ITEMS
Router.route('/jobItems', {
  name: 'jobItemsMaster',
  path: '/jobItems',
  template: 'jobItemsListMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('userSubscriptions', currentAreaId),
      Meteor.subscribe('jobItems', null, currentAreaId, 'active')
    ];
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go('/');
    }
  }
});

Router.route('/jobItems/:type', {
  name: 'jobItemsMasterType',
  path: '/jobItems/:type',
  template: 'jobItemsListMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('jobItems', null, currentAreaId, 'archived'),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('userSubscriptions', currentAreaId)
    ];
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go('/');
    }
  }
});

Router.route('/jobItem/submit', {
  name: 'submitJobItem',
  path: '/jobItem/submit',
  template: 'submitJobItemMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId)
    ];
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.canUser('edit jobs')()) {
      Router.go('/');
    }
    var prep = JobTypes.findOne({'name': 'Prep'});
    if (prep) {
      Session.set('jobType', prep._id);
    }
    Session.set('thisJobItem', null);
  }
});

Router.route('/jobItem/:_id', {
  name: 'jobItemDetailed',
  path: '/jobItem/:_id',
  template: 'jobItemDetailedMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('jobItem', this.params._id),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('comments', this.params._id, currentAreaId),
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('userSubscriptions', currentAreaId),
      Meteor.subscribe('allCategories', currentAreaId),
      Meteor.subscribe('jobsRelatedMenus', this.params._id)
    ];
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go('/');
    }
    Session.set('thisJobItem', this.params._id);
  }
});

Router.route('/jobItem/:_id/edit', {
  name: 'jobItemEdit',
  path: '/jobItem/:_id/edit',
  template: 'jobItemEditView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('jobItem', this.params._id),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('allSuppliers', currentAreaId)
    ];
  },
  data: function () {
    if (!Meteor.userId() || !HospoHero.canUser('edit jobs')()) {
      Router.go('/');
    }
    Session.set('thisJobItem', this.params._id);
  }
});