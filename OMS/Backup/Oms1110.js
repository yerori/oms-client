/*------------------------------------
* program id : Oms1110
* desc	   : RFQ 등록
* dev date   : 2023-06-07
* made by    : SEYUN
*-------------------------------------*/
var ouCode;
var authScope;
var fvSelectedRow;	//그리드 선택된 row
var authScope;
var readOnlyColor = factory.rgb(247,251,255);
var selectedDataSet;

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
	this.fnDsSet();              // DATASET 세팅
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
	this.btnCommonSearch_on_mouseup();
}



/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	
    ouCode = INI.GV_OU_CODE;
}
/*
* 데이터셋 
*/
function fnDsSet(){
	UT.gfnGetOuCodes(this.dsOU);	// ou code set
	UT.gfnGetCommCodes(this.dsCarType, "O018");		   // 차종
	UT.gfnGetCommCodes(this.dsProduct, "O008");				
}



/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화
    this.comOu.setselectedcodeex(ouCode,true,true); 

//    this.fldLatestDegree.settext("Y"); 
 
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

    
    //사용자 변경권한 
    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
        authScope = "DEPT";
    } else {
        if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
	    	authScope = "EMP";  
//	        this.comSite.setenable( false );
 //         this.fldDeptName.setenable(false);
 //           this.btnDeptPop.setvisible(false);
	    } else{
        	authScope = "PINFO";
             //개인권한은 수정할 수 없도록 막음
//	        this.comSite.setenable( false );
/*            this.fldDeptName.setenable(false);
            this.btnDeptPop.setvisible(false);
            this.fldEmpName.setenable(false);
            this.btnEmpNamePop.setvisible(false);
            this.fldEmpNo.setenable(false);
            this.btnEmpNoPop.setvisible(false); */
        }  

   }
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
		this.grdList.setselectrow(0);
		this.grdList_on_itemselchange();		
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
	this.fnSearch();
}


function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
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

/*
* 업체정보 Callback
*/
function fnVendorClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
	}else {
        this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , "");
        this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , "");	
    }
}

function btnVendorPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"VENDOR_NAME");
	objPopupExtraData.P_DATA6 = authScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorClosePopCallback";
	screen.loadportletpopup("VendorNameSelect", "/FRAME/popupVendor", "협력업체정보조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

/*
* 기준날짜에서 nDayGap일만큼 지난 년월일을 8자리 년월일 형태로 반환한다.
* strDate : (string) YYYYMMDD 형태의 날짜 strDate 기준 날짜 년월일
* nDayGap : (int) YYYYMMDD 형태의 날짜 nDayGap 현재일을 기준으로 날 차이, 음수는 이전 날자
* [return] => (string) 계산된 년월일(YYYY-MM-DD)
*/
function fnGetDateByDayGap(strDate, nDayGap)
{
	try {
		if(UT.gfnIsYYYYMMDD(strDate) == false) {
			return "";
		}

		nDayGap = parseInt(nDayGap, 10);
		var strOp = "+";
		if(nDayGap < 0) {
			strOp = "-";
		}

		var nYYYY = parseInt(strDate.substr(0, 4), 10);
		var nMM = parseInt(strDate.substr(4, 2), 10) - 1;
		var nDD = parseInt(strDate.substr(6, 2), 10);
		
		var objTempDate = new Date(nYYYY, nMM, nDD);
		
		objTempDate.setDate(eval(objTempDate.getDate() + strOp + Math.abs(nDayGap)));

		var nCalcYYYY = objTempDate.getFullYear(); 	//연도 가져오기
		
		//달 가져오기 달은 0부터 11까지이므로 1을 더한다
		var nCalcMM = objTempDate.getMonth() + 1; 

		nCalcMM = nCalcMM < 10 ? UT.gfnLpad("" + nCalcMM, "0" , 2) : nCalcMM; 	// 달이 10보다 적으면 앞에 0 붙이기
		
		var nCalcDD = objTempDate.getDate(); //날짜 가져오기
		nCalcDD = nCalcDD < 10 ? UT.gfnLpad("" + nCalcDD, "0" , 2) : nCalcDD; 	// 날짜가 10보다 작으면 앞에 0 붙이기

		var strCalcDate = nCalcYYYY.toString(10)+"-" + nCalcMM.toString(10)+"-"+ nCalcDD.toString(10); 
		return strCalcDate; 
	}
	catch(EXCEP) {
		return "";
	}
}

function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{	
    ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	//UT.gfnGetUserSiteCodes(this.dsSite,ouCode,INI.GV_USER_ID);	
    //  this.comSite.setselectedindex(0);   	
}



function btnCopy_on_mouseup(objInst)
{
	//선택여부 검사
    if( this.grdList.getcheckedrowcount() <= 0 ){
		UT.alert(this.screen , "MSG025" , "선택된 행이 없습니다." );
		return;
    }	
	var nCheckedRow = this.grdList.getcheckedrow(0);
	//프로젝트 복사 POPUP
	var strPopupName = UT.gfnGetMetaData("LABEL02392", "프로젝트 복사");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsList.getdatabyname(nCheckedRow,"OU_CODE");
	objPopupExtraData.P_DATA2 = this.dsList.getdatabyname(nCheckedRow,"PROJECT_CODE");
	objPopupExtraData.P_DATA3 = this.dsList.getdatabyname(nCheckedRow,"");
	objPopupExtraData.P_DATA4 = this.dsList.getdatabyname(nCheckedRow,"");
	objPopupExtraData.P_DATA6 = authScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnCopyPopCallback";
	screen.loadportletpopup(strPopupName, "/OMS/Oms1011", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

function fnCopyPopCallback(aryHash) 
{ 
   this.btnCommonSearch_on_mouseup();
	
}

function btnCustomerPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupCustClosePopCallback";
	screen.loadportletpopup(strPopupName, "/FRAME/popupCust", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	
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

function edtCustomerName_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "CUSTOMER_ID" , "");
	return 0;
}


/*
* 고객정보 Callback
*/
function fnPopupCustClosePopCallback2(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsList.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
		this.dsList.setdatabyname(iRow , "CUSTOMER_GROUP_NAME" , aryHash["CUSTOMER_GROUP_NAME"]);
		this.dsList.setdatabyname(iRow , "ERP_CUSTOMER_ID" , aryHash["ERP_CUSTOMER_ID"]);
		this.dsList.setdatabyname(iRow , "ERP_CUSTOMER_NAME" , aryHash["ERP_CUSTOMER_NAME"]);
	}
}

/*
* RFQ Response Callback
*/
function fnPopupRFQResponsePopCallback(aryHash) 
{ 	
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		if(selectedDataSet == "dsList") {
			var iRow = this.dsList.getpos();
			this.dsList.setdatabyname(iRow , "CHARGE_USER_ID" , aryHash["USER_ID"]);
			this.dsList.setdatabyname(iRow , "CHARGE_USER_NAME" ,aryHash["USER_NAME"]);	
		}
		else if(selectedDataSet == "dsAuthList") {
			var iRow = this.dsAuthList.getpos();
			this.dsAuthList.setdatabyname(iRow , "CHARGE_USER_ID" , aryHash["USER_ID"]);
			this.dsAuthList.setdatabyname(iRow , "CHARGE_USER_NAME" ,aryHash["USER_NAME"]);	
		}
		
	}
}

/*
* 첨부파일 Callback
*/
function fnAttFilePopCallback(aryHash) 
{ 
	// 재조회
	this.fnSearch();
}

/*
* 리스트 행 추가
*/
function btnAddRow_on_mouseup(objInst)
{
	var rowCount = this.dsList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,rowCount);
	this.dsList.setdatabyname(rowCount , "OU_CODE" , ouCode);	
	
}

function btnDelRow_on_mouseup(objInst)
{
	//프로젝트가 등록되었으면 수정불가
	var projectCount = this.dsList.getdatabyname(this.dsList.getpos(),"PROJECT_COUNT");
	
	if (projectCount < 1) {
		UT.alert(this.screen, "MSG022", "삭제할 수 없습니다.");
		return;
	}

	GRD.gfnDeleteRow(this.screen,this.grdList);
}


/*
* String -> Date형 으로 변
*/
function parseDateFromString(dateString) {
	
	var regex = /^\d{4}-\d{2}-\d{2}$/;
	
	if (regex.test(dateString)) {
		return new Date(dateString);
	}
	// 문자열에서 연도, 월, 일을 분리
	var year = dateString.substring(0, 4);
	var month = dateString.substring(4, 6);
	var day = dateString.substring(6, 8);
	
	var nextDate = regex.test(dateString) ? dateString : (year, month - 1, day);
	
	// Date 객체로 변환 (월은 0부터 시작하므로 -1 처리)
	return new Date(year, month - 1, day);
}



/*
* 기간 중복 검사
*/
function fnCheckDateOverlap()
{
	var rowCount = this.grdAuthList.getrowcount();
			
	for(i=0; i<rowCount; i++) {
		var cur_start_date = this.dsAuthList.getdatabyname(i, "START_DATE");
		var cur_end_date = this.dsAuthList.getdatabyname(i, "END_DATE") || "9999-12-31";
		
		if(cur_start_date >= cur_end_date) {
			UT.alert(this.screen, "MSG161", "시작일이 종료일보다 크거나 같을 수 없습니다.");
			return;	
		}
		
		for(j=i+1; j<rowCount; j++) {
			var next_start_date = this.dsAuthList.getdatabyname(j, "START_DATE");
			var next_end_date = this.dsAuthList.getdatabyname(j, "END_DATE") || "9999-12-31";
			
			var isPeriodNotOverlapping = cur_start_date > next_end_date || cur_end_date < next_start_date;
			
			var isOverlapped =  !isPeriodNotOverlapping;
			
			if(isOverlapped) {
				UT.alert(this.screen, "MSG609", "기간 내 중복 데이터가 있습니다.");
				return;	
			}
		}
	}
	return true;
}


/*
* 데이터 수정 전, 필수값과 중복값 체크
*/
function btnCommonSave_on_mouseup(objInst)
{
	if(this.fnValidForm() && this.fnCheckDateOverlap()){
		UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
	}
	return false;	
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	var aryDual = [ "CUSTOMER_NAME", "CAR_TYPE_NAME","PRODUCT_NAME", "RFQ_DATE", "CHARGE_USER_NAME"];
	var aryAuthDual = ["START_DATE", "RFQ_CODE", "CHARGE_USER_NAME"]; 
		
	var isGridFilled = !!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false);
	var isAuthGridFilled = !!UT.gfnVaildataionGrd(this.screen,this.grdAuthList, aryAuthDual, false);
	
	if(isGridFilled && isAuthGridFilled) {
		return true;	
	}
	return false;
}

function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsRfqMapper.SELECT_RFQ" ,"dsSearch" , "dsList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , false , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
	//## 2023-11-05 Added by Youngho.Kang
	//읽기전용 컬럼 지정
	for(var i=0; i<this.dsList.getrowcount(); i++){
		//프로젝트가 등록되었으면 수정불가
		var projectCount = this.dsList.getdatabyname(i,"PROJECT_COUNT");
		if (projectCount > 0) {
			aryColumn = ["CAR_TYPE_NAME", "PRODUCT_NAME", "OEM", "RFQ_DATE"];
			GRD.gfnGrdCellHandle(this.grdList , i , aryColumn , "editable" , false);
			GRD.gfnGrdCellHandle(this.grdList , i , aryColumn , "backcolor" , readOnlyColor);
		}
	}
	//// 2023-11-05 Added end
}

/*
* 저장
*/
function fnSaveData(alertshow){
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}	
	
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsRfqMapper.INSERT_RFQ" , "OmsRfqMapper.UPDATE_RFQ" , "OmsRfqMapper.DELETE_RFQ", "dsList" );
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	
}


function ComProductName_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "PRODUCT_NAME_CODE" , "");
	return 0;
}



/*
* 기준일자
*/
function stdDate_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return;
}


/*
* RFQ 코드
*/
function edtRfqCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return;
}


	
function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// 고객명 Poupup
    if(this.grdList.getcolumnname(nColumn) == "CUSTOMER_POPUP"){
		//프로젝트가 등록되었으면 수정불가
		var projectCount = this.dsList.getdatabyname(this.dsList.getpos(),"PROJECT_COUNT");
		
		if (projectCount > 0) {
			return;
		}
		var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupCustClosePopCallback2";
		screen.loadportletpopup(strPopupName, "/FRAME/popupCust", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
		
	}
	
	// 첨부 Poupup
    if(this.grdList.getcolumnname(nColumn) == "ATT_YN_POPUP"){
       var refCode = this.dsList.getdatabyname(this.dsList.getpos(),"RFQ_CODE");
       if(UT.isNull( refCode)){
	        UT.alert(this.screen , "MSG561" , "저장 후 첨부가 가능합니다. 먼저 저장하세요." );
			return;
	    }

		var strPopupName = UT.gfnGetMetaData("LABEL02589", "첨부");
		objPopupAttData.clear();
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = "";
		objPopupAttData.P_MODE = "W";
		objPopupAttData.P_FILE_GUBUN = "Oms1110";
		objPopupAttData.P_REF_NAME = this.dsList.getdatabyname(this.dsList.getpos(),"RFQ_CODE");
		objPopupAttData.P_DIR_TYPE = "RFQ";
		objPopupAttData.P_OU_CODE = this.dsList.getdatabyname(this.dsList.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
		screen.loadportletpopup("AttFileQcmStd001", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
	}
}


// RFQ 담당자 Poupup
function grdAuthList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	var grdName = objInst.xf_create_prop.name;
	selectedDataSet = objInst.xdataset_id;
	
	//프로젝트가 등록되었으면 수정불가
	var projectCount = this.dsList.getdatabyname(this.dsList.getpos(),"PROJECT_COUNT");

	
	//RFQ_CHARGE_POPUP
	if (grdName == "grdList" && projectCount > 0) {
		return;
	}
	
	var strPopupName = UT.gfnGetMetaData("LABEL02377", "RFQ response");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupRFQResponsePopCallback";
	
	screen.loadportletpopup(strPopupName, "/FRAME/popupCharge", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

function grdList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	this.grdList.setcheckedrow(nCurSelectRow, true);
	
	//권한 가져오기 
	var rfqCode = this.dsList.getdatabyname(this.dsList.getpos(),"RFQ_CODE");
	var ouCode = this.dsList.getdatabyname(this.dsList.getpos(),"OU_CODE");
	
    var params = "OU_CODE="+ ouCode+" RFQ_CODE="+rfqCode;
   
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuthList, "NONE" , "CLEAR" ,  "" , "" , "TR_AUTH");
	TRN.gfnCommonTransactionClear(this.screen , "TR_AUTH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsRfqMapper.SELECT_RFQ_AUTH" , "" , "dsAuthList", params);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_RFQ_AUTH" , true , true , false , "TR_AUTH");
	
}