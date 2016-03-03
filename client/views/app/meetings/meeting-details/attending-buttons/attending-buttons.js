Template.attendingButtons.onCreated(function () {
  this.fields = ['accepted', 'maybeAccepted', 'rejected'];
});

Template.attendingButtons.helpers({
  attendingButtons () {
    return [
      {
        title: 'Yes',
        field: 'accepted',
        class: 'btn-primary'
      },
      {
        title: 'Maybe',
        field: 'maybeAccepted',
        class: 'btn-warning'
      },
      {
        title: 'No',
        field: 'rejected',
        class: 'btn-danger'
      }
    ];
  },

  isActiveButton () {
    let meeting = Template.parentData(1).meeting;
    return function () {
      return meeting[this.button.field].indexOf(Meteor.userId()) > -1;
    };
  },

  onButtonClick () {
    let tmpl = Template.instance();

    return function (selectedButton) {
      /**
       * Changes the array values
       * @param {Array} array - input array
       * @param {Boolean} isAddingNewValue - if true - adds the user ID to the array, else - removes
       * @returns {Array}
       */
      let changeArrayValue = (array, isAddingNewValue) => {
        let userId = Meteor.userId();
        if (isAddingNewValue) {
          array.push(userId);
        } else {
          array = _.without(array, userId);
        }
        return _.uniq(array);
      };

      let meeting = tmpl.data.meeting;
      tmpl.fields.forEach((field) => {
        meeting[field] = changeArrayValue(meeting[field], field === selectedButton);
      });

      Meteor.call('editMeeting', meeting, HospoHero.handleMethodResult());
    };
  }
});