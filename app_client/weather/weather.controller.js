(function() {

  angular
    .module('meanApp')
    .controller('weatherCtrl', weatherCtrl);

    function WeatherCtrl () {
      console.log('Weather controller is running');
    }

})();
