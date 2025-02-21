/*------------------------------------
* program id : UserPwdChg
* desc	   : 사용자비밀번호변경
* dev date   : 2023-02-27
* made by    : seyun
*-------------------------------------*/
function screen_on_destroy()
{
	this.screen.unload();
	return 1;
}

/*
* 닫기버튼시
*/
function btnClose_on_mouseup(objInst)
{		
	this.screen.unload();
}

/*
* 페이지 온로드
*/
function screen_on_load()
{		
	INI.initPopup(this.screen);	//팝업 공통 
	this.fnSearch();
}

/*
* 조회
*/
function fnSearch()
{		
	var params = "LGI_ID=" + INI.GV_LGI_ID + " OU_CODE=" + INI.GV_OU_CODE ;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMyInfo, "NONE" , "CLEAR" ,  "" , "" );				   //데이터셋 인:ALL 아웃:CLEAR 정의	
	
	TRN.gfnCommonTransactionClear(this.screen);	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LOGIN_INFO" ,"" , "dsMyInfo" , params);	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "select");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}


/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "select"){	
		if(this.dsMyInfo.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		}
	}
	
}



/*
* 비밀번호 변경버튼
*/
function btnPwdChange_on_mouseup(objInst)
{
	var aryDualValiObj = [ [this.fldOldPwd , "" , "기존비밀번호"] , [this.fldNewPwd , "" , "신규비밀번호"] 
							, [this.fldNewPwdCheck , "" , "신규비밀번호확인"] 
						];
	
	if(!UT.gfnValidationObj(this.screen , aryDualValiObj)){	//필수확인
		return;
	}		
	
	if(this.dsMyInfo.getdatabyname(this.dsMyInfo.getpos() , "PW_NEW") != this.dsMyInfo.getdatabyname(this.dsMyInfo.getpos() , "PW_NEW_CHECK")){
		UT.alert(screen , "MSG320" , "신규비밀번호와 신규비밀번호확인 이 틀립니다.");
		
		this.fldNewPwdCheck.setfocus();
		return;
	}
	
	UT.confirm(this.screen,"","비밀번호를 변경 하시겠습니까?","",0,"pwdReset_confirm");
	
}

/*
* 비밀번호 변경
* DB 저장
*/
function fnPwdReSet()
{
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMyInfo , "ALL" , "NONE" ,  "" , "" , "TR_PWD");
	TRN.gfnTranDataSetHandle(this.screen , this.dsPwdResult , "NONE" , "CLEAR",  "" , "" , "TR_PWD");	//데이터셋 인:ALL 아웃:NONE 정의	
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_PWD");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LOGIN_PWD_INFO" , "dsMyInfo" , "dsPwdResult");	//조회만	
	
	var strSmsBaseUrl = INI.GFV_SERVER_URL + "/userPwdCheck";
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectCheckPwd" , true , false , false , "TR_PWD" , strSmsBaseUrl);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
		
	var strResult = this.dsPwdResult.getdatabyname(this.dsPwdResult.getpos() , "RESULT");
		
	if(strResult == "S"){
		this.dsMyInfo.setdatabyname(this.dsMyInfo.getpos() , "PW_NEW" , "");
		this.dsMyInfo.setdatabyname(this.dsMyInfo.getpos() , "PW_NEW_CHECK" , "");
		
		UT.alert(this.screen , "" , "이전에 사용했던 비밀번호입니다.");
		
		this.fldNewPwd.setfocus();
		return;
	}else if(strResult == "N"){
		this.dsMyInfo.setdatabyname(this.dsMyInfo.getpos() , "PW_OLD" , "");
		
		UT.alert(this.screen , "" , "비밀번호를 확인하십시오.");
		
		this.fldOldPwd.setfocus();
		
		return;
	}else if(strResult == "Y"){
		
		this.dsMyInfo.setdatabyname(this.dsMyInfo.getpos() , "FIRST_PWD_CHANGE" , "Y");
		
		TRN.gfnTranDataSetHandle(this.screen , this.dsMyInfo , "ALL" , "NONE" ,  "" , "" , "TR_PWD");
	
		TRN.gfnCommonTransactionClear(this.screen , "TR_PWD");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.UPDATE_USER_MSTR_PWDRESET" , "dsMyInfo");	//조회만	
	
		var strSmsBaseUrl = INI.GFV_SERVER_URL + "/userPwdChange";
		// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
		TRN.gfnCommonTransactionRun(this.screen , "pwdUpdate" , true , false , false , "TR_PWD" , strSmsBaseUrl);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
		
		this.dsMyInfo.setdatabyname(this.dsMyInfo.getpos() , "PW_NEW" , "");
		this.dsMyInfo.setdatabyname(this.dsMyInfo.getpos() , "PW_NEW_CHECK" , "");
		this.dsMyInfo.setdatabyname(this.dsMyInfo.getpos() , "PW_OLD" , "");
		
		UT.alert(this.screen , "" , "비밀번호가 변경되었습니다.");
		
		this.screen.unload();
	}		
}

function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "pwdReset_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnPwdReSet();
		}
	}
}