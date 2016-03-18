Template.stockItem.onRendered(function () {
  this.$('[data-toggle="tooltip"]').tooltip();

  var onCountChanged = (response, newValue) => {
    let floatCount = parseFloat(newValue);
    if (_.isFinite(floatCount)) {
      var count = Math.round(floatCount * 100) / 100; //round

      var stockItemDocument = {
        stocktakeId: this.data.stocktakeId,
        specialAreaId: this.data.specialAreaId,
        ingredient: {
          id: this.data.ingredient,
          cost: this.data.ingredient.costPerPortion
        },
        count: count
      };

      Meteor.call('upsertStockItem', stockItemDocument, HospoHero.handleMethodResult(function () {
        //move to next count x-editable
        if ($(element).closest('li').next().length > 0) {
          $(element).closest('li').next().find('a').click();
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
  isStockItemEditable: function () {
    //todo: decide about orders
    return this.stockItem && this.stockItem.orderItemId;
  }
});

Template.stockItem.events({
  'click .removeFromList': function (event, tmpl) {
    event.preventDefault();
    var confirmDelete = confirm("This action will remove this stock item from this area. Are you sure you want to continue?");
    if (confirmDelete) {
      let ingredientId = tmpl.data.ingredient._id;
      let specialAreaId = tmpl.data.specialAreaId;
      var stockItem = tmpl.data.stockItem;

      if (stockItem && stockItem.orderItemId) {
        HospoHero.error("Order has been created. You can't delete this stocktake item.");
        return;
      }

      Meteor.call('removeIngredientFromStockArea', ingredientId, specialAreaId, HospoHero.handleMethodResult(() => {
        if (tmpl.data.stockItem) {
          Meteor.call('removeStockItem', tmpl.data.stockItem._id, HospoHero.handleMethodResult());
        }
      }));
    }
  }
});