/**
 * Content script
 * 
 * @author luigi.agosti
 * @author andrea.boriero
 * 
 */
var SELECT_LOGIN_ELEMENT_NAME = "gSwitcher-selectLogin"
var FORM_LOGIN_ELEMENT_NAME = "gSwitcher-formLogin";
var SIGN_OUT_EVENT = "signOut";
var ON_TAB_LOGOUT = "onTabLogout";
var ON_TAB_LOGIN = "onTabLogin";
var GET_PASSWORD_FOR = "getPasswordFor";
var waitEnable = true;
var currentAccounts;
var signOutElement;
var signOutHref;
var selectBox;
//====================================================================
//			UI MAIN FUNCITONS
//====================================================================
if(isGooglePage()) {
	if(window.location.href.indexOf("accounts/ServiceLogin?") > 0) {
		getUsernameToSignIn();
	} else if(window.location.href.indexOf("adsense/login") > 0) { 
		getAdSenseAutoSignInValue();
	} else {
		init();
	}
}

function init() {
	log("init content script");
	signOutElement = getDocumentElementForDropDown();
	if(signOutElement == null) {
		log("No sign out element found");
		return;
	}
	sendOnTabSignIn();
	selectBox = document.createElement("span");
	getAccountsFromStore(true);
}

function updateView(accounts, insert) {
	log("updating view");
	signOutHref = signOutElement.href;
	updateSelectBox(accounts);
	if(insert) {
		log("inserting select box");
		signOutElement.parentNode.replaceChild(selectBox, signOutElement);
		element.firstChild.addEventListener("click", onSelectChange, true);
	}
}

function isGoogleAnalytics() {
	if(window.location.href.indexOf("/analytics/") > 0) {
		return true;
	}
	return false;
}

function isGooglePicasa() {
	if(window.location.href.indexOf("/picasaweb.google") > 0) {
		return true;
	}
	return false;
}

//====================================================================
//				UI helpers functions
//====================================================================

function updateSelectBox(accounts) {
	setInnerHTMLForSelectBox(selectBox, accounts);
}

function setInnerHTMLForSelectBox(element, accounts) {
	var specializedHref = "href=\"#\"";
	var specializedDivStyle = "right: 5px; left:auto; top: 24px; visibility: hidden; width:150px;";
	var specializedAStyle = "";
	if(isGoogleAnalytics()) {
		specializedDivStyle = "top:28px; width:150px; visibility:hidden; background-attachment: scroll; background-clip: border-box; background-color: white; background-image: none; background-origin: padding-box; border-bottom-color: #36C; border-bottom-style: solid; border-bottom-width: 1px; border-left-color: #A2BAE7; border-left-style: solid; border-left-width: 1px; border-right-color: #36C; border-right-style: solid; border-right-width: 1px; border-top-color: #C9D7F1; border-top-style: solid; border-top-width: 1px; display: block; left: auto; position: absolute; right: 5px; text-align: left; z-index:1001";
	}
	if(isGooglePicasa()) {
		specializedHref = "";
		specializedAStyle = "style=\"cursor:pointer; color:#3964C2 !important;\""
	}
	element.innerHTML = "<a " + specializedHref + " aria-haspopup=\"true\" " + specializedAStyle + " class=\"gb3\"><u>more</u> <small>\u25BC</small></a>" +
			"<div id=\"moreAccounts\" class=\"gbm\" style=\"" + specializedDivStyle + "\" " +
			"onclick=\"document.getElementById('moreAccounts').style.visibility = 'hidden';\">" + 
			getAccountsFragment(accounts) + "</div>";
	element.firstChild.addEventListener("click", onMoreClick, true);
}

function getAccountsFragment(accounts) {
	var specializedHref = "href=\"#\"";
	var specializedStyle = "";
	if(isGoogleAnalytics()) {
		specializedStyle = "style=\"border-bottom-color:#005C9C;color:#005C9C;border-bottom-style: none;border-bottom-width: 0px;cursor: auto;display: block;height: 16px;padding-bottom: 2px;padding-left: 6px;padding-right: 6px;padding-top: 2px;text-decoration: none;\"";
	}
	if(isGooglePicasa()) {
		specializedHref = "";
		specializedStyle = "style=\"cursor:pointer; color:#3964C2\"";
	}
	var accountList = "";
	if(accounts != null && accounts.length > 0) {
		for(var i = 0; i < accounts.length; i++) {
			accountList = accountList + "<a " + specializedHref + " class=\"gb2\" " + specializedStyle + " id=\"" + accounts[i] + "\">" + accounts[i] + "</a>";
		}
	}
	accountList = accountList + "<a href=\"" + signOutHref + "&switcher\" " + specializedStyle + " class=\"gb2\" >Sign out</a>";
	log(accountList);
	return accountList;
}

function outOfModeAccountClick() {
	log("ok");
}

function onMoreClick() {
	var accountsElement = this.ownerDocument.getElementById("moreAccounts");	
	if(this.id != null && this.id !== "") {
		accountsElement.style.visibility = "hidden";
		if(this.id!="moreAccounts") {
			signInWith(this.id);
		}
	} else {
		this.blur();
		var visibility = accountsElement.style.visibility; 
		if(visibility !== 'visible') { 
			accountsElement.style.visibility = "visible";
			if(currentAccounts != null && currentAccounts.length > 0) {
				for(var i = 0; i < currentAccounts.length; i++) {
					this.ownerDocument.getElementById(currentAccounts[i]).addEventListener("click", onMoreClick, true);
				}
			}
		} else { 
			accountsElement.style.visibility = "hidden";
			if(currentAccounts != null && currentAccounts.length > 0) {
				for(var i = 0; i < currentAccounts.length; i++) {
					this.ownerDocument.getElementById(currentAccounts[i]).removeEventListener("click", onMoreClick, true);
				}
			}
		}
	}
}

function isNotValid(stringToValidate) {
	if(!stringToValidate) {
		return true;
	}
	if (stringToValidate.indexOf(',') != -1) {
		return true;
	}
	return false;
}

//====================================================================
//				GOOGLE DEPENDENT FUNCTIONS
//====================================================================

function signInWith(username) {
	log("sign in with username: " + username);
	setUsernameToSignIn(username);
	sendOnTabSignOut();
	document.location.href = signOutHref;
}

function setUsernameToSignInToForm(username) {
	document.getElementById("Email").value = username;
	chrome.extension.sendRequest({action: GET_PASSWORD_FOR, account: username}, function(response) {
		document.getElementById("Passwd").value = response;
		if(response !== null && response !== "" && response !== "undefined") {
			document.getElementById("gaia_loginform").submit();
		}
	});
}

function sendOnTabSignIn() {
	chrome.extension.sendRequest({action: ON_TAB_LOGIN}, function(response) {
		log("broadcast ON_TAB_LOGIN sent");
	});
}

function sendOnTabSignOut() {
	chrome.extension.sendRequest({action: ON_TAB_LOGOUT}, function(response) {
		log("broadcast ON_TAB_LOGOUT sent");
	});
}

function getDocumentElementForDropDown() {
	try {
		var element = document.getElementById("guser");	
		if(!element) { element = document.getElementById("gb");}
		if(!element) { element = document.getElementById("gaia");}
		if(!element) { element = document.getElementById("whacfl");}
		if(!element) { element = document.getElementById("global_header_nav");}
		if(!element) { element = document.getElementsByClassName("topbar")[0];}
		if(!element) { element = document.getElementsByClassName("gaiaNav")[0];}
		if(!element) { element = document.getElementsByClassName("one_google")[0];}
		if(!element) {
			element = document.getElementById("canvas_frame")
			if(element) {
				if(waitEnable){
					setTimeout("init()", 5000);
					waitEnable = false;
				} 
				var frame = element.contentDocument
				element = frame.getElementById("guser");
			}
		}
		if(element) {
			var links = element.getElementsByTagName("a");
			for (var i = 0; i < links.length; i++) {
				if (links[i].href) { 
					if(links[i].href.toLowerCase().indexOf("logout") > 0 && links[i].href.toLowerCase().indexOf("switcher") == -1) {
						return links[i];
					}
				}
			}
		}
		return null;
	} catch (e) {
		logError("error : " + e);
		return null;
	}
}

function isGooglePage() {
	if(window.location.hostname.indexOf("google") > 0) {
		return true;
	}
	return false;
}

//====================================================================
//				STORE LAYER
//account is define by an email and a password
//the storing is implemented in the background page
//====================================================================

function getAccountsFromStore() {
	log("getting the list of account from the local store");
	chrome.extension.sendRequest({action: "getAccounts"}, function(response) {
		  log("getting back the list of accounts");
		  currentAccounts = response;
		  updateView(response, true);
	});
}

function setUsernameToSignIn(usernameToSignIn) {
	log("setting username to sign in  : " + usernameToSignIn);
	chrome.extension.sendRequest({action: "setUsernameToSignIn", username : usernameToSignIn}, function(response) {
		  log("account setted!");
	});
}

function getUsernameToSignIn() {
	log("getting username to sign in");
	chrome.extension.sendRequest({action: "getUsernameToSignIn"}, function(response) {
		log("account to sign in is :" + response);
		setUsernameToSignInToForm(response);
	});
}

function getAdSenseAutoSignInValue() {
	log("getting AdSenseAutoSignIn settings");
	chrome.extension.sendRequest({action: "getAdSenseAutoSignInValue"}, function(response) {
		log("getAdSenseAutoSignInValue value :" + response.autoSingIn + " account : " + response.account + " password : " + response.password);
		if(response.autoSingIn == true) {
			log("Auto sign in on google adsense");
			setTimeout("loginOnAdSense('" + response.account + "','" + response.password + "')", 2500);
		} else {
			log("Auto sign in for google adsense is off");
		}
	});
}

function loginOnAdSense(account, password) {
	var element = document.getElementById("awglogin")
	if(element) {
		var frame = element.contentDocument;
		frame.getElementById("Email").value = account;
		if(password != null) {
			frame.getElementById("Passwd").value = password;
			frame.forms[0].submit();
		}
	}
}

//====================================================================
//Receiving broadcast event from background page
//====================================================================

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		log("message received" + request.tabid);
		if(isGooglePage()) {
			document.location.reload();
		}
	}
);


//======================================================================
// log abstraction
//======================================================================

function log(msg) {
	console.info(msg);
}

function logError(msg) {
	console.error(msg);
}