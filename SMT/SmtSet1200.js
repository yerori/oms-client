/*------------------------------------
* program id : SmtSet1200
* desc	   : 공문접수_업체
* dev date   : 2022-10-19
* made by    : SEYUN
*-------------------------------------*/


var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";
var editMode;//POPUP에 의해 수정되는지 확인 
var ouCode;
var authScope;
var fvMode = "";
 

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
	 
    INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅	 
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
	if(INI.GV_USER_TYPE == "V" || fvMode == "V"){
		this.btnCommonSearch_on_mouseup();  //최초조회	
	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);	
	
	
	var today = new Date();
	var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
	var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    // var curdate=Number(today.getFullYear())*10000+Number(today.getMonth()+1)*100+today.getDate();
    var dateS= today.getFullYear() +"0101";
    var dateE=Number(today.getFullYear())*10000+Number(today.getMonth()+1)*100+today.getDate();
   // var dateE=Number(today.getFullYear())*10000+Number(today.getMonth()+1)*100+lastDay.getDate();
    

    this.fldDateFrom.settext(dateS);
    this.fldDateTo.settext(dateE);
     
	
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsDept, "F040");		   // 담당자부서
	UT.gfnTranceCodeSet(this.dsDept, "N");  //빈줄추가
	
	
	//초기화
    //this.cboOuCode.setselectedcode(INI.GV_OU_CODE); 
	this.cboOuCode.setselectedcodeex(INI.GV_OU_CODE,true,false);	
	
    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    } 
    this.dsSearch.setdatabyname(this.dsSearch.getpos() , "OFFICIAL_TYPE" ,"H");
    this.dsSearch.setdatabyname(this.dsSearch.getpos() , "PROGRAM_ID" ,"SmtSet1170");
 
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
    } 
    if( userType == "OUTER"){	    
	    this.edtVendorName.setenable( false );
	    this.btnVendorPop.setvisible(false);
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
	
	var objExtraData;
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
	if (objExtraData !== null) {
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"OU_CODE",objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"DOC_NUM",objExtraData.P_DATA3);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_CODE",objExtraData.P_DATA4);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_NAME",objExtraData.P_DATA5);
		fvMode = objExtraData.P_DATA6;
		this.fldDateFrom.settext("");
    	this.fldDateTo.settext("");
	} 

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
		if(this.dsMaster.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(screen , "MSG001" , "검색 결과가 없습니다.");
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsMaster.getrowcount());	//하단메세지 처리
			//읽기전용 컬럼 지정
			var aryColumn = ["CHECK_FLAG" ];
			for(var i=0; i<this.dsMaster.getrowcount(); i++){
				//항상 수정 불가
				var v_RECEIVE_FLAG = this.dsMaster.getdatabyname(i,"RECEIVE_FLAG"); 
				if (v_RECEIVE_FLAG =="Y" ){
					GRD.gfnHrGrdCellHandle(this.grdMaster, i, aryColumn, "D");
				} else {
				    GRD.gfnHrGrdCellHandle(this.grdMaster, i, aryColumn, "G"); 
				}
			}
		}  
		
	}
	
	if(recv_userheader == "insertAndselect")  //저장처리 후
	{
		UT.alert(this.screen , "MSG132" , "접수처리되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG132" , "접수처리되었습니다.");
		
		this.btnCommonSearch_on_mouseup();	//조회
	}
	 
	
	 
}
 

function fnSaveData()
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsMaster , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddUpdate(this.screen , "ProcSmtMapper.UPDATE_SMT_OFFICIA_RECEIVE_VENDOR" , "dsMaster" );	
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , true , false , "TR_SAVE_COM_CO");	
}
/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	var ouCode = this.cboOuCode.getselectedcode();
	var dateST = this.fldDateFrom.gettext(); 
	
	if (! ouCode) {
		UT.alert(this.screen, "", "법인을 입력하세요"); 
		return; 
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_MASTER_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsMaster , "NONE" , "CLEAR" ,  "" , "" , "TR_MASTER_INFO");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_MASTER_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_OFFICIAL_MSTR_RECEIVE_VENDOR" ,"dsSearch" , "dsMaster", "TR_MASTER_INFO");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectMasterInfo" , true , true , false , "TR_MASTER_INFO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
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
 
/*
* OU 변경시
*/
function cboOuCode_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	UT.gfnGetUserSiteCodes(this.dsSITE,this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE"),INI.GV_USER_ID);
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

 

function grdMaster_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	if (this.grdMaster.getcolumnname(nColumn) == "ATTFILE_POP") { // 첨부파일
   
        var V_RECEIVE_FLAG = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"RECEIVE_FLAG");
		var v_DOC_ID = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"DOC_ID");
		
//		if( UT.isNull(v_DOC_ID)){
//			UT.alert(this.screen , "" , "저장 후 첨부파일을 등록하세요");
//			return;
//		}
	  
    	// 읽기 전용
		var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
		objPopupAttData.clear();
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = v_DOC_ID;
		objPopupAttData.P_MODE = "R";
		objPopupAttData.P_FILE_GUBUN = "SmtSet1170";
		objPopupAttData.P_REF_NAME = "";
		objPopupAttData.P_DIR_TYPE = "ODOC";
		objPopupAttData.P_OU_CODE = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "";
		screen.loadportletpopup("AttFile1031", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
	}
}

// 접수
function btnReceive_on_mouseup(objInst)
{
	var v_cnt = 0;
	for(var i=0; i<this.dsMaster.getrowcount(); i++){
		var v_CHECK_FLAG = this.dsMaster.getdatabyname(i,"CHECK_FLAG"); 
		var V_RECEIVE_FLAG = this.dsMaster.getdatabyname(i,"RECEIVE_FLAG");
		if (v_CHECK_FLAG =="Y" && V_RECEIVE_FLAG == "N"){
			this.dsMaster.setdatabyname(i,"CHECK_FLAG","Y");
			this.dsMaster.setrowoperation(i,XFD_ROWOP_UPDATE);
			v_cnt = v_cnt+1;
		}				
	}	
	
	if (v_cnt == 0 ){ 
		UT.alert(this.screen, "", "해당 데이터를 먼저 선택 바랍니다."); 
        return;
	}
	
	UT.confirm(this.screen,"MSG133","접수 처리 하시겠습니까?","",0,"save_confirm");	
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
	} else {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , "");
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , "");	
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