Template.eventChecklistItem.onRendered(function () {
  this.$('.i-check').iCheck({
    checkboxClass: 'iradio_square-green'
  });
});


Template.eventChecklistItem.helpers({
  checkboxAttr: function () {
    return this.isChecked(this.index) ? {checked: 'checked'} : null;
  }
});


Template.eventChecklistItem.onDestroyed(function () {
  this.$('.i-check').iCheck('destroy');
});