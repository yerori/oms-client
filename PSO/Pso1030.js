/*------------------------------------
* program id : Pso1030
* desc	   : PSO대상프로젝트관리
* dev date   : 2023-06-21
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
	INI.init(this.screen);  	// 모든 폼 Onload 최초 공통
	
	this.fnChgCodeLoad();       // PM담당자 정보 Load
	this.fnDsSearchSet();   	//검색조건 세팅	
	
//	if(INI.GV_USER_TYPE == "V"){
//		this.btnCommonSearch_on_mouseup();  //최초조회	
//	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsPsoTarget, "P005");	     // PSO대상프로젝트여부
	UT.gfnTranceCodeSet(this.dsPsoTarget, "N");  	     // 빈줄추가
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE);
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    }

	//PM담당자 초기화
	if( INI.GV_USER_BIZ_DIV == "PM" && UT.gfnFindRow(this.dsPMchg,"PM_CHG_ID",INI.GV_USER_ID) != -1 ){
	   this.cboPmChg.setselectedcode(INI.GV_USER_ID);
    }
	
		
//	//사용자 권한 Control
//    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
//        fvauthScope = "DEPT";
//    } else {
//		if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
//	    	fvauthScope = "EMP";  
//	    } else{
//        	fvauthScope = "PINFO";
//        }  
//    }
		
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
	
	if(recv_userheader == "selectList")
	{		
		if(this.dsPsoList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsPsoList.getrowcount());	//하단메세지 처리
			
			var aryColumn = ["PSO_TARGET_YN","NO_TARGET_REASON","PSO_CREATE_YN"];
			for(var i=0;i<this.dsPsoList.getrowcount();i++){

//				button text가 null일 시에만 set text 250221 by.yelee				
//				if(!UT.isNull(UT.gfnGetMetaData("LABEL02627",""))){	
				if(UT.isNull(UT.gfnGetMetaData("LABEL02627",""))){
					this.grdList.setcolumnbuttontext(this.grdList.getcolumn("PSO_CREATE_YN"), UT.gfnGetMetaData("LABEL02627",""));
				}
				
				//사용자 권한 Control (PM담당자만 수정,생성가능)
				if (INI.GV_USER_BIZ_DIV == "PM") {
					if( this.dsPsoList.getdatabyname(i,"PSO_TARGET_YN") == "S" ){
						GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "G");
					} else {
						if( this.dsPsoList.getdatabyname(i,"PSO_CREATE_YN") == "Y" ){
							GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
						} else {
							if( this.dsPsoList.getdatabyname(i,"PSO_TARGET_YN") == "Y" ){
								GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "G");
							} else {
								GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
							}
						}
					}
				} else {
					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
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
* PM담당자 코드를 로드합니다
*/
function fnChgCodeLoad(){
	
	var params = "";
	params = params + " OU_CODE=" + INI.GV_OU_CODE;
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsPMchg , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_CODE_CHG");
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_CODE_CHG");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_PROJECT_CHARGE" , "" , "dsPMchg" , params);
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadChg" , true , false , false , "TR_SELECT_CODE_CHG");	

	UT.gfnTranceCodeSet(this.dsPMchg, "N");  	     // 빈줄추가
}

/*
* 개발착수등급산정표 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	var ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	if(UT.isNull(ouCode) ){
	    UT.alert(this.screen , "MSG582" , "회사를 먼저 선택바랍니다.");
		this.cboOuCode.setfocus();
	    return;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_PROJECT_MSTR" ,"dsSearch" , "dsPsoList");	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectList" , true , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	var strMsg = "";
	var strProjectCode = "";
	for(var i=0;i<this.dsPsoList.getrowcount();i++){
		if(this.dsPsoList.getdatabyname(i, "PSO_TARGET_YN") == "N"){
			if(UT.isNull(this.dsPsoList.getdatabyname(i, "NO_TARGET_REASON"))){
				strProjectCode = this.dsPsoList.getdatabyname(i, "PROJECT_CODE");
				strMsg = "해당 프로젝트(" + strProjectCode + ")의 비대상 사유를 반드시 입력바랍니다."
				UT.gfnShowError(this.screen, "MSG562", strMsg, strProjectCode);
				
				this.grdList.setselectrow(i);
				this.grdList.setitemeditable(this.grdList.getselectrow(), this.grdList.getcolumn("NO_TARGET_REASON"),true);
				
				var iCell = this.grdList.getcolumn("NO_TARGET_REASON");
				this.grdList.setselectitem(this.grdList.getselectrow(), iCell);
				this.grdList.setfocus();
				this.grdList.setitemeditstart(this.grdList.getselectrow() , iCell , true);
			
				return false;
			}
		}
	}
	
//	//필수 항목 검사
//	var aryDual = ["NO_TARGET_REASON"];
//    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
//	{
//		return false;
//	}
	
//	//그리드에서 중복확인
//	var arr = ["CUSTOMER_NAME"];
//	var dupResult = GRD.gfnGrdDuplicateCheck(this.screen, this.grdList, arr);
//	if (dupResult) {
//		UT.alert(this.screen, "MSG358", "중복된 데이타가 존재합니다"); 
//		return false;
//	}
	
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
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddUpdate(this.screen , "OmsPsoMapper.UPDATE_PSO_PROJECT_MSTR" , "dsPsoList" );					// 추가 수정
	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}
/*
* 생성 프로세스 호출
*/
function fnCreateRBoard(){
	
	var iRow = this.grdList.getselectrow();
	// 프로세스 호출
    var vParam = "";
    
    vParam = "USER_ID="  + INI.GV_USER_ID ;
    vParam += " OU_CODE=" + this.dsPsoList.getdatabyname(iRow,"OU_CODE") ;
    vParam += " PSO_PROJECT_ID=" + this.dsPsoList.getdatabyname(iRow,"PSO_PROJECT_ID") ;
    vParam += " LANGUAGE="  + INI.GV_LANG ;
    vParam += " X_RETCODE=" + "";
    vParam += " X_RETMESG=" + ""; 

    TRN.gfnTranDataSetHandle(this.screen, this.dsReturn, "", "", "", "", "TR_CREATE");
    TRN.gfnCommonTransactionClear(this.screen,"TR_CREATE");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsPsoMapper.PSO_R_BOARD_CREATE_PROC" ,"","dsReturn",vParam);
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
			this.fnCreateRBoard();
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

function cboOuCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	if(this.grdList.getcolumnname(nColumn) == "PSO_TARGET_YN"){
		if( this.dsPsoList.getdatabyname(this.dsPsoList.getpos(),"PSO_CREATE_YN") == "N" ){
			if( this.dsPsoList.getdatabyname(this.dsPsoList.getpos(),"PSO_TARGET_YN") == "Y" ){
				this.grdList.setitemeditable(this.grdList.getselectrow(), this.grdList.getcolumn("NO_TARGET_REASON"),false);
			} else if ( this.dsPsoList.getdatabyname(this.dsPsoList.getpos(),"PSO_TARGET_YN") == "N" ){
				this.grdList.setitemeditable(this.grdList.getselectrow(), this.grdList.getcolumn("NO_TARGET_REASON"),true);
				
				var iCell = this.grdList.getcolumn("NO_TARGET_REASON");
				this.grdList.setselectitem(this.grdList.getselectrow(), iCell);
				this.grdList.setfocus();
				this.grdList.setitemeditstart(this.grdList.getselectrow() , iCell , true);
			}
		}
	}
	this.grdList.setcheckedrow(this.grdList.getselectrow(), true);
}

function grdList_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.grdList.setcheckedrow(nDblClickRow, false);
	
	var psoProjectID = this.dsPsoList.getdatabyname(this.dsPsoList.getpos(),"PSO_PROJECT_ID");
	var projectCode = this.dsPsoList.getdatabyname(this.dsPsoList.getpos(),"PROJECT_CODE");
	var rboaardID = this.dsPsoList.getdatabyname(this.dsPsoList.getpos(),"R_BOARD_ID");
	if( UT.isNull(rboaardID) ){
		UT.alert(this.screen , "MSG581" , "개발착수 등급표 생성된 라인을 선택하세요.");
		return;
	}
	
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = INI.GV_OU_CODE;
	objPopupExtraData.P_DATA2 = psoProjectID;	
	objPopupExtraData.P_DATA3 = projectCode;
	objPopupExtraData.P_DATA4 = rboaardID;
	objPopupExtraData.P_DATA5 = "V";	
	
	UT.gfnOpenMenuByURL("/PSO/Pso1040",objPopupExtraData);
	
}

function grdList_on_itembtnclick(objInst, nClickRow, nClickColumn)
{
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	
	if( this.dsPsoList.getdatabyname(this.dsPsoList.getpos(),"PSO_TARGET_YN") == "N" ){
		UT.confirm(this.screen,"MSG043","저장 하시겠습니까?","",0,"save_confirm");
	} else if ( this.dsPsoList.getdatabyname(this.dsPsoList.getpos(),"PSO_TARGET_YN") == "Y" ){
		UT.confirm(this.screen,"MSG566","해당 프로젝트의 개발착수 등급표를 생성하시겠습니까?","",0,"create_confirm");	
	}
}

function grdList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.grdList.setcheckedrow(nClickRow, true);
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
	} else {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , "");
	}
}

function btnProjectCodePop_on_click(objInst)
{
	this.fnProjectCodePopupCall("");
}

function fnProjectCodePopupCall(projectCode) {
	var strPopupName = UT.gfnGetMetaData("LABEL02628", "PSO 프로젝트 조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = projectCode;
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnProjectCodeClosePopCallback";
	screen.loadportletpopup("ProjectCodeSelect", "/PSO/Pso1031", strPopupName, false, 0, 0, 0, 1196, 440, true, true, false, objPopupExtraData);
}

function cboPsoTarget_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function cboPmChg_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}