Migrations.add({
  version: 39,
  name: "Change property name in list of ingredients in jobItemsSubmitEdit",
  up: function () {
    JobItems.find().forEach(function (jobItem) {
      var ingredients = _.map(jobItem.ingredients, function (ingredient) {
        return {
          id: ingredient._id,
          quantity: ingredient.quantity
        }
      });
      if (ingredients) {
        JobItems.update({_id: jobItem._id}, {$set: {ingredients: ingredients}});
      }
    });
  }
});
