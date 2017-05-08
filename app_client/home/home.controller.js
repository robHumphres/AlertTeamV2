(function() {

  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);
    console.log('sups');

    homeCtrl.$inject = ['$location','postData'];
    function homeCtrl ($location,postData) {
      var vm = this;
      vm.posts = {
        title:"Washington State Huge Problem",
        postInfo: "People just cannot Drive here...",
        time : "10:25 AM May 6 2017"
      };
      vm.post ={};

      postData.getPosts()
      .success(function(data){
        vm.post = data;
      })
      .error(function(e){
        console.log(e);
      });


    }

})();
