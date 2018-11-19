# RMail for Zimbra
RMail | The global standard for secure & certified electronic communications

**Production ready.**

## Installing

    cd /tmp
    wget --no-cache https://github.com/Zimbra-Community/rmail/releases/download/0.3.4/com_rpost_rmail.zip -O /tmp/com_rpost_rmail.zip
    su zimbra

    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Type
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-App
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-TLS
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SecuRmail
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SecuRmail-AutoPassword
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-SendPassword
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Esign
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Text
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Bcc
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-Sidenote-Cc  
    zmprov mcf +zimbraCustomMimeHeaderNameAllowed X-RPost-LargeMail  
    
    cd /tmp
    zmzimletctl deploy com_rpost_rmail.zip
    
Re-run the install steps above when upgrading the Zimlet to newer versions, 
only for upgrades you can also run the following to flush the server cache:

    zmprov fc all
    zmmailboxdctl restart

Keep in mind the browser cache, if upgrading does not work, use an incognito browser tab, or flush browser cache.

## Allow encrypted PDF

RMail has an option (RPX) to wrap emails in encrypted PDF's, by default, Zimbra does not 
allow them to pass the antivirus filter. You can enable encrypted PDF's like this:

     su zimbra
     zmprov mcf zimbraVirusBlockEncryptedArchive FALSE
     zmclamdctl restart


## Configure Zimlet

This is optional , see `Configurable options` below on what you can configure.
    
To change the default configuration, you can change config_template.xml like this, you
must have installed the zimlet before configuring (steps above):

    su zimbra
    zmzimletctl getConfigTemplate com_rpost_rmail.zip
    nano config_template.xml  # make your changes
    zmzimletctl configure config_template.xml

Configurable options

| property name  | default value   |  description  | 
|---|---|---|
| trialUnitsRemainingTreshold | 5 | When on trial plan, show the remaining message count and upgrade link when remaining message count is <= trialUnitsRemainingTreshold |


## Uninstall

    su zimbra
    zmzimletctl undeploy com_rpost_rmail


## License

Copyright (c) 2017-2018 RCom Limited ("RPost"), general terms of use follow:

Permission is hereby granted, free of charge, to any person obtaining a copy of this RMail for Zimbra zimlet software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, only in associations with use of the Software with a connection to software services operated and provided by RPost and its subsidiaries, and subject to the RPost software service general terms and conditions and legal notices posted at www.rpost.com which may be amended from time to time (https://www.rmail.com/service-level-agreement ). User agrees that this Software use does not constitute a license or permission to use RPost copyrights, trademarks, and patents (https://www.rpost.com/patents ) other than may be required for use of the Software with RPost software service general terms and conditions. There is no license, grant or permission to use the Software, registered and unregistered trademarks, copyright materials, images, logos, patented and unpatented technologies without use of the software services operated and provided by RPost and its subsidiaries as noted above in accordance with their software service general terms and conditions and legal notices posted at www.rpost.com.  

The above copyright and general terms of use notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


