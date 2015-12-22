Template.composeMail.helpers({
  supplier: function() {
    return Suppliers.findOne({_id: this.supplier});
  },

  subject: function() {
    return "Order from Hospo Hero";
  },

  replyToEmail: function () {
    var user = Meteor.user();
    if (user && user.emails) {
      Template.instance().set("username", user.username);

      var role = "Worker";
      if (HospoHero.isManager()) {
        role = "Manager";
      }
      Template.instance().set("userType", role);
      return user.emails[0].address;
    }
  }
});

Template.composeMail.events({
  'click .sendEmail': function (event, tmpl) {
    event.preventDefault();
    var mailBody = $('.summernote').data('summernote').code();
    var title = $(".emailTitle").val();
    var address = $(".emailTo").val();
    var supplier = tmpl.data.supplier;
    var version = HospoHero.getParamsFromRoute(Router.current(), '_id');
    var deliveryDate = parseInt(moment().add(1, 'day').format('x'));
    var info = {
      "through": 'emailed',
      "details": address,
      "deliveryDate": deliveryDate,
      "to": address,
      "title": title,
      "emailText": mailBody
    };
    Meteor.call("generateReceipts", version, supplier, info, HospoHero.handleMethodResult());

    $("#composeMailModal").modal("hide");
  }
});