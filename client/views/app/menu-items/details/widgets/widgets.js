Template.menuDetailWidgets.onRendered(function () {
  var self = this;
  var onPriceEditSuccess = function (response, newValue) {
    Meteor.call("editMenuItem", self.data._id, {salesPrice: newValue}, HospoHero.handleMethodResult());
  };

  $('.edit-item-price').editable({
    type: "text",
    title: 'Edit sale price',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: onPriceEditSuccess
  });
});

Template.menuDetailWidgets.helpers({
  menuItemStats: function () {
    var menu = this;

    var round = function (value) {
      return Math.round(value * 100) / 100;
    };

    var processMenuEntry = function (propertyName, predicate) {
      var entriesField = menu[propertyName];
      return _.isArray(entriesField) && round(_.reduce(entriesField, predicate, 0)) || 0;
    };

    var result = {
      totalIngCost: processMenuEntry('ingredients', function (total, ingredientEntry) {
        var ingredient = Ingredients.findOne({_id: ingredientEntry.id});
        var ingredientProps = HospoHero.analyze.ingredient(ingredient);
        total += ingredientProps.costPerPortionUsed * ingredientEntry.quantity;
        return total;
      }),

      totalPrepCost: processMenuEntry('jobItems', function (total, jobEntry) {
        var job = JobItems.findOne({_id: jobEntry._id});
        var jobItemProps = HospoHero.analyze.jobItem(job);
        total += jobItemProps.prepCostPerPortion * jobEntry.quantity;
        return total;
      }),

      tax: round(menu.salesPrice * 0.1)
    };

    result.contribution = round(menu.salesPrice - result.totalPrepCost - result.totalIngCost - result.tax);
    return result;
  }
});