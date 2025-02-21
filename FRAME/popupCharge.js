/*------------------------------------
* program id : popupCharge
* desc	   : 담당자정보 팝업
* dev date   : 2023-01-30
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
	
	UT.gfnGetOuCodes(this.dsOU);	// ou code set
	//UT.gfnGetCommCodes(this.dsBizDiv, "P012");	// dsBizDiv deprecated 예상되어 주석 by. yelee 250205
}

/*
* 받은 데이터로 페이지 세팅
*/
function fnPageSet(){
	var searchName;
	var objExtraData;
	
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();

	if (objExtraData !== null) {
		// 초기값 설정
		this.dsSearch.setdatabyname(0, "OU_CODE", objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(0, "BIZ_DIV", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(0, "HAS_NULL_USER", objExtraData.P_DATA3);	
		this.dsSearch.setdatabyname(0, "MODE", objExtraData.P_DATA4);	
		
		authScope   = objExtraData.P_DATA6;
		searchName  = objExtraData.P_DATA7;
		
		if(searchName) {
			this.dsSearch.setdatabyname(0, "USER_NAME", searchName);	
		}
	}	
	
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	    this.cboOuCode.setenable(false);
    }			
}

/*
 * 조회버튼시
 */
function btnSearch_on_mouseup(objInst){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CHARGE_POP" ,"dsSearch" , "dsList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "select", true, true, false, "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

function fnSetCboOu() {
	this.dsList.setdatabyname(this.dsList.getpos(), "OU_CODE", this.cboOuCode.getselectedcode());
	this.dsList.setdatabyname(this.dsList.getpos(), "OU_NAME", this.cboOuCode.getselectedcomment());
}

/*
 * 적용 버튼시
 */
function btnApply_on_mouseup(objInst){
	var aryHash ; //UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	var isNotValid = this.validateEmploymentStatus();
	
	// 담당자를 지정(수정)하는 모드에서 이미 퇴사한 사원을 클릭했을 시
	if(isNotValid) {
		UT.alert(this.screen , "MSG614" , "퇴사한 사원은 담당자로 지정할 수 없습니다.");
		return;
	};
	this.fnSetCboOu();
	
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
* 재직 여부에 따른 검증
*/
function validateEmploymentStatus() {
	var today = UT.getDate();
	var mode = this.dsSearch.getdatabyname(0, "MODE");
	var endDate = this.dsList.getdatabyname(this.dsList.getpos(), "END_DATE");
	var isResigned = endDate && endDate < today;
	
	var isNotValid = mode == "EDIT" && isResigned;
	return isNotValid;
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

function edtVendorName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtVendorCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}