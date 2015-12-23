Template.ingredientItemEdit.onRendered(function () {
});

Template.ingredientItemEdit.helpers({
  item: function () {
    return getIngredientItem(Template.instance().data.item._id);
  },

  unitPrice: function () {
    var item = getIngredientItem(Template.instance().data.item._id);
    return item.costPerPortionUsed;
  },

  quantity: function () {
    return Template.instance().data.item.quantity;
  }
});

Template.ingredientItemEdit.events({
  'click .remove-ing': function (e, tmpl) {
    tmpl.data.onChange({_id: tmpl.data.item._id, quantity: 0});
  },
  'change .ing-qty': function (e, tmpl) {
    var newQuantity = parseInt($(e.target).val());
    tmpl.data.onChange({_id: tmpl.data.item._id, quantity: newQuantity});
  }
});
