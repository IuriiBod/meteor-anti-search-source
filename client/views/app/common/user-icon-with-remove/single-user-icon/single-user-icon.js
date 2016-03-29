Template.singleUserIcon.onRendered(function () {
  const username = HospoHero.username(this.data.member);

  this.$('.remove-user').popover({
    content: `<button type="button" class="btn btn-danger btn-sm accept-remove">Remove ${username}</button>`,
    html: true,
    placement: 'bottom'
  });
});


Template.singleUserIcon.helpers({
  allowRemove () {
    return this.allowRemove;
  }
});


Template.singleUserIcon.events({
  'click .accept-remove' (event, tmpl) {
    let onMemberRemove = tmpl.data.onMemberRemove;

    if (_.isFunction(onMemberRemove)) {
      onMemberRemove(tmpl.data.member);
    }
  }
});