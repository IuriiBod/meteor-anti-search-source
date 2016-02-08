Template.productsList.helpers({
  products: function () {
    return Ingredients.find({suppliers: this.id}, {fields: {_id: 1}});
  }
});

Template.productsList.events({
  'click .editProduct': function (event) {
    event.preventDefault();
    var ingredient = Ingredients.findOne({_id: this.ingredientId});
    FlyoutManager.open('ingredientEditor', {ingredient: ingredient});
  }
});