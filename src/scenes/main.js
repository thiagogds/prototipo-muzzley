Crafty.scene("main", function() {

	var elements = [
        "src/interfaces/info.js"
	];

	//when everything is loaded, run the main scene
	require(elements, function() {
		infc['info'] = new Info();
	});

});
