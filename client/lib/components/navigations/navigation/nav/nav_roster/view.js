Template.navRoster.helpers({
  year: Router.current().params.year,
  week: Router.current().params.week,
  today: moment(new Date()).format("YYYY-MM-DD")
});