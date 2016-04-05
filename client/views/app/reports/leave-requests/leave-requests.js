Template.leaveRequests.onCreated(function () {
  this.selectedType = new ReactiveVar('requests');
});

Template.leaveRequests.helpers({
  isRequestTab(){
    return Template.instance().selectedType.get() === 'requests';
  }
});

Template.leaveRequests.events({
  'click a.swap-tabs': (event, tmpl) => {
    var selectedType = $(event.target).hasClass('unavailabilities') ? 'unavailabilities' : 'requests';
    tmpl.selectedType.set(selectedType);
  }
});