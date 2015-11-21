define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.directives');

  module.directive('metricQueryEditorTsv', function() {
    return {controller: 'TsvQueryCtrl', templateUrl: 'app/plugins/datasource/tsv/partials/query.editor.html'};
  });

   module.directive('metricQueryOptionsTsv', function() {
     return {templateUrl: 'app/plugins/datasource/tsv/partials/query.options.html'};
   });

});
