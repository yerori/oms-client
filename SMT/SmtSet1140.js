/*------------------------------------
* program id : SmtSet1140
* desc	   : 업체정보관리
* dev date   : 2022-10-20
* made by    : SEYUN
*-------------------------------------*/

var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";
var fvMstPostCode = "";
var fvMstRoadAddress = "";

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
	
	//this.fnBizTypeCode();        // 업종코드 set
	
	this.fnDsSearchSet();   //검색조건 세팅	
	
	//사용자 유형 Control (외부사용자)
	if(INI.GV_USER_TYPE == "V"){
		this.btnCommonSearch_on_mouseup();  //최초조회	
	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsVendorType, "P002");		// 업체구분
	UT.gfnGetCommCodes(this.dsChgDeptCode, "P003");	   // 업체담당자부서코드
	UT.gfnGetCommCodes(this.dsSQBizType, "P004");		 // SQ업종코드
	UT.gfnGetCommCodes(this.dsBizType, "P005");		   // 업종코드 set
	//UT.gfnGetCommCodes(this.dsSQGrade, "P005");		   // SQ등급코드
	
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
	
	//사용자 유형 Control (외부사용자)
	if(INI.GV_USER_TYPE == "V"){
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_CODE",INI.GV_VENDOR_CODE);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_NAME",INI.GV_VENDOR_NAME);
		UT.gfnHrEditorStyle(this.edtVendorName, "D");
		this.btnVendorNamePop.setenable(false);
	}
	
	UT.gfnHrEditorStyle(this.fldVendorNm, "D");
	UT.gfnHrEditorStyle(this.fldVendorCode, "D");
	UT.gfnHrEditorStyle(this.cboNation, "D");
	UT.gfnHrEditorStyle(this.cboDealYN, "D");
	UT.gfnHrEditorStyle(this.fldDealEndDate, "D");
	UT.gfnHrEditorStyle(this.cboBizType, "D");
	UT.gfnHrEditorStyle(this.cboVendorType, "D");
	UT.gfnHrEditorStyle(this.fldTaxRegNum, "D");
	UT.gfnHrEditorStyle(this.fldRepreNm, "D");
	UT.gfnHrEditorStyle(this.fldErpInsDate, "D");
	UT.gfnHrEditorStyle(this.fldAddr1, "D");
	UT.gfnHrEditorStyle(this.fldSQCertAttYN, "D");
	UT.gfnHrEditorStyle(this.fldIATFCertAttYN, "D");
}

/*
* 업종코드 가져오기
* DB조회 
*/
//function fnBizTypeCode(){		
//	TRN.gfnTranDataSetHandle(this.screen , this.dsBizType , "NONE" , "CLEAR" ,  "" , "" , "TR_BIZ_TYPE");	
//	TRN.gfnCommonTransactionClear(this.screen, "TR_BIZ_TYPE");	//트랜젝션 데이터셋 초기화 (필수)	
//	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_BIZ_TYPE" ,"" , "dsBizType");
//	TRN.gfnCommonTransactionRun(this.screen , "selectBizTpe" , true , false , false , "TR_BIZ_TYPE");	
//}

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
	
	if(recv_userheader == "selectSupplier")
	{		
		this.fnSearchFinInfo();
		this.fnSearchChgInfo();
	}
	
	if(recv_userheader == "insertAndselect")
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		this.fnSearch();
	}	
}


/*
* 업체정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	
	//법인코드
	var ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	if(UT.isNull(ouCode) ){
	    UT.alert(this.screen , "" , "법인을 먼저 선택하세요.");
		this.cboOuCode.setfocus();
	    return;
	}
	
	//업체코드
	var vendorCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"VENDOR_CODE");
	if(UT.isNull(vendorCode) ){
	    UT.alert(this.screen , "" , "업체를 먼저 선택하세요.");
		this.edtVendorName.setfocus();
	    return;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SUPPLIER_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsSupplier , "NONE" , "CLEAR" ,  "" , "" , "TR_SUPPLIER_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SUPPLIER_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPPLIER_MSTR" ,"dsSearch" , "dsSupplier");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectSupplier" , true , true , true , "TR_SUPPLIER_INFO");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 업체 재무 정보 데이터 가져오기.
* DB조회
*/
function fnSearchFinInfo(){		
	
	var pamrams = "";
	params = "OU_CODE=" + this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"OU_CODE");
	params = params + " VENDOR_CODE=" + this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"VENDOR_CODE");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSupFinInfo , "NONE" , "CLEAR" ,  "" , "" , "TR_SUPPLIER_FIN_INFO");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SUPPLIER_FIN_INFO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPPLIER_FIN_INFO" ,"" , "dsSupFinInfo", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectSuppFinInfo" , true , false , true , "TR_SUPPLIER_FIN_INFO");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
/*
* 업체 담당자 정보 데이터 가져오기.
* DB조회
*/
function fnSearchChgInfo(){		
	
	var pamrams = "";
	params = "OU_CODE=" + this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"OU_CODE");
	params = params + " VENDOR_CODE=" + this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"VENDOR_CODE");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSupChgInfo , "NONE" , "CLEAR" ,  "" , "" , "TR_SUPPLIER_CHG_INFO");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SUPPLIER_CHG_INFO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPPLIER_CHG_INFO" ,"" , "dsSupChgInfo", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectSuppChgInfo" , true , false , true , "TR_SUPPLIER_CHG_INFO");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	//업체구분
//	var vendorType = this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"VENDOR_TYPE");
//	if(UT.isNull(vendorType) ){
//	    UT.alert(this.screen , "" , "업체구분을 선택하세요.");
//		this.cboVendorType.setfocus();
//	    return false;
//	}	
	
	//주소1
	var addr1 = this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"ADDR1");
	if(UT.isNull(addr1) ){
	    UT.alert(this.screen , "" , "주소를 입력하세요.");
		this.fldPostCode.setfocus();
	    return false;
	}	
	
	//대표메일
	var emainAddr = this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"EMAIL_ADDR");
	if(UT.isNull(emainAddr) ){
	    UT.alert(this.screen , "" , "대표메일을 입력하세요.");
		this.fldEmail.setfocus();
	    return false;
	}	
	
	//재무정보 필수 항목 검사
	var aryDual = [ "SALES_YEAR"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdDetail, aryDual, false))
	{
		return false;
	}
	
	//담당자정보 1명이상 반드시 등록
	if(this.grdChgList.getrowcount() <= 0){
		UT.alert(this.screen , "" , "담당자 정보를 반드시 1명 이상 등록 바랍니다.");
		this.grdChgList.setfocus();
	    return false;
	}
	
	//담당자정보 필수 항목 검사
	var aryDual = [ "CHG_NAME","CHG_EMAIL_ADDR"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdChgList, aryDual, false))
	{
		return false;
	}
	
	return true;
}
/*
* 저장
*/
function fnSaveData(alertshow){
	
	var rCnt = this.dsSupFinInfo.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var ouCode = this.dsSupFinInfo.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsSupFinInfo.setdatabyname(iRow, "OU_CODE", this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"OU_CODE") );
		}
		var vendorCode = this.dsSupFinInfo.getdatabyname(iRow,"VENDOR_CODE");
		if( UT.isNull(vendorCode)){
			this.dsSupFinInfo.setdatabyname(iRow, "VENDOR_CODE", this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"VENDOR_CODE") );
		}
		var vendorFinInfoID = this.dsSupFinInfo.getdatabyname(iRow,"VENDOR_FIN_INFO_ID");
		if( UT.isNull(vendorFinInfoID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsFinInfoSEQ , "NONE" , "CLEAR" ,  "" , "" , "TR_SUPPLIER_FIN_INFO_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_SUPPLIER_FIN_INFO_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPPLIER_FIN_INFO_ID_SEQ" ,"" , "dsFinInfoSEQ");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_SUPPLIER_FIN_INFO_SEQ" , true , false , false , "TR_SUPPLIER_FIN_INFO_ID");
			var newVendorFinInfoID = this.dsFinInfoSEQ.getdatabyname(this.dsFinInfoSEQ.getpos(),"SEQ");
			this.dsSupFinInfo.setdatabyname(iRow, "VENDOR_FIN_INFO_ID", newVendorFinInfoID);
		}
	}
	
	var rCount = this.dsSupChgInfo.getrowcount();
	for(var iRow=0;iRow<rCount;iRow++){
		var ouCode = this.dsSupChgInfo.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsSupChgInfo.setdatabyname(iRow, "OU_CODE", this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"OU_CODE") );
		}
		var vendorCode = this.dsSupChgInfo.getdatabyname(iRow,"VENDOR_CODE");
		if( UT.isNull(vendorCode)){
			this.dsSupChgInfo.setdatabyname(iRow, "VENDOR_CODE", this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"VENDOR_CODE") );
		}
		var vendorChgInfoID = this.dsSupChgInfo.getdatabyname(iRow,"VENDOR_CHG_INFO_ID");
		if( UT.isNull(vendorChgInfoID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsChgInfoSEQ , "NONE" , "CLEAR" ,  "" , "" , "TR_SUPPLIER_CHG_INFO_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_SUPPLIER_CHG_INFO_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPPLIER_CHG_INFO_ID_SEQ" ,"" , "dsChgInfoSEQ");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_SUPPLIER_CHG_INFO_SEQ" , true , false , false , "TR_SUPPLIER_CHG_INFO_ID");
			var newVendorChgInfoID = this.dsChgInfoSEQ.getdatabyname(this.dsChgInfoSEQ.getpos(),"SEQ");
			this.dsSupChgInfo.setdatabyname(iRow, "VENDOR_CHG_INFO_ID", newVendorChgInfoID);
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSupplier , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsSupFinInfo , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");							//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsSupChgInfo , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");							//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddUpdate(this.screen , "ProcSmtVendorMapper.UPDATE_SUPPLIER_MSTR" , "dsSupplier" );	// 수정
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtVendorMapper.INSERT_SUPPLIER_FIN_INFO" , "ProcSmtVendorMapper.UPDATE_SUPPLIER_FIN_INFO" , "ProcSmtVendorMapper.DELETE_SUPPLIER_FIN_INFO", "dsSupFinInfo" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtVendorMapper.INSERT_SUPPLIER_CHG_INFO" , "ProcSmtVendorMapper.UPDATE_SUPPLIER_CHG_INFO" , "", "dsSupChgInfo" );	// 추가 수정 삭제
	
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

function btnVendorNamePop_on_click(objInst)
{
	this.fnVendorPopupCall("","");
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
/*
* 우편번호 조회 (screen.loadjs 방식 사용)
*/
function btnPostCodePop_on_click(objInst)
{
	this.screen.loadjs("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", "fnGetMstrPostCode", 1);
}
/*
* 우편번호 조회 callback
*/
function fnGetMstrPostCode(strUrl, bSuccess){
	
	new daum.Postcode({
		oncomplete: function(data) {
			fvMstPostCode = data.zonecode;
			fvMstRoadAddress = data.roadAddress;
        }
	}).open();	
	
	this.fldEmail.setfocus();
	this.fldAddr2.setfocus();
}

function fldAddr2_on_focusin(objInst)
{
	if(!UT.isNull(fvMstPostCode)){
		this.fldPostCode.settext(fvMstPostCode);
		this.fldAddr1.settext(fvMstRoadAddress);
	}
}

function btnAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdDetail.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdDetail,false,rowCount);
}

function btnDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdDetail);
}

function btnChgAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdChgList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdChgList,false,rowCount);
}

function grdDetail_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	if(this.grdDetail.getcolumnname(nColumn) == "ATTFILE_YN_POP"){
    	var vendorFinInfoID = this.dsSupFinInfo.getdatabyname(this.dsSupFinInfo.getpos(),"VENDOR_FIN_INFO_ID");
		if (UT.isNull(vendorFinInfoID)){
			if( !this.fnValidForm()){
				return;
		    }
			
			// 저장한다
			this.fnSaveData(false);
		}
		
		var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
		objPopupAttData.clear();
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = this.dsSupFinInfo.getdatabyname(this.dsSupFinInfo.getpos(),"VENDOR_FIN_INFO_ID");
		objPopupAttData.P_MODE = "W";
		objPopupAttData.P_FILE_GUBUN = "SmtSet1140";
		objPopupAttData.P_REF_NAME = "";
		objPopupAttData.P_DIR_TYPE = "VEND";
		objPopupAttData.P_OU_CODE = this.dsSupFinInfo.getdatabyname(this.dsSupFinInfo.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
		screen.loadportletpopup("AttFile1140", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
	}		
}

/*
* 첨부파일 Callback
*/
function fnAttFilePopCallback(aryHash) 
{ 
	this.fnSearchFinInfo();
}

function btnSQAttPop_on_click(objInst)
{
	if( !this.fnValidForm()){
		return;
    }
	
	// 저장한다
	this.fnSaveData(false);
			
	var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
	objPopupAttData.clear();
	objPopupAttData.P_ATT_ID = "";
	objPopupAttData.P_REF_ID = this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"VENDOR_CODE");
	objPopupAttData.P_MODE = "W";
	objPopupAttData.P_FILE_GUBUN = "SmtSet1140";
	objPopupAttData.P_REF_NAME = "SQCERT";
	objPopupAttData.P_DIR_TYPE = "VEND";
	objPopupAttData.P_OU_CODE = this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"OU_CODE");	
	objPopupAttData.RET_FUNC_NAME = "fnCertAttFilePopCallback";
	screen.loadportletpopup("AttFile11401", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
}

function btnIATFAttPop_on_click(objInst)
{
	if( !this.fnValidForm()){
		return;
    }
	
	// 저장한다
	this.fnSaveData(false);
			
	var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
	objPopupAttData.clear();
	objPopupAttData.P_ATT_ID = "";
	objPopupAttData.P_REF_ID = this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"VENDOR_CODE");
	objPopupAttData.P_MODE = "W";
	objPopupAttData.P_FILE_GUBUN = "SmtSet1140";
	objPopupAttData.P_REF_NAME = "IATFCERT";
	objPopupAttData.P_DIR_TYPE = "VEND";
	objPopupAttData.P_OU_CODE = this.dsSupplier.getdatabyname(this.dsSupplier.getpos(),"OU_CODE");	
	objPopupAttData.RET_FUNC_NAME = "fnCertAttFilePopCallback";
	screen.loadportletpopup("AttFile11402", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
}

/*
* 인증서 첨부파일 Callback
*/
function fnCertAttFilePopCallback(aryHash) 
{ 
	this.btnCommonSearch_on_mouseup();
}