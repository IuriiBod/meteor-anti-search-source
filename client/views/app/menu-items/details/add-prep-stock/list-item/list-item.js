Template.addPrepStockListItem.onRendered(function () {
  this.$('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});


Template.addPrepStockListItem.helpers({
  isPrepJob: function () {
    return this.type === 'prep';
  },
  activeTime: function () {
    return this.item.activeTime / 60;
  },
  itemName: function () {
    return this.type == "prep" ? this.item.name : this.item.description;
  }
});


Template.addPrepStockListItem.events({
  'ifChecked .prep-stock-select': function (event, tmpl) {
    var query = {};
    query[type === 'prep' ? 'jobItems' : 'ingredients'] = {
      _id: id,
      quantity: 1
    };

    var menuItem = Template.parentData(1);

    Meteor.call("addItemToMenu", menuItem._id, query, HospoHero.handleMethodResult());
  }
});


Template.addPrepStockListItem.onDestroyed(function () {
  this.$('.i-checks').iCheck('destroy');
});