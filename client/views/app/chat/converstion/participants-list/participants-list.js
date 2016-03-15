Template.participantsList.onCreated(function () {
  this.conversation = Meteor.conversations.findOne(this.data.conversationId);

  this.addParticipant = (userId) => {
    const conversation = this.conversation;
    this.subscribe('profileUser', userId, function onReady() {
      conversation.addParticipant(Meteor.users.findOne(userId));
    });
  };

  this.autorun(() => {
    const participants = this.conversation.participants();
    const participantsIds = participants.map(participant => participant.userId);
    this.subscribe('selectedUsersList', participantsIds);
  });

  this.searchName = new ReactiveVar('');

  this.searchSource = this.AntiSearchSource({
    collection: 'users',
    fields: ['profile.firstname', 'profile.lastname'],
    searchMode: 'global',
    limit: 10
  });

  this.autorun(() => {
    const name = this.searchName.get();
    if (name) {
      this.searchSource.setMongoQuery({
        _id: {$nin: this.conversation._participants}
      });
      this.searchSource.search(name);
    }
  });
});

Template.participantsList.onRendered(function () {
  this.cleanSearchInput = () => {
    this.find('.search-user-name').value = '';
    this.searchName.set('');
  };
});

Template.participantsList.helpers({
  searchedUsers () {
    const tmpl = Template.instance();
    if (tmpl.searchName.get()) {
      return tmpl.searchSource.searchResult({
        sort: {'profile.firstname': 1}
      });
    }
  },
  addParticipant () {
    const tmpl = Template.instance();
    return (userId) => {
      tmpl.addParticipant(userId);
      tmpl.cleanSearchInput();
    };
  }
});

Template.participantsList.events({
  'keyup .search-user-name': function (event, tmpl) {
    const text = event.target.value;
    tmpl.searchName.set(text);
  }
});
