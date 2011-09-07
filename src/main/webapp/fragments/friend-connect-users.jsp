<%if (request.getServerName().contains(".com") && !request.getServerName().contains(".latest")) {%>
	<script type="text/javascript" src="http://www.google.com/friendconnect/script/friendconnect.js"></script>
	<div id="div-5260150096086107952" style="width:200px;border:1px solid #cccccc;"></div>
	<script type="text/javascript">
	var skin = {};
	skin['BORDER_COLOR'] = '#cccccc';
	skin['ENDCAP_BG_COLOR'] = '#ffcc99';
	skin['ENDCAP_TEXT_COLOR'] = '#333333';
	skin['ENDCAP_LINK_COLOR'] = '#990000';
	skin['ALTERNATE_BG_COLOR'] = '#ffffff';
	skin['CONTENT_BG_COLOR'] = '#ffffff';
	skin['CONTENT_LINK_COLOR'] = '#990000';
	skin['CONTENT_TEXT_COLOR'] = '#333333';
	skin['CONTENT_SECONDARY_LINK_COLOR'] = '#990000';
	skin['CONTENT_SECONDARY_TEXT_COLOR'] = '#666666';
	skin['CONTENT_HEADLINE_COLOR'] = '#333333';
	skin['NUMBER_ROWS'] = '2';
	google.friendconnect.container.setParentUrl('/' /* location of rpc_relay.html and canvas.html */);
	google.friendconnect.container.renderMembersGadget(
	 { id: 'div-5260150096086107952',
	   site: '00467392469319576832' },
	  skin);
	</script>
<%} else {%>
    <div id="div-5260150096086107952" style="width:200px; height:200px; border:1px solid #cccccc;"></div>
<%}%>