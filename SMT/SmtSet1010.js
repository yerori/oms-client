/*------------------------------------
* program id : SmtSet1010
* desc	   : 메세지 관리
* dev date   : 2022-03-07
* made by	: SEYUN
*-------------------------------------*/

// RGB Backcolor Editable False
var vRGB_BEF = factory.rgb(247, 251, 255);

/* 화면 로드 */
function screen_on_load(){
	INI.init(this.screen); // 초기화(공통)
	this.fn_init();        // 초기화(개별)
}

/* 초기화(개별) */
function fn_init(){
	// 공통 코드 조회
	this.tr_select_code(); 
		
	// 조회 조건 초기화
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	this.dsSearch.setdatabyname(iRow, "LANG_CODE", this.dsCode_F030.getdatabyname(0, "ITEM_CODE"));

    // 생성 권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_C")) {
        this.btnAddRow.setenable(false);
		this.btnUplaod.setenable(false);
    }

    // 삭제 권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_D")) {
        this.btnDelRow.setenable(false);
    }

	// 조회
	// this.btnCommonSearch_on_mouseup();
}

/* 트랜젝션 콜백 */
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg){

	UT.gfnWaitDestroy(screen);
	
	if(recv_code != 0){
		UT.alert(this.screen, "", recv_msg);
		return;
	}
	
	if(mapid == 'TR_SELECT_CODE_F030'){
	
		// 데이터셋 복사
		this.dsCode_F030_A.clone(this.dsCode_F030, "", true);
		
		// 행추가
		this.dsCode_F030_A.insertrow(0);
		this.dsCode_F030_A.setdatabyname(0, "ITEM_CODE", "");
		this.dsCode_F030_A.setdatabyname(0, "ITEM_NAME", "전체");

	}else if(mapid == 'TR_SELECT_MASTER'){
		// console.log("[TMP]this.dsMaster.getrowcount():" + this.dsMaster.getrowcount());
		if(this.dsMaster.getrowcount() == 0){
			UT.alert(screen, "MSG001", "조회 결과가 없습니다.");   // 경고창
			UT.statMsg(screen, "MSG001", "조회 결과가 없습니다."); // 메세지바
			return;
		}else{
			UT.statMsg(screen, "MSG003", "%% 건의 데이터가 조회되었습니다.", this.dsMaster.getrowcount()); // 메세지바

			// 컬럼 editable false 처리
			var aryColumn = ["LANG_CODE", "MSG_CODE"];
			for(var iRow = 0; iRow < this.dsMaster.getrowcount(); iRow++) {
				GRD.gfnGrdCellHandle(this.grdMaster, iRow, aryColumn, "editable", false);
				GRD.gfnGrdCellHandle(this.grdMaster, iRow, aryColumn, "backcolor", vRGB_BEF);
			}
		}
	}else if(mapid == 'TR_SAVE'){
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");   // 경고창
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다."); // 메세지바
		
		this.tr_select_master();
		//this.tr_select_detail()
	}
}

/* 공통코드 조회 */
function tr_select_code(){
	// console.log("tr_select_code");

	//다국어종류 
	var params = "GRP_CODE=F030 NOT_IN=NO"; // [NOT_IN=그룹코드] 또는 [NOT_IN=NO]
	TRN.gfnTranDataSetHandle(this.screen, this.dsCode_F030, "NONE", "CLEAR", "", "", "TR_SELECT_CODE_F030"); // 트랜잭션-데이터셋 셋팅(출력)
	TRN.gfnCommonTransactionClear(this.screen, "TR_SELECT_CODE_F030");                                       // 트랜젝션 초기화
	TRN.gfnCommonTransactionAddSearch(this.screen, "OmsCommonMapper.SELECT_CODE", "", "dsCode_F030", params);   // 트랙잭션 추가(조회)
	TRN.gfnCommonTransactionRun(this.screen, "logicType_SELECT_CODE_F030", true, true, false, "TR_SELECT_CODE_F030"); // 트랜잭션 실행
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
}

/* 마스터 조회 */
function tr_select_master(){
	// console.log("tr_select_master");
	
	TRN.gfnTranDataSetHandle(this.screen, this.dsSearch, "ALL", "NONE", "", "", "TR_SELECT_MASTER");	                           // 트랜잭션-데이터셋 셋팅(입력)
	TRN.gfnTranDataSetHandle(this.screen, this.dsMaster, "NONE", "CLEAR", "", "", "TR_SELECT_MASTER");	                         // 트랜잭션-데이터셋 셋팅(출력)
	TRN.gfnCommonTransactionClear(this.screen, "TR_SELECT_MASTER");                                                                // 트랜젝션 초기화
	TRN.gfnCommonTransactionAddSearch(this.screen, "systemMapper.SELECT_SMT_USER_MSG","dsSearch", "dsMaster", "TR_SELECT_MASTER"); // 트랙잭션 추가(조회)
	TRN.gfnCommonTransactionRun(this.screen, "logicType_SELECT_MASTER", true, true, false, "TR_SELECT_MASTER");	                 // 트랙잭션 실행
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
}

/* 저장 */
function tr_save(){
	// console.log("tr_save");
	
	TRN.gfnTranDataSetHandle(this.screen, this.dsMaster, "ALL", "NONE", "", "", "TR_SAVE");						// 트랜잭션-데이터셋 셋팅(입력)
	TRN.gfnCommonTransactionClear(this.screen, "TR_SAVE");	                                                     // 트랜젝션 초기화
	TRN.gfnCommonTransactionAddSave(this.screen, "systemMapper.INSERT_SMT_USER_MSG", "systemMapper.UPDATE_SMT_USER_MSG", "systemMapper.DELETE_SMT_USER_MSG", "dsMaster"); // 트랙잭션 추가(저장)
	TRN.gfnCommonTransactionRun(this.screen, "logicType_MASTER_SAVE", true, true, false, "TR_SAVE");               // 트랙잭션 실행
}

/* 조회 버튼 클릭 */
function btnCommonSearch_on_mouseup(objInst){
	// console.log("btnCommonSearch_on_mouseup");
	
	this.tr_select_master();
	//this.tr_select_detail();
}

/* 저장 버튼 클릭 */
function btnCommonSave_on_mouseup(objInst){
	// console.log("btnCommonSave_on_mouseup");

	// 필수 항목 체크 (그리드)
	var aryColumn = ["LANG_CODE","MSG_CODE","MSG_NAME"];
	if(!UT.gfnVaildataionGrd(this.screen,this.grdMaster, aryColumn, false)){
		return;
	}
	
	this.tr_save();
}

/* Upload 버튼 클릭 */
function btnUpload_on_mouseup(objInst)
{
	// console.log("btnUpload_on_mouseup");
	
	this.grdMaster.uploadexcelex(1, 1, 2, "A", 1);
}

/* 행추가 버튼 클릭 */
function btnAddRow_on_mouseup(objInst){
	// console.log("btnAddRow_on_mouseup 4:56");
	// console.log("INI.GV_LANG : " + INI.GV_LANG);
	
	// 행추가
	var iRow = this.grdMaster.getselectrow();
	GRD.gfnInsertRow(this.screen,this.grdMaster,false,iRow + 1);
	this.grdMaster.setitemeditstart(iRow + 1, 0, true);
	
	/*
	var aryColumn = ["LANG_CODE", "MSG_CODE", "MSG_NAME"];
	GRD.gfnGrdCellHandle(this.grdMaster, iRow + 1, aryColumn, "editable", true);
	*/

	// 시퀀스 자동 증가 처리
	var strSequence = "";
	if(this.chkAutoSeq.gettext()=="Y"){
		var strInObjScnCd = "MSG";
		strSequence = UT.gfnGetSequence(strInObjScnCd , "" , strInObjScnCd , strInObjScnCd.length + 3 );	//시퀀스 가져오기
	}

	// 디폴트 값 셋팅
	this.dsMaster.setdatabyname(iRow+1, "LANG_CODE", INI.GV_LANG);
	this.dsMaster.setdatabyname(iRow + 1, "MSG_CODE", strSequence);
	this.grdMaster.refresh();

	// UT.traceDatasetNeo(this.dsMaster);
	// console.log("btnAddRow_on_mouseup 5:07");
}

/* 행삭제 버튼 클릭 */
function btnDelRow_on_mouseup(objInst){
	// console.log("btnDelRow_on_mouseup");
	
	GRD.gfnDeleteRow(this.screen,this.grdMaster);
}

/* MSG_CODE 키 다운 */
function edt_MSG_CODE_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

/* MSG_NAME 키 다운 */
function edt_MSG_NAME_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}	
	return 0;
}

/* 화면 크기 변경 */
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