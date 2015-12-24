Template.listOfIngredients.helpers({
  onChangeItemInList: function () {
    var tmpl = Template.instance();
    var onChangeStockItemsList = function (operationType, changedItem) {
      var stockItems = tmpl.data.ingredients;
      if (operationType == 'removed') {
        stockItems = _.reject(stockItems, function (item) {
          return item._id == changedItem._id;
        });
      } else if (operationType == 'changed') {
        return _.map(stockItems, function (item) {
          item.quantity = item._id == changedItem._id ? item.quantity = changedItem.quantity : item.quantity;
          return item;
        });
      }
      tmpl.data.onChange(stockItems);
    };

    return onChangeStockItemsList;
  },

  ingredients: function () {
    var ingredientObjectsWithQuantity = [];

    var itemsInList = this.ingredients;
    itemsInList.forEach(function (item) {
      var ingredient = Ingredients.findOne({_id: item._id});
      ingredient.quantity = item.quantity;
      ingredientObjectsWithQuantity.push(ingredient);
    });

    return ingredientObjectsWithQuantity;
  },

  isMenu: function () {
    return Template.instance().data.id == "menuSubmit";
  },

  modalStockListParams: function () {
    var thisTmpl = Template.instance();

    var stockItemsInListIds = _.map(thisTmpl.data.ingredients, function (item) {
      return item._id;
    });
    return {
      onAddStockItem: function (itemId) {
        var addedIds = thisTmpl.data.ingredients;
        addedIds.push({_id: itemId, quantity: 1});
        thisTmpl.data.onChange(addedIds);
      },
      stockItemsInListIds: stockItemsInListIds
    }
  }
});

Template.listOfIngredients.events({
  'click #showIngredientsList': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  }
});