//context: item (JobItem), onSelectionStateChanged(function), isSelected(boolean)
Template.jobItemsModalListItem.onRendered(function () {
  this.$('.i-checks.selected-prep').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.jobItemsModalListItem.helpers({
});

Template.jobItemsModalListItem.events({
  'ifChecked .job-select-checkbox': function (event, tmpl) {
    tmpl.data.onJobItemSelect(tmpl.data.item._id);
  }
});


Template.jobItemsModalListItem.onDestroyed(function () {
  this.$('.job-select-checkbox').iCheck('destroy');
});
