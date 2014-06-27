welldonegoodApp.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        //This is dirty but it works...
        //If the node count has passed the "getItemsLoaded" count
        //AND the screen isn't filled up yet
        //Call the scrolled function to load more data
        var nodeCount = 0;
        elm.bind('DOMNodeInserted', function(event){
        	nodeCount++;
        	//Each node is counted twice on insert
        	if (scope.getItemsLoaded() * 2 <= nodeCount) {
        		nodeCount = 0;
        		if (raw.scrollHeight <= raw.offsetHeight) {
        			var scrollFunction = scope[attr.whenScrolled.replace("()","")];
                    scrollFunction();
        		}
        	}

    	});
        
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});