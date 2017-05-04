(function() {

  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);
    console.log('sups');

    homeCtrl.$inject = ['$location','postData'];
    function homeCtrl ($location,postData) {
      var vm = this;
      vm.post = {};
      vm.test = 'do something crazy';

      postData.getPosts()
      .success(function(data){
        vm.post = data;
      })
      .error(function(e){
        console.log(e);
      });


    }

})();
