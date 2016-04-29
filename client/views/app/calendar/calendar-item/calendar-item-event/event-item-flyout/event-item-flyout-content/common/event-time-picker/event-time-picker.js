Template.eventTimePicker.helpers({
  timeComboEditableParams () {
    return {
      withoutIcon: true,
      minuteStepping: 5,
      firstTime: this.event.startTime,
      secondTime: this.event.type !== 'prep job' ? this.event.endTime : null,
      onSubmit: this.onTimeSave
    };
  }
});
