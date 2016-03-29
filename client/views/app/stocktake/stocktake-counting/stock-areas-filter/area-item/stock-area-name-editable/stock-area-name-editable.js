Template.stockAreaNameEditable.onRendered(function () {
  let onCountChanged = (response, newName) => {
    let stockArea = this.data;
    Meteor.call('renameStockArea', stockArea._id, newName, HospoHero.handleMethodResult());
  };

  this.$(".area-name").editable({
    type: "text",
    title: 'Edit area name',
    showbuttons: false,
    display: false,
    mode: 'inline',
    success: onCountChanged
  });
});
