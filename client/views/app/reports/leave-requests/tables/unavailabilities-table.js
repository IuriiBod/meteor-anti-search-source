Template.unavailabilitiesTable.onCreated(function () {
    let self = this;
    this.unavailabilities = new ReactiveArray();
    this._itemPerPage = 5;
    this._page = new Blaze.ReactiveVar(1);
    const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    this.autorun(() => {
        this.subscribe('areaUnavailabilitiesList',currentAreaId,
            { limit: this._page.get() * this._itemPerPage }, ()=> {
                self.unavailabilities.clear();
                let query = {};
                query['unavailabilities.0'] = {'$exists':true};
                Meteor.users.find(query).forEach(function (user) {
                    _.each(user.unavailabilities,function (unavailabilitie,i) {
                        if(i< (self._itemPerPage * self._page.get())) {
                            unavailabilitie.userId = user._id;
                            self.unavailabilities.push(unavailabilitie);
                        }
                    });
                });
            });
    });
});

Template.unavailabilitiesTable.helpers({
    unavailabilitiesItems:function () {
        return Template.instance().unavailabilities.list();
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
        let itemPerPage = Template.instance()._itemPerPage;
        let page = Template.instance()._page.get();
        let list = Template.instance().unavailabilities.list();
        return  list.length / (page * itemPerPage) >= 1;
    }
});
Template.unavailabilitiesTable.events({
    'click [data-action="load-more"]': (e,t) => {
        e.preventDefault();
        var page =  t._page.get();
        t._page.set(page + 1);
    }
});
