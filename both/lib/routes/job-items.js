// ---------------------JOB ITEMS
Router.route('/jobItems', {
  name: 'jobItemsMaster',
  path: '/jobItems/:status?',
  template: 'jobItemsListMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    var status = this.params.status  ? this.params.status : 'active';
    return [
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('userSubscriptions', currentAreaId),
      Meteor.subscribe('jobItems', null, currentAreaId, status)
    ];
  },
  data: function () {
    return {
      status: this.params.status
    }
  }
});

Router.route('/jobItem/submit', {
  name: 'submitJobItem',
  path: '/jobItem/submit',
  template: 'submitEditJobItem',
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
    return {
      jobItem: {},
      mode: 'submit'
    }
  }
});

Router.route('/jobItem/:_id', {
  name: 'jobItemDetailed',
  path: '/jobItem/:_id',
  template: 'jobItemDetail',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('jobItem', this.params._id),
      Meteor.subscribe('comments', this.params._id, currentAreaId),
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('userSubscriptions', currentAreaId)
    ];
  },
  data: function () {
    return {
      jobItem: JobItems.findOne({_id: this.params._id})
    }
  }
});

Router.route('/jobItem/:_id/edit', {
  name: 'jobItemEdit',
  path: '/jobItem/:_id/edit',
  template: 'submitEditJobItem',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('jobItem', this.params._id),
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('allSuppliers', currentAreaId)
    ];
  },
  data: function () {
    return {
      jobItem: JobItems.findOne({_id: this.params._id})
    }
  }
});