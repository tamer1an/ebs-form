var cList = "AED;AFN;ARS;AUD;AZN;BBD;BDT;BGN;BHD;BOB;BRL;BSD;BWP;BZD;CAD;CDF;CHF;CLP;CNY;COP;CRC;CVE;CZK;DKK;DOP;DZD;EEK;EGP;ERN;ETB;EUR;FJD;GBP;GHS;GTQ;GYD;HKD;HNL;HRK;HTG;HUF;IDR;ILS;INR;IQD;ISK;JMD;JOD;JPY;KES;KHR;KMF;KRW;KWD;KZT;LBP;LKR;LTL;LVL;LYD;MAD;MKD;MRO;MXN;MYR;MZN;NAD;NGN;NIO;NOK;NPR;NZD;OMR;PAB;PEN;PHP;PKR;PLN;PYG;QAR;RON;RSD;RUB;SAR;SEK;SGD;SRD;THB;TMT;TND;TRY;TTD;TWD;UAH;UGX;USD;UYU;UZS;VEF;VND;XAF;XDR;XOF;XPF;YER;ZAR;ZMW".split(';');

function addEventHandler(oNode, evt, oFunc,bCaptures){
    if (typeof(window.event) != "undefined")
        oNode.attachEvent("on"+evt, oFunc);
    else
        oNode.addEventListener(evt, oFunc, bCaptures);
}




window.onload = function(){
//    alert()/
    var myCar =  Object.create(CurrecyApp)
    myCar.init()
}


CurrecyApp = {
    currencyList:[],

//    constructor:function(){
//        alert()
//      this.setCurrencyList(window.cList);
//    },

    init : function(){
        var currSelectList = document.querySelectorAll('select[data-role="currencyList"]'),
            lenght = currSelectList.length;

        for (var i = 0; i<lenght; i++ ){
            currSelectList[i].appendChild(this.getCurrencyListFragment());
        }
    },

    setCurrencyList:function(list){
        this.currencyList = list;
    },
    getCurrencyList:function(){
        return this.currencyList;
    },
    getCurrencyListFragment:function(){
        var option,
            fragment = document.createDocumentFragment(),
            currencyList = this.getCurrencyList();

        for (var curr in currencyList){
            option = document.createElement('option');
            option.innerText = currencyList[curr];
            fragment.appendChild(option)
        }

        return fragment;
    }

}


//CurrecyApp.prototype.constructor = function(){alert('run')};
















































//var invocation = new XMLHttpRequest();
//var url = 'http://fx.cloanto.com/webservices/CloantoCurrencyServer.asmx/Currencies?licenseKey=string';
//var body = '<?xml version="1.0"?><person><name>Arun</name></person>';
//
//function callOtherDomain(){
//    if(invocation)
//    {
//        invocation.open('GET', url, true);
////        invocation.setRequestHeader('Access-Control-Allow-Origin', '*');
////        invocation.setRequestHeader('X-PINGOTHER', 'pingpong');
//        invocation.setRequestHeader('Content-Type', 'application/xml');
////        invocation.onreadystatechange = handler;
//        invocation.send();
//    }
//
//}
//
//callOtherDomain()


//
//var invocation = new XMLHttpRequest();
//var url = 'http://korrespondent.net';
////var url = 'http://fx.cloanto.com/webservices/CloantoCurrencyServer.asmx/Currencies?licenseKey=string';
//
//function callOtherDomain() {
//    if(invocation) {
//        invocation.open('GET', url, true);
//        invocation.onreadystatechange = function(r){console.log(arguments)};
//        invocation.setRequestHeader('Access-Control-Allow-Origin', '*');
//        invocation.send();
//    }
//}
//
//callOtherDomain()
//



//
//if (!XMLHttpRequest.prototype.sendAsBinary) {
//    XMLHttpRequest.prototype.sendAsBinary = function (sData) {
//        var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
//        for (var nIdx = 0; nIdx < nBytes; nIdx++) {
//            ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
//        }
//        /* send as ArrayBufferView...: */
//        this.send(ui8Data);
//        /* ...or as ArrayBuffer (legacy)...: this.send(ui8Data.buffer); */
//    };
//}
//
//function getXmlHttp(){
//    var xmlhttp;
//    try {
//        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
//    } catch (e) {
//        try {
//            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//        } catch (E) {
//            xmlhttp = false;
//        }
//    }
//    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
//        xmlhttp = new XMLHttpRequest();
//    }
//    return xmlhttp;
//}
//
//var xmlhttp = getXmlHttp()
//xmlhttp.open('GET', 'http://fx.cloanto.com/webservices/CloantoCurrencyServer.asmx/Currencies?licenseKey=string', true);
//xmlhttp.onreadystatechange = function() {
//    if (xmlhttp.readyState == 4) {
//        if(xmlhttp.status == 200) {
//            alert(xmlhttp.responseText);
//        }
//    }
//};
//xmlhttp.send(null);



//
//var req;
//var reqTimeout;
//
//function loadXMLDoc(url) {
//    req = null;
//    if (window.XMLHttpRequest) {
//        try {
//            req = new XMLHttpRequest();
//        } catch (e){}
//    } else if (window.ActiveXObject) {
//        try {
//            req = new ActiveXObject('Msxml2.XMLHTTP');
//        } catch (e){
//            try {
//                req = new ActiveXObject('Microsoft.XMLHTTP');
//            } catch (e){}
//        }
//    }
//
//    if (req) {
//        req.onreadystatechange = processReqChange;
//        req.open("GET", url, true);
//        req.send(null);
//        reqTimeout = setTimeout("req.abort();", 5000);
//    } else {
//        alert("Браузер не підтримує AJAX");
//    }
//}
//
//function processReqChange() {
//    document.form1.state.value = stat(req.readyState);
//
//
//    if (req.readyState == 4) {
//        clearTimeout(reqTimeout);
//
//        document.form1.statusnum.value = req.status;
//        document.form1.status.value = req.statusText;
//
//        // only if "OK"
//        if (req.status == 200) {
//            document.form1.response.value=req.responseText;
//        } else {
//            alert("Не вдалося отримати дані:\n" + req.statusText);
//        }
//    }
//}
//
//function stat(n)
//{
//    switch (n) {
//        case 0:
//            return "не ініціалізовано";
//            break;
//
//        case 1:
//            return "Завантаження...";
//            break;
//
//        case 2:
//            return "Завантажено";
//            break;
//
//        case 3:
//            return "В процесі...";
//            break;
//
//        case 4:
//            return "Виконано";
//            break;
//
//        default:
//            return "Невідомий стан";
//    }
//}
//
//function requestdata(params)
//{
//    loadXMLDoc('examples/httpreq.php'+params);
//
//}
//
//requestdata('?test');