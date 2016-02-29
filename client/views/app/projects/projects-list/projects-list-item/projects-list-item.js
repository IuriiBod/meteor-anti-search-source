Template.projectsListItem.events({
  'click .project-list-item' (event, tmpl) {
    Router.go('projectDetails', {id: tmpl.data._id});
  }
});