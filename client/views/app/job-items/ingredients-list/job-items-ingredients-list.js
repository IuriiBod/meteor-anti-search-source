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
  }
});

Template.listOfIngredients.helpers({
  ingredients: function () {
    var stockItemsInList = Template.instance().stockItemsInList.get();
    Template.instance().data.onChange(stockItemsInList);
    return stockItemsInList;
  },

  isMenu: function () {
    return Template.instance().data.id == "menuSubmit";
  },

  modalStockListParams: function () {
    var thisTmpl = Template.instance();

    var stockItemsInListIds = _.map(thisTmpl.stockItemsInList.get(), function (item) {
      return item.id;
    });
    return {
      onAddStockItem: function (itemId) {
        var addedIds = thisTmpl.stockItemsInList.get();
        addedIds.push({id: itemId, quantity: 1});
        thisTmpl.stockItemsInList.set(addedIds);
      },
      stockItemsInListIds: stockItemsInListIds
    }
  },

  onChangeStockItem: function () {
    return Template.instance().onChangeStockItemsList;
  }
});

Template.listOfIngredients.events({
  'click #showIngredientsList': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  }
});