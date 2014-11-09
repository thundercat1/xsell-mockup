var angularApp = angular.module('xsellMockApp', []);


angularApp.controller('xsellMockController', ['$scope', '$http', '$anchorScroll', '$location', function($scope, $http, $anchorScroll, $location) {

	bcsUrl = 'http://www.backcountry.com';
	$scope.crossSellSlots = ['1','2','3'];

	$scope.resetKeystone = function() {
		$scope.keystone = {};
		$scope.keystoneInput = '';
		$scope.keystone.imageUrl = 'alta.jpg';
	};
	
	$scope.resetSlots = function() {
		$scope.slot1 = [{}, {}, {}];
		$scope.slot2 = [{}, {}, {}];
		$scope.slot3 = [{}, {}, {}];
	};

	$scope.gotoBottom = function() {
		// set the location.hash to the id of
		// the element you wish to scroll to.
		$location.hash('bottom');

		// call $anchorScroll()
		$anchorScroll();
	};

	$scope.resetSlots();
	$scope.resetKeystone();


	$scope.keystoneInputToUpper = function(){
		$scope.keystoneInput = $scope.keystoneInput.toUpperCase();
	};
	
	$scope.getKeystone = function(style){
		style = style.toUpperCase();
		if (style != $scope.keystone.style) {

			$scope.keystone = {};
			$scope.keystone.imageUrl = 'spinner.gif';
			$scope.keystone.style = style;

			$http.get('http://localhost:5000/getStyle?style=' + style).success(
				function(data) {
					console.log('found some data for style' + style);
					console.log(data);

					product = data.products[0];
					sku = product.skus[0];

					$scope.keystone.title = product.title;
					$scope.keystone.url = bcsUrl + sku.url;
					$scope.keystone.imageUrl = bcsUrl + sku.image.url;
					$scope.keystone.brand = product.brand.name;

					}).error(function(data, status, headers, config){
						$scope.keystone.imageUrl = 'asdf';
						console.log($scope.keystone);
						$scope.keystone.title = "Error finding sku. Try again.";
					});
		};
	};

	
	$scope.getRecommendation = function(slot, queryString){
		if (queryString != slot.lastQuery) {
			slot.lastQuery = queryString;
			console.log('looking for recommendation: ' + queryString);
	
			slot.forEach(function(product) {
				product.imageUrl = 'spinner.gif';
				console.log(product);
			});
	
			recommendationData = $http.get('http://localhost:5000/getRecommendations?query=' + queryString).success(
				function(data) {
					console.log('found some data after searching for ' + queryString);
					console.log(data);
					l = slot.length;
					console.log('slot beginning at:');
					console.log(l)
						for (var i = 0; i < l; i++) {
							slot.pop();
						};
	
					data.products.forEach(function(product) {
						slot.push({'title': product.title, 'brand': product.brand.name, 'url': bcsUrl + product.skus[0].url, 'imageUrl': bcsUrl + product.skus[0].image.url});
					});
					$scope.gotoBottom();
				});
		};
	};

}]);
