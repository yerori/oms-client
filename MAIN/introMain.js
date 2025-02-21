//# sourceURL=http://softbase.frame/SYS/MAIN/introMain.js
/****************************************************************************/

/*
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */
function _getFrameType() 
{
	return "INTRO_MAIN";
}
/*************************ScreenEvent*************************/
function _I_ScreenEvent() {}

/*
 * 화면 최초 로드시에
 */
function screen_on_load() 
{
	SYSVar.INTROMAIN_SCREEN = screen;
	SYSVar.INTROMAIN_MEMBER = this;
}
/*************************ObjectEvent*************************/
function _II_ObjectEvent() {}

/**
 * 로고 이미지 on_click 이벤트
 * @remarks 단말 업무로 전환
 */
function imgLogo_on_click(objInst)
{
	SYSVar.STARTMAIN_TAB.settabitemfocus(1); 
}
/*************************UserFunction************************/
function _III_UserFunction() {}

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