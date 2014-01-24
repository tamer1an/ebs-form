window.onload = function(){
    var f = new Factory();
    window.App = f.createNewObj('CurrecyApp');
};





CurrecyApp = {
    URL: 'https://everyplay.com/api/videos?',
    client_id:'336d586b6e1b5e4a0f9eaa48e7e697d8cd51db40',
    defaultVideosQuery:{
        offset:0,
        limit:24
    },
    lastVideosQuery:{    },
    selectors:{

    },
    createGETString:function(options){
        var requestString = '';
        for (var item in options){
            requestString += [item,'=',options[item],'&'].join("")
        }
        return requestString;
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
    getURL:function(options){
       return this.URL+options;
    },
    getVideosJSON:function(options){
        var strParams = this.createGETString(options);
        this.requestGET(strParams,function(txt){
            alert(txt);
        });
    },
    getDefaultVideosQuery:function(){
        return this.defaultVideosQuery;
    },
    getClientId:function(){
        return this.client_id;
    },

    requestGET:function(options,callback){
        var xmlhttp = this.requestStart(options,function() {
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) {
                    callback(xmlhttp.responseText);
                }
            }
        });
    },
    requestStart:function(options,callback){
        var xmlhttp = this.getRequestObj();
        xmlhttp.open('GET', this.getURL(options) , true);
        xmlhttp.onreadystatechange = callback;
        xmlhttp.send(null);

        return xmlhttp;
    },
    getRequestObj:function(){
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    }
};