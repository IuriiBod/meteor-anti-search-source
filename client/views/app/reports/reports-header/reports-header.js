Template.reportsHeader.onCreated(function () {
  this.set('currentDate', HospoHero.getParamsFromRoute('date'));
});

Template.reportsHeader.helpers({
  onDateChanged: function () {
    return function (weekDate) {
      var routeName = Router.current().route.getName();
      Router.go(routeName, {
        date: weekDate
      });
    };
  }
});