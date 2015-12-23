Template.jobDetailsHeader.helpers({
  isSubscribed: function () {
    return Subscriptions.findOne({
      type: 'job',
      subscriber: Meteor.userId(),
      itemIds: {$in: [this._id, 'all']}
    });
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
  'click .edit-job-item': function (e, tmpl) {
    e.preventDefault();
    var jobItemId = tmpl.data.id;
    Router.go("jobItemEdit", {'_id': jobItemId});
  },

  'click .print-job-item-button': function (e) {
    e.preventDefault();
    print();
  },

  'click .subscribe-button': function (e, tmpl) {
    e.preventDefault();

    var jobItemId = tmpl.data.id;
    var subscription = HospoHero.misc.getSubscriptionDocument('job', jobItemId);
    Meteor.call("subscribe", subscription, HospoHero.handleMethodResult());
  },
  'click .unsubscribe-button': function (e, tmpl) {
    e.preventDefault();

    var jobItemId = tmpl.data.id;
    var subscription = HospoHero.misc.getSubscriptionDocument('job', jobItemId);
    Meteor.call("unsubscribe", subscription, HospoHero.handleMethodResult());
  },

  'click .copy-job-item-button': function (e, tmpl) {
    e.preventDefault();
    tmpl.$("#areaChooser").modal("show");
  },

  'click .archive-job-item': function (e, tmpl) {
    e.preventDefault();
    var jobItemId = tmpl.data.id;
    Meteor.call("archiveJobItem", jobItemId, HospoHero.handleMethodResult(function (status) {
      return HospoHero.info("Job item " + status);
    }));
  },

  'click .delete-job-item': function (e, tmpl) {
    e.preventDefault();

    var result = confirm("Are you sure you want to delete this job ?");
    if (result) {
      var jobItemId = tmpl.data.id;
      Meteor.call("deleteJobItem", jobItemId, HospoHero.handleMethodResult(function () {
        Router.go("jobItemsMaster");
      }));
    }
  }
});