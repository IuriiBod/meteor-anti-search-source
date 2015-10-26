Template.weeklyHeader.events({
  'click #publishRoster': function (event) {
    event.preventDefault();
    FlowComponents.callAction('publishRoster');
  },

  'click .showHideButton': function (event) {
    event.preventDefault();
    FlowComponents.callAction('triggerCollapse');
  }
});