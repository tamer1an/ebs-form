/***
 * EXception for printin layout in EI7
***/
/* http://beckelman.net/post/2009/02/16/Use-jQuery-to-Show-a-Linke28099s-Address-After-its-Text-When-Printing-In-IE6-and-IE7.aspx */
$(function() {
  if (window.onbeforeprint !== undefined) {  
      window.onbeforeprint = ShowLinks;
      window.onafterprint = HideLinks;
  }
});

function ShowLinks() {  
  $("a").each(function() {
    $(this).data("linkText", $(this).text());
    $(this).append(" (" + $(this).attr("href") + ")");                
  });
}

function HideLinks() {   
  $("a").each(function() {
    $(this).text($(this).data("linkText"));
  });
}