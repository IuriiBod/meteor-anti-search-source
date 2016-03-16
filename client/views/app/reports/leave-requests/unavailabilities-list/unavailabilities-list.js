Template.unavailabilitiesList.onCreated(function () {
    this._page = new Blaze.ReactiveVar(1);
    this._query = { 'unavailabilities.0': {'$exists':true} };
    const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    this.autorun(() => {
        this.subscribe('areaUnavailabilitiesList',currentAreaId,
             this._page.get() * this.data.temPerPage);
    });
});

Template.unavailabilitiesList.helpers({
    users:function () {
        return Meteor.users.find(Template.instance()._query);
    },
    isHasMoreItems:  function(){
        let page = Template.instance()._page.get();
        return  Meteor.users.find(Template.instance()._query).count() /
            (page * this.itemPerPage) >= 1;
    }
});
Template.unavailabilitiesList.events({
    'click [data-action="load-more"]': (e,t) => {
        e.preventDefault();
        var page =  t._page.get();
        t._page.set(page + 1);
    }
});
