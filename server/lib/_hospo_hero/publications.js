Namespace('HospoHero.publication', {
	isUser: function (self,clab) {
		if(self.userId){
			return clab();
		}else{
			self.ready();
		}
	}
});
