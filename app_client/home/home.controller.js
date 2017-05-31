(function() {

  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);


    homeCtrl.$inject = ['$location','postData'];
    function homeCtrl ($location,postData) {
      var vm = this;

      vm.post ={};
      //following is inside vm.post. post.title, post.postInfo, post.time
      postData.getPosts()
      .success(function(data){
        vm.post = data;
        //Sorts the array from newest to oldest.
        vm.post.sort(function(a,b){
          return new Date(b.time) - new Date(a.time);
        });

})
      .error(function(e){
        console.log(e);
      });


    }


})();
