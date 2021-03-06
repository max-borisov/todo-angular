app.controller('TaskController', ['$scope', '$http', function ($scope, $http) {

  $scope.addTask = function(project) {
    var obj = this;
    if (obj.task) {
      $http.post(request.tasksCreate(project.id), { description: obj.task }).
        then(function(response) {
          var data = response.data;
          project.tasks.push({ id: data.id, description: data.description, completed: data.completed });
          obj.task = '';
        }, function(response) {});
    }
  };

  $scope.deleteTask = function(project, task, event) {
    event.preventDefault();

    if (confirm('Are you sure ?')) {
      $http.delete(request.tasksDestory(project.id, task.id)).
        then(function(response) {
          project.tasks.forEach(function(item, i, arr) {
            if (item.id == task.id) {
              project.tasks.splice(i, 1);
            }
          })
        }, function(response) {});
    }
  };

  $scope.editTaskDescription = function(project, task, event) {
    event.preventDefault();

    var editBlock = angular.element(event.currentTarget)
                  .parent().parent().parent().parent()
                  .find('td').eq(2);
    var taskDescription = '';
    var editFormTpl = "<form><input type='text' data-project-id='" + project.id + "' data-task-id='" + task.id + "' name='' value=''></form>";
    var obj = this;
    var input;

    if (!editBlock.hasClass('edit-mode')) {
      editBlock.addClass('edit-mode');
      taskDescription = editBlock.find('p').text();
      form = angular.element(editFormTpl);

      form.bind('submit', function(event) {
        event.preventDefault();

        var form = angular.element(event.currentTarget);
        var input = form.find('input');
        var projectId = input.attr('data-project-id');
        var taskId = input.attr('data-task-id');
        var editBlock = form.parent();
        var newTaskDescription = input.val();
        editBlock.find('p').text(newTaskDescription);
        form.remove();
        editBlock.removeClass('edit-mode');

        $http.put(request.tasksPut(project.id, task.id), { description: newTaskDescription }).
          then(function(response) {},
          function(response) {});
      });

      editBlock
        .append(form)
        .find('input')
        .val(taskDescription)[0]
        .focus();
    }
  };

  $scope.completeTask = function(project, task) {
    $http.put(request.tasksComplete(project.id, task.id), { task: { complete: task.completed } }).
      then(function(response) {},
      function(response) {});
  };

}]);