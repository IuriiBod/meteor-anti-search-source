Template.ingredientItemEdit.helpers({
  ingredientStatistics: function () {
    return HospoHero.analyze.ingredient(this.item);
  }
});

Template.ingredientItemEdit.events({
  'click .remove-ing': function (event, tmpl) {
    tmpl.data.onChange('removed', {_id: tmpl.data.item._id});
  },

  'change .ing-qty': function (event, tmpl) {
    var newQuantity = parseInt($(event.target).val());
    tmpl.data.onChange('changed', {_id: tmpl.data.item._id, quantity: newQuantity});
  }
});