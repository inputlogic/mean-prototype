'use strict';

var ng = require('angular');

ng
  .module('todoApp', [])
  .controller('TodoListController', TodoListController);

function TodoListController() {
  var todoList = this;

  todoList.todos = [
    {text: 'learn angular', done: true},
    {text: 'build an angular app', done: false}
  ];

  todoList.addTodo = function() {
    todoList.todos.push({text:todoList.todoText, done:false});
    todoList.todoText = '';
  };

  todoList.remaining = function() {
    var count = 0;
    todoList.todos.forEach(function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  todoList.archive = function() {
    todoList.todos = todoList.todos.filter(function(todo) {
      return !todo.done;
    });
  };
}