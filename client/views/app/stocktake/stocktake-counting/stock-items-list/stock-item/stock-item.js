Template.stockItem.onCreated(function () {
  this.getStockItem = function () {
    return StockItems.findOne({
      specialAreaId: this.data.specialAreaId,
      'ingredient.id': this.data.ingredient._id
    });
  };
});

Template.stockItem.onRendered(function () {
  this.$('[data-toggle="tooltip"]').tooltip();

  let tmpl = this;
  let getUpdatedStockItemDocument = function (count) {
    let updatedStockItem = tmpl.getStockItem();
    if (updatedStockItem) {
      updatedStockItem.count = count;
    } else {
      updatedStockItem = {
        stocktakeId: tmpl.data.stocktakeId,
        specialAreaId: tmpl.data.specialAreaId,
        ingredient: {
          id: tmpl.data.ingredient._id,
          cost: tmpl.data.ingredient.costPerPortion
        },
        count: count,
        relations: HospoHero.getRelationsObject()
      };
    }
    return updatedStockItem;
  };

  let onCountChanged = function (response, newValue) {
    let floatCount = parseFloat(newValue);
    if (_.isFinite(floatCount)) {
      let count = Math.round(floatCount * 100) / 100; //round
      let stockItemDocument = getUpdatedStockItemDocument(count);

      let element = this;
      Meteor.call('upsertStockItem', stockItemDocument, HospoHero.handleMethodResult(function () {
        //move to next count x-editable
        let nextEditables = $(element).closest('li').next();
        if (nextEditables.length > 0) {
          nextEditables.find('a').click();
        }
      }));
    }
  };

  this.$(".stock-item-count").editable({
    type: "text",
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: () => {
    },
    success: onCountChanged
  });
});

Template.stockItem.helpers({
  stockItem: function () {
    return Template.instance().getStockItem();
  },
  isStockItemEditable: function () {
    let stockItem = Template.instance().getStockItem();
    return !stockItem || !stockItem.orderItem;
  }
});

Template.stockItem.events({
  'click .removeFromList': function (event, tmpl) {
    event.preventDefault();
    var confirmDelete = confirm("This action will remove this stock item from this area. Are you sure you want to continue?");
    if (confirmDelete) {
      let ingredientId = tmpl.data.ingredient._id;
      let specialAreaId = tmpl.data.specialAreaId;
      let stockItem = tmpl.getStockItem();

      if (stockItem && stockItem.orderItem) {
        HospoHero.error("Order has been created. You can't delete this stocktake item.");
        return;
      }

      Meteor.call('removeIngredientFromStockArea', ingredientId, specialAreaId, HospoHero.handleMethodResult(() => {
        if (stockItem) {
          Meteor.call('removeStockItem', stockItem._id, HospoHero.handleMethodResult());
        }
      }));
    }
  }
});