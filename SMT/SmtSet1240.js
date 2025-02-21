/*------------------------------------
* program id : SmtSet1240
* desc	   : 수신그룹등록
* dev date   : 2023-01-09
* made by    : SEYUN
*-------------------------------------*/


var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";
var editMode;//POPUP에 의해 수정되는지 확인 
var ouCode;
var authScope;
 

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
}
	
/*
* 페이지 온로드
*/
function screen_on_load()
{	 	
       //초기화
    ouCode = INI.GV_OU_CODE;

    INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅	 
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
    this.fnGetReceiveGroup();
	//this.btnCommonSearch_on_mouseup();
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);	
	
	
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsDept, "F040");		   // 담당자부서
	//UT.gfnTranceCodeSet(this.dsDept, "N");  //빈줄추가
	
	 
	 

	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE); 	
    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    } 
    this.dsSearch.setdatabyname(this.dsSearch.getpos() , "OFFICIAL_TYPE" ,"S");  
	this.dsSearch.setdatabyname(this.dsSearch.getpos() , "PROGRAM_ID" ,"SmtSet1240");
	 
}

//수신그룹 가져오기 
function fnGetReceiveGroup(){
	 
    var params = "OU_CODE="+ouCode;
    TRN.gfnTranDataSetHandle(this.screen , this.dsReceiveGroup , "NONE" , "CLEAR" , "" , "" , "TR_RECEIVE_GROUP");
	TRN.gfnCommonTransactionClear(this.screen , "TR_RECEIVE_GROUP");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_RECEIVE_GROUP" , "" , "dsReceiveGroup" , params);
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_RECEIVE_GROUP" , true , false , false , "TR_RECEIVE_GROUP");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
	 	
	this.comReceiveGroup.setselectedindex(0);
	 
}


/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	  

    //내부 사용자인지 확인
    //내부 사용자이면 협력업체 변경 가능
    //협력업체이면 고정
    var userType;
    if( INI.GV_USER_TYPE == "U"){   //유저사용자유형 (내부사용자:U, 외부사용자:V)
	   userType = "INNER"; //INNER: 내부사용자 
    } else{
	   userType = "OUTER"; //INNER: 내부사용자 
    }
    
    if( userType == "INNER"){
	    this.edtVendorName.setenable( true );
	    this.btnVendorPop.setenable( true);
		//this.grdMaster.setcolumnhidden(2,false,true); 
    } 
    if( userType == "OUTER"){	    
	    this.edtVendorName.setenable( false );
	    this.btnVendorPop.setenable(false);
		//this.grdMaster.setcolumnhidden(2,true,true);
		this.dsSearch.setdatabyname(this.dsSearch.getpos() , "VENDOR_NAME" , INI.GV_VENDOR_NAME);
		this.dsSearch.setdatabyname(this.dsSearch.getpos() , "VENDOR_CODE" , INI.GV_VENDOR_CODE);
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

}

/*
* OU 변경시
*/
function cboOuCode_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	ouCode = this.cboOuCode.getselectedcode();
    this.dsVendorList.removeallrows();
    this.dsList.removeallrows();

    this.fnGetReceiveGroup();
 
	//UT.gfnGetSiteCodes(this.dsSITE, ouCode);	//사업장  
	//UT.gfnTranceCodeSet(this.dsSITE, "N");  //빈줄추가
	 
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
	
	if(recv_userheader == "selectMasterInfo") 
	{		
		if(this.dsVendorList.getrowcount() == 0){
			//UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(screen , "MSG001" , "검색 결과가 없습니다.");
			//clear
	        this.dsList.removeallrows();
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsVendorList.getrowcount());	//하단메세지 처리
			//입력 제한 처리 ( KEY 값)  
			/* 수정모드 변경 */
			var aryColumn = ["CHECK_FLAG" ];
			for(var i=0;i<this.dsVendorList.getrowcount();i++){
			    var v_vendor_chg_info_id =  this.dsVendorList.getdatabyname(i,"VENDOR_CHG_INFO_ID"); 
			    if(UT.isNull(v_vendor_chg_info_id)){
					GRD.gfnHrGrdCellHandle(this.grdVendorList, i, aryColumn, "D");
				}	
		    } 
			this.fnSearch_detail();			
		}
			
	}
		
	if(recv_userheader == "insertAndselect")  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		
		this.btnCommonSearch_on_mouseup();	//조회
	}
	 
}
 
 
/*
* 공문 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	
	var ouCode = this.cboOuCode.getselectedcode(); 	
	if (!ouCode) {
		UT.alert(this.screen, "", "법인을 입력하세요"); 
		return; 
	}
	
	var v_receive_group  = this.dsSearch.getdatabyname(0,"RECEIVE_GROUP"); 
	if (!v_receive_group) {
		UT.alert(this.screen, "", "수신그룹을 입력하세요"); 
		return; 
	}
     
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_MASTER_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsVendorList , "NONE" , "CLEAR" ,  "" , "" , "TR_MASTER_INFO");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_MASTER_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_SMT_OFFICIAL_SUPPLIER" ,"dsSearch" , "dsVendorList");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectMasterInfo" , true , true , false , "TR_MASTER_INFO");	
	
}

function fnSearch_detail(){
	    
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_DETAIL_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList, "NONE" , "CLEAR" ,  "" , "" , "TR_DETAIL_INFO");
	TRN.gfnCommonTransactionClear(this.screen , "TR_DETAIL_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_SMT_OFFICIAL_SUPPLIER_DTL" , "dsSearch" , "dsList");
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL_INFO" , true , false , false , "TR_DETAIL_INFO");	 
}
/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	var aryDual = ["RECEVIE_GROUP"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return false;
	}
	
	//그리드에서 중복확인
	var arr = ["RECEVIE_GROUP","VENDOR_CODE","CHG_NAME","CHG_JIKGUB"];
	var dupResult = GRD.gfnGrdDuplicateCheck(this.screen, this.grdList, arr);
	if (dupResult) {
		UT.alert(this.screen, "MSG358", "중복된 데이타가 존재합니다"); 
		return false;
	}
    
	
	return true;
}

function fnSaveData(alertshow)
{
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtMapper.INSERT_SMT_OFFICIAL_SUPPLIER" , "ProcSmtMapper.UPDATE_OFFICIAL_SUPPLIER" , "ProcSmtMapper.DELETE_SMT_OFFICIAL_SUPPLIER", "dsList" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_COM_CO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
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
    if( !this.fnValidForm() ){
		return;
    }
	
	UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
}


function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData(true);
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
 
  

function cboOuCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtLoginNo_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtEmpNo_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}


/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

/* 화면 크기 변경 */
function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}



function btnVendorPop_on_click(objInst)
{
	this.fnVendorPopupCall("","");
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
	}
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

function edtVendorName_on_changed(objInst, prev_text, curr_text, event_type)
{
	if( event_type == 5){ //5:포커스아웃(블러) 이벤트에 의한 데이터 변경 이벤트 발생
		if (!curr_text) {
			this.edtVendorName.settext("");
			this.edtVendorCode.settext("");
		} else {
			this.fnVendorPopupCall("", this.edtVendorName.gettext());
		}
	}
}

function btnLine_RIGHT_on_mouseup(objInst)
{
	var dsObj = this.grdList.getlinkxdataset();
	var iRow = this.grdList.getselectrow();
	var v_tot_row = this.dsList.getrowcount(); 
    var v_ou_code = this.dsSearch.getdatabyname(0,"OU_CODE");
    var v_del_cnt = 0;

    var v_receive_group  = this.dsSearch.getdatabyname(0,"RECEIVE_GROUP");
	
	 
    // 수신사 등록
	for(var i=0; i<this.dsVendorList.getrowcount(); i++){
	    var v_check_flag = this.dsVendorList.getdatabyname(i,"CHECK_FLAG"); 
		
		if (v_check_flag =="Y" ){ 
			GRD.gfnInsertRow(this.screen,this.grdList,false,v_tot_row);
			
			this.grdList.setitemeditstart(v_tot_row, 0, true);  
			this.dsList.setdatabyname(v_tot_row, "OU_CODE"  , v_ou_code ); 
			this.dsList.setdatabyname(v_tot_row, "VENDOR_CODE" , this.dsVendorList.getdatabyname(i,"VENDOR_CODE") ); 
			this.dsList.setdatabyname(v_tot_row, "VENDOR_NAME" , this.dsVendorList.getdatabyname(i,"VENDOR_NAME") ); 
			this.dsList.setdatabyname(v_tot_row, "CHG_NAME" , this.dsVendorList.getdatabyname(i,"CHG_NAME") ); 
			this.dsList.setdatabyname(v_tot_row, "CHG_JIKGUB" , this.dsVendorList.getdatabyname(i,"CHG_JIKGUB") ); 
			this.dsList.setdatabyname(v_tot_row, "CHG_EMAIL_ADDR" , this.dsVendorList.getdatabyname(i,"CHG_EMAIL_ADDR"));
			this.dsList.setdatabyname(v_tot_row, "VENDOR_CHG_INFO_ID" , this.dsVendorList.getdatabyname(i,"VENDOR_CHG_INFO_ID") );  
			this.dsList.setdatabyname(v_tot_row, "RECEVIE_GROUP" , v_receive_group );   

            v_tot_row = v_tot_row + 1;  
		}
	}
		
		var delet_row = 0;
	
		// 거래처 삭제	
		for( var j= this.dsVendorList.getrowcount()-1; j>-1; j--){ 
		    var v_check_flag = this.dsVendorList.getdatabyname(j,"CHECK_FLAG");  
	    	if (v_check_flag =="Y" ){  
	            GRD.gfnDeleteRow(this.screen,this.grdVendorList,false , j);  
			} 
		} 
		
}

function btnLine_LEFT_on_mouseup(objInst)
{
	var v_tot_row = this.dsVendorList.getrowcount(); 
    var v_ou_code = this.dsSearch.getdatabyname(0,"OU_CODE");
    var v_del_cnt = 0;
	
    // 수신사 등록
	for(var i=0; i<this.dsList.getrowcount(); i++){
	    var v_check_flag = this.dsList.getdatabyname(i,"CHECK_FLAG"); 
		
		if (v_check_flag =="Y" ){  
			
			GRD.gfnInsertRow(this.screen,this.grdVendorList,false,v_tot_row);
			
			this.grdVendorList.setitemeditstart(v_tot_row, 0, true);  
			this.dsVendorList.setdatabyname(v_tot_row, "OU_CODE"  , v_ou_code ); 
			this.dsVendorList.setdatabyname(v_tot_row, "VENDOR_CODE" , this.dsList.getdatabyname(i,"VENDOR_CODE") ); 
			this.dsVendorList.setdatabyname(v_tot_row, "VENDOR_NAME" , this.dsList.getdatabyname(i,"VENDOR_NAME") ); 
			this.dsVendorList.setdatabyname(v_tot_row, "CHG_NAME" , this.dsList.getdatabyname(i,"CHG_NAME") );
			this.dsVendorList.setdatabyname(v_tot_row, "CHG_JIKGUB" , this.dsList.getdatabyname(i,"CHG_JIKGUB") ); 
			this.dsVendorList.setdatabyname(v_tot_row, "CHG_EMAIL_ADDR" , this.dsList.getdatabyname(i,"CHG_EMAIL_ADDR") );   
			this.dsVendorList.setdatabyname(v_tot_row, "VENDOR_CHG_INFO_ID" , this.dsList.getdatabyname(i,"VENDOR_CHG_INFO_ID") );  
            v_tot_row = v_tot_row + 1;  
		}
		
	} 
	
	var delet_row = 0;
	
	// 거래처 삭제
	for( var j= this.dsList.getrowcount()-1; j>-1; j--){ 
	    var v_check_flag = this.dsList.getdatabyname(j,"CHECK_FLAG");  
    	if (v_check_flag =="Y" ){  
            GRD.gfnDeleteRow(this.screen,this.grdList,false , j); 
		} 
	}
}

function btnCommonCreate_on_mouseup(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "수신그룹등록"); 
	objPopupExtraData.clear();	
	objPopupExtraData.P_DATA1 = vOuCode; //OU_CODE  
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnNewClosePopCallback";

	screen.loadportletpopup("SupSelect", "/SMT/SmtSet1241", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

/*
* 수신사 조회  Callback
*/
function fnNewClosePopCallback(aryHash) 
{
	 this.fnGetReceiveGroup(); 	
}


