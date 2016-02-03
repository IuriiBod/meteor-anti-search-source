Template.menuItemsListByType.onCreated(function () {
  this.getJobItem = (id) => JobItems.findOne({_id: id});
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
  itemsName() {
    return this.type === 'ings' ? 'Ingredients' : 'Prep Jobs';
  },

  ingredient() {
    return Ingredients.findOne({_id: this._id});
  },

  jobItem() {
    //return JobItems.findOne({_id: this._id});
    return Template.instance().getJobItem(this._id);
  },

  tableHeader() {
    return this.type === 'ings' ? ['Name', 'Quantity', 'Measure', 'Price'] : ['Name', 'Qty', 'Price'];
  },

  jobItemsTotalPrice() {
    let [jobItems, totalCost] = [this.jobItems, 0];
    let tmpl = Template.instance();
    if (jobItems) {
      jobItems.forEach((jobItem) => {
        let item = tmpl.getJobItem(jobItem._id);
        totalCost += tmpl.analyzeItemCost(item, this.type, jobItem.quantity);
      });
      return HospoHero.misc.rounding(totalCost);
    }
  },

  analyzeItemCost() {
    return Template.instance().analyzeItemCost;
  }
});

Template.menuItemsListByType.events({
  'click #showIngsOrPrepList': function (event, tmpl) {
    event.preventDefault();

    if (tmpl.data.type === 'ings') {
      let idsOfItemsInList = _.pluck(tmpl.data.ingredients, '_id');
      FlyoutManager.open('stocksList', {
        onAddStockItem: tmpl.onAddItem,
        idsToExclude: idsOfItemsInList
      });
    } else {
      let idsOfItemsInList = _.pluck(tmpl.data.jobItems, '_id');
      FlyoutManager.open('prepsList', {
        onAddPrepItem: tmpl.onAddItem,
        idsToExclude: idsOfItemsInList
      });
    }
  }
});