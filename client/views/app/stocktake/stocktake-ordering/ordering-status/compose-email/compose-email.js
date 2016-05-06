Template.composeStocktakeOrderingEmail.onCreated(function () {
  this.initialHtml = new ReactiveVar('');

  Meteor.call('renderOrderTemplate', this.data._id, HospoHero.handleMethodResult((text) => {
    this.initialHtml.set(text);
  }));
});


Template.composeStocktakeOrderingEmail.helpers({
  initialHtml: function () {
    return Template.instance().initialHtml.get();
  },

  supplier: function () {
    return Suppliers.findOne({_id: this.supplierId});
  },

  subject: function (supplier) {
    let location = Locations.findOne({_id: supplier.relations.locationId});
    let area = Areas.findOne({_id: supplier.relations.areaId});
    return "Order from " + location.name + ' ' + area.name;
  },

  replyToEmail: function () {
    let user = Meteor.user();
    return user.emails[0].address;
  },
  usersEmail: function () {
    let user = Meteor.user();
    return user.emails[0].address;
  }
});


Template.composeStocktakeOrderingEmail.events({
  'click .send-email-button': function (event, tmpl) {
    event.preventDefault();
    let mailTo = tmpl.$('#emailTo').val();
    let user = Meteor.user();
    let usersEmail = HospoHero.utils.getNestedProperty(user, 'emails.0.address', false);
    let duplicate = tmpl.$('#duplicate').prop('checked');


    let mailInfo = {
      mailTo: mailTo,
      mailToCopy: usersEmail,
      subject: tmpl.$('#emailSubject').val(),
      text: tmpl.$('.summernote').data('summernote').code()
    };

    Meteor.call('orderThroughEmail', tmpl.data._id, mailInfo, HospoHero.handleMethodResult(function () {
      ModalManager.getInstanceByElement(event.target).close();
    }));
  }
});

