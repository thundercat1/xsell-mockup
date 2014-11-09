
var angularApp = angular.module('xsellMockApp', []);


angularApp.controller('xsellMockController', function($scope, $http) {

	$scope.slot1 = []
	$scope.slot2 = []
	$scope.slot3 = []
	


	$scope.getRecommendation = function(slot, queryString){
		recommendationData = $http.get('http://localhost:5000/getRecommendations?query=' + queryString).success(
			function(data) {
				l = slot.length;
				console.log('slot beginning at:');
				console.log(l)
				for (var i = 0; i < l; i++) {
					slot.pop();
					console.log(slot)
				};
				
				data.products.forEach(function(product) {
					console.log(product);
					slot.push({'title': product.title, 'brand': product.brand.name, 'url': product.skus[0].url, 'imageUrl': product.skus[0].image.url});
					console.log(slot);
				});


			});
	};

});
