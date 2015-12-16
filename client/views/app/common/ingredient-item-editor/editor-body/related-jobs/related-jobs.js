//context: ingredient
Template.ingredientEditorRelatedJobs.helpers({
  relatedJobs: function () {
    return JobItems.find({"ingredients._id": this._id});
  }
});