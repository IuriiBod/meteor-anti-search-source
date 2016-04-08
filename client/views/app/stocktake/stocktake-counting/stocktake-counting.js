Template.stocktakeCounting.onCreated(function () {
  this.activeGeneralAreaId = new ReactiveVar(false);
  this.activeSpecialAreaId = new ReactiveVar(false);
  this.stocktakeEditMode = new ReactiveVar(false);
  this.isStockItemsSelected = new ReactiveVar(true);
});

Template.stocktakeCounting.helpers({
  isEditMode: function () {
    return Template.instance().stocktakeEditMode.get();
  },

  activeAreas: function () {
    var tmpl = Template.instance();
    return {
      general: tmpl.activeGeneralAreaId.get(),
      special: tmpl.activeSpecialAreaId.get()
    };
  },

  onStockAreaSelect: function () {
    let tmpl = Template.instance();
    return function (stockArea) {
      if (stockArea) {
        let isSpecialArea = !!stockArea.generalAreaId;
        if (isSpecialArea) {
          tmpl.activeSpecialAreaId.set(stockArea._id);
        } else {
          tmpl.activeGeneralAreaId.set(stockArea._id);
        }
      }
    };
  },

  hasOrders: function () {
    return !!Orders.findOne({stocktakeId: this._id});
  },

  totalStocktakeCost: function () {
    let totalStocktakeCost = 0;
    StockItems.find({stocktakeId: this._id}).forEach((stockItem) => {
      totalStocktakeCost += stockItem.count * stockItem.ingredient.cost;
    });
    return totalStocktakeCost;
  },

  isStockItemsShowing() {
    return Template.instance().isStockItemsSelected.get();
  }
});

Template.stocktakeCounting.events({
  'click .finish-template-editing-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.stocktakeEditMode.set(false);
  },

  'click .edit-template-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.stocktakeEditMode.set(true);
  },

  'click .generate-orders-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.stocktakeEditMode.set(false);
    let stocktakeId = tmpl.data._id;

    Meteor.call('generateOrders', stocktakeId, HospoHero.handleMethodResult(function () {
      Router.go('stocktakeOrdering', {_id: stocktakeId});
    }));
  },

  'click .add-ingredient-button': function (event, tmpl) {
    event.preventDefault();

    const currentSpecialAreaId = tmpl.activeSpecialAreaId.get();
    const currentSpecialArea = StockAreas.findOne({_id: currentSpecialAreaId});

    const onAddStockItem = (ingredientId) => {
      Meteor.call('assignIngredientToStockArea', ingredientId, currentSpecialAreaId, HospoHero.handleMethodResult());
    };

    const onAddPrepItem = (jobItemId) => {
      const stockPrepItem = {
        stocktakeId: tmpl.data._id,
        specialAreaId: currentSpecialAreaId,
        jobItemId: jobItemId,
        relations: HospoHero.getRelationsObject()
      };
      Meteor.call('upsertStockPrepItem', stockPrepItem, HospoHero.handleMethodResult());
    };

    const isStockItemsSelected = tmpl.isStockItemsSelected.get();

    const selectedPrepItemsIds = StockPrepItems
      .find({specialAreaId: currentSpecialAreaId})
      .map(item => item.jobItemId);

    const getFlyoutOptions = () => {
      const selectItemsProperty = isStockItemsSelected ? 'onAddStockItem' : 'onItemsAdded';

      return {
        template: isStockItemsSelected ? 'ingredientsModalList' : 'addJobItem',
        title: `Select ${isStockItemsSelected ? 'Stocks' : 'Preps'}`,
        data: {
          inFlyout: true,
          idsToExclude: isStockItemsSelected ? currentSpecialArea.ingredientsIds : selectedPrepItemsIds,
          [selectItemsProperty]: isStockItemsSelected ? onAddStockItem : onAddPrepItem
        }
      };
    };

    FlyoutManager.open('wrapperFlyout', getFlyoutOptions());
  },

  'click .show-stock-items': (event, tmpl) => {
    event.preventDefault();
    tmpl.isStockItemsSelected.set(true);
  },

  'click .show-prep-stock-items': (event, tmpl) => {
    event.preventDefault();
    tmpl.isStockItemsSelected.set(false);
  }
});