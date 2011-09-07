<%if (request.getServerName().contains(".com") && !request.getServerName().contains(".latest")) {%>
	<div class="ads">
		<script type="text/javascript"><!--
		google_ad_client = "pub-2374318088795044";
		/* 468x60, created 5/10/10 */
		google_ad_slot = "4104347108";
		google_ad_width = 468;
		google_ad_height = 60;
		//-->
		</script>
		<script type="text/javascript"
		src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
		</script>
	</div>
<%} else {%>
	<div class="ads-no-adsense">space for google ads</div>	
<% } %>