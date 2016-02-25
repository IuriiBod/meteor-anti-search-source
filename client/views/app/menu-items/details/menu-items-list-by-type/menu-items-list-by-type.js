Template.menuItemsListByType.onCreated(function () {
  this.analyzeItemCost = (item, itemType, itemQty) => {
    let isPrep = itemType === 'prep';
    let analyzeResult = HospoHero.analyze[isPrep ? 'jobItem' : 'ingredient'](item);
    let targetValue = analyzeResult[isPrep ? 'prepCostPerPortion' : 'costPerPortionUsed'];
    return targetValue * itemQty;
  };

  this.onAddItem = (itemId) => {
    var query = {};
    query[this.data.type === 'prep' ? 'jobItems' : 'ingredients'] = {
      _id: itemId,
      quantity: 1
    };

    var menuItemId = HospoHero.getParamsFromRoute('_id');
    Meteor.call("editItemOfMenu", menuItemId, query, 'add', HospoHero.handleMethodResult());
  }
});

Template.menuItemsListByType.helpers({
  settings() {
    let buttons = [];
    let checker = new HospoHero.security.PermissionChecker();

    if (checker.hasPermissionInArea(null, `edit menus`)) {
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
    }
  },

  ingredient() {
    return Ingredients.findOne({_id: this._id});
  },

  tableHeader() {
    return this.type === 'ings' ? ['Name', 'Quantity', 'Measure', 'Price'] : ['Name', 'Qty', 'Price'];
  },

  jobItems() {
    let jobItems = this.jobItems;
    let totalCost = 0;
    if (jobItems && jobItems.length) {
      jobItems.forEach((jobItem) => {
        totalCost += Template.instance().analyzeItemCost(jobItem, this.type, jobItem.quantity);
      });
      let jobItemsTotalCost = {
        totalCost: HospoHero.misc.rounding(totalCost)
      };
      jobItems.push(jobItemsTotalCost);
    }
    return jobItems;
  },

  analyzeItemCost() {
    return Template.instance().analyzeItemCost;
  }
});

Template.menuItemsListByType.events({
  'click .add-ings': function (event, tmpl) {
    event.preventDefault();
    let idsOfItemsInList = _.pluck(tmpl.data.ingredients, '_id');
    FlyoutManager.open('stocksList', {
      onAddStockItem: tmpl.onAddItem,
      idsToExclude: idsOfItemsInList
    });
  },

  'click .add-prep': function (event, tmpl) {
    event.preventDefault();
    let idsOfItemsInList = _.pluck(tmpl.data.jobItems, '_id');
    FlyoutManager.open('prepsList', {
      onAddPrepItem: tmpl.onAddItem,
      idsToExclude: idsOfItemsInList
    });
  }
});