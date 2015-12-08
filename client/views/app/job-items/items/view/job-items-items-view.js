Template.jobItemView.onCreated(function () {
  this.jobitem = getPrepItem(this.data.jobitem._id);
  this.jobitem.quantity = this.data.jobitem.quantity;
});

Template.jobItemView.helpers({
  id: function () {
    return Template.instance().jobitem._id;
  },

  name: function () {
    return Template.instance().jobitem.name;
  },

  quantity: function () {
    return Template.instance().jobitem.quantity;
  },

  cost: function () {
    var cost = Template.instance().jobitem.prepCostPerPortion * Template.instance().jobitem.quantity;
    cost = Math.round(cost * 100) / 100;
    return cost;
  }
});