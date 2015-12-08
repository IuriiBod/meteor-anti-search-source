Template.searchUserInfo.helpers({
  'getProfilePhoto': function () {
    if (this.services && this.services.google && this.services.google.picture) {
      return this.services.google.picture;
    } else {
      return '/images/user-image.jpeg';
    }
  }
});