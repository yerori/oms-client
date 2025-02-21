var fvMultiYn = "N";
var fvFirstSearch = false;
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

/*
 * 온로드
 */
function screen_on_load()
{
	INI.initPopup(this.screen);	 //팝업 공통 	
	this.fnDsSearchSet();       	//검색조건 세팅
	this.fnPageSet();	           //받은 데이터로 페이지 세팅
}

/*
 * 검색조건 초기화 및 세팅 / 데이터셋 초기화 및 세팅
 */
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	this.dsList.removeallrows();
	iRow = this.dsList.getrowcount();
	this.dsList.insertrow(iRow);
}

/*
* 받은 데이터로 페이지 세팅
*/
function fnPageSet(){
	
	var objExtraData;
	
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
	if (objExtraData !== null) {
		
		// 초기값 설정
		this.dsSearch.setdatabyname(0, "OU_CODE", objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(0, "EVAL_YEAR", objExtraData.P_DATA2);
	}
	
}

/*
 * 적용 버튼시
 */
function btnApply_on_mouseup(objInst){
	var aryHash = UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	
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
			//btnApply_on_mouseup();	//적용버튼 클릭이벤트 으로 바로 한개 처리
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

function fldVendorName_on_changed(objInst, prev_text, curr_text, event_type)
{
	if( event_type == 5 ){
		if (!curr_text) {
			this.txtVendorCode.settext("");
			this.fldVendorName.settext("");
		} else {
			this.fnVendorPopupCall("", this.fldVendorName.gettext());
		}
	}
}

function btnVendorNamePop_on_click(objInst)
{
	this.fnVendorPopupCall("","");
}

function fnVendorPopupCall(vendorCode, vendorName) {
	var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회1"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = vendorCode;
	objPopupExtraData.P_DATA3 = vendorName;
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorClosePopCallback";
	screen.loadportletpopup("VendorNameSel", "/FRAME/popupVendor", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

/*
* 업체정보 Callback
*/
function fnVendorClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	var iRow1 = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
		
		this.dsList.setdatabyname(iRow1 , "OU_CODE" , this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE"));
		this.dsList.setdatabyname(iRow1 , "EVAL_YEAR" , this.dsSearch.getdatabyname(this.dsSearch.getpos(),"EVAL_YEAR"));
		this.dsList.setdatabyname(iRow1 , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsList.setdatabyname(iRow1 , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
		this.dsList.setdatabyname(iRow1 , "BIZ_TYPE" , aryHash["BIZ_TYPE"]);
		this.dsList.setdatabyname(iRow1 , "BIZ_TYPE_NAME" , aryHash["BIZ_TYPE_NAME"]);
	} else {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , "");
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , "");	
	}
}