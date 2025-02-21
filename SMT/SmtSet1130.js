/*------------------------------------
* program id : SmtSet1130
* desc	   : LABEL 관리
* dev date   : 2022-04-12
* made by	: SEYUN
*-------------------------------------*/

/* 화면 로드 */
function screen_on_load(){

	INI.init(this.screen); // 초기화(공통)
	this.fn_init();        // 초기화(개별)
}

/* 초기화(개별) */
function fn_init(){
	
	// 공통 코드 조회
	UT.gfnGetCommCodes(this.dsCode, "F030");			// 다국어코드
	UT.gfnTranceCodeSet(this.dsCode, "A")
		
	// 조회 조건 초기화
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	// 조회
	// this.btnCommonSearch_on_mouseup();
}

/* 트랜젝션 콜백 */
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg){
	console.log("screen_on_submitcomplete");
	
	UT.gfnWaitDestroy(screen);
	
	if(recv_code != 0){
		UT.alert(this.screen, "", recv_msg);
		return;
	}
	
	if(recv_userheader == "selectMstr"){
		if(this.dsLabelInfo.getrowcount() == 0){
			UT.alert(screen, "MSG001", "조회 결과가 없습니다.");   // 경고창
			UT.statMsg(screen, "MSG001", "조회 결과가 없습니다."); // 메세지바
			return;
		}else{
			UT.statMsg(screen, "MSG003", "%% 건의 데이터가 조회되었습니다.", this.dsLabelInfo.getrowcount()); // 메세지바
		}
    }

	if(recv_userheader == "saveAndselect"){
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");   // 경고창
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다."); // 메세지바
		
		this.tr_select_master();
	}
}

/* 마스터 조회 */
function tr_select_master(){
	
	TRN.gfnTranDataSetHandle(this.screen, this.dsSearch, "ALL", "NONE", "", "", "TR_SELECT_MASTER");	                           // 트랜잭션-데이터셋 셋팅(입력)
	TRN.gfnTranDataSetHandle(this.screen, this.dsLabelInfo, "NONE", "CLEAR", "", "", "TR_SELECT_MASTER");	                         // 트랜잭션-데이터셋 셋팅(출력)
	TRN.gfnCommonTransactionClear(this.screen, "TR_SELECT_MASTER");                                                                // 트랜젝션 초기화
	TRN.gfnCommonTransactionAddSearch(this.screen, "systemMapper.SELECT_SMT_LANG_INFO_LABEL", "dsSearch", "dsLabelInfo", "TR_SELECT_MASTER"); // 트랙잭션 추가(조회)
	TRN.gfnCommonTransactionRun(this.screen, "selectMstr", true, true, false, "TR_SELECT_MASTER");	                 // 트랙잭션 실행
}

/* 저장 */
function tr_save(){
	
	TRN.gfnTranDataSetHandle(this.screen, this.dsLabelInfo, "ALL", "NONE", "", "", "TR_SAVE");						// 트랜잭션-데이터셋 셋팅(입력)
	TRN.gfnCommonTransactionClear(this.screen, "TR_SAVE");	                                                     // 트랜젝션 초기화
	TRN.gfnCommonTransactionAddSave(this.screen, "systemMapper.INSERT_SMT_LANG_INFO", "systemMapper.UPDATE_SMT_LANG_INFO", "systemMapper.DELETE_SMT_LANG_INFO", "dsLabelInfo"); // 트랙잭션 추가(저장)
	TRN.gfnCommonTransactionRun(this.screen, "saveAndselect", true, true, false, "TR_SAVE");               // 트랙잭션 실행
}

/* 조회 버튼 클릭 */
function btnCommonSearch_on_mouseup(objInst){
	this.tr_select_master();
}

/* 저장 버튼 클릭 */
function btnCommonSave_on_mouseup(objInst){
	// 필수 항목 체크 (그리드)
	var aryColumn = ["LANG_SCN_CD","OBJ_CD","LANG_DISPLAY"];
	if(!UT.gfnVaildataionGrd(this.screen,this.grdMaster, aryColumn, false)){
		return;
	}
	
	this.tr_save();
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

/* Upload 버튼 클릭 */
function btnUpload_on_mouseup(objInst)
{
	this.grdMaster.uploadexcelex(1, 1, 2, "A", 1);
}

/* 행추가 버튼 클릭 */
function btnAddRow_on_mouseup(objInst){
	
	var iRow = this.grdMaster.getselectrow();
	GRD.gfnInsertRow(this.screen,this.grdMaster,false,iRow + 1);
	this.grdMaster.setitemeditstart(iRow + 1, 0, true);
	
	// 시퀀스 자동 증가 처리
	var strSequence = "";
	var strInObjScnCd = "LABEL";
	if(this.chkAutoSeq.gettext()=="Y"){
		strSequence = UT.gfnGetSequence(strInObjScnCd , "" , strInObjScnCd , strInObjScnCd.length + 5 );	//시퀀스 가져오기
		this.dsLabelInfo.setdatabyname(iRow+1, "OBJ_CD", strSequence);
	}
	
	this.dsLabelInfo.setdatabyname(iRow+1, "OBJ_SCN_CD", strInObjScnCd);
	this.dsLabelInfo.setdatabyname(iRow+1, "LANG_SCN_CD", INI.GV_LANG);
	this.grdMaster.refresh();
}

/* 행삭제 버튼 클릭 */
function btnDelRow_on_mouseup(objInst){
	GRD.gfnDeleteRow(this.screen,this.grdMaster);
}

/* 화면 크기 변경 */
function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}

// 엔터키값 조회 버튼 click call
function edt_MSG_CODE_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

// 엔터키값 조회 버튼 click call
function edt_MSG_NAME_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}