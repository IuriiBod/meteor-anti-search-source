Template.productsList.helpers({
  products: function () {
    return Ingredients.find({suppliers: this.id});
  }
});

Template.productsList.events({
  'click .editProduct': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.$("#editIngredientModal").modal("show");
  }
});