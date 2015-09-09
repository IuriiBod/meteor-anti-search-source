Template.createLocation.events({
  'change input[type="radio"]': function(e, tpl) {
    tpl.$("#disabled").parent().toggleClass("btn-danger").toggleClass("btn-default");
    tpl.$("#enabled").parent().toggleClass("btn-default").toggleClass("btn-info");
  },
  'submit form': function(e, tpl) {
    e.preventDefault();
    var name = e.target.name.value;
    var orgId = Session.get("organizationId");

    // Find locations with the same name
    var count = Locations.find({organizationId: orgId, name: name}).count();

    if(count > 0) {
      alert("The location with name "+name+" already exists!");
      return false;
    }

    var status = e.target.status.value;
    var address = e.target.address.value;
    var timezone = e.target.timezone.value;
    var openingTime = e.target.openingHour.value+":"+e.target.openingMinutes.value;
    var closingTime = e.target.closingHour.value+":"+e.target.closingMinutes.value;

    var doc = {
      name: name,
      address: address,
      timezone: timezone,
      openingTime: openingTime,
      closingTime: closingTime,
      status: status,
      organizationId: orgId
    }
    Meteor.call("createLocation", doc, function (err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
    e.target.reset();
    $("#createLocation").removeClass("show");
  },

  'click .close-flyout': function() {
    $("#createLocation").removeClass("show");
  }
})