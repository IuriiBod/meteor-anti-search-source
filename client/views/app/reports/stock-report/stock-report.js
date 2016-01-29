Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();
});

Template.stockReport.helpers({
  reports: function () {
    return Template.instance().reports.list();
  }
});

Template.stockReport.events({
  'click #load-stocktake-report': function (event, tmpl) {
    Meteor.call('getNextStocktakeReport', (err, result) => {
      tmpl.reports.push(result);
    });
  }
});