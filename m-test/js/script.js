function addEventHandler(oNode, evt, oFunc, bCaptures){
	if (typeof(window.event) != "undefined")
		oNode.attachEvent("on"+evt, oFunc);
	else
		oNode.addEventListener(evt, oFunc, bCaptures);
}

wResize = {
    mediaSizes: new Array(),

    initSizes: function() {
        this.mediaSizes.push({ clMinW: 800, clMaxW: -1, cls: 'screen640' });
        this.mediaSizes.push({ clMinW: 480, clMaxW: 800, cls: 'screen640' });
        this.mediaSizes.push({ clMinW: -1, clMaxW: 480, cls: 'screen480' });
    },

    setStyleForSize: function() {
        var clientW = document.documentElement.clientWidth;
        for (i = 0; i < this.mediaSizes.length; i++) {
            var oSize = this.mediaSizes[i];
            if (oSize.clMinW == -1) {
                if (clientW <= oSize.clMaxW) {
                    document.getElementById('title').className = oSize.cls;
                    return;
                }
            }
            if (oSize.clMaxW == -1) {
                if (clientW > oSize.clMinW) {
                    document.getElementById('title').className = oSize.cls;
                    return;
                }
            }
            if (clientW > oSize.clMinW && clientW <= oSize.clMaxW) {
                document.getElementById('title').className = oSize.cls;
                return;
            }
        }
    }
}; 

addEventHandler(window, "load", function() {
	wResize.initSizes();
	wResize.setStyleForSize();
},false);

addEventHandler(window, "resize", function() {
	wResize.initSizes();
	wResize.setStyleForSize();
},false);
	

	
/* light version
 * var page = document.getElementById('page')
 * 
	function resize(){ 
		if(page.offsetWidth <= 439){
			
		} else {
				
		}
	}
		
	addEventHandler(window,'resize',resize,false);
	
	function getEventTarget(e) {
		if (window.event) return window.event.srcElement;
		else return e.target;
	}
*/