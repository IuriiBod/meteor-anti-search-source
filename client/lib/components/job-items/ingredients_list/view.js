Template.listOfIngredients.events({
  'click #showIngredientsList': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  }
});