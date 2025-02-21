/****************************************************************************/

/////////////////////////////////////////////////////////////////////////////

var m_objParent     = null;
var m_nMsgType      = 1;
var m_nBtnType      = 2;
var m_strTitle      = "Information";
var m_strMsg        = "";
var m_nRetValue     = "";
var m_extradata     = "";
var m_nFocus        = -1;
var m_strCallScript = "";
var m_strMessageId  = "";
var m_nCallBackType = 1;
var m_strMapId      = "";
var m_nResult       = 0;
/*************************ScreenEvent*************************/
function _I_ScreenEvent() {}

function screen_on_load()
{
	var arrExtraData = screen.getextradata();
	m_objParent      = screen.getparent();
	m_nCallBackType  = arrExtraData.CALLTYPE;
	m_strTitle       = arrExtraData.TITLE;
	m_nMsgType       = arrExtraData.MSG_TYPE;
	m_nBtnType       = arrExtraData.BTN_TYPE;
	m_strMsg         = arrExtraData.MSG;
	m_nFocus         = arrExtraData.FOCUS;
	m_strCallScript  = arrExtraData.CALLFUNC;
	m_strMessageId   = arrExtraData.MSG_ID;
	m_strMapId       = arrExtraData.MAPID;
	m_nResult        = arrExtraData.RESULT;
	
console.log("m_strTitle     :" + m_strTitle);
console.log("m_nMsgType     :" + m_nMsgType);
console.log("m_nBtnType     :" + m_nBtnType);
console.log("m_strMsg       :" + m_strMsg);
console.log("m_nFocus       :" + m_nFocus);
console.log("m_strCallScript:" + m_strCallScript);
console.log("m_strMapId     :" + m_strMapId);
console.log("m_nResult      :" + m_nResult);

	this.SetDisplay();
}

function screen_on_keydown(keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	//console.log("keycode="+keycode);
	
	// 엔터키,  ESC, 스페이스바 키로 화면 닫기 구현
//	if(keycode == 13 || keycode == 27 || keycode == 32) {
//		var obj = screen.getfocuscontrol();
//		var objName = obj.getname();
//		eval("this."+objName+"_on_mouseup()");
//	}
	return 0;
}

function screen_on_destroy()
{
console.log("m_nCallBackType:" + m_nCallBackType);	
	try {
		var arrParams = [];
		if(SYSUtil.isScrObject(m_objParent) == true) {
			
			if(m_nCallBackType == 1) {
				// 화면 on_messagebox 이벤트 호출
				m_strCallScript = "screen_on_messagebox";
				arrParams.push(m_strMessageId);
				arrParams.push(1);
			} else if(m_nCallBackType == 1) {
				// 화면 별도 callback 함수 호출
				arrParams.push(2);
			} else if(m_nCallBackType == 3) {
				// 화면 txSubmitComplete 함수 호출
				m_strCallScript = "txSubmitComplete";
				arrParams.push(m_strMapId);
				arrParams.push(m_nResult);
			//	this.getFrameMembers(m_objParent).showLoadingProcess(false);
			}
			if(m_strCallScript != "") {
				if(m_objParent.findscriptmethod(XFD_JAVASCRIPT, m_strCallScript) == true) {
					console.log(" script:" + m_strCallScript +  makeParamString(arrParams));					
					m_objParent.callscriptmethod(m_strCallScript +  makeParamString(arrParams) , XFD_JAVASCRIPT);		
				}
			}
		}
	} catch(e) {
		console.log("[messageBox](screen_on_destroy) error = " + e);
	}
	return 1;
}

/*************************ObjectEvent*************************/
function _II_ObjectEvent() {}
/**
 * (취소, 아니오, 예)버튼클릭
 */
function btnMsgRet_on_mouseup(objInst, index)
{
console.log("btnMsgRet_on_mouseup");	
	screen.unloadpopup(index);
}

/*************************UserFunction************************/
function _III_UserFunction() {}

/**
 * callscriptmethod 에 파라메터로 전달할 값들을 문자열로 변환하는 API
 * @param arrParams  문자열로 변환할 파라메터
 * @return 파라메터로 넘길 문자열
 */
function makeParamString(arrParams)
{
	var arr = [];
	
	for(var i = 0; i < arrParams.length; i++) {
		switch(typeof(arrParams[i])) {
			case "string":
				arr.push(parseStringVarWithQuote(arrParams[i]));
				break;
			case "number":
				arr.push(arrParams[i]);
				break;
			default:
				arr.push( "\'\'" );
				break;
		} 
	}
	
	return "(" + arr.join(",") + ")";
}

/**
 * 문자열 변수 앞뒤에 따옴표를 붙인다.
 * @param strVar  문자열
 * @return 수정된 문자열
 */
function parseStringVarWithQuote(strVar)
{
	if(typeof(strVar).toLowerCase() == "string"){
		return "\'" + strVar + "\'";
	} else {
		return "\'\'";
	}
}

function SetDisplay()
{
	if(m_strMsg == null) m_strMsg = "";
	
	this.SetImage();
	this.SetButton();
	this.setMessage();
	this.txtMsgTitle.settext(m_strTitle);
	
	// Drag Area 지정
	screen.setpopupdragarea(0, 0, screen.getscreenwidth(), this.pnlTop.getheight());
}

function SetImage()
{
	switch(m_nMsgType) {
		// confirm
		case XFD_MB_STOP  : 
		case 4:	
		//	imgType.setimage(CCNConst.IMG_FRAME_PATH + "alert/popup_picto_confirm.png");
			this.txtMsgTypeNm.settext("중지");
			break;
		// error
		case XFD_MB_ERROR : 
		case 2:	
		//	imgType.setimage(CCNConst.IMG_FRAME_PATH + "alert/popup_picto_warning.png");			
			this.txtMsgTypeNm.settext("에러");
			break;	
		// question		
		case XFD_MB_QUESTION : 
		case 3:
		//	imgType.setimage(CCNConst.IMG_FRAME_PATH + "alert/popup_picto_confirm.png");			
			this.txtMsgTypeNm.settext("확인");
			break;
		// information	
		case XFD_MB_INFORMATION : 
		case 1:	
		default:
			this.txtMsgTypeNm.settext("알림");
		//	imgType.setimage(CCNConst.IMG_FRAME_PATH + "alert/popup_picto_handing.png");			
			break;	
	}
}

function SetButton()
{
//  XFD_MB_FOCUSBUTTON1 = 0
//  XFD_MB_FOCUSBUTTON2 = 1
//  XFD_MB_FOCUSBUTTON3 = 2

	switch(m_nBtnType) {
		case XFD_MB_OKCANCEL : 
		case 3:
			this.btnMsgRet[0].settext("확인"); 
			this.fitBtnText(btnMsgRet[0]);
			
			this.btnMsgRet[1].settext("취소");
			this.fitBtnText(this.btnMsgRet[1]);
			
			this.btnMsgRet[2].setvisible(false); 
			break;
		case XFD_MB_RETRYCANCEL : 
		case 4:
			this.btnMsgRet[0].settext("다시 시도"); 
			this.fitBtnText(this.btnMsgRet[0]);
			
			this.btnMsgRet[1].settext("취소"); 
			this.fitBtnText(this.btnMsgRet[1]);
			
			this.btnMsgRet[2].setvisible(false); 
			break;
		case XFD_MB_YESNO : 
		case 5:
			this.btnMsgRet[0].settext("예"); 
			this.fitBtnText(this.btnMsgRet[0]);
			
			this.btnMsgRet[2].settext("아니오");
			this.fitBtnText(this.btnMsgRet[2]);
			
			this.btnMsgRet[1].setvisible(false); 		
			break;
		case XFD_MB_ABORTRETRYIGNORE : 
		case 1:
			this.btnMsgRet[0].settext("중단"); 
			this.fitBtnText(this.btnMsgRet[0]);
			
			this.btnMsgRet[1].settext("다시 시도"); 
			this.fitBtnText(this.btnMsgRet[1]);

			this.btnMsgRet[2].settext("무시");
			fitBtnText(this.btnMsgRet[2]);
			break;
		case XFD_MB_YESNOCANCEL : 
		case 6:
			this.btnMsgRet[0].settext("예"); 
			this.fitBtnText(this.btnMsgRet[0]);

			this.btnMsgRet[1].settext("아니오"); 
			this.fitBtnText(this.btnMsgRet[1]);
			
			this.btnMsgRet[2].settext("취소");
			this.fitBtnText(this.btnMsgRet[2]);
			break;
		case XFD_MB_OK : 
		case 2:
		default : 
			this.btnMsgRet[0].settext("확인"); 
			this.fitBtnText(this.btnMsgRet[0]);
			
			this.btnMsgRet[1].setvisible(false);
			this.btnMsgRet[2].setvisible(false); 
			break;
	}

	switch(m_nFocus) {
		case 1:
			 this.btnMsgRet[2].setfocus();
			 break;
		case 2:
			 this.btnMsgRet[1].setfocus();
			 break;
		case 0:
		default :
			 this.btnMsgRet[0].setfocus();
			 break;		
	}
}

/**
 * 버튼의 텍스트에 따라서 버튼 크기를 변경한다.
 */
function fitBtnText(objCtrl)
{
	var strBtnText = objCtrl.gettext();
	var arrBtnPos  = objCtrl.getrect();
	this.capTemp1.settext(strBtnText);
	this.capTemp1.fittext(1);
	var nNewBtnWidth  = this.capTemp1.getwidth() + 20;
	var nBaseBtnWidth = 110;	// 버튼 기본 width
	
	// 기본 버튼 사이즈보다 크면 버튼 크기를 조정한다.
	if(nBaseBtnWidth < nNewBtnWidth) {
		objCtrl.setrect(arrBtnPos[0], arrBtnPos[1], arrBtnPos[0] + nNewBtnWidth, arrBtnPos[3]);
	}
}

function setMessage(strMsg)
{
	this.mtlMsg.settext(m_strMsg);
}




// 함수 주석 표준 시작
/**
 * 설명부분
 * @param {변수형식} 변수명 변수에 대한 설명부분
 * @return {리턴형식} 리턴값에 대한 설명
 */
// 함수 주석 표준 종료

// 변수 주석 표준 시작
// 여러줄 변수 주석
/**
 * 변수명에 대한 설명
 * @type {변수형식}
 */

// 한줄 변수 주석
/** @type {변수형식} 변수에 대한 설명 */
// 변수 주석 표준 종료


function _btnMessagePopClose_on_mouseup(objInst)
{
	screen.unloadpopup(-1);
}