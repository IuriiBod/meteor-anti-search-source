Template.stockReport.onCreated(function () {
  this.reportsCount = new ReactiveVar(1);
});

Template.stockReport.helpers({
  reports: function () {
    return ReactiveMethod.call('getStocktakesReport', Template.instance().reportsCount.get());
  }
});

Template.stockReport.events({
  'click #load-stocktake-report': function (event, tmpl) {
    tmpl.reportsCount.set(tmpl.reportsCount.get() + 1);
  }
});