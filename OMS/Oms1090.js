/*------------------------------------
* program id : Oms1090
* desc	   : 프로젝트 담당자 이관
* dev date   : 2024-01-02
* made by    : YELEE
*-------------------------------------*/
var ouCode;
var authScope;
var readOnlyColor = factory.rgb(247,251,255);

// 등록 화면으로 전달할 파라미터 설정
var objRegExtraData = {
	P_DATA1: "",	      	// 등록 화면으로 전달할 데이터1
	P_DATA2: "",	      	// 등록 화면으로 전달할 데이터2
	P_DATA3: "",	      	// 등록 화면으로 전달할 데이터3
	P_DATA4: "",	      	// 등록 화면으로 전달할 데이터4	
};
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
	this.fnDsSearchSet();   	 //검색조건 세팅	
	this.fnDsSet();              // DATASET 세팅
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
}


/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	this.stdTransferDate.settext(UT.getDate());
	
    ouCode = INI.GV_OU_CODE;
}

/*
* 데이터셋 
*/
function fnDsSet(){
	UT.gfnGetOuCodes(this.dsOU);
	UT.gfnGetCommCodes(this.dsProduct, "O008");	
	UT.gfnGetCommCodes(this.dsCarType, "O018","N");			
	UT.gfnGetCommCodes(this.dsUpdType, "O031");
	UT.gfnGetCommCodes(this.dsOuCountry, "O001");
}

/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화
    this.comOu.setselectedcodeex(ouCode,true,true); 

    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.comOu.setenable( false );
    }

    //내부 사용자인지 확인
    //내부 사용자이면 협력업체 변경 가능
    //협력업체이면 고정
    var userType;
    if( INI.GV_USER_TYPE == "U"){   //유저사용자유형 (내부사용자:U, 외부사용자:V)
	   userType = "INNER"; //INNER: 내부사용자 
    } else{
	   userType = "OUTER"; //INNER: 내부사용자 
    }
    
	// 팀원변경 권한
	// 영업 어드민
    if( INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")){
    	authScope = "DEPT";  

	// 팀원 권한이 없다면, 사용자명에 자신의 아이디로만 검색 가능
	// 영업 일반 사용자 & 영업 조회 사용자
    } else{
		var isUpdateAuth = INI.gfnIsAuthDeptEtc(this.screen,"AT_U");
		
		authScope = "PINFO";		
		UT.gfnHrEditorStyle(this.edtCreatorName, "D");
		
		// 수정 권한이 없다면 이관 불가
		if(!isUpdateAuth) {
			this.btnReset.setvisible(false);
			this.btnTransfer.setvisible(false);
		}
    }
  
	this.dsSearch.setdatabyname(0,"PROJECT_CREATOR_NAME", INI.GV_USER_ID_NM);
	this.dsSearch.setdatabyname(0,"PROJECT_CREATOR_ID", INI.GV_USER_ID);

    UT.gfnHrEditorStyle(this.comOu, "D");

	if(INI.GV_LGI_ID == "admin" && INI.GV_USER_ID == 1) {
		this.txtCustomerId.setvisible(true);
		this.txtCreatorId.setvisible(true);
	}
	
}


/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(this.screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "SELECT") 
	{		
		if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(this.screen , "MSG001" , "검색 결과가 없습니다.");
			return;
		} else {
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	
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
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	var creatorId = this.dsSearch.getdatabyname(0, "PROJECT_CREATOR_ID");
	var creatorName = this.dsSearch.getdatabyname(0, "PROJECT_CREATOR_NAME");
	
	// USER ID가 음수라면, null을 의미
	var isNotValidUserId = creatorId < 0;
		
	if(isNotValidUserId) {
		UT.alert(this.screen, "MSG613" , "담당자를 다시 입력해 주세요.");
		return;
	}
	
	if(!creatorName) {
		UT.alert(this.screen, "MSG004" , "%% 은(는) 필수입력항목입니다." , "프로젝트 담당자" );
		return;
	}
	this.fnSearch();

}


function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
		}
	}
	
	if(messagebox_id == "save_transfer") {
		if(result == XFD_MB_RESYES)  {
			this.fnTransferData();
		}
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



function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{	
    ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
}

/*
* search prop 팝업 로드
*/
function fnTransferSearch_on_click(objInst) {
	var btnName = objInst.xf_create_prop.name;
	
	// 프로젝트 코드
	if(btnName == "btnProjectCodePop") { 	
		this.fnProjectCodePopupCall();
	}
	// 고객명 조회
	else if(btnName == "btnCustomerPop") { 	
		this.btnCustomerPop_on_click(objInst);
	}
	
	// 프로젝트 담당자명 조회
	else if(btnName == "btnCreatorPop") {
		this.btnCreatorPop_on_click(objInst);	
	}
	
	// 유저 조회
	else if(btnName == "btnUpdLoginNoPop") { 
		var strPopupName = UT.gfnGetMetaData("", "프로젝트 담당자");
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		objPopupExtraData.P_DATA4 = "EDIT";
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupUpdLoginNoResponsePopCallback";
		screen.loadportletpopup(strPopupName, "/FRAME/popupCharge", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}	
}



function fnProjectCodePopupCall(projectCode){
	var strPopupName = UT.gfnGetMetaData("LABEL02407", "프로젝트코드");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	objPopupExtraData.P_DATA2 = projectCode;
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupProjectPopCallback";
	screen.loadportletpopup(strPopupName, "/FRAME/popupPrj", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);	
}

/*
* 담당자명 Callback
*/
function fnPopupCreatorResponsePopCallback(aryHash) 
{ 	
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		var iRow = this.dsSearch.getpos();
		this.dsSearch.setdatabyname(iRow , "PROJECT_CREATOR_ID" , aryHash["USER_ID"]);
		this.dsSearch.setdatabyname(iRow , "PROJECT_CREATOR_NAME" ,aryHash["USER_NAME"]);		
	}
}


/*
* Project코드 Callback
*/
function fnPopupProjectPopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , aryHash["PROJECT_CODE"]);
		this.dsSearch.setdatabyname(iRow , "PROJECT_VERSION" , aryHash["PROJECT_VERSION"]);
	}
}


/*
* 고객정보 Callback
*/
function fnPopupCustClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
	}
}



/*
* LoginNo Response Callback
*/
function fnPopupUpdLoginNoResponsePopCallback(aryHash) 
{ 	
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		var iRow = this.dsSearch.getpos();
		
		this.dsUser.setdatabyname(iRow , "UPD_EMP_NO" , aryHash["EMP_NO"]);
		this.dsUser.setdatabyname(iRow , "UPD_OU_CODE" ,aryHash["OU_CODE"]);		
		this.dsUser.setdatabyname(iRow , "UPD_OU_NAME" ,aryHash["OU_NAME"]);
		this.dsUser.setdatabyname(iRow , "UPD_USER_ID" ,aryHash["USER_ID"]);		
		this.dsUser.setdatabyname(iRow , "UPD_USER_NAME" ,aryHash["USER_NAME"]);		
		this.dsUser.setdatabyname(iRow , "UPD_LOGIN_NO" ,aryHash["LOGIN_NO"]);
	}
}



/*
* ds search에 해당하는 모든 데이터를 varams로 엮음
* @param {string} types - "user" | "list"로 나뉨. 
* user는 dsUser, list dsList를 호출하기 위함
*/
function getAllSearchData (types) {	
	var count = this.dsSearch.getcolumncount();
	var columnNamesArr = this.dsSearch.getjson().column_name_arr;
	var vParam = "";
	
	if(types == "list") {
		for(i=0; i<count; i++) {	    
			var colName = columnNamesArr[i];
			var colValue = this.dsSearch.getdatabyname(0, colName);
			
		    if(colValue) {
				vParam += " "+colName + "=" + colValue;
			}
		}
	} else if (types == "user") {
		var userId = this.dsSearch.getdatabyname(0, "PROJECT_CREATOR_ID");
		vParam += "USER_ID="+ userId + " OU_CODE=" + ouCode;
	}
	return vParam;
}

/*
* 미래 이관일을 가진 행은
* 추가 이관 불가.
*/
function fnSetGridCheck() {
	var count = this.dsList.getrowcount();
	
	// 모든 row 선택	
	this.grdList.setheadercheck(0,0,true,true);
	var colCount = this.grdList.getcolumncount() + this.grdList.gethiddencolumncount();
	
	for(i=0; i<count; i++) {	    
		var endDate = this.dsList.getdatabyname(i, "END_DATE");
		
	    if(endDate) {
			GRD.gfnHrGrdCellHandle(this.grdList, i, ["CHK_FLAG"], "D");
			this.grdList.setitemcheck(i, 0, false);
			var disabledBackColor = factory.rgb(245, 245, 245);
			this.grdList.setitembackcolorrange(i,0,i,colCount, disabledBackColor);
		}
	}
	
}


/*
* ds user에 해당하는 이관작업 테이블 데이터
* ds list에 해당하는 대상 프로젝트 데이터 조회
*/
function fnSearch(){	
	var userParam = this.getAllSearchData("user");
	var listParam = this.getAllSearchData("list");
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsUser , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_USER_BY_USER_ID" ,"" , "dsUser", userParam);
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PROJECT_TRANSFER" ,"dsSearch" , "dsList", listParam);
	
	TRN.gfnCommonTransactionRun(this.screen , "USER_SELECT" , true , true , false , "TR_SEARCH");
	
	this.fnSetGridCheck();
}

function ComProductName_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "PRODUCT_CODE" , "");
	return 0;
}


function cboCarType_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "CAR_TYPE_CODE" , "");
	return 0;

}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	var arr = ["PROJECT_CODE", "START_DATE", "PROJECT_CREATOR_ID"];
	var rowObj = GRD.gfnGetCheckedRow(this.screen, this.grdList, "CHK_FLAG", arr);

	if (!rowObj) {
		UT.alert(this.screen, "MSG025", "선택된 행이 없습니다.");
		return; 
	}
	
	var userCnt = this.dsUser.getcolumncount();
	
	var aryDual = ["UPD_LOGIN_NO", "UPD_TYPE", "UPD_DETAILS", "TRANSFER_DATE"];
	var aryCnt = aryDual.length;
	
	for(var i=0; i<userCnt; i++) {
		var colName = this.dsUser.getcolumnid(i);
		
		for(var j=0; j<aryCnt; j++) {
			if(colName == aryDual[j]) {
				var data = this.dsUser.getdatabyname(0, aryDual[j]);
				var desc = this.dsUser.getcolumndesc(i);
		
					if(!data) {
						UT.alert(this.screen, "MSG004" , "%% 은(는) 필수입력항목입니다." , desc);
						return;
				}			
			}
		}	
	}
	return true;
}


/*
* User 데이터셋 이관하기
*/
function fnTransferData() {
	var retCode;
	var retMesg;
	
	TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, null, null, null, null, "TR_PROC");
	TRN.gfnCommonTransactionClear(this.screen,"TR_PROC");
	TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsAuthMapper.DELETE_GEN_KEY_TEMP", null, "dsProcResult");
	TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false,"TR_PROC");
	
	//결과 확인
	retCode = this.dsProcResult.getdatabyname(0, "RETCODE");
	
	if(retCode == "S") {
		TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" , null, null, "TR_SAVE"); //데이터셋 인:ALL 아웃:CLEAR 정의
		TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE");	//트랜젝션 초기화	
		TRN.gfnCommonTransactionAddSave(this.screen , "" , "OmsAuthMapper.INSERT_GEN_KEY_TEMP" , "", "dsList" );
		TRN.gfnCommonTransactionRun(this.screen , "save" , true , true , false , "TR_SAVE");  //트랙잭션 실행	
		
		//결과 확인
		retCode = this.dsProcResult.getdatabyname(0, "RETCODE");
		
		if(retCode == "S") {				
			var updUserId = this.dsUser.getdatabyname(0, "UPD_USER_ID");
			var transferDate = this.dsUser.getdatabyname(0, "TRANSFER_DATE");
			var updType = this.dsUser.getdatabyname(0, "UPD_TYPE");
			var updDetails = this.dsUser.getdatabyname(0, "UPD_DETAILS");
			var updOuCode = this.dsUser.getdatabyname(0, "UPD_OU_CODE");

			var params = "UPD_OU_CODE=" + updOuCode + " UPD_USER_ID=" + updUserId + " TRANSFER_DATE=" + transferDate + " UPD_TYPE=" + updType + " UPD_DETAILS=" +window.btoa(unescape(encodeURIComponent(updDetails)));;
		
			TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, null, null, null, null, "TR_PROC");
			
			TRN.gfnCommonTransactionClear(this.screen, "TR_PROC");	
			
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.CREATE_PROJECT_TRANSFER" ,null, "dsProcResult", params);
			TRN.gfnCommonTransactionRun(this.screen , "SelectProc" , true , true , false, "TR_PROC");
			
			retCode = this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETCODE");
			retMesg = this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG");
						
			if(retCode == "S"){
				UT.alert(this.screen , "MSG357" , "정상적으로 처리 되었습니다.");
				this.fnSearch();
			}else {
			    UT.alert(this.screen , "MSG467" , "오류 발생 : %%", retMesg);
			}
		}
	}	
}


/*
* 이관 버튼 클릭 시 호출
*/
function btnTransfer_on_mouseup(objInst)
{
	var isValid = this.fnValidForm();
	if(!isValid) return; 
	
	UT.confirm(this.screen,"MSG610","이관하시겠습니까?","",0,"save_transfer");	
}


/*
* 초기화
*/
function btnReset_on_mouseup(objInst)
{
	this.dsUser.removeallrows();
	this.dsSearch.removeallrows();
	this.dsList.removeallrows();
	
	this.screen_on_load();
}

function btnCustomerPop_on_click(objInst,searchName){
	var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		objPopupExtraData.P_DATA2 = searchName;
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupCustClosePopCallback";
		screen.loadportletpopup(strPopupName, "/FRAME/popupCust", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

function edtCustomerName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	// 초기화
	this.dsSearch.setdatabyname(0 , "CUSTOMER_ID" , SYSVar.NO_USER_ID);
	
	// Backspace
	if(keycode == 8) {
		this.dsSearch.setdatabyname(0 , "CUSTOMER_ID" , SYSVar.NO_USER_ID);
		return;
	}
	// Enter
	if(keycode==13){   
		var customerName = this.dsSearch.getdatabyname(0, "CUSTOMER_NAME");
		
		if(customerName) {
			this.btnCustomerPop_on_click(objInst, customerName);	
		} else {
			this.dsSearch.setdatabyname(0, "CUSTOMER_ID" , SYSVar.NO_USER_ID);
			this.btnCommonSearch_on_mouseup();
		}
		return;
	}
	return 0;
}

function edtCustomerName_on_changed(objInst, prev_text, curr_text, event_type)
{
	var customerName = this.dsSearch.getdatabyname(0, "CUSTOMER_NAME");
	if(customerName) {		
		this.btnCustomerPop_on_click(objInst, customerName);
	} else {
		this.dsSearch.setdatabyname(0 , "CUSTOMER_ID" , SYSVar.NO_USER_ID);
	}
}

function stdTransferDate_on_changed(objInst, prev_text, curr_text, event_type)
{
	var today = UT.getDate();
	
	if(curr_text && curr_text < today) {
		UT.alert(this.screen , "MSG612" , "과거 일자는 선택할 수 없습니다.");
		this.stdTransferDate.settext(prev_text);
		return;
	};
}

function btnCreatorPop_on_click(objInst, searchName) {
	// 어드민일 경우에만 담당자 조회 가능
	if(authScope == "PINFO"){
		return;
	}

	var strPopupName = UT.gfnGetMetaData("", "프로젝트 담당자");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA6 = authScope;
	objPopupExtraData.P_DATA7 = searchName;
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupCreatorResponsePopCallback";
	
	screen.loadportletpopup(strPopupName, "/FRAME/popupCharge", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

function edtCreatorName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	// 초기화
	this.dsSearch.setdatabyname(0 , "PROJECT_CREATOR_ID" , SYSVar.NO_USER_ID);
	
	// Backspace
	if(keycode == 8) {
		this.dsSearch.setdatabyname(0 , "PROJECT_CREATOR_ID" , SYSVar.NO_USER_ID);
		return;
	}
	
	// Enter
	if(keycode==13){   
		var chargeName = this.dsSearch.getdatabyname(0, "PROJECT_CREATOR_NAME");
		
		if(chargeName) {
			this.btnCreatorPop_on_click(objInst, chargeName);		
		} else {
			UT.gfnHrEditorStyle(this.rbPrev, "D");	
			UT.gfnHrEditorStyle(this.rbCur, "D");	
			this.dsSearch.setdatabyname(0, "PROJECT_CREATOR_ID" , SYSVar.NO_USER_ID);
			this.btnCommonSearch_on_mouseup();
		}
		return;
	}
	return 0;
}

function edtCreatorName_on_changed(objInst, prev_text, curr_text, event_type)
{
	var chargeName = this.dsSearch.getdatabyname(0, "PROJECT_CREATOR_NAME");
	
	if(!chargeName) {
		UT.gfnHrEditorStyle(this.rbPrev, "D");	
		UT.gfnHrEditorStyle(this.rbCur, "D");	
		
		this.dsSearch.setdatabyname(0 , "PROJECT_CREATOR_ID" , SYSVar.NO_USER_ID);
	}
	// event_type == 5 : 타이핑에 의한 on change만 작동
	else if(chargeName && event_type == 5) {
		this.btnCreatorPop_on_click(objInst, chargeName);
		UT.gfnHrEditorStyle(this.rbPrev, "G");	
		UT.gfnHrEditorStyle(this.rbCur, "G");
	};
}


function grdList_on_filtercomplete(objInst)
{
	var rowCount = this.grdList.getrowcount();
	var dataRows = objInst.xf_data_row_arr;
	
	for(var i=0; i<rowCount; i++) {
		var isFiltered = dataRows[i].is_filtered_row;
		var filterFlag = isFiltered ? "N" : "Y";
		
		this.dsList.setdatabyname(i, "FILTER_FLAG" , filterFlag);	
	}
}

function edtProjectCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var prjCode = this.dsSearch.getdatabyname(0, "PROJECT_CODE");
	
	// Enter
	if(keycode==13){   
		if(prjCode) {
			this.edtProjectCode_on_changed(objInst);	
		} else {
			this.btnCommonSearch_on_mouseup();	
		}	
	} 
	return 0;
}

function edtProjectCode_on_changed(objInst, prev_text, curr_text, event_type)
{
	var prjCode = this.dsSearch.getdatabyname(0, "PROJECT_CODE");
	
	if(prjCode) {		
		this.fnProjectCodePopupCall(prjCode);
	} 
}