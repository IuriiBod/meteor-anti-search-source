Template.dateEditor.onRendered(function () {
  this.datepicker = this.$('.date-editor-open');
  this.datepicker.datepicker({
    format: 'YYYY-MM-DD'
  });
  this.datepicker.datepicker('setDate', this.data.date);
});


Template.dateEditor.events({
  'changeDate .date-editor-open' (event, tmpl) {
    if (_.isFunction(tmpl.data.onDateChange)) {
      tmpl.data.onDateChange(event.date);
    }
  }
});