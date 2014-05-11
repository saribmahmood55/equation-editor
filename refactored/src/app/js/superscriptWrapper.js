eqEd.SuperscriptWrapper = function(symbolSizeConfig) {
	eqEd.Wrapper.call(this, symbolSizeConfig); // call super constructor.
    this.className = "eqEd.SuperscriptWrapper";

    this.superscriptContainer = new eqEd.SuperscriptContainer(symbolSizeConfig);
    this.superscriptContainer.parent = this;
    this.domObj = this.buildDomObj();
    this.domObj.append(this.superscriptContainer.domObj);
    this.childContainers = [this.superscriptContainer];
    this.maxBaseWrapperOverlap = 0.9;
    this.padLeft = 0.05;

    // Set up the width calculation
    var width = 0;
    this.properties.push(new Property(this, "width", width, {
        get: function() {
            return width;
        },
        set: function(value) {
            width = value;
        },
        compute: function() {
            return this.superscriptContainer.width;
        },
        updateDom: function() {
            this.domObj.updateWidth(this.width);
        }
    }));

    // Set up the topAlign calculation
    var topAlign = 0;
    this.properties.push(new Property(this, "topAlign", topAlign, {
        get: function() {
            return topAlign;
        },
        set: function(value) {
            topAlign = value;
        },
        compute: function() {
        	var fontHeight = this.symbolSizeConfig.height[this.parent.fontSize];
        	var baseWrapper = null;
        	var base = null;
        	var baseWrapperOverlap = 0;
        	if (this.index !== 0) {
        		baseWrapper = this.parent.wrappers[this.index - 1];
        		if (baseWrapper instanceof eqEd.SuperscriptWrapper || baseWrapper instanceof eqEd.SuperscriptAndSubscriptWrapper) {
        			base = baseWrapper.superscriptContainer;
        			fontHeight = this.symbolSizeConfig.height[base.fontSize];
        		} else {
        			if (baseWrapper instanceof eqEd.SquareRootWrapper) {
	                    baseWrapperOverlap = (this.superscriptContainer.bottomAlign / baseWrapper.height);
	                    if (baseWrapperOverlap <= this.maxBaseWrapperOverlap) {
	                        baseWrapperOverlap = baseWrapperOverlap;
	                    } else {
	                        baseWrapperOverlap = this.maxBaseWrapperOverlap;
	                    }
	                }
	                if (baseWrapper instanceof eqEd.NthRootWrapper) {
	                    var baseWrapperOverlap = (this.superscriptContainer.bottomAlign / baseWrapper.nthRootDiagonal.height);
	                    if (baseWrapperOverlap <= this.maxBaseWrapperOverlap) {
	                        baseWrapperOverlap = baseWrapperOverlap;
	                    } else {
	                        baseWrapperOverlap = this.maxBaseWrapperOverlap;
	                    }
	                }
	                base = baseWrapper;
        		}
        	} else {
        		// The superscript wrapper is the first entry in the container.
        		// We want to format it, as if there is a symbol immediately
        		// preceeding it.
        		baseWrapper = new eqEd.SymbolWrapper('a', 'MathJax_MathItalic', this.symbolSizeConfig);
        		baseWrapper.parent = this.parent;
        		baseWrapper.index = null;
        		baseWrapper.update();
        		base = baseWrapper;
        	}
        	var topAlign = 0;
        	if (baseWrapper instanceof eqEd.NthRootWrapper) {
	            if (this.superscriptContainer.adjustTop*fontHeight + this.superscriptContainer.bottomAlign > baseWrapper.nthRootDiagonal.height*baseWrapperOverlap) {
	                topAlign = this.superscriptContainer.height - (baseWrapper.nthRootDiagonal.height*baseWrapperOverlap - (base.topAlign - (base.height - baseWrapper.nthRootDiagonal.height)));
	            } else {
	                topAlign = (baseWrapper.topAlign - (base.height - baseWrapper.nthRootDiagonal.height)) + this.superscriptContainer.height - this.superscriptContainer.bottomAlign;
	            }
	        } else {
	            if (this.superscriptContainer.adjustTop * fontHeight + this.superscriptContainer.bottomAlign > base.height * baseWrapperOverlap) {
	                topAlign = this.superscriptContainer.height - (base.height * baseWrapperOverlap - baseWrapper.topAlign);
	            } else {
	                topAlign = baseWrapper.topAlign + this.superscriptContainer.height - this.superscriptContainer.bottomAlign;
	            }
	        }
            return topAlign;
        },
        updateDom: function() {}
    }));

    // Set up the bottomAlign calculation
    var bottomAlign = 0;
    this.properties.push(new Property(this, "bottomAlign", bottomAlign, {
        get: function() {
            return bottomAlign;
        },
        set: function(value) {
            bottomAlign = value;
        },
        compute: function() {
        	var baseWrapper = null;
        	if (this.index !== 0) {
        		baseWrapper = this.parent.wrappers[this.index - 1];
        	} else {
        		// The superscript wrapper is the first entry in the container.
        		// We want to format it, as if there is a symbol immediately
        		// preceeding it.
        		baseWrapper = new eqEd.SymbolWrapper('a', 'MathJax_MathItalic', this.symbolSizeConfig);
        		baseWrapper.parent = this.parent;
        		baseWrapper.index = null;
        		baseWrapper.update();
        	}
            return baseWrapper.bottomAlign;
        },
        updateDom: function() {}
    }));
};

(function() {
    // subclass extends superclass
    eqEd.SuperscriptWrapper.prototype = Object.create(eqEd.Wrapper.prototype);
    eqEd.SuperscriptWrapper.prototype.constructor = eqEd.SuperscriptWrapper;
    eqEd.SuperscriptWrapper.prototype.buildDomObj = function() {
        return new eqEd.WrapperDom(this,
            '<div class="wrapper superscriptWrapper"></div>')
    };
    eqEd.SuperscriptWrapper.prototype.clone = function() {
        var copy = new this.constructor(this.symbolSizeConfig);
        copy.superscriptContainer = this.superscriptContainer.clone();
    	copy.superscriptContainer.parent = copy;
    	copy.domObj = copy.buildDomObj();
    	copy.domObj.append(copy.superscriptContainer.domObj);
    	copy.childContainers = [copy.superscriptContainer];
        return copy;
    };
})();