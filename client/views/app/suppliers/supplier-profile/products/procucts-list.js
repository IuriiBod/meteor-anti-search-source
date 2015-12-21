Template.productsList.onCreated(function () {
  this.set('ingredientItemEditorExist', false);
});

Template.productsList.helpers({
  products: function () {
    return Ingredients.find({suppliers: this.id});
  }
});

Template.productsList.events({
  'click .editProduct': function (event, tmpl) {
    event.preventDefault();

    if (tmpl.get('ingredientItemEditorExist')) {
      Blaze.remove(tmpl.get('ingredientItemEditorExist'));
    }

    var ingredient = Ingredients.findOne({_id: this.item._id});

    var ingredientEditorBlazeView = Blaze.renderWithData(Template.ingredientItemEditor, {
      isModal: true,
      ingredient: ingredient
    }, document.getElementById('ingredientItemEditorPlaceHolder'));

    tmpl.set('ingredientItemEditorExist', ingredientEditorBlazeView);
    tmpl.$("#ingredientItemEditor").modal("show");
  }
});