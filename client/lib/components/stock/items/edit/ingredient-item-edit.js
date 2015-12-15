Template.ingredientItemEdit.onRendered(function () {
});

Template.ingredientItemEdit.helpers({
  item: function () {
    return getIngredientItem(Template.instance().data.item.id);
  },

  unitPrice: function () {
    var item = getIngredientItem(Template.instance().data.item.id);
    return item.costPerPortionUsed;
  },

  quantity: function () {
    return Template.instance().data.item.quantity;
  }
});

Template.ingredientItemEdit.events({
  'click .remove-ing': function (e, tmpl) {
    tmpl.data.onChange({id: tmpl.data.item.id, quantity: 0});
  },
  'change .ing-qty': function (e, tmpl) {
    var newQuantity = parseInt($(e.target).val());
    tmpl.data.onChange({id: tmpl.data.item.id, quantity: newQuantity});
  }
});
