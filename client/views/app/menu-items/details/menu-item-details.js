//context: MenuItem
Template.menuItemDetailedMainView.onCreated(function () {
  this.set('currentEditedIngredient', false);
});


Template.menuItemDetailedMainView.helpers({
  ingredient: function () {
    return Ingredients.findOne({_id: this._id});
  },

  jobItem: function () {
    return JobItems.findOne({_id: this._id});
  },

  setCurrentEditedIngredient: function () {
    var tmpl = Template.instance();
    return function (ingredient) {
      tmpl.set('currentEditedIngredient', ingredient);
    }
  }
});
