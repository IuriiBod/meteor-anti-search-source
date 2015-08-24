Template.basics.events({
 'click #uploadPriceList': function(event) {
  event.preventDefault();
  filepicker.pickAndStore(
    {mimetype:"image/*", services: ['COMPUTER']}, 
    {},
    function(InkBlobs) {
      var doc = (InkBlobs);
      if(doc) {
        var url = doc[0].url;
        $(".uploadedPriceList").removeClass("hide");
        $("#uploadedImageUrl").attr("src", url);
        Meteor.call("updateSupplier", Session.get("thisSupplier"), {"priceList": url}, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
  });
 }
});