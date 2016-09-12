//var app = angular.module('myApp', []);
app.controller('shoppingController', ['$scope', '$http', '$window', 
                              function($scope, $http, $window) {
    $scope.months = [1,2,3,4,5,6,7,8,9,10,11,12];
    $scope.years = [2014,2015,2016,2017,2018,2019,2020];
    $scope.content = '/static/products.html';


    $scope.setContent = function(filename){
      $scope.content = '/static/'+ filename;
    };

    $scope.setProduct = function(productId){
        $scope.product = this.product;
        $scope.content = '/static/product.html';
    };

    /*$scope.cartTotal = function(){
      var total = 0;
      for(var i=0; i<$scope.customer[0].cart.length; i++){
        var item = $scope.customer[0].cart[i];
        total += item.quantity * item.product[0].price;
      }
      $scope.shipping = total*.05;
      return total+$scope.shipping;
    };*/
  }]);