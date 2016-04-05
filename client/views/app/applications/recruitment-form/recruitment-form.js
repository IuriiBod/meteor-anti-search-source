Template.recruitmentForm.onCreated(function () {
  this.files = new ReactiveArray([]);
});

Template.recruitmentForm.onRendered(function () {
  this.$('.recruitment-form .dateOfBirth').datepicker({});
});

Template.recruitmentForm.helpers({
  isHasPositions(){
    return Positions.findOne();
  },
  files(){
    return Template.instance().files;
  },
  organizationName () {
    return this.organization.name;
  }
});

Template.recruitmentForm.events({
  'submit form'(event, tmpl){
    event.preventDefault();
    let details = getDetailsData(tmpl);
    let positionIds = getPositionsData(tmpl);
    let captchaUrl = $('#g-recaptcha-response').val();

    if (!positionIds) {
      HospoHero.error('Please Select some position.');
      return;
    }

    Meteor.call('addApplication', tmpl.data.organization._id, details, positionIds, tmpl.files.array(), captchaUrl,
      HospoHero.handleMethodResult(()=> {
        $(event.target)[0].reset();
        tmpl.files.clear();
        HospoHero.success('Your resume was sended to our manager. Have a nice day.');
      }));
  }
});

function getDetailsData(tmpl) {
  let res = {};
  _.each(tmpl.data.applicationDefinition.schema, (value, field) => {
    if (!value) {
      return;
    }
    let val = tmpl.$('.recruitment-form .' + field).val();
    switch (field) {
      case 'availability' :
      {
        res.availability = getAvailabilities(tmpl);
        break;
      }
      case 'numberOfHours' :
      {
        res[field] = parseInt(val);
        break;
      }
      case 'dateOfBirth' :
      {
        res[field] = new Date(val);
        break;
      }
      default :
      {
        res[field] = val;
      }
    }
  });
  return res;
}

function getAvailabilities(tmpl) {
  let availabilities = [];
  _.each(tmpl.$('.recruitment-form .availability'), (input)=> {
    if (input.checked) {
      availabilities.push(parseInt($(input).attr('data-number')));
    }
  });
  return availabilities;
}

function getPositionsData(tmpl) {
  let positions = [];
  _.each(tmpl.$('.positions:checked'), input => positions.push(Blaze.getData(input)._id));
  return positions.length > 0 ? positions : false;
}