var component = FlowComponents.define("composeMail", function (props) {
  this.set('initialHtml', props.initialHtml);
  var supplier = Suppliers.findOne({_id: props.supplier});
  if (supplier) {
    this.set('supplier', supplier);
  }
});

component.state.subject = function () {
  return "Order from Hospo Hero";
};

component.state.replyToEmail = function () {
  var user = Meteor.user();
  if (user && user.emails) {
    this.set("username", user.username);

    var role = "Worker";
    if (HospoHero.isManager()) {
      role = "Manager";
    }
    this.set("userType", role);
    return user.emails[0].address;
  }
};
