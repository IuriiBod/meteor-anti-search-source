Template.projectMember.onRendered(function () {
  const username = HospoHero.username(this.data.member);

  this.$('.remove-user').popover({
    content: `<button type="button" class="btn btn-danger btn-sm accept-remove">Remove ${username}</button>`,
    html: true,
    placement: 'bottom'
  });
});


Template.projectMember.helpers({
  allowRemove () {
    return Template.parentData(2).allowRemove;
  }
});


Template.projectMember.events({
  'click .accept-remove' (event, tmpl) {
    let onMemberRemove = Template.parentData(2).onMemberRemove;

    if (_.isFunction(onMemberRemove)) {
      onMemberRemove(tmpl.data.member);
    }
  }
});