/*------------------------------------
* program id : Pso1050
* desc	   : PSO신제품개발서류목록관리
* dev date   : 2023-07-06
* made by    : SEYUN
*-------------------------------------*/

var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";
var fvMode = "";
var fvDtlCurrPos;
var ouCode;

var cpDeptCode = "";
var cpDeptName = "";
var cpChgUserID = "";
var cpChgUserNm = "";
var cpChgEmail = "";
var cpMakePlanDate = "";

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
	
	if(fvMode == "V"){
		this.btnCommonSearch_on_mouseup();  	
	}
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
	
	var objExtraData;
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
	if (objExtraData !== null) {
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"OU_CODE",objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"PROJECT_CODE",objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"PSO_DOCU_ID",objExtraData.P_DATA3);
		fvMode = objExtraData.P_DATA4;
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
	
	this.btnCommonSave.setenable(false);
	this.btnCommonCreate.setenable(false);
	this.btnCommonDelete.setenable(false);
	
	this.btnCommonAddRow.setenable(false);
	this.btnCommonDelRow.setenable(false);
	this.btnSummary.setenable(false);
	
	ouCode = INI.GV_OU_CODE;
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
			
			//var aryColumn = ["PSO_DOC_STEP","PSO_DOC_CHASU","PSO_DOC_DETAIL_CHASU","PSO_CONTENTS","CHG_EMAIL_ADDR","MAKE_PLAN_DATE"]; -- 이메일 필수항목에서 제외 250228 by.yelee
			var aryColumn = ["PSO_DOC_STEP","PSO_DOC_CHASU","PSO_DOC_DETAIL_CHASU","PSO_CONTENTS","MAKE_PLAN_DATE"];
			for(var i=0;i<this.dsDocDtl.getrowcount();i++){
				//write 권한 체크
				if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"READ_WRITE") == "W" ) {
					//확정완료시 활동단계, 담당자등 선택불가
					if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"PSO_DOCU_STATUS") == "Y" ){
						GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
					} else {
						GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "G");
					}
				} else {
					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
				}
				
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
			
			//write 권한 체크
			if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"READ_WRITE") == "W" ) {
				//확정완료시
				if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"PSO_DOCU_STATUS") == "Y" ){
					UT.gfnHrEditorStyle(this.fldDesc, "D");
					this.btnCommonCreate.setenable(false);
					this.btnCommonDelete.setenable(true);
					this.btnCommonSave.setenable(false);
					this.btnCommonAddRow.setenable(false);
					this.btnCommonDelRow.setenable(false);
				} else {
					UT.gfnHrEditorStyle(this.fldDesc, "G");
					this.btnCommonCreate.setenable(true);
					this.btnCommonDelete.setenable(false);
					this.btnCommonSave.setenable(true);
					this.btnCommonAddRow.setenable(true);
					this.btnCommonDelRow.setenable(true);
				}				
			} else {
				UT.gfnHrEditorStyle(this.fldDesc, "D");
				this.btnCommonCreate.setenable(false);
				this.btnCommonDelete.setenable(false);
				this.btnCommonSave.setenable(false);
				this.btnCommonAddRow.setenable(false);
				this.btnCommonDelRow.setenable(false);
			}
			
			this.btnSummary.setenable(true);
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
* user 존재여부에 따라 button hidden
*/
function setBtnImageHiddenByUser () {
	var chgPopIdx = this.grdList.getcolumn("CHG_POP");
	
	for(var i=0; i<this.dsDocDtl.getrowcount(); i++){
		var isExistsUser = !!this.dsDocDtl.getdatabyname(i, "CHG_USER_NAME");
		
		if(isExistsUser) {	
			this.grdList.setitemimageshow(i,chgPopIdx, false);
		}
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
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DOCU_DETAIL" ,"dsSearch" , "dsDocDtl");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "selectList" , true , true , false , "TR_SEARCH");;
	
}

/*
* 필수 항목 검사
*/
function fnValidForm(confirm)
{
	//필수 항목 검사
	var aryDual = ["PSO_DOC_STEP" ,"PSO_DOC_CHASU" ,"PSO_DOC_DETAIL_CHASU", "PSO_CONTENTS"];
	for(var i=0;i<this.grdList.getrowcount();i++){
		if( this.grdList.getrowoperation(i) == XFD_ROWOP_INSERT ){
			for(var j=0;j<aryDual.length;j++){
				var strColumn = aryDual[j];
				var iCell = this.grdList.getcolumn(strColumn);
				var vu = this.grdList.getitemtextbyname(i, strColumn);
				var strGridColumnHead = this.grdList.getheadertext(0 , iCell);
				if(UT.isNull(vu)){
					UT.alert(this.screen , "MSG004" , "%% 은(는) 필수입력항목입니다." , strGridColumnHead );
					
					this.grdList.setselectitem(i, iCell);
					this.grdList.setfocus();
					this.grdList.setitemeditstart(i , iCell , true);
					
					return false;
				}
			}
		}
	}
	
	//확정일 경우 담당자 필수 항목검사
	if(confirm){
		//var aryDual = ["PSO_DEPT_NAME" ,"CHG_USER_NAME" ,"CHG_EMAIL_ADDR", "MAKE_PLAN_DATE"]; -- 이메일 필수항목에서 제외 250228 by.yelee
		var aryDual = ["PSO_DEPT_NAME" ,"CHG_USER_NAME", "MAKE_PLAN_DATE"];
	    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
		{
			return false;
		}
	}
	
	return true;
}
/*
* 저장
*/
function fnSaveData(alertshow){
	
	var rCnt = this.dsDocDtl.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var ouCode = this.dsDocDtl.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsDocDtl.setdatabyname(iRow, "OU_CODE", this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"OU_CODE") );
		}
		var docLineID = this.dsDocDtl.getdatabyname(iRow,"PSO_DOCU_LINE_ID");
		if( UT.isNull(docLineID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsDocuLineID , "NONE" , "CLEAR" ,  "" , "" , "TR_DOCU_LINE_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_DOCU_LINE_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DOCU_LINE_ID_SEQ" ,"" , "dsDocuLineID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_PSO_DOCU_LINE_ID" , true , false , false , "TR_DOCU_LINE_ID");
			var newdocLineID = this.dsDocuLineID.getdatabyname(this.dsDocuLineID.getpos(),"SEQ");
			this.dsDocDtl.setdatabyname(iRow, "PSO_DOCU_LINE_ID", newdocLineID);
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsDocMain , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsDocDtl , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddUpdate(this.screen , "OmsPsoMapper.UPDATE_PSO_DOCU_MAIN" , "dsDocMain" );					
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsPsoMapper.INSERT_PSO_DOCU_DETAIL" , "OmsPsoMapper.UPDATE_PSO_DOCU_DETAIL" , "OmsPsoMapper.DELETE_PSO_DOCU_DETAIL" , "dsDocDtl");
	
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");
	
}
///*
//* 생성 프로세스 호출
//*/
//function fnCreateDevDoc(){
//	
//	var iRow = this.dsRBMain.getpos();
//	// 프로세스 호출
//    var vParam = "";
//    
//    vParam = "USER_ID="  + INI.GV_USER_ID ;
//    vParam += " OU_CODE=" + this.dsRBMain.getdatabyname(iRow,"OU_CODE") ;
//    vParam += " PSO_PROJECT_ID=" + this.dsRBMain.getdatabyname(iRow,"PSO_PROJECT_ID") ;
//    vParam += " PSO_R_BOARD_ID=" + this.dsRBMain.getdatabyname(iRow,"R_BOARD_ID") ;
//    vParam += " LANGUAGE="  + INI.GV_LANG ;
//    vParam += " X_RETCODE=" + "";
//    vParam += " X_RETMESG=" + ""; 
//
//    TRN.gfnTranDataSetHandle(this.screen, this.dsReturn, "", "", "", "", "TR_CREATE");
//    TRN.gfnCommonTransactionClear(this.screen,"TR_CREATE");
//    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsPsoMapper.PSO_DOCUMENT_CREATE_PROC" ,"","dsReturn",vParam);
//	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
//    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, false, false, "TR_CREATE");  
//
//	if(this.dsReturn.getdatabyname(this.dsReturn.getpos() ,"X_RETCODE") != "S"){
//	    UT.alert(this.screen , "MSG475" , "생성 중 오류 발생 : %%", this.dsReturn.getdatabyname(this.dsReturn.getpos(), "X_RETMESG")); 
//	    return;
//	} else {
//		UT.alert(this.screen , "MSG365" , "생성되었습니다");
//		this.fnSearch();
//	}
//} 

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
	} else if (messagebox_id == "create_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.dsDocMain.setdatabyname(this.dsDocMain.getpos(),"PSO_DOCU_STATUS","Y");
			this.fnSaveData(true);
		}	
	} else if (messagebox_id == "cancel_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.dsDocMain.setdatabyname(this.dsDocMain.getpos(),"PSO_DOCU_STATUS","N");
			this.fnSaveData(true);
		}
	}

}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}

function btnCommonSave_on_mouseup(objInst)
{
	//필수 항목 검사		
    if( !this.fnValidForm(false)){
		return;
    }
	UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");
}

function btnCommonCreate_on_mouseup(objInst)
{
	//필수 항목 검사		
    if( !this.fnValidForm(true)){
	//if( !this.fnValidForm(false)){
		return;
    }
	
	UT.confirm(this.screen,"MSG580","해당 프로젝트의 개발 서류목록을 확정 처리 하시겠습니까?","",0,"create_confirm");
}

function btnCommonDelete_on_mouseup(objInst)
{
	//필수 항목 검사		
    if( !this.fnValidForm(false)){
		return;
    }

	UT.confirm(this.screen,"MSG579","해당 프로젝트의 개발 서류목록을 미확정 처리 하시겠습니까?","",0,"cancel_confirm");
	
}
/*
* 행추가
*/ 
function btnCommonAddRow_on_mouseup(objInst)
{
	var iRow = this.grdList.getselectrow();
	var iMRow = this.dsDocMain.getpos();
	GRD.gfnInsertRow(this.screen,this.grdList,false,iRow + 1);
	
	this.dsDocDtl.setdatabyname(iRow+1, "OU_CODE", this.dsDocMain.getdatabyname(iMRow, "OU_CODE")); 
	this.dsDocDtl.setdatabyname(iRow+1, "PSO_DOCU_ID", this.dsDocMain.getdatabyname(iMRow, "PSO_DOCU_ID")); 
	this.dsDocDtl.setdatabyname(iRow+1, "PSO_DOCU_LINE_STAT", "N"); 
	
	this.grdList.setitemeditstart(iRow + 1, 0, true);
}
/*
* 행삭제
*/
function btnCommonDelRow_on_mouseup(objInst)
{
	var iRow = this.grdList.getselectrow();
	var lineChkFlag = this.dsDocDtl.getdatabyname(iRow,"PSO_DOCU_LINE_STAT");
	if(lineChkFlag == "Y"){
		UT.alert(screen,"MSG578","선택된 데이터는 이미 작성 완료 처리되어 삭제할 수 없습니다." + "\n" +
		                         "확인바랍니다." );
        return;
	} else {
		GRD.gfnDeleteRow(this.screen,this.grdList);
	}
}
/*
* 요약현황
*/
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
	// 담당자 Poupup
    if(this.grdList.getcolumnname(nColumn) == "CHG_POP"){
		var rowStatus = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"ROW_STATUS");

		//write 권한 체크
		if(this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"READ_WRITE") != "W" ) {
			return;
		}
		
		//확정이 아닐 경우만 popup
		if(this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"PSO_DOCU_STATUS")=="Y" ){
			return;
		}
		
		if(rowStatus == "I") {
			if(this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") != "") {
				var strPopupName = UT.gfnGetMetaData("LABEL02128", "사원정보조회"); 
				objPopupExtraData.clear();
				objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
				objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
				objPopupExtraData.RETURN_FUNCTION_NAME = "fnEmpNoClosePopCallback";
				screen.loadportletpopup("ChgSelect", "/FRAME/popupEmpUser", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
			} else {
				UT.alert(screen,"MSG351","법인을 먼저 선택바랍니다.");
		        return;
			}
		} else {
			var projectCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_CODE");
			
			var userId = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"CHG_USER_ID");
			var userName = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"CHG_USER_NAME");
			var userEmpNo = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"CHG_EMP_NO");
			
			objPopupExtraData.clear();
			objPopupExtraData.P_DATA1 = INI.GV_OU_CODE;
			objPopupExtraData.P_DATA2 = projectCode;	
			objPopupExtraData.P_DATA3 = userId;
			objPopupExtraData.P_DATA4 = userName;
			objPopupExtraData.P_DATA5 = userEmpNo;	
			
			UT.gfnOpenMenuByURL("/PSO/Pso1110",objPopupExtraData);
			
			// 이관 후 새로고침 대신 다시 조회가능하게 데이터 초기화
			this.dsDocMain.removeallrows();
			this.dsDocDtl.removeallrows();
		}
		
		

	}
	
	// 표준 문서첨부 Poupup
	if(this.grdList.getcolumnname(nColumn) == "STD_DOCU_ATT_POP"){
//		//첨부문서가 있을 경우만 popup 
//		if(this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"STD_DOCU_ATT_YN")=="N"){
//			return;
//		}
//		//doc_id가 있을 경우만 popup
//		if(UT.isNull(this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"DOC_ID"))){
//			return;
//		}
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
		screen.loadportletpopup("AttFilePso10501", "/FRAME/AttachFilePop", strPopupName, false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
	}
	
	// 첨부 Poupup
	if(this.grdList.getcolumnname(nColumn) == "PSO_DOCU_ATT_POP"){
		//필수 항목 검사		
        if( !this.fnValidForm(false)){
		   return;
        }
		
		var docuLineId = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"PSO_DOCU_LINE_ID");
		if( UT.isNull(docuLineId)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsDocuLineID , "NONE" , "CLEAR" ,  "" , "" , "TR_DOCU_LINE_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_DOCU_LINE_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DOCU_LINE_ID_SEQ" ,"" , "dsDocuLineID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_PSO_DOCU_LINE_ID" , true , false , false , "TR_DOCU_LINE_ID");
			var newDocuLineId = this.dsDocuLineID.getdatabyname(this.dsDocuLineID.getpos(),"SEQ");
			this.dsDocDtl.setdatabyname(this.dsDocDtl.getpos(), "PSO_DOCU_LINE_ID", newDocuLineId);
		}

		var strPopupName = UT.gfnGetMetaData("LABEL00212", "첨부파일"); 
		fvDtlCurrPos = this.dsDocDtl.getpos();
		objPopupAttData.clear();
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = this.dsDocDtl.getdatabyname(this.dsDocDtl.getpos(),"PSO_DOCU_LINE_ID");
		objPopupAttData.P_MODE = "W";
		objPopupAttData.P_FILE_GUBUN = "Pso1050";
		objPopupAttData.P_REF_NAME = "";
		objPopupAttData.P_DIR_TYPE = "PSODOC";
		objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
		screen.loadportletpopup("AttFilePso10502", "/FRAME/AttachFilePop", strPopupName, false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		//screen.loadportletpopup("AttFile10502", "/FRAME/AttachFilePop", strPopupName, true, 2, 0, 0, 584, 256, true, true, false, objPopupAttData);
//		//확인 이후 첨부문서 수정불가
//		} else {
//			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
//			objPopupAttData.clear();
//			objPopupAttData.P_ATT_ID = "";
//			objPopupAttData.P_REF_ID = this.dsList.getdatabyname(this.dsList.getpos(),"BLUEPRINT_ID");
//			objPopupAttData.P_MODE = "R";
//			objPopupAttData.P_FILE_GUBUN = "SmtSet1250";
//			objPopupAttData.P_REF_NAME = "ETC";
//			objPopupAttData.P_DIR_TYPE = "BLUEPRINT";
//			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
//			objPopupAttData.RET_FUNC_NAME = "";
//			screen.loadportletpopup("AttFile1161", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
//		}		
	}
}

/*
* 사원번호 Callback
*/
function fnEmpNoClosePopCallback(aryHash) 
{ 
	var iRow = this.dsDocDtl.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsDocDtl.setdatabyname(iRow , "PSO_DEPT_CODE" , aryHash["DEPT_CODE"]);
		this.dsDocDtl.setdatabyname(iRow , "PSO_DEPT_NAME" , aryHash["DEPT_NAME"]);
		this.dsDocDtl.setdatabyname(iRow , "CHG_USER_ID" , aryHash["USER_ID"]);
		this.dsDocDtl.setdatabyname(iRow , "CHG_USER_NAME" , aryHash["EMP_NAME"]);
		this.dsDocDtl.setdatabyname(iRow , "CHG_EMAIL_ADDR" , aryHash["EMAIL_ADDR"]);
		this.dsDocDtl.setdatabyname(iRow , "CHG_EMP_NO" , aryHash["EMP_NO"]);
		
	}
}
/*
* 첨부파일 Callback
*/
function fnAttFilePopCallback(aryHash) 
{ 
//	//필수 항목 검사		
//    if( !this.fnValidForm()){
//		return;
//    }
	//var iRow = this.dsDocDtl.getpos();
	var iRow = fvDtlCurrPos;
	//담당자chg_user_id 와 접속 user_id가 같을 경우만 완료일 check
	if(this.dsDocDtl.getdatabyname(iRow, "CHG_USER_ID") == INI.GV_USER_ID) {
		//첨부가 있을 경우 완료일자 & 완료 flag Set
		if (UT.gfnGetAryHashCount(aryHash) != 0) {
			if(aryHash["ATTACH_RESULT"] == 1){
				if(!UT.isNull(this.dsDocDtl.getdatabyname(iRow, "MAKE_PLAN_DATE")) && UT.isNull(this.dsDocDtl.getdatabyname(iRow, "MAKE_COMP_DATE"))) {
					this.dsDocDtl.setdatabyname(iRow , "MAKE_COMP_DATE" , UT.getDate("%Y%M%D"));
					this.dsDocDtl.setdatabyname(iRow , "PSO_DOCU_LINE_STAT" , "Y");
				}
			} else {
				if(UT.isNull(aryHash["ATTFILE_NM"])){
					if(!UT.isNull(this.dsDocDtl.getdatabyname(iRow, "MAKE_COMP_DATE"))) {
						this.dsDocDtl.setdatabyname(iRow , "MAKE_COMP_DATE" , "");
						this.dsDocDtl.setdatabyname(iRow , "PSO_DOCU_LINE_STAT" , "N");
					}
				}			
			}		
		}
	}
	
	
	// 저장한다
	this.fnSaveData(false);
	// 재조회
	this.fnSearch();
}

/*
* 드래그 이벤트를 처리한다.
*/
function grdList_on_enddrag(objInst, nDragRow, nDropRow, nDragColumn, nDropColumn)
{
	//write 권한 체크
	if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"READ_WRITE") == "W" ) {
		//확정완료시
		if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"PSO_DOCU_STATUS") == "Y" ){
			return 0;
		} else {
			var userNameColIdx = this.grdList.getcolumn("CHG_USER_NAME");
			var makePlanDateColIdx = this.grdList.getcolumn("MAKE_PLAN_DATE");
			
			//담당자 Drag
			if(nDragColumn == userNameColIdx){
				var dragDeptCode = this.dsDocDtl.getdatabyname(nDragRow,"PSO_DEPT_CODE");
				var dragDeptName = this.dsDocDtl.getdatabyname(nDragRow,"PSO_DEPT_NAME");
				var dragChgUserID = this.dsDocDtl.getdatabyname(nDragRow,"CHG_USER_ID");
				var dragChgUserNm = this.dsDocDtl.getdatabyname(nDragRow,"CHG_USER_NAME");
				var dragChgEmpNo = this.dsDocDtl.getdatabyname(nDragRow,"CHG_EMP_NO");
				var dragChgEmail = this.dsDocDtl.getdatabyname(nDragRow,"CHG_EMAIL_ADDR");
				var dragMakePlanDate = this.dsDocDtl.getdatabyname(nDragRow,"MAKE_PLAN_DATE");
				
				for(var iRow=nDragRow+1;iRow<=nDropRow;iRow++){
					this.dsDocDtl.setdatabyname(iRow,"ROW_STATUS", "I");
					this.dsDocDtl.setdatabyname(iRow,"PSO_DEPT_CODE", dragDeptCode);
					this.dsDocDtl.setdatabyname(iRow,"PSO_DEPT_NAME", dragDeptName);
					this.dsDocDtl.setdatabyname(iRow,"CHG_USER_ID", dragChgUserID);
					this.dsDocDtl.setdatabyname(iRow,"CHG_USER_NAME", dragChgUserNm);
					this.dsDocDtl.setdatabyname(iRow,"CHG_EMP_NO", dragChgEmpNo);
					this.dsDocDtl.setdatabyname(iRow,"CHG_EMAIL_ADDR", dragChgEmail);
					this.dsDocDtl.setdatabyname(iRow,"MAKE_PLAN_DATE", dragMakePlanDate);
				}
			//작성계획일 Drag
			} else if(nDragColumn == makePlanDateColIdx){
				var dragMakePlanDate = this.dsDocDtl.getdatabyname(nDragRow,"MAKE_PLAN_DATE");
				
				for(var iRow=nDragRow+1;iRow<=nDropRow;iRow++){
					this.dsDocDtl.setdatabyname(iRow,"MAKE_PLAN_DATE", dragMakePlanDate);
				}
			} else {
				return 0;
			}
		}
	} else {
		return 0;
	}
}

/*
* 붙여넣기 이벤트를 처리한다.
*/
function grdList_on_paste(objInst, strPasteValue, nRow, nColumn)
{
	//write 권한 체크
	if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"READ_WRITE") == "W" ) {
		//확정완료시
		if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"PSO_DOCU_STATUS") == "Y" ){
			return 0;
		} else {
			if(!UT.isNull(cpChgUserID) && this.grdList.getselectcolumn()==6){
				this.dsDocDtl.setdatabyname(nRow,"PSO_DEPT_CODE", cpDeptCode);
				this.dsDocDtl.setdatabyname(nRow,"PSO_DEPT_NAME", cpDeptName);
				this.dsDocDtl.setdatabyname(nRow,"CHG_USER_ID", cpChgUserID);
				this.dsDocDtl.setdatabyname(nRow,"CHG_USER_NAME", cpChgUserNm);
				this.dsDocDtl.setdatabyname(nRow,"CHG_EMAIL_ADDR", cpChgEmail);
				this.dsDocDtl.setdatabyname(nRow,"MAKE_PLAN_DATE", cpMakePlanDate);
			} else {
				return 0;	
			}
		}
	} else {
		return 0;
	}
	
	return 1;
}

/*
* Ctrl+C (복사) 키입력시 이벤트를 처리한다.
*/
function grdList_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown)
{
	//write 권한 체크
	if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"READ_WRITE") == "W" ) {
		//확정완료시
		if( this.dsDocMain.getdatabyname(this.dsDocMain.getpos(),"PSO_DOCU_STATUS") == "Y" ){
			return 1;
		} else {
		    var ncpRow = this.grdList.getselectrow();
			var ncpCol = this.grdList.getselectcolumn();
			if(ncpRow != -1 && ncpCol !=6){
				return 1;
			}
			
			if(bctrldown && keycode != 67){
				return 1;
			}
			
			cpDeptCode = this.dsDocDtl.getdatabyname(ncpRow,"PSO_DEPT_CODE");
			cpDeptName = this.dsDocDtl.getdatabyname(ncpRow,"PSO_DEPT_NAME");
			cpChgUserID = this.dsDocDtl.getdatabyname(ncpRow,"CHG_USER_ID");
			cpChgUserNm = this.dsDocDtl.getdatabyname(ncpRow,"CHG_USER_NAME");
			cpChgEmail = this.dsDocDtl.getdatabyname(ncpRow,"CHG_EMAIL_ADDR");
			cpMakePlanDate = this.dsDocDtl.getdatabyname(ncpRow,"MAKE_PLAN_DATE");
		}
	} else {
		return 1;
	}
	return 0;
}