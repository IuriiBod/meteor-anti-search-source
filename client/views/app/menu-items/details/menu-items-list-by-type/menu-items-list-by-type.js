Template.menuItemsListByType.onCreated(function () {
  this.onAddItem = (itemId) => {
    let query = {
      [this.data.type === 'prep' ? 'jobItems' : 'ingredients']: {
        _id: itemId,
        quantity: 1
      }
    };
    let menuItemId = HospoHero.getParamsFromRoute('_id');
    Meteor.call('editItemOfMenu', menuItemId, query, 'add', HospoHero.handleMethodResult());
  };

  this.getTargetCollection = () => this.data.type === 'ings' ? Ingredients : JobItems;
});


Template.menuItemsListByType.helpers({
  totalCost() {
    let targetCollection = Template.instance().getTargetCollection();
    let totalCost = 0;

    this.items.forEach((item) => {
      let itemDocument = targetCollection.findOne({_id: item._id});
      totalCost += Template.menuItemsListByType.analyzeItemCost(itemDocument, this.type, item.quantity);
    });

    return HospoHero.misc.rounding(totalCost);
  },

  settings() {
    let buttons = [];
    let checker = new HospoHero.security.PermissionChecker();

    if (checker.hasPermissionInArea(null, 'edit menus')) {
      let addIngsOrPreps = {
        url: '#',
        className: `add-${this.type} btn btn-primary btn-xs`,
        text: this.type === 'ings' ? 'Add Ingredient' : 'Add Prep Job'
      };
      buttons.push(addIngsOrPreps);
    }

    return {
      namespace: 'menus',
      uiStateId: this.type,
      title: this.type === 'ings' ? 'Ingredients' : 'Prep Jobs',
      buttons: buttons
    };
  },

  getItemDocument() {
    let targetCollection = Template.instance().getTargetCollection();
    return targetCollection.findOne({_id: this._id});
  },

  tableHeader() {
    let secondColumnName = this.type === 'ings' ? 'Quantity' : 'Amount';
    return ['Name', secondColumnName, 'Measure', 'Price'];
  }
});

Template.menuItemsListByType.events({
  'click .add-ings': function (event, tmpl) {
    event.preventDefault();
    let idsOfItemsInList = _.pluck(tmpl.data.ingredients, '_id');
    FlyoutManager.open('wrapperFlyout', {
      template: 'ingredientsModalList',
      title: 'Select Stocks',
      data: {
        inFlyout: true,
        onAddStockItem: tmpl.onAddItem,
        idsToExclude: idsOfItemsInList
      }
    });
  },

  'click .add-prep': function (event, tmpl) {
    event.preventDefault();
    let idsOfItemsInList = _.pluck(tmpl.data.jobItems, '_id');
    FlyoutManager.open('wrapperFlyout', {
      template: 'prepsList',
      title: 'Select Preps',
      data: {
        inFlyout: true,
        onAddPrepItem: tmpl.onAddItem,
        idsToExclude: idsOfItemsInList
      }
    });
  }
});

/**
 * Calculates cost of item
 *
 * @param item
 * @param itemType
 * @param itemQty
 * @returns {number}
 */
Template.menuItemsListByType.analyzeItemCost = (item, itemType, itemQty) => {
  let isPrep = itemType === 'prep';
  let analyzeResult = HospoHero.analyze[isPrep ? 'jobItem' : 'ingredient'](item);
  let targetValue = analyzeResult[isPrep ? 'prepCostPerMeasure' : 'costPerPortionUsed'];
  return targetValue * itemQty;
};