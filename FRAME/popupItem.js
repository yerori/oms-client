/*------------------------------------
* program id : popupItem
* desc	   : 품목정보 팝업
* dev date   : 2023-01-18
* made by	: SEYUN
*-------------------------------------*/

var fvMultiYn = "N";
var fvFirstSearch = true;
var fvNoSearch = false;
var authScope ="PINFO";
/*
 * 온로드
 */
function screen_on_load()
{
	INI.initPopup(this.screen);	 //팝업 공통 	
	this.fnDsSearchSet();       	//검색조건 세팅
	this.fnPageSet();	           //받은 데이터로 페이지 세팅
	if(!UT.isNull(this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ITEM_CODE")) || !UT.isNull(this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ITEM_NAME"))){
		this.btnSearch_on_mouseup();	
	}
}

/*
 * 검색조건 초기화 및 세팅
 */
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);

	this.edtItemName.setfocus(true);
}

/*
* 업종코드 가져오기
* DB조회 
*/
//function fnBizTypeCode(){		
//	TRN.gfnTranDataSetHandle(this.screen , this.dsBizType , "NONE" , "CLEAR" ,  "" , "" , "TR_BIZ_TYPE");	
//	TRN.gfnCommonTransactionClear(this.screen, "TR_BIZ_TYPE");	//트랜젝션 데이터셋 초기화 (필수)	
//	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtItemMapper.SELECT_BIZ_TYPE" ,"" , "dsBizType");
//	TRN.gfnCommonTransactionRun(this.screen , "selectBizTpe" , true , false , false , "TR_BIZ_TYPE");	
//}

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
		this.dsSearch.setdatabyname(0, "OU_CODE", objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(0, "ITEM_CODE", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(0, "ITEM_NAME", objExtraData.P_DATA3);
		authScope   = objExtraData.P_DATA6;
		searchName  = objExtraData.P_DATA7;
		searchNo    = objExtraData.P_DATA8;


//        if (authScope == "DEPT"){
//			//if( searchName != "")
//			{
//				this.dsSearch.setdatabyname(0, "DEPT_CODE", "");
//		        this.dsSearch.setdatabyname(0, "DEPT_NAME", "");
//				this.dsSearch.setdatabyname(0, "EMP_NO", searchNo);
//				this.dsSearch.setdatabyname(0, "EMP_NAME", searchName);			
//			}	
//			
//		}	
//		if (authScope == "EMP"){	
//			//if( searchName != "")
//			{
//				this.dsSearch.setdatabyname(0, "EMP_NO", searchNo);
//				this.dsSearch.setdatabyname(0, "EMP_NAME", searchName);			
//			}	
//			this.edtDeptCode.setenable(false);
//			this.edtDeptName.setenable(false);	
//		}
//		
//		if (authScope == "PINFO"){
//        	this.edtDeptCode.setenable(false);
//			this.edtDeptName.setenable(false);
//			this.edtEmpNo.setenable(false);
//			this.edtEmpName.setenable(false);
//		}
	}				
}

/*
 * 조회버튼시
 */
function btnSearch_on_mouseup(objInst){
    var itemCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ITEM_CODE");
    var itemName = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ITEM_NAME");
    if( UT.isNull( itemCode ) && UT.isNull( itemName ) ){
       UT.alert(screen , "MSG549" , "품목코드나 품목명 중 하나는 조회 조건으로 입력하셔야 합니다.");	
       return;
    }
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE");	//데이터셋 인:ALL 아웃:NONE 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsList);	       		    //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen);	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcCommonMapper.SELECT_ITEM_POP" ,"dsSearch" , "dsList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "select", true, true, false, "TRANSACITON_COMMON");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
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
	var aryHash;
	var objExtraData;
	objExtraData = this.screen.getextradata();
	if(fvNoSearch){
		this.ReturnClosePopup(aryHash, objExtraData);
	} else {
		this.screen.unload();
	}
	return 1;
}

/*
 * 닫기 버튼 클릭시
 */
function btnClose_on_mouseup(objInst){	
	var aryHash;
	var objExtraData;
	objExtraData = this.screen.getextradata();
	this.ReturnClosePopup(aryHash, objExtraData);var aryHash;
	//this.screen.unload();
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
			fvNoSearch = true;
			return;
		}
		if(this.dsList.getrowcount() == 1 && fvMultiYn == "N" && fvFirstSearch){	//멀티가 아니면서 사람이름 넘어온 최초 조회일경우
			this.btnApply_on_mouseup();	//적용버튼 클릭이벤트 으로 바로 한개 처리
		}
		fvFirstSearch = false;	//최초 조회 아님으로 변경
		fvNoSearch = false;
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
	this.dsSearch.setdatabyname(0, "ITEM_CODE", "");
	this.dsSearch.setdatabyname(0, "ITEM_NAME", "");

}

function edtItemName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtItemCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}