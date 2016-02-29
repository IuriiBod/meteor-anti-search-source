Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();
  let lastReportedStocktakeMainId = null;

  this.uploadNextStockReport = function () {
    Meteor.call('getNextStocktakeReport', lastReportedStocktakeMainId, HospoHero.handleMethodResult((result) => {
      if (result) {
        this.reports.push(result.report);
        lastReportedStocktakeMainId = result.report.secondStocktake.stocktakeMainId;
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

    if (event.target.className === 'first-stocktake-total') {
      params.date = this.firstStocktake.date.replace(/\//g, '-');
      params.stocktakeMainId = this.firstStocktake.stocktakeMainId;
    } else {
      params.date = this.secondStocktake.date.replace(/\//g, '-');
      params.stocktakeMainId = this.secondStocktake.stocktakeMainId;
    }

    Router.go('stockTotalValueDetails', params);
  }
});
