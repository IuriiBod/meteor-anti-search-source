Template.recruitmentFormField.helpers({
	isTextArea(){
		return this.type === 'textarea';
	},
	type() {
		return this.type ? this.type : 'text';
	}
});