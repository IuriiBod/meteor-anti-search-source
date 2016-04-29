//context: ingredient (Ingredient/null) or ingredientId (ID<Ingredient>)
Template.ingredientEditor.onCreated(function () {
  if (this.data.ingredientId) {
    this.subscribe('ingredient', this.data.ingredientId);
  }

  let areaId = HospoHero.utils.getNestedProperty(this.data, 'ingredient.relations.areaId', HospoHero.getCurrentAreaId());
  let ingredientId = HospoHero.utils.getNestedProperty(this.data, 'ingredient._id', this.data.ingredientId);

  if (ingredientId) {
    this.subscribe('comments', ingredientId, areaId);
  }
});

Template.ingredientEditor.helpers({
  ingredient() {
    let ingredient;
    if (this.ingredientId) {
      ingredient = Ingredients.findOne({_id: this.ingredientId});
    } else {
      ingredient = this.ingredient;
    }
    return ingredient;
  }
});