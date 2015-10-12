Template.profileImage.events({
  'click #uploadImage': function(event) {
    event.preventDefault();
    filepicker.pickAndStore(
      {mimetype:"image/*", services: ['COMPUTER']}, 
      {},
      function(InkBlobs){
        var doc = (InkBlobs);
        if(doc) {
          var url = doc[0].url;
          Meteor.call("editBasicDetails", Session.get("profileUser"), {"profileImage": url}, function(err) {
            if(err) {
              HospoHero.error(err);
            }
          });
        }
      }
    );
  },

  'mouseenter .profile-picture-div': function(event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').show();
  },

  'mouseleave .profile-picture-div': function(event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').hide();
  }
});