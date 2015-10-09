Template.clockItem.events({
  'click .clockIn': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("div.widget").attr("data-id");
    if(id) {
      Meteor.call("clockIn", id, function(err) {
        if(err) {
          HospoHero.error(err);
        }
      });
    }
  },

  'click .clockOut': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("div.widget").attr("data-id");
    if(id) {
      Meteor.call("clockOut", id, function(err) {
        if(err) {
          HospoHero.error(err);
        } else {
          $(".tip").show();
          Session.set("newlyEndedShift", id);
        }
      });
    }
  }
});