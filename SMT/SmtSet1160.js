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
	UT.gfnGetCommCodes(this.dsContType, "P009");		// 계약서종류코드
	
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
		
		this.btnVendorChk.setenable(true);
		this.btnChk.setenable(false);
		this.btnAddRow.setenable(false);
		this.btnDelRow.setenable(false);
	} else {
		this.btnVendorChk.setenable(false);
		this.btnChk.setenable(true);
		this.btnAddRow.setenable(true);
		this.btnDelRow.setenable(true);
	}
	
	//계약일자set
	this.dtpContDateF.settext( UT.getDate("%Y") + "0101" );
	this.dtpContDateT.settext( UT.getDate("%Y%M%D"));
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
	
	if(recv_userheader == "selectContList")
	{		
		if(this.dsContList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsContList.getrowcount());	//하단메세지 처리
			
			var aryColumn = ["VENDOR_CODE_POP","CONTRACT_TYPE","CONTRACT_DATE"];
			for(var i=0;i<this.dsContList.getrowcount();i++){
				if(this.dsContList.getdatabyname(i,"VENDOR_CHK_FLAG")=="Y" || INI.GV_USER_TYPE == "V"){
					GRD.gfnHrGrdCellHandle(this.grdContList, i, aryColumn, "D");
				} else {
					GRD.gfnHrGrdCellHandle(this.grdContList, i, aryColumn, "G");
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
* 계약관리 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsContList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SMT_CONTRACT" ,"dsSearch" , "dsContList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectContList" , true , true , true , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
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
	var vendorCode = this.dsContList.getdatabyname(this.dsContList.getpos(),"VENDOR_CODE");
	if(UT.isNull(vendorCode) ){
	    UT.alert(this.screen , "" , "협력업체를 먼저 선택하세요.");
		this.grdContList.setfocus();
	    return false;
	}	

	return true;
}
/*
* 저장
*/
function fnSaveData(alertshow){
	
	var rCnt = this.dsContList.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var ouCode = this.dsContList.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsContList.setdatabyname(iRow, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") );
		}
		var contract_id = this.dsContList.getdatabyname(iRow,"CONTRACT_ID");
		if( UT.isNull(contract_id)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsContID , "NONE" , "CLEAR" ,  "" , "" , "TR_CONTRACT_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_CONTRACT_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_CONTRACT_ID_SEQ" ,"" , "dsContID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_CONTRACT_ID_SEQ" , true , false , false , "TR_CONTRACT_ID");
			var newcontract_id = this.dsContID.getdatabyname(this.dsContID.getpos(),"SEQ");
			this.dsContList.setdatabyname(iRow, "CONTRACT_ID", newcontract_id);
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsContList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtVendorMapper.INSERT_SMT_CONTRACT" , "ProcSmtVendorMapper.UPDATE_SMT_CONTRACT" , "ProcSmtVendorMapper.DELETE_SMT_CONTRACT" , "dsContList" );					// 추가 수정
	
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

function dtpContDateF_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

/*
* 날짜 이상유무 확인
*/
function dtpContDateF_on_change(objInst, event_type)
{
	var datelen = this.dtpContDateF.gettext();
	
	if(datelen.length == "8"){
		if(this.dtpContDateF.gettext() != "" && this.dtpContDateT.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.dtpContDateF , this.dtpContDateT , true);
			if(!rt){
				this.dtpContDateF.settext("");
				this.dtpContDateF.setfocus();
			}
			
		}
	} 	
}

function dtpContDateT_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

/*
* 날짜 이상유무 확인
*/
function dtpContDateT_on_change(objInst, event_type)
{
	var datelen = this.dtpContDateT.gettext();
	
	if(datelen.length == "8"){
		if(this.dtpContDateF.gettext() != "" && this.dtpContDateT.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.dtpContDateF , this.dtpContDateT , true);
			if(!rt){
				this.dtpContDateT.settext("");
				this.dtpContDateT.setfocus();
			}
			
		}
	}
}

function edtVendorName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
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

//function grdContList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
//{
//	var blChecked = GRD.gfnGrdRowIsChecked(this.grdContList , nClickRow);
//	
//	if(blChecked){
//		this.grdContList.setcheckedrow(nClickRow , false);
//	}else{
//		this.grdContList.setcheckedrow(nClickRow , true);
//	}
//}

function grdContList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// 문서첨부 Poupup
	if(this.grdContList.getcolumnname(nColumn) == "ATTACH_FILE_POP"){
		this.grdContList.setcheckedrow(this.grdContList.getselectrow(), true);
		
		var vendorChkFlag = this.dsContList.getdatabyname(this.dsContList.getpos(),"VENDOR_CHK_FLAG");
		if( (UT.isNull(vendorChkFlag) || vendorChkFlag=="N") && INI.GV_USER_TYPE=="U"){
			var contractID = this.dsContList.getdatabyname(this.dsContList.getpos(),"CONTRACT_ID");
			if( UT.isNull(contractID)){
				TRN.gfnTranDataSetHandle(this.screen , this.dsContID , "NONE" , "CLEAR" ,  "" , "" , "TR_CONTRACT_ID");	
				TRN.gfnCommonTransactionClear(this.screen, "TR_CONTRACT_ID");	//트랜젝션 데이터셋 초기화 (필수)	
				TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_CONTRACT_ID_SEQ" ,"" , "dsContID");	//조회만	
				TRN.gfnCommonTransactionRun(this.screen , "SELECT_CONTRACT_ID_SEQ" , true , false , false , "TR_CONTRACT_ID");
				var newcontractID = this.dsContID.getdatabyname(this.dsContID.getpos(),"SEQ");
				this.dsContList.setdatabyname(this.dsContList.getpos(), "CONTRACT_ID", newcontractID);
			}
	
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsContList.getdatabyname(this.dsContList.getpos(),"CONTRACT_ID");
			objPopupAttData.P_MODE = "W";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1160";
			objPopupAttData.P_REF_NAME = "";
			objPopupAttData.P_DIR_TYPE = "CONT";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
			screen.loadportletpopup("AttFile1160", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		//업체확인 이후 첨부문서 수정불가
		} else {
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsContList.getdatabyname(this.dsContList.getpos(),"CONTRACT_ID");
			objPopupAttData.P_MODE = "R";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1160";
			objPopupAttData.P_REF_NAME = "";
			objPopupAttData.P_DIR_TYPE = "CONT";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "";
			screen.loadportletpopup("AttFile1161", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		}		
	}
	
	// 업체명 Poupup
    if(this.grdContList.getcolumnname(nColumn) == "VENDOR_CODE_POP"){
		if(this.dsContList.getdatabyname(this.dsContList.getpos(),"VENDOR_CHK_FLAG")=="Y"){
			return;
		}
		
		this.grdContList.setcheckedrow(this.grdContList.getselectrow(), true);
		
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
	var iRow = this.dsContList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsContList.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsContList.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
		this.dsContList.setdatabyname(iRow , "BIZ_TYPE" , aryHash["BIZ_TYPE"]);
		this.dsContList.setdatabyname(iRow , "BIZ_TYPE_NAME" , aryHash["BIZ_TYPE_NAME"]);
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
	this.fnSearch();
}

/*
* 행추가
*/
function btnAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdContList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdContList,false,rowCount);
}
/*
* 행삭제
*/
function btnDelRow_on_mouseup(objInst)
{
	var iRow = this.grdContList.getselectrow();
	var vendorChkFlag = this.dsContList.getdatabyname(iRow,"VENDOR_CHK_FLAG");
	if(vendorChkFlag == "Y"){
		UT.alert(screen,"","선택된 데이터는 이미 업체확인이 완료 되어 삭제처리 할 수 없습니다." + "\n" +
		                   "확인바랍니다." );
        return;
	} else {
		GRD.gfnDeleteRow(this.screen,this.grdContList);
	}
}
/*
* 업체확인
*/
function btnVendorChk_on_mouseup(objInst)
{
	if(this.grdContList.getcheckedrowcount() == 0){
        UT.alert(screen,"","해당 데이터를 먼저 선택 바랍니다.");
        return;
    }

	var nCheckedRow = -1 ;
	for(var iRow=0; iRow < this.grdContList.getcheckedrowcount(); iRow++) {
		nCheckedRow = this.grdContList.getcheckedrow(nCheckedRow+1);
		var vendorChkFlag = this.dsContList.getdatabyname(nCheckedRow,"VENDOR_CHK_FLAG");
		if(vendorChkFlag == "Y"){
			UT.alert(screen,"","이미 업체확인 처리 완료된 데이터 입니다." + "\n" +
			                   "확인바랍니다." );
        	return;
		} else {
			var attachYN = this.dsContList.getdatabyname(nCheckedRow,"ATTFILE_YN");
			if(UT.isNull(attachYN) || attachYN == "N"){
				UT.alert(screen,"","선택된 데이터의 문서첨부 내역이 없습니다." + "\n" +
				                   "확인바랍니다." );
	        	return;
			} else {
				this.dsContList.setdatabyname(nCheckedRow,"VENDOR_CHK_FLAG","Y")  ;
			
			    TRN.gfnTranDataSetHandle(this.screen, this.dsContList, "ALL", "NONE", "", "", "TR_VENDOR_CHK");
			    TRN.gfnCommonTransactionClear(this.screen,"TR_VENDOR_CHK");
			    TRN.gfnCommonTransactionAddUpdate(this.screen ,"ProcSmtVendorMapper.UPDATE_CONTRACT_VENDOR_CHK" ,"dsContList");
				TRN.gfnCommonTransactionRun(this.screen , "VendorChkUpdate", true, false, false, "TR_VENDOR_CHK");  		
			}
		}
	}
	
	UT.alert(this.screen , "MSG041" , "처리 완료 되었습니다.");
	
	this.fnSearch();
}
/*
* 효성확인
*/
function btnChk_on_mouseup(objInst)
{
	if(this.grdContList.getcheckedrowcount() == 0){
        UT.alert(screen,"","해당 데이터를 먼저 선택 바랍니다.");
        return;
    }

	var nCheckedRow = -1 ;
	for(var iRow=0; iRow < this.grdContList.getcheckedrowcount(); iRow++) {
		nCheckedRow = this.grdContList.getcheckedrow(nCheckedRow+1);
		var chkFlag = this.dsContList.getdatabyname(nCheckedRow,"CHK_FLAG");
		if(chkFlag == "Y"){
			UT.alert(screen,"","이미 효성확인 처리 완료된 데이터 입니다." + "\n" +
			                   "확인바랍니다." );
        	return;
		} else {
			var vendorChkFlag = this.dsContList.getdatabyname(nCheckedRow,"VENDOR_CHK_FLAG");
			if(UT.isNull(vendorChkFlag) || vendorChkFlag == "N"){
				UT.alert(screen,"","선택된 데이터의 업체확인 내역이 없습니다." + "\n" +
				                   "확인바랍니다." );
	        	return;
			} else {
				this.dsContList.setdatabyname(nCheckedRow,"CHK_FLAG","Y")  ;
			
			    TRN.gfnTranDataSetHandle(this.screen, this.dsContList, "ALL", "NONE", "", "", "TR_CHK");
			    TRN.gfnCommonTransactionClear(this.screen,"TR_CHK");
			    TRN.gfnCommonTransactionAddUpdate(this.screen ,"ProcSmtVendorMapper.UPDATE_CONTRACT_CHK" ,"dsContList");
				TRN.gfnCommonTransactionRun(this.screen , "ChkUpdate", true, false, false, "TR_CHK");  		
			}
		}
	}
	
	UT.alert(this.screen , "MSG041" , "처리 완료 되었습니다.");
	
	this.fnSearch();
}