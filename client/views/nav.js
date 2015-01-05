Template.layout.events({
  'click #addJob': function(e, instance) {
    $("#submitJobModal").modal("show");
  },

  'click #addShift': function(e, instance) {
    $("#submitShiftModal").modal("show");
  },

  'click #adminPanel': function(e, instance) {
    e.preventDefault();
    Router.go("admin");
  },
  
  'click #week': function(event) {
    event.preventDefault();
    Router.go("weekly", {"_date": new Date().toISOString()});
  }
});