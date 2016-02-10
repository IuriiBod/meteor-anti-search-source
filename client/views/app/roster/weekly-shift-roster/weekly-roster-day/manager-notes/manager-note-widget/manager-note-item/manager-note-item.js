Template.managerNoteItem.onCreated(function() {
  this.subscribe('comments', this.data.note._id, HospoHero.getCurrentAreaId());
  this.isNoteEditing = new ReactiveVar(false);
});

Template.managerNoteItem.helpers({
  note: function() {
    return this.note;
  },
  trimText: function(text) {
    var maxLenght = 20;
    if (text.length < maxLenght) return text;
    return text.substr(0, 20) + '...';
  },
  commentsCount: function () {
    return Comments.find({
      reference: this.note._id
    }).count();
  },
  isNoteEditing: function() {
    return Template.instance().isNoteEditing.get();
  },
  onCloseEditor: function() {
    var tmpl = Template.instance();
    return function() {
      tmpl.isNoteEditing.set(false);
    }
  }
});

Template.managerNoteItem.events({
  'click .manager-note-item td:not(:last-child)': function(event, tmpl) {
    event.preventDefault();
    tmpl.isNoteEditing.set(true);
  }
});