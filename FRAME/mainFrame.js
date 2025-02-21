/****************************************************************************

/////////////////////////////////////////////////////////////////////////////



/**
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */
function _getFrameType()
{
	return "MAIN_PORTLET";
}

var _tranProcCnt;
function _addTranProcCnt()
{
	this._tranProcCnt++;
}

function _subtractTranProcCnt()
{
	this._tranProcCnt--;
}

function _zeroTranProcCnt()
{
	this._tranProcCnt = 0;
}

function _getTranProcCnt()
{
	return this._tranProcCnt;
}

function _I_GlobalVar() {}
var m_ScrInfo = {
		SCR_ID     : "",
		SCR_PATH   : "",
		MENU_ID    : "",
		MENU_NM    : "",
		TAB_INDEX  : "",
		L_MENU_INX : "",
		PARENT_SCR : null,
		AUTH_INFO  : null
	};

function getScreenInfo()
{
	//console.log("getScreenInfo - MainFrame ");
	return m_ScrInfo;
}

/*************************ScreenEvent*************************/
function _I_ScreenEvent() {}

/**
 * 최초 화면 로드시에 호출처리
 */

var commonButtonEvent = {};
//var _commonButtonGroupObject;
function screen_on_load()
{
	//console.log("mainFrame Load");
	this._tranProcCnt = 0;
	var objExtra_data    = screen.getextradata();
	var objBizExtra_data = null;

	m_ScrInfo.SCR_ID = "";

	//= 업무 화면정보
	m_ScrInfo.SCR_ID     = objExtra_data.SCR_ID;
	m_ScrInfo.SCR_PATH   = objExtra_data.SCR_PATH;
	m_ScrInfo.MENU_ID    = objExtra_data.MENU_ID;
	m_ScrInfo.MENU_NM    = objExtra_data.MENU_NM;
	m_ScrInfo.TAB_INDEX  = objExtra_data.TAB_INDEX;
	m_ScrInfo.L_MENU_INX = objExtra_data.L_MENU_INX;
	m_ScrInfo.PARENT_SCR = objExtra_data.PARENT_SCR;
	m_ScrInfo.AUTH_INFO  = objExtra_data.AUTH_INFO;
	objBizExtra_data     = objExtra_data.BIZ_EXT;	// 업무화면 전달 데이타
/*
	-1: 파라미터에 문제가 있을 경우
	-2: 화면이 존재하지 않는 경우(_xf_param에 CHECK_SCREENURL 값이 true인 경우 적용)
*/
	//tabBizScreen.addcontenttab("", 0, 0, m_ScrInfo.SCR_PATH, true);
	//SYSVar.SELECTED_MIDDLE_TAB.addtab("", 0, 120, strFrameUrl, true, objExtra_data);
	//var nRet = this.tabBizScreen.addtab("", 0, 0, m_ScrInfo.SCR_PATH, true, objExtra_data);
	var nRet = this.tabBizScreen.addportlettab("", 0, 0, m_ScrInfo.SCR_PATH, "bizScreen", true, objBizExtra_data);
	if(nRet == -1) {
		screen.alert("[" + nRet + "]  파라미터에 문제가 있을 경우");
		return;
	} else if(nRet == -2) {
		screen.alert("[" + nRet + "]  화면이 존재하지 않는 경우(_xf_param에 CHECK_SCREENURL 값이 true인 경우 적용)");
		return;
	}
	
	if(!m_ScrInfo.MENU_NM)
	{
		var loadedScreen = this.tabBizScreen.getchildscreeninstance(0);
		var screenTitle = loadedScreen.getscreentitle();
		var foucsIdx = SYSVar.SELECTED_MIDDLE_TAB.gettabitemfocus();
		
		if(foucsIdx > -1) 
		{
			var focusItemTitle = SYSVar.SELECTED_MIDDLE_TAB.gettabitemtext(foucsIdx);
			if(focusItemTitle == "") SYSVar.SELECTED_MIDDLE_TAB.settabitemtext(foucsIdx,screenTitle);
		}
	}
	
	//_commonButtonGroupObject = SYSUtil.loadCommonButtonGroup(screen);
	
}

//스크린데이터셋에 윈도우 아이디 삽입 
function fnSetWindowId(objScreen , iTabIndex){
	
	var iTabScreenWindowId = objScreen.getwindowid();	//윈도우 아이디를 삽입합니다
	//console.log("iTabScreenWindowId : " + iTabScreenWindowId);
	var aryDual = [ ["TYPE" , "PTL"]  ,  ["SCREEN_MDI_TAB_INDEX" , iTabIndex] ];
	var iSRow = UT.gfnAndFindRow(gdsScreen , aryDual);	
	
	gdsScreen.setdatabyname(iSRow , "SCREEN_WINDOW_ID" , iTabScreenWindowId);
}

/**
 * 화면 사이즈가 변경되면은 발생한다.
 * @param {number} window_width 화면 크기
 * @param {number} window_height 화면 크기
 */
function screen_on_size(window_width, window_height)
{
//	CCNLayout.processSizeEvent(this.screen, window_width, window_height);
}

function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	console.log("screen_on_submitcomplete in container");
}

/*************************ObjectEvent*************************/
function _II_ObjectEvent() {}

function tabBizScreen_on_itemcreate(objInst, itemindex)
{
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	SYSVar.SELECTED_MIDDLE_TAB.settabitemtext(SYSVar.SELECTED_MIDDLE_TAB.gettabitemfocus(), m_ScrInfo.MENU_NM);
	//this.capScreenTitle.settext(m_ScrInfo.MENU_NM);
	//this.capScreenTitle.fittext(1, 2);
	var objBizScreen = this.tabBizScreen.getchildscreeninstance(itemindex);
	//console.log("m_ScrInfo.MENU_NM : " + m_ScrInfo.MENU_NM);
	this.fnSetWindowId(objBizScreen , m_ScrInfo.TAB_INDEX);	//스크린데이터셋에 윈도우 아이디 삽입
		
//	includeModule(objBizScreen);
//	
//	if(objBizScreen.geteventhandler("on_scroll") == "") {
//		objBizScreen.registerevent("on_scroll", "bizScreen_on_scroll(hscroll_left, vscroll_top, hscroll_pos, vscroll_pos)");
//	} else {
//		console.log("objBizScreen.geteventhandler():" + objBizScreen.geteventhandler("on_scroll"));
//	} 
	SYSVar.LEFTMAIN_SCREEN.eventlock(false, true);
	//SYSUtil.setCommonBtnRegistEvent(screen, _commonButtonGroupObject);
//	_commonButtonGroupObject.getCommonBtnArr().forEach(function (curItem, index, array)
//		{
//			curItem.registerevent("on_mouseup", "_comm_func_on_mouseup(objInst)");
//		},objBizScreen);
}

//function _comm_func_on_mouseup(objInst)
//{
//	//alert(objInst.getname());
//	let funcObj;
//	if(!commonButtonEvent[objInst.getname()])
//	{
//		let focusIdx = this.tabBizScreen.gettabitemfocus();
//		let objBizScreen = this.tabBizScreen.getchildscreeninstance(focusIdx);
//		includeModule(objBizScreen);
//		funcObj = objBizScreen.getmembers()[objInst.getname()+"_on_mouseup"];
//		if(funcObj) commonButtonEvent[objInst.getname()] = funcObj;
//	}
//	else funcObj = commonButtonEvent[objInst.getname()];
//	
//	funcObj(objInst);
//}
/*************************UserFunction************************/
function _III_UserFunction() {}

//function bizScreen_on_scroll(hscroll_left, vscroll_top, hscroll_pos, vscroll_pos)
//{
//	console.log("vscroll_top:" + vscroll_top);
//	console.log("vscroll_pos:" + vscroll_pos);
//}

function getGlobalVaue()
{
	return m_ScrInfo;
}

function showLoadingProcess(bShow)
{
	this.pnlLoading.setvisible(bShow);
}


function screen_on_scroll(hscroll_left, vscroll_top, hscroll_pos, vscroll_pos)
{
	console.log("vscroll_top:" + vscroll_top);
	console.log("vscroll_pos:" + vscroll_pos);
}

//function includeModule(AScr){
//	if(factory.isobject(AScr)){
//		AScr.loadjs(_xf_param.SCREENBASEURL + "/INCLUDE/object_default.js");
//		_ext_initObject(AScr);
//	}
//}

function screen_on_beforesubmit(mapid)
{
	console.log("screen_on_beforesubmit in container");
	return 1;
}

//function setTaskMessage(arrMsgTitle, arrMsg, msgNumber, duration){
//	var _objTabScreen = this.tabErrorMsg.getchildscreeninstance(0);
//	var _tabScreenMembers = _objTabScreen.getmembers();
//	_tabScreenMembers.setErrorMsg(arrMsgTitle, arrMsg, msgNumber, duration);
//}