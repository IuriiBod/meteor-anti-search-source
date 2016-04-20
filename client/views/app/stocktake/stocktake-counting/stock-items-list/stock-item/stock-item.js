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
});

Template.stockItem.helpers({
  stockItem: function () {
    return Template.instance().getStockItem();
  },

  isStockItemEditable: function () {
    let supplierId = this.ingredient.suppliers;
    let suppliersOrder = Orders.findOne({supplierId: supplierId});
    return !suppliersOrder;
  },

  onStockItemCountChanged: function () {
    let tmpl = Template.instance();

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

    return function (newValue) {
      let floatCount = parseFloat(newValue);
      if (_.isFinite(floatCount)) {
        let count = Math.round(floatCount * 100) / 100; //round
        let stockItemDocument = getUpdatedStockItemDocument(count);

        Meteor.call('upsertStockItem', stockItemDocument, HospoHero.handleMethodResult(function () {
          Template.ghostEditable.focusNextGhost(tmpl, 'li');
        }));
      }
    };
  }
});

Template.stockItem.events({
  'click .remove-ingredient-button': function (event, tmpl) {
    event.preventDefault();
    var confirmDelete = confirm("This action will remove this stock item from this area. Are you sure you want to continue?");
    if (confirmDelete) {
      let ingredientId = tmpl.data.ingredient._id;
      let specialAreaId = tmpl.data.specialAreaId;
      Meteor.call('removeItemFromStockArea', ingredientId, specialAreaId, 'stock', HospoHero.handleMethodResult());
    }
  }
});

Template.stockItem.onDestroyed(function () {
  this.$('[data-toggle="tooltip"]').tooltip('destroy');
});