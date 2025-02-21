/*------------------------------------
* program id : SmtSet1180
* desc	   : 공문등록_업체
* dev date   : 2022-10-19
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
		 
    INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅	 
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
	if(INI.GV_USER_TYPE == "V"){
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
    this.cboOuCode.setselectedcodeex(INI.GV_OU_CODE,true,false);
	
    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    } 
    this.dsSearch.setdatabyname(this.dsSearch.getpos() , "OFFICIAL_TYPE" ,"S");
	this.dsSearch.setdatabyname(this.dsSearch.getpos() , "PROGRAM_ID" ,"SmtSet1180");
	 
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
		this.grdMaster.setcolumnhidden(2,false,true); 
    } 
    if( userType == "OUTER"){	    
	    this.edtVendorName.setenable( false );
	    this.btnVendorPop.setenable(false);
		this.grdMaster.setcolumnhidden(2,true,true);
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
//	ouCode = this.cboOuCode.getselectedcode();
//    //this.dsMaster.removeallrows();
//
//	this.comSite.removeall();
//	UT.gfnGetSiteCodes(this.dsSITE, ouCode);	//사업장  
//	UT.gfnTranceCodeSet(this.dsSITE, "N");  //빈줄추가
	ouCode = this.cboOuCode.getselectedcode();
	UT.gfnGetUserSiteCodes(this.dsSITE,this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE"),INI.GV_USER_ID);
	 
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
			var aryColumn = ["SEND_FLAG","STATUS","VENDOR_NAME","DOC_NUM","SITE_CODE","CHARGE_NAME","START_DATE","END_DATE","TITLE","CHARGE_DEPT","CHARGE_CODE","CHARGE_PHONE_NO","DESCRIPTION"];
			for(var i=0; i<this.dsMaster.getrowcount(); i++){
				//항상 수정 불가
				var v_RECEIVE_FLAG = this.dsMaster.getdatabyname(i,"RECEIVE_FLAG"); 
				if (v_RECEIVE_FLAG =="Y" ){
				    //GRD.gfnGrdCellHandle(this.grdMaster , i , aryColumn , "editable" , false); 
					GRD.gfnHrGrdCellHandle(this.grdMaster, i, aryColumn, "D");
				} else {
					GRD.gfnHrGrdCellHandle(this.grdMaster, i, aryColumn, "G");
				}
			}
			
			if(UT.isNull(fvSelectedRow)){
				this.tr_select_detail(0);
			} else {
				this.tr_select_detail(fvSelectedRow);
			}
		}
	}
	 
	if(recv_userheader == "insertAndselect")  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		
		this.btnCommonSearch_on_mouseup();	//조회
	}
	 
}
//메일 발송
function fnSendMail(){
   // 프로세스 호출
    var vParam = "";

    var OFFICIAL_TYPE ="H";
    
    vParam = "USER_ID="  + INI.GV_USER_ID ; 
    vParam = vParam + " OU_CODE=" + ouCode ;
    vParam = vParam + " OFFICIAL_TYPE=" + OFFICIAL_TYPE ;
    vParam = vParam + " X_RETCODE="  + "" ;
    vParam = vParam + " X_RETMESG=" + "";  
    
    TRN.gfnTranDataSetHandle(this.screen, this.dsReturn, "", "", "", "", "TR_APPROVE");
    TRN.gfnCommonTransactionClear(this.screen,"TR_APPROVE");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"ProcSmtMapper.SMT_VENDOR_SEND_PROC" ,"","dsReturn",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, false, false,"TR_APPROVE");  

	if(this.dsReturn.getdatabyname(this.dsReturn.getpos() ,"X_RETCODE") != "S"){
	    UT.alert(this.screen , "" , "발신중 오류 발생 : " + this.dsReturn.getdatabyname(this.dsReturn.getpos(), "X_RETMESG")); 
	    return;
	}else{
		UT.alert(this.screen , "MSG527" , "발신 완료 하였습니다.");
	}
	//조회
    this.btnCommonSearch_on_mouseup();
}
 
/*
* 공문 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	var ouCode = this.cboOuCode.getselectedcode();
	var dateST = this.fldDateFrom.gettext(); 
	var dateET = this.fldDateTo.gettext(); 
	
	if (!ouCode) {
		UT.alert(this.screen, "", "법인을 입력하세요"); 
		return; 
	}
		
	if (!dateST) {
		UT.alert(this.screen, "", "공지 시작일을 입력하세요"); 
		return; 
	}
	
	if (!dateET) {
		UT.alert(this.screen, "", "공지 종료일을 입력하세요"); 
		return; 
	}

	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_MASTER_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsMaster , "NONE" , "CLEAR" ,  "" , "" , "TR_MASTER_INFO");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_MASTER_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_OFFICIAL_MSTR" ,"dsSearch" , "dsMaster", "TR_MASTER_INFO");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectMasterInfo" , true , true , false , "TR_MASTER_INFO");	
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	var aryDual = [  "DOC_NUM", "SITE_CODE" ,"TITLE" ,"DESCRIPTION" ,"CHARGE_NAME" ,"CHARGE_DEPT" ,"CHARGE_PHONE_NO" ,"START_DATE", "END_DATE"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdMaster, aryDual, false))
	{
		return false;
	}
	
	//그리드에서 중복확인
	var arr = ["VENDOR_CODE"];
	var dupResult = GRD.gfnGrdDuplicateCheck(this.screen, this.grdUserAuth, arr);
	if (dupResult) {
		UT.alert(this.screen, "MSG358", "중복된 데이타가 존재합니다"); 
		return false;
	}
	
	var aryDual1 = ["VENDOR_CODE"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdUserAuth, aryDual1, false))
	{
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
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMaster , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetail , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtMapper.INSERT_SMT_OFFICIA_MSTR" , "ProcSmtMapper.UPDATE_SMT_OFFICIA_MSTR" , "ProcSmtMapper.DELETE_SMT_OFFICIA_MSTR", "dsMaster" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtMapper.INSERT_SMT_OFFICIA_DTL" , "ProcSmtMapper.UPDATE_SMT_OFFICIA_DTL" , "ProcSmtMapper.DELETE_SMT_OFFICIA_DTL", "dsDetail" );	// 추가 수정 삭제
	
	//추가후 재조회 실행						
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

function btnCommonSend_on_mouseup(objInst)
{
	UT.confirm(this.screen,"MSG526","발신하시겠습니까?","",0,"send_confirm");	
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
	
	else if(messagebox_id == "send_confirm") {
		if(result == XFD_MB_RESYES)  {
			
			var v_cnt = 0;
			var v_attfile_cnt = 0;
			// 메일 발송 대상자 지정
			for(var i=0; i<this.dsMaster.getrowcount(); i++){
				//항상 수정 불가
				 
				var v_SEND_FLAG = this.dsMaster.getdatabyname(i,"SEND_FLAG"); 
				var v_ATTFILE_FLAG = this.dsMaster.getdatabyname(i,"ATTFILE_FLAG");
				
				if (v_SEND_FLAG =="Y" ){
					this.dsMaster.setdatabyname(i, "STATUS", "R");  
					v_cnt = v_cnt+1;
					if (UT.isNull(v_ATTFILE_FLAG) || v_ATTFILE_FLAG == "N"){
						v_attfile_cnt = v_attfile_cnt + 1;	
					}
				}				
			}
			
			if (v_cnt == 0 )
			{ 
				UT.alert(this.screen, "", "해당 데이터를 먼저 선택 바랍니다."); 
		       return;
			}
			
			if (v_attfile_cnt > 0 ) {
				UT.alert(this.screen, "", "선택된 데이터의 문서첨부 내역이 없습니다." + "\n" +
				                   	   "확인바랍니다." );
		        return;
			}
			
			var v_dtl_cnt = this.dsDetail.getrowcount();
			if (v_dtl_cnt <= 0 ) {
				UT.alert(this.screen, "", "선택된 데이터의 문서수신팀 등록내역이 없습니다." + "\n" +
				                   	   "확인바랍니다." );
		        return;
			}
	
			this.fnSaveData(false);
			this.fnSendMail();		//메일 발송
		} 
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

/*
*  행추가 
*/ 
function btnAddRow_on_mouseup(objInst)
{
	
	// 행추가
	var iRow = this.grdMaster.getselectrow();
	GRD.gfnInsertRow(this.screen,this.grdMaster,false,iRow + 1);
	this.grdMaster.setitemeditstart(iRow + 1, 0, true); 
	this.dsMaster.setdatabyname(iRow+1, "STATUS", "I");  
	this.dsMaster.setdatabyname(iRow+1, "OU_CODE"       , ouCode ); 
	this.dsMaster.setdatabyname(iRow+1, "OFFICIAL_TYPE"  , "S" );
	this.dsMaster.setdatabyname(iRow+1, "SEND_EMAIL_FLAG", "N" );
	this.dsMaster.setdatabyname(iRow+1, "RECEIVE_FLAG", "N" );
    
    var today = new Date();
    // var dateE= Number(today.getFullYear())*10000+Number(today.getMonth()+1)*100+today.getDate();
    var dateE = today.getFullYear() +"-"+ Number(today.getMonth()+1)  +"-"+today.getDate();
	
	this.dsMaster.setdatabyname(iRow+1, "ISSUE_DATE", dateE );
	this.dsMaster.setdatabyname(iRow+1, "ISSUE_USER_ID", INI.GV_USER_ID);
	this.dsMaster.setdatabyname(iRow+1, "ISSUE_USER_NAME", INI.GV_USER_ID_NM );
	this.dsMaster.setdatabyname(iRow+1, "VENDOR_NAME", INI.GV_VENDOR_NAME );
	this.dsMaster.setdatabyname(iRow+1, "VENDOR_CODE", INI.GV_VENDOR_CODE );  
	
	var doc_id = this.dsMaster.getdatabyname(iRow+1,"DOC_ID");
	if( UT.isNull(doc_id)){
		TRN.gfnTranDataSetHandle(this.screen , this.dsDocIDSeq , "NONE" , "CLEAR" ,  "" , "" , "TR_DOC_ID");	
		TRN.gfnCommonTransactionClear(this.screen, "TR_DOC_ID");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_SMT_OFFICIAL_DOC_ID_SEQ" ,"" , "dsDocIDSeq");	//조회만	
		TRN.gfnCommonTransactionRun(this.screen , "SELECT_EHR_REQ_CERT_SEQ" , true , false , false , "TR_DOC_ID");
	
    	var docReqID = this.dsDocIDSeq.getdatabyname(this.dsDocIDSeq.getpos(),"SEQ")
	    this.dsMaster.setdatabyname(iRow+1, "DOC_ID", docReqID); 
	}  
	this.dsDetail.removeallrows();  

}

function grdMaster_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
		
	if (this.grdMaster.getcolumnname(nColumn) == "ATTFILE_POP") { // 첨부파일
   
		//첨부전 필수 항목 검사		
	    if( !this.fnValidForm()){
			return;
	    }

		var V_RECEIVE_FLAG = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"RECEIVE_FLAG");
		var v_DOC_ID = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"DOC_ID");
		fvSelectedRow = this.grdMaster.getselectrow();
		
		if( UT.isNull(v_DOC_ID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsDocIDSeq , "NONE" , "CLEAR" ,  "" , "" , "TR_DOC_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_DOC_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_SMT_OFFICIAL_DOC_ID_SEQ" ,"" , "dsDocIDSeq");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SEL_SMT_OFFICIAL_DOC_ID_SEQ" , true , false , false , "TR_DOC_ID");
			var newdocuID = this.dsDocIDSeq.getdatabyname(this.dsDocIDSeq.getpos(),"SEQ");
			this.dsMaster.setdatabyname(this.dsMaster.getpos(), "DOC_ID", newdocuID);
		}
		
		var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
		objPopupAttData.clear(); 
		if (V_RECEIVE_FLAG == "N") { 
			objPopupAttData.P_MODE = "W";
			objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
		} else {
			objPopupAttData.P_MODE = "R";
			objPopupAttData.RET_FUNC_NAME = "";
		} 
		
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"DOC_ID");
		//objPopupAttData.P_MODE = "W";
		objPopupAttData.P_FILE_GUBUN = "SmtSet1180";
		objPopupAttData.P_REF_NAME = "";
		objPopupAttData.P_DIR_TYPE = "ODOC";
		objPopupAttData.P_OU_CODE = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"OU_CODE");	
		//objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
		screen.loadportletpopup("AttFile1031", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);		  
	}	 
}

/*
* 첨부파일 Callback
*/
function fnAttFilePopCallback(aryHash) 
{ 
	// 저장한다
	this.fnSaveData(false);
	// 재조회
	this.fnSearch();
}

 
/*
* 삭제 버튼 클릭  
*/
function btnDelRow_on_mouseup(objInst)
{
	var v_RECEIVE_FLAG = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"RECEIVE_FLAG"); 
	if ( v_RECEIVE_FLAG == "Y" ) {
		this.btnAddSup.setenable(false); 
	    this.btnDelRow.setenable(false);  
	    this.btnDeleteSup.setenable(false);
		return;		
	}
	GRD.gfnDeleteRow(this.screen,this.grdMaster);
	this.dsDetail.deleteallrows();
}

/*
* 마스터 행 선택
*/
function grdMaster_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.tr_select_detail(nClickRow);
}

/*
* 디테일 조회 (디테일)
*/
function tr_select_detail(nClickRow)
{
	//clear
	this.dsDetail.removeallrows();
	
	// 클럽코드 셋팅
	var v_doc_id = this.dsMaster.getdatabyname(nClickRow,"DOC_ID"); 
	var v_status = this.dsMaster.getdatabyname(nClickRow,"STATUS"); 
	
	var params = "DOC_ID="+v_doc_id ;
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetail, "NONE" , "CLEAR" ,  "" , "" , "TR_DETAIL_INFO");
	TRN.gfnCommonTransactionClear(this.screen , "TR_DETAIL_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_OFFICIAL_DTL" , "" , "dsDetail" , params);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL_INFO" , true , false , false , "TR_DETAIL_INFO");	
	
	//읽기전용 컬럼 지정
	var aryColumn = ["VENDOR_CODE"];
	for(var i=0; i<this.dsDetail.getrowcount(); i++){
		//항상 수정 불가
		var v_RECEIVE_FLAG = this.dsDetail.getdatabyname(i,"RECEIVE_FLAG"); 
		if (v_RECEIVE_FLAG =="Y" ){
			GRD.gfnHrGrdCellHandle(this.grdUserAuth, i, aryColumn, "D");
		}
	}
	 
}


 


// 수신팀 추가 
function btnAddSup_on_mouseup(objInst)
{ 
	 var iRow = this.grdUserAuth.getrowcount();
	//UT.alert(this.screen,"","rCnt : "+rCnt);
	
	GRD.gfnInsertRow(this.screen, this.grdUserAuth, false, iRow);   
	
	// 입력가능 하도록 설정
	var aryColumn = ["VENDOR_CODE"];
	GRD.gfnHrGrdCellHandle(this.grdUserAuth, iRow, aryColumn, "G");
	
	//this.dsItemCode.setdatabyname(iRow, "VENDOR_NAME", this.dsDetail.getdatabyname(this.dsDetail.getpos(),"VENDOR_NAME") );
	this.grdUserAuth.setitemeditstart(iRow, 0 , true);
    var docId = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"DOC_ID");  
	this.dsDetail.setdatabyname(iRow, "OU_CODE", ouCode); 
	this.dsDetail.setdatabyname(iRow, "DOC_ID",  docId);   
	
}
  
// 수신팀 삭제 
function btnDeleteSup_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdUserAuth);
}

function grdMaster_on_click(objInst)
{
	var v_RECEIVE_FLAG = this.dsMaster.getdatabyname(this.dsMaster.getpos(),"RECEIVE_FLAG"); 
 	 
    if (v_RECEIVE_FLAG =="Y" ){ 
		this.btnAddSup.setenable(false); 
		this.btnDelRow.setenable(false);  
	    this.btnDeleteSup.setenable(false);  
	} else {
		this.btnAddSup.setenable(true); 
		this.btnDelRow.setenable(true); 
		this.btnDeleteSup.setenable(true);  
	}
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