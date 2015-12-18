Namespace('HospoHero.analyze', {
  ingredient: function (ingredient) {
    var hasRequiredValues = ingredient.costPerPortion > 0 && ingredient.unitSize > 0;
    var calculateCost = function () {
      return Math.round(ingredient.costPerPortion / ingredient.unitSize * 10000) / 10000;
    };
    return {
      costPerPortionUsed: hasRequiredValues && calculateCost() || 0
    };

  },

  jobItem: function (jobItem) {
    var round = function (value) {
      return Math.round(value * 100) / 100;
    };

    var totalIngredientCost = _.reduce(jobItem.ingredients || [], function (totalCost, ingredientItem) {
      var ingredientProps = HospoHero.analyze.ingredient(Ingredients.findOne(ingredientItem._id));
      totalCost += ingredientProps.costPerPortionUsed * ingredientItem.quantity;
      return totalCost;
    }, 0);

    var labourCost = jobItem.wagePerHour && ((jobItem.wagePerHour * jobItem.activeTime) / 60) || 0;

    var totalCost = totalIngredientCost + labourCost;

    var prepCostPerPortion = totalCost > 0 && jobItem.portions > 0 && round(totalCost / jobItem.portions) || 0;

    return {
      labourCost: round(labourCost),
      totalIngredientCost: totalIngredientCost,
      prepCostPerPortion: prepCostPerPortion
    };
  }
});