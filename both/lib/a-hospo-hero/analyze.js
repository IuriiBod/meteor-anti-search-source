Namespace('HospoHero.analyze', {
  ingredient: function (ingredient) {
    if (!ingredient) {
      return false;
    }

    let hasRequiredValues = ingredient.costPerPortion > 0 && ingredient.unitSize > 0;

    let calculateCost = () =>
      HospoHero.misc.rounding(ingredient.costPerPortion / ingredient.unitSize, 10000);

    return {
      costPerPortionUsed: hasRequiredValues && calculateCost() || 0
    };
  },

  jobItem: function (jobItem) {
    if (!jobItem) {
      return false;
    }

    let round = HospoHero.misc.rounding;

    let totalIngredientCost = _.reduce(jobItem.ingredients || [], (totalCost, ingredientItem) => {
      let ingredientProps = HospoHero.analyze.ingredient(Ingredients.findOne(ingredientItem._id));
      totalCost += ingredientProps.costPerPortionUsed * ingredientItem.quantity;
      return totalCost;
    }, 0);

    let labourCost = jobItem.wagePerHour && ((jobItem.wagePerHour * jobItem.activeTime) / 3600) || 0;

    let totalCost = totalIngredientCost + labourCost;

    let prepCostPerMeasure = totalCost > 0 && jobItem.producedAmount > 0 && round(totalCost / jobItem.producedAmount) || 0;

    return {
      labourCost: round(labourCost),
      totalIngredientCost: totalIngredientCost,
      prepCostPerMeasure: prepCostPerMeasure
    };
  },

  menuItem: function (menuItem) {
    if (!menuItem) {
      return {};
    }

    let round = HospoHero.misc.rounding;

    let processMenuEntry = (propertyName, predicate) => {
      let entriesField = menuItem[propertyName];
      return _.isArray(entriesField) && round(_.reduce(entriesField, predicate, 0)) || 0;
    };

    let result = {
      ingCost: processMenuEntry('ingredients', (total, ingredientEntry) => {
        let ingredient = Ingredients.findOne({_id: ingredientEntry._id});
        let ingredientProps = this.ingredient(ingredient);
        total += ingredientProps.costPerPortionUsed * ingredientEntry.quantity;
        return total;
      }),

      prepCost: processMenuEntry('jobItems', (total, jobEntry) => {
        let job = JobItems.findOne({_id: jobEntry._id});
        let jobItemProps = this.jobItem(job);
        total += jobItemProps.prepCostPerMeasure * jobEntry.quantity;
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