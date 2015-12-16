Template.productsList.events({
  'click .editProduct': function (event, tmpl) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    tmpl.set("thisIngredient", Ingredients.find({_id: id}));
    tmpl.$("#editIngredientModal").modal("show");
  }
});