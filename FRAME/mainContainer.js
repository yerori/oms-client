/****************************************************************************/
/*
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */
function _getFrameType() 
{
	return "MAIN_CONTAINER";
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
	console.log("getScreenInfo - mainContainer ");
	return m_ScrInfo;
}

function _II_ScreenEvent() {}

function screencontainer_on_load()
{
	var objExtra_data = screen.getextradata();
	var objBizExtra_data = null;
	//= 업무 화면정보
	m_ScrInfo.SCR_ID     = objExtra_data.SCR_ID;
	m_ScrInfo.MENU_ID    = objExtra_data.MENU_ID;
	m_ScrInfo.MENU_NM    = objExtra_data.MENU_NM;
	m_ScrInfo.P_MENU_ID  = objExtra_data.P_MENU_ID;
	m_ScrInfo.PARENT_SCR = objExtra_data.PARENT_SCR;
	m_ScrInfo.SCR_PATH   = objExtra_data.SCR_PATH;
	m_ScrInfo.SCR_PATH   = objExtra_data.SCR_PATH;
	objBizExtra_data     = objExtra_data.BIZ_EXT;	// 업무화면 전달 데이타
	
factory.consoleprint("m_ScrInfo.MENU_NM1:" + m_ScrInfo.MENU_NM);		
/*
	-1: 파라미터에 문제가 있을 경우
	-2: 화면이 존재하지 않는 경우(_xf_param에 CHECK_SCREENURL 값이 true인 경우 적용)
*/
	//tabBizScreen.addcontenttab("", 0, 0, m_ScrInfo.SCR_PATH, true);
	var nRet = tabBizScreen.addportlettab("", 0, 0, m_ScrInfo.SCR_PATH, "bizScreen", true, objBizExtra_data);
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
factory.consoleprint("m_ScrInfo.MENU_NM2:" + m_ScrInfo.MENU_NM);	
	capScreenTitle.settext(m_ScrInfo.MENU_NM);
	capScreenTitle.fittext(1, 2);
}
function _IV_UserFunction() {}


function showLoadingProcess(bShow)
{
	pnlLoading.setvisible(bShow);
}

//function ee_on_mouseup(objInst)
//{
//	pnlLoading.setvisible(!pnlLoading.getvisible());
//}

function screencontainer_on_click()
{
	console.log("click ->"+ m_ScrInfo.MENU_ID);
}

function screencontainer_on_keydown(keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	console.log("keydown ->"+ m_ScrInfo.MENU_ID);
	return 0;
}