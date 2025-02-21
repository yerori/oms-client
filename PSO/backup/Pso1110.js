/*------------------------------------
* program id : Pso1110
* desc	   : PSO 서류 담당자 이관
* dev date   : 2025-01-02
* made by    : YELEE
*-------------------------------------*/
var ouCode;
var authScope;

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
	this.fnDsSearchSet();   //검색조건 세팅	
	this.fnGetDeptCode();
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
* 주관부서 코드를 로드합니다
*/
function fnGetDeptCode(){
	var params = " OU_CODE=" + ouCode;
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoDept , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_DEPT_CODE");
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_DEPT_CODE");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DELAY_DEPT" , "" , "dsPsoDept" , params);
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadDept" , true , false , false , "TR_SELECT_DEPT_CODE");	

	UT.gfnTranceCodeSet(this.dsPsoDept, "N");
}

/*
* 데이터셋 
*/
function fnDsSet(){
	UT.gfnGetOuCodes(this.dsOU);		
	UT.gfnGetCommCodes(this.dsUpdType, "O031");
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
	// PM 어드민
    if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP")){
    	authScope = "EMP";  
		
		
	// 팀원 권한이 없다면, 사용자명에 자신의 아이디로만 검색 가능
	// PM 일반 사용자
    } else{
		authScope = "PINFO";
		UT.gfnHrEditorStyle(this.edtChargeUserName, "D");
    }  

	this.dsSearch.setdatabyname(0,"PSO_CHARGE_USER_NAME", INI.GV_USER_ID_NM);
	this.dsSearch.setdatabyname(0,"PSO_CHARGE_USER_ID", INI.GV_USER_ID);
	this.dsSearch.setdatabyname(0,"PSO_CHARGE_EMP_NO", INI.GV_EMP_NO);
		

    UT.gfnHrEditorStyle(this.comOu, "D");
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
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리
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
	var chargeUserName = 	this.dsSearch.getdatabyname(0, "PSO_CHARGE_USER_NAME");
	if(!chargeUserName) {
		UT.alert(this.screen, "MSG004" , "%% 은(는) 필수입력항목입니다." , "PSO 서류 담당자" );
		return;
	}
	
	this.fnSearch();

}


function screen_on_messagebox(messagebox_id, result)
{
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



function grdMaster_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick)
{
	this.btnView_on_mouseup();
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
	
	
	// 프로젝트 조회
	if(btnName == "btnProjectCodePop") { 	
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		objPopupExtraData.P_DATA3 = "Y";
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnProjectCodeClosePopCallback";
		screen.loadportletpopup("ProjectCodeSelect", "/PSO/Pso1051", strPopupName, false, 0, 0, 0, 1130, 440, true, true, false, objPopupExtraData);
	}

	// PSO 담당자명 조회
	else if(btnName == "btnChargeUserPop" || btnName == "btnUpdLoginNoPop" ) { 	
		
		// 어드민일 경우에만 담당자 조회 가능
		if(btnName == "btnChargeUserPop" && authScope == "PINFO"){
			return;
		}
		var resFuncName;
		
		if(btnName == "btnChargeUserPop") {
			resFuncName = "fnPopupPSOResponsePopCallback"
		}  else if (btnName == "btnUpdLoginNoPop") {
			resFuncName = "fnPopupUpdLoginNoResponsePopCallback"
		}
		
		var strPopupName = UT.gfnGetMetaData("", "PSO 서류관리 담당자 조회");
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		objPopupExtraData.P_DATA6 = authScope;	  //권한
		objPopupExtraData.RETURN_FUNCTION_NAME = resFuncName;
		screen.loadportletpopup(strPopupName, "/FRAME/popupEmpUser", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
		
	}	
	
}


/*
* Project코드 Callback
*/
function fnProjectCodeClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , aryHash["PROJECT_CODE"]);
		this.dsSearch.setdatabyname(iRow , "PSO_PROJECT_ID" , aryHash["PSO_PROJECT_ID"]);
		this.dsSearch.setdatabyname(iRow , "PSO_DOCU_ID" , aryHash["PSO_DOCU_ID"]);
		this.btnCommonSearch_on_mouseup();
	} else {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , "");
		this.dsSearch.setdatabyname(iRow , "PSO_PROJECT_ID" , "");
		this.dsSearch.setdatabyname(iRow , "PSO_DOCU_ID" , "");
	}
}

/*
* 담당자 Response Callback
*/
function fnPopupPSOResponsePopCallback(aryHash) 
{ 	
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		var iRow = this.dsSearch.getpos();
		
		this.dsSearch.setdatabyname(iRow , "PSO_CHARGE_USER_ID" , aryHash["USER_ID"]);
		this.dsSearch.setdatabyname(iRow , "PSO_CHARGE_EMP_NO" , aryHash["EMP_NO"]);
		this.dsSearch.setdatabyname(iRow , "PSO_CHARGE_USER_NAME" ,aryHash["EMP_NAME"]);		
	
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
		this.dsUser.setdatabyname(iRow , "UPD_USER_NAME" ,aryHash["EMP_NAME"]);		
		this.dsUser.setdatabyname(iRow , "UPD_LOGIN_NO" ,aryHash["LOGIN_NO"]);
	}
	
	if(!aryHash["USER_ID"]) {
		this.omsUserStatus.setvisible(true);
		this.omsUserStatus.settext(aryHash["EMP_NAME"] + " 담당자는 OMS에 등록된 유저가 아닙니다. 회원가입이 필요합니다.");
	}
	else {
		this.omsUserStatus.setvisible(false);
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
		var userId = this.dsSearch.getdatabyname(0, "PSO_CHARGE_USER_ID");
		var empNo = this.dsSearch.getdatabyname(0, "PSO_CHARGE_EMP_NO");
		
		vParam += "OU_CODE=" + ouCode + " USER_ID="+ userId + " EMP_NO=" + empNo;
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
	
	for(i=0; i<count; i++) {	    
		var endDate = this.dsList.getdatabyname(i, "END_DATE");
		
	    if(endDate) {
			GRD.gfnHrGrdCellHandle(this.grdList, i, ["CHK_FLAG"], "D");
			this.grdList.setitemcheck(i, 0, false);
		}
	}
	
}


/*
* ds user에 해당하는 이관작업 테이블 데이터
* ds list에 해당하는 대상 pso 데이터 조회
*/
function fnSearch(){	
	var userParam = this.getAllSearchData("user");
	var listParam = this.getAllSearchData("list");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsUser , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
		
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_HRM_USER_BY_USER_ID" ,"" , "dsUser", userParam);
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_PROJECT_DOCU_LINE_TRANSFER" ,"dsSearch" , "dsList", listParam);
	
	TRN.gfnCommonTransactionRun(this.screen , "USER_SELECT" , true , true , false , "TR_SEARCH");
	this.fnSetGridCheck();
}



function ComProductName_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "PRODUCT_CODE" , "");
	return 0;
}



/*
* 검색바 properties keydown 이벤트
*/
function transferSearch_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    
		this.btnCommonSearch_on_mouseup();
	}
	return;
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
	var arr = ["START_DATE", "PSO_CHARGE_USER_ID"];
	var rowObj = GRD.gfnGetCheckedRow(this.screen, this.grdList, "CHK_FLAG", arr);

	if (!rowObj) {
		UT.alert(this.screen, "MSG025", "선택된 행이 없습니다.");
		return; 
	}
	
	var userCnt = this.dsUser.getcolumncount();
	
	var aryDual = [ "UPD_TYPE", "UPD_DETAILS", "TRANSFER_DATE"];
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
			var updEmpNo = this.dsUser.getdatabyname(0, "UPD_EMP_NO");
			var transferDate = this.dsUser.getdatabyname(0, "TRANSFER_DATE");
			var updType = this.dsUser.getdatabyname(0, "UPD_TYPE");
			var updDetails = this.dsUser.getdatabyname(0, "UPD_DETAILS");
			var updOuCode = this.dsUser.getdatabyname(0, "UPD_OU_CODE");
			
			var params = "UPD_OU_CODE=" + updOuCode + " UPD_USER_ID=" + updUserId +  " UPD_EMP_NO=" + updEmpNo + " TRANSFER_DATE=" + transferDate + " UPD_TYPE=" + updType + " UPD_DETAILS=" + window.btoa(unescape(encodeURIComponent(updDetails)));
						
			TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, null, null, null, null, "TR_PROC");
			TRN.gfnCommonTransactionClear(this.screen, "TR_PROC");	
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.CREATE_PSO_DOCU_LINE_TRANSFER" , null, "dsProcResult", params);
			TRN.gfnCommonTransactionRun(this.screen , "SelectProc" , true , false , false, "TR_PROC");
			
			//결과 확인
			retCode = this.dsProcResult.getdatabyname(0, "RETCODE");
			retMesg = this.dsProcResult.getdatabyname(0, "RETMESG");
			
			if(retCode == "S"){
				UT.alert(this.screen , "MSG357" , "정상적으로 처리 되었습니다.");
				this.fnSearch();
				this.omsUserStatus.setvisible(false);
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

/*
* PROJECT_CODE 기준으로 
* 중복되는 셀은 모두 선택되게 설정
*/
function grdList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	var targetCode= this.dsList.getdatabyname(nCurSelectRow, "PROJECT_CODE");
	var count = this.dsList.getrowcount();
	
	for(var i=0; i<count; i++) {
		var projectCode = this.dsList.getdatabyname(i, "PROJECT_CODE");
		var flag = this.dsList.getdatabyname(i, "DUPLICATE_FLAG");
		
		if(targetCode == projectCode && flag == "Y") {
			this.grdList.setselectrow(i, false, false);
		}
	};
}