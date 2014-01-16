var cList = "AED;AFN;ARS;AUD;AZN;BBD;BDT;BGN;BHD;BOB;BRL;BSD;BWP;BZD;CAD;CDF;CHF;CLP;CNY;COP;CRC;CVE;CZK;DKK;DOP;DZD;EEK;EGP;ERN;ETB;EUR;FJD;GBP;GHS;GTQ;GYD;HKD;HNL;HRK;HTG;HUF;IDR;ILS;INR;IQD;ISK;JMD;JOD;JPY;KES;KHR;KMF;KRW;KWD;KZT;LBP;LKR;LTL;LVL;LYD;MAD;MKD;MRO;MXN;MYR;MZN;NAD;NGN;NIO;NOK;NPR;NZD;OMR;PAB;PEN;PHP;PKR;PLN;PYG;QAR;RON;RSD;RUB;SAR;SEK;SGD;SRD;THB;TMT;TND;TRY;TTD;TWD;UAH;UGX;USD;UYU;UZS;VEF;VND;XAF;XDR;XOF;XPF;YER;ZAR;ZMW".split(';');

window.onload = function(){
    var f = new Factory();
    window.App = f.createNewObj('CurrecyApp');
};

CurrecyApp = {
    currencyList:[],
    selectors:{
        currSelectList : 'select[data-role="currencyList"]',
        addSymbol      : 'input[data-role="addSymbol"]',
        removeSymbol   : 'input[data-role="removeSymbol"]',
        ratesSymbolSet : function(action){
           return ['input[data-symbol="EURUSD"][data-role="',action,'Symbol"],',
                   'input[data-symbol="EURGBP"][data-role="',action,'Symbol"],',
                   'input[data-symbol="EURRUP"][data-role="',action,'Symbol"]'].join("");
        }
    },
    dqAll : function (sel){
        return document.querySelectorAll(sel)
    },
    constructor:function(){
        this.setCurrencyList(window.cList);
        this.init();
    },
    init : function(){
        this.buildSymbolSelect();
        this.addAppHandlers();
        this.disableSymbolSet();
    },
    buildSymbolSelect : function(){
        var currSelectList = this.dqAll(this.selectors.currSelectList),
            lenght = currSelectList.length;

        for (var i = 0; i<lenght; i++ ){
            currSelectList[i].appendChild(this.getCurrencyListFragment());
        }
    },
    addAppHandlers : function(obj){
        addEventHandler((typeof(obj)=='undefined')?this.dqAll(this.selectors.addSymbol):obj,'click',this.addSymbolRecord, true);
        addEventHandler((typeof(obj)=='undefined')?this.dqAll(this.selectors.removeSymbol):obj,'click',this.removeSymbolRecord, true);
    },
    disableSymbolSet: function(){
        var item,alreadyExist;

        alreadyExist = this.dqAll(this.selectors.ratesSymbolSet('remove'));
        for (var idx = 0; idx < alreadyExist.length; idx++){
            item = document.querySelector('#symbols input[data-symbol="'+alreadyExist[idx].dataset.symbol+'"]');

            if(item!==null){
                item.setAttribute('disabled',true);
            }
        }
    },
    addSymbolRecord:function(evt){
        var symbol = evt.target.dataset.symbol;

        if (symbol === 'CUSTOM'){
            customSelects = evt.target.parentNode.querySelectorAll('select');

            if (customSelects[0].selectedOptions[0].value === "" || customSelects[1].selectedOptions[0].value === ""){
                alert("Please select symbol in the dropdowns");
                return;
            }else if (customSelects[0].selectedOptions[0].value === customSelects[1].selectedOptions[0].value){
                alert("Please select different symbols in the dropdowns");
                return;
            }
            symbol = customSelects[0].selectedOptions[0].innerHTML+customSelects[1].selectedOptions[0].innerHTML
        }

        if(document.querySelector('#rates input[data-symbol="'+symbol+'"]')!==null){
            return;
        }

        generateRatesItem(symbol);

        if(evt.target.dataset.symbol !== 'CUSTOM'){
            evt.target.setAttribute('disabled' ,true);
        }

        function generateRatesItem(symbol){
            var div      = document.createElement('div'),
                p        = document.createElement('p'),
                pAsk     = document.createElement('p'),
                pBid     = document.createElement('p'),
                input    = document.createElement('input'),
                fragment = document.createDocumentFragment();

            p.innerHTML    = symbol;
            pAsk.innerHTML = '12.33';
            pBid.innerHTML = '56.44';
            pBid.className = 'ml10';

            input.setAttribute('data-role',"removeSymbol");
            input.setAttribute('data-symbol',symbol);
            input.setAttribute('title',"Add to refresh list");
            input.setAttribute('value',"Remove");
            input.setAttribute('type' ,"button");

            window.App.addAppHandlers(input);

            div.appendChild(p);
            div.appendChild(pAsk);
            div.appendChild(pBid);
            div.appendChild(input);
            fragment.appendChild(div);

            document.getElementById('rates').appendChild(fragment);
        }
    },
    removeSymbolRecord:function(evt){
        var item = document.querySelector('#symbols input[data-symbol="'+evt.target.dataset.symbol+'"]');
        if(item!==null){
            item.removeAttribute('disabled')
        }
        evt.target.parentNode.remove();
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
            option.value = currencyList[curr];
            fragment.appendChild(option)
        }
        return fragment;
    }
};




