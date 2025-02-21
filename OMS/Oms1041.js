/*------------------------------------
* program id : Oms1041
* desc	   : 중장기계획 리비젼
* dev date   : 2023-06-14
* made by    : SEYUN
*-------------------------------------*/
var ouCode;
var authScope;
var fvSelectedRow;	//그리드 선택된 row
var authScope;

// 등록 화면으로 전달할 파라미터 설정
var objRegExtraData = {
	P_DATA1: "",	      	// 등록 화면으로 전달할 데이터1
	P_DATA2: "",	      	// 등록 화면으로 전달할 데이터2
	P_DATA3: "",	      	// 등록 화면으로 전달할 데이터3
	P_DATA4: "",	      	// 등록 화면으로 전달할 데이터4	
};
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
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.initPopup(this.screen);	 //팝업 공통 
	this.fnDsSearchSet();   //검색조건 세팅	
	this.fnDsSet();              // DATASET 세팅	
	this.fnPageSet();	           //받은 데이터로 페이지 세팅
	this.btnCommonSearch_on_mouseup();
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
		ouCode = objExtraData.P_DATA1;
		this.dsSearch.setdatabyname(0, "PROJECT_PRODUCT_ID", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(0, "PLAN_VERSION", objExtraData.P_DATA3);
		this.dsSearch.setdatabyname(0, "BASE_YEAR", objExtraData.P_DATA4);
		this.dsSearch.setdatabyname(0, "CUSTOMER_NAME", objExtraData.P_DATA5);
		this.dsSearch.setdatabyname(0, "ITEM_NAME", objExtraData.P_DATA6);
		this.dsSearch.setdatabyname(0, "CURRENCY_CODE", objExtraData.P_DATA7);
		this.dsSearch.setdatabyname(0, "PROJECT_CODE", objExtraData.P_DATA8);
		this.dsSearch.setdatabyname(0, "ERP_ITEM_NO", objExtraData.P_DATA9);

	}
	this.comOu.setselectedcodeex(ouCode,true,true);
}
/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	this.dsPlanHeader.removeallrows();
	var iRow2 = this.dsPlanHeader.getrowcount();
	this.dsPlanHeader.insertrow(iRow2);	
    ouCode = INI.GV_OU_CODE;


}
/*
* 데이터셋 
*/
function fnDsSet(){

	UT.gfnGetOuCodes(this.dsOU);	// ou code set
	UT.gfnGetCommCodes(this.dsCurrency, "F018");		  // 통화코드 (F018)
    UT.gfnGetCommCodes(this.dsIncoterms,"O019");		  // incoterms (O019)

}






/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(this.screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "SELECT") 
	{		
		if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(this.screen , "MSG001" , "검색 결과가 없습니다.");
			return;
		} else {
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리
        //    var aryColumn = ["PLAN_YYYYMM"];
        //    for(var i=0;i<this.dsList.getrowcount();i++){
		//		GRD.gfnHrGrdCellHandle(this.grdList, i, aryColumn, "D");
		//	}
		   var version = this.dsSearch.getdatabyname(0,"PLAN_VERSION");
	       this.dsSearch.setdatabyname(this.dsSearch.getpos(), "PLAN_VERSION", Number(version) +1);
		}
		//header 정보가 없으면 row 추가 
		if(this.dsPlanHeader.getrowcount() == 0){
			this.dsPlanHeader.removeallrows();
			this.dsPlanHeader.insertrow(0);
			this.dsPlanHeader.setdatabyname(0, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "OU_CODE"));   
			this.dsPlanHeader.setdatabyname(0, "PROJECT_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "PROJECT_CODE"));  
			this.dsPlanHeader.setdatabyname(0, "PROJECT_PRODUCT_ID", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "PROJECT_PRODUCT_ID"));  
			this.dsPlanHeader.setdatabyname(0, "BASE_YEAR", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "BASE_YEAR")); 
			this.dsPlanHeader.setdatabyname(0, "PLAN_VERSION", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "PLAN_VERSION"));
			this.dsPlanHeader.setdatabyname(0, "LATEST_YN", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "LATEST_YN"));                  
			return;
		}		
	//	this.fnSearchVersion();
	}
	
	if(recv_userheader == "insertAndselect")
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		//this.fnSearch();
		this.fnApply();
	}

	if(recv_userheader == "SELECT_PLAN_VERSION")
	{
	    var version = this.dsSearch.getdatabyname(0,"PLAN_VERSION");
	    //plan version + 1을 추가 
	    UT.gfnDsAddRow(this.dsVersion);
	    this.dsVersion.setdatabyname(this.dsVersion.getpos(), "CODE",  Number(version) +1);
	    this.dsVersion.setdatabyname(this.dsVersion.getpos(), "NAME",  Number(version) +1);

	    // max plan version을 default 값으로 설정 
	    var version = this.dsVersion.getdatabyname(0,"CODE");
	    this.dsSearch.setdatabyname(this.dsSearch.getpos(), "PLAN_VERSION", version);
	}	
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	var planVersion = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PLAN_VERSION");
	if( UT.isNull(planVersion )){		
		return;
	}
	this.fnSearch();
}


function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
		}

	}
	
}






function grdMaster_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick)
{
	this.btnView_on_mouseup();
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
//	INI.gfnMdiTabClose();
    this.screen.unload();
}




function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{	
    ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	//UT.gfnGetUserSiteCodes(this.dsSite,ouCode,INI.GV_USER_ID);	
    //  this.comSite.setselectedindex(0);   	
}



function grdList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.grdList.setcheckedrow(nClickRow, true);
}






function btnAddRow_on_mouseup(objInst)
{

	var sRow = this.dsSearch.getpos();
	var planVersion = this.dsSearch.getdatabyname(sRow,"PLAN_VERSION");
	if( UT.isNull(planVersion )){		
		UT.alert(this.screen , "MSG146" , "프로젝트를 선택해주세요.");
		return;
	}
	var rowCount = this.dsList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,rowCount);	
	this.dsList.setdatabyname(rowCount , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(rowCount , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(rowCount , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(rowCount , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(rowCount , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(rowCount , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(rowCount , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능
}

function btnDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdList);
}

function btnCommonSave_on_mouseup(objInst)
{
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	
	UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
}
/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//거래조건
	var incotermsCode = this.dsPlanHeader.getdatabyname(this.dsPlanHeader.getpos(),"INCOTERMS_CODE");
	if(UT.isNull(incotermsCode) ){
		var strMetaData = UT.gfnGetMetaData("LABEL02655", "거래조건"); 
	    UT.alert(this.screen , "MSG004" , "거래조건은(는) 필수입력항목입니다.",strMetaData);
		this.cboIncoterms.setfocus();
	    return;
	}
	//필수 항목 검사
	var aryDual = [ "BASE_YEAR","PLAN_YYYYMM","QTY","UNIT_PRICE","CURRENCY_CODE"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return false;
	}
	
	return true;
}

function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsPlanHeader , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PLAN" ,"dsSearch" , "dsList");	//조회만	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PLAN_HEADER" ,"dsSearch" , "dsPlanHeader");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 저장
*/
function fnSaveData(alertshow){

	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	//header 
    for(var i=0;i<this.dsPlanHeader.getrowcount();i++){
	    var sRow = this.dsSearch.getpos();
	    var op = this.dsPlanHeader.getrowoperation(i);
	    this.dsPlanHeader.setrowoperation(i, XFD_ROWOP_INSERT);

    	
		this.dsPlanHeader.setdatabyname(i , "OU_CODE" , ouCode);	
		this.dsPlanHeader.setdatabyname(i , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
		this.dsPlanHeader.setdatabyname(i , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
		this.dsPlanHeader.setdatabyname(i , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
		//this.dsList.setdatabyname(i , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));	
		this.dsPlanHeader.setdatabyname(i , "LATEST_YN" , "Y");  //최신버전만 입력 가능			
	}	
	
	//line
    for(var i=0;i<this.dsList.getrowcount();i++){
	    var sRow = this.dsSearch.getpos();
	    var op = this.dsList.getrowoperation(i);
	    if( op != XFD_ROWOP_DELETE  ){
	    	this.dsList.setrowoperation(i, XFD_ROWOP_INSERT);
	    } 
    	
		this.dsList.setdatabyname(i , "OU_CODE" , ouCode);	
		this.dsList.setdatabyname(i , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
		this.dsList.setdatabyname(i , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
		this.dsList.setdatabyname(i , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
		//this.dsList.setdatabyname(i , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));	
		this.dsList.setdatabyname(i , "LATEST_YN" , "Y");  //최신버전만 입력 가능			
	}
			
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPlanHeader , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.REVISION_PLAN" , "" , "", "dsList" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.REVISION_PLAN_HEADER" , "" , "", "dsPlanHeader" );	// 추가 수정 삭제		
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}

function ComProductName_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "PRODUCT_NAME_CODE" , "");
	return 0;
}




/*
* 버젼 정보 데이터 가져오기.
* DB조회
*/
function fnSearchVersion(){		
	
	var projectProductId = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"PROJECT_PRODUCT_ID") ;
	var pamrams = "";
	params = "OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	params = params + " PROJECT_PRODUCT_ID=" + projectProductId;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsVersion , "NONE" , "CLEAR" ,  "" , "" , "TR_VERSION");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_VERSION");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PLAN_VERSION" ,"" , "dsVersion", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_PLAN_VERSION" , true , true , false , "TR_VERSION");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

function grdList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	var qty = this.dsList.getdatabyname( nPrevSelectRow,"QTY");
	var unitPrice = this.dsList.getdatabyname( nPrevSelectRow,"UNIT_PRICE");
	var amt = qty * unitPrice;
	this.dsList.setdatabyname(nPrevSelectRow , "AMT" , amt);
}

function btnUpload_on_mouseup(objInst)
{
	this.grdList.uploadexcelex(1, 1, 2, "A", 1,true);
}



function screen_on_destroy()
{
	this.screen.unload();
	return 1;
}

/*
 * 적용 버튼시
 */
function fnApply(objInst){

	var aryHash ; //UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	
    aryHash = UT.gfnDsRowToAry(this.dsSearch , 0);

	var objExtraData;
	
	// 팝업화면 열때 전달한 extra_data 얻기
	objExtraData = this.screen.getextradata();
	
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objExtraData);
	
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

function btnDownLoad_on_mouseup(objInst)
{
	var excel_file_name, is_show_option, is_save_onerow,
	is_include_pattern, is_include_header, is_include_statdata,
	is_include_border, is_include_align, is_include_backcolor, 
	is_include_font, is_include_forecolor, is_include_itemstyle, 
	is_include_itemmerge, is_include_linenumber, is_include_masking, 
	file_download_type, convert_number_type, is_checkrow_only,
	is_save_onerow_mergedata, excel_password;
	var day = UT.getDate();
	excel_file_name = "planDownload_"+day+".xlsx";
	is_show_option = false;
	is_save_onerow = true;
	is_include_pattern = true;
	is_include_header = true;
	is_include_statdata = true;
	is_include_border = true;
	is_include_align = true;
	is_include_backcolor = true;
	is_include_font = true;
	is_include_forecolor = true;
	is_include_itemstyle = true;
	is_include_itemmerge = true;
	is_include_linenumber = true;
	is_include_masking = true;
	file_download_type = 0;		// 0: local download, 1: server_save_only
	convert_number_type = 0;
	is_checkrow_only = false;
	is_save_onerow_mergedata = true;
	excel_password = "";
	
	this.grdList.downloadexcelex(excel_file_name, is_show_option, is_save_onerow,
		is_include_pattern, is_include_header, is_include_statdata,
		is_include_border, is_include_align, is_include_backcolor, 
		is_include_font, is_include_forecolor, is_include_itemstyle, 
		is_include_itemmerge, is_include_linenumber, is_include_masking, 
		file_download_type, convert_number_type, is_checkrow_only,
		is_save_onerow_mergedata, excel_password);	
}