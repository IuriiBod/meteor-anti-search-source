Template.formFieldsSettings.onCreated(function () {
  this.fieldTitles = {
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    dateOfBirth: 'Date of Birth',
    numberOfHours: 'Number of Hours',
    availability: 'Availability',
    message: 'Message',
    files: 'Files'
  };
});

Template.formFieldsSettings.helpers({
  schema() {
    let applicationDefinition = ApplicationDefinitions.findOne({_id: this.applicationId});
    let schema = applicationDefinition && applicationDefinition.schema || {};

    let fieldTitles = Template.instance().fieldTitles;
    return _.map(fieldTitles, (value, field) => {
      return {
        fieldName: field,
        fieldTitle: value,
        isChecked: isFieldRequired(field) ||  schema[field] || false,
        infoMessage: isFieldRequired(field) ? 'Required' : false,
        isDisable: isFieldRequired(field) ? true : false,
        className: field
      };
    });
  },

  onCheckboxChange () {
    let applicationId = this.applicationId;
    let tmpl = Template.instance();
    return () => {
      Meteor.call('upsertsApplicationDefinition', getAppDefinitionObject(tmpl,applicationId), HospoHero.handleMethodResult());
    };
  }
});

function isFieldRequired(field){
  return HospoHero.checkers.ApplicationDefinitionSchema[field] === true;
}

function getAppDefinitionObject(tmpl,applicationId) {
  let appDefinition = ApplicationDefinitions.findOne({_id: applicationId});
  appDefinition = appDefinition ? appDefinition :
  {
    positions: [],
    organizationId: HospoHero.getOrganizationIdBasedOnCurrentArea(Meteor.userId())
  };
  appDefinition.schema = getAppDefinitionSchema(tmpl);
  return appDefinition;
}

function getAppDefinitionSchema(tmpl){
  let res = {};
  _.each(tmpl.fieldTitles, (value, field) => {
    res[field] = tmpl.$('input.'+ field).is(':checked');
  });
  return res;
}