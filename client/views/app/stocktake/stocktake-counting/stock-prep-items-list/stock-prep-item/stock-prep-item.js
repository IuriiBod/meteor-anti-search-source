Template.stockPrepItem.onCreated(function () {
  this.getStockPrepItem = () => {
    let data = this.data;

    let oldStockPrepItem = StockPrepItems.findOne({
      specialAreaId: data.specialAreaId,
      jobItemId: data.prepJobItem._id
    });

    if (!oldStockPrepItem) {
      oldStockPrepItem = {
        specialAreaId: data.specialAreaId,
        jobItemId: data.prepJobItem._id,
        stocktakeId: data.stocktakeId,
        count: 0,
        relations: HospoHero.getRelationsObject()
      };
    }
    return oldStockPrepItem;
  };
});


Template.stockPrepItem.helpers({
  stockPrepItem() {
    return Template.instance().getStockPrepItem();
  },

  onStockPrepItemCountChanged() {
    let tmpl = Template.instance();

    return function (newValue) {
      let count = parseFloat(newValue);

      if (_.isFinite(count)) {
        let updatedStockPrepItem = tmpl.getStockPrepItem();
        updatedStockPrepItem.count = HospoHero.misc.rounding(count, 100);

        Meteor.call('upsertStockPrepItem', updatedStockPrepItem, HospoHero.handleMethodResult(() => {
          //move to next ghost editable count
          Template.ghostEditable.focusNextGhost(tmpl, 'li');
        }));
      }
    };
  }
});


Template.stockPrepItem.events({
  'click .remove-item-button': function (event, tmpl) {
    event.preventDefault();

    const confirmDelete = confirm('This action will remove this prep item from this area. ' +
      'Are you sure you want to continue?');

    if (confirmDelete) {
      Meteor.call('removeItemFromStockArea', tmpl.data.prepJobItem._id, tmpl.data.specialAreaId, 'prep',
        HospoHero.handleMethodResult());
    }
  }
});