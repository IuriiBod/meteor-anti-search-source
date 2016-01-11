Template.taskDescriptionAndReference.onCreated(function () {
  this.getReference = function () {
    if (Object.keys(this.data.reference).length) {
      var taskReference = this.data.reference;

      var references = {
        suppliers: {
          collection: Suppliers,
          icon: 'fa-user',
          route: 'supplierProfile'
        },
        menus: {
          collection: MenuItems,
          icon: 'fa-cutlery',
          route: 'menuItemDetail'
        },
        jobs: {
          collection: JobItems,
          icon: 'fa-spoon',
          route: 'jobItemDetailed'
        }
      };

      var reference = references[taskReference.type];
      var referenceItem = reference.collection.findOne({_id: taskReference.id});

      return {
        icon: reference.icon,
        name: referenceItem.name,
        route: Router.url(reference.route, {_id: taskReference.id})
      };
    } else {
      return false;
    }
  };

  this.reference = this.getReference();
});

Template.taskDescriptionAndReference.helpers({
  reference: function () {
    return Template.instance().reference;
  }
});