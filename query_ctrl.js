define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('TsvQueryCtrl', ['$scope', function($scope) {
    $scope.init = function() {
      window.qs = $scope;
      if ($scope.target) {
        $scope.target.target = $scope.target.target || '';
      }
    };

    $scope.init();
  }]);
});
