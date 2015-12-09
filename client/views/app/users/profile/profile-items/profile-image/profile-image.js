Template.profileImage.helpers({
  ifMe: function() {
    var userId = Template.instance().data.user._id;
    return userId === Meteor.userId();
  },
  image: function() {
    var user = Template.instance().data.user;
    if (user) {
      if (user.profile.image) {
        return user.profile.image;
      } else if (user.services && user.services.google) {
        return user.services.google.picture;
      } else {
        return "/images/user-image.jpeg";
      }
    }
  },
  imageExists: function() {
    var user = Template.instance().data.user;
    if (user) {
      if (user.profile.image) {
        return true;
      } else {
        return !!(user.services && user.services.google);
      }
    }
  }
});

Template.profileImage.events({
  'click #uploadImage': function (event) {
    event.preventDefault();
    filepicker.pickAndStore(
      {mimetype: "image/*", services: ['COMPUTER']},
      {},
      function (InkBlobs) {
        var doc = (InkBlobs);
        if (doc) {
          var url = doc[0].url;
          var userId = Template.instance().data.user._id;
          Meteor.call("editBasicDetails", userId, {"profileImage": url}, HospoHero.handleMethodResult());
        }
      }
    );
  },

  'mouseenter .profile-picture-div': function (event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').show();
  },

  'mouseleave .profile-picture-div': function (event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').hide();
  }
});