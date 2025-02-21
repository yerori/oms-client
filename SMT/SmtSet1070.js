/*------------------------------------
* program id : SmtSet1070
* desc	   : 사용자관리
* dev date   : 2024-09-02
* made by    : YELEE
*-------------------------------------*/


var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";



// 팝업화면으로 전달할 파라미터 설정
var objPopupExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
	clear: function(){
		this.P_DATA1 = "";
		this.P_DATA2 = "";
		this.P_DATA3 = "";
		this.P_DATA4 = "";
		this.P_DATA5 = "";
		this.RETURN_FUNCTION_NAME = "";
	}
};

// 파일첨부 팝업화면으로 전달할 파라미터 설정
var objPopupAttData = {
	P_REF_ID: "",      	   // 팝업화면으로 전달할 데이터1
	P_MODE: "",			   // 팝업화면으로 전달할 데이터1
	P_FILE_GUBUN: "",	     // 팝업화면으로 전달할 데이터2
	P_REF_NAME: "",	       // 팝업화면으로 전달할 데이터3
	P_DIR_TYPE: "",	       // 팝업화면으로 전달할 데이터4
	P_OU_CODE: "",	        // 팝업화면으로 전달할 데이터5
	RET_FUNC_NAME: "",  	  // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
	clear: function(){
		this.P_REF_ID = "";
		this.P_MODE = "";
		this.P_FILE_GUBUN = "";
		this.P_REF_NAME = "";
		this.P_DIR_TYPE = "";
		this.P_OU_CODE = "";
		this.RET_FUNC_NAME = "";
	}
};
/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	
	this.fnDsSearchSet();   //검색조건 세팅	
	this.fnDsSet();	// 법인국가 데이터셋 불러오기
	
	this.btnCommonSearch_on_mouseup();  //최초조회
	
	//UT.gfnComboFilterSet(this.screen , [this.cboLangScnCd]);	//해당 콤보에 필터 기능 적용   on_keydown on_focusout 사용
	
}


/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsUserType, "P001");		  // 사용자유형
	UT.gfnGetCommCodes(this.dsBizDiv, "P012");		    // 담당업무구분
	UT.gfnTranceCodeSet(this.dsBizDiv, "N");  
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);	
	
	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE); 	
    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    }
	
	//사용자 권한 Control
    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
        fvauthScope = "DEPT";
    } else {
		if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
	    	fvauthScope = "EMP";  
	    } else{
        	fvauthScope = "PINFO";
        }  
    }
}

/*
* 법인 국가 데이터셋 
*/
function fnDsSet(){
//	UT.gfnGetOuCodes(this.dsOU);	// ou code set
// 1. dsOuCountry options 부르는 함수 호출
//	UT.gfnGetCommCodes(this.dsOuCountry, "O001");
// 2. mapper 호출
	TRN.gfnTranDataSetHandle(this.screen , this.dsOuCountry , "NONE" , "CLEAR" ,  "" , "" , "TRANSACITON_COMMON");	
	TRN.gfnCommonTransactionClear(this.screen, "TRANSACITON_COMMON");
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_OU_COUNTRY" ,"" , "dsOuCountry");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , false , "TRANSACITON_COMMON");
}


/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "selectUserInfo") 
	{		
		if(this.dsUserList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(screen , "MSG001" , "검색 결과가 없습니다.");
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsUserList.getrowcount());	//하단메세지 처리
		}

	}
	
	if(recv_userheader == "getUserId") 
	{
		var iRow = this.grdUserInfo.getselectrow();
		var iRow1 = iRow + 1;
		GRD.gfnInsertRow(this.screen,this.grdUserInfo,false,iRow1);
		
		this.dsUserList.setdatabyname(iRow1, "USER_ID", this.dsUserID.getdatabyname(this.dsUserID.getpos(),"USER_ID"));
		this.dsUserList.setdatabyname(iRow1, "OU_CODE", this.cboOuCode.getselectedcode());
		
		var aryColumn = ["OU_CODE"];
		if( INI.GV_AT_OU != "Y"){
			GRD.gfnHrGrdCellHandle(this.grdUserInfo, iRow1, aryColumn, "D");
	    } else {
			GRD.gfnHrGrdCellHandle(this.grdUserInfo, iRow1, aryColumn, "G");
		}
	}
	
	if(recv_userheader == "saveAuth")
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		
		this.fnUserAuthData();	       //권한조회
	}
	
	if(recv_userheader == "insertAndselect")  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		
		this.btnCommonSearch_on_mouseup();	//조회
	}
	
	
}


/*
* 사용자 roll그룹 정보 가져오기.
* DB조회
*/
function fnUserAuthData(){		
	var vParam = "";
	vParam = "USER_ID=" + this.dsUserList.getdatabyname(this.dsUserList.getpos(), "USER_ID");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsUserAuth , "NONE" , "CLEAR" ,  "" , "" , "TR_USER_AUTH_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_USER_AUTH_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_AUTH_CODE" ,"" , "dsUserAuth", vParam);	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectUserAuth" , true , false , false , "TR_USER_AUTH_INFO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
}

///*
//* 사용자 Site 권한 정보 가져오기.
//* DB조회
//*/
//function fnUserSiteData(){		
//	var vParam = "";
//	vParam = "USER_ID=" + this.dsUserList.getdatabyname(this.dsUserList.getpos(), "USER_ID");
//	vParam = vParam + " OU_CODE=" + this.dsUserList.getdatabyname(this.dsUserList.getpos(), "OU_CODE");
//	
//	TRN.gfnTranDataSetHandle(this.screen , this.dsUserSite , "NONE" , "CLEAR" ,  "" , "" , "TR_USER_SITE_INFO");	
//
//	TRN.gfnCommonTransactionClear(this.screen, "TR_USER_SITE_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
//	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_USER_SITE_CODE" ,"" , "dsUserSite", vParam);	//조회만	
//	
//	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
//	TRN.gfnCommonTransactionRun(this.screen , "selectUserSite" , true , false , false , "TR_USER_SITE_INFO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
//}

function fnSaveData()
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsUserList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsUserAuth, "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO");
	//TRN.gfnTranDataSetHandle(this.screen , this.dsUserSite, "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO");
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_USER_MSTR" , "systemMapper.UPDATE_SMT_USER_MSTR" , "systemMapper.DELETE_SMT_USER_MSTR", "dsUserList" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddUpdate(this.screen, "systemMapper.UPDATE_AUTH_CODE", "dsUserAuth");		
	//TRN.gfnCommonTransactionAddUpdate(this.screen, "systemMapper.UPDATE_USER_SITE_CODE", "dsUserSite");	
	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , true , false , "TR_SAVE_COM_CO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}
/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_USER_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsUserList , "NONE" , "CLEAR" ,  "" , "" , "TR_USER_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_USER_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_USER_MSTR" ,"dsSearch" , "dsUserList", "TR_USER_INFO");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectUserInfo" , true , true , true , "TR_USER_INFO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}



/*
* 저장버튼 클릭시 이벤트 처리 : 저장(등록, 수정, 삭제)
*/
function btnCommonSave_on_mouseup(objInst)
{	
	//var aryDual = [ "USER_TYPE","LOGIN_NO","OU_CODE","ST_DATE"];
	var aryDual = [ "LOGIN_NO","OU_CODE","ST_DATE", "OU_COUNTRY_CODE"];	// 법인국가 추가 20240906 by. yelee
    if(!UT.gfnVaildataionGrd(this.screen,this.grdUserInfo, aryDual, false))
	{
		return;
	}
	
	var emailValue = this.dsUserList.getdatabyname(this.dsUserList.getpos(),"EMAIL_ADDR");
	var hyoseongDomain = "hyoseong.co.kr";

	// 이메일 값이 존재하면서, 효성 도메인으로 입력되지 않았을 때 알림
	if(emailValue != "" && !emailValue.endsWith("@" + hyoseongDomain)) {
		UT.alert(this.screen, "","회사 도메인(@"+ hyoseongDomain +"이 포함된 이메일을 입력하세요.");
		// 편집된 값을 취소하고, 포커스가 이동하지 않게 하기위해
		return;	
	}
		
	UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
}


/*
* User 행추가 버튼 클릭시 이벤트
*/
function btnUserAddRow_on_mouseup(objInst)
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsUserID, "", "", "", "", "TR_USER_ID");    
	TRN.gfnCommonTransactionClear(this.screen, "TR_USER_ID"); 	//트랜젝션 데이터셋 초기화 (필수)	 
    TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_USER_ID_SEQ" , "" , "dsUserID"); //조회만 
    TRN.gfnCommonTransactionRun(this.screen , "getUserId", true, true, false, "TR_USER_ID");
}

/*
* User 행삭제 버튼 클릭시 이벤트
*/
function btnUserDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdUserInfo);
}




function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
//		}
//		else if(result == XFD_MB_RESNO)  {
//			return 0;
		}
//		else if(result == XFD_MB_RESCANCEL)  {
//			UT.alert(this.screen,"","[취소]를 선택하셨습니다");
//		}
//		else if(result == XFD_MB_RESCONTINUE)  {
//			UT.alert(this.screen,"","[계속]를 선택하셨습니다");
//		}
	}
	
	if(messagebox_id == "pwdReset_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnPwdReSet();
		}
	}
	
	if(messagebox_id == "pwdAllReset_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnPwdAllReSet();
		}
	}
}

/*
* User 권한 저장버튼시
*/
function btnAuthSave_on_mouseup(objInst)
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsUserAuth, "ALL" , "NONE" ,  "" , "" , "TR_AUTH_SAVE");

	TRN.gfnCommonTransactionClear(this.screen, "TR_AUTH_SAVE");	//트랜젝션 데이터셋 초기화 (필수)
	
	//TRN.gfnCommonTransactionAddDelete(this.screen, "systemMapper.userAuthCodeDelete", "dsUserAuth", "TR_AUTH_SAVE");
	TRN.gfnCommonTransactionAddSave(this.screen, "", "systemMapper.UPDATE_AUTH_CODE", "", "dsUserAuth");	// 추가 수정 삭제	
				
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "saveAuth" , true , true , false , "TR_AUTH_SAVE");	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* User 클릭시 이벤트
*/
function grdUserInfo_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	this.fnUserAuthData();
	
//	// 내부사용자인 경우
//	if (this.dsUserList.getdatabyname(this.dsUserList.getpos(),"USER_TYPE") == "U") {
//		this.pnlSiteCode.setvisible(true);
//		this.fnUserSiteData();
//	} else {
//		this.pnlSiteCode.setvisible(false);
//	}
}

/*
* 돋보기 클릭시
*/
function grdUserInfo_on_columnclick_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	var nRow = objInst.clicked_item_row_index;
	var nHRColumn = this.grdUserInfo.getcolumn("HR_YN");
	var hrmUsedValue = this.grdUserInfo.getitemcbcomment(nRow, nHRColumn);
	var isHRMNotUsed = hrmUsedValue == "N";
	
	if(this.grdUserInfo.getrowoperation(this.dsUserList.getpos()) != XFD_ROWOP_INSERT){
		return;
	}
	
	// HRM을 사용하지 않는 국가이거나, 행추가가 된 상황이 아닐 때는 팝업 띄우지 않기
	if(isHRMNotUsed) {
		UT.alert(screen,"","해당 법인국가는 아이디를 직접 입력해 주시길 바랍니다.");
		return;
	}
	
	// 사원번호 Poupup
    if(this.grdUserInfo.getcolumnname(nColumn) == "EMP_NAME_POPUP"){

	    // 내부사용자인 경우
		if(this.dsUserList.getdatabyname(this.dsUserList.getpos(),"OU_COUNTRY_CODE") != "") {
			var strPopupName = UT.gfnGetMetaData("LABEL02128", "사원정보조회"); 
			objPopupExtraData.clear();
			objPopupExtraData.P_DATA1 = this.dsUserList.getdatabyname(this.dsUserList.getpos(),"OU_CODE");
			objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
			objPopupExtraData.RETURN_FUNCTION_NAME = "fnEmpNoClosePopCallback";
			screen.loadportletpopup("EmpNoSelect", "/FRAME/popupEmp", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
			
		} else {
			UT.alert(screen,"MSG351","법인을 먼저 선택바랍니다.");
	        return;
		}
	}
	
//	// 업체명 Poupup
//    if(this.grdUserInfo.getcolumnname(nColumn) == "VENDOR_CODE_POP"){
//	    // 외부사용자인 경우
//		if (this.dsUserList.getdatabyname(this.dsUserList.getpos(),"USER_TYPE") == "V") {
//			if(this.dsUserList.getdatabyname(this.dsUserList.getpos(),"OU_CODE") != "") {
//				var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
//				objPopupExtraData.clear();
//				objPopupExtraData.P_DATA1 = this.dsUserList.getdatabyname(this.dsUserList.getpos(),"OU_CODE");
//				objPopupExtraData.P_DATA2 = "";
//				objPopupExtraData.P_DATA3 = "";
//				objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
//				objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorCodeClosePopCallback";
//				screen.loadportletpopup("VendorSelect", "/FRAME/popupVendor", "협력업체정보조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
//			} else {
//				UT.alert(screen,"","법인을 먼저 선택해 주세요.");
//		        return;
//			}
//		}
//	}
}





/*
* 사원번호 Callback
*/
function fnEmpNoClosePopCallback(aryHash) 
{ 
	var iRow = this.dsUserList.getpos();
	
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsUserList.setdatabyname(iRow , "USER_NAME" , aryHash["EMP_NAME"]);
		this.dsUserList.setdatabyname(iRow , "EMP_NAME" , aryHash["EMP_NAME"]);
		this.dsUserList.setdatabyname(iRow , "EMP_NO" , aryHash["EMP_NO"]);
		this.dsUserList.setdatabyname(iRow , "LOGIN_NO" , aryHash["EMP_NO"]);
		this.dsUserList.setdatabyname(iRow , "EMAIL_ADDR" , aryHash["EMAIL_ADDR"]);
		this.dsUserList.setdatabyname(iRow , "DEPT_NAME" , aryHash["DEPT_NAME"]);
		this.dsUserList.setdatabyname(iRow , "JIKCHAK_NAME" , aryHash["JIKCHAK_NAME"]);
	}
}

/*
* 비밀번호 초기화
*/
function btnPwdReSet_on_mouseup(objInst)
{
	var strPrePwd = "hs";
	var strPostPwd = "!@";
	var strReSetPwd = strPrePwd + this.dsUserList.getdatabyname(this.dsUserList.getpos() , "LOGIN_NO") + strPostPwd;
	//var strReSetPwd = "password!";
	
	UT.confirm(this.screen,"MSG319","비밀번호를 ( %% ) 로 초기화 하시겠습니까?",strReSetPwd,0,"pwdReset_confirm");
}

/*
* 비밀번호 초기화
* DB 저장
*/
function fnPwdReSet()
{
	var strPrePwd = "hs";
	var strPostPwd = "!@";
	var strReSetPwd = strPrePwd + this.dsUserList.getdatabyname(this.dsUserList.getpos() , "LOGIN_NO") + strPostPwd;
	
	var params = "USER_ID=" + this.dsUserList.getdatabyname(this.dsUserList.getpos() , "USER_ID") + " PW_NEW=" + strReSetPwd + " FIRST_PWD_CHANGE=" + "N";
	
	TRN.gfnTranDataSetHandle(screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_PWD");
	
	TRN.gfnCommonTransactionClear(screen , "TR_PWD");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(screen , "systemMapper.UPDATE_USER_MSTR_PWDRESET" , "dsSearch" , "" , params);	//조회만
	
	var strSmsBaseUrl = INI.GFV_SERVER_URL + "/userPwdChange";
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(screen , "pwdUpdate" , true , false , false , "TR_PWD" , strSmsBaseUrl);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
	UT.alert(screen , "MSG317" , "비밀번호가 변경되었습니다.");
}

/*
* 전체 비밀번호 초기화
*/
function btnPwdAllReSet_on_mouseup(objInst)
{
	var strPrePwd = "hs";
	var strPostPwd = "!@";
	var strReSetPwd = strPrePwd + "사번" + strPostPwd;
		
	UT.confirm(this.screen,"MSG597","비밀번호를 ( %% ) 로 전체초기화 하시겠습니까?",strReSetPwd,0,"pwdAllReset_confirm");
}

/*
* 전체 비밀번호 초기화
*/
function fnPwdAllReSet()
{
	var strPrePwd = "hs";
	var strPostPwd = "!@";
	var strReSetPwd = "";
	
	for (var iRow = 1; iRow < this.dsUserList.getrowcount(); iRow++) {
		
		strReSetPwd = "";
		
		strReSetPwd = strPrePwd + this.dsUserList.getdatabyname(iRow , "LOGIN_NO") + strPostPwd;
	
		var params = "USER_ID=" + this.dsUserList.getdatabyname(iRow , "USER_ID") + " PW_NEW=" + strReSetPwd + " FIRST_PWD_CHANGE=" + "N";
		
		TRN.gfnTranDataSetHandle(screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_PWD");
		
		TRN.gfnCommonTransactionClear(screen , "TR_PWD");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(screen , "systemMapper.UPDATE_USER_MSTR_PWDRESET" , "dsSearch" , "" , params);	//조회만
		
		var strSmsBaseUrl = INI.GFV_SERVER_URL + "/userPwdChange";
		// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
		TRN.gfnCommonTransactionRun(screen , "pwdUpdate" , true , false , false , "TR_PWD" , strSmsBaseUrl);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
		
	}
	
	UT.alert(screen , "MSG317" , "비밀번호가 변경되었습니다.");
}


function cboOuCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtLoginNo_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtEmpNo_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtUserName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtDeptName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}


/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

/* 화면 크기 변경 */
function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}


/*
* 그리드 법인 코드 데이터 변경이 완료 되었을 때 호출
*/
function fnWhenCountryCodeChanged (nRow, strItemText){
	var ouCountryCode = this.dsUserList.getdatabyname(this.dsUserList.getpos(),"OU_COUNTRY_CODE");
	var nHRColumn = this.grdUserInfo.getcolumn("HR_YN")
	
	this.grdUserInfo.setitemtext(nRow, nHRColumn, strItemText);
	var hrmUsedValue = this.grdUserInfo.getitemcbcomment(nRow, nHRColumn);
	
	var isHRMUsed = hrmUsedValue == "Y";
	
	var nLoginColumn = this.grdUserInfo.getcolumn("LOGIN_NO");

	// HRM을 사용하는 국가일 경우, ID컬럼이 수정되지 않게 
	// HRM을 사용하지 않는 국가일 경우, ID컬럼이 수정될 수 있게
	var isEditable = isHRMUsed ? false : true;
	this.grdUserInfo.setitemeditable(nRow, nLoginColumn , isEditable);
	return;	
}


/*
* 그리드 셀 데이터 편집을 완료했을 때 호출
*/
function grdUserInfo_on_itemeditcomplete(objInst, nRow, nColumn, strPrevItemText)
{
	// 이메일을 변경하였을 시
	if (this.grdUserInfo.getcolumnname(nColumn) == "EMAIL_ADDR"){
		var emailValue = this.dsUserList.getdatabyname(this.dsUserList.getpos(),"EMAIL_ADDR");
		var hyoseongDomain = "hyoseong.co.kr";
	
		// 이메일 값이 존재하면서, 효성 도메인으로 입력되지 않았을 때 알림
		if(emailValue != "" && !emailValue.endsWith("@" + hyoseongDomain)) {
			UT.alert(this.screen, "","회사 도메인(@"+ hyoseongDomain +"이 포함된 이메일을 입력하세요.");
			return;
		}
	}
}

/*
* 유저 데이터 로드시 
* 제약조건 설정 
*/
function grdUserInfo_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// 행추가 모드가 아닐때만 함수 진행
	if(this.grdUserInfo.getrowoperation(this.dsUserList.getpos()) == XFD_ROWOP_INSERT) { 
		return;
	}
	
	var restrictedFields = ["LOGIN_NO", "OU_COUNTRY_CODE", "EMP_NO","OU_CODE", "ST_DATE","INFO_SECURIT_YN"];
	var fieldsLength = restrictedFields.length;

	for(var iColName =0; iColName < fieldsLength; iColName++){
		if(this.grdUserInfo.getcolumnname(nClickColumn) == restrictedFields[iColName]) {
			this.grdUserInfo.setitemeditable(nClickRow, nClickColumn , false);
		}
	}
}

function grdUserInfo_on_itemvaluechanged(objInst, nRow, nColumn, strPrevItemText, strItemText)
{
	// 법인 코드를 변경하였을 시
	if (this.grdUserInfo.getcolumnname(nColumn) == "OU_COUNTRY_CODE"){
		this.fnWhenCountryCodeChanged(nRow, strItemText);
	}
}