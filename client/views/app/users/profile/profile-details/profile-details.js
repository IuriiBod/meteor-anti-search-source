Template.profileDetails.helpers({
  lastLoginDate: function () {
    return this.lastLoginDate &&
      moment.duration(moment().diff(this.lastLoginDate)).humanize() || 'never';
  }
});