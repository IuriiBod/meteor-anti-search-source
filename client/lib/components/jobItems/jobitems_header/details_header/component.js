var component = FlowComponents.define('jobDetailsHeader', function (props) {
  this.set('id', Router.current().params._id);
});

component.state.isSubscribed = function () {
  return !!Subscriptions.findOne({_id: this.get('id'), subscribers: Meteor.userId()});
};

component.state.isArchived = function () {
  var job = JobItems.findOne({_id: this.get('id')});
  return job && job.status == 'archived';
};

component.state.onAreaSelected = function () {
  return function(areaId) {
    Meteor.call("duplicateJobItem", this.get('id'), areaId, HospoHero.handleMethodResult(function() {
      HospoHero.success("Job item has successfully copied!");
      $('#areaChooser').modal('hide');
    }));
  };
};

component.action.subscribe = function () {
  var method = this.get('isSubscribed') ? 'unSubscribe' : 'subscribe';
  Meteor.call(method, this.get('id'), HospoHero.handleMethodResult());
};

component.action.archive = function () {
  Meteor.call("archiveJobItem", this.get('id'), HospoHero.handleMethodResult(function(status) {
    return HospoHero.info("Job item " + status);
  }));
};

component.action.delete = function () {
  Meteor.call("deleteJobItem", this.get('id'), HospoHero.handleMethodResult(function () {
    Router.go("jobItemsMaster");
  }));
};