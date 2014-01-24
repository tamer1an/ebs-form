window.onload = function(){
    var f = new Factory();
    window.App = f.createNewObj('VideoApp');
};

//Object factory
var Factory = function(){
    this.constructor=function(){};
    this.objType = {};
    this.createNewObj = function (obj) {
        obj = (typeof(window[obj])=='object') ? window[obj] : { error: 'no such class name in global space' };

        this.setObjType(obj);
        var func = this.getObjConstructor();

        if (obj.extend){
            var f = new Factory();
            func.prototype = f.createNewObj(obj.extend);
        }

        for (var prop in obj){
            func.prototype[prop] = obj[prop];
        }
        return new func();
    };
    this.getObjType = function(){
        return this.objType;
    };
    this.setObjType = function(obj){
        this.objType = obj
    };
    this.getObjConstructor = function(obj){
        return this.getObjType().constructor;
    }
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
        videos_thumb:'section[data-role="content"] div > img'
    },
    extend:'Utils',
    getDefaultVideosQuery:function(){
        return this.defaultVideosQuery;
    },
    getClientId:function(){
        return this.client_id;
    },
    getURL:function(options){
        return this.URL+options;
    },
    constructor:function(){
        this.addEventHandler(window, 'popstate' , function(e){
            var footer =   document.getElementsByTagName('footer')[0],
                videosList =   document.querySelector('section[data-role="content"]');

            if(e.state == undefined){
              footer.classList.add("hidden");
              videosList.classList.remove("hidden");
            }else{
                footer.classList.remove("hidden");
                videosList.classList.add("hidden");
            }
        } ,false);

        this.init();
    },
    init : function(){
        var options = this.getDefaultVideosQuery();
            options.client_id = this.getClientId();

        this.getVideosJSON(options);

        this.addEventHandler(document.getElementById('video-filter'),'change',function(evt){
            var options = App.getDefaultVideosQuery();
                options.client_id = App.getClientId();
                options.order = evt.target.selectedOptions[0].value;

                App.getVideosJSON(options);
        } ,true,true)
    },
    getVideosJSON:function(options){
        this.lastVideosQuery=options;
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
              img.setAttribute('data-src',arr[i].video_url);
              img.setAttribute('data-user',arr[i].user.username);
              img.setAttribute('data-date',arr[i].created_at);
              img.setAttribute('data-title',arr[i].title);
              img.setAttribute('data-avatar',arr[i].user.avatar_url_small);

              p.innerHTML = ['<span>',arr[i].title ,'</span>','<br>','<b>', arr[i].user.username ,'</b>'].join("")
              div.appendChild(img);
              div.appendChild(p);

              this.addEventHandler(img,'click',this.showVideo, true);
              fragment.appendChild(div);
           }
           document.getElementById('videos').innerHTML="";
           document.getElementById('videos').appendChild(fragment);
    },
    showVideo:function(evt){
        evt.target.parentNode.parentNode.parentNode.classList.add("hidden");
        var footer = App.dqAll('footer[data-role="single-video"]')[0],
            fragment = document.createDocumentFragment(),
            h1   = document.createElement('h1'),
            video = document.createElement('video'),

            div = document.createElement('div'),
            img   = document.createElement('img'),
            p1   = document.createElement('p'),
            p2   = document.createElement('p'),

            dataSet = evt.target.dataset;

        footer.innerHTML=""

        video.setAttribute('src', dataSet.src);
        h1.innerHTML  = dataSet.title;

        img.setAttribute('src',dataSet.avatar);
        p1.innerHTML = dataSet.user;
        p2.innerHTML = dataSet.date;
        p2.setAttribute('class','r');
        div.appendChild(img);
        div.appendChild(p2);
        div.appendChild(p1);

        fragment.appendChild(h1);
        fragment.appendChild(video);
        fragment.appendChild(div);

        footer.appendChild(fragment);

        history.pushState({videoSrc: dataSet.src}, "title", "test");
        footer.classList.remove("hidden");
    }
};

Utils = {
    constructor:function(){

    },
    dqAll : function (sel){
        return document.querySelectorAll(sel);
    },
    elemHasAttribute:function(elementName,attribute){
        var element = document.createElement(elementName);
        return attribute in element;
    },
    addEventHandler:function(oNode, evt, oFunc,bCaptures,onlyRootElement){
        if (oNode.length>0 && onlyRootElement!==true) {
            for (var idx in oNode){
                if (typeof(oNode[idx]) == "object")
                    oNode[idx].addEventListener(evt, oFunc, bCaptures);
            }
            return;
        }
        oNode.addEventListener(evt, oFunc, bCaptures);

        //TODO: support ie
        //if (typeof(window.event) != "undefined")
        //oNode.attachEvent("on"+evt, oFunc);
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