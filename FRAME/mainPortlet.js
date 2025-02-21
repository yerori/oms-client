/****************************************************************************

/////////////////////////////////////////////////////////////////////////////

/**
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */

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

function _getFrameType()
{
	return "MAIN_PORTLET";
}
function _I_GlobalVar() {}
var m_ScrInfo = {
		SCR_ID     : "",
		SCR_PATH   : "",
		MENU_ID    : "",
		MENU_NM    : "",
		P_MENU_ID  : "",
		PARENT_SCR : null
	};

function getScreenInfo()
{
	console.log("getScreenInfo - mainPortlet ");
	return m_ScrInfo;
}

/*************************ScreenEvent*************************/
function _I_ScreenEvent() {}

/**
 * 최초 화면 로드시에 호출처리
 */
function screen_on_load()
{
	console.log("mainPortlet Load");
	this._tranProcCnt = 0;
	var objExtra_data    = screen.getextradata();
	var objBizExtra_data = null;

	m_ScrInfo.SCR_ID = "";

	//= 업무 화면정보
	m_ScrInfo.SCR_ID     = objExtra_data.SCR_ID;
	m_ScrInfo.MENU_ID    = objExtra_data.MENU_ID;
	m_ScrInfo.MENU_NM    = objExtra_data.MENU_NM;
	m_ScrInfo.P_MENU_ID  = objExtra_data.P_MENU_ID;
	m_ScrInfo.PARENT_SCR = objExtra_data.PARENT_SCR;
	m_ScrInfo.SCR_PATH   = objExtra_data.SCR_PATH;
	m_ScrInfo.SCR_PATH   = objExtra_data.SCR_PATH;
	objBizExtra_data          = objExtra_data.BIZ_EXT;	// 업무화면 전달 데이타
	
console.log("m_ScrInfo.MENU_NM:" + m_ScrInfo.MENU_NM);
/*
	-1: 파라미터에 문제가 있을 경우
	-2: 화면이 존재하지 않는 경우(_xf_param에 CHECK_SCREENURL 값이 true인 경우 적용)
*/
	//tabBizScreen.addcontenttab("", 0, 0, m_ScrInfo.SCR_PATH, true);
	var nRet = this.tabBizScreen.addportlettab("", 0, 0, m_ScrInfo.SCR_PATH, "bizScreen", true, objBizExtra_data);
	if(nRet == -1) {
		screen.alert("[" + nRet + "]  파라미터에 문제가 있을 경우");
	} else if(nRet == -2) {
		screen.alert("[" + nRet + "]  화면이 존재하지 않는 경우(_xf_param에 CHECK_SCREENURL 값이 true인 경우 적용)");
	}
}

/**
 * 화면 사이즈가 변경되면은 발생한다.
 * @param {number} window_width 화면 크기
 * @param {number} window_height 화면 크기
 */
function screen_on_size(window_width, window_height)
{

}

function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{

}

/*************************ObjectEvent*************************/
function _II_ObjectEvent() {}

function tabBizScreen_on_itemcreate(objInst, itemindex)
{
	SYSVar.MIDDLE_TAB.settabitemtext(SYSVar.MIDDLE_TAB.gettabitemfocus(), m_ScrInfo.MENU_NM);
	this.capScreenTitle.settext(m_ScrInfo.MENU_NM);
	this.capScreenTitle.fittext(1, 2);
}
/*************************UserFunction************************/
function _III_UserFunction() {}


function getGlobalVaue()
{
	return m_ScrInfo;
}

function showLoadingProcess(bShow)
{
	this.pnlLoading.setvisible(bShow);
}


function screen_on_activate()
{
	console.log("is Active (p)");
}