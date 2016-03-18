console.log('debug');
Template.stockItemsList.onCreated(function () {
  this.getStockAreaIngredients = () => StockAreas.findOne({_id: this.specialAreaId}).ingredientsIds;
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
  console.log(this);
};


StockItemsSortableHelper.prototype._getIngredientIdByItem = function (item) {
  var element = item[0];
  return element ? Blaze.getData(element) : null;
};

StockItemsSortableHelper.prototype.getNewIngredientsOrder = function () {
  
};