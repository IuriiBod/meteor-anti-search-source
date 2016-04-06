Template.eventTimePicker.helpers({
  timeComboEditableParams () {
    return {
      withoutIcon: true,
      minuteStepping: 5,
      firstTime: this.start,
      secondTime: this.end,
      onSubmit: this.onTimeSave
    };
  }
});


Template.eventTimePicker.events({
  'click .save-event' (event, tmpl) {
    tmpl.data.onEventSave(event.target);
  }
});