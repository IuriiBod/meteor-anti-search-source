Template.eventPrepIngredients.helpers({
  ingredient: function () {
    return Ingredients.findOne({_id: this._id});
  }
});