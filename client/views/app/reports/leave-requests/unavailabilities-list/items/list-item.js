Template.unavailabilitiesListItem.onCreated(function () {
  this.itemPerPage = Router.current().data().itemPerPage;
  this.page = new Blaze.ReactiveVar(1);
});

Template.unavailabilitiesListItem.helpers({
  unavailabilities () {
    let itemPerPage = Template.instance().itemPerPage;
    let page = Template.instance().page.get();
    return this.unavailabilities.slice(0, itemPerPage * page);
  },
  isHasMoreItems () {
    let page = Template.instance().page.get();
    let itemPerPage = Template.instance().itemPerPage;
    return this.unavailabilities.length / (page * itemPerPage) >= 1;
  }
});

Template.unavailabilitiesListItem.events({
  'click [data-action="load-more"]': (event, tmpl) => {
    event.preventDefault();
    event.stopPropagation();

    var page = tmpl.page.get();
    tmpl.page.set(page + 1);
  }
});