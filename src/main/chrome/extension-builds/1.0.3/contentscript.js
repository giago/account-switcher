/**
 * Content script
 * 
 * @author luigi.agosti
 * @author andrea.boriero
 * 
 */
var waitEnable = true;
var currentAccounts;
var signOutElement;
var containerElement;
var signOutHref;
var selectBox;

//====================================================================
//Receiving broadcast event from background page
//====================================================================

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		Logger.log("message received" + request.tabid);
		if(GoogleUI.isGooglePage()) {
			document.location.reload();
		}
		if(GoogleUI.isYouTubePage()) {
			document.location.reload();
		}	
		if(GoogleUI.isGoogleGroups()) {
			//BackgroundService.getAccountToSignIn();
		}
	}
);

//====================================================================
//			UI MAIN FUNCITONS
//====================================================================

function init() {
	if(GoogleUI.isGoogleAnalytics() || GoogleUI.isGoogleCode() || GoogleUI.isGooglePicasa()) {
		return null;
	}
	signOutElement = GoogleUI.getDocumentElementForDropDown();
	containerElement = GoogleUI.getContainerElement();
	if(signOutElement == null) {
		Logger.log("No sign out element found");
		return;
	}
	if(containerElement == null) {
		Logger.log("No container element found");
		return;
	}
	BackgroundService.sendOnTabSignIn();
	selectBox = document.createElement("span");
	BackgroundService.getAccounts(true);
}

var inserted = false;

function updateView(accounts, insert) {
	Logger.log("updating view");
	signOutHref = signOutElement.href;
	if(insert) {
		//TODO if is another google page?
		
		//containerElement.appendChild(GoogleUI.getSwitcherElement(accounts));
		
		if(inserted) {
			Logger.log("selection div already present");
			containerElement.replaceChild(GoogleUI.getSwitcherElement(accounts), containerElement.firstChild);
		} else {
			inserted = true;
			containerElement.insertBefore(GoogleUI.getSwitcherElement(accounts), containerElement.firstChild);
		}
		
		//signOutElement.parentNode.replaceChild(selectBox, signOutElement);
		//element.firstChild.addEventListener("click", onSelectChange, true);
	}
}

//====================================================================
//Google UI Manipulation helpers functions
//====================================================================

var GoogleUI = {}; 

GoogleUI.isGoogleGroups = function() {
	if(window.location.href.indexOf("groups.google") > 0) {
		return true;
	}
	return false;
}

GoogleUI.isGoogleCode = function() {
	if(window.location.href.indexOf("code.google") > 0) {
		return true;
	}
	return false;
}

GoogleUI.isGoogleAnalytics = function() {
	if(window.location.href.indexOf("/analytics/") > 0) {
		return true;
	}
	return false;
}

GoogleUI.isGoogleCalendar = function() {
	if(window.location.href.indexOf("/calendar/") > 0) {
		return true;
	}
	return false;
}

GoogleUI.isGooglePicasa = function() {
	if(window.location.href.indexOf("/picasaweb.google") > 0) {
		return true;
	}
	return false;
}

GoogleUI.isGooglePage = function() {
	if(window.location.hostname.indexOf("google") > 0) {
		return true;
	}
	return false;
}

GoogleUI.isYouTubePage = function() {
	if(window.location.hostname.indexOf("www.youtube.") > 0) {
		return true;
	}
	return false;
}

GoogleUI.isGoogleLoginPage = function() {
	if(window.location.href.indexOf("accounts.google.com/ServiceLogin?") > 0) {
		return true;
	}
	return false;
}

GoogleUI.isGoogleAdSenseLoginPage = function() {
	if(window.location.href.indexOf("adsense/login") > 0) {
		return true;
	}
	return false;
}

GoogleUI.getDocumentElementForDropDown = function() {
	try {
		var element = document.getElementsByClassName("gbmpala")[0];
		if(!element) {
			element = document.getElementById("canvas_frame")
			if(element) {
				if(waitEnable){
					setTimeout("init()", 3000);
					waitEnable = false;
				} 
				var frame = element.contentDocument
				element = frame.getElementById("guser");
				if(!element) { element = frame.getElementsByClassName("gbmpala")[0];}
			}
		}
		if(element) {
			var links = element.getElementsByTagName("a");
			for (var i = 0; i < links.length; i++) {
				if (links[i].href) { 
					if(links[i].href.toLowerCase().indexOf("switcher") == -1) {
						if(links[i].href.toLowerCase().indexOf("logout") > 0 || 
								links[i].href.toLowerCase().indexOf("signout") > 0 ) {
							return links[i];
						}
					}
				}
			}
		}
		return null;
	} catch (e) {
		logError("error : " + e); return null;
	}
}

GoogleUI.getContainerElement = function() {
	try {
		var element = document.getElementsByClassName("gbtc")[1];
		if(!element) {
			element = document.getElementById("canvas_frame")
			if(element) {
				if(waitEnable){
					setTimeout("init()", 3000);
					waitEnable = false;
				} 
				var frame = element.contentDocument
				element = frame.getElementById("guser");
				frame.addEventListener("click", GoogleUI.onClick, false);
				if(!element) { element = frame.getElementsByClassName("gbtc")[1];}
			}
		} else {
			window.addEventListener("click", GoogleUI.onClick, false);
		}
		return element;
	} catch (e) {
		logError("error : " + e); return null;
	}
}

GoogleUI.setInnerHTMLForSelectBox = function(element, accounts) {
	var specializedHref = "href=\"#\"";
	var specializedDivStyle = "right: 5px; left:auto; top: 24px; visibility: hidden; width:150px;";
	var specializedAStyle = "";
	if(GoogleUI.isGoogleAnalytics()) {
		specializedDivStyle = "top:28px; width:150px; visibility:hidden; background-attachment: scroll; background-clip: border-box; background-color: white; background-image: none; background-origin: padding-box; border-bottom-color: #36C; border-bottom-style: solid; border-bottom-width: 1px; border-left-color: #A2BAE7; border-left-style: solid; border-left-width: 1px; border-right-color: #36C; border-right-style: solid; border-right-width: 1px; border-top-color: #C9D7F1; border-top-style: solid; border-top-width: 1px; display: block; left: auto; position: absolute; right: 5px; text-align: left; z-index:1001";
	}
	if(GoogleUI.isGooglePicasa()) {
		specializedHref = "";
		specializedAStyle = "style=\"cursor:pointer; color:#3964C2 !important;\""
	}
	element.innerHTML = "<a " + specializedHref + " aria-haspopup=\"true\" " + specializedAStyle + " class=\"gb3\"><u>more</u> <small>\u25BC</small></a>" +
			"<div id=\"moreAccounts\" class=\"gbm\" style=\"" + specializedDivStyle + "\" " +
			"onclick=\"document.getElementById('moreAccounts').style.visibility = 'hidden';\">" + 
			GoogleService.getAccountsFragment(accounts) + 
			"</div>";
	
	element.firstChild.addEventListener("click", GoogleUI.onMoreClick, false);
	
	if(accounts != null && accounts.length > 0) {
		var accountElement = element.firstChild.nextSibling; 
		for(var i = 0; i < accounts.length; i++) {
			if(accountElement) {//element.firstChild.getElementById(accounts[i].account);
				accountElement.addEventListener("click", GoogleUI.onMoreClick, false);
				accountElement = accountElement.nextSibling;
			}
		}
	}
}

GoogleUI.getSwitcherElement = function(accounts) {
	var element = document.createElement("li");
	element.setAttribute("class", "gbt");
	var specializedHref = "href=\"#\"";
	var specializedDivStyle = "right: -20px; left:auto; top: 32px; visibility: hidden; width:150px;";
	var specializedAStyle = "";
	element.innerHTML = "<a id=\"switcher123\" " + specializedHref + " aria-haspopup=\"true\" " + specializedAStyle + 
		" class=\"gbgt\" onmouseover=\"document.getElementById('switcher123').className += ' gbgt-hvr';\"" +
		" onmouseout=\"document.getElementById('switcher123').className = 'gbgt';\"\ " +
		" onclick=\"document.getElementById('moreAccounts').style.visibility = 'visible'; " +
				"document.getElementById('switcher123').parentElement.className += ' gbto';" +
		        "\">" +
			"<span class=\"gbtb2\"></span><span class=\"gbts gbtsa\"><span><span style=\"font-weight:bold;\">" +
					"Switch account" +
					"</span><span class=\"gbma\"></span></span></span>" +
			"</a>" +
			"<div id=\"moreAccounts\" class=\"gbpc gbm\" style=\"" + specializedDivStyle + "\" " +
			"onclick=\"document.getElementById('moreAccounts').style.visibility = 'hidden';\">" +
			"<div class=\"gbmpdv\"><div class=\"gbpc\" style=\"margin:10px;\">" + 
			GoogleService.getNewAccountsFragment(accounts) + 
			"</div></div></div>";
	
	var accountContainer = element.firstChild.nextSibling.firstChild; 
	if(accounts != null && accounts.length > 0) {
		for(var i = 0; i < accounts.length; i++) {
			var accountElement = accountContainer.childNodes[i];
			if(accountElement) {
				accountElement.addEventListener("click", GoogleUI.onMoreClick, false);
			}
		}
	}
	
	return element;
}

GoogleUI.updateSelectBox = function(accounts) {
	GoogleUI.setInnerHTMLForSelectBox(selectBox, accounts);
}


var visible = false;

GoogleUI.onClick = function() {
	Logger.log("onClick");
	var element = containerElement.firstChild;
	if(element) {
		Logger.log("Element");
		var more = containerElement.childNodes.item(0).childNodes.item(1);
		if(more && more.style.visibility == "visible" && !visible) {
			visible = true;
		} else if (more && more.style.visibility == "visible" && visible) {
			visible = false;
			element.className = "gbt";
			more.style.visibility = "hidden";
		}
	}
//	
//	element = document.getElementById("canvas_frame")
//	var frame = element.contentDocument
//	element = frame.getElementById("guser");
	 
	
}

GoogleUI.onMoreClick = function(event) {
	var accountsElement = event.target.ownerDocument.getElementById("moreAccounts");	
	if(event.target.innerText == "more") {
		var visibility = accountsElement.style.visibility;
		if(visibility !== "visible") {
			accountsElement.style.visibility = "visible";
		} else { 
			accountsElement.style.visibility = "hidden";
		}
	} else if(event.target.id) {	
		accountsElement.style.visibility = "hidden";
		var isTheIdAnAccount = false
		for(var i = 0; i < currentAccounts.length; i++) {
			if(currentAccounts[i].account == event.target.id) {
				isTheIdAnAccount = true;
			}
		}
		if(isTheIdAnAccount) {
			GoogleService.signInWith(event.target.id);
		}
	} else {
		accountsElement.style.visibility = "hidden";
	}
}

//====================================================================
//				GOOGLE DEPENDENT FUNCTIONS
//====================================================================

var GoogleService = {};

GoogleService.signInWith = function(username) {
	Logger.log("sign in with username: " + username);
	BackgroundService.setUsernameToSignIn(username);
	BackgroundService.sendOnTabSignOut();
	document.location.href = signOutHref;
}

GoogleService.signInWithAccount = function(account) {
	Logger.log("signIn with : " + account.account + " " + account.password)
	document.getElementById("Email").value = account.account;
	document.getElementById("Passwd").value = account.password;
	if(account.password) {
		document.getElementById("gaia_loginform").submit();
	}
}

GoogleService.loginOnAdSense = function(account) {
	if(account.adSenseAutoSignIn == false) {
		return;
	}
	var element = document.getElementById("awglogin")
	if(element) {
		var frame = element.contentDocument;
		frame.getElementById("Email").value = account.account;
		if(account.password != null) {
			frame.getElementById("Passwd").value = account.password;
			if(account.adSenseAutoSignIn) {
				frame.forms[0].submit();
			}
		}
	}
}

GoogleService.getNewAccountsFragment = function(accounts) {
	var specializedHref = "href=\"#\"";
	var specializedStyle = "";
	if(GoogleUI.isGoogleAnalytics()) {
		specializedStyle = "style=\"border-bottom-color:#005C9C;color:#005C9C;border-bottom-style: none;border-bottom-width: 0px;cursor: auto;display: block;height: 16px;padding-bottom: 2px;padding-left: 6px;padding-right: 6px;padding-top: 2px;text-decoration: none;\"";
	}
	if(GoogleUI.isGooglePicasa()) {
		specializedHref = "";
		specializedStyle = "style=\"cursor:pointer; color:#3964C2\"";
	}
	var accountList = "";
	if(accounts != null && accounts.length > 0) {
		for(var i = 0; i < accounts.length; i++) {
			accountList = accountList + 
			"<ol class=\"gbmcc\"><li class=\"gbmtc\"><a " 
			+ specializedHref + " class=\"gbml1 gbp1 \" " + specializedStyle + " id=\"" + accounts[i].account + "\">" + accounts[i].account 
			+ "</a></li></ol>";
		}
	}
	return accountList;
}

GoogleService.getAccountsFragment = function(accounts) {
	var specializedHref = "href=\"#\"";
	var specializedStyle = "";
	if(GoogleUI.isGoogleAnalytics()) {
		specializedStyle = "style=\"border-bottom-color:#005C9C;color:#005C9C;border-bottom-style: none;border-bottom-width: 0px;cursor: auto;display: block;height: 16px;padding-bottom: 2px;padding-left: 6px;padding-right: 6px;padding-top: 2px;text-decoration: none;\"";
	}
	if(GoogleUI.isGooglePicasa()) {
		specializedHref = "";
		specializedStyle = "style=\"cursor:pointer; color:#3964C2\"";
	}
	var accountList = "";
	if(accounts != null && accounts.length > 0) {
		for(var i = 0; i < accounts.length; i++) {
			accountList = accountList + "<a " + specializedHref + " class=\"gb2\" " + specializedStyle + " id=\"" + accounts[i].account + "\">" + accounts[i].account + "</a>";
		}
	}
	accountList = accountList + "<a href=\"" + signOutHref + "&switcher\" " + specializedStyle + " class=\"gb2\" >Sign out</a>";
	return accountList;
}

//====================================================================
//				STORE LAYER
//account is define by an email and a password
//the storing is implemented in the background page
//====================================================================

var BackgroundService = {}; 

BackgroundService.getAccounts = function() {
	Logger.log("getting the list of account from the local store");
	chrome.extension.sendRequest({action: "getAccounts"}, function(response) {
		Logger.log("getting back the list of accounts");
		  currentAccounts = response;
		  updateView(response, true);
	});
}

BackgroundService.getAccountToSignIn = function() {
	Logger.log("getting account to sign in");
	chrome.extension.sendRequest({action: "getAccountToSignIn"}, function(response) {		
		if(response && response.account) {
			GoogleService.signInWithAccount(response);
			chrome.extension.sendRequest({action: "removeAccountToSignIn"}, function(response) {		
				Logger.log("account to sign removed");
			});
		}
	});
	
}

BackgroundService.getCurrentAccount = function() {
	Logger.log("getting current account");
	chrome.extension.sendRequest({action: "getCurrentAccount"}, function(response) {
		Logger.log("current account  is :" + response.account);
		GoogleService.loginOnAdSense(response);
	});
}

BackgroundService.setUsernameToSignIn = function(usernameToSignIn) {
	Logger.log("setting username to sign in  : " + usernameToSignIn);
	chrome.extension.sendRequest({action: "setAccountToSignIn", account : usernameToSignIn}, function(response) {
		Logger.log("account setted!");
	});
}

BackgroundService.getAdSenseAutoSignInValue = function() {
	Logger.log("getting AdSenseAutoSignIn settings");
	chrome.extension.sendRequest({action: "getAdSenseAutoSignInValue"}, function(response) {
		Logger.log("getAdSenseAutoSignInValue value :" + response.autoSingIn + " account : " + response.account + " password : " + response.password);
		if(response.autoSingIn == true) {
			Logger.log("Auto sign in on google adsense");
			setTimeout("loginOnAdSense('" + response.account + "','" + response.password + "')", 2500);
		} else {
			Logger.log("Auto sign in for google adsense is off");
		}
	});
}

BackgroundService.sendOnTabSignIn = function() {
	chrome.extension.sendRequest({action: "onTabLogin"}, function(response) {
		Logger.log("broadcast ON_TAB_LOGIN sent");
	});
}

BackgroundService.sendOnTabSignOut = function() {
	chrome.extension.sendRequest({action: "onTabLogout"}, function(response) {
		Logger.log("broadcast ON_TAB_LOGOUT sent");
	});
}

//======================================================================
// log abstraction
//======================================================================

var Logger = {};

Logger.log = function(msg) {
	//console.info(msg);
}

Logger.logError = function(msg) {
	//console.error(msg);
}


//======================================================================
// ENTRY POINT
//======================================================================

if(GoogleUI.isGooglePage()) {
	Logger.log("isGooglePage");
	if(GoogleUI.isGoogleLoginPage()) {
		Logger.log("isGoogleLoginpage");
		BackgroundService.getAccountToSignIn();
	} else if(GoogleUI.isGoogleAdSenseLoginPage()) {
		Logger.log("isAdSenseLoginPage");
		setTimeout("BackgroundService.getCurrentAccount()", 3000);
	} else {
		Logger.log("init");
		init();
	}
}