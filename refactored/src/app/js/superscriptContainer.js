eqEd.SuperscriptContainer = function(symbolSizeConfig) {
	eqEd.Container.call(this, symbolSizeConfig);
	this.className = "eqEd.SuperscriptContainer";

	this.domObj = this.buildDomObj();
    var squareEmptyContainerWrapper = new eqEd.SquareEmptyContainerWrapper(symbolSizeConfig);
    this.addWrappers([0, squareEmptyContainerWrapper]);
    this.offsetTop = 0.2;

    // Set up the left calculation
    var left = 0;
    this.properties.push(new Property(this, "left", left, {
        get: function() {
            return left;
        },
        set: function(value) {
            left = value;
        },
        compute: function() {
        	// remember compute hooks get called.
            return 0;
        },
        updateDom: function() {
            this.domObj.updateLeft(this.left);
        }
    }));

    // Set up the top calculation
    var top = 0;
    this.properties.push(new Property(this, "top", top, {
        get: function() {
            return top;
        },
        set: function(value) {
            top = value;
        },
        compute: function() {
        	// remember compute hooks get called.
            return 0;
        },
        updateDom: function() {
            this.domObj.updateLeft(this.top);
        }
    }));

    // Set up the fontSize calculation
    var fontSize = "";
    this.properties.push(new Property(this, "fontSize", fontSize, {
        get: function() {
            return fontSize;
        },
        set: function(value) {
            fontSize = value;
        },
        compute: function() {
        	var fontSize = "";
           	var baseWrapper = null;
	        if (this.parent.index !== 0) {
	            baseWrapper = this.parent.parent.wrappers[this.parent.index - 1];
	        } else {
	            // The superscript wrapper is the first entry in the container.
        		// We want to format it, as if there is a symbol immediately
        		// preceeding it.
        		baseWrapper = new eqEd.SymbolWrapper('a', 'MathJax_MathItalic', this.symbolSizeConfig);
        		baseWrapper.parent = this.parent.parent;
        		baseWrapper.index = null;
        		baseWrapper.update();
	        }
	        if (this.parent.parent.fontSize === "fontSizeSmaller" || this.parent.parent.fontSize === "fontSizeSmallest") {
	            fontSize = "fontSizeSmallest";
	        } else {
	            if (baseWrapper instanceof eqEd.SuperscriptWrapper
	             || baseWrapper instanceof eqEd.SuperscriptAndSubscriptWrapper) {
	                fontSize = "fontSizeSmallest";
	            } else {
	                fontSize = "fontSizeSmaller";
	            }
	        }
	        return fontSize;
        },
        updateDom: function() {
            this.domObj.updateFontSize(this.fontSize);
        }
    }));
};

(function() {
    // subclass extends superclass
    eqEd.SuperscriptContainer.prototype = Object.create(eqEd.Container.prototype);
    eqEd.SuperscriptContainer.prototype.constructor = eqEd.SuperscriptContainer;
    eqEd.SuperscriptContainer.prototype.buildDomObj = function() {
        return new eqEd.ContainerDom(this,
            '<div class="container superscriptContainer"></div>');
    };
})();