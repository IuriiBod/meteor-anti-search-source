Template.stockItemsListSortable.onRendered(function() {
  this.$(".sortableStockItems").sortable({
    stop: function (event, ui) {
      var sortedStockItems = new SortableItemsHelper(ui).getSortedItems();
      if (sortedStockItems) {
        Meteor.call("stocktakePositionUpdate", sortedStockItems, HospoHero.handleMethodResult());
      }
    }
  })
});

Template.stockItemsListSortable.events({
  'click .addStock': function (event) {
    event.preventDefault();
    $("#stocksListModal").modal("show");
  }
});

var SortableItemsHelper = function (ui) {
  this._draggedItem = this._getDataByItem(ui.item);
  this._previousItem = this._getDataByItem(ui.item.prev());
  this._nextItem = this._getDataByItem(ui.item.next());
};


SortableItemsHelper.prototype._getDataByItem = function (item) {
  var element = item[0];
  return element ? Blaze.getData(element) : null;
};

SortableItemsHelper.prototype._getOrder = function () {
  var place = 0;
  if (!this._nextItem && this._previousItem) {
    place = this._previousItem.item.place + 1;
  } else if (!this._previousItem && this._nextItem) {
    place = this._nextItem.item.place - 1;
  } else if (this._nextItem && this._previousItem) {
    place = (this._nextItem.item.place + this._previousItem.item.place) / 2;
  }

  return place;
};

SortableItemsHelper.prototype._draggedItemData = function() {
  var draggedItem = {};
  draggedItem.id = this._draggedItem.item._id;
  if (this._draggedItem.item.place) {
      draggedItem.place = this._draggedItem.item.place;
  }

  return draggedItem;
};

SortableItemsHelper.prototype._draggedItemNewPosition = function(stocks, previousItem, nextItem, draggedItem) {
  var newPosition = 0;
  if (!previousItem && nextItem && stocks.indexOf(nextItem) > 0) {
    newPosition = (stocks.indexOf(nextItem) - 1);
  } else if (!nextItem && previousItem) {
    newPosition = (stocks.indexOf(previousItem) + 1);
  } else if (stocks.indexOf(draggedItem) > stocks.indexOf(previousItem)) {
      newPosition = stocks.indexOf(previousItem) + 1;
  } else {
    newPosition = stocks.indexOf(previousItem);
  }

  return newPosition;
};

SortableItemsHelper.prototype.getSortedItems = function() {
  var draggedItem = this._draggedItem.item._id;
  var nextItem = this._nextItem ? this._nextItem.item._id : null;
  var previousItem = this._previousItem ? this._previousItem.item._id : null;

  var specialArea = SpecialAreas.findOne({_id: this._draggedItem.stockTakeData.activeSpecialArea});
  var stocks = specialArea.stocks;
  var stockOldPosition = stocks.indexOf(draggedItem);
  var newPosition = this._draggedItemNewPosition(stocks, previousItem, nextItem, draggedItem);

  stocks.splice(newPosition, 0, stocks.splice(stockOldPosition, 1)[0]);

  return {
    activeSpecialArea: this._draggedItem.stockTakeData.activeSpecialArea,
    stocks: stocks,
    draggedItem: this._draggedItemData()
  };
};