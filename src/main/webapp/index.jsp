<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>Account Switcher for Google Gmail account</title>
		<meta name="description" content="Account Switcher chrome extension for Google Gmail accounts">
		<meta name="google-site-verification" content="_2xl145Mddf4kPSbu7T3WlLme2wN1QPZusLJGgMefZ8" >
		<jsp:include page="/fragments/facebook-meta.jsp"/>
		<jsp:include page="/fragments/style.css"/>
	</head>
	<body>
		<div id="header">
			<jsp:include page="/fragments/header-info.jsp"/>
			<div id="menu">
				<jsp:include page="/fragments/facebook-like.jsp"/>
				<div id="menu-btn">
					<a href="/more.jsp">More</a>
				</div>
			</div>
		</div>
		<div id="header-background"></div>
		<center>
			<div id="content">
				<jsp:include page="/fragments/ads.jsp"/>
				<div class="title">What is this about?</div>
				<div class="sentence">
					Account Switcher is a simple Chrome Extension that makes your life easier especially if you are using more than one google account.
				</div>
				<div class="sentence">
					It is very common to have more than one Google Account, maybe one account for work, one personal and maybe another one for some home project... 
					So if you are a little bit pissed off as me by how google handles multiple accounts you can try this extension.
				</div>
				<div class="sentence">
					The extension is just storing on your browser the list of emails for you and then with a simple drop down you can switch between them. 
				</div>
				<div class="sentence">
					To install the extension on your browser click here :
						<button type="button" class="btn"
							onclick="window.location.href='https://chrome.google.com/extensions/detail/ljdhogamnobeecdllbfmaafppceialak';">
							<span><span>extension gallery</span></span>
				</div>
				<div class="sentence">
					Check out the <a href="/more.jsp">more page</a> to see how it works.
				</div>
				<div class="sentence">
					This extension is a beta, unfortunately I don't get any money out of this project so I can't afford to spend too much time on it.
					But I will try to do my best to respond to the users.					
				</div>
			</div>
		</center>
		<jsp:include page="/fragments/right.jsp"/>
		<jsp:include page="/fragments/left.jsp"/>
		<jsp:include page="/fragments/footer.jsp"/>
		<jsp:include page="/fragments/analytics.jsp"/>
	</body>
</html>
