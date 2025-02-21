/*------------------------------------
* program id : ADM01050
* desc	   : 코드관리
* dev date   : 2022-02-15
* made by    : SEYUN
*-------------------------------------*/


var fvStrSearchEndObjScnCd;	//조회 완료한 구분 코드
var treeSelectComCoId;         //트리에서 아이템 선택시 comcoid값을 담아준다. 수정시 이전값과 비교하기 위해서
var saveBeforeComCoId;         //저장시 선택되어 있는 dataset의 comcoid 값을 담아준다.
var saveBeforeItemId;          //저장시 선택되어 있는 tree의  item값을 담아준다.
var noneComcoFocusComco;       //트리 추가시 keyin한 comcoid값을 담아준다.
var tempKey = 1;
var beforeMode = "M";
var exsitAfter = 0;

var fvSelectedRow;	//그리드 선택된 row

// 팝업화면으로 전달할 파라미터 설정
var objPopupExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};
/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	
	this.fnDsSearchSet();   //검색조건 세팅	
	
	this.fnCoLangKind();    //언어종류 가져오기
	
	this.btnCommonSearch_on_mouseup();  //최초조회
	
	//UT.gfnComboFilterSet(this.screen , [this.cboLangScnCd]);	//해당 콤보에 필터 기능 적용   on_keydown on_focusout 사용
	
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	//dsSearch.setdatabyname(iRow , "OBJ_SCN_CD" , "CD");
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
	
	if(mapid == 'TR_GRP_CODE_INFO') //공통코드 그룹코드 데이터셋팅후
	{		
		if(this.dsGrpCode.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsGrpCode.getrowcount());	//하단메세지 처리
		}

	}
	else if(mapid == 'TR_SAVE_COM_CO')  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		
		this.dsGrpCode.deleteallrows();
		this.dsItemCode.deleteallrows();
		this.dsGrpLangInfo.deleteallrows();
		this.dsItemLangInfo.deleteallrows();
		this.fnGrpCodeData();
	}
	
}


/*
* 다국어(언어) 종류 가져오기
* DB조회 : TR_CO_LANG_KIND
*/
function fnCoLangKind(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsCommLangKind , "NONE" , "CLEAR" ,  "" , "" , "TR_CO_LANG_KIND");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_CO_LANG_KIND");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LANG_KIND" ,"" , "dsCommLangKind");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectCoLangKind" , true , true , false , "TR_CO_LANG_KIND");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 공통코드 그룹코드 데이터 가져오기.
* DB조회
*/
function fnGrpCodeData(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_GRP_CODE_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsGrpCode , "NONE" , "CLEAR" ,  "" , "" , "TR_GRP_CODE_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_GRP_CODE_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_COMM_GRP" ,"dsSearch" , "dsGrpCode", "TR_GRP_CODE_INFO");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectGrpCode" , true , true , true , "TR_GRP_CODE_INFO");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 공통코드 세부코드 데이터 가져오기.
* DB조회
*/
function fnItemCodeData(){		
	if (this.dsSeachGroupCode.getrowcount() == 0) {
		this.dsSeachGroupCode.removeallrows();
		this.dsSeachGroupCode.insertrow(0);
		this.dsSeachGroupCode.setdatabyname(0, "GRP_CODE", this.dsGrpCode.getdatabyname(fvSelectedRow, "GRP_CODE"));
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSeachGroupCode , "ALL" , "NONE" ,  "" , "" , "TR_ITEM_CODE_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsItemCode , "NONE" , "CLEAR" ,  "" , "" , "TR_ITEM_CODE_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_ITEM_CODE_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_COMM_CODE" ,"dsSeachGroupCode" , "dsItemCode", "TR_ITEM_CODE_INFO");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectItemCode" , true , true , true , "TR_ITEM_CODE_INFO");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 공통코드 그룹코드 다국어(언어) 데이터 가져오기.
* DB조회
*/
function fnGrpLangData(){		
	if (this.dsSeachGroupCode.getrowcount() == 0) {
		this.dsSeachGroupCode.removeallrows();
		this.dsSeachGroupCode.insertrow(0);
		this.dsSeachGroupCode.setdatabyname(0, "GRP_CODE", this.dsGrpCode.getdatabyname(fvSelectedRow, "GRP_CODE"));
	}
	
	//var strParam = "GRP_CODE="+this.dsGrpCode.getdatabyname(fvSelectedRow, "GRP_CODE"));
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSeachGroupCode , "ALL" , "NONE" ,  "" , "" , "TR_GRP_LANG_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsGrpLangInfo , "NONE" , "CLEAR" ,  "" , "" , "TR_GRP_LANG_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_GRP_LANG_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_GRP_LANG" ,"dsSeachGroupCode" , "dsGrpLangInfo", "TR_GRP_LANG_INFO");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectGrpLang" , true , true , true , "TR_GRP_LANG_INFO");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 공통코드 세부코드 다국어(언어) 데이터 가져오기.
* DB조회
*/
function fnItemLangData(){		
	this.dsSeachItemCode.removeallrows();
	this.dsSeachItemCode.insertrow(0);
	this.dsSeachItemCode.setdatabyname(0, "GRP_CODE", this.dsItemCode.getdatabyname(this.dsItemCode.getpos(), "GRP_CODE"));
	this.dsSeachItemCode.setdatabyname(0, "ITEM_CODE", this.dsItemCode.getdatabyname(this.dsItemCode.getpos(), "ITEM_CODE"));
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSeachItemCode , "ALL" , "NONE" ,  "" , "" , "TR_ITEM_LANG_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsItemLangInfo , "NONE" , "CLEAR" ,  "" , "" , "TR_ITEM_LANG_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_ITEM_LANG_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_ITEM_LANG" ,"dsSeachItemCode" , "dsItemLangInfo", "TR_ITEM_LANG_INFO");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectGrpLang" , true , true , true , "TR_ITEM_LANG_INFO");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

function fnSaveData(){
	TRN.gfnTranDataSetHandle(this.screen , this.dsGrpCode , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsItemCode , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO");							//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsGrpLangInfo , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsItemLangInfo , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO");						//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_COMM_GRP" , "systemMapper.UPDATE_SMT_COMM_GRP" , "systemMapper.DELETE_SMT_COMM_GRP", "dsGrpCode" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_COMM_CODE" , "systemMapper.UPDATE_SMT_COMM_CODE" , "systemMapper.DELETE_SMT_COMM_CODE", "dsItemCode" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_LANG_INFO" , "systemMapper.UPDATE_SMT_LANG_INFO" , "systemMapper.DELETE_SMT_LANG_INFO", "dsGrpLangInfo" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_LANG_INFO" , "systemMapper.UPDATE_SMT_LANG_INFO" , "systemMapper.DELETE_SMT_LANG_INFO", "dsItemLangInfo" );	// 추가 수정 삭제
	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , true , false , "TR_SAVE_COM_CO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}
/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	this.fnGrpCodeData();
}

/*
* 저장버튼 클릭시 이벤트 처리 : 저장(등록, 수정, 삭제)
*/
function btnCommonSave_on_mouseup(objInst)
{	
	var aryDual = [ "GRP_CODE","GRP_NAME"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdGrpInfo, aryDual, false))
	{
		return;
	}
	
	//그리드에서 중복확인
	var arr = ["GRP_CODE"];
	var dupResult = GRD.gfnGrdDuplicateCheck(this.screen, this.grdGrpInfo, arr);
	if (dupResult) {
		UT.alert(this.screen, "MSG358", "중복된 데이타가 존재합니다"); 
		return;
	}
	
	var aryDual1 = [ "ITEM_CODE","ITEM_NAME","ACTIVE_FLAG"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdCodeInfo, aryDual1, false))
	{
		return;
	}
	
	UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
}


/*
* 그룹코드 행추가 버튼 클릭시 이벤트
*/
function btnGrpAddRow_on_mouseup(objInst)
{
	var iRow = this.grdGrpInfo.getselectrow();
	GRD.gfnInsertRow(this.screen,this.grdGrpInfo,false,iRow + 1);
	this.grdGrpInfo.setitemeditstart(iRow + 1 , 0 , true);
	// 입력가능 하도록 설정
	var aryColumn = ["GRP_CODE","GRP_NAME","PARENT_GRP_CODE"];
	GRD.gfnHrGrdCellHandle(this.grdGrpInfo, iRow + 1, aryColumn, "G");
}

/*
* 그룹코드 행삭제 버튼 클릭시 이벤트
*/
function btnGrpDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdGrpInfo);
}

/*
*  그룹코드 클릭시 이벤트
*/
function grdGrpInfo_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	fvSelectedRow = nCurSelectRow;
	this.dsSeachGroupCode.removeallrows();
	this.fnItemCodeData(); 		// 세부코드 조회
	this.fnGrpLangData();
}

/*
* 세부코드 행추가 버튼 클릭시 이벤트
*/
function btnCodeAddRow_on_mouseup(objInst)
{
	var iRow = this.grdCodeInfo.getrowcount();
	//UT.alert(this.screen,"","rCnt : "+rCnt);
	
	GRD.gfnInsertRow(this.screen, this.grdCodeInfo, false, iRow);   
	
	// 입력가능 하도록 설정
	var aryColumn = ["ITEM_CODE"];
	GRD.gfnHrGrdCellHandle(this.grdCodeInfo, iRow, aryColumn, "G");
	
	this.dsItemCode.setdatabyname(iRow, "GRP_CODE", this.dsGrpCode.getdatabyname(this.dsGrpCode.getpos(),"GRP_CODE") );
	this.grdCodeInfo.setitemeditstart(iRow, 0 , true);
}

/*
* 세부코드 행삭제 버튼 클릭시 이벤트
*/
function btnCodeDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdCodeInfo);
}

/*
* 그룹코드 다국어 행추가 버튼 클릭시 이벤트
*/
function btnGrpLngAddRow_on_mouseup(objInst)
{
	var iRow = GRD.gfnInsertRow(this.screen,this.grdLangInfo,false);
	this.dsGrpLangInfo.setdatabyname(iRow, "OBJ_CD", this.dsGrpCode.getdatabyname(this.dsGrpCode.getpos(),"GRP_CODE") );
	this.dsGrpLangInfo.setdatabyname(iRow, "OBJ_SCN_CD", "GRP_CODE");  // 그룹코드로 set
	
}

/*
* 그룹코드 다국어 행삭제 버튼 클릭시 이벤트
*/
function btnGrpLangDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdLangInfo);
}

/*
* 세부코드 다국어 행추가 버튼 클릭시 이벤트
*/
function btnItemLangAddRow_on_mouseup(objInst)
{
	var iRow = GRD.gfnInsertRow(this.screen,this.grdLangCodeInfo,false);
	this.dsItemLangInfo.setdatabyname(iRow, "OBJ_CD", this.dsItemCode.getdatabyname(this.dsItemCode.getpos(),"ITEM_CODE") );
	this.dsItemLangInfo.setdatabyname(iRow, "OBJ_SCN_CD", "ITEM_CODE");  // 세부코드로 set
	this.dsItemLangInfo.setdatabyname(iRow, "SUB_OBJ_CD", this.dsItemCode.getdatabyname(this.dsItemCode.getpos(),"GRP_CODE") );  // 그룹코드로 set
}

/*
* 세부코드 다국어 행삭제 버튼 클릭시 이벤트
*/
function btnItemLangDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdLangCodeInfo);
}

/*
*  상세코드 클릭시 이벤트
*/
function grdCodeInfo_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	if (this.dsItemCode.getrowoperation(this.dsItemCode.getpos()) != "I"){
		this.fnItemLangData();
	}
}

function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
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

function btnGrpCodePop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "공통코드조회"); 
	
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"GRP_CODE");
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnGrpItemCodeClosePopCallback";
	
	screen.loadportletpopup("GrpCodeSelect", "/SMT/SmtSet1021", "공통코드조회", false, 0, 0, 0, 820, 410, true, true, false, objPopupExtraData);

}

function btnGrpNamePop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "공통코드조회"); 
	
	objPopupExtraData.P_DATA2 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"GRP_NAME");
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnGrpItemCodeClosePopCallback";
	
	screen.loadportletpopup("GrpCodeNameSelect", "/SMT/SmtSet1021", "공통코드조회", false, 0, 0, 0, 820, 410, true, true, false, objPopupExtraData);
}

function btnItemCodePop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "공통코드조회"); 
	
	objPopupExtraData.P_DATA3 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ITEM_CODE");
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnGrpItemCodeClosePopCallback";
	
	screen.loadportletpopup("GrpCodeNameSelect", "/SMT/SmtSet1021", "공통코드조회", false, 0, 0, 0, 820, 410, true, true, false, objPopupExtraData);
}

function btnItemNamePop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "공통코드조회"); 
	
	objPopupExtraData.P_DATA4 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ITEM_NAME");
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnGrpItemCodeClosePopCallback";
	
	screen.loadportletpopup("GrpCodeNameSelect", "/SMT/SmtSet1021", "공통코드조회", false, 0, 0, 0, 820, 410, true, true, false, objPopupExtraData);
}

function fnGrpItemCodeClosePopCallback(aryHash) 
{ 
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(this.dsSearch.getpos() , "GRP_CODE" , aryHash["GRP_CODE"]);
		this.dsSearch.setdatabyname(this.dsSearch.getpos() , "GRP_NAME" , aryHash["GRP_NAME"]);
		this.dsSearch.setdatabyname(this.dsSearch.getpos() , "ITEM_CODE" , aryHash["ITEM_CODE"]);
		this.dsSearch.setdatabyname(this.dsSearch.getpos() , "ITEM_NAME" , aryHash["ITEM_NAME"]);
	}
	
	// 설정했던 objPopupExtraData값 초기화
	objPopupExtraData.P_DATA1 = "";
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.P_DATA4 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "";
	
	this.btnCommonSearch_on_mouseup();	
}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}

function edtGrpCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtGrpName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtItemCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtItemName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}