Template.stockPrepItemsList.helpers({
  stockAreaPrepItems() {
    let prepItems = StockPrepItems.find({specialAreaId: this.specialAreaId});
    return prepItems.map(item => Object.assign(item, {isEditMode: this.isEditMode}));
  }
});