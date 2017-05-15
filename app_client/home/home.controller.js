(function() {

  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);
    console.log('sups');

    homeCtrl.$inject = ['$location','postData'];
    function homeCtrl ($location,postData) {
      var vm = this;

      vm.post ={};
      //following is inside vm.post. post.title, post.postInfo, post.time
      postData.getPosts()
      .success(function(data){
        vm.post = data;
        

})
      .error(function(e){
        console.log(e);
      });


    }

})();
