Template.invitationAccept.onCreated(function() {
  var invitationId = Router.current().params._id;
  var invitation = Invitations.findOne({_id: invitationId});

  if(!invitation || invitation.accepted) {
    Router.go('home');
  }

  var invitationFormParams = {
    name: 'invitationForm',
    id: 'invitationForm',
    fields: {
      firstname: {
        placeholder: 'Firstname',
        label: 'First Name',
        validation: {
          required: true,
          minLength: 3
        }
      },
      lastname: {
        placeholder: 'Lastname',
        label: 'Last Name',
        validation: {
          required: true,
          minLength: 3
        }
      },
      username: {
        placeholder: 'Username',
        label: 'Username',
        disabled: true,
        value: invitation.name,
        validation: {
          required: true,
          minLength: 3
        }
      },
      email: {
        placeholder: 'Email',
        label: 'Email',
        disabled: true,
        value: invitation.email,
        validation: {
          required: true,
          re: /.+@(.+){2,}\.(.+){2,}/
        }
      },
      address: {
        placeholder: 'Address',
        label: 'Address (Optional)'
      },
      tel: {
        placeholder: 'Tel',
        label: 'Phone number (Optional)'
      },
      gender: {
        type: 'select',
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
      pinCode: {
        type: 'password',
        placeholder: '****',
        label: 'PIN code',
        validation: {
          required: true,
          re: /^\d{4}$/,
          reError: 'Required four-digit PIN.'
        }
      },
      password: {
        type: 'password',
        label: 'Password',
        placeholder: 'Password',
        validation: {
          required: true,
          minLength: 6
        }
      },
      submitInvitation: {
        type: 'submit',
        value: 'Register'
      }
    }
  };

  this._customForm = new CustomForm(invitationFormParams);
});

Template.invitationAccept.helpers({
  invitationForm: function() {
    var tpl = Template.instance();
    return tpl._customForm.getForm();
  }
});

Template.invitationAccept.events({
  'submit form#invitationForm': function(e, tpl) {
    e.preventDefault();
    var invitationId = Router.current().params._id;
    var validationResult = tpl._customForm.validate(tpl);

    if(validationResult) {
      var nonProfileItems = ['username', 'email', 'password'];
      var user = {
        profile: {}
      };

      for(var key in validationResult) {
        if(validationResult.hasOwnProperty(key)) {
          if(nonProfileItems.indexOf(key) == -1) {
            user.profile[key] = validationResult[key];
          } else {
            user[key] = validationResult[key];
          }
        }
      }

      Meteor.call('acceptInvitation', invitationId, user, HospoHero.handleMethodResult(function() {
        Router.go('home');
      }));
    }
  }
});