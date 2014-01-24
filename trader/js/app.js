window.onload = function(){
    var f = new Factory();
    window.App = f.createNewObj('CurrecyApp');
};

CurrecyApp = {
    selectors:{

    },
    dqAll : function (sel){
        return document.querySelectorAll(sel)
    },
    constructor:function(){
        this.init();
    },
    init : function(){

    }
};




