Template.prepsListItem.onRendered(function () {
  this.$('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.prepsListItem.helpers({
  activeTime: function () {
    return this.item.activeTime / 60;
  }
});


Template.prepsListItem.events({
  'ifChecked .add-prep-checkbox': function (event, tmpl) {
    tmpl.data.onAddPrepItem(tmpl.data.item._id);
  }
});

Template.prepsListItem.onDestroyed(function () {
  this.$('.i-checks').iCheck('destroy');
});