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
	
		//if ($.mask)
		//$("#phone").mask("+99 (999) 999-99-99");
		//$("#date").mask("99.99.9999");
	
	if(!elemHasAttribute('input','placeholder'))
		$("#main_form").placeholder();
	
	if(!elemHasAttribute('input','autofocus'))
		$('input[autofocus=true]' ).focus();
	
	$('#name,#email').bind('change keyup',function(e){ //,#comment,#date,
		switch(e.target.id){
			case 'name':
				if($.trim(this.value)=='')
					$(this).addClass('brr');
				else
					$(this).removeClass('brr');
			break;
			case 'email':
				if($.trim(this.value)==''||!checkEmail())
					$(this).addClass('brr');
				else
					$(this).removeClass('brr');
			break;
		}
			
		/*
			case 'date':
				if(!/^(\d{1,2}).(\d{1,2}).(\d{4})$/.test($(this).val()))
					$(this).addClass('brr');
				else if (/^(\d{1,2}).(\d{1,2}).(\d{4})$/.test($(this).val()))
					$(this).removeClass('brr');
			break;
				
			if(e.target.id == 'comment'){
				if(/[^a-z\s]+/gi.test($('#comment').val()))
					$(this).addClass('brr');
				else if (!/[^a-z\s]+/gi.test($('#comment').val()))
					$(this).removeClass('brr');
			}
		*/
	
		var bool = 	$.trim($('#name').val())!= '' 
					&& $.trim($('#email').val())!= ''
					&&checkEmail()
					// && $.trim($('#date').val())!=''
					// &&!/[^a-z\s]+/gi.test($('#comment').val())
					// &&/^(\d{1,2}).(\d{1,2}).(\d{4})$/.test($('#date').val());
		
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

// Placeholders compatability with IE
(function($){  
  $.fn.placeholder = function(){   
    function valueIsPlaceholder(input){
      return ($(input).val() == $(input).attr("placeholder"));
    }
    return this.each(function() {  
  
      $(this).find(":input").each(function(){
      
        if($(this).attr("type") == "password"){ 
          
          var new_field = $("<input type='text'>");
          new_field.attr("rel", $(this).attr("id"));
          new_field.attr("value", $(this).attr("placeholder"));
          $(this).parent().append(new_field);
          new_field.hide();
          
          function showPasswordPlaceHolder(input){
            if( $(input).val() == "" || valueIsPlaceholder(input) ){ 
              $(input).hide();
              $('input[rel=' + $(input).attr("id") + ']').show();
            };
          };
          
          new_field.focus(function(){
            $(this).hide();
            $('input#' + $(this).attr("rel")).show().focus();
          });

          $(this).blur(function(){
             showPasswordPlaceHolder(this);
          });

          showPasswordPlaceHolder(this); 
        
        }else{
          
          // Replace the value with the placeholder text. 
          // optional reload parameter solves FF and
          // IE caching values on fields.
          function showPlaceholder(input, reload){
            if( $(input).val() == "" || 
              ( reload && valueIsPlaceholder(input) ) ){ 
                $(input).val($(input).attr("placeholder"));
              }
          };
          
          $(this).focus(function(){
            if($(this).val() == $(this).attr("placeholder")){
              $(this).val("");
            };
          });

          $(this).blur(function(){
             showPlaceholder($(this), false)
          });
          
          showPlaceholder(this, true); 
        };
      });
      
      // Prevent forms from submitting default values
      $(this).submit(function(){  
	  
        $(this).find(":input").each(function(){
          if($(this).val() == $(this).attr("placeholder")){
            $(this).val("");
          }          
        });
      });
      
    });  
  };
})(jQuery); 