/*!
 * jquery.i18n.js 0.0.1 - https://github.com/yckart/jquery.i18n.js
 * Makes internationalization simpler as it is.
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/09
*/
;(function ($) {
    $.i18n = function(options){
        options = $.extend({}, {
            lang: 'en',
            data: '',
            sliceLang: false,
            url:'',
            ableLang:['zh','en'],
            is_langs:true
        }, options);
        var langStore = langStore || {},
            lang = options.lang.indexOf('-') < 0 && !options.sliceLang ? options.lang : options.lang.slice(0, 2);
        if( typeof options.data === 'object' ){
            options.data = data;
        } else {
            if(options.data.match(/(.*)[\/\\]([^\/\\]+)\.(\w+)$/)){
                var urlParts = options.data.match(/(.*)[\/\\]([^\/\\]+)\.(\w+)$/);
                url = urlParts[1] + '/' + lang + '.' + urlParts[3];
            }else{
                if(options.url!=''){
                    url = options.url;
                }
            }
            $.ajax({
                url: url,
                dataType: "json",
                success: function(data) {
                    //langStore = data;
                    options.data = data;
                },
                error: function(error) {
                    console.log(error);
                    $.getJSON(urlParts[1] + '/' + lang + '.' + urlParts[3], function(data) {
                        //langStore = data;
                        options.data = data;
                    });
                }
            });
        }
        var checkLang = function(){
            if(typeof options.lang == "string"){
                if(options.ableLang.indexOf(options.lang)>=0) {
                    return true;
                }
            }
            console.info('langError',options.lang);
            return false;
        };
        var getLangStore = function(){
            if(checkLang()){
                if( options.is_langs){
                    langStore = options.data[options.lang];
                }else{
                    langStore = options.data;
                }
            }
        };
        var storeData = function(data,cache){
            if(cache==undefined){
                cache = true;
            }
            console.log(cache);
            if(!data) return;
            if(cache){
                if(window.localStorage) {
                    localStorage.setItem( "langStore", JSON.stringify(data) );
                    langStore = data;
                } else {
                    langStore = data;
                }
            }else{
                localStorage.setItem( "langStore", JSON.stringify(data) );
                langStore = data;
            }
        };
        if(window.localStorage) {
            var localLangStore = localStorage.getItem("langStore");
            storeData( localLangStore !== null ? JSON.parse(localLangStore) : langStore);
        } else {
            getLangStore();
            storeData( langStore );
        }

        this.getLang = function(){ return lang; };
        this.setLang = function(l){ lang = l; storeData(options.data[l]); };
        this.setLang = function(lang){
            options.lang = lang;
            getLangStore();
            storeData(langStore,false);
        };

        this.getData = function(){ return langStore};
        this.getItem = function(key){ return langStore[key]; };
        this.setItem = function(key, value){ options.data[lang][key] = value; storeData(langStore); };

        this.formatView = function(){
            for(var i in this.getData()){
                $('[data-lang="'+i+'"]').text(this.getItem(i));
            }
            document.title = this.getItem('title');
        };
        return this;
    };
}(jQuery));