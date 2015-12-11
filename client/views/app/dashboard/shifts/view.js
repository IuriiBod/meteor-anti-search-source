Template.shiftsSummary.events({
  'click .futureShifts': function () {
    FlowComponents.callAction('changeShiftState', 'future');
  },

  'click .pastShifts': function () {
    FlowComponents.callAction('changeShiftState', 'past');
  },

  'click .openShifts': function () {
    FlowComponents.callAction('changeShiftState', 'open');
  }
});