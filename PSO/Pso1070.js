/*------------------------------------
* program id : Pso1070
* desc	   : 개발등급별프로젝트조회
* dev date   : 2023-08-23
* made by    : SEYUN
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
	INI.init(this.screen);  	// 모든 폼 Onload 최초 공통
	
	this.fnDsSearchSet();   	//검색조건 세팅	
	
//	if(INI.GV_USER_TYPE == "V"){
//		this.btnCommonSearch_on_mouseup();  //최초조회	
//	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsPsoGrade, "P007"); 	     // 개발착수등급구분
	UT.gfnTranceCodeSet(this.dsPsoGrade, "A");  	      // 전체추가
	UT.gfnGetCommCodes(this.dsProductGroup, "O007"); 	 // ProductGroup
	UT.gfnTranceCodeSet(this.dsProductGroup, "N");  	  // 빈줄추가
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE);
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    }
	
	this.chkOngoing.settext("N");
//	//사용자 권한 Control
//    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
//        fvauthScope = "DEPT";
//    } else {
//		if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
//	    	fvauthScope = "EMP";  
//	    } else{
//        	fvauthScope = "PINFO";
//        }  
//    }
		
//	//사용자 유형 Control (외부사용자)
//	if(INI.GV_USER_TYPE == "V"){
//		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_CODE",INI.GV_VENDOR_CODE);
//		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_NAME",INI.GV_VENDOR_NAME);
//		UT.gfnHrEditorStyle(this.edtVendorName, "D");
//		this.btnVendorNamePop.setenable(false);
//		
//		this.btnVendorChk.setenable(true);
//		this.btnChk.setenable(false);
//		this.btnAddRow.setenable(false);
//		this.btnDelRow.setenable(false);
//	} else {
//		this.btnVendorChk.setenable(false);
//		this.btnChk.setenable(true);
//		this.btnAddRow.setenable(true);
//		this.btnDelRow.setenable(true);
//	}
//	
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
	
	if(recv_userheader == "selectList")
	{		
		if(this.dsPsoList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsPsoList.getrowcount());	//하단메세지 처리
		}

	}
	
//	if(recv_userheader == "insertAndselect")
//	{
//		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
//		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
//		this.fnSearch();
//	}	
}

/*
* 개발등급별프로젝트 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	
	//회사코드(OU_CODE)
	var ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	if(UT.isNull(ouCode) ){
	    UT.alert(this.screen , "MSG582" , "회사를 먼저 선택바랍니다.");
		this.cboOuCode.setfocus();
	    return;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_PROJECT_GRADE" ,"dsSearch" , "dsPsoList");	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectList" , false , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
 * 엔터처리
 */
function fnEnter(keycode){
	if(keycode == 13){
		this.btnSearch_on_mouseup();
	}	
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	this.fnSearch();
}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

function cboOuCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtProjectCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtProjectCode_on_changed(objInst, prev_text, curr_text, event_type)
{
	if( event_type == 5 ){
		if (!curr_text) {
			this.edtProjectCode.settext("");
		} else {
			this.fnProjectCodePopupCall(this.edtProjectCode.gettext());
		}
	}
}

/*
* 프로젝정보 Callback
*/
function fnProjectCodeClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , aryHash["PROJECT_CODE"]);
	} else {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , "");
	}
}

function btnProjectCodePop_on_click(objInst)
{
	this.fnProjectCodePopupCall("");
}

function fnProjectCodePopupCall(projectCode) {
	var strPopupName = UT.gfnGetMetaData("LABEL02628", "PSO 프로젝트 조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = projectCode;
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnProjectCodeClosePopCallback";
	screen.loadportletpopup("ProjectCodeSelect", "/PSO/Pso1031", strPopupName, false, 0, 0, 0, 1196, 440, true, true, false, objPopupExtraData);
}

function cboPsoGrade_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtCustName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtCustName_on_changed(objInst, prev_text, curr_text, event_type)
{
	if( event_type == 5 ){
		if (!curr_text) {
			this.txtCustomerId.settext("");
			this.edtCustName.settext("");
		} else {
			this.fnCustPopupCall("", this.edtCustName.gettext());
		}
	}
}

/*
* 고객정보 Callback
*/
function fnCustClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
	} else {
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_ID" , "");
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_NAME" , "");	
	}
}

function btnCustNamePop_on_click(objInst)
{
	this.fnCustPopupCall("","");
}

function fnCustPopupCall(customerID, customerName) {
	var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = customerID;
	objPopupExtraData.P_DATA3 = customerName;
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnCustClosePopCallback";
	screen.loadportletpopup("CustNameSelect", "/FRAME/popupCust", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

function fldRegYear_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function cboProductGroup_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}