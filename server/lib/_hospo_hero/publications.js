Namespace('HospoHero.publication', {
	isChild: function (self,child,res) {
		if(child){
			return res;
		}else{
			self.ready();
		}
	},
	isUser: function (self,clab) {
		if(self.userId){
			return clab();
		}else{
			self.ready();
		}
	}
});
