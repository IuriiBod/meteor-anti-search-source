Template.stockVarianceReport.onCreated(function () {

});

Template.stockVarianceReport.helpers({
  tableHeader() {
    return ['Stock Item Name', 'Stocktake Total', 'Orders Received', 'Stocktake Total',
            'Expected COGS', 'Actual COGS', 'Variance', 'Variance %']
  }
});