Template.unavailabilitiesListItem.onCreated(function () {
    this.itemPerPage =  Router.current().data().itemPerPage;
    this._page = new Blaze.ReactiveVar(1);
});

Template.unavailabilitiesListItem.helpers({
    collapseSettings() {
        return {
            namespace: 'unavailabilities-list-item',
            uiStateId: 'unavailabilities-of-' + this._id,
            title: this.profile.firstname + ' ' + this.profile.lastname,
            contentPadding: '20px'
            };
    },
    unavailabilities(){
        let itemPerPage = Template.instance().itemPerPage;
        let page = Template.instance()._page.get();
        return this.unavailabilities.slice(0, itemPerPage * page);
    },
    isHasMoreItems:  function(){
        let page = Template.instance()._page.get();
        let itemPerPage = Template.instance().itemPerPage;
        return  this.unavailabilities.length / (page * itemPerPage) >= 1;
    }
});

Template.unavailabilitiesListItem.events({
    'click [data-action="load-more"]': (e,t) => {
        e.preventDefault();
        var page =  t._page.get();
        t._page.set(page + 1);
    }
});