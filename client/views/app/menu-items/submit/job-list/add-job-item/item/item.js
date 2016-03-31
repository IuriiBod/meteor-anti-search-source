//context: item (JobItem), onSelectionStateChanged(function), isSelected(boolean)
Template.jobListItem.onRendered(function () {
  this.$('.i-checks.selected-prep').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.jobListItem.helpers({});

Template.jobListItem.events({
  'ifChecked .job-select-checkbox': function (event, tmpl) {
    tmpl.data.onJobItemSelect(tmpl.data.item._id);
  }
});

Template.jobListItem.onDestroyed(function () {
  this.$('.job-select-checkbox').iCheck('destroy');
});
