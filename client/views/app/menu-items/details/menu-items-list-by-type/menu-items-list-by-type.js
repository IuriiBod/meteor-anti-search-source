Template.menuItemsListByType.helpers({
  ingredient: function () {
    return Ingredients.findOne({_id: this._id});
  },

  jobItem: function () {
    return JobItems.findOne({_id: this._id});
  }
});