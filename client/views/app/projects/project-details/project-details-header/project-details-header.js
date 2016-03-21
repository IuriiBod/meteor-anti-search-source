Template.projectDetailsHeader.onCreated(function () {
  this.showProjectsRemoveAlert = (warningMessage, onPromptResult) => {
    let options = {
      title: 'Warning',
      text: warningMessage,
      type: "warning",
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes, I understand the consequences',
      closeOnConfirm: true,
      closeOnCancel: true
    };
    let handleResult = (isConfirmed) => {
      onPromptResult(isConfirmed);
    };
    return sweetAlert(options, handleResult);
  };
});

Template.projectDetailsHeader.events({
  'click .remove-project': function (event, tmpl) {
    event.preventDefault();

    let message = `Removing project also removes tasks, comments, files and related items assigned to project\n
                   Are you sure, you want to remove project?`;

    tmpl.showProjectsRemoveAlert(message, (isConfirmed) => {
      if (isConfirmed) {
        Meteor.call('removeProject', tmpl.data.projectId, HospoHero.handleMethodResult((result) => {
          if (result) {
            Router.go('projectsList');
          }
        }));
      }
    })
  }
});