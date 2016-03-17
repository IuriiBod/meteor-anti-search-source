Template.leaveRequests.onCreated(function () {
  this.selectedType = new ReactiveVar('requsts');
});

Template.leaveRequests.helpers({
  isRequestTab(){
    return Template.instance().selectedType.get() === 'requsts';
  },
  isUnavailabilitiesTab(){
    return Template.instance().selectedType.get() === 'unavailabilities';
  }
});

Template.leaveRequests.events({
  'click [data-action="swap-tabs"]': function (e, t) {
    var selectedType = $(e.currentTarget).attr('data-name');
    t.selectedType.set(selectedType);
  }
});