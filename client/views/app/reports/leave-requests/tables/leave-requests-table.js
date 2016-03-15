Template.leaveRequestsTable.onCreated(function () {
    this._itemPerPage = 5;
    this._page = new Blaze.ReactiveVar(1);
    const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    this.autorun(() => {
        this.subscribe('leaveRequests',currentAreaId,
            { limit: this._page.get() * this._itemPerPage } );
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
            'undefined user name';
    },
    isHasMoreItems:  function(){
        let itemPerPage = Template.instance()._itemPerPage;
        let page = Template.instance()._page.get();
        return  LeaveRequests.find().count() / (page * itemPerPage) >= 1;
    }
});
Template.leaveRequestsTable.events({
    'click [data-action="load-more"]': (e,t) => {
        e.preventDefault();
        var page =  t._page.get();
        t._page.set(page + 1);
    }
});
