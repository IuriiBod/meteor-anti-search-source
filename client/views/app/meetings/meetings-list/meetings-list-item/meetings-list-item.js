Template.meetingsListItem.events({
  'click .meeting-list-item' (event, tmpl) {
    Router.go('meetingDetails', {id: tmpl.data._id});
  }
});