Template.leaveRequestsList.onCreated(function () {
  this.page = new Blaze.ReactiveVar(1);
  const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
  this.autorun(() => {
    this.subscribe('leaveRequests', currentAreaId,
      this.page.get() * this.data.itemPerPage);
  });
});

Template.leaveRequestsList.helpers({
  leaveRequestsItems: function () {
    return LeaveRequests.find();
  },
  date: function (date) {
    return HospoHero.dateUtils.dateFormat(date);
  },
  username: function (userId) {
    var user = Meteor.users.findOne({_id: userId});
    return user && user.profile ?
    user.profile.firstname + ' ' + user.profile.lastname :
      '-';
  },
  comment: function () {
    return this.comment !== '' ? this.comment : '-';
  },
  isHasMoreItems: function () {
    let page = Template.instance().page.get();
    return LeaveRequests.find().count() / (page * this.itemPerPage) >= 1;
  }
});
Template.leaveRequestsList.events({
  'click [data-action="load-more"]': (event, tmpl) => {
    event.preventDefault();
    var page = tmpl.page.get();
    tmpl.page.set(page + 1);
  }
});
