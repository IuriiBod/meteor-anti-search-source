Template.createArea.events({
  'change input[type="radio"]': function(e, tpl) {
    tpl.$("#disabled").parent().toggleClass("btn-danger").toggleClass("btn-default");
    tpl.$("#enabled").parent().toggleClass("btn-default").toggleClass("btn-primary");
  },
  'submit form': function(e, tpl) {
    e.preventDefault();
    var name = e.target.name.value;
    var status = e.target.status.value;

    var doc = {
      name: name,
      status: status,
      locationId: Router.current().params.id
    }
    Meteor.call("createArea", doc, function (err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
    e.target.reset();
    $(".flyout-container").removeClass("show");
  }
})