/*------------------------------------
* program id : SmtSet2010
* desc	   : 고객정보관리
* dev date   : 2023-05-18
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
	UT.gfnGetCommCodes(this.dsCustGroup, "O014");	   // 고객그룹
	UT.gfnGetCommCodes(this.dsDivInOut, "F008");		// 국내/해외구분
	UT.gfnGetCommCodes(this.dsNationCode, "O005");	  // 국가코드
	
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
//	//계약일자set
//	this.dtpContDateF.settext( UT.getDate("%Y") + "0101" );
//	this.dtpContDateT.settext( UT.getDate("%Y%M%D"));
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
	
	if(recv_userheader == "selectCustList")
	{		
		if(this.dsCustList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsCustList.getrowcount());	//하단메세지 처리
			
			var aryColumn = ["TAX_REG_NUMBER"];
			for(var i=0;i<this.dsCustList.getrowcount();i++){
				if( !UT.isNull(this.dsCustList.getdatabyname(i,"ERP_CUSTOMER_ID")) || !UT.isNull(this.dsCustList.getdatabyname(i,"ERP_CUSTOMER_NAME")) ){
					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
				} else {
					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "G");
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
* 고객관리 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsCustList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_CUSTOMER" ,"dsSearch" , "dsCustList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectCustList" , true , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	var aryDual = ["CUSTOMER_NAME" ,"DIV_IN_OUT"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return false;
	}
	
	//그리드에서 중복확인
	var arr = ["CUSTOMER_NAME"];
	var dupResult = GRD.gfnGrdDuplicateCheck(this.screen, this.grdList, arr);
	if (dupResult) {
		UT.alert(this.screen, "MSG358", "중복된 데이타가 존재합니다"); 
		return false;
	}
	
	return true;
}
/*
* 저장
*/
function fnSaveData(alertshow){
	
	var rCnt = this.dsCustList.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var ouCode = this.dsCustList.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsCustList.setdatabyname(iRow, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") );
		}
		var customer_id = this.dsCustList.getdatabyname(iRow,"CUSTOMER_ID");
		if( UT.isNull(customer_id)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsCustID , "NONE" , "CLEAR" ,  "" , "" , "TR_CUSTOMER_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_CUSTOMER_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_CUSTOMER_ID_SEQ" ,"" , "dsCustID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_CUSTOMER_ID_SEQ" , true , false , false , "TR_CUSTOMER_ID");
			var newcontract_id = this.dsCustID.getdatabyname(this.dsCustID.getpos(),"SEQ");
			this.dsCustList.setdatabyname(iRow, "CUSTOMER_ID", newcontract_id);
		}
		
		//신규입력, 해외고객, 사업자번호 없을 경우 seq set
		if(this.dsCustList.getrowoperation(iRow) == XFD_ROWOP_INSERT){
			var divInOut = this.dsCustList.getdatabyname(iRow,"DIV_IN_OUT");
			var taxRegNum = this.dsCustList.getdatabyname(iRow,"TAX_REG_NUMBER");
			var strSequence = "";
			if( divInOut == "2" && UT.isNull(taxRegNum)){
				var strInObjScnCd = "CUST";
				var strAppendWord = "000-99-";
				strSequence = UT.gfnGetSequence(strInObjScnCd , "" , strAppendWord , strAppendWord.length + 5 );	//시퀀스 가져오기
			}
			this.dsCustList.setdatabyname(iRow, "TAX_REG_NUMBER", strSequence);	
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsCustList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsSmtMapper.INSERT_SMT_CUSTOMER" , "OmsSmtMapper.UPDATE_SMT_CUSTOMER" , "OmsSmtMapper.DELETE_SMT_CUSTOMER" , "dsCustList" );					// 추가 수정
	
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

function edtCustName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
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

/*
* 행추가
*/
function btnAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,rowCount);
}

function grdList_on_columnmouseout(objInst, nColumn, bHeader)
{
	if(this.grdList.getcolumnname(nColumn) == "DIV_IN_OUT" || this.grdList.getcolumnname(nColumn) == "CUSTOMER_NAME"){
		//해외선택의 경우 사업자등록번호 입력안됨.
		var iCell = this.grdList.getcolumn("TAX_REG_NUMBER");
		var iRow = this.grdList.getselectrow();
		if(this.dsCustList.getdatabyname(this.dsCustList.getpos(),"DIV_IN_OUT") == "2") {
			this.grdList.setitemeditable(iRow, iCell, false);
			this.grdList.setitembackcolor(iRow, iCell, factory.rgb(247,251,255));
		} else {
			this.grdList.setitemeditable(iRow, iCell, true);
			this.grdList.setitembackcolor(iRow, iCell, factory.rgb(255,255,255));
		}
	}
}

function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	if(this.grdList.getcolumnname(nColumn) == "TAX_REG_NUMBER"){
		//해외선택의 경우 사업자등록번호 입력안됨.
		var iCell = this.grdList.getcolumn("TAX_REG_NUMBER");
		var iRow = this.grdList.getselectrow();
		if(this.dsCustList.getdatabyname(this.dsCustList.getpos(),"DIV_IN_OUT") == "2") {
			this.grdList.setitemeditable(iRow, iCell, false);
			this.grdList.setitembackcolor(iRow, iCell, factory.rgb(247,251,255));
		} else {
			this.grdList.setitemeditable(iRow, iCell, true);
			this.grdList.setitembackcolor(iRow, iCell, factory.rgb(255,255,255));
		}
	}
}