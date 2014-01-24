window.onload = function(){
    var f = new Factory();
    window.App = f.createNewObj('VideoApp');
};


VideoApp = {
    URL: 'https://everyplay.com/api/videos?',
    client_id:'336d586b6e1b5e4a0f9eaa48e7e697d8cd51db40',
    defaultVideosQuery:{
        offset:0,
        limit:24
    },
    lastVideosQuery:{    },
    selectors:{

    },
    extend:'RequestFactory',
    getDefaultVideosQuery:function(){
        return this.defaultVideosQuery;
    },
    getClientId:function(){
        return this.client_id;
    },
    getURL:function(options){
        return this.URL+options;
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
    getVideosJSON:function(options){
        this.requestGET(options,function(txt){
            App.insertVideo(JSON.parse(txt));
        });
    },
    insertVideo:function(arr){
        var div, p, img,
            fragment = document.createDocumentFragment();

           for(var i=0; i<arr.length; i++){
              div = document.createElement('div');
              p   = document.createElement('p');
              img = document.createElement('img');

              img.setAttribute('src',arr[i].thumbnail_url);
              p.innerHTML = ['<b>',arr[i].title ,'</b>','<b>', arr[i].user.username ,'</b>'].join("")
              div.appendChild(img);
              div.appendChild(p);

              fragment.appendChild(div);
           }

            debugger;
           document.getElementById('content').appendChild(fragment);

    }
};

RequestFactory = {
    constructor:function(){

    },
    requestGET:function(options,callback){
        var strParams = this.createGETString(options);
        var xmlhttp = this.requestStart(strParams,function() {
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
    },
    createGETString:function(options){
        var requestString = '';
        for (var item in options){
            requestString += [item,'=',options[item],'&'].join("")
        }
        return requestString;
    }
};