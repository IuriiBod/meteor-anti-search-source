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

  'click .first-stocktake-total, click .second-stocktake-total': function (event, tmpl) {
    event.preventDefault();
    let params = {};
    let firstStocktakeTotal = event.target.className === 'first-stocktake-total';

    if (firstStocktakeTotal) {
      params.date = this.firstStocktake.date.replace(/\//g, '-');
      params.stocktakeMainId = this.firstStocktake.stocktakeMainId;
    } else {
      params.date = this.secondStocktake.date.replace(/\//g, '-');
      params.stocktakeMainId = this.secondStocktake.stocktakeMainId;
    }

    Router.go('stockTotalValueDetails', params);
  }
});
