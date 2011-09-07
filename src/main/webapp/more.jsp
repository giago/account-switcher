<html>
	<head>
		<title>Account Switcher for Google</title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<jsp:include page="/fragments/style.css"/>
	</head>
	<body>
		<div id="header-background-small">
			<div id="header-small">
				<jsp:include page="/fragments/header-info.jsp"/>
			</div>
			<div id="menu">
				<div id="menu-btn" style="font-size: 20px;">
			    	<a href="index.jsp">Home</a>
				</div>
			</div>
		</div>
		<center>
			<div id="content">
				<jsp:include page="/fragments/ads.jsp"/>
				<div class="title">How to use it</div>
				<div class="sentence">
					Install the extension first. It is really easy just go here : 
					<button type="button" class="btn"
							onclick="window.location.href='https://chrome.google.com/extensions/detail/ljdhogamnobeecdllbfmaafppceialak';">
							<span><span>extension gallery</span></span>
				</div>
				<div class="sentence">
					After the installation go to the option page of the extension. If you don't know, 
					from the menu of chrome folllow tools->extension then search for the Account Switcher extension and click the option page. 
				</div>
				<div class="sentence">
					<center>
						<img src="/images/screenshot2.png" alt="screenshot of the option page" style="border:1px solid gray;"/>
					</center>
				</div>
				<div class="sentence">
					In the option page you can insert, remove and change accounts. The username must be a valid google account email.
					You can omit the domain if is google.com otherwise you have to specify the full email address. 
				</div>
				<div class="sentence">
					The password is saved in the local session of your browser as hash. If you think is not secure enough
					you can just enter the username. With this solution the switch from one account to the other is not completely 
					automatic but you have to enter the password. 
				</div>
				<div class="sentence">
					When you have entered your accounts, you can go to your gmail, calendar, office or other google applications 
					and you will find something like this :  
				</div>
				<div class="sentence">
					<center>
						<img src="/images/screenshot1.png" alt="screenshot of the popup with the list of accounts" style="border:1px solid gray;"/>
					</center>
				</div>
				<div class="sentence">
					By selecting one of your accounts the extension will sign you in with it and will refresh all the tabs containing google pages.  
				</div>
			</div>			
		</center>
		<jsp:include page="/fragments/right.jsp"/>
		<jsp:include page="/fragments/left.jsp"/>
		<jsp:include page="/fragments/footer.jsp"/>
		<jsp:include page="/fragments/analytics.jsp"/>
	</body>
</html>