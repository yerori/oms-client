/*------------------------------------
* program id : Rnd1051
* desc	   : 연구원 업무시간 관리 업무코드 팝업
* dev date   : 2024-06-05
* made by	: HS IT Team
*-------------------------------------*/

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
	this.edtName.setfocus(true);
}

/*
* 받은 데이터로 페이지 세팅
*/
function fnPageSet(){
	
	var objExtraData;
	
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
    var searchName  = "";
	if (objExtraData !== null) {		
		// 초기값 설정
		this.dsSearch.setdatabyname(0, "GROUP_CODE", objExtraData.P_DATA1);
		this.stSystemMenuTitle.settext(objExtraData.P_DATA2 + " 검색");
		this.txtName.settext(objExtraData.P_DATA2);
	}	
}

/*
 * 조회버튼 시
 */
function btnSearch_on_mouseup(objInst){
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE");	//데이터셋 인:ALL 아웃:NONE 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsList);	       		    //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen);	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMgtMapper.POPUP_RND_WORK_CODE" ,"dsSearch" , "dsList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "select", false, true, true, "TRANSACITON_COMMON");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
 
/*
 * 적용 버튼시
 */
function btnApply_on_mouseup(objInst){

	var aryHash ; //UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	
	//if (fvFirstSearch ) {
	//  aryHash = UT.gfnDsRowToAry(this.dsList , 0);
	//} else{
	//  aryHash = UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	//}
	
	aryHash = UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	
	var objExtraData;
	
	// 팝업화면 열때 전달한 extra_data 얻기
	objExtraData = this.screen.getextradata();
	
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objExtraData);
	
}

/*
 * 닫기 버튼 클릭시
 */
function btnClose_on_mouseup(objInst){	
	this.screen.unload();
}

function screen_on_destroy()
{
	this.screen.unload();
	return 1;
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
	}
}

/*
 * 그리드 더블 클릭시
 */
function grdList_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.btnApply_on_mouseup();	//적용버튼 클릭이벤트
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

/*
* 초기화 버튼 클릭 시
*/
function btnClean_on_mouseup(objInst)
{
	this.dsSearch.setdatabyname(0, "NAME", "");	
}