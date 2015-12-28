//todo: DEPRECATED remove it in future (use it's analog in HospoHero.analyze)
getIngredientItem = function (id) {
  if (id) {
    var item = Ingredients.findOne(id);
    if (item) {
      if ((item.costPerPortion > 0) && (item.unitSize > 0)) {
        item.costPerPortionUsed = item.costPerPortion / item.unitSize;
        item.costPerPortionUsed = HospoHero.misc.rounding(item.costPerPortionUsed, 10000);
      } else {
        item.costPerPortion = 0;
        item.costPerPortionUsed = 0;
      }
      return item;
    }
  }
};
