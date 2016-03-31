Namespace('HospoHero.analyze', {
  ingredient: function (ingredient) {
    if (!ingredient) {
      return false;
    }

    var hasRequiredValues = ingredient.costPerPortion > 0 && ingredient.unitSize > 0;

    var calculateCost = function () {
      return HospoHero.misc.rounding(ingredient.costPerPortion / ingredient.unitSize, 10000);
    };

    return {
      costPerPortionUsed: hasRequiredValues && calculateCost() || 0
    };
  },

  jobItem: function (jobItem) {
    if (!jobItem) {
      return false;
    }

    var round = HospoHero.misc.rounding;

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
  },

  menuItem: function (menuItem) {
    if (!menuItem) {
      return {};
    }

    var self = this;
    var round = HospoHero.misc.rounding;

    var processMenuEntry = function (propertyName, predicate) {
      var entriesField = menuItem[propertyName];
      return _.isArray(entriesField) && round(_.reduce(entriesField, predicate, 0)) || 0;
    };

    var result = {
      ingCost: processMenuEntry('ingredients', function (total, ingredientEntry) {
        var ingredient = Ingredients.findOne({_id: ingredientEntry._id});
        var ingredientProps = self.ingredient(ingredient);
        total += ingredientProps.costPerPortionUsed * ingredientEntry.quantity;
        return total;
      }),

      prepCost: processMenuEntry('jobItems', function (total, jobEntry) {
        var job = JobItems.findOne({_id: jobEntry._id});
        var jobItemProps = self.jobItem(job);
        total += jobItemProps.prepCostPerPortion * jobEntry.quantity;
        return total;
      }),

      salesPrice: menuItem.salesPrice,

      tax: round(menuItem.salesPrice * 0.1)
    };

    result.contribution = round(result.salesPrice - result.prepCost - result.ingCost - result.tax);
    result.costOfGoods = round(result.ingCost + result.prepCost);

    return result;
  },

  accuracy: function (actual, prediction) {
    var isPossibleToCalculate = _.isNumber(prediction) && _.isNumber(actual) && Math.max(prediction, actual) !== 0;

    var accuracy;
    if (isPossibleToCalculate) {
      accuracy = Math.round((Math.abs(actual - prediction) / Math.max(prediction, actual)) * 100);
      accuracy = accuracy.toString() + '%';
    } else {
      accuracy = '0%';
    }

    return accuracy;
  }
});