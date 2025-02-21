/*------------------------------------
* program id : SmtSet1250
* desc	   : 도면관리
* dev date   : 2023-01-17
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
	
	//if(INI.GV_USER_TYPE == "V"){
		this.btnCommonSearch_on_mouseup();  //최초조회	
	//}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					// ou code set
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
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
	
	//사용자 유형 Control (외부사용자)
	if(INI.GV_USER_TYPE == "V"){
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_CODE",INI.GV_VENDOR_CODE);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_NAME",INI.GV_VENDOR_NAME);
		UT.gfnHrEditorStyle(this.edtVendorName, "D");
		this.btnVendorNamePop.setenable(false);
		
		this.btnPublish.setvisible(false);
		this.btnAddRow.setvisible(false);
		this.btnDelRow.setvisible(false);
		
		//그리드에서 협력업체 정보 숨기기
		this.grdList.enablecheckrow(false);
		
		this.grdList.setcolumnhidden(0, true);
		this.grdList.setcolumnhidden(1, true);
		this.grdList.setcolumnhidden(2, true);
		this.grdList.setcolumnhidden(4, true);
		this.grdList.setcolumnhidden(10, true);
	} else {
		this.btnPublish.setenable(true);
		this.btnAddRow.setenable(true);
		this.btnDelRow.setenable(true);
	}
	
	//계약일자set
	this.fldDateS.settext( UT.getDate("%Y") + "0101" );
	this.fldDateE.settext( UT.getDate("%Y%M%D"));
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
	
	if(recv_userheader == "SELECT")
	{		
		if(this.dsList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리
			
			var aryColumn = ["VENDOR_CODE_POP","ITEM_CODE_POP","BLUEPRINT_NO","RECEIPT_DATE","BLUEPRINT_EMP_POP","LAST_REVISION_DATE","REMARK","APPLY_DATE","REMARK_POP"];
			for(var i=0;i<this.dsList.getrowcount();i++){
				if(this.dsList.getdatabyname(i,"STATUS_CODE")=="W" && INI.GV_USER_TYPE == "U"){
					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "G");
				} else {
					GRD.gfnGrdCellHandle( this.grdList, i, aryColumn,"image","");
					GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
					this.grdList.setiteminputtype(i, 8, 0); //RECEIPT_DATE
					this.grdList.setiteminputtype(i , 11 ,0 ); //LAST_REVISION_DATE
					this.grdList.setiteminputtype(i , 13 ,0 ); //APPLY_DATE
				}
			}
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
* 계약관리 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_SMT_BLUEPRINT_V" ,"dsSearch" , "dsList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , true , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{

	// 필수 항목 체크 (데이터셋)
	var aryColumn = ["VENDOR_CODE","ITEM_CODE","BLUEPRINT_NO","RECEIPT_DATE","BLUEPRINT_EMP_NAME","LAST_REVISION_DATE","APPLY_DATE"];
	if(!UT.gfnVaildataionGrd(this.screen, this.grdList, aryColumn, false)){
		return false;
	}
	
	

	return true;
}
/*
* 저장
*/
function fnSaveData(alertshow){
	
	var rCnt = this.dsList.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var ouCode = this.dsList.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsList.setdatabyname(iRow, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") );
		}
		var blueprintId = this.dsList.getdatabyname(iRow,"BLUEPRINT_ID");
		if( UT.isNull(blueprintId)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsID , "NONE" , "CLEAR" ,  "" , "" , "TR_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_BLUEPRINT_ID" ,"" , "dsID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_BLUEPRINT_ID" , true , false , false , "TR_ID");
			var newBlueprintId = this.dsID.getdatabyname(this.dsID.getpos(),"SEQ");
			this.dsList.setdatabyname(iRow, "BLUEPRINT_ID", newBlueprintId);
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtMapper.INSERT_SMT_BLUEPRINT" , "ProcSmtMapper.UPDATE_SMT_BLUEPRINT" , "ProcSmtMapper.DELETE_SMT_BLUEPRINT" , "dsList" );					// 추가 수정
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

function fldDateS_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

/*
* 날짜 이상유무 확인
*/
function fldDateS_on_change(objInst, event_type)
{
	var datelen = this.fldDateS.gettext();
	
	if(datelen.length == "8"){
		if(this.fldDateS.gettext() != "" && this.fldDateE.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.fldDateS , this.fldDateE , true);
			if(!rt){
				this.fldDateS.settext("");
				this.fldDateS.setfocus();
			}
			
		}
	} 	
}

function fldDateE_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

/*
* 날짜 이상유무 확인
*/
function fldDateE_on_change(objInst, event_type)
{
	var datelen = this.fldDateE.gettext();
	
	if(datelen.length == "8"){
		if(this.fldDateS.gettext() != "" && this.fldDateE.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.fldDateS , this.fldDateE , true);
			if(!rt){
				this.fldDateE.settext("");
				this.fldDateE.setfocus();
			}
			
		}
	}
}

function edtVendorName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
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
	}
}

function btnVendorNamePop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorClosePopCallback";
	screen.loadportletpopup("VendorNameSelect", "/FRAME/popupVendor", "협력업체정보조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

function grdList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	var blChecked = GRD.gfnGrdRowIsChecked(this.grdList , nClickRow);
	
	if(blChecked){
		this.grdList.setcheckedrow(nClickRow , false);
	}else{
		this.grdList.setcheckedrow(nClickRow , true);
	}
}

function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	
	// 도면첨부 Poupup
	if(this.grdList.getcolumnname(nColumn) == "ATTACH_FILE_POP"){
		//필수 항목 검사		
        if( !this.fnValidForm()){
		   return;
         }
		this.grdList.setcheckedrow(this.grdList.getselectrow(), true);
		
		var statusCode = this.dsList.getdatabyname(this.dsList.getpos(),"STATUS_CODE");
		if(  statusCode=="W" && INI.GV_USER_TYPE=="U"){  //U:내부인 //W:대기
			var blueprintId = this.dsList.getdatabyname(this.dsList.getpos(),"BLUEPRINT_ID");
			if( UT.isNull(blueprintId)){
				TRN.gfnTranDataSetHandle(this.screen , this.dsID , "NONE" , "CLEAR" ,  "" , "" , "TR_ID");	
				TRN.gfnCommonTransactionClear(this.screen, "TR_ID");	//트랜젝션 데이터셋 초기화 (필수)	
				TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_BLUEPRINT_ID" ,"" , "dsID");	//조회만	
				TRN.gfnCommonTransactionRun(this.screen , "SELECT_BLUEPRINT_ID" , true , false , false , "TR_ID");
				var newBlueprintId = this.dsID.getdatabyname(this.dsID.getpos(),"SEQ");
				this.dsList.setdatabyname(this.dsList.getpos(), "BLUEPRINT_ID", newBlueprintId);
				
			}
	
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsList.getdatabyname(this.dsList.getpos(),"BLUEPRINT_ID");
			objPopupAttData.P_MODE = "W";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1250";
			objPopupAttData.P_REF_NAME = "BLUEPRINT";
			objPopupAttData.P_DIR_TYPE = "BLUEPRINT";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
			screen.loadportletpopup("AttFile1160", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		//업체확인 이후 첨부문서 수정불가
		} else {
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsList.getdatabyname(this.dsList.getpos(),"BLUEPRINT_ID");
			objPopupAttData.P_MODE = "R";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1250";
			objPopupAttData.P_REF_NAME = "BLUEPRINT";
			objPopupAttData.P_DIR_TYPE = "BLUEPRINT";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "";
			screen.loadportletpopup("AttFile1161", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		}		
	}
	// 기타 증빙첨부 Poupup
	if(this.grdList.getcolumnname(nColumn) == "ETC_ATTACH_FILE_POP"){
		//필수 항목 검사		
        if( !this.fnValidForm()){
		   return;
         }
		this.grdList.setcheckedrow(this.grdList.getselectrow(), true);
		
		var statusCode = this.dsList.getdatabyname(this.dsList.getpos(),"STATUS_CODE");
		if(  statusCode=="W" && INI.GV_USER_TYPE=="U"){  //U:내부인 //W:대기
			var blueprintId = this.dsList.getdatabyname(this.dsList.getpos(),"BLUEPRINT_ID");
			if( UT.isNull(blueprintId)){
				TRN.gfnTranDataSetHandle(this.screen , this.dsID , "NONE" , "CLEAR" ,  "" , "" , "TR_ID");	
				TRN.gfnCommonTransactionClear(this.screen, "TR_ID");	//트랜젝션 데이터셋 초기화 (필수)	
				TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_BLUEPRINT_ID" ,"" , "dsID");	//조회만	
				TRN.gfnCommonTransactionRun(this.screen , "SELECT_BLUEPRINT_ID" , true , false , false , "TR_ID");
				var newBlueprintId = this.dsID.getdatabyname(this.dsID.getpos(),"SEQ");
				this.dsList.setdatabyname(this.dsList.getpos(), "BLUEPRINT_ID", newBlueprintId);
			}
	
			var strPopupName = UT.gfnGetMetaData("", "기타 증빙첨부"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsList.getdatabyname(this.dsList.getpos(),"BLUEPRINT_ID");
			objPopupAttData.P_MODE = "W";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1250";
			objPopupAttData.P_REF_NAME = "ETC";
			objPopupAttData.P_DIR_TYPE = "BLUEPRINT";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
			screen.loadportletpopup("AttFile1160", "/FRAME/AttachFilePop", "기타 증빙첨부", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		//업체확인 이후 첨부문서 수정불가
		} else {
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = this.dsList.getdatabyname(this.dsList.getpos(),"BLUEPRINT_ID");
			objPopupAttData.P_MODE = "R";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1250";
			objPopupAttData.P_REF_NAME = "ETC";
			objPopupAttData.P_DIR_TYPE = "BLUEPRINT";
			objPopupAttData.P_OU_CODE = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "";
			screen.loadportletpopup("AttFile1161", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		}		
	}	
	
	//상태가 W:대기가 아니면 버튼 작동안함
	var statusCode = this.dsList.getdatabyname(this.grdList.getselectrow(),"STATUS_CODE");
	if(statusCode !="W" && !UT.isNull(statusCode)){
		return;
	}
	// 업체명 Poupup
    if(this.grdList.getcolumnname(nColumn) == "VENDOR_CODE_POP"){
		
		this.grdList.setcheckedrow(this.grdList.getselectrow(), true);
		
		var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
		objPopupExtraData.P_DATA2 = "";
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorCodeClosePopCallback";
		screen.loadportletpopup("VendorSelect", "/FRAME/popupVendor", "협력업체정보조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}
	// 품목명 Poupup
    if(this.grdList.getcolumnname(nColumn) == "ITEM_CODE_POP"){

        //협력업체를 먼저 선택했는지 확인 
		var vendorCode = this.dsList.getdatabyname(this.dsList.getpos(),"VENDOR_CODE");
		if(UT.isNull(vendorCode) ){
		    UT.alert(this.screen , "MSG548" , "협력업체를 먼저 선택하세요.");
			this.grdList.setfocus();
		    return false;
		}
		this.grdList.setcheckedrow(this.grdList.getselectrow(), true);
		
		var strPopupName = UT.gfnGetMetaData("", "품목조회"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
		objPopupExtraData.P_DATA2 = "";
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnItemClosePopCallback";
		screen.loadportletpopup("itemSelect", "/FRAME/popupItem", "품목정보조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}
	// 도면담당자 Poupup
    if(this.grdList.getcolumnname(nColumn) == "BLUEPRINT_EMP_POP"){

		
		this.grdList.setcheckedrow(this.grdList.getselectrow(), true);
		
		var strPopupName = UT.gfnGetMetaData("", "도면담당자조회"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
		objPopupExtraData.P_DATA2 = "";
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnEmpClosePopCallback";
		screen.loadportletpopup("itemSelect", "/FRAME/popupEmp", "도면담당자조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}
	
	
	// 비고 Poupup
    if(this.grdList.getcolumnname(nColumn) == "REMARK_POP"){

		
		this.grdList.setcheckedrow(this.grdList.getselectrow(), true);
		
		var strPopupName = UT.gfnGetMetaData("", "비고입력"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = this.dsList.getdatabyname(this.dsList.getpos(),"REMARK");
		objPopupExtraData.P_DATA2 = "";
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnRemarkClosePopCallback";
		screen.loadportletpopup("itemSelect", "/SMT/SmtSet1251", "비고입력", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}	
}
/*
* 그리드 비고 Callback
*/
function fnRemarkClosePopCallback(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "REMARK" , aryHash["REMARK"]);

	}
}
/*
* 그리드 업체정보 Callback
*/
function fnVendorCodeClosePopCallback(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsList.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);

	}
}
/*
* 그리드 품목정보 Callback
*/
function fnItemClosePopCallback(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "ITEM_CODE" , aryHash["ITEM_CODE"]);
		this.dsList.setdatabyname(iRow , "ITEM_NAME" , aryHash["ITEM_NAME"]);
		//REVISION 가져오기
        var vParam = "";	    
        vParam = "VENDOR_CODE="  + this.dsList.getdatabyname(this.dsList.getpos(),"VENDOR_CODE"); ;
        vParam = vParam + " ITEM_CODE=" + this.dsList.getdatabyname(this.dsList.getpos(),"ITEM_CODE"); 
        vParam = vParam + " OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
 
		TRN.gfnTranDataSetHandle(this.screen , this.dsRevision , "NONE" , "CLEAR" ,  "" , "" , "TR_REVISION");	
		TRN.gfnCommonTransactionClear(this.screen, "TR_REVISION");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_REVISION_NO" ,"" , "dsRevision",vParam);	//조회만	
		TRN.gfnCommonTransactionRun(this.screen , "SELECT_REVISION_NO" , true , false , false , "TR_REVISION");
		var revisionNo = this.dsRevision.getdatabyname(this.dsRevision.getpos(),"REVISION_NO");
		this.dsList.setdatabyname(this.dsList.getpos(), "REVISION_NO", revisionNo);
	}
}

/*
* 그리드 도면담당자정보 Callback
*/
function fnEmpClosePopCallback(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "BLUEPRINT_EMP_NO" , aryHash["EMP_NO"]);
		this.dsList.setdatabyname(iRow , "BLUEPRINT_EMP_NAME" , aryHash["EMP_NAME"]);

	}
}
/*
* 첨부파일 Callback
*/
function fnAttFilePopCallback(aryHash) 
{ 
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	// 저장한다
	this.fnSaveData(false);
	// 재조회
	this.fnSearch();
}

/*
* 행추가
*/
function btnAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,rowCount);
	this.dsList.setdatabyname(iRow , "STATUS_CODE" , "W");
	this.dsList.setdatabyname(iRow , "INS_USER_ID" , INI.GV_USER_ID);
	this.dsList.setdatabyname(iRow , "INS_USER_NAME" ,INI.GV_USER_ID_NM );	
}
/*
* 행삭제
*/
function btnDelRow_on_mouseup(objInst)
{
	var iRow = this.grdList.getselectrow();
	var statusCode = this.dsList.getdatabyname(iRow,"STATUS_CODE");
	if(statusCode != "W"){  //W: 대기
		UT.alert(screen,"MSG547","상태가 대기인 경우에만 삭제할 수 있습니다.");
        return;
	} else {
		GRD.gfnDeleteRow(this.screen,this.grdList);
	}
}


/*
* 배포
*/
function btnPublish_on_mouseup(objInst)
{
	if(this.grdList.getcheckedrowcount() == 0){
        UT.alert(screen,"MSG025","선택된 행이 없습니다.");
        return;
    }
    //저장
    this.fnSaveData(false);
	var nCheckedRow = -1 ;
	for(var iRow=0; iRow < this.grdList.getcheckedrowcount(); iRow++) {

		
		
		nCheckedRow = this.grdList.getcheckedrow(nCheckedRow+1);
		var chkFlag = this.dsList.getdatabyname(nCheckedRow,"ATTFILE_YN");
		//상태왁인 L:최신은 배포할 수 없음
		var statusCode = this.dsList.getdatabyname(nCheckedRow,"STATUS_CODE");
		if(statusCode == "L"){
			UT.alert(screen,"MSG551","상태가 최신인 경우 배포할 수 없습니다.");
        	return;
		}		
		//도면첨부 확인 
		if(chkFlag == "N"){
			UT.alert(screen,"MSG550","도면이 첨부되어 있어야 배포를 할 수 있습니다.");
        	return;
		} else {

		    var vParam = "";	    
            vParam = "VENDOR_CODE="  + this.dsList.getdatabyname(this.dsList.getpos(),"VENDOR_CODE"); ;
            vParam = vParam + " ITEM_CODE=" + this.dsList.getdatabyname(this.dsList.getpos(),"ITEM_CODE"); 
            vParam = vParam + " OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
            vParam = vParam + " REVISION_NO=" + this.dsList.getdatabyname(this.dsList.getpos(),"REVISION_NO");



//		    TRN.gfnTranDataSetHandle(this.screen, this.dsList, "NONE", "CLEAR", "", "", "TR_PUBLISH");
		    TRN.gfnCommonTransactionClear(this.screen,"TR_PUBLISH");
		    TRN.gfnCommonTransactionAddUpdate(this.screen ,"ProcSmtMapper.PUBLISH_SMT_BLUEPRINT" ,"",vParam);
			TRN.gfnCommonTransactionRun(this.screen , "PUBLISH_SMT_BLUEPRINT", true, false, false, "TR_PUBLISH");  		

		}
	}
	
	UT.alert(this.screen , "MSG041" , "처리 완료 되었습니다.");
	
	this.fnSearch();
}