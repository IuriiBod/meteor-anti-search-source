Template.userIconWithRemove.helpers({
  onMemberRemove () {
    let tmpl = Template.parentData(1);
    return tmpl.onMemberRemove;
  }
});