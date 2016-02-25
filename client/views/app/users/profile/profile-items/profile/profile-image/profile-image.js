Template.profileImage.helpers({
  isMe: function () {
    return Meteor.userId() && Meteor.userId() === this._id;
  },

  image: function () {
    if (this) {
      if (this.profile.image) {
        return this.profile.image;
      } else if (this.services && this.services.google) {
        return this.services.google.picture;
      } else {
        return "/images/user-image.jpeg";
      }
    }
  },

  imageExists: function () {
    if (this) {
      if (this.profile.image) {
        return true;
      } else {
        return !!(this.services && this.services.google);
      }
    }
  }
});

Template.profileImage.events({
  'click #uploadImage': function (event, tmpl) {
    event.preventDefault();
    filepicker.pickAndStore(
      {mimetype: "image/*", services: ['COMPUTER']},
      {},
      function (InkBlobs) {
        var doc = (InkBlobs);
        if (doc) {
          var url = doc[0].url;
          var userId = tmpl.data._id;
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