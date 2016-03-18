Template.stockItemsList.onCreated(function () {
  this.getStockAreaIngredients = () => StockAreas.findOne({_id: this.data.specialAreaId}).ingredientsIds;
});

Template.stockItemsList.onRendered(function () {
  //initialize sortable
  let sortableElement = this.$('.stock-items-sortable');
  let tmpl = this;

  sortableElement.sortable({
    stop: function (event, ui) {
      let sortableHelper = new StockItemsSortableHelper(ui, tmpl.getStockAreaIngredients());
      let newOrderOfIngredients = sortableHelper.getNewIngredientsOrder();
      if (newOrderOfIngredients) {
        Meteor.call("updateStockAreaIngredientsOrder", tmpl.data.specialAreaId, newOrderOfIngredients, HospoHero.handleMethodResult());
      }
    }
  });

  //enable/disable according to isEditMode
  this.autorun(() => {
    let currentData = Template.currentData();
    sortableElement.sortable(currentData.isEditMode ? 'enable' : 'disable')
  });
});


Template.stockItemsList.helpers({
  stockAreaIngredients: function () {
    return Template.instance().getStockAreaIngredients();
  },

  getStockItemContext: function () {
    let templateContext = Template.parentData(1);
    let ingredientId = this.toString();
    return {
      stocktakeId: templateContext.stocktakeId,
      ingredient: Ingredients.findOne({_id: ingredientId}),
      specialAreaId: templateContext.specialAreaId,
      isEditMode: templateContext.isEditMode
    }
  }
});


var StockItemsSortableHelper = function (ui, ingredientsIds) {
  this._ingredients = ingredientsIds;
  this._draggedItem = this._getIngredientIdByItem(ui.item);
  this._previousItem = this._getIngredientIdByItem(ui.item.prev());
  this._nextItem = this._getIngredientIdByItem(ui.item.next());
};


StockItemsSortableHelper.prototype._getIngredientIdByItem = function (item) {
  var element = item[0];
  let elementData = element ? Blaze.getData(element) : false;
  return HospoHero.utils.getNestedProperty(elementData, 'ingredient._id', false);
};

StockItemsSortableHelper.prototype.getNewIngredientsOrder = function () {
  if (!this._previousItem && !this._nextItem) {
    return false;
  }

  let ingredients = this._ingredients.map(id=>id); //copy array to avoid external bugs

  //remove dragged item
  let draggedItemOldIndex = ingredients.indexOf(this._draggedItem);
  ingredients.splice(draggedItemOldIndex, 1);

  //find new position
  let isInsertBefore = !this._previousItem && !!this._nextItem;
  let draggedItemNewPosition;
  if (isInsertBefore) {
    draggedItemNewPosition = ingredients.indexOf(this._nextItem);
  } else { //insert after position
    draggedItemNewPosition = ingredients.indexOf(this._previousItem) + 1;
  }

  //put dragged item into position
  ingredients.splice(draggedItemNewPosition, 0, this._draggedItem);
  return ingredients;
};