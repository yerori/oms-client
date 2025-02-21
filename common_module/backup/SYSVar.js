/*
 * SYSVar
 * 상수 및 연결용 변수 모음
 */
/*
 * MAIN FRAME 연결용 변수들
 */
var STARTMAIN_SCREEN;
var STARTMAIN_MEMBER;
var STARTMAIN_TAB;

var INTROMAIN_SCREEN;
var INTROMAIN_MEMBER;
	
var WINMAIN_SCREEN;
var WINMAIN_MEMBER;

var TOPMAIN_SCREEN;
var TOPMAIN_MEMBER;

var LEFTMAIN_SCREEN;
var LEFTMAIN_MEMBER;

var RIGHTMAIN_SCREEN;
var RIGHTMAIN_MEMBER;

var BOTTOMMAIN_SCREEN;
var BOTTOMMAIN_MEMBER;

var HOME_SCREEN;
var HOME_MEMBER;

var SUB1_SCREEN;
var SUB1_MEMBER;
var SUB2_SCREEN;
var SUB2_MEMBER;
var SUB3_SCREEN;
var SUB3_MEMBER;
var SUB4_SCREEN;
var SUB4_MEMBER;
var SUB5_SCREEN;
var SUB5_MEMBER;
var SUB6_SCREEN;
var SUB6_MEMBER;

var MODULE_MEMBER;

var TOP_TAB;
var MIDDLE_TAB;
var SUB_MIDDLE_TAB;
var LEFT_TAB;
var RIGHT_TAB;
var BOTTOM_TAB;
var USE_SUB_MIDDLE_TAB = false;
var SELECTED_MIDDLE_TAB;

var HOME_TAB;

var ACTIVE_SCREEN;
var ACTIVE_POPUP_SCREEN;

var UNSELECT_MIDDLE_TAB_BACKCOLOR;
var SELECTED_MIDDLE_TAB_BACKCOLOR;

var AGENT_MODULE_MEMBER;

/*	//이용자 기본 정보 및 설정 정보 
{
	INFO : {},
	RIGHT_CONFIG : []
}
*/
//console.log 사용여부
var SHOW_CONSOLELOG = true;

//동시에 최대로 열수 있는 화면 수
var MAX_SCREEN_OPEN_COUNT = 10;	
//좌측 메뉴 개수
var MAX_RIGHT_MODULE_COUNT;
//좌측 퀵 메뉴 사용 여부
var LEFT_QUICK_USE = false;

var HOME_SCREEN="/HOME/singleviewHome";
var HOME_SCREEN1="/HOME/singleviewHome1";

//우측 메뉴 개수
var MAX_RIGHT_MODULE_COUNT;
//우측 퀵 메뉴 사용 여부
var USE_RIGHT_MENU = false;

//퀵메뉴 개수
var MAX_QUCIK_MODULE_COUNT;

////퀵메뉴 디폴트 항목
//var QUICK_DEF_MENU = [{MENU_NAME:"Q1",MENU_URL:"/SAMPLE/QUICKPOPUP_1",ORDER:1,IMAGE_URL:"/SYS/MAIN/SUB/q_task_w_normal.png",IMAGE_HOVER_URL:"/SYS/MAIN/SUB/q_task_hover.png",TYPE:"POPUP"}
//					,{MENU_NAME:"Q2",MENU_URL:"/SAMPLE/QUICKSCREEN_1",ORDER:3,IMAGE_URL:"/SYS/MAIN/SUB/q_construction_w_normal.png",IMAGE_HOVER_URL:"/SYS/MAIN/SUB/q_construction_hover.png",TYPE:"SCREEN"}
//					,{MENU_NAME:"Q3",MENU_URL:"/SAMPLE/QUICKHOVER_1",ORDER:2,IMAGE_URL:"/SYS/MAIN/SUB/q_windows_w_normal.png",IMAGE_HOVER_URL:"/SYS/MAIN/SUB/q_windows_hover.png",TYPE:"HOVER"}
//					,{MENU_NAME:"반응형",MENU_URL:"/BIZ/DEVSAMPLE/rowbox_form",ORDER:6,IMAGE_URL:"/SYS/MAIN/SUB/q_device_w_normal.png",IMAGE_HOVER_URL:"/SYS/MAIN/SUB/q_device_hover.png",TYPE:"POPUP", RESIZE:true, MODAL:false}
//					]

//var COMMON_BUTTON_LIST = [
//	{ID:"COMMON_BTN_SEARCH",TEXT:"조회"}
//	,{ID:"COMMON_BTN_NEW",TEXT:"신규"}
//	,{ID:"COMMON_BTN_SAVE",TEXT:"저장"}
//	,{ID:"COMMON_BTN_DELETE",TEXT:"삭제"}
//	,{ID:"COMMON_BTN_EXPORT_EXCEL",TEXT:"엑셀"}
//	,{ID:"COMMON_BTN_PRINT",TEXT:"출력"}
//	,{ID:"COMMON_BTN_HELP",TEXT:"메뉴얼"}
//	,{ID:"COMMON_BTN_COMPANY_INFO",TEXT:"사업장정보집"}
//]

//messagePop 관련
var MESSAGE_POP_TITLE = ["위험","정보","경고","에러","확인"];

////CONFIRM 버튼
//var CONFIRM_BTN_OK = [{VALUE:1,TEXT:"확인"}];
//var CONFIRM_BTN_SAVECLOSE = [{VALUE:1,TEXT:"저장"},{VALUE:0,TEXT:"닫기"}];
//var CONFIRM_BTN_DELETECLOSE = [{VALUE:1,TEXT:"삭제"},{VALUE:0,TEXT:"닫기"}];
//var CONFIRM_BTN_YESNO = [{VALUE:1,TEXT:"예"},{VALUE:0,TEXT:"아니오"}];
//var CONFIRM_BTN_YESNOCANCEL = [{VALUE:1,TEXT:"예"},{VALUE:2,TEXT:"아니오"},{VALUE:0,TEXT:"취소"}];
//var CONFIRM_BTN_SAVENOCANCEL = [{VALUE:1,TEXT:"저장"},{VALUE:2,TEXT:"저장안함"},{VALUE:0,TEXT:"취소"}];

/*
 * 공통 상수모음
 */
//var MAIN_CONST = 1;
//
//// 메뉴정보를 TREE 형식으로 저장한다.
//// menu_id, menu_level, menu_seq, menu_row, child
//var MENU_TREE = [];
//// 메뉴 접근을 빠르게 하기 위해서 menuid별로 저장한다.
//var MENU_BY_ID = [];
//// 마지막 검색어 정보
//var g_LastSearchWordInfo = [];
//
//var SEARCH_WORD_LIST = [];
//
//var BIZ_CODE = ["BIZ"];

/*
 * Agent 상수모음
 */
//var AGENT_CHECK = false;
//
//var WEBSOCKET_PORT = 8080;
//var HTTPSERVER_PORT = 8080;
//var HTTP_SERVER_BASE_ADDR = "http://127.0.0.1:8080";

//var REMOTE_FUNC_URL = HTTP_SERVER_BASE_ADDR + "/remoteFunc";
//var AGENT_FUNC_URL = HTTP_SERVER_BASE_ADDR + "/agentFunc";
//var ACX_FUNC_URL = HTTP_SERVER_BASE_ADDR + "/AcxFunc";

var LOCAL_IP_ADDR;		// 로컬 시스템 IP 주소
var APP_PATH;			 // 실행 기본 경로
var LOG_DIR;			  // 로그 파일 디렉토리
var RUN_MODE;			 // 실행 모드

var XDATASET_BASEURL_FOR_SRC_SVR = "";

//var XDATASET_BASEURL = "http://127.0.0.1:8080/hrm/xframe";
//var XDATASET_BASEURL = "http://152.149.2.55:9000/hrm/xframe";
var XDATASET_BASEURL ;
//var FILE_UPLOAD_URL = "http://127.0.0.1:8080/xadmin_xd/WebFileManagerForAdmin.jsp";
//var XFRAME_VERSION_HOME_URL = "http://127.0.0.1:8080/xadmin_xd/version";