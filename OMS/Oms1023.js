/*------------------------------------
* program id : Oms1023
* desc	   : 프로젝트정보리비젼
* dev date   : 2023-06-16
* made by    : SEYUN
*-------------------------------------*/

var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";
var fvMstPostCode = "";
var fvMstRoadAddress = "";
var ouCode;

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

// 파일첨부 팝업화면으로 전달할 파라미터 설정
var objPopupAttData = {
	P_REF_ID: "",      	   // 팝업화면으로 전달할 데이터1
	P_MODE: "",			   // 팝업화면으로 전달할 데이터1
	P_FILE_GUBUN: "",	     // 팝업화면으로 전달할 데이터2
	P_REF_NAME: "",	       // 팝업화면으로 전달할 데이터3
	P_DIR_TYPE: "",	       // 팝업화면으로 전달할 데이터4
	P_OU_CODE: "",	        // 팝업화면으로 전달할 데이터5
	RET_FUNC_NAME: "",  	  // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
	clear: function(){
		this.P_REF_ID = "";
		this.P_MODE = "";
		this.P_FILE_GUBUN = "";
		this.P_REF_NAME = "";
		this.P_DIR_TYPE = "";
		this.P_OU_CODE = "";
		this.RET_FUNC_NAME = "";
	}
};

/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.initPopup(this.screen);	 //팝업 공통 
	this.fnInitSet();   //검색조건 및 입력DS 세팅
	this.fnSearch();  //최초조회	

}

/*
* 검색조건 초기화 및 세팅
*/
function fnInitSet(){
	
	//ds set
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsCarType, "O018");		   // 차종
    UT.gfnGetCommCodes(this.dsActStatus, "O015");	     // 상세상태
    UT.gfnGetCommCodes(this.dsDetailStatus, "O016");	  // 상세상태
	UT.gfnGetCommCodes(this.dsImportance, "O017");		// 중요도코드
	UT.gfnGetCommCodes(this.dsOuCountry, "O001");		 // 법인구분코드(국가)(O001)
	UT.gfnGetCommCodes(this.dsDomesticExport, "O003");    // 내수/수출 구분 코드(O003)
	UT.gfnGetCommCodes(this.dsCurrency, "F018");		  // 통화코드 (F018)
	UT.gfnGetCommCodes(this.dsProductionArea, "O002");	// 법인생산지코드 (O002)
	UT.gfnGetCommCodes(this.dsCustomerArea, "O006");	  // 고객지역 코드(O006)
	UT.gfnGetCommCodes(this.dsBusinessGroup, "O013");	 // Business Group(O013)
	UT.gfnGetCommCodes(this.dsProductGroup, "O007");	  // PRODUCT_GROUP(O007)
	UT.gfnGetCommCodes(this.dsProductName, "O008");	   // Product Name 코드(O008)
	UT.gfnGetCommCodes(this.dsProductModel, "O010");	  // Product Model(O010)
	UT.gfnGetCommCodes(this.dsProductPkg, "O012");		// Product Pkg (O012)
	UT.gfnGetCommCodes(this.dsSalesType, "O022","N");		 // 판매유형 (O022)

    



	//조회 조건 set
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE);
    ouCode = INI.GV_OU_CODE;
   
	var objExtraData;
    objExtraData = this.screen.getextradata(); //
	if(objExtraData !== null ) {
		this.dsSearch.setdatabyname(iRow, "OU_CODE", objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(iRow, "PROJECT_CODE", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(iRow, "PROJECT_VERSION", objExtraData.P_DATA3);
	} 
	//수정불가 필드처리
	this.btnCustomerPop.setenable(false);
	UT.gfnHrEditorStyle(this.cboCarType, "D");
	UT.gfnHrEditorStyle(this.fldRegisterYear, "D");
	UT.gfnHrEditorStyle(this.cboCustArea, "D");
    UT.gfnHrEditorStyle(this.fldCustomerName, "D");
	UT.gfnHrEditorStyle(this.fldProjectCode, "D");
	UT.gfnHrEditorStyle(this.fldCustCodeERP, "D");
	UT.gfnHrEditorStyle(this.fldCustNameERP, "D");	
	UT.gfnHrEditorStyle(this.fldCustNa, "D");
	UT.gfnHrEditorStyle(this.fldCustGroup, "D");
	UT.gfnHrEditorStyle(this.cboActStatus, "D");
    UT.gfnHrEditorStyle(this.cboDetailStatus, "D");
    UT.gfnHrEditorStyle(this.comOu, "D");

}



/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "SELECT_PROJECT")
	{		
		this.fnSearchVersion();
		var projectCode = this.dsProject.getdatabyname( this.dsProject.getpos(), "PROJECT_CODE");
		var projectVersion = this.dsProject.getdatabyname( this.dsProject.getpos(), "PROJECT_VERSION");
	    //조회 후 version 증가 
	    this.dsProject.setdatabyname(this.dsProject.getpos(), "PROJECT_VERSION", Number(projectVersion) +1);
	    this.dsSearch.setdatabyname(this.dsSearch.getpos(), "PROJECT_VERSION", Number(projectVersion) +1);
		var latestYN = "Y";
	    if( !UT.isNull(projectCode)){
		     if( latestYN == "Y"){
			     this.btnAddRow.setenable(true);
			     this.btnDelRow.setenable(true);
				 //## 2024-07-15 Modified by Youngho.Kang
			     //this.btnCustomerPop.setenable(true);
			     //this.btnRFQPop.setenable(true);
			     this.btnCustomerPop.setenable(false);
			     this.btnRFQPop.setenable(false);
				 //// 2024-07-15 Modified end
			     this.btnOrgProjectPop.setenable(true);
				 UT.gfnHrEditorStyle(this.cboActStatus, "G");
             	UT.gfnHrEditorStyle(this.cboDetailStatus, "G");
	             UT.gfnHrEditorStyle(this.cboImportance, "G");
	             UT.gfnHrEditorStyle(this.cboDomesticExport, "G");
	             UT.gfnHrEditorStyle(this.fldTargetYear, "G");
	             UT.gfnHrEditorStyle(this.cboOuCountry, "G");
	             UT.gfnHrEditorStyle(this.fldOem, "G");
	             UT.gfnHrEditorStyle(this.fldSop, "G");
	             UT.gfnHrEditorStyle(this.fldEOP, "G");
	             UT.gfnHrEditorStyle(this.cboProductionArea, "G");
	             UT.gfnHrEditorStyle(this.cboCurrency, "G");
	             UT.gfnHrEditorStyle(this.fldSRFQ, "G");
	             UT.gfnHrEditorStyle(this.fldOrgProject, "G");
	             UT.gfnHrEditorStyle(this.fldRemak, "G");
	             //확인된 ROW를 활성
                 var count = this.grdProduct.getrowcount();
		         var aryColumn = ["REMARK","BUSINESS_GROUP_CODE","PRODUCT_GROUP_CODE", "PRODUCT_NAME_CODE", "PRODUCT_MODEL_CODE","PRODUCT_PKG_CODE", "ITEM_NAME", "ERP_ITEM_NO"];
			     for( var iRow = 0; iRow < count ; iRow++){	    
		                GRD.gfnHrGrdCellHandle(this.grdProduct, iRow, aryColumn, "G");
		 						
		 		}
		     }else{
			     this.btnAddRow.setenable(false);
			     this.btnDelRow.setenable(false);
			     this.btnCustomerPop.setenable(false);
			     this.btnRFQPop.setenable(false);
			     this.btnOrgProjectPop.setenable(false);
				 UT.gfnHrEditorStyle(this.cboActStatus, "D");
             	UT.gfnHrEditorStyle(this.cboDetailStatus, "D");
	             UT.gfnHrEditorStyle(this.cboImportance, "D");
	             UT.gfnHrEditorStyle(this.cboDomesticExport, "D");
	             UT.gfnHrEditorStyle(this.fldTargetYear, "D");
	             UT.gfnHrEditorStyle(this.cboOuCountry, "D");
	             UT.gfnHrEditorStyle(this.fldOem, "D");
	             UT.gfnHrEditorStyle(this.fldSop, "D");
	             UT.gfnHrEditorStyle(this.fldEOP, "D");
	             UT.gfnHrEditorStyle(this.cboProductionArea, "D");
	             UT.gfnHrEditorStyle(this.cboCurrency, "D");
	             UT.gfnHrEditorStyle(this.fldSRFQ, "D");
	             UT.gfnHrEditorStyle(this.fldOrgProject, "D");
	             UT.gfnHrEditorStyle(this.fldRemak, "D");
	             //확인된 ROW를 비활성
                 var count = this.grdProduct.getrowcount();
		         var aryColumn = ["REMARK","BUSINESS_GROUP_CODE","PRODUCT_GROUP_CODE", "PRODUCT_NAME_CODE", "PRODUCT_MODEL_CODE","PRODUCT_PKG_CODE", "ITEM_NAME", "ERP_ITEM_NO"];
			     for( var iRow = 0; iRow < count ; iRow++){	    
		                GRD.gfnHrGrdCellHandle(this.grdProduct, iRow, aryColumn, "D");
		 						
		 		}
	      	}
	    }
	}
	
	if(recv_userheader == "insertAndselect")
	{
		//UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.alert(this.screen , "" , "저장되었습니다.\n견적원가를 관리해 주시기 바랍니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		this.fnApply();
	}
	if(recv_userheader == "SelectProc")
	{
		UT.alert(this.screen , "MSG041" , "처리 완료 되었습니다.");	
		UT.statMsg(this.screen , "MSG041" , "처리 완료 되었습니다.");
        this.fnSearchVersion();
	    var version = this.dsVersion.getdatabyname(0,"CODE");
	    this.dsSearch.setdatabyname(this.dsSearch.getpos(), "PROJECT_VERSION", version);	
		this.fnSearch();	
	}	
	
}


/*
* 업체정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	
	//법인코드
	var ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	if(UT.isNull(ouCode) ){
		var strMetaData = UT.gfnGetMetaData("LABEL01947", "법인"); 
	    UT.alert(this.screen , "MSG007" , "법인을 먼저 선택하세요.", strMetaData);
		this.cboOuCode.setfocus();
	    return;
	}
	
	//프로젝코드
	var projectCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_CODE");
	if(UT.isNull(projectCode) ){
		var strMetaData = UT.gfnGetMetaData("LABEL00064", "프로젝코드"); 
	    UT.alert(this.screen , "MSG007" , "프로젝코드를 먼저 선택하세요.",strMetaData);
		this.edtProjectCode.setfocus();
	    return;
	}
	//버젼
	var version = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_VERSION");
	if(UT.isNull(version) ){
		var strMetaData = UT.gfnGetMetaData("LABEL00327", "버젼"); 
	    UT.alert(this.screen , "MSG007" , "버젼를 먼저 선택하세요.",strMetaData);
		this.edtProjectCode.setfocus();
	    return;
	}
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsProject , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsProjectProduct , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PROJECT" ,"dsSearch" , "dsProject");	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PROJECT_PRODUCT" ,"dsSearch" , "dsProjectProduct");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_PROJECT" , true , true , true , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 버젼 정보 데이터 가져오기.
* DB조회
*/
function fnSearchVersion(){		
	
	var projectCode = this.dsProject.getdatabyname( this.dsProject.getpos(),"PROJECT_CODE") ;
	var pamrams = "";
	params = "OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	params = params + " PROJECT_CODE=" + projectCode.replaceAll(' ','^');
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsVersion , "NONE" , "CLEAR" ,  "" , "" , "TR_VERSION");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_VERSION");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PROJECT_VERSION" ,"" , "dsVersion", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_PROJECT_VERSION" , true , true , false , "TR_VERSION");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
/*
* 업체 담당자 정보 데이터 가져오기.
* DB조회
*/
function fnSearchProduct(){		
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "NONE" , "CLEAR" ,  "" , "" , "TR_PROJECT_PRODUCT");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsProjectProduct , "NONE" , "CLEAR" ,  "" , "" , "TR_PROJECT_PRODUCT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_PROJECT_PRODUCT");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PROJECT_PRODUCT" ,"dsSearch" , "dsProjectProduct");	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_PROJECT_PRODUCT" , true , false , true , "TR_PROJECT_PRODUCT");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	//차종
	var carTypeCode = this.dsProject.getdatabyname(this.dsProject.getpos(),"CAR_TYPE_CODE");
	if(UT.isNull(carTypeCode) ){
		var strMetaData = UT.gfnGetMetaData("LABEL01587", "차종"); 
	    UT.alert(this.screen , "MSG004" , "차종은(는) 필수입력항목입니다.",strMetaData);
		this.cboCarType.setfocus();
	    return;
	}
	//등록년도
	var registerYear = this.dsProject.getdatabyname(this.dsProject.getpos(),"REGISTER_YEAR");
	if(UT.isNull(registerYear) ){
		var strMetaData = UT.gfnGetMetaData("LABEL02367", "등록년도"); 
	    UT.alert(this.screen , "MSG004" , "등록년도은(는) 필수입력항목입니다.",strMetaData);
		this.fldRegisterYear.setfocus();
	    return;
	}
	//중요도
	var importanceCode = this.dsProject.getdatabyname(this.dsProject.getpos(),"IMPORTANCE_CODE");
	if(UT.isNull(importanceCode) ){
		var strMetaData = UT.gfnGetMetaData("LABEL00254", "중요도"); 
	    UT.alert(this.screen , "MSG004" , "중요도은(는) 필수입력항목입니다.",strMetaData);
		this.cboImportance.setfocus();
	    return;
	}
	//수주목표년도
	var targetYear = this.dsProject.getdatabyname(this.dsProject.getpos(),"TARGET_YEAR");
	if(UT.isNull(targetYear) ){
		var strMetaData = UT.gfnGetMetaData("LABEL02411", "수주목표년도"); 
	    UT.alert(this.screen , "MSG004" , "수주목표년도은(는) 필수입력항목입니다.",strMetaData);
		this.fldTargetYear.setfocus();
	    return;
	}
	//법인구분
	var countryCode = this.dsProject.getdatabyname(this.dsProject.getpos(),"OU_COUNTRY_CODE");
	if(UT.isNull(countryCode) ){
		var strMetaData = UT.gfnGetMetaData("LABEL02368", "법인구분"); 
	    UT.alert(this.screen , "MSG004" , "법인구분은(는) 필수입력항목입니다.",strMetaData);
		this.cboOuCountry.setfocus();
	    return;
	}
	//내수/수출
	var domesticExportCode = this.dsProject.getdatabyname(this.dsProject.getpos(),"DOMESTIC_EXPORT_CODE");
	if(UT.isNull(domesticExportCode) ){
		var strMetaData = UT.gfnGetMetaData("LABEL02460", "내수/수출"); 
	    UT.alert(this.screen , "MSG004" , "내수/수출은(는) 필수입력항목입니다.",strMetaData);
		this.cboDomesticExport.setfocus();
	    return;
	}
	//고객명
	var customerName = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	if(UT.isNull(customerName) ){
		var strMetaData = UT.gfnGetMetaData("LABEL00193", "고객명"); 
	    UT.alert(this.screen , "MSG004" , "고객명은(는) 필수입력항목입니다.",strMetaData);
		this.fldCustomerName.setfocus();
	    return;
	}	

	//통화
	var currencyCode = this.dsProject.getdatabyname(this.dsProject.getpos(),"CURRENCY_CODE");
	if(UT.isNull(currencyCode) ){
		var strMetaData = UT.gfnGetMetaData("LABEL02429", "통화"); 
	    UT.alert(this.screen , "MSG004" , "통화은(는) 필수입력항목입니다.",strMetaData);
		this.cboCurrency.setfocus();
	    return;
	}		
	//RFQ
	var RFQ = this.dsProject.getdatabyname(this.dsProject.getpos(),"RFQ_CODE");
	if(UT.isNull(RFQ) ){
		var strMetaData = UT.gfnGetMetaData("LABEL02469", "RFQ"); 
	    UT.alert(this.screen , "MSG004" , "RFQ은(는) 필수입력항목입니다.",strMetaData);
		this.fldSRFQ.setfocus();
	    return;
	}
	var rCount = this.dsProjectProduct.getrowcount();
	if ( rCount <= 0 )
	{
		var strMetaData = UT.gfnGetMetaData("LABEL02465", "제품"); 
	    UT.alert(this.screen , "MSG004" , "제품은(는) 필수입력항목입니다.",strMetaData);
		this.btnAddRow.setfocus();
	    return	
	}	
	//담당자정보 필수 항목 검사
	var aryDual = [ "BUSINESS_GROUP_CODE","PRODUCT_GROUP_CODE","PRODUCT_NAME_CODE","PRODUCT_MODEL_CODE","PRODUCT_PKG_CODE","ITEM_NAME"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdProduct, aryDual, false))
	{
		return false;
	}
	
	return true;
}
/*
* 저장
*/
function fnSaveData(alertshow){
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	//Project
    for(var i=0;i<this.dsProject.getrowcount();i++){
	    var sRow = this.dsSearch.getpos();
	    var op = this.dsProject.getrowoperation(i);
	    if( op != XFD_ROWOP_DELETE  ){
	    	this.dsProject.setrowoperation(i, XFD_ROWOP_INSERT);
	    } 
		this.dsProject.setdatabyname(i , "PROJECT_VERSION" , this.dsSearch.getdatabyname(sRow,"PROJECT_VERSION"));
			
	}	
	//product 
    for(var i=0;i<this.dsProjectProduct.getrowcount();i++){
	    var sRow = this.dsSearch.getpos();
	    var op = this.dsProjectProduct.getrowoperation(i);
	    if( op != XFD_ROWOP_DELETE  ){
	    	this.dsProjectProduct.setrowoperation(i, XFD_ROWOP_INSERT);
	    } 
		//this.dsProjectProduct.setdatabyname(i , "PROJECT_PRODUCT_ID" , "");
		this.dsProjectProduct.setdatabyname(i , "PROJECT_VERSION" , this.dsSearch.getdatabyname(sRow,"PROJECT_VERSION"));
			
	}		
	TRN.gfnTranDataSetHandle(this.screen , this.dsProject , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의			
	TRN.gfnTranDataSetHandle(this.screen , this.dsProjectProduct , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의	
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.REVISION_PROJECT" , "" , "", "dsProject" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.REVISION_PROJECT_PRODUCT" , "" , "", "dsProjectProduct" );	// 추가 수정 삭제	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
	
	
/*		
	TRN.gfnTranDataSetHandle(this.screen , this.dsProject , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsProjectProduct , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");							//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.INSERT_OMS_PROJECT" , "OmsProjectMapper.UPDATE_OMS_PROJECT" , "OmsProjectMapper.DELETE_OMS_PROJECT", "dsProject" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.INSERT_OMS_PROJECT_PRODUCT" , "OmsProjectMapper.UPDATE_OMS_PROJECT_PRODUCT" , "OmsProjectMapper.DELETE_OMS_PROJECT_PRODUCT", "dsProjectProduct" );	// 추가 수정 삭제
	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
*/		
}
/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	this.fnSearch();
}

/*
* 저장버튼 클릭시 이벤트 처리 : 저장(등록, 수정, 삭제)
*/
function btnCommonSave_on_mouseup(objInst)
{	
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	
	UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
}

function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
//		}
//		else if(result == XFD_MB_RESNO)  {
//			return 0;
		}
//		else if(result == XFD_MB_RESCANCEL)  {
//			UT.alert(this.screen,"","[취소]를 선택하셨습니다");
//		}
//		else if(result == XFD_MB_RESCONTINUE)  {
//			UT.alert(this.screen,"","[계속]를 선택하셨습니다");
//		}
	}

}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}


/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
    this.screen.unload();
}

function cboOuCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtProjectCode_on_changed(objInst, prev_text, curr_text, event_type)
{
    this.fnSearchVersion();
}

/*
* 업체정보 Callback
*/
function fnVendorClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
	} else {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , "");
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , "");	
	}
}

function btnVendorNamePop_on_click(objInst)
{
	this.fnVendorPopupCall("","");
}

function fnVendorPopupCall(vendorCode, vendorName) {
	var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = vendorCode;
	objPopupExtraData.P_DATA3 = vendorName;
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorClosePopCallback";
	screen.loadportletpopup("VendorNameSelect", "/FRAME/popupVendor", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}



function btnAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdProduct.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdProduct,false,rowCount);
	this.dsProjectProduct.setdatabyname(rowCount , "OU_CODE" , ouCode);
	this.dsProjectProduct.setdatabyname(rowCount , "PROJECT_CODE" , this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_CODE"));
	this.dsProjectProduct.setdatabyname(rowCount , "PROJECT_VERSION" , this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_VERSION"));
}

function btnDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdProduct);
}





function cboVersion_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function btnCustomerPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupCustClosePopCallback";
	screen.loadportletpopup(strPopupName, "/FRAME/popupCust", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
		
}
/*
* 고객정보 Callback
*/
function fnPopupCustClosePopCallback(aryHash) 
{ 
	var iRow = this.dsProject.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsProject.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsProject.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
		this.dsProject.setdatabyname(iRow , "CUSTOMER_GROUP_NAME" , aryHash["CUSTOMER_GROUP_NAME"]);
		this.dsProject.setdatabyname(iRow , "ERP_CUSTOMER_ID" , aryHash["ERP_CUSTOMER_ID"]);
		this.dsProject.setdatabyname(iRow , "ERP_CUSTOMER_NAME" , aryHash["ERP_CUSTOMER_NAME"]);
	}
}

function cboOuCode_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
}



function btnOrgProjectPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02468", "원프로젝트코드");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupOrgProjectPopCallback";
	screen.loadportletpopup(strPopupName, "/FRAME/popupPrj", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	
}
/*
* OrgProject Callback
*/
function fnPopupOrgProjectPopCallback(aryHash) 
{ 
	var iRow = this.dsProject.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsProject.setdatabyname(iRow , "ORG_PROJECT_CODE" , aryHash["PROJECT_CODE"]);
	}
}

function btnRFQPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02469", "RFQ");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupRFQPopCallback";
	screen.loadportletpopup(strPopupName, "/OMS/Oms1111", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
		
}
/*
* RFQ Callback
*/
function fnPopupRFQPopCallback(aryHash) 
{ 
	var iRow = this.dsProject.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsProject.setdatabyname(iRow , "RFQ_CODE" , aryHash["RFQ_CODE"]);
	}
}



function fnCopyPopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , aryHash["NEW_PROJECT_CODE"]);
		this.dsSearch.setdatabyname(iRow , "PROJECT_VERSION" ,aryHash["NEW_PROJECT_VERSION"]);
	}	
   this.fnSearch();
	
}



function btnProjectPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02407", "프로젝트코드");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupProjectPopCallback";
	screen.loadportletpopup(strPopupName, "/FRAME/popupPrj", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	
}
/*
* Project Callback
*/
function fnPopupProjectPopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , aryHash["PROJECT_CODE"]);
		this.dsSearch.setdatabyname(iRow , "PROJECT_VERSION" , aryHash["PROJECT_VERSION"]);
	}
	this.fnSearchVersion();
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