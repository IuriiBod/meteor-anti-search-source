Template.listOfIngredients.onCreated(function () {
  this.stockItemsInList = new ReactiveVar(this.data.ingredients || []);

  var tmpl = this;
  this.onChangeStockItemsList = function (action, changedItem) {
    var stockItems = tmpl.stockItemsInList.get();
    var changedStockItems;

    if (action === 'added') {
      stockItems.push(changedItem);
      changedStockItems = stockItems;
    } else if (action === 'changed') {
      changedStockItems = _.map(stockItems, function (item) {
        return item._id === changedItem._id ? changedItem : item;
      });
    } else if (action === 'removed') {
      changedStockItems = _.filter(stockItems, function (item) {
        return item._id !== changedItem._id;
      });
    }

    tmpl.stockItemsInList.set(changedStockItems);
    tmpl.data.onChange(changedStockItems);
  };
});


Template.listOfIngredients.helpers({
  ingredients: function () {
    var tmpl = Template.instance();
    var stockItemsInList = tmpl.stockItemsInList.get();

    return stockItemsInList.map(function (stockEntry) {
      return {
        item: Ingredients.findOne({_id: stockEntry._id}),
        quantity: stockEntry.quantity,
        onChange: tmpl.onChangeStockItemsList
      };
    });
  },

  modalStockListParams: function () {
    var tmpl = Template.instance();

    var stockItemsInListIds = _.map(tmpl.stockItemsInList.get(), function (item) {
      return item._id;
    });
    return {
      onAddStockItem: function (itemId) {
        tmpl.onChangeStockItemsList('added', {id: itemId, quantity: 1});
      },
      stockItemsInListIds: stockItemsInListIds
    };
  }
});


Template.listOfIngredients.events({
  'click #showIngredientsList': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  }
});