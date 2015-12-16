var assert = require('chai').assert;

describe('TodoListController', function() {
  var $controller;

  beforeEach(angular.mock.module('todoApp'));
  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('$scope.todos', function() {
    it('should exist with 2 items', function() {
      var $scope = {};
      $controller('TodoListController as todoList', { $scope: $scope });
      assert.ok($scope.todoList);
      assert.lengthOf($scope.todoList.todos, 2);
    });
  });
});