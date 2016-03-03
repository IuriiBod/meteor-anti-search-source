Template.attachRelatedItem.onCreated(function () {
  this.subscribe('areaMenuItems', HospoHero.getCurrentAreaId(), 'all');
  this.subscribe('jobItems', false, HospoHero.getCurrentAreaId(), 'active');
  this.subscribe('allSuppliers', HospoHero.getCurrentAreaId());

  this.types = {
    'Menu item': {
      collection: 'menuItems',
      nameField: 'name',
      route: 'menuItemDetail',
      idParameter: '_id'
    },
    'Job item': {
      collection: 'jobItems',
      nameField: 'name',
      route: 'jobItemDetailed',
      idParameter: '_id'
    },
    'Supplier': {
      collection: 'suppliers',
      nameField: 'name',
      route: 'supplierProfile',
      idParameter: '_id'
    }
  };

  this.type = new ReactiveVar('Menu item');
  this.relatedItem = false;
});


Template.attachRelatedItem.helpers({
  types () {
    return _.keys(Template.instance().types);
  },

  items () {
    let tmpl = Template.instance();
    let type = tmpl.type.get();
    let itemSettings = tmpl.types[type];

    let items = Mongo.Collection.get(itemSettings.collection).find({}).map((item) => {
      return {
        id: item._id,
        name: item[itemSettings.nameField]
      };
    });

    // set the default value of reference object
    if (items.length) {
      tmpl.relatedItem = items[0];
    }

    return items;
  }
});


Template.attachRelatedItem.events({
  'change #type' (event, tmpl) {
    tmpl.type.set(event.target.value);
  },

  'change #reference' (event, tmpl) {
    // sorry, Taras
    let $select = $(event.target);
    let id = $select.val();
    let name = $select.find('option:selected').text();
    tmpl.relatedItem = {
      id: id,
      name: name
    };
  },

  'submit form' (event, tmpl) {
    event.preventDefault();

    let relatedItem = tmpl.relatedItem;
    let type = tmpl.type.get();
    let itemSettings = tmpl.types[type];

    let url = Router.url(itemSettings.route, {
      [itemSettings.idParameter]: relatedItem.id
    });

    let relatedItemDocument = {
      name: relatedItem.name,
      referenceId: tmpl.data.referenceId,
      url: url,
      type: type
    };

    Meteor.call('createRelatedItem', relatedItemDocument, HospoHero.handleMethodResult());
  }
});