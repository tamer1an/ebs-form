<? 
if(count($_POST)>0){
	$errors = array();
	foreach($_POST as $k => $v)
		switch ($k){
			case 'name':
			case 'date':
			case 'email':
				if (empty($v))
					$errors[$k] = false;
			break;
		}
		
	if( count($errors) >0 ){
		 echo json_encode($errors);
		 exit;
	} else {
		$document = simplexml_load_file("db.xml"); 
		$person = $document->addChild('person');
		$person->addChild('name',$_POST["name"]);
		$person->addChild('date',$_POST["date"]);
		$person->addChild('email',$_POST["email"]);
		$person->addChild('phone',$_POST["phone"]);
		$person->addChild('comment',$_POST["comment"]);
		$person->addChild('senddate',$_POST["senddate"]);

		$document->asXML("db.xml"); 
		exit;
	}
} 

if(isset($_GET['getContent'])){
	getTableBody();
	exit;
}
// <!DOCTYPE html>
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" 
"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" itemscope itemtype="http://schema.org/Review" dir="ltr" lang="en-US">
<head>
	<?include ('head.php');?>
</head>
<body class="pt77">
<? 
$_GET['rout'] = empty($_GET['rout'])? 'form' : $_GET['rout'];

switch ($_GET['rout']) {
	case 'form': ////////// Fill form markup?>
	
<div id="wrapper" class="w70pc ma">
	<section id="main_content" class="f w100pc mb5pc">
		<div class="fw430-950 h100pc brr12 bgw ma block brs2 mw311"> 
			<form method="post" id="main_form" action="index.php" accept-charset="utf-8">
			  <fieldset id="personal_information">
				<legend class="f w90pc h25 pl15 pt5 fc fwb">Please fill form</legend>
				<ul class="main_form mt3">                                                                                             
					<li class="f w100pc">	 
						<label class="fw120-450" for="name">Name</label> 
						<input required="required" autofocus="true" placeholder="Required" title="Required" id="name" class="mr15" name="name" type="text"/> 						
					</li>
					<li class="f w100pc mt2">
						<label class="fw120-450" for="date">Date of birth</label>
						<input pattern="(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d" required="required" placeholder="Required (DD.MM.YYYY)" id="date" class="mr15" title="Required (DD.MM.YYYY)" name="date" type="date"/> 
					</li>
					<li class="f w100pc mt2">
						<label class="fw120-450" for="email">Email</label> 
						<input required="required" placeholder="Required" title="Required" type="email" name="email" id="email" class="mr15" />      
					</li>
					<li class="f w100pc mt2">
						<label class="fw120-450" title="+55 (555) 555-55-55" for="phone">Phone</label> 
						<input placeholder="+55 (555) 555-55-55" name="phone" title="+55 (555) 555-55-55" id="phone" class="mr15" type="text" />      
					</li>
					<li class="f w100pc mt2">
						<label class="fw120-450" title="English only" for="comments">Comments</label> 
						<textarea placeholder="English only" name="comment" title="English only"  id="comment" class="oa mr15 h110"></textarea>				
                    </li>
					<li class="f w100pc mt15">
						<label class="fw120-450" for="weekly" title="Subscribe for updates">Send updates on </label> 
						<div class="r fw269-450 mr15"> 
							<div class="f"> 
								<div class="r mr15 block"> 
									<input checked value="2" title="Subscribe for monthly updates" id="monthly" class="fi mr5" name="senddate" type="radio" /> 
									<span class="f ml5"> monthly basis </span> 
								</div>
								<div class="r mr15 block  mw100">
									<input title="Subscribe for weekly updates" value="1" id="weekly" class="f mr5" name="senddate" type="radio" /> 
									<span class="f ml5"> weekly basis </span> 
								</div>
							</div>
						</div>
					</li>
					<li class="f w100pc mt8">
						<div class="r mr15 mb15">
							<input id="contact-submit" name="submit_form" class="cp send_button" value="" type="submit"/> 
						</div>
					</li>
				</ul>
			  </fieldset>
			</form>
		</div>
	</section>
	<a class="f" href="index.php?rout=updates">Subscription base </a>
</div>

<? break; ////////// Subscription result table markup
	case 'updates':?>
	
<div id="wrapper" class="bgr w70pc ma">
	<section id="main_content" class="f w100pc mb5pc">
		<div class="w70pc h100pc block ma mw600"> 
		<div class=" f h100pc w100pc brr12 bgw brs2 mw311 fc fflucida"> 
			<h1 class="f w90pc h25 pl15 pt12 fc fwb">Subscription base</h1>
			<table id="subscribe_table" class="fs13"> 
				<?
					getTableBody();
				?>
			</table>
			<div class="r mr15 mb15 cl pt12">
				<input id="load-submit" class="cp" value="" type="submit"/> 
			</div>
		</div>
		</div>
	</section>
	<a class="f" href="index.php">Fill form</a>
</div>

<? break;
} //end switch $_GEt['rout']?>
<div id="logo" class="f bgr w100pc h780 mt100 block cl"> </div>
</body>
</html>

<?
function getTableBody(){
	echo '<tr class="f fwb fs14 brbs2a"> 
		<td> Name </td>
		<td> Birthday </td>
		<td> E-mail </td>
		<td> Update </td>
	</tr>';
	
	$senddate = array(1=>'weekly',2=>'monthly',3=>'empty');
	$document = simplexml_load_file("db.xml");
	foreach ($document->children() as $person) {
		$subscribe = $person->senddate;
		if($subscribe!='1' && $subscribe!='2')
			$subscribe=3;
						
		echo "<tr>
				<td>&nbsp {$person->name} </td>
				<td>&nbsp {$person->date} </td>
				<td>&nbsp {$person->email} </td>
				<td>&nbsp {$senddate[trim($subscribe)]} </td>
			</tr>";
	}
}

/*
<!-- contenteditable="true" 

	  li>span[contenteditable=true]:hover{ 
		background-color: #ffc;
	  }
	  
	  li>span[contenteditable=true]:focus{ 
		background-color: #ffa;
		border: 1px shaded #000;
	}
-->
<!-- CSS for printing page-->
	<link rel="stylesheet" href="print.css" type="text/css" media="print">
	<!--[if lte IE 7]>
		<script type="text/javascript" src="print.js"></script>
    <![endif]-->
*/ 	
?>