<%if (request.getServerName().contains(".com") && !request.getServerName().contains(".latest")) {%>
	<div class="right-banner">
	<div class="adSense"><script type="text/javascript"><!--
	google_ad_client = "pub-2374318088795044"; /* 160x600, created 2/27/10 */ 
	google_ad_slot = "8413907181"; google_ad_width = 160; google_ad_height = 600;
	//-->
	</script><script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script></div>
	</div>
<%} else {%>
	<div class="right-banner-no-ads" >space for google ads</div>	
<%}%>