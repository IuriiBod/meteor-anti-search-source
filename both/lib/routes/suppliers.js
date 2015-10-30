//-----------------SUPPLIERS LIST
Router.route('/suppliers', {
  name: "suppliersList",
  path: '/suppliers',
  template: "suppliersListMainView",
  waitOn: function() {
    return [
      Meteor.subscribe("allSuppliers"),
    ];
  },
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
      Meteor.subscribe("supplierProfile", this.params._id),
      Meteor.subscribe("comments", this.params._id),
      Meteor.subscribe("usersList")
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