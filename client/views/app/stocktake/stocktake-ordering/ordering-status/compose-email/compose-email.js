Template.composeStocktakeOrderingEmail.onCreated(function () {
  this.initialHtml = new ReactiveVar('');

  Meteor.call('renderOrderTemplate', this.data._id, HospoHero.handleMethodResult((text) => {
    this.initialHtml.set(text);
  }));
});


Template.composeStocktakeOrderingEmail.helpers({
  initialHtml: function () {
    return Template.instance().initialHtml.get()
  },

  supplier: function () {
    return Suppliers.findOne({_id: this.supplierId});
  },

  subject: function () {
    var location = Locations.findOne({_id: this.supplier.relations.locationId});
    var area = Areas.findOne({_id: this.supplier.relations.areaId});
    return "Order from " + location.name + ' ' + area.name;
  },

  replyToEmail: function () {
    var user = Meteor.user();
    return user.emails[0].address;
  }
});


Template.composeStocktakeOrderingEmail.events({
  'click .send-email-button': function (event, tmpl) {
    event.preventDefault();

    let mailInfo = {
      mailTo: tmpl.$('.emailTo').val(),
      subject: tmpl.$('.emailSubject').val(),
      text: tmpl.$('.summernote').data('summernote').code()
    };

    Meteor.call('orderThroughEmail', tmpl.data._id, mailInfo, HospoHero.handleMethodResult(function () {
      ModalManager.getInstanceByElement(event.target).close();
    }));
  }
});

