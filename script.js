var name,date,email,comment;

function elemHasAttribute(elementName,attribute){
	var element = document.createElement(elementName);
	return attribute in element;
};	

function checkEmail() {
	var email = document.getElementById('email');
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!filter.test(email.value)) {
		email.focus;
		return false;
	} else {
		return true;
	}
}

$(function(){ //// page run
	$('noscript').remove();

	if(!elemHasAttribute('input','required'))
	$("#contact-submit").click(function(e){
		e.preventDefault();
	});
	
	$("#phone").mask("+99 (999) 999-99-99");
	$("#date").mask("99.99.9999");
	
	$("#load-submit").click(function(e){
		e.preventDefault();
		$.ajax({
		  url: "index.php?getContent=true",
		  beforeSend: function ( xhr ) {
			// xhr.overrideMimeType("text/plain; charset=x-user-defined");
			
			// $('#subscribe_table > *').remove();
			// $('#subscribe_table').html('<img class="f" src="ajax-loader-blue.gif"/>');
			$('#subscribe_table').parent().toggleClass('brsr');
		  }
		}).done(function ( data ) {
			$('#subscribe_table > *').remove();
			$('#subscribe_table').html(data);
			$('#subscribe_table').parent().toggleClass('brsr');
		});
	});
	
	if(!elemHasAttribute('input','placeholder'))
		$("#main_form").placeholder();
	
	if(!elemHasAttribute('input','autofocus'))
		$('input[autofocus=true]' ).focus();
	
	$('#name,#date,#email,#comment').bind('change keyup',function(e){
		
		switch(e.target.id){
			
			case 'name':
				if($.trim(this.value)=='')
					$(this).addClass('brsr');
				else
					$(this).removeClass('brsr');
			break;
			
			case 'email':
				if($.trim(this.value)==''||!checkEmail())
					$(this).addClass('brsr');
				else
					$(this).removeClass('brsr');
			break;
			
			case 'date':
				if(!/^(\d{1,2}).(\d{1,2}).(\d{4})$/.test($(this).val()))
					$(this).addClass('brsr');
				else if (/^(\d{1,2}).(\d{1,2}).(\d{4})$/.test($(this).val()))
					$(this).removeClass('brsr');
			break;
		}
				
		if(e.target.id == 'comment'){
			if(/[^a-z\s]+/gi.test($('#comment').val()))
				$(this).addClass('brsr');
			else if (!/[^a-z\s]+/gi.test($('#comment').val()))
				$(this).removeClass('brsr');
		}
		var bool = $.trim($('#name').val())!= '' 
					&& $.trim($('#date').val())!=''
					&& $.trim($('#email').val())!= ''
					&&checkEmail()
					&&!/[^a-z\s]+/gi.test($('#comment').val())
					&&/^(\d{1,2}).(\d{1,2}).(\d{4})$/.test($('#date').val());
		
		if(!$("#contact-submit").hasClass('send_button_active')&&bool){
			$("#contact-submit").toggleClass('send_button send_button_active');
			var options = {
				url: 'index.php',
				success: function(response) {
					// var data = $.parseJSON(response);
					// if(data.result == true)
				}
			};
			$("#contact-submit").unbind().click(function(e){
				e.preventDefault();
				if ($.trim($('#comment').val())==='English only')
					$('#comment').val(' ');
				$("#main_form").ajaxSubmit(options);
				alert('form has been submited');
			});	
		}else if($("#contact-submit").hasClass('send_button_active')&&!bool){
			$("#contact-submit").unbind().click(function(e){
				e.preventDefault();
			}).toggleClass('send_button send_button_active');
		}
	});
});		

//Include js files function
function include(file,scriptStack) {
	var script = document.createElement('script');
	script.src = file;
	script.type = 'text/javascript';
	
	if(scriptStack == 'async' && elemHasAttribute('script','async'))
		script.async = true;
	else if(scriptStack == 'defer')
		script.defer = true;
		
	document.getElementsByTagName('head')[0].appendChild(script);
	debuggStack({'msg':'script.js(47): include '+file});
};	

//Include js file with callback function
function includeWithCallBack(file, callback) {
	var script = document.createElement('script');
	script.src = file;
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
		
	script.onreadystatechange = function() {
		if(script.readyState == "complete" || script.readyState=="loaded") {
			script.onreadystatechange = false;
			callback;
		} else {
			script.onload = function() {
			callback;
			};
		}
	};
};