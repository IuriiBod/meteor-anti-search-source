Template.recruitmentFormField.helpers({
  isTextArea(){
    return this.type === 'textarea';
  },
  type() {
    return this.type ? this.type : 'text';
  },
  htmlRegExp (type) {
    return type ? HospoHero.regExp.toHtmlString(HospoHero.regExp[type]) : false;
  }
});