/*------------------------------------
* program id : popupRole
* desc	   : ROLE그룹 팝업
* dev date   : 2024-10-07
* made by	: YELEE
*-------------------------------------*/

var ouCode;



/*
 * 온로드
 */
function screen_on_load()
{
	INI.initPopup(this.screen);	 //팝업 공통 	
	this.fnDsSearchSet();
	this.fnUserAuthData();       	//검색조건 세팅
}


/*
* roll그룹 정보 가져오기.
* DB조회
*/
function fnUserAuthData(){		
	var vParam = "OU_CODE=" + ouCode;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuth , "NONE" , "CLEAR" ,  "" , "" , "TR_AUTH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_AUTH");
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_ALL_AUTH_CODE" ,"" , "dsAuth", vParam);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectUserAuth" , true , false , false , "TR_AUTH");
}

/*
 * 검색조건 초기화 및 세팅
 */
function fnDsSearchSet(){
	UT.gfnGetOuCodes(this.dsOU);

	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);

    ouCode = INI.GV_OU_CODE;

	this.fldOu.setselectedcode(ouCode);
}


/*
 * 적용 버튼시
 */
function btnApply_on_mouseup(objInst){
	var aryHash = UT.gfnDsRowToAry(this.dsAuth, this.dsAuth.getpos());
	
    // 팝업화면 열때 전달한 extra_data 얻기
	var objExtraData = this.screen.getextradata();
	
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objExtraData);
}


/*
 * 닫기 버튼 클릭시
 */
function btnClose_on_mouseup(objInst){	
	this.screen.unload();
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



function fldOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
}



/*
 * 조회버튼시
 */
function btnSearch_on_mouseup(objInst)
{
	this.fnUserAuthData();
}


function grdUserAuth_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.btnApply_on_mouseup();	//적용버튼 클릭이벤트
}