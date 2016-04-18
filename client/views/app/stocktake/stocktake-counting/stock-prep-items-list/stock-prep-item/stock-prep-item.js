Template.stockPrepItem.onCreated(function () {
  this.getStockPrepItem = () => StockPrepItems.findOne({_id: this.data._id});
});

Template.stockPrepItem.helpers({
  stockPrepItem() {
    return Template.instance().getStockPrepItem();
  },

  prepItem() {
    return JobItems.findOne({_id: this.jobItemId});
  },

  onStockPrepItemCountChanged() {
    let tmpl = Template.instance();

    return function (newValue) {
      let count = parseFloat(newValue);

      if (_.isFinite(count)) {
        count = Math.round(count * 100) / 100;
        const updatedStockPrepItem = Object.assign(tmpl.getStockPrepItem(), {count: count});

        Meteor.call('upsertStockPrepItem', updatedStockPrepItem, HospoHero.handleMethodResult(() => {
          //move to next ghost editable count
          Template.ghostEditable.focusNextGhost(tmpl, 'li');
        }));
      }
    };
  }
});

Template.stockPrepItem.events({
  'click .remove-item-button': (event, tmpl) => {
    event.preventDefault();

    const confirmDelete = confirm('This action will remove this stock item from this area. ' +
      'Are you sure you want to continue?');

    if (confirmDelete) {
      Meteor.call('removeStockPrepItem', tmpl.data._id, HospoHero.handleMethodResult());
    }
  }
});