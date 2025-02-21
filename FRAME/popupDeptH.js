/*------------------------------------
* program id : popupDept
* desc	   : 부서정보 팝업
* dev date   : 2022-03-10
* made by	: SEYUN
*-------------------------------------*/

var fvMultiYn = "N";
var fvFirstSearch = true;
var ouCode;
var authScope ="PINFO";
var mode = "I"; //S: 조회용 I:입력용

/* 화면 로드 */
function screen_on_load(){
	INI.initPopup(this.screen);  // 화면 초기화(공통)
	this.fn_init();         // 화면 초기화(개별)
}

/* 화면 초기화(개별) */
function fn_init(){
	
	// 조회 조건 초기화
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);

	this.dsSearch.setdatabyname(iRow, "BASE_DATE", UT.getDate("%Y%M%D"));
	
	var objExtraData;
    objExtraData = this.screen.getextradata(); // 팝업화면 열때 전달한 extra_data 얻기
	if (objExtraData !== null) {
		this.dsSearch.setdatabyname(0, "OU_CODE", objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(0, "DEPT_CODE", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(0, "DEPT_NAME", objExtraData.P_DATA3);
		this.dsSearch.setdatabyname(0, "MODE", objExtraData.P_DATA5);
	}
	//UT.alert(this.screen , "" , "MODE" + this.dsSearch.getdatabyname(0, "MODE"));
	//권한 관리
	authScope = objExtraData.P_DATA4;
	mode =  objExtraData.P_DATA5; 
	searchName  = objExtraData.P_DATA6;
	if (authScope != "DEPT"){
		this.es_SITE_CODE.setenable(false);
		this.es_DEPT_NAME.setenable(false);
		this.es_DEPT_CODE.setenable(false);
	}else{
		this.dsSearch.setdatabyname(0, "DEPT_CODE", "");
		this.dsSearch.setdatabyname(0, "DEPT_NAME", searchName);		
	}
	//입력모드에서는 기준일 수정 불가
	if( mode == "I"){
		this.es_BASE_DATE.setenable(false);
	}
	// 법인 코드 조회
	ouCode = objExtraData.P_DATA1;
	this.tr_select_code_ou();
	this.es_OU_CODE.setselectedcode(ouCode);
	
	// 사이트 코드 조회
	this.tr_select_code_site();
	
	// 조회
	this.btnSearch_on_mouseup();
}

/* 페이지 트랜잭션 콜백 */
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	if(recv_userheader == "select"){
		if(this.dsMaster.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		}
		if(fvFirstSearch && this.dsMaster.getrowcount() == 1 && fvMultiYn == "N"){	// 최초 자동 검색 결과가 1건이면
			this.btnApply_on_mouseup();	// 자동 적용 처리
		}
		fvFirstSearch = false;	//최초 조회 아님으로 변경
	}
	if(mapid == 'TR_SELECT_CODE_SITE'){	
		// 데이터셋 복사
		this.dsCode_SITE_A.clone(this.dsCode_SITE, "", true);
		
		// 행추가
		this.dsCode_SITE_A.insertrow(0);
		this.dsCode_SITE_A.setdatabyname(0, "CODE", "");
		this.dsCode_SITE_A.setdatabyname(0, "NAME", "전체");
	}
}

/* 법인 코드 조회 */
function tr_select_code_ou(){
	TRN.gfnTranDataSetHandle(this.screen , this.dsCode_OU , "NONE" , "CLEAR" ,  "" , "" , "TR_SELECT_CODE_OU");            // 트랜잭션-데이터셋 셋팅(출력)
	TRN.gfnCommonTransactionClear(this.screen, "TR_SELECT_CODE_OU");                                                        // 트랜젝션 초기화
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE_OU" ,"" , "dsCode_OU", "TR_SELECT_CODE_OU"); // 트랙잭션 추가(조회)
	TRN.gfnCommonTransactionRun(this.screen , "logicType_SELECT_CODE_OU" , true , true , true , "TR_SELECT_CODE_OU");       // 트랙잭션 실행
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
}

/* 사이트 코드 조회 */
function tr_select_code_site(){
	TRN.gfnTranDataSetHandle(this.screen, this.dsSearch, "ALL", "NONE", "", "", "TR_SELECT_CODE_SITE");	                    // 트랜잭션-데이터셋 셋팅(입력)
	TRN.gfnTranDataSetHandle(this.screen , this.dsCode_SITE , "NONE" , "CLEAR" ,  "" , "" , "TR_SELECT_CODE_SITE");            // 트랜잭션-데이터셋 셋팅(출력)
	TRN.gfnCommonTransactionClear(this.screen, "TR_SELECT_CODE_SITE");                                                         // 트랜젝션 초기화
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE_SITE" ,"dsSearch" , "dsCode_SITE", "TR_SELECT_CODE_SITE"); // 트랙잭션 추가(조회)
	TRN.gfnCommonTransactionRun(this.screen , "logicType_SELECT_CODE_SITE" , true , true , true , "TR_SELECT_CODE_SITE");      // 트랙잭션 실행
	// 싱크방식(true/false), 콜백함수 호출여부(true/false), 진행중 표출여부(true/false)
}

/* 조회 버튼 클릭 */
function btnSearch_on_mouseup(objInst){
	if(this.dsSearch.getdatabyname(0,"DEPT_CODE") =="" && this.dsSearch.getdatabyname(0,"DEPT_NAME") =="") {
		TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE");	//데이터셋 인:ALL 아웃:NONE 정의
		TRN.gfnTranDataSetHandle(this.screen , this.dsMaster);	       		    //데이터셋 인:ALL 아웃:CLEAR 정의
		TRN.gfnCommonTransactionClear(this.screen);	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_EHR_DEPT_POP" ,"dsSearch" , "dsMaster");	//조회만	
		// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
		TRN.gfnCommonTransactionRun(this.screen , "select");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	}
	else {
		TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE");	//데이터셋 인:ALL 아웃:NONE 정의
		TRN.gfnTranDataSetHandle(this.screen , this.dsMaster);	       		    //데이터셋 인:ALL 아웃:CLEAR 정의
		TRN.gfnCommonTransactionClear(this.screen);	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_EHR_DEPT_POP2" ,"dsSearch" , "dsMaster");	//조회만	
		// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
		TRN.gfnCommonTransactionRun(this.screen , "select");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	}
	
}

/* 적용 버튼 클릭 */
function btnApply_on_mouseup(objInst){
	var aryHash = UT.gfnDsRowToAry(this.dsMaster , this.dsMaster.getpos());
	
	var objExtraData;
	
	// 팝업화면 열때 전달한 extra_data 얻기 (리턴 함수)
	objExtraData = this.screen.getextradata();
	
	// 값 전달 및 팝업 닫기
	this.ReturnClosePopup(aryHash, objExtraData);
	
}

/* 화면 디스트로이 */
function screen_on_destroy()
{
	this.screen.unload();
	return 1;
}

/* 닫기 버튼 클릭 */
function btnClose_on_mouseup(objInst){	
	this.screen.unload();
}

/* 그리드 더블 클릭 */
function grdList_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.btnApply_on_mouseup();
}

/* 엔터키 조회 처리 */
function fnEnter(keycode){
	if(keycode == 13){
		this.btnSearch_on_mouseup();
	}	
}

/**
 * 결과 값을 부모화면으로 데이터 송신 후 팝업을 닫는다.
 * @param aryHash      부모화면으로 송신할 데이터
 * @param objExtraData 부모화면에서 수신한 데이터
 */
function ReturnClosePopup(aryHash, objExtraData) 
{
	var srcParent, scrParentMember;

	if (objExtraData != null && objExtraData.RETURN_FUNCTION_NAME !== "") {
		srcParent = this.screen.getparent();
		if (factory.isobject(srcParent)) {
			scrParentMember = srcParent.getmembers();
			if (factory.isobject(scrParentMember) == true) {
				if (factory.isfunction(scrParentMember[objExtraData.RETURN_FUNCTION_NAME])) {
					// 부모 화면의 콜백 함수 호출
					scrParentMember[objExtraData.RETURN_FUNCTION_NAME](aryHash);
				}
			}
		}
	}

	// 팝업 화면 닫기
	this.screen.unloadpopup(aryHash);
}

/* 그리드 아이템 더블클릭 */
function grdMaster_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick)
{
	this.btnApply_on_mouseup();	//적용버튼 클릭이벤트
}

function es_DEPT_NAME_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function es_DEPT_CODE_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}