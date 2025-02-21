/*------------------------------------
* program id : Oms1040
* desc	   : 중장기계획 입력
* dev date   : 2023-06-07
* made by    : SEYUN
*-------------------------------------*/
var ouCode;
var authScope;
var fvSelectedRow;	//그리드 선택된 row
var authScope;
var copyYN;


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
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅	
	this.fnDsSet();              // DATASET 세팅
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
    var projectCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_CODE");
    if (!UT.isNull(projectCode)){
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

	this.dsPlanHeader.removeallrows();
	var iRow2 = this.dsPlanHeader.getrowcount();
	this.dsPlanHeader.insertrow(iRow2);	
	
	var objExtraData;
    objExtraData = this.screen.getextradata(); //
	if(objExtraData !== null && objExtraData.P_DATA1 == "MODIFY") {
		this.dsSearch.setdatabyname(iRow, "OU_CODE", objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(iRow, "PROJECT_CODE", objExtraData.P_DATA3);
		this.dsSearch.setdatabyname(iRow, "PROJECT_VERSION", objExtraData.P_DATA4);
		this.dsSearch.setdatabyname(iRow, "PROJECT_PRODUCT_ID", objExtraData.P_DATA5);
		this.dsSearch.setdatabyname(iRow, "CURRENCY_CODE", objExtraData.P_DATA6);
		this.dsSearch.setdatabyname(iRow, "CUSTOMER_NAME", objExtraData.P_DATA7);
		this.dsSearch.setdatabyname(iRow, "ITEM_NAME", objExtraData.P_DATA8);
		this.dsSearch.setdatabyname(iRow, "DETAIL_STATUS_CODE", objExtraData.P_DATA9);
		this.dsSearch.setdatabyname(iRow, "AUTH", objExtraData.P_DATA10);
		this.dsSearch.setdatabyname(iRow, "DOMESTIC_EXPORT_CODE", objExtraData.P_DATA11);
		this.dsSearch.setdatabyname(iRow, "ROLLING_YN", objExtraData.P_DATA12);

		this.fnSearchVersion();
	} 	
    ouCode = INI.GV_OU_CODE;
    var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
    var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");
    //CLOSE인 경우 저장 불가
    if ( detailStausCode == "D09" ||detailStausCode == "D04" || auth!="W" ){//D09:close D04:drop  W:수정권한
	     this.btnVersion.setenable(false);
	     this.btnAddRow.setenable(false);
	     this.btnAddRowAll.setenable(false);
	     this.btnDelRow.setenable(false);
	     this.btnCommonSave.setenable(false);
	     this.btnUpload.setenable(false);
	     this.btnCopy.setenable(false);
	     this.btnBizCopy.setenable(false);
	     this.cboIncoterms.setenable(false);
    }

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
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화
    this.comOu.setselectedcodeex(ouCode,true,true); 
    copyYN = "Y";
	//내수이면 *Incoterms을 Domestic으로 
	var domesticExport = this.dsSearch.getdatabyname(this.dsSearch.getpos() , "DOMESTIC_EXPORT_CODE" );
	if( domesticExport  == "DOM"){
		this.cboIncoterms.setselectedcodeex("DOM",true,true); 
	}
    
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

	//기준년
	var today = new Date();
	var dateS=Number(today.getFullYear());
	
    this.fldDateS.settext(dateS);


    UT.gfnHrEditorStyle(this.edtProjectCode, "D");
    UT.gfnHrEditorStyle(this.edtCustomerName, "D");
    UT.gfnHrEditorStyle(this.edtItem, "D");
    UT.gfnHrEditorStyle(this.edtUpdateUserName, "D");
    UT.gfnHrEditorStyle(this.edtUpdate, "D");
    UT.gfnHrEditorStyle(this.comOu, "D");
    UT.gfnHrEditorStyle(this.edtErpItem, "D");
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
	   //내수이면 *Incoterms을 Domestic으로 
	   var domesticExport = this.dsSearch.getdatabyname(this.dsSearch.getpos() , "DOMESTIC_EXPORT_CODE" );
	   if( domesticExport  == "DOM"){
		  this.cboIncoterms.setselectedcodeex("DOM",true,true); 
   	}			
       var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");	         
	   //최신 버젼이 아니면 수정불가 
	   var latestYN = this.dsSearch.getdatabyname( this.dsSearch.getpos(), "LATEST_YN"); 
	   var auth = this.dsSearch.getdatabyname( this.dsSearch.getpos(), "AUTH"); 
       if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(this.screen , "MSG001" , "검색 결과가 없습니다.");
           if( latestYN == "Y" && detailStausCode != "D09" && detailStausCode != "D04" && auth=="W" ){ //D09:close D04:drop  W:수정권한			     	
		         this.btnVersion.setenable(false); //리비젼 버튼 비활성
			     this.btnAddRow.setenable(true);
	             this.btnAddRowAll.setenable(true);
			     this.btnDelRow.setenable(true);
			     this.btnCommonSave.setenable(true);
			     this.btnUpload.setenable(true);
			     this.btnCopy.setenable(true);
	             this.btnBizCopy.setenable(true);
			     this.cboIncoterms.setenable(true);
		     }else{
			     this.btnVersion.setenable(false);
			     this.btnAddRow.setenable(false);
	             this.btnAddRowAll.setenable(false);
			     this.btnDelRow.setenable(false);
			     this.btnCommonSave.setenable(false);
			     this.btnUpload.setenable(false);
		     	this.btnCopy.setenable(false);
	             this.btnBizCopy.setenable(false);
			     this.cboIncoterms.setenable(false);
            }		  

			return;
		} else {
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리		
		//	UT.alert(this.screen ,"",latestYN+ detailStausCode+auth)	;						 	
		    if( latestYN == "Y" && detailStausCode != "D09" && detailStausCode != "D04" && auth=="W" ){ //D09:close D04:drop  W:수정권한			     	
		         this.btnVersion.setenable(true);
			     this.btnAddRow.setenable(true);
	             this.btnAddRowAll.setenable(true);
			     this.btnDelRow.setenable(true);
			     this.btnCommonSave.setenable(true);
			     this.btnUpload.setenable(true);
			     this.btnCopy.setenable(true);
	             this.btnBizCopy.setenable(true);
			     this.cboIncoterms.setenable(true);
	             //확인된 ROW를 활성
                 var count = this.grdList.getrowcount();
		         var aryColumn = ["QTY","UNIT_PRICE","CURRENCY_CODE"];
		         var aryColumn2 = ["PLAN_YYYYMM"];
			     for( var iRow = 0; iRow < count ; iRow++){	    
		            GRD.gfnHrGrdCellHandle(this.grdList, iRow, aryColumn, "G");
					GRD.gfnHrGrdCellHandle(this.grdList, iRow, aryColumn2, "D");		 						
		 		}
		     }else{			
			     this.btnVersion.setenable(false);
			     this.btnAddRow.setenable(false);
	             this.btnAddRowAll.setenable(false);
			     this.btnDelRow.setenable(false);
			     this.btnCommonSave.setenable(false);
			     this.btnUpload.setenable(false);
		     	this.btnCopy.setenable(false);
	             this.btnBizCopy.setenable(false);
			     this.cboIncoterms.setenable(false);
	             //확인된 ROW를 비활성
                 var count = this.grdList.getrowcount();
		         var aryColumn = ["QTY","UNIT_PRICE","CURRENCY_CODE","PLAN_YYYYMM"];
		        for( var iRow = 0; iRow < count ; iRow++){	    
		                GRD.gfnHrGrdCellHandle(this.grdList, iRow, aryColumn, "D");
		 						
		 		}
	      	}			
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
		this.fnSearchVersion();
	}
	
	if(recv_userheader == "insertAndselect")
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		this.fnSearch();
	}

	if(recv_userheader == "SELECT_PLAN_VERSION")
	{
	    var count = this.dsVersion.getrowcount();
	    var projectCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(), "PROJECT_CODE");
	    //plan version 이 존재하지 않으면 1을 추가 
	    if (!UT.isNull(projectCode) && count == 0){
	       UT.gfnDsAddRow(this.dsVersion);
	       this.dsVersion.setdatabyname(this.dsVersion.getpos(), "CODE", "1");
	       this.dsVersion.setdatabyname(this.dsVersion.getpos(), "NAME", "1");
	       this.dsVersion.setdatabyname(this.dsVersion.getpos(), "LATEST_YN", "Y");
	    
	 	  // max plan version을 default 값으로 설정 
	 	  var version = this.dsVersion.getdatabyname(0,"CODE");
	 	  var latestYn = this.dsVersion.getdatabyname(0,"LATEST_YN");
	 	  this.dsSearch.setdatabyname(this.dsSearch.getpos(), "PLAN_VERSION", version);
	 	  this.dsSearch.setdatabyname(this.dsSearch.getpos(), "LATEST_YN", latestYn);
		
		   //리비젼 버튼 비활성
           this.btnVersion.setenable(false);
		}
		// search version의 값이 없을 경우
		// 프로젝트 조회에서 중장기계획 입력화면을 호출할 경우 plan_version의 값이 없다. 
		// list의 첫번째 값의 version을 가져온다.
		// plan_version 없이 조회 시 lastest_yn 이 'Y'인 경우를 조회해 온다. 
		var planVersion = this.dsSearch.getdatabyname(this.dsSearch.getpos(), "PLAN_VERSION");
		if ( UT.isNull(planVersion)){	
			var version = this.dsVersion.getdatabyname(0, "CODE"); 
		    this.dsSearch.setdatabyname(this.dsSearch.getpos(), "PLAN_VERSION", version);	
		}	
	}	
	//전월 복사 
	if(recv_userheader == "SelectProc")
	{
		//에러시 RETURN
	    var retcode = this.dsProcResult.getdatabyname(this.dsProcResult.getpos() ,"RETCODE");
		if( retcode != "S"){ 
		return;
		}
		this.dsSearch.setdatabyname(this.dsSearch.getpos() , "PLAN_VERSION" , "");
        this.fnSearchVersion(false);
        UT.alert(this.screen , "MSG364" , "복사되었습니다.");	
		UT.statMsg(this.screen , "MSG364" , "복사되었습니다.");
		
	    // max plan version을 default 값으로 설정 
	    var version = this.dsVersion.getdatabyname(0,"CODE");
	    var latestYn = this.dsVersion.getdatabyname(0,"LATEST_YN");
	    this.dsSearch.setdatabyname(this.dsSearch.getpos(), "PLAN_VERSION", version);
	    this.dsSearch.setdatabyname(this.dsSearch.getpos(), "LATEST_YN", latestYn);
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
		UT.alert(this.screen , "MSG146" , "프로젝트를 선택해주세요.");	
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
	if(messagebox_id == "BizCopy_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData(false);
			this.fnBizCopy();
        }
	}	
	if(messagebox_id == "addAll_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.dsList.deleteallrows();
			this.fnSaveData(false);
			this.fnAddRowAll();
        }
	}		
	if(messagebox_id == "upload_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.dsList.deleteallrows();
			this.fnSaveData(false);
			this.fnUpload();
        }
	}	
	
}
function fnBizCopy()
{	
	//사업계획단가 복사 POPUP
	var iRow = this.dsSearch.getpos();
	var strPopupName = UT.gfnGetMetaData("LABEL02676", "사업계획 단가");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(iRow,"OU_CODE");
	objPopupExtraData.P_DATA2 = this.dsSearch.getdatabyname(iRow,"PROJECT_CODE");
	objPopupExtraData.P_DATA3 = this.dsSearch.getdatabyname(iRow,"PROJECT_PRODUCT_ID");
	objPopupExtraData.P_DATA4 = this.dsSearch.getdatabyname(iRow,"BASE_YEAR");
	objPopupExtraData.P_DATA6 = "";	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnBizCopyPopCallback";
	screen.loadportletpopup(strPopupName, "/OMS/Oms1042", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
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

function btnCopy_on_mouseup(objInst)
{
	//기준년도 필수 입력 Check
	var baseYear = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"BASE_YEAR");
	if( UT.isNull(baseYear)){
		var label = UT.gfnGetMetaData("LABEL01802", "*기준년도");
		UT.alert(this.screen , "MSG004" , label+"는 필수입력항목입니다.",label );
		return;		
	}
	//복사
	var projectCode = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"PROJECT_CODE") ;
	var projectProductId = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"PROJECT_PRODUCT_ID") ;
	var itemName = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"ITEM_NAME") ;
	var baseYear = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"BASE_YEAR") ;
    var vParam = "PROJECT_CODE="  + projectCode.replaceAll(' ','^');
    vParam = vParam + " USER_ID=" + INI.GV_USER_ID ;
    vParam = vParam + " OU_CODE=" + ouCode ;
    vParam = vParam + " PROJECT_PRODUCT_ID=" + projectProductId;
    vParam = vParam + " ITEM_NAME=" + itemName.replaceAll(' ','^');
    vParam = vParam + " BASE_YEAR=" + baseYear;
    vParam = vParam + " RETCODE="  + "" ;
    vParam = vParam + " RETMESG=" + ""; 
    copyYN = "Y";
    TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, "", "", "", "", "TR_COPY");
    TRN.gfnCommonTransactionClear(this.screen,"TR_COPY");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsProjectMapper.COPY_LONG_PLAN_PROC" ,"","dsProcResult",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false,"TR_COPY");

    var retcode = this.dsProcResult.getdatabyname(this.dsProcResult.getpos() ,"RETCODE");
	if( retcode != "S"){
		if( !retcode.includes("MSG") ){
	       UT.alert(this.screen , "MSG545" , "Error : " +this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG"), this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG")); 
	    }else{
		   UT.alert(this.screen , "retcode" ,"사업계획 데이터가 존재하지 않습니다.");
		}
	    copyYN = "N";	    
	return;
	}
}

function fnCopyPopCallback(aryHash) 
{ 
   this.btnCommonSearch_on_mouseup();
	
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

function btnAddRowAll_on_mouseup(objInst)
{

	var sRow = this.dsSearch.getpos();
	var planVersion = this.dsSearch.getdatabyname(sRow,"PLAN_VERSION");
	if( UT.isNull(planVersion )){		
		UT.alert(this.screen , "MSG146" , "프로젝트를 선택해주세요.");
		return;
	}
    UT.confirm(this.screen,"MSG591","기존의 데이터가 삭제됩니다. 계속하시겠습니까??","",0,"addAll_confirm");	    	
}	
function fnAddRowAll()
{   
	var sRow = this.dsSearch.getpos();
	this.dsList.removeallrows();
	//var rowCount = this.dsList.getrowcount();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,0);	
	this.dsList.setdatabyname(0 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(0 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(0 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(0 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(0 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(0 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"01");
	this.dsList.setdatabyname(0 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(0 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능
	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,1);
	this.dsList.setdatabyname(1 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(1 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(1 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(1 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(1 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(1 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"02");
	this.dsList.setdatabyname(1 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(1 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능
	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,2);
	this.dsList.setdatabyname(2 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(2 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(2 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(2 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(2 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(2 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"03");
	this.dsList.setdatabyname(2 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(2 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,3);
	this.dsList.setdatabyname(3 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(3 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(3 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(3 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(3 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(3 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"04");
	this.dsList.setdatabyname(3 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(3 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,4);
	this.dsList.setdatabyname(4 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(4 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(4 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(4 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(4 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(4 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"05");
	this.dsList.setdatabyname(4 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(4 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,5);
	this.dsList.setdatabyname(5 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(5 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(5 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(5 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(5 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(5 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"06");
	this.dsList.setdatabyname(5 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(5 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,6);
	this.dsList.setdatabyname(6 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(6 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(6 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(6 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(6 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(6 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"07");
	this.dsList.setdatabyname(6 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(6 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,7);
	this.dsList.setdatabyname(7 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(7 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(7 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(7 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(7 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(7 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"08");
	this.dsList.setdatabyname(7 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(7 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,8);
	this.dsList.setdatabyname(8 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(8 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(8 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(8 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(8 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(8 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"09");
	this.dsList.setdatabyname(8 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(8 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,9);
	this.dsList.setdatabyname(9 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(9 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(9 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(9 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(9 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(9 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"10");
	this.dsList.setdatabyname(9 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(9 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,10);
	this.dsList.setdatabyname(10 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(10 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(10 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(10 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(10 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(10 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"11");
	this.dsList.setdatabyname(10 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(10 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,11);
	this.dsList.setdatabyname(11 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(11 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(11 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(11 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(11 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(11 , "PLAN_YYYYMM" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR") +"12");
	this.dsList.setdatabyname(11 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(11 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,12);
	this.dsList.setdatabyname(12 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(12 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(12 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(12 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(12 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(12 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 1) +"01");
	this.dsList.setdatabyname(12 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(12 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,13);
	this.dsList.setdatabyname(13 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(13 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(13 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(13 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(13 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(13 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 2) +"01")
	this.dsList.setdatabyname(13 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(13 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,14);
	this.dsList.setdatabyname(14 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(14 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(14 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(14 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(14 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(14 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 3) +"01")
	this.dsList.setdatabyname(14 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(14 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능
		
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,15);
	this.dsList.setdatabyname(15 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(15 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(15 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(15 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(15 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(15 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 4) +"01")
	this.dsList.setdatabyname(15 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(15 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,16);
	this.dsList.setdatabyname(16 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(16 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(16 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(16 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(16 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(16 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 5) +"01")
	this.dsList.setdatabyname(16 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(16 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,17);
	this.dsList.setdatabyname(17 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(17 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(17 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(17 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(17 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(17 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 6) +"01")
	this.dsList.setdatabyname(17 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(17 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,18);
	this.dsList.setdatabyname(18 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(18 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(18 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(18 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(18 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(18 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 7) +"01")
	this.dsList.setdatabyname(18 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(18 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능
		
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,19);
	this.dsList.setdatabyname(19 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(19 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(19 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(19 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(19 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(19 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 8) +"01")
	this.dsList.setdatabyname(19 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(19 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,20);
	this.dsList.setdatabyname(20 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(20 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(20 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(20 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(20 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(20 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 9) +"01")
	this.dsList.setdatabyname(20 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(20 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,21);
	this.dsList.setdatabyname(21 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(21 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(21 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(21 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(21 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(21 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 10) +"01")
	this.dsList.setdatabyname(21 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(21 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,22);
	this.dsList.setdatabyname(22 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(22 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(22 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(22 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(22 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(22 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 11) +"01")
	this.dsList.setdatabyname(22 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(22 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,23);
	this.dsList.setdatabyname(23 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(23 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(23 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(23 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(23 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(23 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 12) +"01")
	this.dsList.setdatabyname(23 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(23 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,24);
	this.dsList.setdatabyname(24 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(24 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(24 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(24 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(24 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(24 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 13) +"01")
	this.dsList.setdatabyname(24 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(24 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,25);
	this.dsList.setdatabyname(25 , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(25 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(25 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
	this.dsList.setdatabyname(25 , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
	this.dsList.setdatabyname(25 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
	this.dsList.setdatabyname(25 , "PLAN_YYYYMM" , (Number(this.dsSearch.getdatabyname(sRow,"BASE_YEAR"))+ 14) +"01")
	this.dsList.setdatabyname(25 , "CURRENCY_CODE" , this.dsSearch.getdatabyname(sRow,"CURRENCY_CODE"));	
	this.dsList.setdatabyname(25 , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능	
	

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
	//필수 항목 검사
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
    for(var i=0;i<this.dsList.getrowcount();i++){
	    var projectCode = this.dsList.getdatabyname(i,"PROJECT_CODE");
	    if( UT.isNull( projectCode)){
		    var sRow = this.dsSearch.getpos();
			this.dsList.setdatabyname(i , "OU_CODE" , ouCode);	
			this.dsList.setdatabyname(i , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
			this.dsList.setdatabyname(i , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
			this.dsList.setdatabyname(i , "PLAN_VERSION" , this.dsSearch.getdatabyname(sRow,"PLAN_VERSION"));
			//this.dsList.setdatabyname(i , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));	
			this.dsList.setdatabyname(i , "LATEST_YN" , this.dsSearch.getdatabyname(sRow,"LATEST_YN"));  //최신버전만 입력 가능
		}	
	}
	//첫 생성 시 plan header setup
    var projectCode = this.dsPlanHeader.getdatabyname(0,"PROJECT_CODE");
    if( UT.isNull( projectCode)){
	    var sRow = this.dsSearch.getpos();
		this.dsPlanHeader.setdatabyname(0 , "OU_CODE" , ouCode);	
		this.dsPlanHeader.setdatabyname(0 , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
		this.dsPlanHeader.setdatabyname(0 , "PROJECT_PRODUCT_ID" , this.dsSearch.getdatabyname(sRow,"PROJECT_PRODUCT_ID"));
		this.dsPlanHeader.setdatabyname(0 , "BASE_YEAR" , this.dsSearch.getdatabyname(sRow,"BASE_YEAR"));
		this.dsPlanHeader.setdatabyname(0, "PLAN_VERSION", this.dsSearch.getdatabyname(sRow, "PLAN_VERSION"));
		this.dsPlanHeader.setdatabyname(0, "LATEST_YN", this.dsSearch.getdatabyname(sRow, "LATEST_YN"));       	
	}	
 		
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPlanHeader , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.INSERT_PLAN" , "OmsProjectMapper.UPDATE_PLAN" , "OmsProjectMapper.DELETE_PLAN", "dsList" );	// 추가 수정 삭제	
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.INSERT_PLAN_HEADER" , "OmsProjectMapper.UPDATE_PLAN_HEADER" , "OmsProjectMapper.DELETE_PLAN_HEADER", "dsPlanHeader" );	// 추가 수정 삭제	
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
		this.dsSearch.setdatabyname(iRow , "ITEM_NAME" , aryHash["ITEM_NAME"]);
		this.dsSearch.setdatabyname(iRow , "ERP_ITEM_NO" , aryHash["ERP_ITEM_NO"]);
		this.dsSearch.setdatabyname(iRow , "PROJECT_PRODUCT_ID" , aryHash["PROJECT_PRODUCT_ID"]);
		this.dsSearch.setdatabyname(iRow , "LATEST_YN" , aryHash["LATEST_YN"]);
		this.dsSearch.setdatabyname(iRow , "CURRENCY_CODE" , aryHash["CURRENCY_CODE"]);
		this.dsSearch.setdatabyname(iRow , "DETAIL_STATUS_CODE" , aryHash["DETAIL_STATUS_CODE"]);
		this.dsSearch.setdatabyname(iRow , "AUTH" , aryHash["AUTH"]);
		this.dsSearch.setdatabyname(iRow , "DOMESTIC_EXPORT_CODE" , aryHash["DOMESTIC_EXPORT_CODE"]);
		this.dsSearch.setdatabyname(iRow , "ROLLING_YN" , aryHash["ROLLING_YN"]);
		//내수이면 *Incoterms을 Domestic으로 
		var domesticExport = this.dsSearch.getdatabyname(iRow , "DOMESTIC_EXPORT_CODE" );
		//UT.alert(this.screen,"",domesticExport );
		if( domesticExport  == "DOM"){
			this.cboIncoterms.setselectedcodeex("DOM",true,true); 
		}
	}
	if(aryHash["LATEST_YN"] =="Y" && aryHash["DETAIL_STATUS_CODE"] !="D09"&& aryHash["DETAIL_STATUS_CODE"]!="D04"&& aryHash["AUTH"]=="W"){ //D09:close D04:drop  R:read 권한
        this.btnUpload.setenable(true);
        this.btnVersion.setenable(true);
        this.btnAddRow.setenable(true);
	     this.btnAddRowAll.setenable(true);
        this.btnDelRow.setenable(true);
        this.btnCommonSave.setenable(true);	
        this.btnCopy.setenable(true);  
	    this.btnBizCopy.setenable(true);   	
	}else{
        this.btnUpload.setenable(false);
        this.btnVersion.setenable(false);
        this.btnAddRow.setenable(false);
	    this.btnAddRowAll.setenable(false);
        this.btnDelRow.setenable(false);
        this.btnCommonSave.setenable(false);	
        this.btnCopy.setenable(false); 
	    this.btnBizCopy.setenable(false);
	}	
	this.dsList.removeallrows();
	this.dsPlanHeader.removeallrows();
	this.dsSearch.setdatabyname(this.dsSearch.getpos() , "PLAN_VERSION" , "");
	this.fnSearchVersion();
}


/*
* 버젼 정보 데이터 가져오기.
* DB조회
*/
function fnSearchVersion( alertshow ){		
    //callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	var projectProductId = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"PROJECT_PRODUCT_ID") ;
	var pamrams = "";
	params = "OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	params = params + " PROJECT_PRODUCT_ID=" + projectProductId;
	params = params + " BASE_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"BASE_YEAR");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsVersion , "NONE" , "CLEAR" ,  "" , "" , "TR_VERSION");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_VERSION");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_PLAN_VERSION" ,"" , "dsVersion", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_PLAN_VERSION" , true , alertshow , false , "TR_VERSION");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
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
	UT.confirm(this.screen,"MSG591","기존의 데이터가 삭제됩니다. 계속하시겠습니까??","",0,"upload_confirm");
}

function fnUpload()
{	
	this.grdList.uploadexcelex(1, 1, 2, "A", 1,false);
}

function btnVersion_on_mouseup(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02599", "중장기계획 리비젼");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	objPopupExtraData.P_DATA2 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_PRODUCT_ID");
	objPopupExtraData.P_DATA3 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PLAN_VERSION");
	objPopupExtraData.P_DATA4 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"BASE_YEAR");
	objPopupExtraData.P_DATA5 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA6 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ITEM_NAME");
	objPopupExtraData.P_DATA7 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"CURRENCY_CODE");
	objPopupExtraData.P_DATA8 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"PROJECT_CODE");
	objPopupExtraData.P_DATA9 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ERP_ITEM_NO");
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupVersionCallback";
	screen.loadportletpopup(strPopupName, "/OMS/Oms1041", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	
}
/*
* Version Callback
*/
function fnPopupVersionCallback(aryHash) 
{ 
	this.fnSearchVersion();
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "PLAN_VERSION" , aryHash["PLAN_VERSION"]);
		this.dsSearch.setdatabyname(iRow , "LATEST_YN" , "Y");
		this.btnUpload.setenable(true);
        this.btnVersion.setenable(true);
        this.btnAddRow.setenable(true);
	    this.btnAddRowAll.setenable(true);
        this.btnDelRow.setenable(true);
	}
	this.fnSearch();
}

function cboVersion_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	//var iRow = UT.gfnFindRow(this.dsVersion,"CODE",ncur_item);
	var lastestYn = this.dsVersion.getdatabyname(ncur_item,"LATEST_YN");
	var updDate = this.dsVersion.getdatabyname(ncur_item,"UPD_DATE");
	var updateUserName = this.dsVersion.getdatabyname(ncur_item,"UPDATE_USER_NAME");
	var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
	var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");
	this.dsSearch.setdatabyname(this.dsSearch.getpos(),"LATEST_YN",lastestYn);
	this.dsSearch.setdatabyname(this.dsSearch.getpos(),"UPD_DATE",updDate);
	this.dsSearch.setdatabyname(this.dsSearch.getpos(),"UPDATE_USER_NAME",updateUserName);
	if(lastestYn == "Y" && detailStausCode != "D09" && detailStausCode != "D04" && auth == "W"){
        this.btnUpload.setenable(true);
        this.btnVersion.setenable(true);
        this.btnAddRow.setenable(true);
	    this.btnAddRowAll.setenable(true);
        this.btnDelRow.setenable(true);
        this.btnCommonSave.setenable(true); 
        this.btnCopy.setenable(true);  
	    this.btnBizCopy.setenable(true);	
	}else{		
		
        this.btnUpload.setenable(false);
        this.btnVersion.setenable(false);
        this.btnAddRow.setenable(false);
	    this.btnAddRowAll.setenable(false);
        this.btnDelRow.setenable(false);	
        this.btnCommonSave.setenable(false);
        this.btnCopy.setenable(false);	
	    this.btnBizCopy.setenable(false);		
	}	
//	UT.alert(this.screen,"", copyYN +event_type);
   this.fnSearch();
	
	
}

function fldDateS_on_changed(objInst, prev_text, curr_text, event_type)
{
    if( !UT.isNull(prev_text) && event_type !="2" ){ //2 : API 호출에 의한 데이터 변경 이벤트 발생 =>초긱값 설정 때는 지우지 말것..
	   this.dsList.removeallrows();
	   this.dsPlanHeader.removeallrows();
	   this.dsSearch.setdatabyname(this.dsSearch.getpos() , "PLAN_VERSION" , "");
	   this.fnSearchVersion();
	}	

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

function btnBizCopy_on_mouseup(objInst)
{
		//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	
	UT.confirm(this.screen,"MSG592","저장 후 실행됩니다. 계속하시겠습니까?","",0,"BizCopy_confirm");	

}
function fnBizCopyPopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		//this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , aryHash["NEW_PROJECT_CODE"]);
		//this.dsSearch.setdatabyname(iRow , "PROJECT_VERSION" ,aryHash["NEW_PROJECT_VERSION"]);
	}	
   this.fnSearch();
	
}