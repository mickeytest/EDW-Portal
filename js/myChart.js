    function ajaxindicatorstart(text)
	{
		
		if(jQuery('#page-wrapper').find('#resultLoading').attr('id') != 'resultLoading'){
			jQuery('#page-wrapper').append('<div id="resultLoading" style="display:none"><div><img src="img/preloader.gif"><div>'+text+'</div></div><div class="bg"></div></div>');
		}
		
		jQuery('#resultLoading').css({
			'width':'100%',
			'height':'100%',
			'position':'fixed',
			'z-index':'10000000',
			'top':'0',
			'left':'0',
			'right':'0',
			'bottom':'0',
			'margin':'auto'
		});	
		
		jQuery('#resultLoading .bg').css({
			'background':'#000000',
			'opacity':'0.7',
			'width':'100%',
			'height':'100%',
			'position':'absolute',
			'top':'0'
		});
		
		jQuery('#resultLoading>div:first').css({
			'width': '250px',
			'height':'75px',
			'text-align': 'center',
			'position': 'fixed',
			'top':'0',
			'left':'0',
			'right':'0',
			'bottom':'0',
			'margin':'auto',
			'font-size':'16px',
			'z-index':'10',
			'color':'#ffffff'
			
		});

	    jQuery('#resultLoading .bg').height('100%');
        jQuery('#resultLoading').fadeIn(300);
	    jQuery('#page-wrapper').css('cursor', 'wait');
	}

	function ajaxindicatorstop()
	{   
	    jQuery('#resultLoading .bg').height('100%');
        jQuery('#resultLoading').fadeOut(300);
	    jQuery('#page-wrapper').css('cursor', 'default');
	}
	

	$(function () {
	    Highcharts.setOptions({
		    lang: {
		        drillUpText: '<< Back to Overview'
		    }
		});
	   }); 


    setTimeout(function() {
                    $(window).resize();
                }, 0);

  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  });

