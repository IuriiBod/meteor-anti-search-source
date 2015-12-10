Template.ingredientItemEditNoShit.onRendered(function () {
});

Template.ingredientItemEditNoShit.helpers({
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

Template.ingredientItemEditNoShit.events({
  'click .remove-ing': function (e, tmpl) {
    tmpl.data.onChange({id: tmpl.data.item.id, quantity: 0});
  },
  'change .ing-qty': function (e, tmpl) {
    var newQuantity = $(e.target).val();
    tmpl.data.onChange({id: tmpl.data.item.id, quantity: newQuantity});
  }
});
