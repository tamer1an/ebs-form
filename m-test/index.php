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
	// define ('JS',SYS_URL.'js/libs/');
	// define ('JQ',JS.'jq/'); 
		// define ('JQCDN','//code.jquery.com/jquery-1.8.1.min.js');
		// Development (Full) version
		// http://code.jquery.com/jquery-1.8.1.js 	

		
	// SOCIAl & SEO DATA
	define ('DESC',"Memonic test");
	define ('SITE_NAME','Memonic'); 
	define ('TITLE','Memonic test'); 
	define ('TYPE','test'); 
?>

<!DOCTYPE html>
<html lang="en" manifest="offline/memonic.manifest" itemscope itemtype="http://schema.org/Review">
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
 		 
    <!--[if lte IE 8]>
		  <link  href="<?=CSS?>ie8.css" rel="stylesheet" type="text/css" media="screen">
		   <script src="js/script.js"></script>
	  <![endif]--> 
</head>

<body class="fc"> <!--  onload="init()" -->
  <section id="page" class="w98pc" data-role="page">
	<header data-role="header">
		<p class="ptb15 header h1"> Our dinamic home page </p>
	</header>
	
	<section class="pb15" data-role="content">
		<p id="title"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mollis pulvinar augue, at pellentesque urna vehicula non. Aenean facilisis pellentesque dapibus. Aliquam sodales eros viverra odio semper consectetur. Sed tempus dapibus nibh, eget imperdiet neque ullamcorper quis. Vestibulum consectetur, arcu malesuada sollicitudin pretium, lacus risus mollis enim, a adipiscing nunc nibh sit amet mauris. Duis pellentesque, nunc nec scelerisque convallis, est velit convallis velit, quis luctus est est quis magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pretium dictum nisl iaculis mollis. Aliquam convallis rutrum erat ut mollis. Donec congue urna sit amet mauris malesuada et dignissim libero iaculis. </p>
		<ul class="pt15 dotList">
			<li itemprop="url"><a href="application/view/section/1/" target="section">Section 1</a></li>
			<li itemprop="url"><a href="application/view/section/2/" target="section">Section 2</a></li>
			<li itemprop="url"><a href="application/view/section/3/" target="section">Section 3</a></li>
		</ul>
	</section>
	
	<footer itemprop="review" data-role="footer"> 
		<iframe id="sIframe" name="section" frameborder="0" height="300px" width="500px" scrolling="no" src=""></iframe>
	</footer>
  </section>
  <!-- Support IE 7 (Print page)-->
   <!--[if lte IE 7]>
		 <script type="text/javascript" src="print.js"></script>
	  <![endif]--> 
	  
   <!-- JavaScript -->
  <!-- jQuery 1.8.1 --> 
  <!--script src="<=JQCDN?>"></script> 
  <script>window.jQuery || document.write('<script src="<=JQ?>jq.js"><\/script>')</script-->
</body>
</html>