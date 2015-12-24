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
    query[this.type === 'prep' ? 'jobItems' : 'ingredients'] = {
      _id: this.item._id,
      quantity: 1
    };

    var menuItemId = HospoHero.getParamsFromRoute(Router.current(), '_id');
    Meteor.call("editItemOfMenu", menuItemId, query, 'add', HospoHero.handleMethodResult());
  }
});


Template.addPrepStockListItem.onDestroyed(function () {
  this.$('.i-checks').iCheck('destroy');
});