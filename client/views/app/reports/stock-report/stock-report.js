Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();

  this.uploadNextStockReport = function () {
    Meteor.call('getNextStocktakeReport', null, HospoHero.handleMethodResult((result) => {
      if (result) {
        console.log(result);
        this.reports.push(result);
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
  }
});
