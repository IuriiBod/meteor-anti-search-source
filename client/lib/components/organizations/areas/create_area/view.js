Template.createArea.events({
  'change input[type="radio"]': function(e, tpl) {
    tpl.$("#disabled").parent().toggleClass("btn-danger").toggleClass("btn-default");
    tpl.$("#enabled").parent().toggleClass("btn-default").toggleClass("btn-info");
  },
  'submit form': function(e, tpl) {
    e.preventDefault();
    var name = e.target.name.value;
    var locationId = e.target.locationId.value;

    // Find locations with the same name
    var count = Areas.find({locationId: locationId, name: name}).count();

    if(count > 0) {
      alert("The area with name "+name+" already exists!");
      return false;
    }

    var status = e.target.status.value;

    var doc = {
      name: name,
      status: status,
      locationId: locationId,
      organizationId: Session.get('organizationId')
    };
    Meteor.call("createArea", doc, function (err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
    e.target.reset();
    $("#createArea").removeClass("show");
  },
  'click .close-flyout': function() {
    $("#createArea").removeClass("show");
  }
});