app.controller('ProjectController', ['$scope', '$http', function ($scope, $http) {

    $scope.projects = projects;

    $http.get(request.projectsIndex()).
      then(function(response) {
        $scope.projects = response.data;
      }, function(response) {});

    $scope.createProject = function(event) {
      event.preventDefault();

      $http.post(request.projectsCreate()).
        then(function(response) {
          var project = response.data;
          $scope.projects.push({
            id: project.id,
            title: project.title,
            tasks: project.tasks
          });
        }, function(response) {});
    };

    $scope.editProjectTitle = function(project, event) {
      event.preventDefault();

      var titleBlock = angular.element(event.currentTarget)
                        .parent().parent().parent();
      projectTitle = titleBlock.find('h3').text();
      titleBlock
        .addClass('edit-mode')
        .find('input')
        .val(projectTitle)[0]
        .focus();
    };

    $scope.deleteProject = function(project, event) {
      event.preventDefault();

      if (confirm('Are you sure ?')) {
        $http.delete(request.projectsDestroy(project.id)).
          then(function(response) {
            $scope.projects.forEach(function(item, i, arr) {
              if (item.id == project.id) {
                arr.splice(i, 1);
              }
            })
          }, function(response) {});
      }
    };

  $scope.saveProjectTitle = function(project, event) {
    var input = angular.element(event.currentTarget).find('input');
    var newTitle = input.val();
    var titleBlock = input.parent().parent();
    titleBlock.find('h3').text(newTitle);
    input.val('');
    titleBlock.removeClass('edit-mode');

    $http.put(request.projectsPut(project.id), { title: newTitle }).
      then(function(response) {
      }, function(response) {});
  };

}]);