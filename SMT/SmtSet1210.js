/*------------------------------------
* program id : SmtSet1160
* desc	   : 계약관리
* dev date   : 2022-11-10
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
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	
	this.fnDsSearchSet();   //검색조건 세팅	
	
	if(INI.GV_USER_TYPE == "V"){
		this.btnCommonSearch_on_mouseup();  //최초조회	
	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					// ou code set
	UT.gfnGetCommCodes(this.dsDocuType, "P010");		// 금형문서종류
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	//초기화
    this.cboOuCode.setselectedcodeex(INI.GV_OU_CODE,true,false);
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    }
	this.cboSiteCode.setselectedindex(0);
	
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
	
	//사용자 유형 Control (외부사용자)
	if(INI.GV_USER_TYPE == "V"){
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_CODE",INI.GV_VENDOR_CODE);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_NAME",INI.GV_VENDOR_NAME);
		UT.gfnHrEditorStyle(this.edtVendorName, "D");
		this.btnVendorNamePop.setenable(false);
		
		this.btnListAddRow.setenable(false);
		this.btnListDelRow.setenable(false);
		this.btnVendorChk.setenable(true);
		this.btnChk.setenable(false);
		this.btnDocuAddRow.setenable(false);
		this.btnDocuDelRow.setenable(false);
		this.btnHistAddRow.setenable(true);
		this.btnHistDelRow.setenable(true);
	} else {
		this.btnListAddRow.setenable(true);
		this.btnListDelRow.setenable(true);
		this.btnVendorChk.setenable(false);
		this.btnChk.setenable(true);
		this.btnDocuAddRow.setenable(true);
		this.btnDocuDelRow.setenable(true);
		this.btnHistAddRow.setenable(false);
		this.btnHistDelRow.setenable(false);
	}
	
	//제작년도
	this.dtpMkYear.settext( UT.getDate("%Y") );	
	
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
	
	if(recv_userheader == "selectMoldList")
	{		
		if(this.dsMoldList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsMoldList.getrowcount());	//하단메세지 처리
			
			var aryColumn = ["SITE_CODE","MOLD_NAME","MOLD_INTRO","MOLD_MK_YEAR","MOLD_MK_AMOUNT","MOLD_MK_COMPANY","GUARANTY_COUNT","CAVITY","MOLD_MATERIAL","REMARK"];
			var aryColumn1 = ["MOLD_USE_COUNT","MOLD_USE_YN"];
			for(var i=0;i<this.dsMoldList.getrowcount();i++){
				//외부사용자일 경우
				if(INI.GV_USER_TYPE == "V"){
					GRD.gfnHrGrdCellHandle(this.grdMoldList, i, aryColumn, "D");
					GRD.gfnHrGrdCellHandle(this.grdMoldList, i, aryColumn1, "G");
				} else {
					GRD.gfnHrGrdCellHandle(this.grdMoldList, i, aryColumn, "G");
					GRD.gfnHrGrdCellHandle(this.grdMoldList, i, aryColumn1, "D");
				}
			}
		}

	}
	
	if(recv_userheader == "insertAndselect")
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		this.fnSearch();
	}	
}

/*
* 상태에 따라 버튼 등 Control
*/
function fnPageSet(){
	
	var aryColumn = ["DOCU_TYPE","DOCU_VERSION","DOCU_EXPLAIN"];
	for(var i=0;i<this.dsMoldDocu.getrowcount();i++){
		if(this.dsMoldDocu.getdatabyname(i,"VENDOR_CHK_FLAG")=="Y" || INI.GV_USER_TYPE == "U"){
			GRD.gfnHrGrdCellHandle(this.grdDocuList, i, aryColumn, "D");
		} else {
			GRD.gfnHrGrdCellHandle(this.grdDocuList, i, aryColumn, "G");
		}
	}
	
	var aryCol = ["HIST_DATE","HIST_CONTENTS"];
	for(var i=0;i<this.dsMoldHist.getrowcount();i++){
		if(INI.GV_USER_TYPE == "V"){
			GRD.gfnHrGrdCellHandle(this.grdHistList, i, aryCol, "G");
		} else {
			GRD.gfnHrGrdCellHandle(this.grdHistList, i, aryCol, "D");
		}
	}
}		
/*
* 금형관리 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsMoldList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SMT_MOLD_MGT" ,"dsSearch" , "dsMoldList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectMoldList" , true , true , true , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 금형관리 문서정보 데이터 가져오기.
* DB조회
*/
function fnSearchMoldDocu(){		
	
	var pamrams = "";
	params = "OU_CODE=" + this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"OU_CODE");
	params += " MOLD_ID=" + this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"MOLD_ID");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMoldDocu , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH_DOCU");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH_DOCU");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SMT_MOLD_DOCU" ,"" , "dsMoldDocu", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectMoldDocu" , true , false , true , "TR_SEARCH_DOCU");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 금형관리 이력관리 데이터 가져오기.
* DB조회
*/
function fnSearchMoldHist(){		
	
	var pamrams = "";
	params = "OU_CODE=" + this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"OU_CODE");
	params += " MOLD_ID=" + this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"MOLD_ID");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMoldHist , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH_HIST");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH_HIST");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SMT_MOLD_HIST" ,"" , "dsMoldHist", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectMoldHist" , true , false , true , "TR_SEARCH_HIST");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
//	if(this.grdContList.getcheckedrowcount() == 0){
//        UT.alert(screen,"","저장 할 데이터를 먼저 선택 바랍니다.");
//        return false;
//    }
	
	//업체구분
	var vendorCode = this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"VENDOR_CODE");
	if(UT.isNull(vendorCode) ){
	    UT.alert(this.screen , "" , "협력업체를 먼저 선택하세요.");
		this.grdMoldList.setfocus();
	    return false;
	}	

	var siteCode = this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"SITE_CODE");
	if( UT.isNull(siteCode)){
		UT.alert(this.screen , "" , "사업장을 먼저 선택하세요.");
		this.grdMoldList.setfocus();
	    return false;
	}
	
	return true;
}
/*
* 저장
*/
function fnSaveData(alertshow){
	
	var rCnt1 = this.dsMoldList.getrowcount();
	for(var iRow=0;iRow<rCnt1;iRow++){
		var moldID = this.dsMoldList.getdatabyname(iRow,"MOLD_ID");
		if( UT.isNull(moldID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsMoldID , "NONE" , "CLEAR" ,  "" , "" , "TR_MOLD_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_MOLD_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_MOLD_ID_SEQ" ,"" , "dsMoldID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_MOLD_ID_SEQ" , true , false , false , "TR_MOLD_ID");
		
	    	var newMoldID = this.dsMoldID.getdatabyname(this.dsMoldID.getpos(),"SEQ");
			moldID = newMoldID;
		    this.dsMoldList.setdatabyname(iRow, "MOLD_ID", newMoldID);		
		}
		
		var ouCode = this.dsMoldList.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsMoldList.setdatabyname(iRow, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") );
		}
		var siteCode = this.dsMoldList.getdatabyname(iRow,"SITE_CODE");
		if( UT.isNull(siteCode)){
			this.dsMoldList.setdatabyname(iRow, "SITE_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"SITE_CODE") );
		}
	}
		
	var rCnt = this.dsMoldDocu.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var docuOuCode = this.dsMoldDocu.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(docuOuCode)){
			this.dsMoldDocu.setdatabyname(iRow, "OU_CODE", this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"OU_CODE") );
		}
		var docuMoldID = this.dsMoldDocu.getdatabyname(iRow,"MOLD_ID");
		if( UT.isNull(docuMoldID)){
			this.dsMoldDocu.setdatabyname(iRow, "MOLD_ID", this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"MOLD_ID") );
		}
		var docuID = this.dsMoldDocu.getdatabyname(iRow,"DOCU_ID");
		if( UT.isNull(docuID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsDocuID , "NONE" , "CLEAR" ,  "" , "" , "TR_MOLD_DOCU_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_MOLD_DOCU_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_MOLD_ATTCH_ID_SEQ" ,"" , "dsDocuID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_MOLD_DOCU_ID_SEQ" , true , false , false , "TR_MOLD_DOCU_ID");
			var newDocuID = this.dsDocuID.getdatabyname(this.dsDocuID.getpos(),"SEQ");
			this.dsMoldDocu.setdatabyname(iRow, "DOCU_ID", newDocuID);
		}
	}
	
	var rowCount = this.dsMoldHist.getrowcount();
	for(var iRow=0;iRow<rowCount;iRow++){
		var histOuCode = this.dsMoldHist.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(histOuCode)){
			this.dsMoldHist.setdatabyname(iRow, "OU_CODE", this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"OU_CODE") );
		}
		var histMoldID = this.dsMoldHist.getdatabyname(iRow,"MOLD_ID");
		if( UT.isNull(histMoldID)){
			this.dsMoldHist.setdatabyname(iRow, "MOLD_ID", this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"MOLD_ID") );
		}
		var histID = this.dsMoldHist.getdatabyname(iRow,"HIST_ID");
		if( UT.isNull(histID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsHistID , "NONE" , "CLEAR" ,  "" , "" , "TR_MOLD_HIST_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_MOLD_HIST_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_MOLD_ATTCH_ID_SEQ" ,"" , "dsHistID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_MOLD_HIST_ID_SEQ" , true , false , false , "TR_MOLD_HIST_ID");
			var newHistID = this.dsHistID.getdatabyname(this.dsHistID.getpos(),"SEQ");
			this.dsMoldHist.setdatabyname(iRow, "HIST_ID", newHistID);
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMoldList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsMoldDocu , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsMoldHist , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
		
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtVendorMapper.INSERT_SMT_MOLD_MGT" , "ProcSmtVendorMapper.UPDATE_SMT_MOLD_MGT" , "ProcSmtVendorMapper.DELETE_SMT_MOLD_MGT" , "dsMoldList" );					
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtVendorMapper.INSERT_SMT_MOLD_DOCU" , "ProcSmtVendorMapper.UPDATE_SMT_MOLD_DOCU" , "ProcSmtVendorMapper.DELETE_SMT_MOLD_DOCU" , "dsMoldDocu" );				
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtVendorMapper.INSERT_SMT_MOLD_HIST" , "ProcSmtVendorMapper.UPDATE_SMT_MOLD_HIST" , "ProcSmtVendorMapper.DELETE_SMT_MOLD_HIST" , "dsMoldHist" );				
	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	this.fnSearch();
}

/*
* 저장버튼 클릭시 이벤트 처리 : 저장(등록, 수정, 삭제)
*/
function btnCommonSave_on_mouseup(objInst)
{	
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	
	UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
}

function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData(true);
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
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function cboOuCode_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	UT.gfnGetUserSiteCodes(this.dsSiteCode,this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE"),INI.GV_USER_ID);	
}

function cboSiteCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtVendorName_on_changed(objInst, prev_text, curr_text, event_type)
{
	if( event_type == 5 ){
		if (!curr_text) {
			this.txtVendorCode.settext("");
			this.edtVendorName.settext("");
		} else {
			this.fnVendorPopupCall("", this.edtVendorName.gettext());
		}
	}
}

function btnVendorNamePop_on_click(objInst)
{
	this.fnVendorPopupCall("","");
}

/*
* 업체정보 Callback
*/
function fnVendorClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
	} else {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , "");
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , "");	
	}
}

function fnVendorPopupCall(vendorCode, vendorName) {
	var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = vendorCode;
	objPopupExtraData.P_DATA3 = vendorName;
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorClosePopCallback";
	screen.loadportletpopup("VendorNameSelect", "/FRAME/popupVendor", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

function dtpMkYear_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtMoldName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function grdMoldList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	this.fnSearchMoldDocu();
	this.fnSearchMoldHist();
	this.fnPageSet();
}

function grdMoldList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// 업체명 Poupup
    if(this.grdMoldList.getcolumnname(nColumn) == "VENDOR_CODE_POP"){
		var docucnt = 0;
		var histcnt = 0;
		docucnt = Number(this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"DOCU_CNT"));
		histcnt = Number(this.dsMoldList.getdatabyname(this.dsMoldList.getpos(),"HIST_CNT"));
		if( docucnt != 0 && histcnt != 0 ){
			return;
		}
		
		var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
		objPopupExtraData.P_DATA2 = "";
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorCodeClosePopCallback";
		screen.loadportletpopup("VendorSelect", "/FRAME/popupVendor", "협력업체정보조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}
}
/*
* 그리드 업체정보 Callback
*/
function fnVendorCodeClosePopCallback(aryHash) 
{ 
	var iRow = this.dsMoldList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsMoldList.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsMoldList.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
		this.dsMoldList.setdatabyname(iRow , "BIZ_TYPE" , aryHash["BIZ_TYPE"]);
		this.dsMoldList.setdatabyname(iRow , "BIZ_TYPE_NAME" , aryHash["BIZ_TYPE_NAME"]);
	}
}

//function grdDocuList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
//{
//	var blChecked = GRD.gfnGrdRowIsChecked(this.grdDocuList , nClickRow);
//	
//	if(blChecked){
//		this.grdDocuList.setcheckedrow(nClickRow , false);
//	}else{
//		this.grdDocuList.setcheckedrow(nClickRow , true);
//	}
//}

function grdDocuList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// 문서첨부 Poupup
	if(this.grdDocuList.getcolumnname(nColumn) == "ATTACH_FILE_POP"){
		this.grdDocuList.setcheckedrow(this.grdDocuList.getselectrow(), true);
		
		var vendorChkFlag = this.dsMoldDocu.getdatabyname(this.dsMoldDocu.getpos(),"VENDOR_CHK_FLAG");
		if( (UT.isNull(vendorChkFlag) || vendorChkFlag=="N") && INI.GV_USER_TYPE=="U"){
			var docuID = this.dsMoldDocu.getdatabyname(this.dsMoldDocu.getpos(),"DOCU_ID");
			if( UT.isNull(docuID)){
				TRN.gfnTranDataSetHandle(this.screen , this.dsDocuID , "NONE" , "CLEAR" ,  "" , "" , "TR_MOLD_DOCU_ID");	
				TRN.gfnCommonTransactionClear(this.screen, "TR_MOLD_DOCU_ID");	//트랜젝션 데이터셋 초기화 (필수)	
				TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_MOLD_ATTCH_ID_SEQ" ,"" , "dsDocuID");	//조회만	
				TRN.gfnCommonTransactionRun(this.screen , "SEL_MOLD_DOCU_ID_SEQ" , true , false , false , "TR_MOLD_DOCU_ID");
				var newdocuID = this.dsDocuID.getdatabyname(this.dsDocuID.getpos(),"SEQ");
				this.dsMoldDocu.setdatabyname(this.dsMoldDocu.getpos(), "DOCU_ID", newdocuID);
			}
	
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsMoldDocu.getdatabyname(this.dsMoldDocu.getpos(),"DOCU_ID");
			objPopupAttData.P_MODE = "W";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1210";
			objPopupAttData.P_REF_NAME = "";
			objPopupAttData.P_DIR_TYPE = "MOLD";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
			screen.loadportletpopup("AttFile1210", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		//업체확인 이후 첨부문서 수정불가
		} else {
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsMoldDocu.getdatabyname(this.dsMoldDocu.getpos(),"DOCU_ID");
			objPopupAttData.P_MODE = "R";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1210";
			objPopupAttData.P_REF_NAME = "";
			objPopupAttData.P_DIR_TYPE = "MOLD";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "";
			screen.loadportletpopup("AttFile1211", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		}		
	}
}
/*
* 첨부파일 Callback
*/
function fnAttFilePopCallback(aryHash) 
{ 
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	// 저장한다
	this.fnSaveData(false);
	// 재조회
	//this.fnSearch();
	this.fnSearchMoldDocu();
	this.fnSearchMoldHist();
	this.fnPageSet();
}

function grdHistList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// 문서첨부 Poupup
	if(this.grdHistList.getcolumnname(nColumn) == "ATT_FILE_POP"){
		// 협력업체만 파일 첨부 가능
		if(INI.GV_USER_TYPE=="V"){
			var histID = this.dsMoldHist.getdatabyname(this.dsMoldHist.getpos(),"HIST_ID");
			if( UT.isNull(histID)){
				TRN.gfnTranDataSetHandle(this.screen , this.dsHistID , "NONE" , "CLEAR" ,  "" , "" , "TR_MOLD_HIST_ID");	
				TRN.gfnCommonTransactionClear(this.screen, "TR_MOLD_HIST_ID");	//트랜젝션 데이터셋 초기화 (필수)	
				TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_MOLD_ATTCH_ID_SEQ" ,"" , "dsHistID");	//조회만	
				TRN.gfnCommonTransactionRun(this.screen , "SEL_MOLD_HIST_ID_SEQ" , true , false , false , "TR_MOLD_HIST_ID");
				var newhistID = this.dsHistID.getdatabyname(this.dsHistID.getpos(),"SEQ");
				this.dsMoldHist.setdatabyname(this.dsMoldHist.getpos(), "HIST_ID", newhistID);
			}
	
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsMoldHist.getdatabyname(this.dsMoldHist.getpos(),"HIST_ID");
			objPopupAttData.P_MODE = "W";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1210";
			objPopupAttData.P_REF_NAME = "";
			objPopupAttData.P_DIR_TYPE = "MOLD";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
			screen.loadportletpopup("AttFile1212", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		// 내부사용자 조회만 가능
		} else {
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsMoldHist.getdatabyname(this.dsMoldHist.getpos(),"HIST_ID");
			objPopupAttData.P_MODE = "R";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1210";
			objPopupAttData.P_REF_NAME = "";
			objPopupAttData.P_DIR_TYPE = "MOLD";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "";
			screen.loadportletpopup("AttFile1213", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		}		
	}
}
/*
* 금형관리 행추가
*/
function btnListAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdMoldList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdMoldList,false,rowCount);
	this.dsMoldDocu.deleteallrows();
	this.dsMoldHist.deleteallrows();
}
/*
* 금형관리 행삭제
*/
function btnListDelRow_on_mouseup(objInst)
{
	var docucnt = 0;
	var histcnt = 0;
	docucnt = Number(this.dsMoldDocu.getrowcount());
	histcnt = Number(this.dsMoldHist.getrowcount());
	if( docucnt != 0 && histcnt != 0 ){
		UT.alert(screen,"","선택된 데이터의 문서첨부현황 및 금형이력현황이 존재합니다." + "\n" +
						   "문서첨부현황 및 금형이력현황 삭제처리 후 삭제 할 수 있습니다." + "\n" +
		                   "확인바랍니다." );
        return;
	} else {
		GRD.gfnDeleteRow(this.screen,this.grdMoldList);
	}
}
/*
* 문서첨부 행추가
*/
function btnDocuAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdDocuList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdDocuList,false,rowCount);
}
/*
* 문서첨부 행삭제
*/
function btnDocuDelRow_on_mouseup(objInst)
{
	var iRow = this.grdDocuList.getselectrow();
	var vendorChkFlag = this.dsMoldDocu.getdatabyname(iRow,"VENDOR_CHK_FLAG");
	if(vendorChkFlag == "Y"){
		UT.alert(screen,"","선택된 데이터는 이미 업체확인이 완료 되어 삭제처리 할 수 없습니다." + "\n" +
		                   "확인바랍니다." );
        return;
	} else {
		GRD.gfnDeleteRow(this.screen,this.grdDocuList);
	}
}
/*
* 금형이력 행추가
*/
function btnHistAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdHistList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdHistList,false,rowCount);
}
/*
* 금형이력 행삭제
*/
function btnHistDelRow_on_mouseup(objInst)
{
	var iRow = this.grdHistList.getselectrow();
	var attChk = this.dsMoldHist.getdatabyname(iRow,"HIST_ATT_YN");
	if(attChk == "Y"){
		UT.alert(screen,"","선택된 데이터의 문서첨부 내역이 존재합니다." + "\n" +
						   "삭제처리 할 수 없습니다.!!!" + "\n" +
		                   "확인바랍니다." );
        return;
	} else {
		GRD.gfnDeleteRow(this.screen,this.grdHistList);
	}
}
/*
* 업체확인
*/
function btnVendorChk_on_mouseup(objInst)
{
	if(this.grdDocuList.getcheckedrowcount() == 0){
        UT.alert(screen,"","해당 데이터를 먼저 선택 바랍니다.");
        return;
    }

	var nCheckedRow = -1 ;
	for(var iRow=0; iRow < this.grdDocuList.getcheckedrowcount(); iRow++) {
		nCheckedRow = this.grdDocuList.getcheckedrow(nCheckedRow+1);
		var vendorChkFlag = this.dsMoldDocu.getdatabyname(nCheckedRow,"VENDOR_CHK_FLAG");
		if(vendorChkFlag == "Y"){
			UT.alert(screen,"","이미 업체확인 처리 완료된 데이터 입니다." + "\n" +
			                   "확인바랍니다." );
        	return;
		} else {
			var attachYN = this.dsMoldDocu.getdatabyname(nCheckedRow,"DOCU_ATT_YN");
			if(UT.isNull(attachYN) || attachYN == "N"){
				UT.alert(screen,"","선택된 데이터의 문서첨부 내역이 없습니다." + "\n" +
				                   "확인바랍니다." );
	        	return;
			} else {
				this.dsMoldDocu.setdatabyname(nCheckedRow,"VENDOR_CHK_FLAG","Y")  ;
			
			    TRN.gfnTranDataSetHandle(this.screen, this.dsMoldDocu, "ALL", "NONE", "", "", "TR_VENDOR_CHK");
			    TRN.gfnCommonTransactionClear(this.screen,"TR_VENDOR_CHK");
			    TRN.gfnCommonTransactionAddUpdate(this.screen ,"ProcSmtVendorMapper.UPDATE_MOLD_DOCU_VENDOR_CHK" ,"dsMoldDocu");
				TRN.gfnCommonTransactionRun(this.screen , "VendorChkUpdate", true, false, false, "TR_VENDOR_CHK");  		
			}
		}
	}
	
	UT.alert(this.screen , "MSG041" , "처리 완료 되었습니다.");
	
	this.fnSearch();
	this.fnSearchMoldDocu();
	this.fnSearchMoldHist();
	this.fnPageSet();
}
/*
* 효성확인
*/
function btnChk_on_mouseup(objInst)
{
	if(this.grdDocuList.getcheckedrowcount() == 0){
        UT.alert(screen,"","해당 데이터를 먼저 선택 바랍니다.");
        return;
    }

	var nCheckedRow = -1 ;
	for(var iRow=0; iRow < this.grdDocuList.getcheckedrowcount(); iRow++) {
		nCheckedRow = this.grdDocuList.getcheckedrow(nCheckedRow+1);
		var chkFlag = this.dsMoldDocu.getdatabyname(nCheckedRow,"CHK_FLAG");
		if(chkFlag == "Y"){
			UT.alert(screen,"","이미 효성확인 처리 완료된 데이터 입니다." + "\n" +
			                   "확인바랍니다." );
        	return;
		} else {
			var vendorChkFlag = this.dsMoldDocu.getdatabyname(nCheckedRow,"VENDOR_CHK_FLAG");
			if(UT.isNull(vendorChkFlag) || vendorChkFlag == "N"){
				UT.alert(screen,"","선택된 데이터의 업체확인 내역이 없습니다." + "\n" +
				                   "확인바랍니다." );
	        	return;
			} else {
				this.dsMoldDocu.setdatabyname(nCheckedRow,"CHK_FLAG","Y")  ;
			
			    TRN.gfnTranDataSetHandle(this.screen, this.dsMoldDocu, "ALL", "NONE", "", "", "TR_CHK");
			    TRN.gfnCommonTransactionClear(this.screen,"TR_CHK");
			    TRN.gfnCommonTransactionAddUpdate(this.screen ,"ProcSmtVendorMapper.UPDATE_MOLD_DOCU_CHK" ,"dsMoldDocu");
				TRN.gfnCommonTransactionRun(this.screen , "ChkUpdate", true, false, false, "TR_CHK");  		
			}
		}
	}
	
	UT.alert(this.screen , "MSG041" , "처리 완료 되었습니다.");
	
	this.fnSearch();
	this.fnSearchMoldDocu();
	this.fnSearchMoldHist();
	this.fnPageSet();
}