Template.recruitmentFormFilePicker.helpers({
	files(){
		return this.files.list();
	}
});

Template.recruitmentFormFilePicker.events({
	'click .upload-files-button'(event, tmpl){
		filepicker.pickAndStore(
			{
				extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
				services: ['COMPUTER'],
				multiple: true
			},
			{},
			(InkBlobs) => {
				if (Array.isArray(InkBlobs)) {
					_.each(InkBlobs,(item) => {
						tmpl.data.files.push(_.extend(item,{_id:new Mongo.ObjectID()._str}));
					});
				}
			});
	},
	'click .remove-file'(event, tmpl) {
		let id = $(event.target).parent().parent().attr('id');
		// Save item to remove
		let blob = tmpl.data.files.find(item => item._id === id);
		// Remove from Ui
		tmpl.data.files.remove(item => item._id === id);
		// Remove from server
		filepicker.remove(blob,	() => { }, (FPError) => {
				// If error return item into ui
				tmpl.data.files.push(blob);
				HospoHero.error(FPError);
		});
	}
});
