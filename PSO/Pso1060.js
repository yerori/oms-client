/*------------------------------------
* program id : Pso1060
* desc	   : PSO신제품개발서류목록조회
* dev date   : 2023-07-12
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
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsDocStep, "P003");	       // 서류목록활동단계
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE);
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    }
	
	this.fnPmAdminCheck();
	
	//사용자 권한 Control (PM담당자)
	if (INI.GV_USER_BIZ_DIV == "PM" || this.dsPmUserAuth.getdatabyname(this.dsPmUserAuth.getpos(),"PM_USER_AUTH") == "PA"){
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"USER_PM_DIV", "Y");
	} else {
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"USER_PM_DIV", "N");
	}
	
	UT.gfnHrEditorStyle(this.fldProjectCode, "D");
	UT.gfnHrEditorStyle(this.fldCarTypeName, "D");
	UT.gfnHrEditorStyle(this.fldRegisterYear, "D");
	UT.gfnHrEditorStyle(this.fldOuCountryName, "D");
	UT.gfnHrEditorStyle(this.fldCustName, "D");
	UT.gfnHrEditorStyle(this.fldNationName, "D");
	UT.gfnHrEditorStyle(this.fldBusiGroup, "D");
	UT.gfnHrEditorStyle(this.fldProdGroupName, "D");
	UT.gfnHrEditorStyle(this.fldProdName, "D");
	UT.gfnHrEditorStyle(this.fldProdModelName, "D");
	UT.gfnHrEditorStyle(this.fldProdPkg, "D");
	UT.gfnHrEditorStyle(this.fldItemName, "D");
	UT.gfnHrEditorStyle(this.fldErpItemNo, "D");
	UT.gfnHrEditorStyle(this.fldSOP, "D");
	UT.gfnHrEditorStyle(this.fldEOP, "D");
	UT.gfnHrEditorStyle(this.fldActStat, "D");
	UT.gfnHrEditorStyle(this.fldDetailStat, "D");
	UT.gfnHrEditorStyle(this.fldGrade, "D");
	UT.gfnHrEditorStyle(this.fldApqp, "D");
	UT.gfnHrEditorStyle(this.fldProdAreaName, "D");
	UT.gfnHrEditorStyle(this.fldDocStatus, "D");
	UT.gfnHrEditorStyle(this.fldTScore, "D");
	UT.gfnHrEditorStyle(this.fldDesc, "D");
	
	this.btnSummary.setenable(false);
	this.dsSearch.setdatabyname(this.dsSearch.getpos(), "CHARGE_EMP_NO", INI.GV_EMP_NO);
}

/*
* PM ADMIN 권한체크
*/
function fnPmAdminCheck(){
	
	var params = "";
	params = params + " OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsPmUserAuth , "NONE" , "CLEAR" , "" , "" , "TR_PM_USER_AUTH");
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_PM_USER_AUTH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_GET_USER_AUTH" , "" , "dsPmUserAuth" , params);
	TRN.gfnCommonTransactionRun(this.screen , "selectUserAuth" , true , false , false , "TR_PM_USER_AUTH");	

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
		if(this.dsDocDtl.getrowcount() == 0){
			this.btnSummary.setenable(false);
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsDocDtl.getrowcount());	//하단메세지 처리
			
			this.btnSummary.setenable(true);
			
			var aryColumn = ["PSO_DOC_STEP","PSO_DOC_CHASU","PSO_DOC_DETAIL_CHASU","PSO_CONTENTS","CHG_EMAIL_ADDR","MAKE_PLAN_DATE","REMARK"];
			for(var i=0;i<this.dsDocDtl.getrowcount();i++){
				GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
				
				//7일전부터:W(파랑), 지연:D(빨강)
				if( this.dsDocDtl.getdatabyname(i,"PSO_DOCU_LINE_STAT") == "W" ) {
					for(j=0;j<=this.grdList.getcolumncount();j++){
						this.grdList.setitemforecolor(i, j, factory.rgb(0,0,255));
					}
				} else if ( this.dsDocDtl.getdatabyname(i,"PSO_DOCU_LINE_STAT") == "D" ) {
					for(j=0;j<=this.grdList.getcolumncount();j++){
						this.grdList.setitemforecolor(i, j, factory.rgb(255,0,0));
					}
				} else {
					for(j=0;j<=this.grdList.getcolumncount();j++){
						this.grdList.setitemforecolor(i, j, factory.rgb(0,0,0));
					}
				}
			}	
			this.grdList.refresh();			
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
* 개발착수등급산정표 정보 데이터 가져오기.
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
	
	//프로젝트코드(PSO_DOCU_ID)
	var psoDocuID = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PSO_DOCU_ID");
	if(UT.isNull(psoDocuID) ){
	    UT.alert(this.screen , "MSG228" , "프로젝트를 먼저 선택하세요.");
		this.edtProjectCode.setfocus();
	    return;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsDocMain , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsDocDtl , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DOCU_MAIN" ,"dsSearch" , "dsDocMain");	//조회만	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DOCU_DETAIL_ALL" ,"dsSearch" , "dsDocDtl");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "selectList" , true , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
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

function btnSummary_on_mouseup(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02683", "PSO 프로젝트 서류 목록 요약 현황"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = this.dsDocMain.getdatabyname(this.dsDocMain.getpos(), "PSO_DOCU_ID")
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "";
	screen.loadportletpopup("SummaryView", "/PSO/Pso1052", strPopupName, false, 0, 0, 0, 526, 326, true, true, false, objPopupExtraData);
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


function edtProjectCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
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
		this.dsSearch.setdatabyname(iRow , "PSO_PROJECT_ID" , aryHash["PSO_PROJECT_ID"]);
		this.dsSearch.setdatabyname(iRow , "PSO_DOCU_ID" , aryHash["PSO_DOCU_ID"]);
		this.btnCommonSearch_on_mouseup();
	} else {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , "");
		this.dsSearch.setdatabyname(iRow , "PSO_PROJECT_ID" , "");
		this.dsSearch.setdatabyname(iRow , "PSO_DOCU_ID" , "");
	}
}

function btnProjectCodePop_on_click(objInst)
{
	this.fnProjectCodePopupCall("");
}

function fnProjectCodePopupCall(projectCode) {
	var strPopupName = UT.gfnGetMetaData("LABEL02665", "PSO 프로젝트 신제품 개발 서류 목록 조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = projectCode;
	objPopupExtraData.P_DATA3 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"USER_PM_DIV");
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnProjectCodeClosePopCallback";
	screen.loadportletpopup("ProjectCodeSelect", "/PSO/Pso1051", strPopupName, false, 0, 0, 0, 1130, 440, true, true, false, objPopupExtraData);
}

function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	
	// 표준 문서첨부 Poupup
	if(this.grdList.getcolumnname(nColumn) == "STD_DOCU_ATT_POP"){
		//첨부문서가 있을 경우만 popup
		if(this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"STD_DOCU_ATT_YN")=="N"){
			return;
		}
		//doc_id가 있을 경우만 popup 
		if(UT.isNull(this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"DOC_ID"))){
			return;
		}
		
		var strPopupName = UT.gfnGetMetaData("LABEL00212", "첨부파일"); 
		objPopupAttData.clear();
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"DOC_ID");
		objPopupAttData.P_MODE = "R";
		objPopupAttData.P_FILE_GUBUN = "Pso1010";
		objPopupAttData.P_REF_NAME = "";
		objPopupAttData.P_DIR_TYPE = "PDOCM";
		objPopupAttData.P_OU_CODE = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "";
		screen.loadportletpopup("AttFilePso10601", "/FRAME/AttachFilePop", strPopupName, false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
	}
	
	// 첨부 Poupup
	if(this.grdList.getcolumnname(nColumn) == "PSO_DOCU_ATT_POP"){

		//첨부문서가 있을 경우만 popup
		if(this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"PSO_DOCU_ATT_YN")=="N"){
			return;
		}
		//PSO_DOCU_LINE_ID가 있을 경우만 popup 
		if(UT.isNull(this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"PSO_DOCU_LINE_ID"))){
			return;
		}
		
		var strPopupName = UT.gfnGetMetaData("LABEL00212", "첨부파일"); 
		objPopupAttData.clear();
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"PSO_DOCU_LINE_ID");
		objPopupAttData.P_MODE = "R";
		objPopupAttData.P_FILE_GUBUN = "Pso1050";
		objPopupAttData.P_REF_NAME = "";
		objPopupAttData.P_DIR_TYPE = "PSODOC";
		objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "";
		screen.loadportletpopup("AttFilePso10602", "/FRAME/AttachFilePop", strPopupName, false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
	}
}