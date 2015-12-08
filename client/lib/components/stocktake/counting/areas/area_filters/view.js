Template.areaFilters.events({
  'click .addNewSpecialArea': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("thisGeneralArea", id);
    $("#addNewSpecialAreaModal").modal();
  }
});