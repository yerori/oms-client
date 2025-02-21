/****************************************************************************/
/*
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */
function _getFrameType() 
{
	return "POPUP_CONTAINER";
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
var m_PortletNm = "bizScreen";


function _II_ScreenEvent() {}

function screen_on_load()
{
	SYSVar.ACTIVE_POPUP_SCREEN = this.screen;
	this.tabBizScreen.addcustomclass("_frame_portlet_screen");
	var objBizExtra_data = screen.getextradata();
	
	//= 업무 화면정보
	m_ScrInfo.SCR_ID     = objBizExtra_data.SCR_ID;
	m_ScrInfo.MENU_ID    = objBizExtra_data.MENU_ID;
	m_ScrInfo.MENU_NM    = objBizExtra_data.MENU_NM;
	m_ScrInfo.P_MENU_ID  = objBizExtra_data.P_MENU_ID;
	m_ScrInfo.PARENT_SCR = objBizExtra_data.PARENT_SCR;
	m_ScrInfo.SCR_PATH   = objBizExtra_data.SCR_PATH;
/*
	-1: 파라미터에 문제가 있을 경우
	-2: 화면이 존재하지 않는 경우(_xf_param에 CHECK_SCREENURL 값이 true인 경우 적용)
*/
	var nRet = this.tabBizScreen.addportlettab("", 0, 0, m_ScrInfo.SCR_PATH, m_PortletNm, true,objBizExtra_data.EXT_DATA);
	if(nRet == -1) {
		screen.alert("[" + nRet + "]  파라미터에 문제가 있을 경우");
	} else if(nRet == -2) {
		screen.alert("[" + nRet + "]  화면이 존재하지 않는 경우(_xf_param에 CHECK_SCREENURL 값이 true인 경우 적용)");
	}
}

function _III_ObjectEvent() {}
/**/
function tabBizScreen_on_itemcreate(objInst, itemindex)
{
	// 화면 타이틀 정보를 링크된 팝업 화면의 정보를 통해서 구함

	// 화면 타이틀 텍스트 설정 및 텍스트 길이 조절
	this.capScreenTitle.settext(m_ScrInfo.MENU_NM);
	this.capScreenTitle.fittext(1, 2);
	
	// portlet 으로 프레임이 구성된 경우는 업무화면 사이즈를 구하기 위해 탭의 자식 화면을 구한다.
//	var nBizScreenWidth  = this.tabBizScreen.getchildscreeninstance(itemindex).getscreenwidth();			
//	var nBizScreenHeigth = this.tabBizScreen.getchildscreeninstance(itemindex).getscreenheight();
	var nBizScreenWidth  = this.tabBizScreen.getchildscreeninstance(itemindex).original_screen_width;			
	var nBizScreenHeigth = this.tabBizScreen.getchildscreeninstance(itemindex).original_screen_height;

	// 상단 및 하단 마진
	var nTopMargin = 28;
	var nBottomMargin = 4;

	// 프레임 크기 계산
	var nScreenWidth = nBizScreenWidth;
	var nScreenHeight = nBizScreenHeigth + nTopMargin + nBottomMargin;

	// 팝업 화면 크기 조정
	this.screen.setpopuppos(0, 0, nScreenWidth, nScreenHeight, false, 2, true);

	// 프레임 화면 크기 변경	
	this.screen.setscreenwidth(nScreenWidth);
	this.screen.setscreenheight(nScreenHeight);
	
	// 탭 크기변경
	this.tabBizScreen.setwidth(nBizScreenWidth);
	this.tabBizScreen.setheight(nBizScreenHeigth);
	
	// Drag Area 지정
	this.screen.setpopupdragarea(0, 0, screen.getscreenwidth(), this.capScreenTitle.getheight());
	
	this.tabBizScreen.settabitemscrollbarstyle(0, 1, 1);
}

function _IV_UserFunction() {}


function showLoadingProcess(bShow)
{
	this.pnlLoading.setvisible(bShow);
}

function _btnPopClose_on_mouseup(objInst)
{
	this.screen.unload();
}

function setTaskMessage(arrMsgTitle, arrMsg, msgNumber, duration){
	var _objTabScreen = this.tabErrorMsg.getchildscreeninstance(0);
	var _tabScreenMembers = _objTabScreen.getmembers();
	_tabScreenMembers.setErrorMsg(arrMsgTitle, arrMsg, msgNumber, duration);
}