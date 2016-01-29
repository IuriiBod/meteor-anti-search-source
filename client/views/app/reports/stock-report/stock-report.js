Template.stockReport.onCreated(function () {
  this.reports = new ReactiveArray();
  this.fromTheBeginning = true;
});

Template.stockReport.helpers({
  reports: function () {
    return Template.instance().reports.list();
  }
});

Template.stockReport.events({
  'click #load-stocktake-report': function (event, tmpl) {
    Meteor.call('getNextStocktakeReport', tmpl.fromTheBeginning, (err, result) => {
      console.log(tmpl.fromTheBeginning);
      if (!result.done) {
        tmpl.reports.push(result.value);
        tmpl.fromTheBeginning = undefined; // Needed to reset the generator
      }
    });
  }
});
