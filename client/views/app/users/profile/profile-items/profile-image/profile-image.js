Template.profileImage.onCreated(function() {
  var id = this.data.id;
  var user = Meteor.users.findOne({_id: id});
  this.set('user', user);
});

Template.profileImage.helpers({
  ifMe: function() {
    return Session.get("profileUser") == Meteor.userId();
  },
  image: function() {
    var user = Template.instance().get('user');
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
    var user = Template.instance().get('user');
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
          Meteor.call("editBasicDetails", Session.get("profileUser"), {"profileImage": url}, HospoHero.handleMethodResult());
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