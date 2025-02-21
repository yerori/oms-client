/*------------------------------------
* program id : SmtSet1030
* desc	   : 법인등록
* dev date   : 2022-02-21
* made by	: SEYUN
*-------------------------------------*/

// RGB Backcolor Editable False
var vRGB_BEF = factory.rgb(247, 251, 255);

// 파일첨부 팝업화면으로 전달할 파라미터 설정
var objPopupAttData = {
	P_ATT_ID: "",      	   // 팝업화면으로 전달할 데이터0
	P_REF_ID: "",      	   // 팝업화면으로 전달할 데이터1
	P_MODE: "",			   // 팝업화면으로 전달할 데이터1
	P_FILE_GUBUN: "",	     // 팝업화면으로 전달할 데이터2
	P_REF_NAME: "",	       // 팝업화면으로 전달할 데이터3
	P_DIR_TYPE: "",	       // 팝업화면으로 전달할 데이터4
	P_OU_CODE: "",	        // 팝업화면으로 전달할 데이터5
	RET_FUNC_NAME: ""  	   // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};

// 우편번호 & 주소
var fvMstPostCode = "";
var fvMstRoadAddress = "";

// 우편번호 & 주소 (사업장)
var fvSitePostCode = "";
var fvSiteRoadAddress = "";

// RGB
var vRGB_BEF = factory.rgb(247, 251, 255);
	
/* 화면 로드 */
function screen_on_load(){
	// console.log("screen_on_load");
	
	INI.init(this.screen); // 초기화(공통)
	this.fn_init();        // 초기화(개별)
}

/* 초기화(개별) */
function fn_init(){
	// console.log("fn_init");	
	
	// 공통 코드 조회
	this.tr_select_code();
	
	// 법인 코드 조회
	this.tr_select_code_ou();
	
	// 조회 조건 초기화
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	this.dsSearch.setdatabyname(iRow, "OU_CODE", INI.GV_OU_CODE);
	
	// 법인 변경 권한 적용
	if(INI.GV_AT_OU == "Y")
		this.eds_OU_CODE.setenable(true);
	else
		this.eds_OU_CODE.setenable(false);

    // 생성 권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_C")) {
        this.btnAddRow.setenable(false);
    }

    // 수정 권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_U")) {
        this.btnAttch.setenable(false);
    }

    // 삭제 권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_D")) {
        this.btnDelRow.setenable(false);
    }

	// EditorStyle 셋팅 (Required, General, Disable)
	UT.gfnHrEditorStyle(this.edt_JIKIN_YN, "D");
	
	// 조회
	this.btnCommonSearch_on_mouseup();
}

/* 트랜젝션 콜백 */
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg){
	// console.log("screen_on_submitcomplete");
	
	UT.gfnWaitDestroy(screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(mapid == 'TR_SELECT_CODE_OU'){
		if(this.dsCode_OU.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");   // 경고창
			UT.statMsg(screen , "MSG001" , "검색 결과가 없습니다."); // 메세지바
			return;
		}else{
			if(UT.isNull(this.dsMaster.getdatabyname(0, "OU_CODE"))){
				this.dsSearch.setdatabyname(0, "OU_CODE" , this.dsCode_OU.getdatabyname(0, "CODE"));
			}else{
				this.dsSearch.setdatabyname(0, "OU_CODE" , this.dsMaster.getdatabyname(0, "OU_CODE"));
			}
		}
	}else if(mapid == 'TR_SELECT_MASTER'){
		if(this.dsMaster.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");   // 경고창
			UT.statMsg(screen , "MSG001" , "검색 결과가 없습니다."); // 메세지바
			return;
		}else{
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsMaster.getrowcount()); // 메세지바
			
			// EditorStyle 셋팅 (Required, General, Disable)
			UT.gfnHrEditorStyle(this.edt_OU_CODE, "D");
		}
	}else if(mapid == 'TR_SELECT_DETAIL'){
		if(this.dsDetail.getrowcount() != 0){
			// 컬럼 editable false 처리
			var aryColumn = ["SITE_CODE"];
			for(var iRow = 0; iRow < this.dsDetail.getrowcount(); iRow++) {
				GRD.gfnGrdCellHandle(this.grdDetail, iRow, aryColumn, "editable", false);
				GRD.gfnGrdCellHandle(this.grdDetail, iRow, aryColumn, "backcolor", vRGB_BEF);
			}
		}
	}else if(mapid == 'TR_SAVE'){
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");   // 경고창
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다."); // 메세지바
		
		this.tr_select_code_ou();
		this.tr_select_master();
		this.tr_select_detail()
	}
}

/* 공통코드 조회 */
function tr_select_code(){
	// console.log("tr_select_code");

	//법인/개인구분
	var params = "GRP_CODE=F002 NOT_IN=NO"; // [NOT_IN=그룹코드] 또는 [NOT_IN=NO]
	TRN.gfnTranDataSetHandle(this.screen , this.dsCode_F002 , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_CODE_F002");
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_CODE_F002");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE" , "" , "dsCode_F002" , params);
	TRN.gfnCommonTransactionRun(this.screen , "logicType_COMM_CODE_F002" , true , false , false , "TR_SELECT_CODE_F002");
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
	
	//법인구분
	var params = "GRP_CODE=F003 NOT_IN=NO"; // [NOT_IN=그룹코드] 또는 [NOT_IN=NO]
	TRN.gfnTranDataSetHandle(this.screen , this.dsCode_F003 , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_CODE_F003");
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_CODE_F003");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE" , "" , "dsCode_F003" , params);
	TRN.gfnCommonTransactionRun(this.screen , "logicType_COMM_CODE_F003" , true , false , false , "TR_SELECT_CODE_F003");			

	//법인규모
	var params = "GRP_CODE=F004 NOT_IN=NO"; // [NOT_IN=그룹코드] 또는 [NOT_IN=NO]
	TRN.gfnTranDataSetHandle(this.screen , this.dsCode_F004 , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_CODE_F004");
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_CODE_F004");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE" , "" , "dsCode_F004" , params);
	
	TRN.gfnCommonTransactionRun(this.screen , "logicType_COMM_CODE_F004" , true , false , false , "TR_SELECT_CODE_F004");			
	
	//소재지구분
	var params = "GRP_CODE=F006 NOT_IN=NO"; // [NOT_IN=그룹코드] 또는 [NOT_IN=NO]
	TRN.gfnTranDataSetHandle(this.screen , this.dsCode_F006 , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_CODE_F006");
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_CODE_F006");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE" , "" , "dsCode_F006" , params);
	TRN.gfnCommonTransactionRun(this.screen , "logicType_COMM_CODE_F006" , true , false , false , "TR_SELECT_CODE_F006");			

	//외국인여부
	var params = "GRP_CODE=F009 NOT_IN=NO"; // [NOT_IN=그룹코드] 또는 [NOT_IN=NO]
	TRN.gfnTranDataSetHandle(this.screen , this.dsCode_F009 , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_CODE_F009");
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_CODE_F009");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE" , "" , "dsCode_F009" , params);
	TRN.gfnCommonTransactionRun(this.screen , "logicType_COMM_CODE_F009" , true , false , false , "TR_SELECT_CODE_F009");	
	
	UT.gfnGetCommCodes(this.dsCode_H503, "H503"); // 선후불구분
	UT.gfnGetCommCodes(this.dsCode_F021, "F021"); // 관할세무서
	UT.gfnTranceCodeSet(this.dsCode_H503, "N");
	UT.gfnTranceCodeSet(this.dsCode_F021, "N");
}

/* 법인코드 조회 */
function tr_select_code_ou(){
	// console.log("tr_select_code_ou");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsCode_OU , "NONE" , "CLEAR" ,  "" , "" , "TR_SELECT_CODE_OU");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SELECT_CODE_OU");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_OU_CODE" ,"" , "dsCode_OU", "TR_SELECT_CODE_OU");
	TRN.gfnCommonTransactionRun(this.screen , "logicType_SELECT_OU_CODE" , true , true , true , "TR_SELECT_CODE_OU");
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
}

/* 마스터 조회 */
function tr_select_master(){
	// console.log("tr_select_master");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SELECT_MASTER");
	TRN.gfnTranDataSetHandle(this.screen , this.dsMaster , "NONE" , "CLEAR" ,  "" , "" , "TR_SELECT_MASTER");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SELECT_MASTER");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_OU_MSTR" ,"dsSearch" , "dsMaster", "TR_SELECT_MASTER");
	TRN.gfnCommonTransactionRun(this.screen , "logicType_SELECT_MASTER" , true , true , true , "TR_SELECT_MASTER");
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
}

/* 디테일 조회 */
function tr_select_detail(){
	// console.log("tr_select_detail");

	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SELECT_DETAIL");
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetail , "NONE" , "CLEAR" ,  "" , "" , "TR_SELECT_DETAIL");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SELECT_DETAIL");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_SITE_MSTR" ,"dsSearch" , "dsDetail", "TR_SELECT_DETAIL");
	TRN.gfnCommonTransactionRun(this.screen , "logicType_SELECT_DETAIL" , true , true , true , "TR_SELECT_DETAIL");
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
}

/* 저장 */
function tr_save(){
	// console.log("tr_save");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMaster , "ALL" , "NONE" ,  "" , "" , "TR_SAVE");						
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetail , "ALL" , "NONE" ,  "" , "" , "TR_SAVE");						
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE");	
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_OU_MSTR" , "systemMapper.UPDATE_SMT_OU_MSTR" , "systemMapper.DELETE_SMT_OU_MSTR", "dsMaster" );	
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_SITE_MSTR" , "systemMapper.UPDATE_SMT_SITE_MSTR" , "systemMapper.DELETE_SMT_SITE_MSTR", "dsDetail" );	
	TRN.gfnCommonTransactionRun(this.screen , "logicType_MASTER_SAVE" , true , true , false , "TR_SAVE");
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
}

/* 조회 버튼 클릭 */
function btnCommonSearch_on_mouseup(objInst){
	// console.log("btnCommonSearch_on_mouseup");
	
	this.tr_select_master();
	this.tr_select_detail();
}

/* 저장 버튼 클릭 */
function btnCommonSave_on_mouseup(objInst){
	// console.log("btnCommonSave_on_mouseup");

	// 필수 항목 체크
	var aryColumn = ["OU_CODE","OU_USER_CODE","OU_NAME","EMP_NO_GUBUN","OU_OWN_NO"];
	if(!UT.gfnVaildataionDsNeo(this.screen,this.dsMaster, aryColumn, false)){
		return;
	}
		
	// 필수 항목 체크
	var aryColumn = ["SITE_NAME","SITE_CODE","SITE_ST_DATE","SITE_ED_DATE"];
	if(!UT.gfnVaildataionGrd(this.screen,this.grdDetail, aryColumn, false)){
		return;
	}

	// 날짜 FROM-TO 체크 (법인 개업일/폐업일)
	/*
	var frDate = this.dsMaster.getdatabyname(0,"OU_OPEN_DATE");
	var toDate = this.dsMaster.getdatabyname(0,"OU_CLOSE_DATE");
	if(!UT.isNull(frDate) && !UT.isNull(toDate)) {
		if(!UT.gfnDateStrDiff(screen, frDate, toDate, false)){
			return;
		}
	}
	*/
	
	// 날짜 FROM-TO 체크 (사업장 시작일/종료일)
	for(var iRow = 0; iRow < this.dsDetail.getrowcount(); iRow++) {
		if(!UT.gfnDateStrDiff(screen, this.dsDetail.getdatabyname(iRow,"SITE_ST_DATE"), this.dsDetail.getdatabyname(iRow,"SITE_ED_DATE"), false)){
			return;
		}
	}

	this.tr_save();
}

/* 신규 버튼 클릭 */
function btnCommonCreate_on_mouseup(objInst){
	// console.log("btnNew_on_mouseup");

	this.dsMaster.init();
	this.dsMaster.addrow();
	this.edt_OU_CODE.setfocus(); 
	
	this.dsDetail.init();
	
	// EditorStyle 셋팅 (Required, General, Disable)
	UT.gfnHrEditorStyle(this.edt_OU_CODE, "G");
}

/* 삭제 버튼 클릭 */
function btnCommonDelete_on_mouseup(objInst){
	// console.log("btnDel_on_mouseup");
	
	// 데이터셋 삭제
	this.dsDetail.deleteallrows();
	//this.dsMaster.deleterow();
	this.dsMaster.deleteallrows();

	// 저장
	this.btnCommonSave_on_mouseup();
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

/* 행추가 버튼 클릭 */
function btnAddRow_on_mouseup(objInst){
	// console.log("btnAddRow_on_mouseup");

	// 필수 항목 체크 (선행 입력 필요 항목)
	var aryColumn = ["OU_CODE","OU_NAME"];
	if(!UT.gfnVaildataionDsNeo(this.screen,this.dsMaster, aryColumn, false)){
		return;
	}
	
	var iRow = this.grdDetail.getselectrow();
	GRD.gfnInsertRow(this.screen,this.grdDetail,false,iRow + 1);
	this.grdDetail.setitemeditstart(iRow + 1 , 0 , true);
	
	// 디폴트 값 셋팅
	this.dsDetail.setdatabyname(iRow+1 , "OU_CODE" , this.dsMaster.getdatabyname(0, "OU_CODE"));
	this.dsDetail.setdatabyname(iRow+1 , "OU_NAME" , this.dsMaster.getdatabyname(0, "OU_NAME"));
}

/* 행삭제 버튼 클릭 */
function btnDelRow_on_mouseup(objInst){
	// console.log("btnDelRow_on_mouseup");
	
	GRD.gfnDeleteRow(this.screen,this.grdDetail);
}

/* 파일첨부 버튼 클릭 */
function btnAttch_on_mouseup(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
	objPopupAttData.P_ATT_ID = "";
	objPopupAttData.P_REF_ID = 1;
	objPopupAttData.P_MODE = "W";
	objPopupAttData.P_FILE_GUBUN = "CORP";
	objPopupAttData.P_REF_NAME = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"OU_CODE");
	objPopupAttData.P_DIR_TYPE = "CORP";
	objPopupAttData.P_OU_CODE = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"OU_CODE");
	objPopupAttData.RET_FUNC_NAME = "fnAttachFilePopCallback";
	screen.loadportletpopup("AttachFilePop", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
}

/* 파일첨부 버튼 클릭 - 콜백 */
function fnAttachFilePopCallback(aryHash) 
{ 
	// 설정했던 objPopupAttData값 초기화
	objPopupAttData.P_ATT_ID = "";
	objPopupAttData.P_REF_ID = "";
	objPopupAttData.P_MODE = "";
	objPopupAttData.P_FILE_GUBUN = "";
	objPopupAttData.P_REF_NAME = "";
	objPopupAttData.P_DIR_TYPE = "";
	objPopupAttData.P_OU_CODE = "";
	objPopupAttData.RET_FUNC_NAME = "";
}

/* 우편번호 조회 돋보기 클릭 */
function btnPostCodePop_on_click(objInst)
{
	this.screen.loadjs("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", "fnGetMstrPostCode", 1);
}

/* 우편번호 조회 돋보기 클릭 - 콜백 */
function fnGetMstrPostCode(strUrl, bSuccess){
	
	new daum.Postcode({
		oncomplete: function(data) {
			fvMstPostCode = data.zonecode;
			fvMstRoadAddress = data.roadAddress;
        }
	}).open();	
	
	this.edt_OU_ADDR_ENG2.setfocus();
	this.edt_OU_ADDR2.setfocus();
}

/* 우편번호 조회 돋보기 클릭 - 콜백 */
function edt_OU_ADDR2_on_focusin(objInst)
{	
	if(!UT.isNull(fvMstPostCode)){
		this.edt_POST_CODE.settext(fvMstPostCode);
		this.edt_OU_ADDR1.settext(fvMstRoadAddress);
	}
}

/* 우편번호 조회 돋보기 클릭(사업장) */
function grdDetail_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// console.log("grdDetail_on_columnclick");
	if(this.grdDetail.getcolumnname(nColumn) == "POST_CODE"){
		this.screen.loadjs("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", "fnGetSitePostCode", 1);
	}
}

/* 우편번호 조회 돋보기 클릭(사업장) - 콜백 */
function fnGetSitePostCode(strUrl, bSuccess){
	// console.log("fnGetSitePostCode");
	
	new daum.Postcode({
		oncomplete: function(data) {
			fvSitePostCode = data.zonecode;
			fvSiteRoadAddress = data.roadAddress;
        }
	}).open();
	
	this.edt_SITE_ADDR1.setfocus();
	this.edt_SITE_ADDR2.setfocus();
}

/* 우편번호 조회 돋보기 클릭(사업장) - 콜백 */
function edt_SITE_ADDR2_on_focusin(objInst)
{
	// console.log("edt_SITE_ADDR2_on_focusin");
	// console.log("fvSitePostCode : " + fvSitePostCode);
	// console.log("fvSiteRoadAddress : " + fvSiteRoadAddress);
	
	var nRow = this.grdDetail.getselectrow();
	if(!UT.isNull(fvSitePostCode)){
		this.grdDetail.setitemtext(nRow, 10, fvSitePostCode);
		this.grdDetail.setitemtext(nRow, 11, fvSiteRoadAddress);
		this.grdDetail.refresh();
		
		fvSitePostCode = "";
		fvSiteRoadAddress = "";
	}
	this.grdDetail.setitemeditstart(nRow, 12, true);	
}

/* 화면 크기 변경 */
function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}