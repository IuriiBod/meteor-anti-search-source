var component = FlowComponents.define("teamHours", function (props) {
  this.onRendered(this.onListRendered);
  this.weekDate = HospoHero.misc.getWeekDateFromRoute(Router.current());
  this.set('tableViewMode', 'shifts');
});

component.state.weekDays = function () {
  return HospoHero.dateUtils.getWeekDays(this.weekDate);
};

component.state.users = function () {
  return Meteor.users.find();
};

component.action.changeTableViewMode = function (newMode) {
  this.set('tableViewMode', newMode);
};

component.prototype.onListRendered = function () {
  $.fn.editable.defaults.mode = 'inline';
  $.fn.editable.defaults.showbuttons = false;

  $('.team-hours-table').dataTable({
    responsive: true,
    "dom": 'T<"clear">lfrtip',
    "tableTools": {
      "sSwfPath": "/swf/copy_csv_xls_pdf.swf"
    }
  });
};


