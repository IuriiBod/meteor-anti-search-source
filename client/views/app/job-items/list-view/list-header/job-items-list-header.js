Template.jobListHeader.helpers({
  isSubscribed: function () {
    return !!Subscriptions.findOne({
      itemIds: 'all'
    });
  },
  isArchived: function () {
    return this.status === 'archived';
  }
});

Template.jobListHeader.events({
  'click .subscribe-jobs-list': function (e) {
    e.preventDefault();
    var subscription = HospoHero.misc.getSubscriptionDocument('job', 'all');
    Meteor.call('subscribe', subscription, HospoHero.handleMethodResult());
  },
  'click .unsubscribe-jobs-list': function (e) {
    e.preventDefault();
    var subscription = HospoHero.misc.getSubscriptionDocument('job', 'all');
    Meteor.call('unsubscribe', subscription, HospoHero.handleMethodResult());
  },
  'click .add-job-item-button': function (event) {
    event.preventDefault();
    FlyoutManager.open('submitEditJobItem', {
      title: 'Add new job',
      editMode: true,
      mode: 'submit'
    });
  },
});