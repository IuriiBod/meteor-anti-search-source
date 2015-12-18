Template.invitationAcceptForm.onCreated(function () {
  this.set('invitation', this.data.invitation);
});

Template.invitationAcceptForm.helpers({
  fields: function () {
    var invitation = Template.instance().get('invitation');

    if (invitation) {
      return [
        {
          name: 'firstname',
          placeholder: 'Firstname',
          label: 'First Name',
          required: true,
          validation: {
            minLength: 3
          }
        },
        {
          name: 'lastname',
          placeholder: 'Lastname',
          label: 'Last Name',
          required: true,
          validation: {
            minLength: 3
          }
        },
        {
          name: 'username',
          placeholder: 'Username',
          label: 'Username',
          disabled: true,
          value: invitation.name,
          required: true,
          validation: {
            minLength: 3
          }
        },
        {
          type: 'email',
          name: 'email',
          placeholder: 'Email',
          label: 'Email',
          disabled: true,
          value: invitation.email,
          required: true,
          validation: {
            re: /.+@(.+){2,}\.(.+){2,}/,
            errors: {
              re: 'Invalid email'
            }
          }
        },
        {
          name: 'address',
          placeholder: 'Address',
          label: 'Address (Optional)'
        },
        {
          type: 'text',
          name: 'tel',
          placeholder: 'Tel',
          label: 'Phone number (Optional)'
        },
        {
          type: 'select',
          name: 'gender',
          label: 'Gender',
          value: 0,
          options: [
            {
              value: 'male',
              text: 'Male'
            },
            {
              value: 'female',
              text: 'Female'
            }
          ]
        },
        {
          type: 'password',
          name: 'pinCode',
          placeholder: '****',
          label: 'PIN code',
          required: true,
          validation: {
            re: /^\d{4}$/,
            errors: {
              re: 'Required four-digit PIN'
            }
          }
        },
        {
          type: 'password',
          name: 'password',
          label: 'Password',
          placeholder: 'Password',
          required: true,
          validation: {
            minLength: 6
          }
        }
      ];
    }
  },

  onFormSubmit: function () {
    var self = Template.instance();
    return function (response) {
      var invitationId = self.get('invitation')._id;
      Meteor.call('acceptInvitation', invitationId, response, HospoHero.handleMethodResult(function () {
        Router.go('signIn');
      }));
    };
  }
});