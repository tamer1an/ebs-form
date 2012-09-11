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


<html lang="en">
<head> 
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="author" content="Developed by Trybynenko Andrii">
  
  <!-- CSS reset -->
  <link title="screen style" href="<?=CSS?>base_style.css" 	rel="stylesheet" type="text/css">
  
  <!-- main & mobile CSS -->
  <link  href="<?=CSS?>style.css" 		rel="stylesheet" type="text/css" media="screen">
	
  <!-- CSS for printing page-->
  <link  href="<?=CSS?>print.css" 		rel="stylesheet" type="text/css" media="print"> 
</head>

<body class="fc"> <!--  onload="init()" -->
  <section  class="w100pc" data-role="page">
	<header class="ptb15 header h2"> Sction 3 </header>
	
	<section>
		<p> this is the third section</p>
	</section>
		
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