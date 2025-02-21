/*------------------------------------
* program id Pso1051
* desc	   : 서류목록 프로젝트정보 팝업
* dev date   : 2023-07-06
* made by	: SEYUN
*-------------------------------------*/

var fvMultiYn = "N";
var fvFirstSearch = true;
var authScope ="PINFO";
/*
 * 온로드
 */
function screen_on_load()
{
	INI.initPopup(this.screen);	 //팝업 공통 	
	this.fnDsSearchSet();       	//검색조건 세팅
	this.fnChgCodeLoad();       	//PM담당자 정보 Load
	this.fnPageSet();	           //받은 데이터로 페이지 세팅
	this.btnSearch_on_mouseup();	
}

/*
 * 검색조건 초기화 및 세팅
 */
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	var objExtraData;
	
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
    var searchName  = "";
	if (objExtraData !== null) {
		
		// 초기값 설정
		this.dsSearch.setdatabyname(0, "OU_CODE", objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(0, "PROJECT_CODE", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(0, "USER_PM_DIV", objExtraData.P_DATA3);
		authScope   = objExtraData.P_DATA6;
		searchName  = objExtraData.P_DATA7;
		searchNo    = objExtraData.P_DATA8;
	}
	
	this.edtProjectCode.setfocus(true);
}

/*
* 받은 데이터로 페이지 세팅
*/
function fnPageSet(){
	
	UT.gfnGetCommCodes(this.dsCarType, "O018");		   // 차종	
	UT.gfnTranceCodeSet(this.dsCarType, "N");  	       // 빈줄추가
	UT.gfnGetCommCodes(this.dsStatus, "P008");	        // 등급확정여부
	UT.gfnTranceCodeSet(this.dsStatus, "N");  	        // 빈줄추가
	
	//PM담당자 초기화
	if( INI.GV_USER_BIZ_DIV == "PM" && UT.gfnFindRow(this.dsPMchg,"PM_CHG_ID",INI.GV_USER_ID) != -1 ){
	   this.cboPmChg.setselectedcode(INI.GV_USER_ID);
    } 				
}

/*
* PM담당자 코드를 로드합니다
*/
function fnChgCodeLoad(){
	
	var params = "";
	params = params + " OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsPMchg , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_CODE_CHG");
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_CODE_CHG");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_PROJECT_CHARGE" , "" , "dsPMchg" , params);
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadChg" , true , false , false , "TR_SELECT_CODE_CHG");	

	UT.gfnTranceCodeSet(this.dsPMchg, "N");  	     // 빈줄추가
}

/*
 * 조회버튼시
 */
function btnSearch_on_mouseup(objInst){
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DOCU_ALL" ,"dsSearch" , "dsList");	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "select" , false , true , true , "TR_SEARCH");
}


/*
 * 적용 버튼시
 */
function btnApply_on_mouseup(objInst){

	var aryHash ; //UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	
	if (fvFirstSearch ) {
	  aryHash = UT.gfnDsRowToAry(this.dsList , 0);
	} else{
	  aryHash = UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	}
	var objExtraData;
	
	// 팝업화면 열때 전달한 extra_data 얻기
	objExtraData = this.screen.getextradata();
	
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objExtraData);
	
}

function screen_on_destroy()
{
	this.screen.unload();
	return 1;
}

/*
 * 닫기 버튼 클릭시
 */
function btnClose_on_mouseup(objInst){	
	this.screen.unload();
}

/*
 * 페이지 트랜젝션 콜백
 */
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(screen);	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}

	if(recv_userheader == "select"){
		if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		}
		if(this.dsList.getrowcount() == 1 && fvMultiYn == "N" && fvFirstSearch){	//멀티가 아니면서 사람이름 넘어온 최초 조회일경우
			this.btnApply_on_mouseup();	//적용버튼 클릭이벤트 으로 바로 한개 처리
		}
		fvFirstSearch = false;	//최초 조회 아님으로 변경
	}
}

/*
 * 그리드 더블 클릭시
 */
function grdList_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.btnApply_on_mouseup();	//적용버튼 클릭이벤트
}

/*
 * 엔터처리
 */
function fnEnter(keycode){
	if(keycode == 13){
		this.btnSearch_on_mouseup();
	}	
}

/**
 * 계산 결과를 부모화면으로 전달 후 팝업을 닫는다.
 * @param aryHash 부모화면으로 전달할 결과값
 * @param objExtraData 부모화면에서 전달된 extra 데이터
 */
function ReturnClosePopup(aryHash, objExtraData) 
{
	var srcParent, scrParentMember;

	// 리턴받는데 사용할 함수명을 전달한 경우
	if (objExtraData != null && objExtraData.RETURN_FUNCTION_NAME !== "") {
		// 부모화면 screen 구하고 유효성 처리
		srcParent = this.screen.getparent();
		if (factory.isobject(srcParent)) {
			// 부모화면의 멤버 오브젝트 구하기
			scrParentMember = srcParent.getmembers();
			if (factory.isobject(scrParentMember) == true) {
				if (factory.isfunction(scrParentMember[objExtraData.RETURN_FUNCTION_NAME])) {
					// 부모화면의 함수를 통하여 값 전달
					scrParentMember[objExtraData.RETURN_FUNCTION_NAME](aryHash);
				}
			}
		}
	}

	// 팝업화면 닫기
	this.screen.unloadpopup(aryHash);
}

function btnClean_on_mouseup(objInst)
{
	this.dsSearch.setdatabyname(0, "PROJECT_CODE", "");
	this.dsSearch.setdatabyname(0, "CAR_TYPE_CODE", "");
	this.dsSearch.setdatabyname(0, "CAR_TYPE_NAME", "");
	this.dsSearch.setdatabyname(0, "ITEM_NAME", "");
	this.dsSearch.setdatabyname(0, "PSO_DOCU_STATUS", "");
	this.dsSearch.setdatabyname(0, "PM_CHG_ID", "");
}

function edtProjectCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtCarType_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function cboCarType_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function cboPsoTarget_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function cboPmChg_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}