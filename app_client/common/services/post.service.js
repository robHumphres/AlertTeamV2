(function(){

	angular
	.module('meanApp')
	.service('postData',postData);

	postData.$inject = ['$http','authentication'];
	function postData($http,authentication){

  	var getPosts = function(){
			var vm = this;
	    vm.currentUser = authentication.currentUser();
			var email = vm.currentUser.email;
  		return $http.post('/api/allPosts', {email: email});
  	};
	  return{
      getPosts : getPosts
    };
	}

})();
