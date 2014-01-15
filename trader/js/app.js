var cList = "AED;AFN;ARS;AUD;AZN;BBD;BDT;BGN;BHD;BOB;BRL;BSD;BWP;BZD;CAD;CDF;CHF;CLP;CNY;COP;CRC;CVE;CZK;DKK;DOP;DZD;EEK;EGP;ERN;ETB;EUR;FJD;GBP;GHS;GTQ;GYD;HKD;HNL;HRK;HTG;HUF;IDR;ILS;INR;IQD;ISK;JMD;JOD;JPY;KES;KHR;KMF;KRW;KWD;KZT;LBP;LKR;LTL;LVL;LYD;MAD;MKD;MRO;MXN;MYR;MZN;NAD;NGN;NIO;NOK;NPR;NZD;OMR;PAB;PEN;PHP;PKR;PLN;PYG;QAR;RON;RSD;RUB;SAR;SEK;SGD;SRD;THB;TMT;TND;TRY;TTD;TWD;UAH;UGX;USD;UYU;UZS;VEF;VND;XAF;XDR;XOF;XPF;YER;ZAR;ZMW".split(';');

function addEventHandler(oNode, evt, oFunc,bCaptures){
    if (oNode.length>0) {
        for (var idx in oNode){
            if (typeof(oNode[idx]) == "object")
                oNode[idx].addEventListener(evt, oFunc, bCaptures);
        }
        
        return;
    }
    
  
   oNode.addEventListener(evt, oFunc, bCaptures);
}

window.onload = function(){
// alert()/
// var myCar =  Object.create(CurrecyApp)
// myCar.init()
    
     CurrecyApp = {
        currencyList:[],
    
        constructor:function(){
        //   alert()
         this.setCurrencyList(window.cList);
         this.init();
        },
    
        init : function(){
            var currSelectList = document.querySelectorAll('select[data-role="currencyList"]'),
                lenght = currSelectList.length;
    
            for (var i = 0; i<lenght; i++ ){
                currSelectList[i].appendChild(this.getCurrencyListFragment());
            }
            
            debugger; 
            addEventHandler(document.querySelectorAll('#symbols input[type="button"]'),'click', function(){alert(1)}, true);
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


    var Factory = function(){
      this.objType = {};
    
      this.createNewObj = function (obj) {
        //   debugger
         obj = (typeof(window[obj])=='object') ? window[obj] : { error: 'no such class name in global space' };  
         
         this.setObjType(obj)
         
         var func = this.getObjConstructor();
         for (var prop in obj){
            func.prototype[prop] = obj[prop];
         }
         
         return new func();
      }
      
      this.getObjType = function(){
           return this.objType;
      }
      this.setObjType = function(obj){
          this.objType = obj
      }
      this.getObjConstructor = function(obj){
          return this.getObjType().constructor;
      }    
    }

 
 
 
 
  var f = new Factory();

  var object = f.createNewObj('CurrecyApp');
  
  
  
//   object.prototype.constructor = f.createNewObj('CurrecyApp');
  
//   debugger
//   var x = new object()
}




