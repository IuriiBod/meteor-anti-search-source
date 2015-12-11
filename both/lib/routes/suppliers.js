//-----------------SUPPLIERS LIST
Router.route('/suppliers', {
  name: "suppliersList",
  path: '/suppliers',
  template: "suppliersListMainView",
  waitOn: function () {
    return Meteor.subscribe('allSuppliers', HospoHero.getCurrentAreaId(Meteor.userId()));
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go("/");
    }
  }
});

Router.route('/supplier/profile/:_id', {
  name: "supplierProfile",
  path: "/supplier/profile/:_id",
  template: "supplierProfileMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe("supplierProfile", this.params._id),
      Meteor.subscribe('comments', this.params._id, currentAreaId),
      Meteor.subscribe('usersList', currentAreaId)
    ];
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisSupplier", this.params._id);
  }
});