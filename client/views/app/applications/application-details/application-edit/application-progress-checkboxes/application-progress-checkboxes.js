Template.applicationProgressCheckboxes.helpers({
  isItemChecked (status) {
    return this.checked.indexOf(status) > -1;
  },

  onCheckboxChange () {
    let applicationEditData = Template.parentData(1);

    return (status) => {
      Meteor.call('updateApplicationStatus', applicationEditData.application._id, status);
    };
  }
});

Template.applicationProgressCheckboxes.events({
  'click .create-interview': function (event) {
    event.preventDefault();
    let applicationEditData = Template.parentData(1);
    createInterview(applicationEditData.application);
  },

  'click .invite-user': function (event) {
    event.preventDefault();
    let applicationEditData = Template.parentData(1);

    inviteUser(applicationEditData.application);
  },

  'click .send-auto-email': function (event) {
    event.preventDefault();
    let applicationEditData = Template.parentData(1);
    sendRejectApplicationEmail(applicationEditData.application);
  }
});

function createInterview(application) {
  FlyoutManager.open('timeSelectFlyout', {
    onInterviewSubmit (startTime, endTime) {
      let interview = {
        applicationId: application._id,
        startTime: startTime,
        endTime: endTime,
        interviewee: application.details.name,
        organizationId: application.organizationId
      };

      Meteor.call('crateInterview', interview, HospoHero.handleMethodResult(() => {
        HospoHero.success('Interview created!');
      }));
    }
  });
}

function inviteUser(application) {
  let workerRole = Roles.getRoleByName(Roles.WORKER_ROLE_NAME);
  let areaId = HospoHero.getCurrentAreaId();

  let userToInvite = {
    name: application.details.name,
    email: application.details.email,
    areaId: areaId,
    roleId: workerRole._id
  };

  Meteor.call('inviteNewUserToArea', userToInvite, (err) => {
    if (err) {
      HospoHero.error('Error while invite user!');
    } else {
      Meteor.call('closeApplication', application._id, 'hired', HospoHero.handleMethodResult(() => {
        HospoHero.success('User invited');
      }));
    }
  });
}

function sendRejectApplicationEmail(application) {
  Meteor.call('sendRejectApplicationEmail', application, HospoHero.handleMethodResult());
}