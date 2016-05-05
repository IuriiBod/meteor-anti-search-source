Template.stocktakeCounting.onCreated(function () {
  this.activeGeneralAreaId = new ReactiveVar(false);
  this.activeSpecialAreaId = new ReactiveVar(false);
  this.stocktakeEditMode = new ReactiveVar(false);
  this.isStockItemsSelected = new ReactiveVar(true);
  this.supplierId = new ReactiveVar(null);
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
  },

  supplierId: function () {
    return Template.instance().supplierId.get();
  },

  onSupplierIdChanged() {
    let tmpl = Template.instance();
    return function (supplierId) {
      tmpl.supplierId.set(supplierId);
    };
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

  'click .add-item-button': function (event, tmpl) {
    event.preventDefault();

    const currentSpecialAreaId = tmpl.activeSpecialAreaId.get();
    const currentSpecialArea = StockAreas.findOne({_id: currentSpecialAreaId});
    const isStockTabSelected = tmpl.isStockItemsSelected.get();

    const onAssignItemToArea = (itemId) => {
      let itemType = isStockTabSelected ? 'stock' : 'prep';

      Meteor.call('assignItemToStockArea', itemId, currentSpecialAreaId, itemType, HospoHero.handleMethodResult());
    };

    const getFlyoutOptions = () => {
      const selectItemsProperty = isStockTabSelected ? 'onAddStockItem' : 'onItemsAdded';
      return {
        template: isStockTabSelected ? 'ingredientsModalList' : 'addJobItem',
        title: `Select ${isStockTabSelected ? 'Stocks' : 'Preps'}`,
        data: {
          inFlyout: true,
          idsToExclude: currentSpecialArea[isStockTabSelected ? 'ingredientsIds' : 'prepItemIds'] || [],
          [selectItemsProperty]: onAssignItemToArea
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
