Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();
  let lastReportedStocktakeMainId = null;

  this.uploadNextStockReport = function () {
    Meteor.call('getNextStocktakeReport', lastReportedStocktakeMainId, HospoHero.handleMethodResult((result) => {
      if (result) {
        this.reports.push(result.report);
        lastReportedStocktakeMainId = result.lastStocktakeMainId;
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

  'click .difference-text': function (event, tmpl) {
    event.preventDefault();

    Router.go('stockVarianceReport');
  }
});
