Template.leaveRequests.onCreated(function () {
  this.selectedType = new ReactiveVar('requsts');
});

Template.leaveRequests.helpers({
  isRequestTab(){
    return Template.instance().selectedType.get() === 'requsts';
  }
});

Template.leaveRequests.events({
  'click [data-action="swap-tabs"]': (event, tmpl) => {
    var selectedType = $(event.currentTarget).attr('data-name');
    tmpl.selectedType.set(selectedType);
  }
});