Namespace('HospoHero.analyze', {
  ingredient: function (ingredient) {
    if (!ingredient) {
      return false;
    } else {
      var hasRequiredValues = ingredient.costPerPortion > 0 && ingredient.unitSize > 0;
      var calculateCost = function () {
        return HospoHero.misc.rounding(ingredient.costPerPortion / ingredient.unitSize, 10000);
      };
      return {
        costPerPortionUsed: hasRequiredValues && calculateCost() || 0
      };
    }
  },

  jobItem: function (jobItem) {
    if (!jobItem) {
      return false;
    } else {
      var round = function (value) {
        return HospoHero.misc.rounding(value);
      };

      var totalIngredientCost = _.reduce(jobItem.ingredients || [], function (totalCost, ingredientItem) {
        var ingredientProps = HospoHero.analyze.ingredient(Ingredients.findOne(ingredientItem._id));
        totalCost += ingredientProps.costPerPortionUsed * ingredientItem.quantity;
        return totalCost;
      }, 0);

      var labourCost = jobItem.wagePerHour && ((jobItem.wagePerHour * jobItem.activeTime) / 3600) || 0;

      var totalCost = totalIngredientCost + labourCost;

      var prepCostPerPortion = totalCost > 0 && jobItem.portions > 0 && round(totalCost / jobItem.portions) || 0;

      return {
        labourCost: round(labourCost),
        totalIngredientCost: totalIngredientCost,
        prepCostPerPortion: prepCostPerPortion
      };
    }
  },

  accuracy: function (actual,prediction) {
    var max = function (a, b) {
      return a > b ? a : b;
    };

    var isPossibleToCalculate = _.isNumber(prediction) && _.isNumber(actual) && max(prediction, actual) !== 0;

    var accuracy;
    if (isPossibleToCalculate) {
      accuracy = Math.round((Math.abs(actual - prediction) / max(prediction, actual)) * 100);
      accuracy = accuracy.toString() + '%';
    } else {
      accuracy = '-';
    }

    return accuracy;
  }
});