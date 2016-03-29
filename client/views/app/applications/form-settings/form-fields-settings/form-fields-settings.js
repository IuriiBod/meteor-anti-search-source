Template.formFieldsSettings.helpers({
  schema() {
    let applicationDefinition = ApplicationDefinitions.findOne({_id: this.applicationId});
    let schema = applicationDefinition && applicationDefinition.schema || {};

    let fieldTitles = {
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      numberOfHours: 'Number of Hours',
      availability: 'Availability',
      message: 'Message',
      files: 'Files'
    };

    return _.map(fieldTitles, (value, field) => {
      return {
        fieldName: field,
        fieldTitle: value,
        isChecked: schema[field] || false,
        infoMessage: (field === 'name' || field === 'email') ? 'Required' : false,
        isDisable: (field === 'name' || field === 'email') ? true : false
      };
    });
  },

  onCheckboxChange () {
    return (fieldName, isChecked) => {
      Meteor.call('upsertsApplicationDefinition', {[fieldName]: isChecked}, HospoHero.handleMethodResult());
    };
  }
});