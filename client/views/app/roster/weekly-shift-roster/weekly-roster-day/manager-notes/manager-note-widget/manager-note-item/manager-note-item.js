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
  'click .manager-note-item td:not(:last-child)': function(event, tmpl) {
    event.preventDefault();
    tmpl.data.onEditNote(tmpl.data.note);
  }
});