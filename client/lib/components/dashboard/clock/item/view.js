Template.clockItem.events({
  'click .clockIn': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("div.widget").attr("data-id");
    if(id) {
      Meteor.call("clockIn", id, HospoHero.handleMethodResult());
    }
  },

  'click .clockOut': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("div.widget").attr("data-id");
    if(id) {
      Meteor.call("clockOut", id, HospoHero.handleMethodResult(function() {
        $(".tip").show();
        Session.set("newlyEndedShift", id);
      }));
    }
  }
});