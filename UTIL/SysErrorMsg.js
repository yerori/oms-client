function _getFrameType() {return "SYS_ERROR_MSG";}

function I_GlobalVar(){}

var m_Tran;
var m_iScreenHeight = 179;
var m_iErrMsgHeight = 29;

var m_iOldWidth = 0;

function II_TempFunction(){}

function III_UserFunction(){}

function setTranLink(ATran)
{
	m_Tran = ATran;
}

function setErrorMsg(arrMsgTitle, arrMsg, msgNumber, duration){
	let objTab = screen.getscreentab();
	let revisionHeight = this.setRowNumber(msgNumber);
	this.setErrorMsgTitle(arrMsgTitle);
	this.setErrorMsgContent(arrMsg);
	this.setTotalHeightSize(revisionHeight);
	objTab.setvisible(true);
	if(duration != 0){
		this.tiClose.setinterval(duration * 1000);
		this.tiClose.setenable(true);
	}
}

function setRowNumber(msgNumber){
	let tvRowCount = this.tvErrorMsg.getrowcount();
	let revisionHeight = 0;
	for(var i = msgNumber; i < tvRowCount; i++){
		this.tvErrorMsg.setrowhidden(i, true, true);
		revisionHeight = revisionHeight + 1;
	}
	return revisionHeight;
}

function setErrorMsgTitle(arrMsgTitle){
	let titleCtrl;
	arrMsgTitle.forEach(function(value, index, array){
		titleCtrl = this.screen.getinstancebyname("txtErrorMsgTitle" + index);
		titleCtrl.settext(value);
	});
}

function setErrorMsgContent(arrMsg){
	let contentCtrl;
	arrMsg.forEach(function(value, index, array){
		contentCtrl = this.screen.getinstancebyname("txtErrorMsg" + index);
		contentCtrl.settext(value);
	});
}

function setTotalHeightSize(revisionHeight){
	this.screen.setscreenheight(m_iScreenHeight - (revisionHeight * m_iErrMsgHeight));
	screen.getscreentab().setheight(m_iScreenHeight - (revisionHeight * m_iErrMsgHeight) + 2);
}

function IV_EventFunction(){}

function screen_on_load()
{
	
}

function BtnClose_on_mouseup(objInst)
{
	var objTab = screen.getscreentab();
	objTab.setvisible(false);
}

function screen_on_size(window_width, window_height)
{

}

function screen_on_activate()
{
	
}

function tiClose_on_time(objInst)
{
	if (screen.getscreentab().getvisible() == true) {
		screen.getscreentab().setvisible(false);
		screen.getparent().setfocus();
	}
}

function screen_on_popupdestroy(popup_screen, popup_name, result)
{
	
}

function sysErrorConsoleRedraw()
{
	var lineCnt = 1;
	var redrawHeight = 0;
	var idx = 0;
	var enterCnt = 0;
	var ncy = 0;
	var visibleHeight = 0;
	
	var classFont = ErrMsg_User.getfont();
	
	var iClsSize = factory.gettextdrawsize(classFont, ErrMsg_User.gettext());
	
	lineCnt = Math.ceil(iClsSize.ncx / ErrMsg_User.getwidth());
	while(true){
		idx = ErrMsg_User.gettext().indexOf("\n",idx + 1);	
		if(idx > -1){
			enterCnt = enterCnt + 1;
		}else{
			break;
		}
	}
	ncy = iClsSize.ncy;
	if(lineCnt <= 1 && enterCnt == 0){
		redrawHeight = ErrMsg_User.getheight();
	}else{
		if(enterCnt > 0){
			ncy = iClsSize.ncy / (enterCnt + 1);
			lineCnt = lineCnt + enterCnt;
		}
		redrawHeight = (ncy + 7 - lineCnt + 2) * lineCnt;
	}
	
	ErrMsg_User.setheight(redrawHeight);
	txt_ErrMsg_User.setheight(redrawHeight);
	if (ErrMsg_TreatCD.gettext() == "") {
		visibleHeight += ErrMsg_TreatCD.getheight();
	}
	if (TreatMsg.gettext() == "") {
		txt_TreatMsg.setvisible(false);
		TreatMsg.setvisible(false);
		visibleHeight += TreatMsg.getheight();
	} else {
		txt_TreatMsg.setvisible(true);
		TreatMsg.setvisible(true);
		txt_TreatMsg.settop(ErrMsg_User.getbottom() - 1);
		TreatMsg.settop(ErrMsg_User.getbottom() - 1);
	}
	screen.setscreenheight(m_iMaxHeight + redrawHeight - m_iErrMsgHeight - visibleHeight);
	screen.getscreentab().setheight(m_iMaxHeight + redrawHeight - m_iErrMsgHeight - visibleHeight + 2);
	
}