Template.prepListItem.onRendered(function () {
  this.$('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.prepListItem.helpers({
  activeTime: function () {
    return this.item.activeTime / 60;
  },
  itemName: function () {
    return this.item.name;
  }
});


Template.prepListItem.events({
  'ifChecked .add-prep-checkbox': function (event, tmpl) {
    tmpl.data.onAddPrepItem(tmpl.data.item._id);
  }
});

Template.prepListItem.onDestroyed(function () {
  this.$('.i-checks').iCheck('destroy');
});