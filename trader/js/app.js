window.onload = function(){
    var f = new Factory();
    window.App = f.createNewObj('CurrecyApp');
};

CurrecyApp = {
    client_id:'336d586b6e1b5e4a0f9eaa48e7e697d8cd51db40',
    defaultVideosQuery:{
        offset:0,
        limit:24
    },
    lastVideosQuery:{    },
    selectors:{

    },
    dqAll : function (sel){
        return document.querySelectorAll(sel);
    },
    constructor:function(){
        this.init();
    },
    init : function(){
        var options = this.getDefaultVideosQuery();
            options.client_id = this.getClientId();

        this.getVideosJSON(options)
    },
    getVideosJSON:function(property){

    },
    getDefaultVideosQuery:function(){
        return this.defaultVideosQuery;
    },
    getClientId:function(){
        return this.client_id;
    }
};




