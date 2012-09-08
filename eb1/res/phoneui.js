/*
 *  MobiOne PhoneUI Framework
 *  version 0.1.12.20120309
 *  <http://genuitec.com/mobile/resources/phoneui>
 *  (c) Copyright 2010-2012 Genuitec, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ 
   
var phoneui = {};

/** 
  * Support for deprecated API mobione namespace
  * @deprecated 
  * @see phoneui
  */
var mobione = phoneui; 

// Initialize webapp for use by phoneui framework
$(document).ready(function() {
	jQuery.preloadCssImages();
	
	phoneui._whenBackHandlers = {};
	
	var webappCache = window.applicationCache;
	if (webappCache) {
		/*
		webappCache.addEventListener("checking", function() {
			phoneui.showActivityDialog("Checking for update...");
		}, false);
		*/
		var wasDownloaded = false;
		webappCache.addEventListener("noupdate", function() {
			phoneui.hideActivityDialog();
		}, false);
		webappCache.addEventListener("downloading", function() {
			phoneui.showActivityDialog("Updating...");
			wasDownloaded = true;
		}, false);
		webappCache.addEventListener("cached", function() {
			phoneui.hideActivityDialog();
		}, false);
		webappCache.addEventListener("updateready", function() { 
			location.reload(); // Reload page right after update came. 
		}, false);
		webappCache.addEventListener("obsolete", function() {
			phoneui.hideActivityDialog();
			// alert("Error: The manifest is no longer available (code 404). Unable to cache web page for offline use.");
			location.reload(); // Reload page, it seems user just switched off appcache
		}, false);
		webappCache.addEventListener("error", function() {
			phoneui.hideActivityDialog();
			if (wasDownloaded) {
				alert("Error: Unable to cache web page for offline use. Visit Safari settings and clear cache.");
			}
		}, false);

	}
	
	// Default platform (mostly for desktop browsers
	var touchEventsSupported;
	phoneui._platform = {
		init : function() {
			$(window).resize(function(e) {
				handleResizing();
			});
		},
		initAddressBarHiding : function() {},
		hideAddressBar : function() {},
		docsize : function() { return { x : window.innerWidth, y : window.innerHeight }; },
		touchevents : function() {
			if (typeof(touchEventsSupported) != "boolean") {
			    try {
			        document.createEvent("TouchEvent");
			        touchEventsSupported = !window.navigator.userAgent.toLowerCase().match(/Chrome/i);
			    } catch (e) {
			    	touchEventsSupported = false;
			    }
			}
			return touchEventsSupported; 
		},
		nativespinner : false
	};

	if (window.navigator.userAgent.toLowerCase().match(/(iphone|ipod)( simulator)?;/i)) {
		// iphone platform
		phoneui._platform = {
			init : function() {
				$('input, textarea, select').bind('blur', function(e) {
					// virtual keyboard disappeared, let's hide address bar
					phoneui._platform.hideAddressBar();
				});
			},
			initAddressBarHiding : function() {
				setTimeout(function() {
					phoneui._platform.hideAddressBar();
				}, 1000);
			},
			hideAddressBar : function() {
				window.scrollTo(0, 0);
			},
			docsize : function() {
				var p = (window.orientation % 180) == 0;
				// Take statusbar into account
				var bb = 20;
				var bbVisible = 
					!(window.PhoneGap) && 
					!window.navigator.standalone;
				if (bbVisible) {
					// Take buttonbar into account
					bb += (p ? 44 : 30);
					// Take addressbar height into account
					bb += m1Design.shouldHideAddressBar ? 0 : 60;
				}
				return { 
					x : (p ? 320 : 480), 
					y : ((p ? 480 : 320) - bb) }; 
			},
			touchevents : function() { 
				return true; 
			},
			nativespinner : true
		};
	} else if (window.navigator.userAgent.toLowerCase().match(/(ipad)( simulator)?;/i)) {
		// ipad platform
		phoneui._platform = {
			init : function() {
				$(window).resize(function(e) {
					handleResizing();
				});
				$('input, textarea, select').bind('blur', function(e) {
					// virtual keyboard disappeared, let's hide address bar
					phoneui._platform.hideAddressBar();
				});
			},
			initAddressBarHiding : function() {},
			hideAddressBar : function() {
				window.scrollTo(0, 0);
			},
			docsize : function() { 
				return { x : window.innerWidth, y : window.innerHeight }; 
			},
			touchevents : function() {
				return true;  
			},
			nativespinner : true
		};
	} else if (window.navigator.userAgent.toLowerCase().match(/(Linux; U; Android )/i)) {
		// Android platform
		phoneui._platform = {
			init : function() {
				$(window).resize(function(e) {
					handleResizing();
				});
			},
			initAddressBarHiding : function() {
				setTimeout(function() {
					phoneui._platform.hideAddressBar();
				}, 1000);
			},
			hideAddressBar : function() {
				window.scrollTo(0, 1);
			},
			docsize : function() {
				return { x : window.innerWidth, y : window.innerHeight };
			},
			touchevents : function() {
				return true; 
			},
			nativespinner : false
		};
	}

	function resizeScreen(currentScreen) {
		var s = phoneui._platform.docsize();
		// Set root screen element height - otherwise addressbar wouldn't disappear on iOS
		var t = $("." + m1Design.css('top-root') + ", " + currentScreen.anchor_id);
		t.height(s.y);
		t.width(s.x);
		currentScreen.resize(s.x, s.y); // Make first resize
		reinitscrollers($(currentScreen.anchor_id));
	}
	
	function handleResizing() {
		if (currentScreen) {		
			resizeScreen(currentScreen);
		}
	}
	
	var isSliding = false;
	var firstScreenTime = 1;
	var defAncPars = [m1Design.root(), 'NONE', firstScreenTime];
	var currentScreen = parseAnchor('');
	
	phoneui.getCurrentScreen = function() {
		return currentScreen;
	}
	
	handleResizing();

	// FORMAT: page_id:transition:time
	function parseAnchor(str) {
		var spl = str == "" ? [] : str.substr(1).split(':');
		
		// Append default params
		if (spl.length < defAncPars.length) {
			spl = spl.concat(defAncPars.slice(spl.length));
		}
		
		function obj() {};
		if (!(spl[0] in m1Design.pages)) {
			console.error('Page ' + spl[0] + ' is not found!');
			console.trace("Call");
			return null;
		}
		obj.prototype = m1Design.pages[spl[0]];
		
		var ret = new obj();
		ret.transition = spl[1];
		ret.time = spl[2];
		ret.equals = function(el) {
			return !el || (this.anchor_id == el.anchor_id);
		};
		ret.toString = function() { return this.anchor_id + ":" + this.transition; };
				
		return ret; 
	}
	
	// Install checkNewScreen as history change listener
	if ('onhashchange' in window) {
		window.onhashchange = checkNewScreen;
	} else {
		setInterval(checkNewScreen, 200);
	}

	phoneui._platform.init();

	if ('orientation' in window) {
		window.onorientationchange = function() {
			handleResizing();
			if (m1Design.shouldHideAddressBar) {
				phoneui._platform.initAddressBarHiding();
			}
			if ('postOrientationChange' in phoneui) {
				phoneui.postOrientationChange(window.orientation);			
			}
		};
	}
	
	checkNewScreen();
	
	var prevHref;
	function checkNewScreen() {
		var initialCall = !prevHref;
		if (prevHref != window.location.href) {			
			var prevExistingHref = prevHref;
			prevHref = window.location.href;
			
			var nextScreen = parseAnchor(window.location.hash);

			if (!nextScreen.equals(currentScreen)) {
				var trans = nextScreen.transition;
				var back = false;
	
				if ((+nextScreen.time) < (+currentScreen.time)) {
					// We're moving back in history!
					trans = currentScreen.transition;
					back = true;
				}

				if (('html_url' in nextScreen) &&
						// following case is special one - returning back from static page
						// to dynamic one shouldn't cause reload, otherwise our SLM pages
						// stops to work
						!(back && currentScreen && !('html_url' in currentScreen))) {
					// Load page first
					loadExternalPage(nextScreen.html_url(), nextScreen.transition);
				} else {
					// Animate!
					var $next = $(nextScreen.anchor_id);
					
					// Vadim.Ridosh: here we're analyzing whether we're moving 
					// back, calling pretransition event and check whether user 
					// cancelled transition.
					if (back && !callPreTransition(nextScreen)) {
						window.location.href = prevHref = prevExistingHref;
						return;
					} else {
						// calling "back" handler
						var fnBack = phoneui._whenBackHandlers[nextScreen.id];
						phoneui._whenBackHandlers[nextScreen.id] = null;
						(fnBack || function() {})();
					}

					resizeScreen(nextScreen);

					animateNavigation( 
							$next, $(currentScreen.anchor_id), 
							initialCall ? "NONE" : trans, back, function() {
								currentScreen = nextScreen;
								callPostTransition();
							});
				}
			}
		}
	}

	function parseDPIPageData(data, transition) {
		phoneui._loadingJSDone = function(pageObjects) {
			// register pages in pages object
			for (var i=0; i<pageObjects.length; ++i) {
				var pageObject = pageObjects[i];
				m1Design.pages[pageObject.id] = pageObject;
			}
			// First page description is a page we need to switch at
			var pageObject = pageObjects[0];
						
			var nextScreen = parseAnchor("#" + pageObject.id + ":" + transition);

			if (callPreTransition(nextScreen)) {
				resizeScreen(nextScreen);

				var $next = $(nextScreen.anchor_id);
				animateNavigation( 
						$next, $(currentScreen.anchor_id), 
						transition, false, function() {							
							nextScreen.time = currentScreen.time + 1;
							window.location.hash = nextScreen.id + ":" + transition + ":" + nextScreen.time;
							currentScreen = nextScreen;
							callPostTransition();												
						});
			}

			phoneui.hideActivityDialog();

			phoneui._loadingJSDone = null;
		};
		
		var pg = $('<div></div>');
		pg.html(data);
		var rt = pg.find('.' + m1Design.css('root'));
		
		rt.each(function(i, v) {
			var $next = $("#" + $(v).attr('id'));
			// Remove old div
			$next.remove();			
		});

		preProcess(rt);
		rt.hide();
		rt.appendTo('.' + m1Design.css('top-root'));
	}

	phoneui.loadCssAsync = function(cssFileUrl, onok) {
		onok = onok || function() {};
		$.ajax({
			  url: cssFileUrl,
			  dataType: 'text',
			  success: function(data) {
				$('<style type="text/css">' + data +'</style>').appendTo("head");
				onok();
			  },
			  error: onok // Call onok anyway, we don't care about failed JS loading
			});
	}
	
	phoneui.loadJsAsync = function(jsFileUrl, onok) {
		onok = onok || function() {};
		$.ajax({
			  url: jsFileUrl,
			  dataType: 'script',
			  success: onok,
			  error: onok // Call onok anyway, we don't care about failed JS loading
			});
	}

	function loadExternalPage(url, transition) {
		phoneui.showActivityDialog();
		
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		// req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
		var timer = setTimeout(function() {
		       req.abort();
		     }, 10000);
		req.onreadystatechange = function() {
			if (req.readyState == req.DONE) {
				var ok = (req.status >= 200 && req.status < 300) || (req.status == 0 && req.responseText.length > 0); 
				if (ok) {
					clearTimeout(timer);

					parseDPIPageData(req.responseText, transition);
				} else {
					phoneui.hideActivityDialog();
				}
			}
		}
   		req.send(null);		
	}
	
	function callPreTransition(nextScreen) {
		if (currentScreen.equals(nextScreen)) {
			console.error('Page ' + currentScreen.anchor_id + ' already active');
			return false;
		}
		if ('prePageTransition' in phoneui) {
			var result = 
				!!(phoneui.prePageTransition(currentScreen.anchor_id, nextScreen.anchor_id));
			if (!result) {
				console.log('Page ' + nextScreen.anchor_id + ' pretransition veto');
			}
			return result;
		}		
		return true;
	}
	
	function callPostTransition() {
		// Unclick while transitioning to page
		var clickeable = $('.' + m1Design.css("clicked") + '.' + m1Design.css("hyperlink-internal"), 
				$(currentScreen.anchor_id));
		unclickme(clickeable);

		if ('postPageTransition' in phoneui) {
			phoneui.postPageTransition(currentScreen.anchor_id);
		}		
	}

	/**
	 * Get ID of current page. 
	 *
	 * @return ID String of the page. Is in the form of anchor (e.g., #m1-page1)
	 */
	phoneui.getCurrentPageId = function() {
		return currentScreen.anchor_id;
	}

	var getURIParameterByName = function(name) {
	  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	  var regexS = "[\\?&]" + name + "=([^&#]*)";
	  var regex = new RegExp(regexS);
	  var results = regex.exec(window.location.href);
	  if(results == null)
	    return "";
	  else
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	phoneui.resetForm = function(formId) {
		var form = document.forms.item(formId);
		form.reset();
		// preProcess($('.' + m1Design.css("top-root")));
		var context = $(currentScreen.anchor_id);
		$('.' + m1Design.css('select-list-menu-spinner') + "," +
			'.' + m1Design.css('select-list-menu'), context).each(function(i, v) {
				processSLM(v, context);
			});
		$('.' + m1Design.css('selection-list'), context).each(function(i, v) {
			processSL(v, context)
		});
	}
	
	phoneui.submitForm = function(formId) {
		var result = false;
		var form = document.forms.item(formId);
		if (form == null) return result;
				
    	var presubmitName = "preSubmitForm_" + form.name;
	    var method = $(form).attr('method');
	    var restype = $(form).attr('data-resulttype');
	    var transition = $(form).attr('data-transition');
	    var str = $(form).serialize();
	    var path = $(form).attr('action');
	    var aftersubmitName = "postSubmitForm_" + form.name;

	    //validate non-empty path
	    if (!path) return false; //no path provided
	    //trim path
	    path = $.trim(path);
	    //validate non-empty path
	    if (path.length == 0) return false; //no path provided
	
	    if (presubmitName in phoneui) {
	      result = phoneui[presubmitName](form);
	      if (result == false) {
	        return result;
	      }
	    }  
	
	    //mailto: protocol issues on iOS:
	    // 1) fails on iOS3 standalone webapp
	    // 2) on iOS4 standalone webapp, the mail client does not return to webapp
	    if (path.indexOf('mailto:') > -1) {
	        $(form).attr('ENCTYPE','text/plain');
	        $(form)[0].submit();
	      
	        if (aftersubmitName in phoneui) {
	            result = phoneui[aftersubmitName](true);
	        }
	      
	        if (result && urlToGoAfter) {
	              setNewLocation(urlToGoAfter);
	        }
	      
	        return result;
	    }

		if (restype == 'WEB_PAGE') {
			// Pure Web submisson
			$(form)[0].submit();
			return;
		}
		
		phoneui.showActivityDialog();
		
		// "serverRedirectUrl"
		
		var redirect = getURIParameterByName('serverRedirectUrl');
		path += (method == "GET" ? ("?" + str) : "");
		
		var dtype; // Undefined by default
		if (restype == 'DYNAMIC_PAGE') {
			dtype = 'text';
		} else if (restype == 'DATA_XML') {
			dtype = 'xml';
		} else if (restype == 'DATA_JSON') {
			dtype = 'json';
		} else if (restype == 'DATA_JSONP') {
			dtype = 'jsonp';
			redirect = null; // We don't need redirect for JSONP, because that's not a subject of cross-domain restrictions 
		} else if (restype == 'DATA_TEXT') {
			dtype = 'text';
		} else if (restype == 'DATA_HTML') {
			dtype = 'html';
		}
		
		var ajaxRequest = {
			type: method,
			url: (redirect || path),
			cache: false,
			dataType : dtype,
			beforeSend: function(xhr){
				if (redirect) {
					// Perform trick to resolve relative URL to absolute one
				    var img = document.createElement('img');
				    img.src = path;
				    path = img.src;
				    img.src = null;

					xhr.setRequestHeader("X-Original-http-address", path);
				}
				return true; //return false if execution should terminate
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.error("AJAX request failed", textStatus, errorThrown);
				phoneui.hideActivityDialog();
				if (aftersubmitName in phoneui) {
					phoneui[aftersubmitName](false,textStatus);
				}			 
			},
			complete: function(xMLHttpRequest, textStatus) {
				// console.log(textStatus);
			},
			success: function(data) {
				result = true;

				if (aftersubmitName in phoneui) {
					result = phoneui[aftersubmitName](true, data);
				}
				
				if (result) {
					if (restype == 'DYNAMIC_PAGE') {
						parseDPIPageData(data, transition);
					} else {
						phoneui.hideActivityDialog();							
					}
				}
			}
		};
		if (method == "POST") {
			ajaxRequest['data'] = str;
		}	

		jQuery.ajax(ajaxRequest);	

		return result;
	}
	
	phoneui.gotoSlmPage = function(pageId, transition, slmId) {
		var sel = $("#" + $("#" + slmId).attr("data-hiddenInputId"));
		var lis = sel.children('option');
		var selections = [];
		for(var i = 0; i < lis.length; i++) {
			var lbl = $(lis[i]);
			selections.push(lbl.get(0).selected);
		}

		phoneui.gotoPage(pageId, transition, function() {
			for(var i = 0; i < lis.length; i++) {
				var lbl = $(lis[i]);
				if (lbl.get(0).selected != selections[i]) {
					// Fire "change" event
					var evt = document.createEvent("HTMLEvents");
				    evt.initEvent("change", true, true ); // event type,bubbling,cancelable
				    sel[0].dispatchEvent(evt);

					return;
				}
			}
		});
	}

	phoneui.gotoPage = function(pageId, transition, fnWhenBack) {
		var currentScreen = phoneui.getCurrentScreen();
		phoneui._whenBackHandlers[currentScreen.id] = fnWhenBack;
		var newScreen = phoneui.getPageByAnchorId(pageId);
		if (newScreen == null) {
			console.error('Page ' + pageId + ' not found');
			return;
		}
		if (callPreTransition(newScreen)) {
			window.location.hash = newScreen.id + ":" + 
				(transition || phoneui.transitions.slideLeft) + 
				(currentScreen ? ":" + ((+currentScreen.time) + 1) : "");
		}
	}
	/*
	function checkRuleExists(str) {
		if (!document.styleSheets.item(m1Design.root_css).rules.item(m1Design.css(str))) {
			console.error("RULE NOT FOUND " + str);
		}
	}
	*/
	
	function animateNavigation($new, $old, transition, revertTransition, fnAfterTransition) {		
		if(isSliding === false && ($new.attr('id') != $old.attr('id')))  {
			if ($new.length == 0) {
				console.error("Animation target page is not found");
				return; // Target page is not found
			}

			var tr = phoneui.transitions;
			var trNone = transition == tr.none;
			var trFade = transition == tr.fade;
			var trFlipRight = transition == tr.flipLeft;
			var trFlipLeft = transition == tr.flipRight;
			var trSlideRight = transition == tr.slideRight;			
			var trSlideUp = transition == tr.slideUp;
			var trSlideDown = transition == tr.slideDown;
			var trSlideLeft = transition == tr.slideLeft || transition == 'DEFAULT';
			
			isSliding = true;
			
			var afterTransition = function() {
				isSliding = false;
				fnAfterTransition();
				reinitscrollers($(currentScreen.anchor_id));
			}

			var doAfterTransition = function($el, fn) {
				var timer;
				var performAfterTrans = function() {
					clearTimeout(timer);
					fn();
					$el.unbind('webkitAnimationEnd', performAfterTrans);
				}
				/*
				// If 500ms is out but page didn't transite yet,
				// than timer should do the job
				timer = setTimeout(function() {
					console.error("NO TRANSITION, TIMER!");
					performAfterTrans();
				}, 600);
				*/

				$el.bind('webkitAnimationEnd', performAfterTrans);
			}
			
			var doAfterFinalTransition = function($el, fn) {
				doAfterTransition($el, function() {
					fn();
					afterTransition();
				});
			}

			var cssIn = m1Design.css("in"); 
			var cssOut = m1Design.css("out");
			if (trFade) {
				// checkRuleExists("fade");

				var cssFade = m1Design.css("fade") + " " + cssIn;
				doAfterFinalTransition($new, function () { 
					$old.hide();
					$new.removeClass(cssFade);
				});
				$new .show().css({left: '0px'}).addClass(cssFade);
			} else if (trFlipRight || trFlipLeft) {
				// checkRuleExists("flip");
				
				var reverse = (trFlipLeft == revertTransition) ? (" " + m1Design.css("reverse")) : "";
				var cssFlip = m1Design.css("flip");
				$old .addClass(cssFlip + " " + cssOut + reverse);
	
				doAfterTransition($old, function() {
					$old.hide();
					$old.removeClass(cssFlip + " " + cssOut + reverse);
					doAfterFinalTransition($new, function() {
						$new .removeClass(cssFlip + " " + cssIn + reverse).css({left: '0'});
					});
					$new.show().css({left: '0'}).addClass(cssFlip + " " + cssIn + reverse);
				});
			} else if (trSlideRight || trSlideLeft) {
				// checkRuleExists("slide");
				
				var cssSlide = m1Design.css("slide");
				var reverse = (trSlideLeft == revertTransition) ? (" " + m1Design.css("reverse")) : "";
				doAfterFinalTransition($new, function() {
					$old.hide();
					$old.removeClass(cssSlide + " " + cssOut + reverse);
					$new.removeClass(cssSlide + " " + cssIn + reverse);
				});
				
				$old .addClass(cssSlide + " " + cssOut + reverse);
				$new .show().addClass(cssSlide + " " + cssIn + reverse);
			} else if (trSlideUp || trSlideDown) {
				// checkRuleExists("slidev");
				
				var cssSlide = m1Design.css("slidev");
				var reverse = (trSlideUp == revertTransition) ? (" " + m1Design.css("reverse")) : "";
				doAfterFinalTransition($new, function() {
					$old.hide();
					$old.removeClass(cssSlide + " " + cssOut + reverse);
					$new.removeClass(cssSlide + " " + cssIn + reverse);
				});

				$old .addClass(cssSlide + " " + cssOut + reverse);
				$new .show().addClass(cssSlide + " " + cssIn + reverse);
			} else {
				// No animation for "NONE" transitions
				$old.hide();
				$new.css({left:'0px', display:'block'});
				// 0 timeout is required here, otherwise list item highlighting
				// won't work properly
				setTimeout(afterTransition, 0);
			}
		}
	};
	
	function reinitscrollers(root) {
		root.find('.' + m1Design.css("iscroll-scroller")).each(function() {
			var el = $(this).get(0);
			if (el.myScroll) {
				el.myScroll.refresh();
			}
		});
	}

	function doHref(href) {
		// Special processing for SMS URL - they do not work in standalone mode
		// when set directly as window.location.href. So, we're implementing
		// workaround here
		var el = jQuery('<a href="' + href + '" style="position:absolute;"/>')
			.appendTo(document.body);
		var e = el[0];

		var evt = e.ownerDocument.createEvent('MouseEvents');
		evt.initMouseEvent('click', true, true, 
				e.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		e.dispatchEvent(evt);
		el.remove();		
	}
	
	phoneui.callPhone = function(number) {
		number = $.trim(number);
		if ("PhoneGap" in window) {
		    PhoneGap.exec(null, null, "PhoneDialer", "dialPhone", [{"number":number,}]);
		} else {
			doHref("tel:" + number);
		}
	}
	
	phoneui.sendSms = function(number) {
		number = $.trim(number);
		doHref("sms:" + number);
	}

	function setNewScreen(nextScreen) {
		if (!nextScreen.equals(currentScreen)) {
			if (callPreTransition(nextScreen)) {
				// Add timestamp
				window.location.hash = nextScreen.id + ":" + ((+currentScreen.time) + 1);
			}
		}		
	}
	
	function setNewLocation(href) {
		if (href.match(/^#/)) {
			var nextScreen = parseAnchor(href);
			setNewScreen(nextScreen);
		} else if (href.match(/^sms:/i)) {
			doHref(href);
		} else if (href.match(/^tel:/i)) {
			phoneui.callPhone(href.substr(4));
		} else {
			window.location.href = href;
		}		
	}
	
	function unclickme($that) {
		if ($that.length > 0) {
			// Delaying "addClass(m1Design.css("unclicked"));" to 0 ms - because we can 
			// set "clicked" just in same message loop iteration. So we need to wait
			// until effect of "clicked" class appears, otherwise it won't look good.
			setTimeout(function() {
				// We shouldn't remove "clicked" just now, otherwise animations won't work
				$that.addClass(m1Design.css("unclicked"));
				// Delay dropping "clickable" for 100 ms, allow all effects to be drawn 
				setTimeout(function() {
					$that.removeClass(m1Design.css("unclicked")).removeClass(m1Design.css("clicked"));
				}, 150);
			}, 0);
		}
	}
	
	var timeMs = function() {
		return (new Date()).getTime();
	}

	// This function is called for each page to initialize it's controls
	var lastScrollTime = timeMs();

	var eventHandlers = {};
	var openedWheel = false;
	var processSLM;
	var processSL;
	
	function preProcess(context) {	
		var clickeable = $('.' + m1Design.css("clickable"), context);
		
		$('.' + m1Design.css("iscroll-scroller"), context).each(function() {
			var el = $(this).get(0);

			if (!('myScroll' in el)) {
				el.myScroll = new iScroll(el, { 
					hScrollbar : false, 
					vScrollbar : true, 
					bounce: $(this).attr('data-bounce') == 'true',
					desktopCompatibility : true,
					shouldPreventDefault : function(el) {
						var clname = m1Design.css("iscroll-no-prevent-default");
						for (;el != document.body && 
							!($(el).hasClass(clname) || $(el).is('input'));
							el = el.parentElement) {
						}
						return el == document.body;
					}, 
					onUserScroll : function(s) {
						lastScrollTime = timeMs();
					},
					onScrollStart : function() {
						clickeable = $('.' + m1Design.css("clickable"), context);

						// Vadim.Ridosh: I can't remove "filter", otherwise bouncing effect is broken.
						clickeable.filter("." + m1Design.css("unclicked")).removeClass(m1Design.css("unclicked"));
						clickeable.filter("." + m1Design.css("clicked")).removeClass(m1Design.css("clicked"));
					}
				});
			}
		});

		var highlightClick = function($that) {
			$that.data('warmupStartTime', 0);
			$that.removeClass(m1Design.css("unclicked")).addClass(m1Design.css("clicked"));
		}
		
		var doClick = function($that) {
			var last = $that.data('lastClick');
			if (!last || (last + 300) < timeMs()) {
				$that.data('lastClick', timeMs());
				
				// Fire "doclick" event
				var event = document.createEvent("MouseEvents");
				event.initEvent("doclick", true, true);
				$that[0].dispatchEvent(event);
			}
		}	

		var createEventSunbscription = function(evName, attrId) {
			var elements = $("[" + attrId + "]", context);
			
			eventHandlers[attrId] = eventHandlers[attrId] || function(event) {
				var ex;
				try {
					var actionId = $(event.target).attr(attrId);
					m1Design.actions[actionId]();
				} catch (ex) {
					console.error(ex);
				}
			};  

			var ex;
			try {
				elements.unbind(eventHandlers[attrId]);
			} catch (ex) {
			}
			elements.bind(evName, eventHandlers[attrId]);
		}

		createEventSunbscription('doclick', 'data-action-click-id');
		createEventSunbscription('change', 'data-action-change-id');
	
		$("." + m1Design.css("hyperlink"), context).bind("doclick", function(event) {
			var href = $(event.target).attr('href');
			if (href) {
				setNewLocation(href);
			}
		});

		// Support for elements that contain links but not clickable
		$('.' + m1Design.css("hyperlink") + ':not(' + '.' + m1Design.css("clickable") + ')', context).click(function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			doClick($(this));
		});

		clickeable.bind((phoneui._platform.touchevents() ? "touchstart" : "mousedown"), function(event) {
			if (!isSliding && !(event.originalEvent && event.originalEvent.phoneuiprocessed)) {
				var $that = $(this); 
				if (!$that.data('warmupStartTime') || 
						(lastScrollTime >= + ($that.data('warmupStartTime')))) {
					$that.data('warmupStartTime', timeMs());
					setTimeout(function() {
						if (lastScrollTime <= $that.data('warmupStartTime')) {
							highlightClick($that);
						}
					}, 200);
				}

				if (event.originalEvent) {
					event.originalEvent.phoneuiprocessed = true;
				}
			}
		});
		
		clickeable.bind((phoneui._platform.touchevents() ? "touchcancel touchend" : "mouseleave mouseup"), function(event) {
			var click = event.type == "touchend" || event.type == "mouseup"; 
			var $that = $(this);
			if (!(event.originalEvent && event.originalEvent.phoneuiprocessed)) {
				if (click && (lastScrollTime <= +($that.data('warmupStartTime')))) {
					highlightClick($that);
				}

				if ($that.is("." + m1Design.css("clicked")) && !$that.is("." + m1Design.css("unclicked"))) {
					// special case below - list items with hyperlink will lose selection
					// only when we're returning back to the page
					if (!$that.is("." + m1Design.css("hyperlink-internal")) ||
						$that.is("." + m1Design.css("button"))) {
						unclickme($that);
						if (event.originalEvent) {
							event.originalEvent.phoneuiprocessed = true;
						}
		
						if ($that.is('.' + m1Design.css("selection-list") + ' > li[data-val]')) {
							tableListMngt($that, $that.is('.' + m1Design.css("immediate-change-fire") + ' > li[data-val]'));
						};
					}
	
					if (click) {
						doClick($that);
					}
				}
			}
		});

		var moveHiddenInputOverFake = function (el, fakeEl) {			
			var off = {left:0, top:0};
			for (var op = fakeEl; op != null; op = op.offsetParent) {
				off.left += op.offsetLeft;
				off.top += op.offsetTop;
				
				if (op.myScroll) {
					off.left += op.myScroll.x;
					off.top += op.myScroll.y;
				}
			}
			
			el.parentElement.style.left = off.left + "px";
			el.parentElement.style.top = off.top + "px";
		};
		
		processSL = function(v, context) {
			var sel = $("#" + $(v).attr("data-hiddenInputId"), context);
			var lis = sel.children('option');
			var li = $(v).children('li');
			for(var i = 0; i < lis.length; i++) {
				var lbl = $(lis[i]);
				$(li[i])
					[lbl.get(0).selected ? 'addClass' : 'removeClass']
						(m1Design.css("selected"));				
			}
		};
		
		// Support for "spinner mode" in SLM
		processSLM = function(v, context) {
			var sel = $("#" + $(v).attr("data-hiddenInputId"), context);
			var verboseItemsInfo = $(v).attr("data-verbose-items-info") == "true";
			var selInfoId = $("#" + $(v).attr("data-selectionInfoId"), context);
			if (selInfoId) {
				var onSelectionChange = function() {
					var labelsArray = [];
					var lis = sel.children('option');
					for(var i = 0; i < lis.length; i++) {
						var lbl = $(lis[i]);
						if (lbl.get(0).selected) {
							labelsArray.push(lbl.text());
						}
					}
					if ($(v).attr('data-multiple')=='false') {
						selInfoId.text(labelsArray[0]);
					} else {
						if (verboseItemsInfo) {
							selInfoId.text(labelsArray.length == 1 ?
									(labelsArray[0]) :
									(labelsArray.length + " Items"));
						} else {
							selInfoId.text("" + labelsArray.length);
						}
					}
				}

				onSelectionChange();
				sel.unbind('change', onSelectionChange).bind('change', onSelectionChange);
				// For iOS4 support, subscribe to blur too
				sel.unbind('blur', onSelectionChange).bind('blur', onSelectionChange);
				moveHiddenInputOverFake($(sel)[0], $(v)[0]);
			}
		};

		$('.' + m1Design.css('select-list-menu-spinner') + "," +
			'.' + m1Design.css('select-list-menu') , context).each(function(i, v) {
				processSLM(v, context)
			});

		$('input select').bind('focus blur', function() {
			$('.' + m1Design.css('select-list-menu-spinner'), context).each(function(i, v) {	
				var sel = $("#" + $(v).attr("data-hiddenInputId"));			
				var el = sel.get(0);

				moveHiddenInputOverFake(el, $(v)[0]);
			});
		});

		$('.' + m1Design.css("select-list-menu-spinner"), context).click(function(e) {
			if (phoneui._platform.nativespinner) {
				var sel = $("#" + $(this).attr("data-hiddenInputId"));
				var el = sel.get(0);
	
				moveHiddenInputOverFake(el, $(this)[0]);
	
				var evt = el.ownerDocument.createEvent('MouseEvents');
				evt.initMouseEvent('mousedown', true, true, el.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
				el.dispatchEvent(evt);
			} else if (m1Design.softSpinnerEnabled) {
				var $that = $(this);
				var sel = $("#" + $that.attr("data-hiddenInputId"));
				var multi = $that.attr('data-multiple') != 'false';
				
				if (openedWheel) {
					// Previous instance was not close yet
					return;
				}
				
				openedWheel = true;
				
				var selectedValues = {}; 
				var data = [];
				// Update options states
				sel.children('option').each(function(i, e) {
					if (this.selected) {
						selectedValues[i] = true;
					}
					data.push({ value : this.value , text : this.text, index : i });
				});
				if (!multi) {
					selectedValues[sel[0].selectedIndex] = true;
				}

				SpinningWheel.addSlot(data, "", selectedValues);
				SpinningWheel.setCancelAction(function() {  
					openedWheel = false;
				});
				SpinningWheel.setSelectedAction(function(val, tt) { 
					
				});
				SpinningWheel.setDoneAction(function() {
					openedWheel = false;
					var results = SpinningWheel.getSelectedValues();
					sel.children('option').each(function(i, e) {
						for (var j in results.keys[0]) {
							if (i == results.keys[0][j]) {
								this.selected = true;
								return;
							}
						}
						this.selected = false;
					});
					processSLM($that, context);
					
					// Fire "change" event
					var evt = document.createEvent("HTMLEvents");
				    evt.initEvent("change", true, true ); // event type,bubbling,cancelable
				    sel[0].dispatchEvent(evt);
				    
					return;
				});

				SpinningWheel.open(multi);	
			}
		});		

		jQuery.each($('.' + m1Design.css("selection-list")), function(i, v) {
			processSelectionList(v, false);
		});
	}
	preProcess($('.' + m1Design.css("top-root")));
	
	phoneui.preprocessDOM = function(rootNode) {
		preProcess($(rootNode));
	}

	if ('documentReadyHandler' in phoneui) {
		phoneui.documentReadyHandler();
	} 
	
	function processSelectionList(elt, fireChangedEvent) {
		var selInfoId = $("#" + $(elt).attr("data-selectionInfoId"));
		var labelsArray = [];
		var resultMap = {};
		var lis = $(elt).children('li[data-val]');
		for(var i = 0; i < lis.length; i++) {
			var lbl = $(lis[i]);
			if(lbl.hasClass(m1Design.css("selected"))) {
				resultMap[lbl.attr('data-val')] = true;
				if (selInfoId) {
					labelsArray.push(lbl.text());
				}
			}
		}
		var hiddenSel = $("#" + $(elt).attr("data-hiddenInputId"));

		// Update options states
		hiddenSel.children('option').each(function() {
			this.selected = resultMap[this.value];
		});

		if (selInfoId) {
			if ($(elt).attr('data-multiple')=='false') {
				selInfoId.text(labelsArray[0]);
			} else {
				selInfoId.text("" + labelsArray.length);
			}
		}

		if (fireChangedEvent) {
			// Firing "change" event for hidden select
			var e = document.createEvent('HTMLEvents');
	        e.initEvent('change', true, true);
	        hiddenSel[0].dispatchEvent(e);
		}
	}
	
	function tableListMngt(item, fireEvent) {		
		var elt = $(item).closest('ul')[0];	 
		if($(elt).attr('data-multiple')=='false') {
			$(elt).children('li[data-val]').removeClass(m1Design.css("selected"));
			$(item).addClass(m1Design.css("selected"));
		} else {
			if ($(item).is("." + m1Design.css("selected"))) {
				$(item).removeClass(m1Design.css("selected"));
			} else {
				$(item).addClass(m1Design.css("selected"));
			}
		}
		processSelectionList(elt, fireEvent);
	}
			
	function SetCookie(sName, sValue) {
			document.cookie = sName + "=" + escape(sValue);
			var date = new Date();
			var expdate = date.getTime();
			expdate += 3600*1000 //expires (milliseconds - 1000 is for a day)
			date.setTime(expdate);
			document.cookie += ("; expires=" + date.toUTCString());
	}
	
	function GetCookie(sName) {
			var aCookie = document.cookie.split("; ");
			for (var i=0; i < aCookie.length; i++)
			{
					var aCrumb = aCookie[i].split("=");
					if (sName == aCrumb[0])
							return unescape(aCrumb[1]);
			}
			return null;
	}

	var cname = 'phc';
	var hsp = $('.' + m1Design.css('homescreen-prompt'));
	if(!(window.PhoneGap) &&
			window.navigator.standalone != true && 
			!!window.navigator.userAgent.match(/(iphone|ipod|ipad)( simulator)?;/i)) {
		if(GetCookie(cname)) {
			// Hide the dialog box - to avoid scrolling
			hsp.hide();
		} else {
			// Show prompt dialog
			SetCookie(cname,'true');
			var s = phoneui._platform.docsize();
			var onipad = window.navigator.userAgent.toLowerCase().indexOf('ipad')!=-1;

			if (hsp.length > 0) {
				var canvas = hsp[0];
				var ctx = canvas.getContext("2d");
				var myImage = new Image();
				var top = onipad ? 40 : 30;
				var myIconLoaded = false;
				var myImageLoaded = false;
				myImage.onload = function() {
					myIconLoaded = true;
				};
				var myIcon = new Image();
				myIcon.onload = function() {
					myImageLoaded = true;
				};
				myImage.src = "res/images/homescreenPrompt.png";
				myIcon.src = "res/images/icon.png";
	
				var startCss = {opacity: '0.0'};
				var endCss = {opacity: '1.0'};
				if (onipad) {
					startCss['top'] = (- 100) + 'px';
					endCss['top'] = '0px';
					hsp.css({ left : '82px'});
				} else {
					startCss['top'] = (s.y - 20) + 'px';
					endCss['top'] = (s.y - 120) + 'px';
					hsp.css({ 'margin-left' : '-125px'});
				}
				hsp.css(startCss);
	
				var transitionF = function() {
					if (!myImageLoaded || !myIconLoaded) {
						setTimeout(transitionF, 50);
						return;
					}
					ctx.save();
					if (onipad) {
						ctx.translate(0, canvas.height);
					}
					ctx.scale(canvas.width/myImage.width, 
							(onipad ? -1 : 1)*canvas.height/myImage.height);
					ctx.drawImage(myImage, 0, 0);
					ctx.restore();
					ctx.font = "16px Helvetica";
					var t = ['Click button to', 'add this page to', 'your homescreen'];
					t.forEach(function (e, i) {
						ctx.fillText(e, 110, top + 10 + i * 20);	
					});
	
					ctx.drawImage(myIcon, 30, top);
	
					hsp .animate(
						endCss, 
						{duration: 400, complete: function() {
							setTimeout(function() { hsp .animate({opacity: '0'}, {
								duration:400,
								complete: function() { hsp .hide(); }
							})}, 5000);
						} }); 
				};
				setTimeout(transitionF, 0);
			}
		}
	} else {
		hsp .hide();
	}
}); 

if (m1Design.shouldHideAddressBar) {
	window.addEventListener("load", function() {
		phoneui._platform.initAddressBarHiding();
	}, false);
}

document.addEventListener('DOMContentLoaded', function() {
	document.addEventListener('touchmove', function(e){ e.preventDefault(); });
});

/**
 * Page Transition Effects
 */
phoneui.transitions = {
	none : 'NONE',
	fade : 'FADE',
	flipRight : 'FLIP_RIGHT',
	flipLeft : 'FLIP_LEFT',
	slideRight : 'SLIDE_RIGHT',			
	slideLeft : 'SLIDE_LEFT',
	slideUp : 'SLIDE_UP',
	slideDown : 'SLIDE_DOWN'
};

/**
 * shows alert and calls fnContinue then. Note: works in different
 * ways in iOS and TC. For TC it returns immediately, while for iOS
 * it returns only when user pressed OK 
 */
phoneui.alert = function(message, fnContinue) {
	if (window['_mobione_dialogs']) {
		_mobione_dialogs.alert(message, fnContinue || function() {});
	} else {
		alert(message);
		if (fnContinue) {
			fnContinue();
		}
	}
}

/**
 * Navigate to page with transition effect
 *
 * @param pageId String 
 * @param transition, The phoneui.transitions visual effect 
 */
phoneui.gotoPage;

/**
 * Navigate to previous URL in history
 */
phoneui.back = function() {
	history.go(-1);
}

/**
 * Returns page object from passed anchorId (id of root HTML element for the page)
 */
phoneui.getPageByAnchorId = function(anchorId) {
	for (var p in m1Design.pages) {
		var page = m1Design.pages[p];
		if (page.anchor_id == anchorId || (page.anchor_id == ('#' + anchorId))) {
			return page;
		}
	}
	return null;
}

/**
 *  Show a small dialog composed of an animated graphic and an optional text 
 *  message. Use this function to indicate to the user that a potentially
 *  long running activity is underway, such as loading resources or waiting for
 *  computation to complete.
 *
 *  @param text option String message to show
 *  @see #hideActivityDialog
 */
phoneui.showActivityDialog = function (text) {
	if (!text && (text != "")) {
		text = "Loading..."; 
	}

	$('.' + m1Design.css('loading-text')) .html(text);

	if (!phoneui.showActivityDialog.controller) {
		var canvas = $('.' + m1Design.css("loading-spinner"))[0];
	
		var ctx = canvas.getContext("2d");
		var bars = 12;
		var currOffs = 0;
	
		function draw(ctx, offset) {
			clearFrame(ctx);
			ctx.save();
			ctx.translate(15, 15); // Center coordinates
			for(var i = 0; i<bars; i++){
				var cb = (offset+i) % bars;
				var angle = 2 * Math.PI * cb / bars;
	
				ctx.save();
				ctx.rotate(angle);
	
				var op = (1 + i)/bars;
				ctx.fillStyle = "rgba(255, 255, 255, " + op*op*op + ")";			
				ctx.fillRect(-1, 3, 2, 6);
	
				ctx.restore();
			}
			ctx.restore();
		}
		function clearFrame() {
			ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
		}
		function nextAnimation(){
			currOffs = (currOffs + 1) % bars;
			draw(ctx, currOffs);
		}
		phoneui.showActivityDialog.controller = {
			timer: -1,
			stop: function (){
				clearFrame();
				clearInterval(this.timer);
			},
			start: function (){
				this.timer = setInterval(nextAnimation, 80); // 20 fps
			}
		};
	}
	phoneui.showActivityDialog.controller.start();

	$('.' + m1Design.css('loading')) .show();
}

/**
 *  Terminate the activity dialog and remove it from the display. 
 *  This function is a NOP if the activity dialog is not already exposed.
 *
 *  @see #showActivityDialog
 */
phoneui.hideActivityDialog = function () {
	if (phoneui.showActivityDialog.controller) {
		phoneui.showActivityDialog.controller.stop();
	}
	$('.' + m1Design.css('loading')) .hide();
}

/**
 *  Should be called for each new DOM tree to pre-process elements
 *  (f.e. required for lists to have clickable behavior). Can be called
 *  only after document is loaded.
 */
phoneui.preprocessDOM;

/**
 * Returns true for standalone pages
 */
phoneui.isStandalone = function() {
	return "standalone" in window.navigator && window.navigator.standalone;
}

phoneui.callPhone;
phoneui.sendSms;

/**
 *  Current PhoneUI framework version info
 */
phoneui.version = { 
	major : 0, 
	minor : 1, 
	maintenance : 12, 
	toString : function() {
		return this.major + "." + this.minor + "." + this.maintenance;
	}
}