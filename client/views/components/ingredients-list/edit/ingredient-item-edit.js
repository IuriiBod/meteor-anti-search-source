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
    var newQuantity = parseFloat($(event.target).val());

    if (!_.isNaN(newQuantity)) {
      tmpl.data.onChange('changed', {_id: tmpl.data.item._id, quantity: newQuantity});
    } else {
      HospoHero.error('Ingredient quantity must be a number!');
    }
  }
});