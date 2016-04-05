Template.stockPrepItem.onCreated(function() {
  this.getStockPrepItem = () => StockPrepItems.findOne({_id: this.data._id});
});

Template.stockPrepItem.onRendered(function() {
  const tmpl = this;

  const onCountChanged = function (response, newValue) {
    let count = parseFloat(newValue);

    if (_.isFinite(count)) {
      count = Math.round(count * 100) / 100;
      const updatedStockPrepItem = Object.assign(tmpl.getStockPrepItem(), {count: count});

      const element = this;
      Meteor.call('upsertStockPrepItem', updatedStockPrepItem, HospoHero.handleMethodResult(() => {
        //move to next count x-editable
        let nextEditables = $(element).closest('li').next();
        if (nextEditables.length > 0) {
          nextEditables.find('a').click();
        }
      }));
    }
  };

  this.$(".prep-item-count").editable({
    type: "text",
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: () => {
    },
    success: onCountChanged
  });
});

Template.stockPrepItem.helpers({
  stockPrepItem() {
    return Template.instance().getStockPrepItem();
  }, 
  prepItem() {
    return JobItems.findOne({_id: this.jobItemId});
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