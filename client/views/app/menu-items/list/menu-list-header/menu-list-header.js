Template.menuListHeader.helpers({
  isArchived: function () {
    var archive = Router.current().params.status;
    return archive && archive == 'archived';
  },

  startDate: function() {
      return HospoHero.dateUtils.shortDateFormat(moment(new Date()).subtract(1, 'days'));
  }
});

Template.menuListHeader.events({
  'click .subscribe-menu-list': function (e) {
    e.preventDefault();
    var subscription = HospoHero.misc.getSubscriptionDocument('menu', 'all');
    Meteor.call('subscribe', subscription, false, HospoHero.handleMethodResult());
  }
});