/*------------------------------------
* program id : Oms1010
* desc	   : 프로젝트 조회
* dev date   : 2023-05-15
* made by    : SEYUN
*-------------------------------------*/
var ouCode;
var authScope;
var fvSelectedRow;	//그리드 선택된 row

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
//	var objExtraData;
//   objExtraData = this.screen.getextradata(); //
//	if(objExtraData !== null && objExtraData.P_DATA1 == "MODIFY") {
//		this.dsSearch.setdatabyname(iRow, "OU_CODE", objExtraData.P_DATA2);
//		this.dsSearch.setdatabyname(iRow, "PROJECT_CODE", objExtraData.P_DATA3);
//	}
    ouCode = INI.GV_OU_CODE;
	var objExtraData;
    objExtraData = this.screen.getextradata();
	if(objExtraData !== null && objExtraData.P_DATA1 == "MODIFY") {
		this.dsSearch.setdatabyname(iRow, "OU_CODE", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(iRow, "PROJECT_CODE", objExtraData.P_DATA3);
		this.dsSearch.setdatabyname(iRow, "CUSTOMER_NAME", objExtraData.P_DATA4);
		//this.dsSearch.setdatabyname(iRow, "PROJECT_PRODUCT_ID", objExtraData.P_DATA5);
		this.dsSearch.setdatabyname(iRow, "DETAIL_STATUS_CODE", objExtraData.P_DATA6);
		this.dsSearch.setdatabyname(iRow, "ACT_STATUS_CODE", objExtraData.P_DATA7);
		//this.dsSearch.setdatabyname(iRow, "ITEM_NAME", objExtraData.P_DATA8);
		this.dsSearch.setdatabyname(iRow, "AUTH", objExtraData.P_DATA9);
	}	

    var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
    var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");
    //CLOSE인 경우 저장 불가
    if ( detailStausCode == "D09" ||detailStausCode == "D04" || auth!="W" ){//D09:close D04:drop  W:수정권한
       this.btnCommonSave.setenable(false);
       this.btnAddRow.setenable(false);
	   this.btnDelRow.setenable(false);
    }	
}


/*
* 데이터셋 
*/
function fnDsSet(){

	UT.gfnGetOuCodes(this.dsOU);	// ou code set
//	UT.gfnGetSiteCodes(this.dsSite,ouCode);	
	UT.gfnGetCommCodes(this.dsActStatus, "O015");		
//	UT.gfnGetCommCodes(this.dsWorkType, "F034");
//	this.fnGetSiteCodes(); //SiteCode 가져오기
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

	// 영업 어드민
    if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP")){
    	authScope = "EMP";  
		this.btnAddRow.setvisible(true);
		this.btnDelRow.setvisible(true);

	// 팀원 권한이 없다면, 사용자명에 자신의 아이디로만 검색 가능
	// 영업 일반 사용자
    } else{
		authScope = "PINFO";		
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
		this.dsAuthList.removeallrows();
		this.grdList.setselectrow(0);
		this.grdList_on_itemselchange();		
	}
	
	if(recv_userheader == "insertAndselect") 
	{	
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
			
	    this.dsAuthList.removeallrows();
		this.grdList_on_itemselchange();
	}	
	
	if(recv_userheader == "SELECT_AUTH") 
	{		
        var count = this.grdAuthList.getrowcount();
        var aryColumn2 = ["PROJECT_CODE","USER_NAME"];
        for(var iRow = 0; iRow < count; iRow++){	    
		   GRD.gfnHrGrdCellHandle(this.grdAuthList, iRow, aryColumn2, "D");	
		   this.grdAuthList.setitemimage(iRow,2, "");			
		}
		
		var auth = this.dsList.getdatabyname( this.dsList.getpos(), "AUTH"); 
		
	    if(auth == "W"){   //W:수정권한
		    this.btnAddRow.setenable(true);
		    this.btnDelRow.setenable(true);
		    this.btnCommonSave.setenable(true);
	        //확인된 ROW를 활성
     	   var count = this.grdAuthList.getrowcount();
	        var aryColumn2 = ["PROJECT_CODE","USER_NAME"];
	        for( var iRow = 0; iRow < count; iRow++){	    
			   GRD.gfnHrGrdCellHandle(this.grdAuthList, iRow, aryColumn2, "D");	
			   this.grdAuthList.setitemimage(iRow,2, "");			
			}
	     }else{
		     this.btnAddRow.setenable(false);
		     this.btnDelRow.setenable(false);
		     this.btnCommonSave.setenable(false);
     	    var count = this.grdAuthList.getrowcount();
	         var aryColumn2 = ["PROJECT_CODE","USER_NAME","WRITE_AUTH","READ_AUTH"];
	         for( var iRow = 0; iRow < count ; iRow++){	    
			   GRD.gfnHrGrdCellHandle(this.grdAuthList, iRow, aryColumn2, "D");	
			   this.grdAuthList.setitemimage(iRow,2, "");			
			 }
	     }		
		
	}	
	
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");		
	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PROJECT" ,"dsSearch" , "dsList", "TR_SEARCH");	//조회만		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	//진행중이 보이려면 싱크 방식을 false로 해야됨. false , true , true 로 설정 
	// screen_on_submitcomplete 힘수에 UT.gfnWaitDestroy(screen); 코딩 들어 있는지 확인 
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , false , true , true , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
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


function btnCommonSave_on_mouseup(objInst)
{
	//필수 항목 검사		
    if(this.fnValidForm() && this.fnCheckDateOverlap()){
		UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
    }
}


/*
* 기간 중복 검사
*/
function fnCheckDateOverlap()
{
	var rowCount = this.grdAuthList.getrowcount();
			
	for(i=0; i<rowCount; i++) {
		var cur_user_name = this.dsAuthList.getdatabyname(i, "USER_NAME");
		var cur_start_date = this.dsAuthList.getdatabyname(i, "START_DATE");
		var cur_end_date = this.dsAuthList.getdatabyname(i, "END_DATE") || "9999-12-31";
		
		if(cur_start_date >= cur_end_date) {
			UT.alert(this.screen, "MSG161", "시작일이 종료일보다 크거나 같을 수 없습니다.");
			return;	
		}
		
		for(j=i+1; j<rowCount; j++) {
			var next_user_name = this.dsAuthList.getdatabyname(j, "USER_NAME");
			var next_start_date = this.dsAuthList.getdatabyname(j, "START_DATE");
			var next_end_date = this.dsAuthList.getdatabyname(j, "END_DATE") || "9999-12-31";
			
			var isPeriodNotOverlapping = cur_start_date > next_end_date || cur_end_date < next_start_date;
						
			var isOverlapped = cur_user_name == next_user_name && !isPeriodNotOverlapping;
			
			if(isOverlapped) {
				UT.alert(this.screen, "MSG609", "기간 내 중복 데이터가 있습니다.");
				return;	
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
	var aryDual = [ "PROJECT_CODE", "USER_NAME", "START_DATE"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdAuthList, aryDual, false))
	{
		return false;
	}
	
	return true;
}

/*
* 저장
*/
function fnSaveData(alertshow){

	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuthList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.INSERT_PROJECT_AUTH" , "OmsProjectMapper.UPDATE_PROJECT_AUTH" , "OmsProjectMapper.DELETE_PROJECT_AUTH", "dsAuthList" );	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");
		
}

function btnAddRow_on_mouseup(objInst)
{
	var sRow = this.dsList.getpos();
	var projectCode = this.dsList.getdatabyname(sRow,"PROJECT_CODE");
	if( UT.isNull(projectCode )){		
		UT.alert(this.screen , "MSG146" , "프로젝트를 선택해주세요.");
		return;
	}
	var rowCount = this.dsAuthList.getrowcount();
	var today = UT.getDate();

	//var row = this.dsList.getpos()+1;	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdAuthList,false,rowCount);	
	this.dsAuthList.setdatabyname(iRow , "PROJECT_CODE" , this.dsList.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsAuthList.setdatabyname(iRow , "START_DATE" , today);
	this.dsAuthList.setdatabyname(iRow, "OU_CODE",ouCode );
	
	var start_date_index = this.grdAuthList.getcolumn("START_DATE");
	
	this.grdAuthList.setitemeditable(iRow, start_date_index , true);
	
}

function btnDelRow_on_mouseup(objInst)
{	
	var role = this.dsAuthList.getdatabyname(this.dsAuthList.getpos(), "PROJECT_ROLE");
	if(role == "MANAGER") {
		UT.alert(this.screen , "" , "프로젝트 담당자는 삭제할 수 없습니다.");
		return;
	}
	GRD.gfnDeleteRow(this.screen,this.grdAuthList);
}

function grdAuthList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	
	//사용자 Poupup
	if(this.grdAuthList.getrowoperation(this.dsAuthList.getpos()) != XFD_ROWOP_INSERT ){
		return;
	}
    if(this.grdAuthList.getcolumnname(nColumn) == "USER_POPUP"){
		var strPopupName = UT.gfnGetMetaData("LABEL00101", "사용자");
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnUserPopCallback";
		screen.loadportletpopup(strPopupName, "/FRAME/popupCharge", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}	
}


/*
* 담당자 Callback
*/
function fnUserPopCallback(aryHash) 
{ 
	var iRow = this.dsAuthList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsAuthList.setdatabyname(iRow , "USER_ID" , aryHash["USER_ID"]);
		this.dsAuthList.setdatabyname(iRow , "USER_NAME" ,aryHash["USER_NAME"]);
	}
}

function ComActStatus_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "ACT_STATUS_CODE" , "");
	return 0;
}

function grdList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	this.grdList.setcheckedrow(nCurSelectRow, true);
	//권한 가져오기 
	var projectCode = this.dsList.getdatabyname(this.dsList.getpos(),"PROJECT_CODE");
	var ouCode = this.dsList.getdatabyname(this.dsList.getpos(),"OU_CODE");
   
    this.dsAuthSearch.removeallrows();
	var iRow = this.dsAuthSearch.getrowcount();
	this.dsAuthSearch.insertrow(iRow);
	this.dsAuthSearch.setdatabyname(iRow,"OU_CODE",ouCode );
	this.dsAuthSearch.setdatabyname(iRow,"PROJECT_CODE",projectCode );
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuthSearch , "ALL" , "NONE" ,  "" , "" , "TR_AUTH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuthList, "NONE" , "CLEAR" ,  "" , "" , "TR_AUTH");
	TRN.gfnCommonTransactionClear(this.screen , "TR_AUTH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PROJECT_AUTH" , "dsAuthSearch" , "dsAuthList");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_AUTH" , true , true , false , "TR_AUTH");
	this.isShowAddBtn();
	this.setDisabledPARow();
}

function isShowAddBtn() {
	if(authScope != "PINFO") return;
	
	var chargeUserId = this.dsList.getdatabyname(this.dsList.getpos(),"PROJECT_CHARGE_USER_ID");
	
	if(chargeUserId == INI.GV_USER_ID) {
		this.btnAddRow.setvisible(true);
		this.btnDelRow.setvisible(true);
	}else {
		this.btnAddRow.setvisible(false);
		this.btnDelRow.setvisible(false);
	}	
}

// pm row는 이관 페이지에서 추가/수정 가능
function setDisabledPARow() {
	
	var count = this.grdAuthList.getrowcount();
	var columns = GRD.gfnGetColumnNameAry(this.grdAuthList);
	
	for( var iRow = 0; iRow < count ; iRow++){	    
		var role = this.dsAuthList.getdatabyname(iRow, "PROJECT_ROLE");
		
		// PA일 경우에만 정보 수정가능
		if(role == "MANAGER") {
			GRD.gfnHrGrdCellHandle(this.grdAuthList, iRow, columns, "D");			
		}
	}
}
