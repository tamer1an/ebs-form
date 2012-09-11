<?php //CONSTANTS
	// "Server details"
	define ('NAME',$_SERVER['SERVER_NAME']  );
	define ('ADDR',$_SERVER['SERVER_ADDR']  );
	define ('PORT',$_SERVER['SERVER_PORT']  );
	define ('RQ_URL',$_SERVER['REQUEST_URI']);

	// ==== INSURE FOR CORRECT PATH HERE ====
	define('SYS_URL','http://'.NAME.'/ebs-form/m-test/');

	// "IMG"
	define('IMG',SYS_URL.'images/');

	// "CSS"
	define ('CSS',SYS_URL.'style/');
		// define('GOOGLE_FONT','http://fonts.googleapis.com/css?family=');

	// "JavaScripts"
	define ('JS',SYS_URL.'js/libs/');
	define ('JQ',JS.'jq/'); 
		define ('JQCDN','//code.jquery.com/jquery-1.8.1.min.js');
		// Development (Full) version
		// http://code.jquery.com/jquery-1.8.1.js 	

		
	// SOCIAl & SEO DATA
	define ('DESC',"Memonic test");
	define ('SITE_NAME','Memonic'); 
	define ('TITLE','Memonic test'); 
	define ('TYPE','test'); 
	
	// <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
	// <html xmlns="http://www.w3.org/1999/xhtml" itemscope itemtype="http://schema.org/Review" dir="ltr" lang="en-US">
?>

<!DOCTYPE html>
<html lang="en" manifest="offline/memonic.manifest">
<head> 
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="author" content="Developed by Trybynenko Andrii">
  <meta name="application-name" content="<?=SITE_NAME?>"/>
  <title><?=TITLE?></title>
  
  <!-- SOCIAl & SEO DATA -->
  <meta itemprop="name" 			content="<?=TITLE?>">
  <meta itemprop="description"  	content="<?=DESC?>" >
  <meta itemprop="image" 			content="<?=IMG?>logo.png">	
  
  <meta property="og:title" 		content="<?=TITLE?>"/>
  <meta property="og:description" 	content="<?=DESC?>"/>
  <meta property="og:image" 		content="<?=IMG?>logo.png"/>
  <meta property="og:type"   		content="<?=TYPE?>"> 
  <meta property="og:url" 			content="<?=SYS_URL?>"/>
  <meta property="og:site_name"   	content="<?=SITE_NAME?>"/>
  
  <!-- DEVICE CONFIG -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.9, user-scalable=yes" />
  <meta name="apple-mobile-web-app-capable" 			content="yes" /> <!-- full screen -->
  <meta name="apple-mobile-web-app-status-bar-style" 	content="black-translucent"> <!-- clock bar color -->
  <!--meta name="format-detection" content="telephone=no"--> 
  
  <!-- ICONS <base href="http://images/" target="_blank" /> --> 
  <link href='favicon.ico' rel='shortcut icon' type='image/x-icon'/>
  <link rel="apple-touch-startup-image" href="load_screen.png" /> 
  <link rel="apple-touch-icon" sizes="72x72" href="touch-icon-ipad.png" />
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="touch-icon-iphone4.png" />
  
  <!-- CSS reset -->
  <!-- YUI3 CSS reset --> <!--link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/3.6.0/build/cssreset-context/cssreset-context-min.css"-->
  <!-- my light reset & base CSS -->
  <link title="screen style" href="<?=CSS?>base_style.css" 	rel="stylesheet" type="text/css">
  
  <!-- main & mobile CSS -->
  <link  href="<?=CSS?>style.css" 		rel="stylesheet" type="text/css" media="screen">
	<!--link  href="mobile_transitions" 	rel="stylesheet" type="text/css" media="screen" -->
	
  <!-- CSS for printing page-->
  <link  href="<?=CSS?>print.css" 		rel="stylesheet" type="text/css" media="print"> 
 		
  <!-- modernizr 2.6.2 custom build --> 
  <script src="<?=JS?>modernizr.js"></script>
</head>

<body class="fc"> <!--  onload="init()" -->
  <section id="page" class="w100pc" data-role="page">
	<header class="ptb15"> Our dinamic home page </header>
	<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mollis pulvinar augue, at pellentesque urna vehicula non. Aenean facilisis pellentesque dapibus. Aliquam sodales eros viverra odio semper consectetur. Sed tempus dapibus nibh, eget imperdiet neque ullamcorper quis. Vestibulum consectetur, arcu malesuada sollicitudin pretium, lacus risus mollis enim, a adipiscing nunc nibh sit amet mauris. Duis pellentesque, nunc nec scelerisque convallis, est velit convallis velit, quis luctus est est quis magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pretium dictum nisl iaculis mollis. Aliquam convallis rutrum erat ut mollis. Donec congue urna sit amet mauris malesuada et dignissim libero iaculis. </p>
	<ul class="pt15 dotList">
		<li><a href="#">Section 1 </a></li>
		<li><a href="#">Section 2 </a></li>
		<li><a href="#">Section 3 </a></li>
	</ul>
  </section>
  
  <!-- JavaScript -->
  <!-- jQuery 1.8.1 --> 
  <script src="<?=JQCDN?>"></script> 
  <script>window.jQuery || document.write('<script src="<?=JQ?>jq.js"><\/script>')</script>
 
  <script src="js/script.js"></script>
  <!-- Support IE 7 (Print page)-->
   <!--[if lte IE 7]>
		 <script type="text/javascript" src="print.js"></script>
	  <![endif]--> 
</body>
</html>

<?
/*
 * 
 * http://screencast.com/t/pdFedjHWZU
 
	This is the small project we'd like you to complete for your interview at Memonic. You can send us the result as a ZIP file when you're ready.

	Task 1:
		Replicate the page from the screencast at <http://screencast.com/t/pdFedjHWZU> inluding the navigation to the various sections. 
		You can only rely on HTML and CSS for that. No JavaScript should be needed. The result only has to work correctly in Google Chrome.

	Task 2:
		Create the navigation from task 1 (Section 1, Section 2, Section 3) so it also works in Internet Explorer 8+. Try to create the JavaScript i
		n as unobtrusive a manner as possible. Do not rely on any JavaScript library.
*/