Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();
  this.lastReportedStocktakeMainId = null;

  this.uploadNextStockReport = function () {
    Meteor.call('getNextStocktakeReport', this.lastReportedStocktakeMainId, HospoHero.handleMethodResult((result) => {
      if (result) {
        this.reports.push(result.report);
        this.lastReportedStocktakeMainId = result.report.secondStocktake.stocktakeMainId;
      }
    }));
  };

  this.uploadNextStockReport();
});

Template.stockReport.helpers({
  reports: function () {
    return Template.instance().reports.list();
  }
});

Template.stockReport.events({
  'click #load-stocktake-report': function (event, tmpl) {
    tmpl.uploadNextStockReport();
  },

  'click .second-stocktake-value': function (event, tmpl) {
    event.preventDefault();

    let stocktakeDate = this.secondStocktake.date.replace(/\//g, '-');
    let stocktakeMainId = this.secondStocktake.stocktakeMainId;
    Router.go('stockTotalValueDetails', {stocktakeMainId: stocktakeMainId, date: stocktakeDate});
  }
});
