/*------------------------------------
* program id : Oms1060
* desc	   : 원가관리
* dev date   : 2023-06-29
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
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅	
	this.fnDsSet();              // DATASET 세팅
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
    var projectCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_CODE");
	if( !UT.isNull(projectCode )){		
		this.btnCommonSearch_on_mouseup();
    }
}



/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	var objExtraData;
    objExtraData = this.screen.getextradata(); //
	if(objExtraData !== null && objExtraData.P_DATA1 == "MODIFY") {
		this.dsSearch.setdatabyname(iRow, "OU_CODE", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(iRow, "PROJECT_CODE", objExtraData.P_DATA3);
		this.dsSearch.setdatabyname(iRow, "CUSTOMER_NAME", objExtraData.P_DATA4);
		this.dsSearch.setdatabyname(iRow, "PROJECT_PRODUCT_ID", objExtraData.P_DATA5);
		this.dsSearch.setdatabyname(iRow, "DETAIL_STATUS_CODE", objExtraData.P_DATA6);
		this.dsSearch.setdatabyname(iRow, "ACT_STATUS_CODE", objExtraData.P_DATA7);
		this.dsSearch.setdatabyname(iRow, "ITEM_NAME", objExtraData.P_DATA8);
		this.dsSearch.setdatabyname(iRow, "AUTH", objExtraData.P_DATA9);
	} 	
    ouCode = INI.GV_OU_CODE;
    //CLOSE인 경우 저장 불가
    var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
    var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");
    if ( detailStausCode == "D09" ||detailStausCode == "D04" || auth!="W" ){//D09:close D04:drop  W:수정권한
	     this.btnAddRow.setenable(false);
	     this.btnDelRow.setenable(false);
	     this.btnCommonSave.setenable(false);
    }

}
/*
* 데이터셋 
*/
function fnDsSet(){

	UT.gfnGetOuCodes(this.dsOU);	// ou code set 
	UT.gfnGetCommCodes(this.dsCurrency, "F018");		  // 통화코드 (F018)
	UT.gfnGetCommCodes(this.dsCostStep, "O021");		  // 단계 


}



/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화
    this.comOu.setselectedcodeex(ouCode,true,true); 


    
//    this.fldLatestDegree.settext("Y"); 
 
    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.comOu.setenable( false );
    }


    //내부 사용자인지 확인
    //내부 사용자이면 협력업체 변경 가능
    //협력업체이면 고정
    var userType;
    if( INI.GV_USER_TYPE == "U"){   //유저사용자유형 (내부사용자:U, 외부사용자:V)
	   userType = "INNER"; //INNER: 내부사용자 
    } else{
	   userType = "OUTER"; //INNER: 내부사용자 
    }
    
    
    
    //사용자 변경권한 
    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
        authScope = "DEPT";
    } else {
        if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
	    	authScope = "EMP";  
//	        this.comSite.setenable( false );
 //         this.fldDeptName.setenable(false);
 //           this.btnDeptPop.setvisible(false);
	    } else{
        	authScope = "PINFO";
             //개인권한은 수정할 수 없도록 막음
//	        this.comSite.setenable( false );
/*            this.fldDeptName.setenable(false);
            this.btnDeptPop.setvisible(false);
            this.fldEmpName.setenable(false);
            this.btnEmpNamePop.setvisible(false);
            this.fldEmpNo.setenable(false);
            this.btnEmpNoPop.setvisible(false); */
        }  

   }


    UT.gfnHrEditorStyle(this.edtProjectCode, "D");
    UT.gfnHrEditorStyle(this.edtCustomerName, "D");
    UT.gfnHrEditorStyle(this.edtItem, "D");
    UT.gfnHrEditorStyle(this.edtErpItem, "D");
    UT.gfnHrEditorStyle(this.comOu, "D");
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
      // 상태값을 가져온다.
      var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
	  var auth = this.dsSearch.getdatabyname( this.dsSearch.getpos(), "AUTH"); 
	
      if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(this.screen , "MSG001" , "검색 결과가 없습니다.");		  

		} else {
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리						
             var count = this.grdList.getrowcount();
	         var aryColumn1 = ["COST_STEP_CODE","COST_DATE","SALES_PRICE","MATERIAL_COST","LABOR_COST","EXPENSE_COST","PROFIT","OTHERS","CONFIRM","ATT_YN_POPUP","REMARK"];
	         var aryColumn2 = ["COST_DATE"];
		     for( var iRow = 0; iRow < count ; iRow++){
			    var confirm = this.dsList.getdatabyname(iRow,"CONFIRM");
			    if(confirm =="Y" ||detailStausCode == "D09" || detailStausCode == "D04" || auth!="W" ){
					GRD.gfnHrGrdCellHandle(this.grdList, iRow, aryColumn1, "D");
			    }else{	    
					GRD.gfnHrGrdCellHandle(this.grdList, iRow, aryColumn2, "D");
				}	
	 		}
		}

        //CLOSE,DROP 인 경우 저장 불가
        if ( detailStausCode == "D09" || detailStausCode == "D04" || auth!="W" ){
	        this.btnCommonSave.setenable(false);
	        this.btnAddRow.setenable(false);
	        this.btnDelRow.setenable(false);
            }else{
            this.btnCommonSave.setenable(true);
	        this.btnAddRow.setenable(true);
	        this.btnDelRow.setenable(true);
        }	
	    return;
	}
	
	if(recv_userheader == "insertAndselect")
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		this.fnSearch();
	}

	
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	var projectCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_CODE");
	if( UT.isNull(projectCode )){		
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




function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);	
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
	INI.gfnMdiTabClose();
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
	var projectCode = this.dsSearch.getdatabyname(sRow,"PROJECT_CODE");
	if( UT.isNull(projectCode )){		
		UT.alert(this.screen , "MSG146" , "프로젝트를 선택해주세요.");
		return;
	}
	var rowCount = this.grdList.getrowcount();

	//var row = this.dsList.getpos()+1;	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,rowCount);	
	this.dsList.setdatabyname(iRow , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(iRow , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(iRow , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));

	
}

function btnDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdList);
}

function btnCommonSave_on_mouseup(objInst)
{
	//CLOSE 상태에서는 저장불가
	var sDetailStatusCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
	if( sDetailStatusCode == "D09" ){ //D09:CLOSE
	    UT.alert(this.screen,"MSG564","상세 상태가 CLOSE인 경우 저장할 수 없습니다.");
	    return;
	}	

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

	//필수 항목 검사
	var aryDual = [ "COST_STEP_CODE","COST_DATE", "SALES_PRICE"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return false;
	}
	
	return true;
}

function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmeCostMapper.SELECT_COST" ,"dsSearch" , "dsList");	//조회만	
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
    for(var i=0;i<this.dsList.getrowcount();i++){
	    var projectCode = this.dsList.getdatabyname(i,"PROJECT_CODE");
	    if( UT.isNull( projectCode)){
		    var sRow = this.dsSearch.getpos();
			this.dsList.setdatabyname(i , "OU_CODE" , ouCode);	
			this.dsList.setdatabyname(i , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
			this.dsList.setdatabyname(i , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
		}	
	}		
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "OmeCostMapper.INSERT_COST" , "OmeCostMapper.UPDATE_COST" , "OmeCostMapper.DELETE_COST", "dsList" );	// 추가 수정 삭제	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}

function ComProductName_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "PRODUCT_NAME_CODE" , "");
	return 0;
}

function btnProjectPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02407", "프로젝트코드");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupProjectPopCallback";
	screen.loadportletpopup(strPopupName, "/OMS/Oms1022", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	
}
/*
* Project Callback
*/
function fnPopupProjectPopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , aryHash["PROJECT_CODE"]);
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsSearch.setdatabyname(iRow , "CAR_TYPE_NAME" , aryHash["CAR_TYPE_NAME"]);
		this.dsSearch.setdatabyname(iRow , "ITEM_NAME" , aryHash["ITEM_NAME"]);
		this.dsSearch.setdatabyname(iRow , "ERP_ITEM_NO" , aryHash["ERP_ITEM_NO"]);
		this.dsSearch.setdatabyname(iRow , "PROJECT_PRODUCT_ID" , aryHash["PROJECT_PRODUCT_ID"]);
		this.dsSearch.setdatabyname(iRow , "DETAIL_STATUS_CODE" , aryHash["DETAIL_STATUS_CODE"]);
		this.dsSearch.setdatabyname(iRow , "ACT_STATUS_CODE" , aryHash["ACT_STATUS_CODE"]);
		this.dsSearch.setdatabyname(iRow , "AUTH" , aryHash["AUTH"]);						
	}
	if( aryHash["DETAIL_STATUS_CODE"] !="D09" && aryHash["DETAIL_STATUS_CODE"]!="D04" && aryHash["AUTH"]=="W"){ //D09:close D04:drop  R:read 권한
        this.btnAddRow.setenable(true);
        this.btnDelRow.setenable(true);
        this.btnCommonSave.setenable(true);	 	
	}else{
        this.btnAddRow.setenable(false);
        this.btnDelRow.setenable(false);
        this.btnCommonSave.setenable(false);
	}
	this.dsList.removeallrows();
	this.fnSearch();	

}

function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
    var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
    var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");	
	// 첨부 Poupup
    if(this.grdList.getcolumnname(nColumn) == "ATT_YN_POPUP"){
       var estimateCostId = this.dsList.getdatabyname(this.dsList.getpos(),"COST_ID");
       if(UT.isNull( estimateCostId)){
	        UT.alert(this.screen , "MSG561" , "저장 후 첨부가 가능합니다. 먼저 저장하세요." );
			return;
	    }
		// 저장한다
//	    this.fnSaveData(false);

		var strPopupName = UT.gfnGetMetaData("LABEL02589", "첨부");
		objPopupAttData.clear();
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = estimateCostId;
		var confirm = this.dsList.getdatabyname(this.dsList.getpos(),"CONFIRM");
	    if(confirm =="Y" ||detailStausCode == "D09" ||detailStausCode == "D04" || auth!="W" ){
			objPopupAttData.P_MODE = "R";
	    }else{	    
			objPopupAttData.P_MODE = "W";
		}
		objPopupAttData.P_FILE_GUBUN = "Oms1060";
		objPopupAttData.P_REF_NAME = "";
		objPopupAttData.P_DIR_TYPE = "EST";
		objPopupAttData.P_OU_CODE = this.dsList.getdatabyname(this.dsList.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
		screen.loadportletpopup("AttFileQcmStd001", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
	}	
}


/*
* 첨부파일 Callback
*/
function fnAttFilePopCallback(aryHash) 
{ 
	// 재조회
	this.fnSearch();
}



function grdList_on_itemvaluechanged(objInst, nRow, nColumn, strPrevItemText, strItemText)
{
	let strColumn = this.grdList.getcolumnname(nColumn);
	let salesPrice;
	let totalCost;
	let processCost;
	let manufacturCost;
	let expenseCost;
	let overheadCost;
	let sgnaCost;
	let otherCost;
    let nChageColumn;

	if (strColumn == "TOTAL_COST" ||strColumn == "REVENUE_COST"){
		salesPrice = Number(this.dsList.getdatabyname(nRow, "TOTAL_COST"))
			       + Number(this.dsList.getdatabyname(nRow, "REVENUE_COST"));
		this.dsList.setdatabyname(nRow, "SALES_PRICE", salesPrice);
	} 
	else if (strColumn == "MATERIAL_COST" || strColumn == "PROCESS_COST" || strColumn == "SGNA_COST" || strColumn == "OTHER_COST"){
		totalCost = Number(this.dsList.getdatabyname(nRow, "MATERIAL_COST"))
			      + Number(this.dsList.getdatabyname(nRow, "PROCESS_COST"))
			      + Number(this.dsList.getdatabyname(nRow, "SGNA_COST"))
			      + Number(this.dsList.getdatabyname(nRow, "OTHER_COST"));

		this.dsList.setdatabyname(nRow, "TOTAL_COST", totalCost);
	}
	else if (strColumn == "LABOR_COST" || strColumn == "MANUFACTUR_COST"){
		processCost = Number(this.dsList.getdatabyname(nRow, "LABOR_COST"))
			        + Number(this.dsList.getdatabyname(nRow, "MANUFACTUR_COST"));

		this.dsList.setdatabyname(nRow, "PROCESS_COST", processCost);
	}
	else if (strColumn == "EXPENSE_COST" || strColumn == "OVERHEAD_COST"){
		manufacturCost = Number(this.dsList.getdatabyname(nRow, "EXPENSE_COST"))
			           + Number(this.dsList.getdatabyname(nRow, "OVERHEAD_COST"));

		this.dsList.setdatabyname(nRow, "MANUFACTUR_COST", manufacturCost);
	}
	else if (strColumn == "EQUIPMENT_DEPR_COST" || strColumn == "MOLD_DEPR_COST" || strColumn == "REPAIR_COST" || strColumn == "ELECTRICITY_COST"){
		expenseCost = Number(this.dsList.getdatabyname(nRow, "EQUIPMENT_DEPR_COST"))
			        + Number(this.dsList.getdatabyname(nRow, "MOLD_DEPR_COST"))
			        + Number(this.dsList.getdatabyname(nRow, "REPAIR_COST"))
			        + Number(this.dsList.getdatabyname(nRow, "ELECTRICITY_COST"));

		this.dsList.setdatabyname(nRow, "EXPENSE_COST", expenseCost);
	}
	else if (strColumn == "VARIABLE_OVH_COST" || strColumn == "FIXED_OVH_COST"){
		overheadCost = Number(this.dsList.getdatabyname(nRow, "VARIABLE_OVH_COST"))
			         + Number(this.dsList.getdatabyname(nRow, "FIXED_OVH_COST"));

		this.dsList.setdatabyname(nRow, "OVERHEAD_COST", overheadCost);
	}
	else if (strColumn == "MAINTENANCE_COST" || strColumn == "TEST_COST" || strColumn == "TRANSPORTATION_COST" || strColumn == "PACKAGING_COST" || strColumn == "COMMISSION_COST"){
		sgnaCost = Number(this.dsList.getdatabyname(nRow, "MAINTENANCE_COST"))
			     + Number(this.dsList.getdatabyname(nRow, "TEST_COST"))
			     + Number(this.dsList.getdatabyname(nRow, "TRANSPORTATION_COST"))
			     + Number(this.dsList.getdatabyname(nRow, "PACKAGING_COST"))
			     + Number(this.dsList.getdatabyname(nRow, "COMMISSION_COST"));

		this.dsList.setdatabyname(nRow, "SGNA_COST", sgnaCost);
	}
	else if (strColumn == "QUALITY_COST" || strColumn == "INSPECTION_COST" || strColumn == "INTEREST_COST"){
		otherCost = Number(this.dsList.getdatabyname(nRow, "QUALITY_COST"))
			      + Number(this.dsList.getdatabyname(nRow, "INSPECTION_COST"))
			      + Number(this.dsList.getdatabyname(nRow, "INTEREST_COST"));

		this.dsList.setdatabyname(nRow, "OTHER_COST", otherCost);
	}
}

/*function grdList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	var salesPrice;
	salesPrice = Number(this.dsList.getdatabyname(nPrevSelectRow,"MATERIAL_COST")) +
	             Number(this.dsList.getdatabyname(nPrevSelectRow,"LABOR_COST")) +
	             Number(this.dsList.getdatabyname(nPrevSelectRow,"EXPENSE_COST")) +
	             Number(this.dsList.getdatabyname(nPrevSelectRow,"PROFIT")) +
	             Number(this.dsList.getdatabyname(nPrevSelectRow,"OTHERS")) ;
	
	this.dsList.setdatabyname(nPrevSelectRow , "SALES_PRICE" , salesPrice);
}*/