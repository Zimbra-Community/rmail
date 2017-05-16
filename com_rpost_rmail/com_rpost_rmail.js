//Constructor
function com_rpost_rmail_HandlerObject() {
};


com_rpost_rmail_HandlerObject.prototype = new ZmZimletBase();
com_rpost_rmail_HandlerObject.prototype.constructor = com_rpost_rmail_HandlerObject;

com_rpost_rmail_HandlerObject.prototype.toString =
function() {
   return "com_rpost_rmail_HandlerObject";
};

/** 
 * Creates the Zimbra OpenPGP Zimlet, extends {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html ZmZimletBase}.
 * @class
 * @extends ZmZimletBase
 *  */
var RPost = com_rpost_rmail_HandlerObject;

/** 
 * This method gets called when Zimbra Zimlet framework initializes.
 */
RPost.prototype.init = function() {
AjxPackage.require({name:"MailCore", callback:new AjxCallback(this, this._applyRequestHeaders)});
};

/** This method is called from init and makes a header available
 * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmMailMsg.html#.addRequestHeaders ZmMailMsg.html#.addRequestHeaders}.
 * */
RPost.prototype._applyRequestHeaders =
function() {   
   ZmMailMsg.requestHeaders["X-RPost-App"] = "X-RPost-App";
};

/** This method is called when a message is viewed in Zimbra. 
 * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html#onMsgView}.
 * @param {ZmMailMsg} msg - an email in {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmMailMsg.html ZmMailMsg} format
 * @param {ZmMailMsg} oldMsg - unused
 * @param {ZmMailMsgView} msgView - the current ZmMailMsgView (upstream documentation needed)
 * */
RPost.prototype.onMsgView = function (msg, oldMsg, msgView) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;   
   var infoBarDiv = document.getElementById(msgView._infoBarId);      
   if (infoBarDiv) {
      if(msg.attrs)
      {
         if(msg.attrs['X-RPost-App'])
         {
            var z = document.createElement('div');
            z.innerHTML = zimletInstance.getMessage('RPostZimlet_SentWithBanner') + ' <div class="RPost-infobar-right"></div>';
            z.className = 'RPost-infobar';
            infoBarDiv.insertBefore(z, infoBarDiv.firstChild);
         }
      }
   }
};   

/** This method gets called by the Zimlet framework when single-click is performed. And calls the Manage Keys dialog.
 */
RPost.prototype.singleClicked =
function() {  
   this.prefDialog();
};

/** This method gets called by the Zimlet framework when double-click is performed. And calls the Manage Keys dialog.
 */
RPost.prototype.doubleClicked =
function() {
   this.prefDialog();
};

/** This method shows a `ZmToast` status message. That fades in and out in a few seconds.
 * @param {string} text - the message to display
 * @param {string} type - the style of the message e.g. ZmStatusView.LEVEL_INFO, ZmStatusView.LEVEL_WARNING, ZmStatusView.LEVEL_CRITICAL
 * */
RPost.prototype.status = function(text, type) {
   var transitions = [ ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.PAUSE, ZmToast.PAUSE, ZmToast.FADE_OUT ];
   appCtxt.getAppController().setStatusMsg(text, type, null, transitions);
}; 

RPost.prototype.prefDialog =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   try
   {
      var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));
      var password = userSettings.Password;
   } catch(err) {
      zimletInstance.registerDialog();
      return;      
   }
   zimletInstance._dialog = new ZmDialog( { title:"RMail", parent:this.getShell(), standardButtons:[DwtDialog.OK_BUTTON], disposeOnPopDown:true } );   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:150px;">'+
   '<img src="'+zimletInstance.getResource("logo.png")+'">'+
   '<br><span id="formDescr">'+zimletInstance.getMessage('RPostZimlet_signedInWith')+': '+userSettings.Email+'</span><br><br>'+
   '<span id="RPostSignOut"><a id="RPostSignOut" href="#">'+ZmMsg.logOff+'</a></span><br><br>'+
   '</div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance._cancelBtn));   
   
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   var btnHaveAcct = document.getElementById("RPostSignOut");               
   btnHaveAcct.onclick = AjxCallback.simpleClosure(RPost.prototype._btnSignOut);
   zimletInstance._dialog.popup();  
};   

RPost.prototype._btnSignOut =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   zimletInstance.setUserProperty("com_rpost_properties", "", true);
   RPost.prototype.status(ZmMsg.ok, ZmStatusView.LEVEL_INFO);
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {
   }
}; 

RPost.prototype.registerDialog =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   zimletInstance._dialog = new ZmDialog( { title:"RMail", parent:this.getShell(), standardButtons:[DwtDialog.CANCEL_BUTTON,DwtDialog.OK_BUTTON], disposeOnPopDown:true } );
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:310px;">'+
   '<img src="'+zimletInstance.getResource("logo.png")+'">'+
   '<br><span id="formDescr">'+zimletInstance.getMessage('RPostZimlet_registerAccount')+'.</span><br><br>'+
   '<table>'+
   '<tr><td>'+ZmMsg.emailLabel+'&nbsp;</td><td><input class="RPostInput" type="text" name="RPostEmail" id="RPostEmail" value="'+appCtxt.getActiveAccount().name+'"></td></tr>'+
   '<tr><td>'+ZmMsg.passwordLabel+'&nbsp;</td><td><input class="RPostInput" type="password" name="RPostPassword" id="RPostPassword"></td></tr>'+
   '<tr id="RPostConfirmPasswordTr"><td>'+ZmMsg.passwordConfirmLabel+'&nbsp;</td><td><input class="RPostInput" type="password" name="RPostConfirmPassword" id="RPostConfirmPassword"></td></tr>'+
   '<tr id="RPostFirstNameTr"><td>'+ZmMsg.firstNameLabel+'</td><td><input class="RPostInput" type="text" name="RPostFirstName" id="RPostFirstName"></td></tr>'+
   '<tr id="RPostLastNameTr"><td>'+ZmMsg.lastNameLabel+'</td><td><input class="RPostInput" type="text" name="RPostLastName" id="RPostLastName"></td></tr>'+
   '</table>'+
   '<br><br><span id="btnHaveAcctSp"><a id="btnHaveAcct" href="#">'+zimletInstance.getMessage('RPostZimlet_haveAccount')+'</a></span><br><br>'+
   '</div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._registerAccountBtn));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance._registerAccountBtn));
   zimletInstance._dialog.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostEmail'),0);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostPassword'),1);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostConfirmPassword'),2);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostFirstName'),3);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostLastName'),4);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById(zimletInstance._dialog._button[1].__internalId));
   zimletInstance._dialog._tabGroup.addMember(document.getElementById(zimletInstance._dialog._button[2].__internalId));
   zimletInstance._dialog._baseTabGroupSize = 7;        
   
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   var btnHaveAcct = document.getElementById("btnHaveAcct");               
   btnHaveAcct.onclick = AjxCallback.simpleClosure(RPost.prototype._btnHaveAcct);
   zimletInstance._dialog.popup();   
};

RPost.prototype._forgotPassword =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();
   xhr.open('POST', 'https://webapi.r1.rpost.net/api/v1/Account/ForgotPassword', false);
   xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
 
   var data = {};
   data['UserEmailAddress'] = document.getElementById('RPostEmail').value;
   data['FromEmailAddress'] = document.getElementById('RPostEmail').value;
   data['CallbackUrl'] = "https://portal.rpost.com/#/password/";

   // send the collected data as JSON
   xhr.send(JSON.stringify(data)); 
   var result = JSON.parse(xhr.response);  
   if(result.StatusCode == 200)
   {
      result.Message.forEach(function(message) {
         RPost.prototype.status(message.Message, ZmStatusView.LEVEL_INFO);
      });
   }
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
   catch (err) {
   }
};

/** This method is called when the dialog "OK" button is clicked.
 * It pops-down the current dialog.
 */
RPost.prototype._registerAccountBtn =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();
   xhr.open('POST', 'https://webapi.r1.rpost.net/api/v1/Account/Register', false);
   xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
 
   var data = {};
   data['Email'] = document.getElementById('RPostEmail').value;
   data['Password'] = document.getElementById('RPostPassword').value;
   data['ConfirmPassword'] = document.getElementById('RPostConfirmPassword').value;
   data['FirstName'] = document.getElementById('RPostFirstName').value;
   data['LastName'] = document.getElementById('RPostLastName').value;
   data['PhoneNumber'] = null;
   data['AlternateEmail'] = null;
   data['ConfirmationCallbackUrl'] = null;
   data['RegistrationApp'] = 'Zimlet';
   data['Language'] = RPost.prototype.getLanguage();
   data['TimeZone'] = RPost.prototype.getTimezone();

   // send the collected data as JSON
   xhr.send(JSON.stringify(data));   
 
   var result = JSON.parse(xhr.response);  
   if(result.StatusCode == 200)
   {
      //only store values needed for zimlet
      var data = {};
      data['Email'] = document.getElementById('RPostEmail').value;
      data['Password'] = document.getElementById('RPostPassword').value;
      zimletInstance.setUserProperty("com_rpost_properties", JSON.stringify(data), true);
      result.Message.forEach(function(message) {
         RPost.prototype.status(message.Message, ZmStatusView.LEVEL_INFO);
      });
      zimletInstance._dialog.setContent(zimletInstance.getMessage('RPostZimlet_confirmationLink'));
      zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
      zimletInstance._dialog.setButtonVisible(DwtDialog.CANCEL_BUTTON, false);
   }
   else
   {
      result.Message.forEach(function(message) {
         RPost.prototype.status(message.Message, ZmStatusView.LEVEL_WARNING);
      });
   }      
};

RPost.prototype._btnHaveAcct =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   document.getElementById('RPostConfirmPasswordTr').style.display = 'none';
   document.getElementById('RPostFirstNameTr').style.display = 'none';
   document.getElementById('RPostLastNameTr').style.display = 'none';
   
   document.getElementById('btnHaveAcct').innerText = zimletInstance.getMessage('RPostZimlet_forgotPassword');
   var btnHaveAcct = document.getElementById("btnHaveAcct");               
   btnHaveAcct.onclick = AjxCallback.simpleClosure(RPost.prototype._forgotPassword);
   
   document.getElementById('formDescr').style.display = 'none';
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, zimletInstance._btngetToken));
   zimletInstance._dialog.setEnterListener(new AjxListener(zimletInstance, zimletInstance._btngetToken));
};

RPost.prototype._btngetToken =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();
   
   xhr.open('POST', 'https://webapi.r1.rpost.net/Token', false);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   
   var formData = 'grant_type=password&username='+
   encodeURIComponent(document.getElementById('RPostEmail').value)+'&Password='+ 
   encodeURIComponent(document.getElementById('RPostPassword').value);

   var data = {};
   data['Email'] = document.getElementById('RPostEmail').value;
   data['Password'] = document.getElementById('RPostPassword').value;

   // send the collected data as JSON
   xhr.send(formData);   
   var result = JSON.parse(xhr.response);  
   if(result.userName == data['Email'])
   {
      zimletInstance.setUserProperty("com_rpost_properties", JSON.stringify(data), true);
      RPost.prototype.status(ZmMsg.twoStepAuthSuccess, ZmStatusView.LEVEL_INFO);
      try{
         zimletInstance._dialog.setContent('');
         zimletInstance._dialog.popdown();
      }
      catch (err) {
      }  
      
   }
   else
   {     
      RPost.prototype.status(result.error_description, ZmStatusView.LEVEL_WARNING);
   }
};

/** This method is called when the dialog "CANCEL" button is clicked.
 * It pops-down the current dialog.
 */
RPost.prototype._cancelBtn =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   try{
      zimletInstance._dialog.setContent('');
      zimletInstance._dialog.popdown();
   }
      catch (err) {
  }
};

/** Add encrypt and sign buttons to the toolbar in the compose tab. 
  * This method is called by the Zimlet framework when application toolbars are initialized.
  * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html#initializeToolbar ZmZimletBase.html#initializeToolbar}
  * 
  * @param	{ZmApp}				app				the application
  * @param	{ZmButtonToolBar}	toolbar			the toolbar
  * @param	{ZmController}		controller		the application controller
  * @param	{string}			   viewId			the view Id
 * */
RPost.prototype.initializeToolbar =
function(app, toolbar, controller, viewId) {
   
   // bug fix #7192 - disable detach toolbar button
   toolbar.enable(ZmOperation.DETACH_COMPOSE, false);   
   
   if(viewId.indexOf("COMPOSE") >=0){
      if (toolbar.getButton('RPOST'))
      {
         //button already defined
         return;
      }
      var buttonArgs = {
         text    : "RMail",
         tooltip: "RPost",
         index: 4,
         image: "com_rpost_rmail-panelIcon",
         showImageInToolbar: true,
         showTextInToolbar: true
      };
      var button = toolbar.createOp("RPOST", buttonArgs);
      button.addSelectionListener(new AjxListener(this, this.askSendOptions, controller));
   }
};

RPost.prototype.askSendOptions =
function(controller) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;

   //check if user is registered first and has the zimlet configured, if not do register
   try
   {
      var userSettings = JSON.parse(zimletInstance.getUserProperty("com_rpost_properties"));
      var password = userSettings.Password;      
   } catch(err) { 
      zimletInstance.registerDialog();
      return;      
   }
   
   zimletInstance._dialog = new ZmDialog( { title:"RMail", parent:this.getShell(), standardButtons:[DwtDialog.CANCEL_BUTTON,DwtDialog.OK_BUTTON], disposeOnPopDown:true } );
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:340px;">'+
   '<img src="'+zimletInstance.getResource("logo.png")+'">'+   
   '<br><span><b>'+zimletInstance.getMessage('RPostZimlet_trackProve')+'</b>'+
   '<br><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="radio" name="RPosttrackprove" value="marked" checked="checked" id="RPostMarked">'+zimletInstance.getMessage('RPostZimlet_trackProveMarked')+
   '<br><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="radio" name="RPosttrackprove" value="unmarked" id="RPostUnMarked">'+zimletInstance.getMessage('RPostZimlet_trackProveUnMarked')+'</span>'+
   '<hr class="rpostHr">' +
   '<span><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostencrypt" value="encrypt" id="RPostEncrypt"><b>'+zimletInstance.getMessage('RPostZimlet_encrypt')+'</b><br></span>'+
   '<hr class="rpostHr">' +
   '<table><tr><td style="width:225px;"><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostESign" value="esign" id="RPostESign"><b>'+zimletInstance.getMessage('RPostZimlet_ESign')+'</b></td><td style="width:48%; text-align:right; padding-top:6px"><a href="#" id="rpostAdvancedLink" class="rpostAdvancedLinkDisabled" >'+ZmMsg.advanced+'</a></td></tr></table>'+
   '<hr class="rpostHr">' +
   '<span><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostLargeMail" value="largemail" id="RPostLargeMail"><b>'+zimletInstance.getMessage('RPostZimlet_LargeMail')+'</b><br></span>'+
   '<hr class="rpostHr">' +
   '<span><b>'+zimletInstance.getMessage('RPostZimlet_SideNote')+'</b>'+   
   '<table><tr><td><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostSideNoteCC" value="sidenoteCC" id="RPostSideNoteCC">'+ZmMsg.cc+
   '<br><input onclick="RPost.prototype.checkServiceCompatiblity(this.value)" type="checkbox" name="RPostSideNoteBCC" value="sidenoteBCC" id="RPostSideNoteBCC">'+ZmMsg.bcc+'</span></td><td><textarea rows="4" placeholder="'+zimletInstance.getMessage('RPostZimlet_SideNotePlaceHolder')+'" class="RPostSideNote" id="RPostSideNote"></textarea><br></td></tr></table>'+   
   '</div>'
   );
   
   zimletInstance._dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(zimletInstance, this.modifyMsg, [controller]));
   zimletInstance._dialog.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(zimletInstance, zimletInstance._cancelBtn));
/*
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostEmail'),0);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostPassword'),1);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostConfirmPassword'),2);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostFirstName'),3);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById('RPostLastName'),4);
   zimletInstance._dialog._tabGroup.addMember(document.getElementById(zimletInstance._dialog._button[1].__internalId));
   zimletInstance._dialog._tabGroup.addMember(document.getElementById(zimletInstance._dialog._button[2].__internalId));
   zimletInstance._dialog._baseTabGroupSize = 7;        
*/
   document.getElementById(zimletInstance._dialog.__internalId+'_handle').style.backgroundColor = '#eeeeee';
   document.getElementById(zimletInstance._dialog.__internalId+'_title').style.textAlign = 'center';
   
   zimletInstance._dialog.popup();   
};

RPost.prototype.checkServiceCompatiblity = function (clickedValue)
{
   if(clickedValue=='encrypt')
   {
      if(document.getElementById('RPostEncrypt').checked == true)
      {
         document.getElementById('RPostUnMarked').disabled = true;
         document.getElementById('RPostUnMarked').checked = false;
      }
      else
      {
         if(document.getElementById('RPostESign').checked == false)
         {
            document.getElementById('RPostUnMarked').disabled = false;
         }   
      }
   };

   if(clickedValue=='unmarked')
   {
      document.getElementById('RPostEncrypt').checked = false;
      document.getElementById('RPostESign').checked = false;
      document.getElementById('RPostEncrypt').disabled = true;
      document.getElementById('RPostESign').disabled = true;
   };

   if(clickedValue=='marked')
   {
      document.getElementById('RPostEncrypt').disabled = false;
      document.getElementById('RPostESign').disabled = false;
   };

   if(clickedValue=='esign')
   {      
      if(document.getElementById('RPostESign').checked == true)
      {
         document.getElementById('rpostAdvancedLink').className = "rpostAdvancedLinkEnabled";
         document.getElementById('rpostAdvancedLink').href = "https://www.rmail.com/zimbra-rsign";
         document.getElementById('rpostAdvancedLink').target = "_blank";
         document.getElementById('RPostUnMarked').disabled = true;
         document.getElementById('RPostUnMarked').checked = false;
      }
      else
      {
         document.getElementById('rpostAdvancedLink').className = "rpostAdvancedLinkDisabled";
         document.getElementById('rpostAdvancedLink').href = "#";
         document.getElementById('rpostAdvancedLink').target = "";
         if(document.getElementById('RPostEncrypt').checked == false)
         {
            document.getElementById('RPostUnMarked').disabled = false;
         }   
      }
   };  
};

RPost.prototype.modifyMsg = function (controller)
{
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;   
   var composeView = appCtxt.getCurrentView();   
   var addrs = composeView.collectAddrs();

   var fieldValue = '';
	if(addrs.TO) {
		var to = addrs.TO.all;
		for(i = 0; i < to.size(); i++) {
			var address = to.get(i);
			if(address.getAddress().indexOf('.rpost.biz') < 0)
         {
            address.setAddress(address.getAddress() + '.rpost.biz');
         }   
			fieldValue += address.toString() + '; ';
		}
      composeView.setAddress(AjxEmailAddress.TO, '');
      composeView.setAddress(AjxEmailAddress.TO, fieldValue);
	}

   var fieldValue = '';
	if(addrs.CC) {
		var to = addrs.CC.all;
		for(i = 0; i < to.size(); i++) {
			var address = to.get(i);
			if(address.getAddress().indexOf('.rpost.biz') < 0)
         {
            address.setAddress(address.getAddress() + '.rpost.biz');
         }
			fieldValue += address.toString() + '; ';
		}
      composeView.setAddress(AjxEmailAddress.CC, '');
      composeView.setAddress(AjxEmailAddress.CC, fieldValue);
	}

   var fieldValue = '';   
	if(addrs.BCC) {
		var to = addrs.BCC.all;
		for(i = 0; i < to.size(); i++) {
			var address = to.get(i);
			if(address.getAddress().indexOf('.rpost.biz') < 0)
         {
            address.setAddress(address.getAddress() + '.rpost.biz');
         }
			fieldValue += address.toString() + '; ';
		}
      composeView.setAddress(AjxEmailAddress.BCC, '');
      composeView.setAddress(AjxEmailAddress.BCC, fieldValue);
	}
   controller.sendMsg();
};

//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Type
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-App
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-TLS
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SecuRmail
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SecuRmail-AutoPassword
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SendPassword
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Esign
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Text
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Bcc
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Cc
RPost.prototype.addCustomMimeHeaders =
function(customHeaders) {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;   
   if(document.getElementById('RPostEncrypt'))
   {
      customHeaders.push({name:"X-RPost-App", _content:"zimlet"});

      if (document.getElementById('RPostEncrypt').checked == true)
      {        
         customHeaders.push({name:"X-RPost-TLS", _content:"1"});
         customHeaders.push({name:"X-RPost-SecuRmail", _content:"1"});
         customHeaders.push({name:"X-RPost-SecuRmail-AutoPassword", _content:"1"});
         customHeaders.push({name:"X-RPost-SendPassword", _content:"1"});
      }
      
      if (document.getElementById('RPostMarked').checked == true)
      {
         customHeaders.push({name:"X-RPost-Type", _content:"1"});
      }
      else if (document.getElementById('RPostUnMarked').checked == true)
      {
         customHeaders.push({name:"X-RPost-Type", _content:"2"});
      }

      if (document.getElementById('RPostESign').checked == true)
      {
         customHeaders.push({name:"X-RPost-Esign", _content:"1"});
      }
      
      if ( (document.getElementById('RPostSideNoteCC').checked)||(document.getElementById('RPostSideNoteBCC').checked)
      && (document.getElementById('RPostSideNote').value.length > 0)
      )
      {
         customHeaders.push({name:"X-RPost-Sidenote-Text", _content:document.getElementById('RPostSideNote').value});
         
         if(document.getElementById('RPostSideNoteCC').checked)
         {
            customHeaders.push({name:"X-RPost-Sidenote-Cc", _content:"1"});
         }
         else
         {
            customHeaders.push({name:"X-RPost-Sidenote-Cc", _content:"0"});
         }

         if(document.getElementById('RPostSideNoteBCC').checked)
         {
            customHeaders.push({name:"X-RPost-Sidenote-Bcc", _content:"1"});
         }
         else
         {
            customHeaders.push({name:"X-RPost-Sidenote-Bcc", _content:"0"});
         }                  
      }
     
      zimletInstance._cancelBtn();
   }   
};

/** Function to handle a show/hide button for password type input fields
 */
RPost.prototype.toggle_password = function (target) {
   var tag = document.getElementById(target);
   
   if (tag.getAttribute('type') == 'password')
   {
      tag.setAttribute('type', 'text');
   }
   else 
   {
      tag.setAttribute('type', 'password');   
   }
};

/** Method to match the Zimbra user langauge to the closest one in RPOST
 */
RPost.prototype.getLanguage = function () {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();   
   var userZimbraLang = appCtxt.get(ZmSetting.LOCALE_NAME).substring(0,2);
   var rpostLang = "en-us"; //default if no match was found
   try {
      xhr.open('GET', 'https://webapi.r1.rpost.net/api/v1/Lookup/Language', false);
      xhr.send(); 
      var result = JSON.parse(xhr.response);    
      if(result.StatusCode == 200)
      {        
         for(i = 0; i < result.ResultContent.length; i++) {
            if(result.ResultContent[i].Code.substring(0,2) == userZimbraLang)
            {
               console.log('RPost.prototype.getLanguage: success, returning language: ' + result.ResultContent[i].Code);
               rpostLang = result.ResultContent[i].Code;               
            }
         }               
      }
   }   
   catch (err)
   {
      console.log('RPost.prototype.getLanguage: Failed, network error, return fallback language en-us ' + err);
   }
   return rpostLang;
};

/** Method to match the Zimbra user timezone to the closest one in RPOST
 */
RPost.prototype.getTimezone = function () {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   var xhr = new XMLHttpRequest();   
   var userZimbraTimezone = appCtxt.get(ZmSetting.DEFAULT_TIMEZONE).split("/");
   userZimbraTimezone = userZimbraTimezone[1];
   var rpostTimezone = "US Eastern Standard Time"; //default if no match was found
   try {
      xhr.open('GET', 'https://webapi.r1.rpost.net/api/v1/Lookup/timezone', false);
      xhr.send(); 
      var result = JSON.parse(xhr.response);    
      if(result.StatusCode == 200)
      {        
         for(i = 0; i < result.ResultContent.length; i++) {
            if(result.ResultContent[i].Description.indexOf(userZimbraTimezone) > -1)
            {
               console.log('RPost.prototype.getTimezone: success, returning timezone: ' + result.ResultContent[i].Code);
               rpostTimezone = result.ResultContent[i].Code;               
            }
         }               
      }
   }   
   catch (err)
   {
      console.log('RPost.prototype.getTimezone: Failed, network error, return fallback getTimezone US Eastern Standard Time ' + err);
   }
   return rpostTimezone;
};
