Template.managerNoteItem.helpers({
  note: function() {
    return this.note;
  },
  trimText: function(text) {
    var maxLenght = 20;
    if (text.length < maxLenght) return text;
    return text.substr(0, 20) + '...';
  }
});

Template.managerNoteItem.events({
  'click .manager-note-item': function(event, tmpl) {
    event.preventDefault();
    console.log(tmpl.data.note);
    tmpl.data.onEditNote(tmpl.data.note);
  }
});