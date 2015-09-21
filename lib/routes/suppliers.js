//-----------------SUPPLIERS LIST
Router.route('/suppliers', {
  name: "suppliersList",
  path: '/suppliers',
  template: "suppliersListMainView",
  waitOn: function() {
    var cursors = [];

    return cursors;
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
    var cursors = [];
    cursors.push(subs.subscribe("supplierProfile", this.params._id));
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("allSuppliers"));
    return cursors;
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