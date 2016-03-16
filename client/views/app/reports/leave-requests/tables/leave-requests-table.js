Template.leaveRequestsTable.onCreated(function () {
    this._page = new Blaze.ReactiveVar(1);
    const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    this.autorun(() => {
        this.subscribe('leaveRequests',currentAreaId,
            this._page.get() * this.data.itemPerPage);
    });
});

Template.leaveRequestsTable.helpers({
    leaveRequestsItems:function () {
        return LeaveRequests.find();
    },
    date: function() {
        return arguments[0].toLocaleDateString();
    },
    username: function() {
        var user = Meteor.users.findOne({_id:arguments[0]});
        return user && user.profile ?
            user.profile.firstname + ' ' + user.profile.lastname :
            '-';
    },
    comment: function() {
        return this.comment !== '' ? this.comment : '-' ;
    },
    isHasMoreItems:  function(){
        let page = Template.instance()._page.get();
        return  LeaveRequests.find().count() / (page * this.itemPerPage) >= 1;
    }
});
Template.leaveRequestsTable.events({
    'click [data-action="load-more"]': (e,t) => {
        e.preventDefault();
        var page =  t._page.get();
        t._page.set(page + 1);
    }
});
