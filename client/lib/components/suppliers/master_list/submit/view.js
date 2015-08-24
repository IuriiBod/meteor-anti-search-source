Template.newSupplier.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    var email = $(event.target).find('[name=email]').val();
    var phone = $(event.target).find('[name=phone]').val();
    Meteor.call("createSupplier", name, email, phone, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        $("#addNewSupplierModal").modal("hide");
      }
    });
  }
});