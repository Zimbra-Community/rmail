# rmail
RMail | The global standard for secure & certified electronic communications

This is a work-in-progress and not yet ready for production.

## Configure server

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

RMail has an option (RPX) to wrap emails in encrypted PDF's, by default, Zimbra does not 
allow them to pass the antivirus filter. You can enable encrypted PDF's by following
this wiki:

https://wiki.zimbra.com/wiki/Emails_are_blocked_with_the_notification_VIRUS_(Heuristics.Encrypted.PDF)


## MIT License

Copyright (c) 2017 Zeta Alliance

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

