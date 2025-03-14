/*------------------------------------
* program id : Pso1040
* desc	   : PSO개발착수등급산정관리
* dev date   : 2023-06-21
* made by    : SEYUN
*-------------------------------------*/

var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";
var fvMode = "";

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
		this.btnCommonSearch_on_mouseup();  //최초조회	
	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsIndGroup, "P006");	      // 제품산업군구분
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE);
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    }
	
	var objExtraData;
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
	if (objExtraData !== null) {
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"OU_CODE",objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"PSO_PROJECT_ID",objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"PROJECT_CODE",objExtraData.P_DATA3);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"R_BOARD_ID",objExtraData.P_DATA4);
		fvMode = objExtraData.P_DATA5;
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
	UT.gfnHrEditorStyle(this.fldRBStatus, "D");
	UT.gfnHrEditorStyle(this.fldTScore, "D");
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
		if(this.dsRBMain.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsRBMain.getrowcount());	//하단메세지 처리
			
			
			var aryColumn = ["MARK", "ITEM_DESC"];
			for(var i=0;i<this.dsRBDtl.getrowcount();i++){
				//write 권한 체크
				if( this.dsRBMain.getdatabyname(this.dsRBMain.getpos(),"READ_WRITE") == "W" ) {
					//확정완료시
					if( this.dsRBMain.getdatabyname(this.dsRBMain.getpos(),"R_BOARD_STATUS") == "Y" ){
						GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
					} else {
						GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "G");
					}
				} else {
					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
				}				
			}	
			this.grdList.refresh();
			
			//write 권한 체크
			if( this.dsRBMain.getdatabyname(this.dsRBMain.getpos(),"READ_WRITE") == "W" ) {
				//확정완료시
				if( this.dsRBMain.getdatabyname(this.dsRBMain.getpos(),"R_BOARD_STATUS") == "Y" ){
					this.btnCommonCreate.setenable(false);
					this.btnCommonSave.setenable(false);
					this.rdgIndG.setenable(false);
				} else {
					this.btnCommonCreate.setenable(true);
					this.btnCommonSave.setenable(true);
					this.rdgIndG.setenable(true);
				}
			} else {
				this.btnCommonCreate.setenable(false);
				this.btnCommonSave.setenable(false);
				this.rdgIndG.setenable(false);
			}
				
			this.fnSum();
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
	
	//프로젝트코드(R_BOARD_ID)
	var rBoardID = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"R_BOARD_ID");
	if(UT.isNull(rBoardID) ){
	    UT.alert(this.screen , "MSG228" , "프로젝트를 먼저 선택하세요.");
		this.edtProjectCode.setfocus();
	    return;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsRBMain , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsRBDtl , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_R_BOARD_MAIN" ,"dsSearch" , "dsRBMain");	//조회만	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_R_BOARD_DETAIL" ,"dsSearch" , "dsRBDtl");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "selectList" , true , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	
	if(UT.isNull(this.dsRBMain.getdatabyname(this.dsRBMain.getpos(),"IND_GROUP"))){
		UT.alert(this.screen, "MSG573", "제품 산업군 구분 먼저 선택하세요");
		return false;
	}
	
	// 항목선택 갯수 check 5개가 아닐경우 항목선택 누락
	var nCntY = UT.gfnGetCaseCount(this.dsRBDtl, "MARK", "Y");
	if(nCntY !== 5){
		UT.alert(this.screen, "MSG576", "선택 되지 않은 항목이 있습니다. (선택항목 : %%/5)" + "\n" +
		                                "확인 바랍니다.", nCntY);
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
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsRBMain , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsRBDtl , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddUpdate(this.screen , "OmsPsoMapper.UPDATE_PSO_R_BOARD_MAIN" , "dsRBMain" );					
	TRN.gfnCommonTransactionAddUpdate(this.screen , "OmsPsoMapper.UPDATE_PSO_R_BOARD_DETAIL" , "dsRBDtl" );					
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}
/*
* 생성 프로세스 호출
*/
function fnCreateDevDoc(){
	
	var iRow = this.dsRBMain.getpos();
	// 프로세스 호출
    var vParam = "";
    
    vParam = "USER_ID="  + INI.GV_USER_ID ;
    vParam += " OU_CODE=" + this.dsRBMain.getdatabyname(iRow,"OU_CODE") ;
    vParam += " PSO_PROJECT_ID=" + this.dsRBMain.getdatabyname(iRow,"PSO_PROJECT_ID") ;
    vParam += " PSO_R_BOARD_ID=" + this.dsRBMain.getdatabyname(iRow,"R_BOARD_ID") ;
    vParam += " LANGUAGE="  + INI.GV_LANG ;
    vParam += " X_RETCODE=" + "";
    vParam += " X_RETMESG=" + ""; 

    TRN.gfnTranDataSetHandle(this.screen, this.dsReturn, "", "", "", "", "TR_CREATE");
    TRN.gfnCommonTransactionClear(this.screen,"TR_CREATE");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsPsoMapper.PSO_DOCUMENT_CREATE_PROC" ,"","dsReturn",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, false, false, "TR_CREATE");  

	if(this.dsReturn.getdatabyname(this.dsReturn.getpos() ,"X_RETCODE") != "S"){
	    UT.alert(this.screen , "MSG475" , "생성 중 오류 발생 : %%", this.dsReturn.getdatabyname(this.dsReturn.getpos(), "X_RETMESG")); 
	    return;
	} else {
		UT.alert(this.screen , "MSG365" , "생성되었습니다");
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
			this.fnSaveData(false);
			this.fnCreateDevDoc();
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
    if( !this.fnValidForm()){
		return;
    }
	
	UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");
}

function btnCommonCreate_on_mouseup(objInst)
{
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	
	UT.confirm(this.screen,"MSG574","개발착수 등급표 확정 및 신제품 개발 서류목록을 생성하시겠습니까?","",0,"create_confirm");	
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

function grdList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	var strratingStep;
	var strdisplaySeq;
	var strScore;
	
	if(UT.isNull(this.dsRBMain.getdatabyname(this.dsRBMain.getpos(),"IND_GROUP"))){
		UT.alert(this.screen, "MSG573", "제품 산업군 구분 먼저 선택하세요");
		// 제품 산업군 구분이 선택되어 있지 않을 시, MARK 선택 되지 않음 added by yelee  250304
		this.dsRBDtl.setdatabyname(this.dsRBDtl.getpos(), "MARK", "N");
	} else {
		if(this.grdList.getcolumnname(nClickColumn) == "MARK"){
			if(this.dsRBDtl.getdatabyname(nClickRow, "MARK")=="Y"){
				strratingStep = this.dsRBDtl.getdatabyname(nClickRow, "RATING_STEP");
				strdisplaySeq = this.dsRBDtl.getdatabyname(nClickRow, "DISPLAY_SEQ");
				strScore = this.dsRBDtl.getdatabyname(nClickRow, "SCORE");
				
				for(var i=0;i<this.dsRBDtl.getrowcount();i++){ 
					if(this.dsRBDtl.getdatabyname(i, "RATING_STEP")==strratingStep){
						if(this.dsRBDtl.getdatabyname(i, "DISPLAY_SEQ")==strdisplaySeq){
							this.dsRBDtl.setdatabyname(i, "MARK", "Y");
							this.dsRBDtl.setdatabyname(i, "S_SCORE", strScore);
						} else {
							this.dsRBDtl.setdatabyname(i, "MARK", "N");
							this.dsRBDtl.setdatabyname(i, "S_SCORE", "");
						}
					}
				}
			}
		}
		this.fnSum();
	}
}

function fnSum()
{
	var result = 0;
	
	for(var i=0;i<this.dsRBDtl.getrowcount();i++){ 
		result = result + Number(this.dsRBDtl.getdatabyname(i, "S_SCORE"));
		//console.log("S_Score : " + this.dsRBDtl.getdatabyname(i, "S_SCORE"));
		//console.log("result : " + result);
	}
	this.grdList.setstatuserrowtext(0,4,result);
	
	this.dsRBMain.setdatabyname(this.dsRBMain.getpos(), "T_SCORE", result);
	
	// 개발등급 set
	if(this.dsRBMain.getdatabyname(this.dsRBMain.getpos(),"IND_GROUP")=="ETC"){
		this.dsRBMain.setdatabyname(this.dsRBMain.getpos(), "GRADE", "C" );
		this.dsRBMain.setdatabyname(this.dsRBMain.getpos(), "GRADE_NAME", "3등급" );
	} else {
	    var vParam = "";
	    vParam = "T_SCORE=" + this.dsRBMain.getdatabyname(this.dsRBMain.getpos(),"T_SCORE") ; 
	    
	    TRN.gfnTranDataSetHandle(this.screen, this.dsDevGrade, "NONE", "CLEAR", "", "", "TR_GRADE");
	    TRN.gfnCommonTransactionClear(this.screen,"TR_GRADE");
	    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsPsoMapper.SELECT_DEV_GRADE" ,"","dsDevGrade",vParam);
		TRN.gfnCommonTransactionRun(this.screen , "SelectGrade", true, false, false, "TR_GRADE");  
	
		if(!UT.isNull(this.dsDevGrade.getdatabyname(this.dsDevGrade.getpos() ,"ITEM_CODE"))){
			this.dsRBMain.setdatabyname(this.dsRBMain.getpos(), "GRADE", this.dsDevGrade.getdatabyname(this.dsDevGrade.getpos(),"ITEM_CODE") );
			this.dsRBMain.setdatabyname(this.dsRBMain.getpos(), "GRADE_NAME", this.dsDevGrade.getdatabyname(this.dsDevGrade.getpos(),"ITEM_NAME") );
		} 
	}
	
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
		this.dsSearch.setdatabyname(iRow , "R_BOARD_ID" , aryHash["R_BOARD_ID"]);
		this.btnCommonSearch_on_mouseup();
	} else {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , "");
		this.dsSearch.setdatabyname(iRow , "PSO_PROJECT_ID" , "");
		this.dsSearch.setdatabyname(iRow , "R_BOARD_ID" , "");
	}
}

function btnProjectCodePop_on_click(objInst)
{
	this.fnProjectCodePopupCall("");
}

function fnProjectCodePopupCall(projectCode) {
	var strPopupName = UT.gfnGetMetaData("LABEL02664", "PSO 프로젝트 개발 착수 등급 조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = projectCode;
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnProjectCodeClosePopCallback";
	screen.loadportletpopup("ProjectCodeSelect", "/PSO/Pso1041", strPopupName, false, 0, 0, 0, 1196, 440, true, true, false, objPopupExtraData);
}

function rdgIndG_on_itemclick(objInst, nIndex)
{
	this.fnSum();
}