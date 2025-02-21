/*------------------------------------
* program id : Oms9101
* desc	   : RFQ 등록(개발 교육 이수)
* dev date   : 2024-08-26
* made by    : YELEE
*-------------------------------------*/
var ouCode;
var authScope;
var fvSelectedRow;	//그리드 선택된 row
var authScope;
var readOnlyColor = factory.rgb(247,251,255);


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
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅	
	this.fnDsSet();              // DATASET 세팅
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
	this.btnCommonSearch_on_click();
}



/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
    ouCode = INI.GV_OU_CODE;
}

/*
* 데이터셋 
*/
function fnDsSet(){
	UT.gfnGetOuCodes(this.dsOU);	// ou code set
// 1. dsCarType options 부르는 함수 호출
//	UT.gfnGetCommCodes(this.dsCarType, "O018");		 // 차종
// 2. mapper 호출
	TRN.gfnTranDataSetHandle(this.screen , this.dsCarType , "NONE" , "CLEAR" ,  "" , "" , "TRANSACITON_COMMON");	
	TRN.gfnCommonTransactionClear(this.screen, "TRANSACITON_COMMON");	//트랜젝션 데이터셋 초기화 (필수)
	//TRN.gfnCommonTransactionAddSearch(this.screen , "OmsKylMapper.SELECT_RFQ" ,"" , "dsList");	//조회
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsKylMapper.SELECT_CAR_TYPE" ,"" , "dsCarType");	//조회
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , false , "TRANSACITON_COMMON");
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
    UT.gfnHrEditorStyle(this.comOu, "D");
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


/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}



function btnCommonSearch_on_click(objInst)
{
	// gfnTranDataSetHandle : 핸들링할 데이터셋 뭐냐?
	// 조회시 데이터 다 던져주는데 실행시에는 암것도 하지마
	//TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	//던져주는건 암것도 없지만 결과는 화면에 있는거 다 지우고 가져와
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)
	// INPUT DATA : DS SEARCH
	// OUTPUT DATA : DS LIST	
	//TRN.gfnCommonTransactionAddSearch(this.screen , "OmsKylMapper.SELECT_RFQ" ,"dsSearch" , "dsList");	//조회
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsKylMapper.SELECT_RFQ_EXCEPT_NAMES" ,"" , "dsList");	//조회
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , false , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}



function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	// 고객명 Poupup
    if(this.grdList.getcolumnname(nColumn) == "CUSTOMER_POPUP"){
	// 프로젝트가 등록되었으면 수정불가
		var projectCount = this.dsList.getdatabyname(this.dsList.getpos(),"PROJECT_COUNT");
		if (projectCount > 0) {
			return;
		}
		var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupCustClosePopCallback";
		screen.loadportletpopup(strPopupName, "/FRAME/popupCust", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}	
	
	// RFQ 담당자 Poupup
    if(this.grdList.getcolumnname(nColumn) == "RFQ_CHARGE_POPUP"){
		//프로젝트가 등록되었으면 수정불가
		var projectCount = this.dsList.getdatabyname(this.dsList.getpos(),"PROJECT_COUNT");
		if (projectCount > 0) {
			return;
		}
		
		var strPopupName = UT.gfnGetMetaData("LABEL02377", "RFQ response");
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupRFQResponsePopCallback";
		screen.loadportletpopup(strPopupName, "/FRAME/popupCharge", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	}	
}

function fnPopupCustClosePopCallback(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsList.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
		this.dsList.setdatabyname(iRow , "CUSTOMER_GROUP_NAME" , aryHash["CUSTOMER_GROUP_NAME"]);
		this.dsList.setdatabyname(iRow , "ERP_CUSTOMER_ID" , aryHash["ERP_CUSTOMER_ID"]);
		this.dsList.setdatabyname(iRow , "ERP_CUSTOMER_NAME" , aryHash["ERP_CUSTOMER_NAME"]);
	}
}

/*
* RFQ Response Callback
*/
function fnPopupRFQResponsePopCallback(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "CHARGE_USER_ID" , aryHash["USER_ID"]);
		this.dsList.setdatabyname(iRow , "CHARGE_USER_NAME" ,aryHash["USER_NAME"]);
	}
}