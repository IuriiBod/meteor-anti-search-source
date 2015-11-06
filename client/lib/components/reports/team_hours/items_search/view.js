Template.teamHoursItemsSearch.events({
  'keyup input': function(e) {
    FlowComponents.callAction('searchText', e.target.value);
  }
});