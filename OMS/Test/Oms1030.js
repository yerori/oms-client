/*------------------------------------
* program id : Oms1030
* desc	   : 수주활동관리
* dev date   : 2023-06-07
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
		this.dsSearch.setdatabyname(iRow, "CAR_TYPE_NAME", objExtraData.P_DATA5);
		this.dsSearch.setdatabyname(iRow, "DETAIL_STATUS_CODE", objExtraData.P_DATA6);
		this.dsSearch.setdatabyname(iRow, "ACT_STATUS_CODE", objExtraData.P_DATA7);
		this.dsSearch.setdatabyname(iRow, "AUTH", objExtraData.P_DATA8);
	} 	
    ouCode = INI.GV_OU_CODE;

    var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
    var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");
    //CLOSE인 경우 저장 불가
    if ( detailStausCode == "D09"  || auth!="W" ){//D09:close D04:drop  W:수정권한
       this.btnCommonSave.setenable(false);
       this.btnAddRow.setenable(false);
    }

}
/*
* 데이터셋 
*/
function fnDsSet(){

	UT.gfnGetOuCodes(this.dsOU);	// ou code set
	UT.gfnGetCommCodes(this.dsCurrency, "F018");		  // 통화코드 (F018)
    UT.gfnGetCommCodes(this.dsActStatus, "O015");	     // 활동단계
    UT.gfnGetCommCodes(this.dsDetailStatus, "O016");	  // 상세상태
    UT.gfnGetCommCodes(this.dsAction, "O020");	        // Action
    UT.gfnGetCommCodes(this.dsDetailStatus_BD, "O023");	        // 상세상태
    UT.gfnGetCommCodes(this.dsDetailStatus_BG, "O025");	        // 상세상태
    UT.gfnGetCommCodes(this.dsDetailStatus_BK, "O026");	        // 상세상태
    UT.gfnGetCommCodes(this.dsDetailStatus_PT, "O024");	        // 상세상태
    UT.gfnGetCommCodes(this.dsDetailStatus_OP, "O030");	        // 상세상태 2024-02-19 Added by Youngho.Kang

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
    UT.gfnHrEditorStyle(this.edtCarType, "D");
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
			
		if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(this.screen , "MSG001" , "검색 결과가 없습니다.");		  
            //this.fnGetActStatusCode();
            var actStatusCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ACT_STATUS_CODE");
	        var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
	        var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");
	         //CLOSE인 경우 저장 불가
	         if ( detailStausCode == "D09" || auth!="W" ){//D09:close D04:drop  W:수정권한
		        this.btnCommonSave.setenable(false);
		        this.btnAddRow.setenable(false);
            }else{
	            this.btnCommonSave.setenable(true);
		        this.btnAddRow.setenable(true);
	        }		
			return;
		} else {
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리						
 


             // 마지막 행의 상태값을 가져온다.
	         this.dsList.movelast();	
	         var actStatusCode = this.dsList.getdatabyname(this.dsList.getpos(),"ACT_STATUS_CODE");
	         var detailStausCode = this.dsList.getdatabyname(this.dsList.getpos(),"DETAIL_STATUS_CODE");
	         var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");
	         this.dsSearch.setdatabyname(this.dsSearch.getpos() , "ACT_STATUS_CODE" , actStatusCode);
	         this.dsSearch.setdatabyname(this.dsSearch.getpos() , "DETAIL_STATUS_CODE" , detailStausCode);
	         //CLOSE인 경우 저장 불가
	         //if ( detailStausCode == "D09" || auth!="W" ){//D09:close D04:drop  W:수정권한
	         if ( detailStausCode == "D09" || detailStausCode == "D10" || auth!="W" ){//D09:close D10:delete  W:수정권한
		        this.btnCommonSave.setenable(false);
		        this.btnAddRow.setenable(false);
		        var count = this.grdList.getrowcount();
		        var aryColumn2 = ["ACT_STATUS_CODE","ACT_DATE","DETAIL_STATUS_CODE","ACTION_CODE"];
			    for( var iRow = 0; iRow < count ; iRow++){	    
					GRD.gfnHrGrdCellHandle(this.grdList, iRow, aryColumn2, "D");	
					this.grdList.setitemimage(iRow,5, "");				
		 	   }
             }else{
	            this.btnCommonSave.setenable(true);
		        this.btnAddRow.setenable(true);
		        var count = this.grdList.getrowcount();
		        var aryColumn2 = ["ACT_STATUS_CODE","ACT_DATE","DETAIL_STATUS_CODE"];
			    for( var iRow = 0; iRow < count ; iRow++){	    
					GRD.gfnHrGrdCellHandle(this.grdList, iRow, aryColumn2, "D");					
		 	   }
	         }
             //this.fnGetActStatusCode();			
		}
	
	}
	
	if(recv_userheader == "insertAndselect")
	{
		//UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.alert(this.screen , "" , "저장되었습니다.\n견적원가를 관리해 주시기 바랍니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		this.fnSearch();
	}

	
	if(recv_userheader == "selectActCode")
	{
       //sort 번호를 가져온다.
       var actStatusCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ACT_STATUS_CODE");
       var count = this.dsActStatus.getrowcount();
	   for( var iRow = 0; iRow < count ; iRow++){
		  var code = this.dsActStatus.getdatabyname(iRow,"CODE");
		 // UT.alert(this.screen,"",actStatusCode +":"+code);
		  if(actStatusCode == code ){
			var sort = this.dsActStatus.getdatabyname(iRow,"SORT");
		//	UT.alert(this.screen,"",sort);
			this.dsSearch.setdatabyname(this.dsSearch.getpos() , "ACT_STATUS_CODE_SORT" , sort);
		  }	    			
	   }
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
	
	this.grdList.moverow(rowCount);

	var num = UT.gfnDSGetMax( this.dsList,"NO", true );
	//UT.alert(this.screen , "" , approveSeq + "approveSeq");  
	
    num = Number(num) +1;
	if( num == 0){
		num=1;
	}
	//var row = this.dsList.getpos()+1;	
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,rowCount);	
	this.dsList.setdatabyname(iRow , "OU_CODE" , ouCode);	
	this.dsList.setdatabyname(iRow , "PROJECT_CODE" , this.dsSearch.getdatabyname(sRow,"PROJECT_CODE"));
	this.dsList.setdatabyname(iRow, "NO", num );
	
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
	//DROP인 경우 DROP CANCEL만 저장 가능 
	if( sDetailStatusCode == "D04" ){ //D04:DROP
       // 마지막 행의 상태값을 가져온다.
       //DROP CANCEL 만 저장할 수 있다. 
       this.dsList.movelast();	
       var detailStausCode = this.dsList.getdatabyname(this.dsList.getpos(),"DETAIL_STATUS_CODE");
       if( detailStausCode != "D05" ){	//D05:DROP CANCEL
       	UT.alert(this.screen,"MSG565","상세 상태가 DROP인 경우 DROP CANCEL만 저장할 수 있습니다.");
           return;
       }
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
	var aryDual = [ "ACT_STATUS_CODE", "ACT_DATE", "DETAIL_STATUS_CODE", "CHARGE_NAME", "REMARK"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return false;
	}
    // 마지막 행의 상태값을 가져온다.
    // drop이나 close 시 자녀 프로젝트중에 drop이나 close된지 않된 것이 있는지 확인한다.
    this.dsList.movelast();	
    var detailStausCode = this.dsList.getdatabyname(this.dsList.getpos(),"DETAIL_STATUS_CODE");
    if(detailStausCode =="D09" || detailStausCode =="D04"){
		var projectCode = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"PROJECT_CODE") ;
		var vParam = "";	    
	    vParam = "PROJECT_CODE="  + projectCode.replaceAll(' ','^');
	    vParam = vParam + " OU_CODE=" + ouCode ;
	    vParam = vParam + " RETCODE="  + "" ;
	    vParam = vParam + " RETMESG=" + ""; 
	    
	    TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, "", "", "", "", "TR_VALIDATION");
	    TRN.gfnCommonTransactionClear(this.screen,"TR_VALIDATION");
	    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsProjectMapper.CLOSE_VALIDATION_PROC" ,"","dsProcResult",vParam);
		// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
	    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false,"TR_VALIDATION");
	
		if(this.dsProcResult.getdatabyname(this.dsProcResult.getpos() ,"RETCODE") != "S"){
		    UT.alert(this.screen , "MSG584" , this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG")+"을 먼저 Drop/Close 해야됩니다.", this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG")); 
		    return false;
		}


   }
	return true;
}

function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsOrderActivityMapper.SELECT_ORDER_ACTIVITY" ,"dsSearch" , "dsList");	//조회만	
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
		}	
	}		
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsOrderActivityMapper.INSERT_ORDER_ACTIVITY" , "OmsOrderActivityMapper.UPDATE_ORDER_ACTIVITY" , "OmsOrderActivityMapper.DELETE_ORDER_ACTIVITY", "dsList" );	// 추가 수정 삭제	
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
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsSearch.setdatabyname(iRow , "CAR_TYPE_NAME" , aryHash["CAR_TYPE_NAME"]);
		this.dsSearch.setdatabyname(iRow , "DETAIL_STATUS_CODE" , aryHash["DETAIL_STATUS_CODE"]);
		this.dsSearch.setdatabyname(iRow , "ACT_STATUS_CODE" , aryHash["ACT_STATUS_CODE"]);
		this.dsSearch.setdatabyname(iRow , "AUTH" , aryHash["AUTH"]);
	}
	
    this.dsList.removeallrows();
    this.fnSearch();
}

function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
    var detailStausCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"DETAIL_STATUS_CODE");
    var auth = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"AUTH");
           
    // 내용
    if(this.grdList.getcolumnname(nColumn) == "REMARK_POPUP"){
		var strPopupName = UT.gfnGetMetaData("LABEL00782", "내용"); 
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = this.dsList.getdatabyname(this.dsList.getpos(),"REMARK");
		objPopupExtraData.P_DATA2 = strPopupName;
		if ( detailStausCode == "D09"  || auth!="W" ){//D09:close D04:drop  W:수정권한
			objPopupExtraData.P_DATA3 = "R";
		}else{
		    objPopupExtraData.P_DATA3 = "W";
	    }	
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupRemarkPopCallback";
		screen.loadportletpopup("ChkOpinionSelect", "/FRAME/popupEditRemark", strPopupName, false, 0, 0, 0, 500, 410, true, true, false, objPopupExtraData);

	}
	
	//담당자 Poupup
    if(this.grdList.getcolumnname(nColumn) == "CHARGE_NAME_POPUP"){
	   // UT.alert(this.screen , "" ,detailStausCode+ ":"+auth);	//경고창 처리
	    if ( detailStausCode == "D09" || auth!="W" ){//D09:close D04:drop  W:수정권한
			return;
		}
		var strPopupName = UT.gfnGetMetaData("LABEL00209", "담당자");
		objPopupExtraData.clear();
		objPopupExtraData.P_DATA1 = ouCode;
		//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
		objPopupExtraData.P_DATA3 = "";
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupChargePopCallback";
		screen.loadportletpopup(strPopupName, "/FRAME/popupCharge", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
			

	}	
	// 첨부 Poupup
    if(this.grdList.getcolumnname(nColumn) == "ATT_YN_POPUP"){
       var orderActivityId = this.dsList.getdatabyname(this.dsList.getpos(),"ORDER_ACTIVITY_ID");
       if(UT.isNull( orderActivityId)){
	        UT.alert(this.screen , "MSG561" , "저장 후 첨부가 가능합니다. 먼저 저장하세요." );
			return;
	    }
		// 저장한다
//	    this.fnSaveData(false);

		var strPopupName = UT.gfnGetMetaData("LABEL02589", "첨부");
		objPopupAttData.clear();
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = orderActivityId;
		if ( detailStausCode == "D09"  || auth!="W" ){//D09:close D04:drop  W:수정권한
			objPopupAttData.P_MODE = "R";
		}else{
		    objPopupAttData.P_MODE = "W";
	    }		
		
		objPopupAttData.P_FILE_GUBUN = "Oms1030";
		objPopupAttData.P_REF_NAME = "";
		objPopupAttData.P_DIR_TYPE = "ACT";
		objPopupAttData.P_OU_CODE = this.dsList.getdatabyname(this.dsList.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
		screen.loadportletpopup("AttFileQcmStd001", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
	}	
}


/*
* 내용 Callback
*/
function fnPopupRemarkPopCallback(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "REMARK" , aryHash["REMARK"]);
	}
}

/*
* 담당자 Callback
*/
function fnPopupChargePopCallback(aryHash) 
{ 
	var iRow = this.dsList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsList.setdatabyname(iRow , "CHARGE_USER_ID" , aryHash["USER_ID"]);
		this.dsList.setdatabyname(iRow , "CHARGE_NAME" ,aryHash["USER_NAME"]);
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


/*
* 활동단계, 상세상태 데이터 가져오기.
* DB조회
*/
/*
function fnGetActStatusCode(){			
	TRN.gfnTranDataSetHandle(this.screen , this.dsActStatus , "NONE" , "CLEAR" ,  "" , "" , "TR_ACT_CODE");
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetailStatus_BD , "NONE" , "CLEAR" ,  "" , "" , "TR_ACT_CODE");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetailStatus_BG , "NONE" , "CLEAR" ,  "" , "" , "TR_ACT_CODE");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetailStatus_BK , "NONE" , "CLEAR" ,  "" , "" , "TR_ACT_CODE");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetailStatus_PT , "NONE" , "CLEAR" ,  "" , "" , "TR_ACT_CODE");		
	TRN.gfnCommonTransactionClear(this.screen, "TR_ACT_CODE");	//트랜젝션 데이터셋 초기화 (필수)
    var parmBD = "PARENT_ITEM_CODE=" +"BD";
    var parmBK = "PARENT_ITEM_CODE=" +"BK";
    var parmBG = "PARENT_ITEM_CODE=" +"BG";
    var parmPT = "PARENT_ITEM_CODE=" +"PT";
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsOrderActivityMapper.SELECT_ACT_STATUS_CODE" ,"" , "dsActStatus");	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsOrderActivityMapper.SELECT_DETAIL_STATUS_CODE" ,"" , "dsDetailStatus_BD",parmBD);	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsOrderActivityMapper.SELECT_DETAIL_STATUS_CODE" ,"" , "dsDetailStatus_BG",parmBG);	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsOrderActivityMapper.SELECT_DETAIL_STATUS_CODE" ,"" , "dsDetailStatus_BK",parmBK);	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsOrderActivityMapper.SELECT_DETAIL_STATUS_CODE" ,"" , "dsDetailStatus_PT",parmPT);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectActCode" , true , true , false , "TR_ACT_CODE");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
*/
function grdList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	
}

function grdList_on_itemvaluechanged(objInst, nRow, nColumn, strPrevItemText, strItemText)
{
	if(nColumn == 1) //1: Act Code ( 활동단계 )
	{
       //전단계의 활동단계를 선택시 경고를 한다. 
       var actStatusCodeSort = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"ACT_STATUS_CODE_SORT");
       //sort 번호를 가져온다.
       var sort;
       var count = this.dsActStatus.getrowcount();
	   for( var iRow = 0; iRow < count ; iRow++){
		  var code = this.dsActStatus.getdatabyname(iRow,"CODE");
		  if(strItemText == code ){
			 sort = this.dsActStatus.getdatabyname(iRow,"SORT");
		  }	    			
	   }		
	   if(actStatusCodeSort > sort ){			
	 	UT.alert(this.screen,"MSG563","선택하신 활동단계가 현재보다 이전단계입니다.");			
	   }
	   
	   this.dsList.setdatabyname(this.dsList.getpos() , "DETAIL_STATUS_CODE" , "");
	   //상세단계 설정 
       if(  strItemText == "S01" ){ //Bidding
       	this.grdList.setitempicklistxdataset(nRow, 3, "dsDetailStatus_BD", "CODE", "NAME", "HIDDEN");   
       }else if(  strItemText == "S02" ){ //Potential
       	this.grdList.setitempicklistxdataset(nRow, 3, "dsDetailStatus_PT", "CODE", "NAME", "HIDDEN"); 
       }else if(  strItemText == "S03" ){ //Budget
       	this.grdList.setitempicklistxdataset(nRow, 3, "dsDetailStatus_BG", "CODE", "NAME", "HIDDEN"); 
       }else if(  strItemText == "S04" ){ //Booked
       	this.grdList.setitempicklistxdataset(nRow, 3, "dsDetailStatus_BK", "CODE", "NAME", "HIDDEN"); 
	   //## 2024-02-19 Added by Youngho.Kang
       }else if(  strItemText == "S05" ){ //Open
       	this.grdList.setitempicklistxdataset(nRow, 3, "dsDetailStatus_OP", "CODE", "NAME", "HIDDEN"); 
	   //## 2024-02-19 Added end
       }
		    			
	}	
}