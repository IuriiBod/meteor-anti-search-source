Template.ingredientItemEdit.helpers({
  ingredientStatistics: function () {
    return HospoHero.analyze.ingredient(this.item);
  }
});

Template.ingredientItemEdit.events({
  'click .remove-ing': function (event, tmpl) {
    tmpl.data.onChange({id: tmpl.data.item._id, quantity: 0});
  },
  
  'change .ing-qty': function (event, tmpl) {
    var newQuantity = parseInt($(event.target).val());
    tmpl.data.onChange({id: tmpl.data.item._id, quantity: newQuantity});
  }
});
