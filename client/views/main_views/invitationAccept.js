Template.invitationAccept.helpers({
  invitation: function() {
    var invitation = Invitations.findOne();
    if(!invitation || invitation.accepted) {
      Router.go('/');
    } else {
      return invitation;
    }
  }
});

// TODO: !!!CHANGE THIS!!!
Template.invitationAccept.events({
  'submit form': function (e) {
    e.preventDefault();
    var invitationId = Router.current().params._id;
    var user = {
      profile: {}
    };

    var username = e.target.username.value;
    if(!username.trim()) {
      return $(e.target.username).siblings('.help-block').text('Required Field').removeClass('hide').parent().addClass('has-error').removeClass('has-success');
    } else if(username.length < 3) {
      return $(e.target.username).siblings('.help-block').text('Minimum required length: 3').removeClass('hide').parent().addClass('has-error').removeClass('has-success');
    } else {
      $(e.target.username).siblings('.help-block').text('').addClass('hide').parent().removeClass('has-error').addClass('has-success');
      user.username = username;
    }

    var email = e.target.email.value;
    if(!email.trim()) {
      return $(e.target.email).siblings('.help-block').text('Required field').removeClass('hide').parent().addClass('has-error').removeClass('has-success');
    } else if(email.replace(/.+@(.+){2,}\.(.+){2,}/, '') != '') {
      return $(e.target.email).siblings('.help-block').text('Invalid email').removeClass('hide').parent().addClass('has-error').removeClass('has-success');
    } else {
      $(e.target.email).siblings('.help-block').text('').addClass('hide').parent().removeClass('has-error').addClass('has-success');
      user.email = email;
    }

    if(e.target.address.value) {
      user.profile.address = e.target.address.value;
      $(e.target.address).parent().addClass('has-success');
    }

    if(e.target.tel.value) {
      user.profile.tel = e.target.tel.value;
      $(e.target.tel).parent().addClass('has-success');
    }

    user.profile.gender = e.target.gender.value;
    $(e.target.gender).parent().addClass('has-success');

    var pinCode = e.target.pinCode;
    if(!pinCode.value.trim()) {
      return $(pinCode).siblings('.help-block').text('Required field').removeClass('hide').parent().addClass('has-error').removeClass('has-success');
    } else if(pinCode.value.replace(/^\d{4}$/, '') != '') {
      return $(pinCode).siblings('.help-block').text('Required four-digit PIN.').removeClass('hide').parent().addClass('has-error').removeClass('has-success');
    } else {
      $(pinCode).siblings('.help-block').text('').addClass('hide').parent().removeClass('has-error').addClass('has-success');
      user.profile.pinCode = pinCode.value;
    }

    var password = e.target.password;
    if(!password.value.trim()) {
      return $(password).siblings('.help-block').text('Required field').removeClass('hide').parent().addClass('has-error').removeClass('has-success');
    } else if(password.value.length < 8) {
      return $(password).siblings('.help-block').text('Minimum required length: 8').removeClass('hide').parent().addClass('has-error').removeClass('has-success');
    } else {
      $(password).siblings('.help-block').text('').addClass('hide').parent().removeClass('has-error').addClass('has-success');
      user.password = password.value;
    }

    console.log('ACCEPT! IID: ', invitationId, " USER: ", user);


    Meteor.call('acceptInvitation', invitationId, user, function(err) {
      if(err) {
        HospoHero.alert(err);
      }
    });
  }
});