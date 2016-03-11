Template.profileResignedDate.helpers({
    hasResignDate: function () {
        return !!this.profile.resignDate;
    },
    resignDate: function () {
        var resignDate = this.profile.resignDate;
        return resignDate ? moment(resignDate).format("MM/DD/YYYY") : null;
    },
    isMe: function (userId) {
        return Meteor.userId() && Meteor.userId() === userId;
    }
});

Template.profileResignedDate.events({
    'click #set-resign-date': function (e, tpl) {
        e.preventDefault();
        var id = Router.current().params._id;
        var val = tpl.$(".open-resigned-date-picker").val();

        if (!val) {
            tpl.$(".open-resigned-date-picker").focus().parent().addClass("has-error");
            return;
        } else {
            tpl.$(".open-resigned-date-picker").parent().addClass("has-success");
        }

        Meteor.call("resignDate", "set", id, val, HospoHero.handleMethodResult());
    },

    'click #update-resign-date': function (e, tpl) {
        e.preventDefault();
        var id = Router.current().params._id;
        var val = tpl.$(".open-resigned-date-picker").val();

        if (!val) {
            tpl.$(".open-resigned-date-picker")
                .focus().parent().removeClass("has-success").addClass("has-error");
            return;
        } else {
            tpl.$(".open-resigned-date-picker")
                .parent().removeClass("has-error").addClass("has-success");
        }

        Meteor.call("resignDate", "update", id, val, HospoHero.handleMethodResult(function () {
            tpl.$(".open-resigned-date-picker")
                .parent().removeClass("has-error").addClass("has-success");
        }));
    },

    'click #remove-resign-date': function (e) {
        e.preventDefault();
        var id = Router.current().params._id;
        Meteor.call("resignDate", "remove", id, '', HospoHero.handleMethodResult());
    }
});