﻿// 팝업화면으로 전달할 파라미터 설정
var objPopupExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	P_DATA6: "",	      	// 팝업화면으로 전달할 데이터6
	P_DATA7: "",	      	// 팝업화면으로 전달할 데이터7
	P_DATA8: "",	      	// 팝업화면으로 전달할 데이터8
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
	clear: function(){
		this.P_DATA1 = "";
		this.P_DATA2 = "";
		this.P_DATA3 = "";
		this.P_DATA4 = "";
		this.P_DATA5 = "";
		this.P_DATA6 = "";
		this.P_DATA7 = "";
		this.P_DATA8 = "";
		this.RETURN_FUNCTION_NAME = "";
	}
};

/**
 * 화면 on_load 이벤트
 */
function screen_on_load()
{
	if(INI.GV_LOGIN_TYPE == "SSO")
	{
		//SSO 로그인 처리 
		//
		//서버영역의 sso login api를 호출하도록한다
		//- transaction의 SSO LOGIN tran을 호출
		//ex) SYSUtil.requestSubmitAsync(screen,"SSO_LOGIN");
		//submitcomplete event로 후처리
		this.ssoLogin();
	}
	else
	{
		//일반 로그인 처리
		//this.cboTempId.setselectedindex(0);
		//ex) SYSUtil.requestSubmitAsync(screen,"LOGIN");
		this.fnOuCodeSet();
		this.cboOuCode.setpicklistlinkxdataset("dsOuCode","OU_CODE","OU_NAME","");
		this.cboOuCode.setselectedcode(INI.GV_OU_CODE);
		
		var strCookieID = factory.getcookie("userInfoC");
		if(!UT.isNull(strCookieID)){
			this.fld_USER_ID.settext(strCookieID);
		}
		//this.cboOuCode.setfocus(true);
		this.fld_USER_ID.setfocus(true);
		
		//공지사항 LIST
		this.fnNoticeList();
		
		//View Server Set
		this.fnViewServerSet();
		
		//Popup 공지사항 LIST
		this.fnPopupNoticeList();
	}
}

/*
* View Server Set
* DB조회 : TR_VIEW_SERVER
*/
function fnViewServerSet(){		
	if(UT.isNull(TRN.FV_BASE_URL)){
		return;
	}
	TRN.gfnTranDataSetHandle(this.screen , this.dsViewServer , "NONE" , "CLEAR" ,  "" , "" , "TR_VIEW_SERVER");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_VIEW_SERVER");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_VIEW_SERVER_SET" ,"" , "dsViewServer");	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectViewServerSet" , true , true , false , "TR_VIEW_SERVER");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 법인코드 가져오기
* DB조회 : TR_OU_CODE
*/
function fnOuCodeSet(){		
	if(UT.isNull(TRN.FV_BASE_URL)){
		return;
	}
	TRN.gfnTranDataSetHandle(this.screen , this.dsOuCode , "ALL" , "CLEAR" ,  "" , "" , "TR_OU_CODE");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_OU_CODE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_OU_DATA" ,"" , "dsOuCode");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectOuCode" , true , false , false , "TR_OU_CODE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 공지사항 가져오기
* DB조회 : TR_NOTICE
*/
function fnNoticeList(){		
	if(UT.isNull(TRN.FV_BASE_URL)){
		return;
	}
	var params = "BOARD_ID=" + "B04";
	params += " CNT_LIMIT=" + "Y";
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_NOTICE");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_NOTICE");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_NOTICE_LIST" ,"" , "dsList", params);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_SMT_NOTICE_LIST" , true , false , false , "TR_NOTICE");		
}

/*
* Popup 공지사항 가져오기
* DB조회 : TR_POPUP_NOTICE
*/
async function fnPopupNoticeList(){		
	if(UT.isNull(TRN.FV_BASE_URL)){
		return;
	}
	TRN.gfnTranDataSetHandle(this.screen , this.dsPopList , "NONE" , "CLEAR" ,  "" , "" , "TR_POPUP_NOTICE");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_POPUP_NOTICE");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_POPUP_NOTICE_LIST" ,"" , "dsPopList");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_SMT_POPUP_NOTICE_LIST" , true , false , false , "TR_POPUP_NOTICE");	
	
	if(this.dsPopList.getrowcount() > 0){
		for(var iRow=0;iRow<this.dsPopList.getrowcount();iRow++){
			var strPopCookieName = "divPop" + this.dsPopList.getdatabyname(iRow,"BOARD_NO");
			var strPopCookie = factory.getcookie(strPopCookieName);
			if(UT.isNull(strPopCookie) || strPopCookie == "N"){
				var strboardNo = this.dsPopList.getdatabyname(iRow,"BOARD_NO");
				var strtitle = this.dsPopList.getdatabyname(iRow,"TITLE");
				var popupId = "divPop" + strboardNo;
				var strPopupName = UT.gfnGetMetaData("LABEL02695", "Popup 공지사항");
				var ret, x, y;
				x = (iRow * 60) + 150;
				y = (iRow * 10) + 50;
				objPopupExtraData.clear();
				objPopupExtraData.P_DATA1 = strboardNo; 
				objPopupExtraData.P_DATA2 = strtitle;
				ret = await screen.loadportletpopupsync(popupId, "/FRAME/popupNotice", strPopupName, false, 0, x, y, 838, 750, false, true, false, objPopupExtraData);
			}
		}
	}	
}

function ssoLogin()
{
	return;
}


/**
 * Login 버튼 on_mouseup 이벤트
 */
function btnLogin_on_mouseup(objInst)
{
	INI.GV_LGI_ID = this.fld_USER_ID.gettext();
	this.txLogin();
}

/**
 * ID keydown 이벤트 처리
 */
function fld_USER_ID_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	// 엔터키 처리
	if(keycode == 13) {
		INI.GV_LGI_ID = this.fld_USER_ID.gettext();
		this.txLogin();
		return 1;
	}
	
	return 0;
}

/**
 * PW keydown 이벤트 처리
 */
function fld_USER_PASSWD_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	// 엔터키 처리
	if(keycode == 13) {
		this.btnLogin_on_mouseup();
		return 1;
	}
	
	return 0;
}


/**
 * 로그인 처리
 * @return 없음
 */
function txLogin()
{
	var params = "LGI_ID=" + INI.GV_LGI_ID + " OU_CODE=" + INI.GV_OU_CODE ;
	var strLang = this.cboLang.getselectedcode();
	var strOuCode = this.cboOuCode.getselectedcode();
	
	if(!UT.isNull(strLang)){ 
		INI.GV_LANG = strLang;		
	} else {
		INI.GV_LANG = "KO";
	}
	
	if(!UT.isNull(strOuCode)){ 
		INI.GV_OU_CODE = strOuCode;		
	} else {
		INI.GV_OU_CODE = "H01";
	}
	
	TRN.gfnTranDataSetHandle(this.screen, this.dsUserInfo, "ALL", "CLEAR", "", "", "TR_LOGIN");
	//TRN.gfnTranDataSetHandle(screen , dsUserInfo , "NONE" , "CLEAR" , "" , "" , "TR_LOGIN");

	TRN.gfnCommonTransactionClear(this.screen , "TR_LOGIN");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LOGIN_INFO" , "" , "dsUserInfo" , params);	//로그를 추가합니다
		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "userInfo" , true , false , false , "TR_LOGIN");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	
	if(this.dsUserInfo.getrowcount() == 0){
		UT.alert(this.screen , "" , "시스템에 사용자 정보가 존재하지 않습니다." + "\n\n" + "확인 바랍니다.");
		//factory.browserexit();
		return;
	}else{
		//params = "USER_ID=" + this.dsUserInfo.getdatabyname(this.dsUserInfo.getpos() , "USER_ID") + " PW_OLD=" + this.fld_USER_PASSWD.gettext();
		this.dsUserInfo.setdatabyname(this.dsUserInfo.getpos(), "PW_OLD", this.fld_USER_PASSWD.gettext());
		
		TRN.gfnTranDataSetHandle(this.screen , this.dsUserInfo , "ALL" , "NONE" ,  "" , "" , "TR_PWD");
		TRN.gfnTranDataSetHandle(this.screen , this.dsPwdResult , "NONE" , "CLEAR",  "" , "" , "TR_PWD");	//데이터셋 인:ALL 아웃:NONE 정의
		
		TRN.gfnCommonTransactionClear(this.screen , "TR_PWD");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LOGIN_PWD_INFO" , "dsUserInfo" , "dsPwdResult");	//조회만
		
		var strSmsBaseUrl = INI.GFV_SERVER_URL + "/userPwdCheck";
		// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
		TRN.gfnCommonTransactionRun(this.screen , "selectCheckPwd" , true , false , false , "TR_PWD" , strSmsBaseUrl);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
		var strResult = this.dsPwdResult.getdatabyname(this.dsPwdResult.getpos() , "RESULT");
		
		if(strResult == "N"){
			UT.alert(this.screen , "" , "시스템에 사용자 정보가 존재하지 않습니다." + "\n\n" + "확인 바랍니다.");
			//factory.browserexit();
			return;
		} else {
			var iRow = this.dsUserInfo.getpos();
			INI.GV_USER_ID = this.dsUserInfo.getdatabyname(iRow , "USER_ID");
			INI.GV_USER_ID_NM = this.dsUserInfo.getdatabyname(iRow , "USER_NAME");
			INI.GV_ORG_NM = this.dsUserInfo.getdatabyname(iRow, "OU_NAME");
			INI.GV_ORG_CD = this.dsUserInfo.getdatabyname(iRow , "OU_CODE");
			INI.GV_AT_OU = this.dsUserInfo.getdatabyname(iRow , "AT_OU");
			INI.GV_EMP_NO = this.dsUserInfo.getdatabyname(iRow , "EMP_NO");
			INI.GV_VENDOR_CODE = this.dsUserInfo.getdatabyname(iRow , "VENDOR_CODE");
			INI.GV_VENDOR_NAME = this.dsUserInfo.getdatabyname(iRow , "VENDOR_NAME");
			INI.GV_USER_TYPE = this.dsUserInfo.getdatabyname(iRow , "USER_TYPE");
			INI.GV_USER_BIZ_DIV = this.dsUserInfo.getdatabyname(iRow , "BIZ_DIV");
			INI.GV_REPORT_WEB_HTML = this.dsUserInfo.getdatabyname(iRow , "REPORT_WEB_HTML");
			INI.GV_REPORT_MID = this.dsUserInfo.getdatabyname(iRow , "REPORT_MID");
			//INI.GV_DOC_VIEW_SERVER_URL = this.dsUserInfo.getdatabyname(iRow , "VIEW_SERVER_URL");
			//INI.GV_DOC_VIEW_CONVERT_TYPE = this.dsUserInfo.getdatabyname(iRow , "VIEW_CONVERT_TYPE");
			INI.GV_E_COMMERCE_YN = this.dsUserInfo.getdatabyname(iRow , "E_COMMERCE_YN");
			INI.GV_PERSONAL_INFO_YN = this.dsUserInfo.getdatabyname(iRow , "PERSONAL_INFO_YN");
			INI.GV_INFO_SECURIT_YN = this.dsUserInfo.getdatabyname(iRow , "INFO_SECURIT_YN");
			INI.GV_FIRST_PWD_CHANGE = this.dsUserInfo.getdatabyname(iRow , "FIRST_PWD_CHANGE");
			
			// add by IT : 2024.05.28
			INI.GV_EMP_NAME = this.dsUserInfo.getdatabyname(iRow , "EMP_NAME") ;	      // 성명
			INI.GV_DEPT_CODE = this.dsUserInfo.getdatabyname(iRow , "DEPT_CODE") ;        // 현재 부서 코드
			INI.GV_DEPT_NAME = this.dsUserInfo.getdatabyname(iRow , "DEPT_NAME") ;        // 현재 부서 명
			INI.GV_JIKJONG_CODE = this.dsUserInfo.getdatabyname(iRow , "JIKJONG_CODE") ;  // 현재 직종 코드
			INI.GV_JIKWI_CODE = this.dsUserInfo.getdatabyname(iRow , "JIKWI_CODE") ;      // 현재 직위 코드
			INI.GV_JIKWI_NAME = this.dsUserInfo.getdatabyname(iRow , "JIKWI_NAME") ;      // 현재 직위 명
			INI.GV_JIKCHAK_CODE = this.dsUserInfo.getdatabyname(iRow , "JIKCHAK_CODE") ;  // 현재 직책 코드
			INI.GV_JIKCHAK_NAME = this.dsUserInfo.getdatabyname(iRow , "JIKCHAK_NAME") ;  // 현재 직책 코드
			//			
			
			// 로그인ID 쿠키 저장 (7일 동안)
			if(this.chkSaveId){
				factory.setcookie("userInfoC",this.fld_USER_ID.gettext(), 7);
			}
			SYSVar.WINMAIN_MEMBER.txLoginComplete();
		}	
	} 
}

function fld_USER_ID_on_focusin(objInst)
{
	this.btn_img_user.rotate("y", 180, 400, "ease", "RotateCallback");
}

function fld_USER_PASSWD_on_focusin(objInst)
{
	this.btn_img_password.rotate("z", 360, 400, "ease", "RotateCallback");
}

function RotateCallback(objInst, strAxis, nDegree, nDuration, strTiming) {
	
	// 회전 상태 초기화
	objInst.rotate(strAxis, 0, 0, "ease", "");
}

function grdNotice_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	var boardId = this.dsList.getdatabyname( this.dsList.getpos(), "BOARD_ID");
	var boardNo = this.dsList.getdatabyname( this.dsList.getpos(), "BOARD_NO");
	var writerId = this.dsList.getdatabyname( this.dsList.getpos(), "INS_USER_ID");
	if( UT.isNull(boardNo)){
		UT.alert(this.screen , "" , "공지사항 라인을 먼저 선택하세요.");
		return;
	}
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = boardId; 
	objPopupExtraData.P_DATA2 = boardNo;	
	//게사자와 login user가 같으면 수정 가능
	if ( writerId ==  INI.GV_USER_ID ){
		objPopupExtraData.P_DATA3 = "E";  //E:수정 
	} else {
		objPopupExtraData.P_DATA3 = "V";  //V:조회 
	}	

	objPopupExtraData.P_DATA4 = "N";
	objPopupExtraData.P_DATA5 = "PINFO";  
	objPopupExtraData.P_DATA6 = "1"; //lvl
	objPopupExtraData.P_DATA7 = "0"; //P_BOARD
	
	objPopupExtraData.RETURN_FUNCTION_NAME = "";
	screen.loadportletpopup("notice_view", "/SMT/SmtSet1230", "공지사항 상세", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);
}

function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(this.screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "selectViewServerSet")
	{		
		//공지사항 첨부파일 기능 때문에 여기서 set
		if(this.dsViewServer.getrowcount() > 0){
			INI.GV_DOC_VIEW_SERVER_URL = this.dsViewServer.getdatabyname(this.dsViewServer.getpos() , "VIEW_SERVER_URL");
			INI.GV_DOC_VIEW_CONVERT_TYPE = this.dsViewServer.getdatabyname(this.dsViewServer.getpos() , "VIEW_CONVERT_TYPE");
		}

	}
}