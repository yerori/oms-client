var vLgiID = "";
var vOuCode = "";
var vLangType = "";
var vDirectMenuId = "";

/*
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */
function _getFrameType()
{
	return "START_MAIN";
}

/*
 * 화면 최초 로드시에
 */
function screen_on_load() 
{
	if(!SYSVar.SHOW_CONSOLELOG){
		console.log = function(){};
	}
//	if(factory.ismobile() == true) {
//		// 모바일용 프레임 분기
//	//	tabStart.addtab()
//	}
	SYSVar.STARTMAIN_SCREEN = screen;
	SYSVar.STARTMAIN_MEMBER = screen.getmembers();
	SYSVar.STARTMAIN_TAB    = tabStart;
//	if(SYSVar.AGENT_CHECK){
//		SYSVar.AGENT_MODULE_MEMBER.setConnectPortSetting();
//		SYSVar.AGENT_MODULE_MEMBER.openAgentSocket();
//	}

	// 실행 환경 정보 설정
	setRunTimeEnv();
		
	let loginMember = tabStart.getchildscreeninstance(0).getmembers();
	loginMember.screen_on_load();
	loginMember["btnLogin"].setenable(true);
}

/**
 * UI 실행 환경 관련 정보를 설정한다.
 */
function setRunTimeEnv()
{	
	// SYSVar 공통 모듈에 변수를 설정한다.
	//SYSVar.LOCAL_IP_ADDR = factory.getlocalipaddress();
	SYSVar.APP_PATH = factory.getapppath();
	SYSVar.LOG_DIR = SYSVar.APP_PATH + "\\log";
	
	// indexX5.js 에서 Set한 값을 읽어옴.
	SYSVar.XDATASET_BASEURL = factory.gethtmlparam("XDATASET_URL");
	TRN.FV_BASE_URL = factory.gethtmlparam("XDATASET_URL");
	INI.GFV_SERVER_URL = factory.gethtmlparam("SERVICE_URL");
	
	INI.GFV_SERVER_TYPE = factory.gethtmlparam("SERVER_TYPE");
	vLgiID = factory.gethtmlparam("USER_ID");
	INI.GV_LGI_ID = factory.gethtmlparam("USER_ID");
	vOuCode = factory.gethtmlparam("OU_CODE");
	INI.GV_OU_CODE = factory.gethtmlparam("OU_CODE");
	INI.GV_LANG = factory.gethtmlparam("LANG_TYPE");
	vDirectMenuId = factory.gethtmlparam("DIRECT_MENU_ID");
	//INI.GV_LOGIN_TYPE = factory.gethtmlparam("LOGIN_TYPE");
	INI.GV_LOGIN_TYPE = "NOR";
	
	var strGetIPUrl = INI.GFV_SERVER_URL + "/getClientIP";
	factory.setsubmitbaseurl(strGetIPUrl);
	screen.requestsubmit("TR_CONFIG", false);
	var objTranResult = screen.getsubmitresult();
	SYSVar.LOCAL_IP_ADDR = objTranResult.recvmsg;
	
	return;
}

function fnShowLoginMainScreen()
{
	//tabStart.settabitemfocus(0,true);
	let loginMember = tabStart.getchildscreeninstance(0).getmembers();
	loginMember["btnLogin"].setenable(true);
}
