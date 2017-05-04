(function() {

  angular
    .module('meanApp')
    .controller('weatherCtrl', weatherCtrl);

    function weatherCtrl () {
      console.log('Weather controller is running');
    }

})();
