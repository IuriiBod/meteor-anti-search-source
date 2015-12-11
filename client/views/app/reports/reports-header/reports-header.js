Template.reportsHeader.onCreated(function () {
  this.set('currentDate', HospoHero.misc.getWeekDateFromRoute(Router.current()));
});

Template.reportsHeader.helpers({
  onDateChanged: function () {
    return function (weekDate) {
      var routeName = Router.current().route.getName();
      Router.go(routeName, weekDate);
    };
  }
});