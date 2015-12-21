Template.jobDetailsHeader.onCreated(function () {
  var self = this;
  // should be replaced by router param
  self.data.id = Router.current().params._id;

  self.isSubscribed = function () {
    return !!Subscriptions.findOne({
      type: 'job',
      subscriber: Meteor.userId(),
      itemIds: self.id
    });
  };
});

Template.jobDetailsHeader.helpers({
  isSubscribed: function () {
    return Template.instance().isSubscribed();
  },
  isArchived: function () {
    var job = JobItems.findOne({_id: this.id});
    return job && job.status == 'archived';
  },
  onAreaSelected: function () {
    var jobItemId = this.id;
    return function (areaId) {
      Meteor.call("duplicateJobItem", jobItemId, areaId, HospoHero.handleMethodResult(function () {
        HospoHero.success("Job item has successfully copied!");
        $('#areaChooser').modal('hide');
      }));
    };
  }
});

Template.jobDetailsHeader.events({
  'click .copyJobItemBtn': function (e, tmpl) {
    e.preventDefault();
    tmpl.$("#areaChooser").modal("show");
  },

  'click .subscribeButton': function (e, tmpl) {
    e.preventDefault();
    var subscription = HospoHero.misc.getSubscriptionDocument('job', tmpl.data.id);
    Meteor.call('subscribe', subscription, tmpl.isSubscribed(), HospoHero.handleMethodResult());
  },

  'click .archiveJobItem': function (e, tmpl) {
    e.preventDefault();
    Meteor.call("archiveJobItem", tmpl.data.id, HospoHero.handleMethodResult(function (status) {
      return HospoHero.info("Job item " + status);
    }));
  },

  'click .deleteJobItem': function (e, tmpl) {
    e.preventDefault();

    var result = confirm("Are you sure you want to delete this job ?");
    if (result) {
      Meteor.call("deleteJobItem", tmpl.data.id, HospoHero.handleMethodResult(function () {
        Router.go("jobItemsMaster");
      }));
    }
  }
});