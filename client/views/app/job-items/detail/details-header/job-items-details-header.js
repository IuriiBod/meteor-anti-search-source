Template.jobDetailsHeader.helpers({
  isSubscribed: function () {
    return Subscriptions.findOne({
      type: 'job',
      subscriber: Meteor.userId(),
      itemIds: {$in: [this.id, 'all']}
    });
  },
  isArchived: function () {
    var job = JobItems.findOne({_id: this.id});
    return job && job.status === 'archived';
  }
});

Template.jobDetailsHeader.events({
  'click .edit-job-item': function (event, tmpl) {
    event.preventDefault();
    var jobItemId = tmpl.data.id;
    Router.go("jobItemEdit", {'_id': jobItemId});
  },

  'click .print-job-item-button': function (event) {
    event.preventDefault();
    print();
  },

  'click .subscribe-button': function (event, tmpl) {
    event.preventDefault();

    var jobItemId = tmpl.data.id;
    var subscription = HospoHero.misc.getSubscriptionDocument('job', jobItemId);
    Meteor.call("subscribe", subscription, HospoHero.handleMethodResult());
  },
  'click .unsubscribe-button': function (event, tmpl) {
    event.preventDefault();

    var jobItemId = tmpl.data.id;
    var subscription = HospoHero.misc.getSubscriptionDocument('job', jobItemId);
    Meteor.call("unsubscribe", subscription, HospoHero.handleMethodResult());
  },

  'click .copy-job-item-button': function (event, tmpl) {
    event.preventDefault();
    var onAreaSelected = function () {
      var jobItemId = tmpl.data.id;
      return function (areaId) {
        Meteor.call("duplicateJobItem", jobItemId, areaId, HospoHero.handleMethodResult(function () {
          HospoHero.success("Job item has successfully copied!");
        }));
      };
    };
    ModalManager.open('areaChooser', {
      onAreaSelected: onAreaSelected()
    });
  },

  'click .archive-job-item': function (event, tmpl) {
    event.preventDefault();
    var jobItemId = tmpl.data.id;
    Meteor.call("archiveJobItem", jobItemId, HospoHero.handleMethodResult(function (status) {
      return HospoHero.info("Job item " + status);
    }));
  },

  'click .delete-job-item': function (event, tmpl) {
    event.preventDefault();

    var result = confirm("Are you sure you want to delete this job ?");
    if (result) {
      var jobItemId = tmpl.data.id;
      Meteor.call("deleteJobItem", jobItemId, HospoHero.handleMethodResult(function () {
        Router.go("jobItemsMaster");
      }));
    }
  }
});