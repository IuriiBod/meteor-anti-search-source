Template.taskDetails.helpers({
  referenceObject: function () {
    var taskReference = this.reference;

    if (Object.keys(taskReference).length) {
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
  },

  commentsCount: function () {
    return Comments.find({
      reference: this._id
    }).count();
  }
});