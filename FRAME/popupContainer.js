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



function _II_ScreenEvent() {}

function screencontainer_on_load()
{
	var objExtra_data = screen.getextradata();
	
	//= 업무 화면정보
	m_ScrInfo.SCR_ID     = objExtra_data.SCR_ID;
	m_ScrInfo.MENU_ID    = objExtra_data.MENU_ID;
	m_ScrInfo.MENU_NM    = objExtra_data.MENU_NM;
	m_ScrInfo.P_MENU_ID  = objExtra_data.P_MENU_ID;
	m_ScrInfo.PARENT_SCR = objExtra_data.PARENT_SCR;
	m_ScrInfo.SCR_PATH   = objExtra_data.SCR_PATH;
/*
	-1: 파라미터에 문제가 있을 경우
	-2: 화면이 존재하지 않는 경우(_xf_param에 CHECK_SCREENURL 값이 true인 경우 적용)
*/
	var nRet = tabBizScreen.addcontenttab("", 0, 0, m_ScrInfo.SCR_PATH, true,objExtra_data.EXT_DATA);
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
	capScreenTitle.settext(m_ScrInfo.MENU_NM);
	capScreenTitle.fittext(1, 2);
	
	var nBizScreenWidth = screen.getscreencontentwidth();
	var nBizScreenHeigth = screen.getscreencontentheight();

	// 상단 및 하단 마진
	var nTopMargin = 28;
	var nBottomMargin = 4;//24;

	// 프레임 크기 계산
	var nScreenWidth = nBizScreenWidth;
	var nScreenHeight = nBizScreenHeigth + nTopMargin + nBottomMargin;

	// 프레임 화면 크기 변경	
	screen.setscreenwidth(nScreenWidth);
	screen.setscreenheight(nScreenHeight);
	
	// 탭 크기변경
	tabBizScreen.setwidth(nBizScreenWidth);
	tabBizScreen.setheight(nBizScreenHeigth);

	// 팝업 화면 크기 조정
	screen.setpopuppos(0, 0, nScreenWidth, nScreenHeight, false, 2, true);
	
	// Drag Area 지정
	screen.setpopupdragarea(0, 0, screen.getscreenwidth(), capScreenTitle.getheight());
	
	tabBizScreen.settabitemscrollbarstyle(0, 1, 1);
	_btnPopClose.setleft(nBizScreenWidth - 30);
}

function _IV_UserFunction() {}


function showLoadingProcess(bShow)
{
	pnlLoading.setvisible(bShow);
}

function _btnPopClose_on_mouseup(objInst)
{
	screen.unload();
}