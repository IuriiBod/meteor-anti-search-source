Template.referenceOptgroup.helpers({
  isSelected: function (item) {
    var reference = Template.parentData().reference;
    return reference && reference.id === item._id;
  }
});