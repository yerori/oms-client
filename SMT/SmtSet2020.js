/*------------------------------------
* program id : Smt2020
* desc	   : 메일발송 목록
* dev date   : 2024-09-24
* made by    : YELEE
*-------------------------------------*/
var ouCode;
var authScope;
var authScope;
var mailCode;
var preRowIndex;


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

/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.init(this.screen);	  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();			// 검색조건 세팅	
	this.fnDsSet();				  // 데이터셋 세팅
    this.fnSetInitControl();     	// 초기 컨트롤 속성 설정	
	this.fnSearch();
	this.fnGetDetailComboData();	 // 상세보기 그리드 콤보박스 데이터 로드

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
	   this.comOu.setenable(false);
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
	    } else{
        	authScope = "PINFO";
        }  
   }
    UT.gfnHrEditorStyle(this.comOu, "D");
}


/*
* 메일 상세 정보 가져오기.
* DB조회
*/
function fnDetailData(){	
	var vParam = "";
	mailCode = this.dsList.getdatabyname(this.dsList.getpos(), "MAIL_CODE");
	vParam += " OU_CODE=" + ouCode;
    vParam += " MAIL_CODE=" + mailCode;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetailList , "NONE" , "CLEAR" ,  "" , "" , "TR_DETAIL_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_DETAIL_INFO");
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_MAIL_DETAILS" ,"" , "dsDetailList", vParam);	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL" , true , false  , false , "TR_DETAIL_INFO");
}


/*
* 메일 상세 정보 내 콤보박스 CODE, NAME값 가져오기.
* DB조회
*/
function fnGetDetailComboData() {
	//  수신대상 데이터 가져오기
	TRN.gfnTranDataSetHandle(this.screen , this.dsRecipient , "NONE" , "CLEAR" ,  "" , "" , "TRANSACTION_RECIPIENT");	
	TRN.gfnCommonTransactionClear(this.screen, "TRANSACTION_RECIPIENT");
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_RECIPIENT" ,"" , "dsRecipient");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL_RECIPIENT" , true , true , false , "TRANSACTION_RECIPIENT");
	
	//  참조1 데이터 가져오기
	TRN.gfnTranDataSetHandle(this.screen , this.dsRef_1 , "NONE" , "CLEAR" ,  "" , "" , "TRANSACITON_REF_1");
	TRN.gfnCommonTransactionClear(this.screen, "TRANSACITON_REF_1");
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_REF_1" ,"" , "dsRef_1");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL_REF_1" , true , true , true , "TRANSACITON_REF_1");
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
		this.grdMailList.setselectrow(0);
	}
	
	if(recv_userheader == "save")
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
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
	var isEdited = this.grdMailDetailList.getrowoperation(this.dsDetailList.getpos()) != XFD_ROWOP_NONE;
	
	
	if(isEdited) {
		UT.confirm(this.screen,"MSG607", "변경된 데이터가 존재합니다.<br/>계속 하시겠습니까?", "",0, "save_confirm");
	}else {
		this.fnSearch();	
	}
}

/*
* 데이터 수정 전, 필수값과 중복값 체크
*/
function checkValidation () {
	if(this.fnValidForm() && this.fnCheckDateOverlap()){
		return true;	
	}
	return false;	
}

function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
		}
	}
	
	if(messagebox_id == "delete_confirm") {
		if(result == XFD_MB_RESYES) {
			this.fnDeleteData();
		}
	}
	
	if(messagebox_id == "pre_save_confirm") {
		// YES라면
		if(result == XFD_MB_RESYES) {
			this.fnSaveData("","save");
			this.fnDetailData();
	
		// NO라면
		} else {
			this.grdMailList.setselectrow(preRowIndex, false);
		}
	}
	
	if(messagebox_id == "close_confirm") {
		// YES라면
		if(result == XFD_MB_RESYES) {
			this.fnSaveData("","save");
			
		} else {
			INI.gfnMdiTabClose();		
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
	var isEdited = this.grdMailDetailList.getrowoperation(this.dsDetailList.getpos()) != XFD_ROWOP_NONE;
	if(isEdited) {
		UT.confirm(this.screen,"MSG009", "변경된 데이터가 존재합니다. 저장 하시겠습니까?", "",0, "close_confirm");
	}
	else {
		INI.gfnMdiTabClose();	
	}
	
}


function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{	
    ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
}


function fnSearch(){	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_MAIL" ,"dsSearch" , "dsList");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , false , "TR_SEARCH");
}

function btnCommonSave_on_mouseup(objInst)
{
	//필수 항목 검사 && 날짜 중복 검사		
    UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
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
* 날짜 유효성 검사 및 기본값 처리 (9999-12-31로 설정)
*/
function checkAndReturnDate(date) {
  // a가 공백인지 확인 (문자열 공백 또는 빈 값)
  if (!date) {
    // 공백이면 9999-12-31의 Date 객체 반환
    return new Date("9999-12-31");
  } else {
    // 공백이 아니면 a 값을 반환 (Date형이 아닐 경우 그대로 반환)
    return this.parseDateFromString(date);
  }
}


/*
* 날짜 사이 겹침 유무
*/
function isDateBetween(startDate, endDate, newStartDate, newEndDate) {
	if(startDate >newStartDate) {
		if(startDate > newEndDate) {
			return true;
		}	
	} else if(endDate < newStartDate) {
		if(endDate < newEndDate) {
			return true;
		}		
	}
	return false;
}


/*
* 기간 중복 검사
*/
function fnCheckDateOverlap()
{
	var rowCount = this.grdMailDetailList.getrowcount();
	var lastIndex = this.grdMailDetailList.getrowcount() -1;
	
	var new_rec_code;
	var new_ref_1;
	var new_ref_2;
	var new_start_date;
	var new_end_date;
		
	for(i=0; i<rowCount; i++) {
		var prev_start_date = this.dsDetailList.getprevdatabyname(i, "START_DATE");
		var cur_start_date = this.dsDetailList.getdatabyname(i, "START_DATE");
		
		var prev_end_date = this.dsDetailList.getprevdatabyname(i, "END_DATE");
		var cur_end_date = this.dsDetailList.getdatabyname(i, "END_DATE");
		
		var isEdited = prev_end_date != null && prev_end_date!=cur_end_date;
		var isAdded = prev_start_date == "" && prev_start_date != cur_start_date;
		
		if(isAdded || isEdited) {
			new_rec_code = this.dsDetailList.getdatabyname(i, "RECIPIENT_CODE");
			new_ref_1 = this.dsDetailList.getdatabyname(i, "REF_1_CODE");
			new_ref_2 = this.dsDetailList.getdatabyname(i, "REF_2_CODE");
			
			// 추가된 날짜 입력값은 String 형이라 Date형으로 변환 필요
			new_start_date = this.parseDateFromString(this.dsDetailList.getdatabyname(i, "START_DATE"));	
			// END DATE는 공백가능하여, 공백 치환 후 Date형으로 변환
			new_end_date = this.checkAndReturnDate(this.dsDetailList.getdatabyname(i, "END_DATE"));
			
			
			for(j=0; j<rowCount; j++) {
				var rec_code = this.dsDetailList.getdatabyname(j, "RECIPIENT_CODE");
				var ref_1 = this.dsDetailList.getdatabyname(j, "REF_1_CODE");
				var ref_2 = this.dsDetailList.getdatabyname(j, "REF_2_CODE");				
			
				var start_date = new Date(this.dsDetailList.getdatabyname(j, "START_DATE"));
				var end_date = new Date(this.dsDetailList.getdatabyname(j, "END_DATE"));
				
				// 수신대상, 참조1, 참조2코드값까지 비교
				var isAllSame = rec_code == new_rec_code && ref_1 == new_ref_1 && ref_2 == new_ref_2;
				var isCompared = isAllSame && i != j;
				
				if(isCompared) {
					var res = this.isDateBetween(start_date, end_date, new_start_date, new_end_date);
					if(!res) {
						UT.alert(this.screen, "MSG609", "기간 내 중복 데이터가 있습니다.");
						return;
					}
				}
			}
		}
	}
	return true;
}


/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	var aryDual = [ "MAIL_CODE", "MAIL_TITLE"];
	var aryDetailDual = ["RECIPIENT_CODE", "START_DATE"]; 
	
	var rowCount = this.grdMailDetailList.getrowcount();
	
	var isMailGridFilled = !!UT.gfnVaildataionGrd(this.screen,this.grdMailList, aryDual, false);
	var isDetailGridFilled = !!UT.gfnVaildataionGrd(this.screen,this.grdMailDetailList, aryDetailDual, false);
	
	// 필수항목이 다 채워졌다면 조건에 따른 필수값 필터링 진행
	if(isMailGridFilled && isDetailGridFilled) {
		for(i=0; i<rowCount; i++) {
			var ref_1_value = this.dsDetailList.getdatabyname(i, "REF_1_CODE");
			var ref_2_value = this.dsDetailList.getdatabyname(i, "REF_2_CODE");
			
			var ref_main_cd = this.getRefMainCd(i);
			var exceptCondition = ref_main_cd == "DEPT" && ref_1_value == '50';
			var isUser = ref_main_cd == "USER";
			
			// 참조1값 입력이 필수값이 아닌 조건
			var isRef1Empty = isUser || exceptCondition;
			
			var isRequired = !isRef1Empty && ref_1_value == "";
					
			// 참조1값 입력이 필수로 요구되는 조건임에도 ref 
			if(isRequired){
				UT.alert(this.screen, "MSG608", "참조1 값을 선택해 주세요.");
				return;
			}	
			
			var is_ref_1_not_null = ref_1_value !="";
			var is_ref_2_null = UT.isNull(ref_2_value);
			
			var isRef1Required = !exceptCondition && is_ref_1_not_null && is_ref_2_null;
			
			if(isRef1Required){
				UT.alert(this.screen, "MSG606", "참조2 코드 값을 선택해 주세요.");
				return;
			}
		}
		return true;
	};
}

/*
* 저장
*/
function fnSaveData(alertshow, strLogicType){
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	};
	
	if(this.checkValidation()){
		var logicType = strLogicType || "insertAndselect";
		
		TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");
		TRN.gfnTranDataSetHandle(this.screen , this.dsDetailList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");
		
		TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");
		
		TRN.gfnCommonTransactionAddSave(this.screen , "OmsSmtMapper.INSERT_SMT_MAIL" , "OmsSmtMapper.UPDATE_SMT_MAIL" , "", "dsList" );
		TRN.gfnCommonTransactionAddSave(this.screen , "OmsSmtMapper.INSERT_SMT_MAIL_DETAILS" , "OmsSmtMapper.UPDATE_SMT_MAIL_DETAILS" , "OmsSmtMapper.DELETE_SMT_MAIL_DETAILS", "dsDetailList" );
		TRN.gfnCommonTransactionRun(this.screen , logicType , true , alertshow , false , "TR_SAVE_ALL");
	}

}

/*
* 삭제
*/
function fnDeleteData(alertshow){
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	GRD.gfnDeleteRow(this.screen, this.grdMailDetailList);
	
	this.fnSaveData();
}

/*
* 행 추가
*/
function btnAddRow_on_click(objInst){
	var rowCount = this.dsList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdMailList,false,rowCount);
	this.dsList.setdatabyname(rowCount , "OU_CODE" , ouCode);	
	
	this.grdMailList.setitemcheck(iRow, 2, true);
	
	var codePrefix = "ML";
	
	// 기존 mailCode가 있다면, 기존 mailCode +1 , 없다면 ML0000부터 시작
	var seq = this.dsList.getdatabyname(iRow-1 , "MAIL_CODE" , ouCode) || "0000";	
	
	// 메일코드에서 숫자 부분만 추출 (substring을 사용하여 "ML"을 제거)
	var numberPart = seq.substring(2);
	
	// 숫자 부분을 정수로 변환 후 1을 더함
	var incrementedNumber = parseInt(numberPart, 10) + 1;
	
    // 다시 4자리로 포맷팅하여 ML과 결합하여 반환
    var incrementedMailCode = codePrefix + String(incrementedNumber).padStart(4, '0');

	this.dsList.setdatabyname(iRow, "MAIL_CODE", incrementedMailCode);
}

function getRef2FromRef1() {
	var ref_1_code = this.dsDetailList.getdatabyname(this.dsDetailList.getpos(), "REF_1_CODE");
	var ref_main_cd = this.getRefMainCd();
	
	if(!ref_1_code) {
		UT.alert(screen,"MSG604","참조 1을 먼저 선택바랍니다.");
		return;
	}
	
	var popupLabelCode;
	var popupLabelName;
	var popupData = ouCode;
	var popupCompName;
	
	
	// 참고1 값에 따른 팝업 생성
	switch (ref_main_cd) {
		 // HRM 부서 정보
	    case "DEPT":
	        popupLabelCode = "LABEL02137";
	        popupLabelName = "부서정보조회";
	        popupCompName = "popupDeptH";
	        break;
		
		// 기준코드
		case "CODE":
			popupLabelCode = "";
			popupLabelName = "기준코드 정보 조회";
			popupCompName = "popupCommGrpCode";
			break;
		
		// ROLE 그룹정보
		case "ROLE":
			popupLabelCode = "";
			popupLabelName = "ROLE그룹 조회";
			popupCompName = "popupRole";
			break;
		default:
			break;
	}
	
	var strPopupName = UT.gfnGetMetaData(popupLabelCode, popupLabelName); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = popupData;
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupClosePopCallback";
	screen.loadportletpopup(strPopupName, "/FRAME/" + popupCompName, strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}


/*
* 참조2 검색 팝업 로드
*/
function grdMailDetailList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// 입력모드에서만 팝업 로드
	if(this.grdMailDetailList.getrowoperation(this.dsDetailList.getpos()) != XFD_ROWOP_INSERT ){
		return;
	}
	
	var ref_main_cd = this.getRefMainCd();
	
	var ref_1_code = this.dsDetailList.getdatabyname(this.dsDetailList.getpos(), "REF_1_CODE");
	var rec_code = this.dsDetailList.getdatabyname(this.dsDetailList.getpos(), "RECIPIENT_CODE");
	
	// 수신대상 참조값이 DEPT이면서 ref_1값이 HRM 조직도(상위부서반영) || 수신대상 참조값이 USER라면 팝업 로드 X
	var isEmptyRef2 = (ref_1_code == '50' && ref_main_cd == "DEPT") || ref_main_cd == "USER";
	
	if(isEmptyRef2) {
		return;
	}
	
	this.getRef2FromRef1();
}

/*
* 팝업 Callback
*/
function fnPopupClosePopCallback(aryHash) {
	if (UT.gfnGetAryHashCount(aryHash) == 0){
		return;
	}
	var iRow = this.dsDetailList.getpos();
	var ref_main_cd = this.getRefMainCd();
	var ref_1_code = this.dsDetailList.getdatabyname(this.dsDetailList.getpos(), "REF_1_CODE");
	
	var ref_2_code;
	var ref_2_name;
	
	switch (ref_main_cd) {
	    case "DEPT":
			// 수신대상 참조코드가 DEPT면서, 참조코드명이 HRM 조직도(상위부서반영) 가 아닌 값만
			if(ref_1_code != '50') {
		        ref_2_code = "DEPT_CODE";
		        ref_2_name = "DEPT_NAME";
			}
	        break;
	    case "CODE":
	        ref_2_code = "GRP_CODE";
	        ref_2_name = "GRP_NAME";
	        break;
	    case "ROLE":
	        ref_2_code = "AUTH_CODE";
	        ref_2_name = "AUTH_NAME";
	        break;
	    default:
	        break;
	}
	
	// 팝업에서 선택된 컬럼값을 REF2 CODE, NAME에 대입
	this.dsDetailList.setdatabyname(iRow , "REF_2_CODE" , aryHash[ref_2_code]);
	this.dsDetailList.setdatabyname(iRow , "REF_2_NAME", aryHash[ref_2_name]);
}

/*
* 메일 정보 셀 변경시 Callback
*/
function grdMailList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{	
	var targetRow = this.dsDetailList.getmodifyrowcount();
	// 맨 처음 로드 시 그리드 0번째 row index는 -1로 지정
	// row index이 -1이라면 0이라고 변경해주는 변수값 설정
	var prevSelectRow = nPrevSelectRow == -1 ? 0 : nPrevSelectRow;
	var isChangedRow = prevSelectRow != nCurSelectRow;
	
	// 작성중인 상세 메일 리스트 row가 있을 시, 입력 완료 후 셀 변경 가능
	if(targetRow > 0 && isChangedRow) {
		preRowIndex = nPrevSelectRow;
		UT.confirm(this.screen,"MSG607", "변경된 데이터가 존재합니다.<br/>계속 하시겠습니까?", "",0, "pre_save_confirm");
	}else {
		this.fnDetailData();			
	}

}


/*
* 메일 상세 정보 그리드 행 추가
*/
function btnDetailAddRow_on_click(objInst)
{
	var mainRowCount = this.dsList.getrowcount();
	
	if(mainRowCount == 0) {
		UT.alert(this.screen , "MSG605", "메일 발송 목록 데이터를 먼저 입력해 주세요.");
		return;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsRef_1 , "NONE" , "CLEAR" ,  "" , "" , "TRANSACITON_REF_1");
	TRN.gfnCommonTransactionClear(this.screen, "TRANSACITON_REF_1");
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_REF_1" ,"" , "dsRef_1");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL_REF_1" , true , true , true , "TRANSACITON_REF_1");
	
	var rowCount = this.dsDetailList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdMailDetailList,false,rowCount);
	
	this.dsDetailList.setdatabyname(rowCount , "OU_CODE" , ouCode);	
	this.dsDetailList.setdatabyname(rowCount , "MAIL_CODE" , mailCode);
	
	var today = UT.getDate();
	this.dsDetailList.setdatabyname(iRow, "START_DATE", today);
}

function grdMailDetailList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	// 삭제가 가능/불가능한 행들은 삭제 버튼 enable true/false 설정
	var isDeletedRow = this.canDeleteRow();
	this.btnDetailDeleteRow.setenable(isDeletedRow);
	
	// 메일 상세 리스트에서 행추가 모드일 때만 수정 가능 
	if(this.grdMailDetailList.getrowoperation(this.dsDetailList.getpos()) != XFD_ROWOP_INSERT ){
		return;
	}
	
	// 행 추가 시, editable false -> true되는 필드
	var restrictedFields = ["START_DATE", "RECIPIENT_CODE"];
	var fieldsLength = restrictedFields.length;
	
	for(var iColName =0; iColName < fieldsLength; iColName++){
		if(this.grdMailDetailList.getcolumnname(nCurSelectColumn) == restrictedFields[iColName]) {
			this.grdMailDetailList.setitemeditable(nCurSelectRow, nCurSelectColumn , true);
		}
	}
}


/*
* 생성자 컬럼값에 따른 컬럼 값 설정 조건 설정
*/
function setValuesByRecipient(nRow, nColumn) {
	var rec_code = this.dsDetailList.getdatabyname(this.dsDetailList.getpos(), "RECIPIENT_CODE");
	
	var recipient_index = this.grdMailDetailList.getcolumn("RECIPIENT_CODE");
	var ref_1_index = this.grdMailDetailList.getcolumn("REF_1_CODE");
	var isRecipient = nColumn == recipient_index;
	
	var ref_main_cd = this.getRefMainCd(nRow);
	
	// 수신대상을 수정했다면
	if(isRecipient) {
		var ref_1_value;
		var isEditable = false;
		var vParam;
		
		switch(ref_main_cd) {
			// REF1,2 공백이여야 할 때
			case "USER":
				ref_1_value = "";
				break;
			case "DEPT": 
				// 기준코드가 20(부서장)일 때 
				if(rec_code == '20') {
					isEditable = true;
					vParam = "RECIPIENT_CODE=" + rec_code;	
				// 기준코드가 30(부서원)일 때
				} else if (rec_code == '30') {
					ref_1_value = "20";
				}
				break;
			case "CODE":
				ref_1_value = "30";
				break;
			case "ROLE":
				ref_1_value = "40";
				break;
			default: 
				break;
		}
		
		// 쿼리 실행시키는 조건 : ref_1값이 null이 아니거나, vParam값이 존재하거나
		var executeQuery = !!(ref_1_value || vParam);
		
		// 팝업을 띄우지 않는 USER 빼고 쿼리 실행
		if(ref_main_cd == "DEPT") {
			// 참조1 데이터 가져오기
			TRN.gfnTranDataSetHandle(this.screen , this.dsRef_1 , "NONE" , "CLEAR" ,  "" , "" , "TRANSACITON_REF_1");
			TRN.gfnCommonTransactionClear(this.screen, "TRANSACITON_REF_1");
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_REF_1" ,"" , "dsRef_1", vParam);
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL_REF_1" , true , true , true , "TRANSACITON_REF_1");
		}
		
		this.dsDetailList.setdatabyname(nRow,"REF_1_CODE", ref_1_value);
		this.grdMailDetailList.setitemeditable(nRow, ref_1_index, isEditable);
	}
}


/*
* 수신대상값에 따른 참조 코드, 이름 조회
*/
function getRefMainCd(nRow) {
	var iRow = this.dsDetailList.getpos();
	var rowIndex = UT.isNull(nRow) ? iRow : nRow;
	var recipient_index = this.grdMailDetailList.getcolumn("RECIPIENT_CODE");
	var selectedCbIndex = this.grdMailDetailList.getitemselectedindex(rowIndex, recipient_index);
	var ref_main_cd = this.dsRecipient.getdatabyname(selectedCbIndex,"REF_MAIN_CD");
	
	return ref_main_cd;
}

/*
* 수신대상값에 따른 참조 컬럼값 초기화
*/
function setEmptyByRecipientCode(nRow, nColumn) {
	var ref_1_code = this.dsDetailList.getdatabyname(this.dsDetailList.getpos(), "REF_1_CODE");
		
	var recipient_index = this.grdMailDetailList.getcolumn("RECIPIENT_CODE");
	var ref_1_index = this.grdMailDetailList.getcolumn("REF_1_CODE");
	
	var isRecipient = nColumn == recipient_index;
	var is_ref_1 = nColumn == ref_1_index;
	var ref_main_cd = this.getRefMainCd(nRow);
		
	if(isRecipient) {
		// 수신대상 값이 바뀐다면, REF_1,REF_2 셀 empty
		var emptryColumns = ["REF_1_CODE", "REF_2_CODE","REF_2_NAME"];
		var rowCount = emptryColumns.length;
		for(var idx =0; idx < rowCount; idx++){
			var colName = emptryColumns[idx];
			this.dsDetailList.setdatabyname(nRow,colName, "");
		}
		return;
	}
	
	if(is_ref_1){
		// 수신대상 참조값이 DEPT면서, 참조1 코드값이 50(HRM조직도(상위부서반영)) 라면 REF_2 모두 empty
		var isRef2FieldsEmpty = (ref_main_cd == "DEPT" && ref_1_code == '50');	
		if(isRef2FieldsEmpty) {
			var emptryColumns = ["REF_2_CODE","REF_2_NAME"];
			var rowCount = emptryColumns.length;		
			for(var idx =0; idx < rowCount; idx++){
				var colName = emptryColumns[idx];
				this.dsDetailList.setdatabyname(nRow,colName, "");
			}
			return;
		}
	}
}

/*
* 메일 상세 정보 그리드 데이터 변경 완료 시
*/
function grdMailDetailList_on_itemvaluechanged(objInst, nRow, nColumn, strPrevItemText, strItemText)
{
	// 메일 상세 리스트에서 행추가 모드일 때만 수정 가능 
	if(this.grdMailDetailList.getrowoperation(this.dsDetailList.getpos()) != XFD_ROWOP_INSERT ){
		return;
	}
	this.setEmptyByRecipientCode(nRow, nColumn);
	this.setValuesByRecipient(nRow, nColumn);
	
}

function canDeleteRow() {
	var startDate = this.dsDetailList.getdatabyname(this.dsDetailList.getpos(), "START_DATE");
	var today = UT.getDate("%Y-%M-%D");
	var isInsertMode = this.grdMailDetailList.getrowoperation(this.dsDetailList.getpos()) == XFD_ROWOP_INSERT;
	
	// 시작일이 오늘날기준 미래날짜일 경우 OR 추가된 행 삭제 가능
	var isDeletedRow = (startDate > today) || isInsertMode;
	return isDeletedRow;
}

/*
* 메일 상세 정보 그리드 행 삭제 버튼 클릭 시
*/
function btnDetailDeleteRow_on_click(objInst)
{
	var isDeletedRow = this.canDeleteRow();
	
	if(isDeletedRow) {
		UT.confirm(this.screen,"MSG021","삭제 하시겠습니까?","",0,"delete_confirm");
	}
}

/*
* 메일 상세 정보 그리드에서 focus out시, ref_1 전체 코드 불러오는 쿼리문 실행
*/
function grdMailDetailList_on_focusout(objInst)
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsRef_1 , "NONE" , "CLEAR" ,  "" , "" , "TRANSACITON_REF_1");
	TRN.gfnCommonTransactionClear(this.screen, "TRANSACITON_REF_1");
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_REF_1" ,"" , "dsRef_1");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL_REF_1" , true , true , true , "TRANSACITON_REF_1");
}