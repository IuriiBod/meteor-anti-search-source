// ---------------------JOB ITEMS
Router.route('/jobItems', {
  name: 'jobItemsMaster',
  path: '/jobItems/:status?',
  template: 'jobItemsListMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    var status = this.params.status ? this.params.status : 'active';
    return [
      Meteor.subscribe('jobTypes'),
      Meteor.subscribe('sections', currentAreaId),
      Meteor.subscribe('userSubscriptions', currentAreaId),
      Meteor.subscribe('jobItemsInArea', currentAreaId, status)
    ];
  },
  data: function () {
    return {
      status: this.params.status
    };
  }
});

Router.route('/jobItem/:_id', {
  name: 'jobItemDetailed',
  path: '/jobItem/:_id',
  template: 'jobItemDetail',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    if (currentAreaId) {
      return [
        Meteor.subscribe('jobItem', this.params._id),
        Meteor.subscribe('comments', this.params._id, currentAreaId),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('userSubscriptions', currentAreaId)
      ];
    }
  },
  data: function () {
    return {
      jobItem: JobItems.findOne({_id: this.params._id})
    };
  }
});
