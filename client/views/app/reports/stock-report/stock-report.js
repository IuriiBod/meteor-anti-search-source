Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();
  let lastReportedStocktakeMainId = null;

  this.getRouteParams = (currentStocktake) => {
    return {
      date: currentStocktake.date.replace(/\//g, '-'),
      stocktakeMainId: currentStocktake.stocktakeMainId
    };
  };

  this.uploadNextStockReport = () => {
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

  'click .first-stocktake-total': function (event, tmpl) {
    event.preventDefault();
    Router.go('stockTotalValueDetails', tmpl.getRouteParams(this.firstStocktake));
  },

  'click .second-stocktake-total': function (event, tmpl) {
    event.preventDefault();
    Router.go('stockTotalValueDetails', tmpl.getRouteParams(this.secondStocktake));
  }
});
