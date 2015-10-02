//-----------------SUPPLIERS LIST
Router.route('/suppliers', {
  name: "suppliersList",
  path: '/suppliers',
  template: "suppliersListMainView",
  waitOn: function() {},
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/supplier/profile/:_id', {
  name: "supplierProfile",
  path: "/supplier/profile/:_id",
  template: "supplierProfileMainView",
  waitOn: function() {
    return [
      subs.subscribe("supplierProfile", this.params._id),
      subs.subscribe("comments", this.params._id),
      subs.subscribe("allSuppliers")
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisSupplier", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});