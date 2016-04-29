Template.ingredientsModalListItem.onCreated(function () {
  this.getCostPerPortionUsed = function () {
    var costPerPortionUsed = 0;
    var stock = this.data.stock;
    if ((stock.costPerPortion > 0) && (stock.unitSize > 0)) {
      costPerPortionUsed = stock.costPerPortion / stock.unitSize;
      costPerPortionUsed = HospoHero.misc.rounding(costPerPortionUsed);
      if (costPerPortionUsed === 0) {
        costPerPortionUsed = 0.001;
      }
    }
    return costPerPortionUsed;
  };
});

Template.ingredientsModalListItem.onRendered(function () {
  this.$('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
});

Template.ingredientsModalListItem.helpers({
  stockItem: function () {
    return Template.instance().data.stock;
  },
  costPerPortionUsed: function () {
    return Template.instance().getCostPerPortionUsed();
  }
});

Template.ingredientsModalListItem.events({
  'ifChecked .add-ing-checkbox': function (event, tmpl) {
    event.stopPropagation();
    tmpl.data.onAddStockItem(tmpl.data.stock._id);
  },

  'click .ingredients-list-item': function (event, tmpl) {
    event.preventDefault();

    FlyoutManager.open('wrapperFlyout', {
      template: 'ingredientEditor',
      title: 'Edit Ingredient',
      data: {
        inFlyout: true,
        editMode: true,
        ingredient: tmpl.data.stock
      }
    });
  }
});

Template.ingredientsModalListItem.onDestroyed(function () {
  this.$('.i-checks').iCheck('destroy');
});