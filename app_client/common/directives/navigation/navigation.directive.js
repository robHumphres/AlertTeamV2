(function () {

  angular
    .module('meanApp')
    .directive('navigation', navigation);

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/navigation/navigation.template.html',
      controller: 'navigationCtrl as navvm'//alias of the controller, allows us to get rid of $scope keyword and use this keyword
    };
  }

})();
