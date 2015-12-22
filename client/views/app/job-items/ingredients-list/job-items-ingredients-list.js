Template.listOfIngredients.onCreated(function () {
  this.stockItemsInList = new ReactiveVar(this.data.ingredients || []);

  var self = this;
  this.onChangeStockItemsList = function (changedItem) {
    var stockItems = self.stockItemsInList.get();
    var changedStockItems = [];
    if (changedItem.quantity == 0) {
      stockItems.forEach(function (item) {
        if (item.id != changedItem.id) {
          changedStockItems.push(item);
        }
      });
    } else {
      changedStockItems = _.map(stockItems, function (item) {
        if (item.id == changedItem.id) {
          return changedItem;
        }
        return item;
      })
    }
    self.stockItemsInList.set(changedStockItems);
  };
});


Template.listOfIngredients.helpers({
  ingredients: function () {
    var tmpl = Template.instance();
    var stockItemsInList = tmpl.stockItemsInList.get();

    return stockItemsInList.map(function (stockEntry) {
      return {
        item: Ingredients.findOne({_id: stockEntry.id}),
        quantity: stockEntry.quantity,
        onChangeStockItem: tmpl.onChangeStockItemsList
      };
    });
  },

  modalStockListParams: function () {
    var tmpl = Template.instance();

    var stockItemsInListIds = _.map(tmpl.stockItemsInList.get(), function (item) {
      return item.id;
    });
    return {
      onAddStockItem: function (itemId) {
        var addedIds = tmpl.stockItemsInList.get();
        addedIds.push({id: itemId, quantity: 1});
        tmpl.stockItemsInList.set(addedIds);
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