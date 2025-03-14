/*------------------------------------
* program id : Pso1020
* desc	   : 개발착수등급산정표
* dev date   : 2023-05-30
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
	
	// user type이 V => OMS가 아닌 E-Procument 프로그램 250313 by.yelee
	//	if(INI.GV_USER_TYPE == "V"){
	//		this.btnCommonSearch_on_mouseup();  //최초조회	
	//	}
	this.btnCommonSearch_on_mouseup();  //최초조회	
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					// ou code set
	UT.gfnGetCommCodes(this.dsRatingStep, "P004");	  // 등급산정항목
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	this.dptStdDate.settext( UT.getDate("%Y%M%D"));
	
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
	
	if(recv_userheader == "selectRbList")
	{		
		if(this.dsRbList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsRbList.getrowcount());	//하단메세지 처리
			
//			var aryColumn = ["TAX_REG_NUMBER"];
//			for(var i=0;i<this.dsCustList.getrowcount();i++){
//				if( !UT.isNull(this.dsCustList.getdatabyname(i,"ERP_CUSTOMER_ID")) || !UT.isNull(this.dsCustList.getdatabyname(i,"ERP_CUSTOMER_NAME")) ){
//					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
//				} else {
//					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "G");
//				}
//			}
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
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsRbList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_RATING_BOARD" ,"dsSearch" , "dsRbList");	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectRbList" , true , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	var aryDual = ["RATING_STEP" ,"DISPLAY_SEQ" ,"TYPE", "SCORE","EFFECTIVE_START_DATE"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return false;
	}
	
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
	
	var rCnt = this.dsRbList.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var ouCode = this.dsRbList.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsRbList.setdatabyname(iRow, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") );
		}
		var rating_id = this.dsRbList.getdatabyname(iRow,"RATING_ID");
		if( UT.isNull(rating_id)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsRbID , "NONE" , "CLEAR" ,  "" , "" , "TR_RATING_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_RATING_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_RATING_ID_SEQ" ,"" , "dsRbID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_PSO_DOC_ID_SEQ" , true , false , false , "TR_RATING_ID");
			var newrating_id = this.dsRbID.getdatabyname(this.dsRbID.getpos(),"SEQ");
			this.dsRbList.setdatabyname(iRow, "RATING_ID", newrating_id);
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsRbList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsPsoMapper.INSERT_PSO_RATING_BOARD" , "OmsPsoMapper.UPDATE_PSO_RATING_BOARD" , "OmsPsoMapper.DELETE_PSO_RATING_BOARD" , "dsRbList" );					// 추가 수정
	
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

function dptStdDate_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

/*
* 행추가
*/
function btnAddRow_on_mouseup(objInst)
{
	var iRow = this.grdList.getselectrow();
	GRD.gfnInsertRow(this.screen,this.grdList,false,iRow + 1);
}