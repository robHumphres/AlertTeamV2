(function(){

	angular
	.module('meanApp')
	.service('postData',postData);

	postData.$inject = ['$http','authentication'];
	function postData($http,authentication){

  	var getPosts = function(){
  		return $http.get('/api/traffic');
  	};

	  return{
      getPosts: getPosts
    };
	}

})();
