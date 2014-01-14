
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