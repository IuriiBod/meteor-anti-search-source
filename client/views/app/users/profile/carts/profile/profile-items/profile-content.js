Template.profileContent.helpers({
    //permitted for profile owner and admins
    isEditPermitted: function () {
        return HospoHero.security.hasPermissionInAreaTo("edit user's payrate") ||
            Meteor.userId() && Meteor.userId() === this._id;
    },
    firstName: function () {
        if (this && this.profile && this.profile.firstname) {
            return this.profile.firstname;
        } else {
            return "";
        }
    },
    lastName: function () {
        if (this && this.profile && this.profile.lastname) {
            return this.profile.lastname;
        } else {
            return "";
        }
    },
    email: function () {
        if (this && this.emails) {
            return this.emails[0].address;
        }
    }
});

Template.profile.onRendered(function () {
    makeInputsEditable();
});
function makeInputsEditable() {
    $('#firstname').editable({
        type: 'text',
        title: 'Edit first name',
        showbuttons: true,
        mode: 'inline',
        placeholder: "Enter first name here",
        success: function (response, newValue) {
            var self = this;
            if (newValue) {
                var id = $(self).attr("data-id");
                var editDetail = {"firstname": newValue.trim()};
                Meteor.call("editBasicDetails", id, editDetail, HospoHero.handleMethodResult());
            }
        },
        display: false
    });

    $('#lastname').editable({
        type: 'text',
        title: 'Edit last name',
        showbuttons: true,
        mode: 'inline',
        placeholder: "Enter last name here",
        success: function (response, newValue) {
            var self = this;
            if (newValue) {
                var id = $(self).attr("data-id");
                var editDetail = {"lastname": newValue.trim()};
                Meteor.call("editBasicDetails", id, editDetail, HospoHero.handleMethodResult());
            }
        },
        display: false
    });

    $('#phone').editable({
        type: 'text',
        title: 'Edit Phone Number',
        showbuttons: true,
        mode: 'inline',
        emptytext: 'Empty',
        success: function (response, newValue) {
            var self = this;
            if (newValue) {
                var id = $(self).attr("data-id");
                var editDetail = {"phone": newValue};
                Meteor.call("editBasicDetails", id, editDetail, HospoHero.handleMethodResult());
            }
        },
        display: false
    });

    $('#email').editable({
        type: 'text',
        title: 'Edit Email Address',
        showbuttons: true,
        mode: 'inline',
        emptytext: 'Empty',
        success: function (response, newValue) {
            var self = this;
            if (newValue) {
                var id = $(self).attr("data-id");
                var editDetail = {"email": newValue};
                Meteor.call("editBasicDetails", id, editDetail, HospoHero.handleMethodResult());
            }
        },
        display: false
    });
}