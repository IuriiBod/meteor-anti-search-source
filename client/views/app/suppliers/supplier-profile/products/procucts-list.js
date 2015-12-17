Template.productsList.onCreated(function () {
  this.set('ingredient', null);
});

Template.productsList.helpers({
  products: function () {
    return Ingredients.find({suppliers: this.id});
  }
});

Template.productsList.events({
  'click .editProduct': function (event, tmpl) {
    event.preventDefault();
    var ingredient = Ingredients.findOne({_id: this.item._id});
    tmpl.set('ingredient', ingredient);
    tmpl.$("#ingredientItemEditor").modal("show");
  }
});