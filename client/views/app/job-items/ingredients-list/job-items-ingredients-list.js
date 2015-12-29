Template.listOfIngredients.helpers({
  onChangeItemInList: function () {
    var tmpl = Template.instance();
    return function (operationType, changedItem) {
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
    return this.id === "menuSubmit";
  },

  modalStockListParams: function () {
    var tmpl = Template.instance();

    var stockItemsInListIds = _.map(tmpl.data.ingredients, function (item) {
      return item._id;
    });
    return {
      onAddStockItem: function (itemId) {
        var addedIds = tmpl.data.ingredients;
        addedIds.push({_id: itemId, quantity: 1});
        tmpl.data.onChange(addedIds);
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