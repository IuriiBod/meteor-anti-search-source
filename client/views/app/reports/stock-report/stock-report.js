Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();
  Meteor.call('initStocktakeReportGenerators');
});

Template.stockReport.helpers({
  reports: function () {
    return Template.instance().reports.list();
  }
});

Template.stockReport.events({
  'click #load-stocktake-report': function (event, tmpl) {
    Meteor.call('getNextStocktakeReport', (err, result) => {
      if (!result.done) {
        tmpl.reports.push(result.value);
      }
    });
  }
});
