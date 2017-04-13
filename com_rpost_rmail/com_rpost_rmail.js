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

}

/** This method is called from init and makes a header available
 * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmMailMsg.html#.addRequestHeaders ZmMailMsg.html#.addRequestHeaders}.
 * */
RPost.prototype._applyRequestHeaders =
function() {   
   ZmMailMsg.requestHeaders["X-RPost-Type"] = "X-RPost-Type";
};

/** This method is called when a message is viewed in Zimbra. 
 * See {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmZimletBase.html#onMsgView}.
 * @param {ZmMailMsg} msg - an email in {@link https://files.zimbra.com/docs/zimlet/zcs/8.6.0/jsapi-zimbra-doc/symbols/ZmMailMsg.html ZmMailMsg} format
 * @param {ZmMailMsg} oldMsg - unused
 * @param {ZmMailMsgView} msgView - the current ZmMailMsgView (upstream documentation needed)
 * */
RPost.prototype.onMsgView = function (msg, oldMsg, msgView) {
   //Only integrate in Mail, Drafts and Search app.
   if((appCtxt.getCurrentAppName()=='Mail') || (appCtxt.getCurrentAppName()=='Search'))
   {
      if(appCtxt.getCurrentAppName()=='Mail')
      {
         //Conversation view top item
         if(msgView.parent._className == 'ZmConvView2')
         {
            var bodynode = document.getElementById('main_MSGC'+msg.id+'__body');
            var attNode = document.getElementById('zv__CLV__main_MSGC'+msg.id+'_attLinks');
         }
         //By-message view
         else if (msgView.parent._className == 'ZmTradView')
         {  
            var bodynode = document.getElementById('zv__TV-main__MSG__body');
            var attNode = document.getElementById('zv__TV__TV-main_MSG_attLinks');
         }
      }
      else if(appCtxt.getCurrentAppName()=='Search')
      {
         //By-message view
         if (msgView.parent._className == 'ZmTradView')
         { 
            var bodynode = document.getElementById(msgView.__internalId+'__body');
            var attNode = document.getElementById('zv__'+msgView.__internalId.replace('zv','TV').replace('_MSG','MSG')+'_attLinks');
         } 
      }

      //Create new empty infobar for displaying pgp result
      var el = msgView.getHtmlElement();
      var g=document.createElement('div');
      g.setAttribute("id", 'com_rpost_rmail_actionbar'+appCtxt.getCurrentAppName()+msg.id);
      g.setAttribute("class", 'com_rpost_rmail_actionbar');
      el.insertBefore(g, el.firstChild);
      
      var g=document.createElement('div');
      g.setAttribute("id", 'com_rpost_rmail_infobar'+appCtxt.getCurrentAppName()+msg.id);
      g.setAttribute("class", 'com_rpost_rmail_infobar');
      el.insertBefore(g, el.firstChild); 
   }   
};   

/** This method gets called by the Zimlet framework when single-click is performed. And calls the Manage Keys dialog.
 */
RPost.prototype.singleClicked =
function() {  
   //Launch Manage keys
   this.displayDialog();
};

/** This method gets called by the Zimlet framework when double-click is performed. And calls the Manage Keys dialog.
 */
RPost.prototype.doubleClicked =
function() {
   //Launch Manage keys
   this.displayDialog();
};

/** This method shows a `ZmToast` status message. That fades in and out in a few seconds.
 * @param {string} text - the message to display
 * @param {string} type - the style of the message e.g. ZmStatusView.LEVEL_INFO, ZmStatusView.LEVEL_WARNING, ZmStatusView.LEVEL_CRITICAL
 * */
RPost.prototype.status = function(text, type) {
   var transitions = [ ZmToast.FADE_IN, ZmToast.PAUSE, ZmToast.PAUSE, ZmToast.PAUSE, ZmToast.FADE_OUT ];
   appCtxt.getAppController().setStatusMsg(text, type, null, transitions);
}; 

/** This method displays dialogs to the end user.
 * @param {number} id - the dialog id to display
 * @param {string} title - initial title for the dialog
 * @param {string} message - additional arguments or message text for the dialog
 */
RPost.prototype.displayDialog =
function() {
   var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_rpost_rmail').handlerObject;
   zimletInstance._dialog = new ZmDialog( { title:"RPost", parent:this.getShell(), standardButtons:[DwtDialog.CANCEL_BUTTON,DwtDialog.OK_BUTTON], disposeOnPopDown:true } );
   
   zimletInstance._dialog.setContent(
   '<div style="width:450px; height:290px;">'+
   '<img src="'+zimletInstance.getResource("logo.png")+'">'+
   '<br>'+zimletInstance.getMessage('RPostZimlet_label')+' | '+zimletInstance.getMessage('RPostZimlet_slogan')+'.<br><br>'+
   '<span id="btnHaveAcctSp"><a id="btnHaveAcct" href="#">'+zimletInstance.getMessage('RPostZimlet_haveAccount')+'</a>.</span><br><br>'+
   '<table>'+
   '<tr><td>'+ZmMsg.emailLabel+'&nbsp;</td><td><input class="RPostInput" type="text" name="RPostEmail" id="RPostEmail" value="'+appCtxt.getActiveAccount().name+'"></td></tr>'+
   '<tr><td>'+ZmMsg.passwordLabel+'&nbsp;</td><td><input class="RPostInput" type="text" name="RPostPassword" id="RPostPassword"></td></tr>'+
   '<tr id="RPostConfirmPasswordTr"><td>'+ZmMsg.passwordConfirmLabel+'&nbsp;</td><td><input class="RPostInput" type="text" name="RPostConfirmPassword" id="RPostConfirmPassword"></td></tr>'+
   '<tr id="RPostFirstNameTr"><td>'+ZmMsg.firstNameLabel+'</td><td><input class="RPostInput" type="text" name="RPostFirstName" id="RPostFirstName"></td></tr>'+
   '<tr id="RPostLastNameTr"><td>'+ZmMsg.lastNameLabel+'</td><td><input class="RPostInput" type="text" name="RPostLastName" id="RPostLastName"></td></tr>'+
   '</table></div>'
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

   // send the collected data as JSON
   xhr.send(JSON.stringify(data));   
 
   var result = JSON.parse(xhr.response);  
   if(result.StatusCode == 200)
   {
      zimletInstance.setUserProperty("com_rpost_properties", JSON.stringify(data), true);
      result.Message.forEach(function(message) {
         RPost.prototype.status(message.Message, ZmStatusView.LEVEL_INFO);
      });
      try{
         zimletInstance._dialog.setContent('');
         zimletInstance._dialog.popdown();
      }
      catch (err) {
      }         
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
   document.getElementById('btnHaveAcctSp').style.display = 'none';
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
   if(result.StatusCode == 200)
   {
      zimletInstance.setUserProperty("com_rpost_properties", JSON.stringify(data), true);
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

/** This method generates a password like passphrase for lazy users.
 * @returns {string} pass -  a 25 character password
 */
RPost.prototype.pwgen =
function ()
{
   chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
   pass = "";

   for(x=0;x<25;x++)
   {
      i = Math.floor(Math.random() * 62);
      pass += chars.charAt(i);
   }
   return pass;
}

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
         text    : "RPost",
         tooltip: "RPost",
         index: 4, //position of the button
         image: "zimbraicon" //icon
      };
      var button = toolbar.createOp("RPOST", buttonArgs);
      button.addSelectionListener(new AjxListener(this, this.modifyMsg, controller));
   }
};

RPost.prototype.modifyMsg = function (controller)
{
   var composeView = appCtxt.getCurrentView();
   var fieldValue = '';
   var addrs = composeView.collectAddrs();

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

/** This method is called by the Zimlet framework whenever an email is about to be send.*/
/*
RPost.prototype.emailErrorCheck =
function(mail, boolAndErrorMsgArray) {
   return null;
};
*/

//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Type
//zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-App
RPost.prototype.addCustomMimeHeaders =
function(customHeaders) {
   //hardcoded for all outgoing email now, to-do: add it dynamically
   customHeaders.push({name:"X-RPost-Type", _content:"1"});
   customHeaders.push({name:"X-RPost-App", _content:"zimlet"});
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
}
