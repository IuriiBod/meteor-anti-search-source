//context: item (JobItem), onSelectionStateChanged(function), isSelected(boolean)
Template.jobItemsModalListItem.onCreated(function () {
});

Template.jobItemsModalListItem.onRendered(function () {
  this.$('.i-checks.selected-prep').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });

  var self = this;
  this.autorun(function () {
    //if isSelected was changed
    var data = Template.currentData();
    var methodName = data.isSelected ? 'check' : 'uncheck';
    self.$('.job-select-checkbox').iCheck(methodName);
  });
});

Template.jobItemsModalListItem.helpers({
});

Template.jobItemsModalListItem.events({
  'ifChecked .job-select-checkbox': function (event, tmpl) {
    var newVal = $('#check_id').is(":checked");
    tmpl.data.onSelectionStateChanged(tmpl.data.item._id, newVal);
  }
});


Template.jobItemsModalListItem.onDestroyed(function () {
  this.$('.job-select-checkbox').iCheck('destroy');
});
