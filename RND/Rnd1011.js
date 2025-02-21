/*------------------------------------
* program id : Rnd1011
* desc	   : 연구원 시간관리 상세 화면
* dev date   : 2024-04-30
* made by    : HS IT Team
*-------------------------------------*/
var userId;
var editMode;
var mode;//I: 신규생성, V:상세내역 C: 복사등록
var fvSelectedRow;	//그리드 선택된 row
var authScope;
var checkDeleteFalg = "";
var prevWorkDate = "" ;
var copyActive = "N";
var objPjtPopExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	P_DATA6: "",	      	// 팝업화면으로 전달할 데이터6
	P_DATA7: "",	      	// 팝업화면으로 전달할 데이터7
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};
var objTaskPopExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	P_DATA6: "",	      	// 팝업화면으로 전달할 데이터6
	P_DATA7: "",	      	// 팝업화면으로 전달할 데이터7
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};

/************************************************************************************************/
/* 화면 초기 on load
/************************************************************************************************/

/*
* 페이지 온로드
*/
function screen_on_load()
{	
    INI.initPopup(this.screen);  //팝업 공통 
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정
    
    // 상세내역 시 
    if(objPopupExtraData.P_DATA3=="V"){
	    this.fnSearch("LOAD");
	    var workTypeCode = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_TYPE") ;
	    var devPhaseCode = this.dsWork.getdatabyname(this.dsWork.getpos(),"DEV_PHASE") ;
	    var workDate = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_DATE") ;	
        this.fnComboSet(workTypeCode,devPhaseCode,workDate);
    }
    
    // 복사등록 시
    if(objPopupExtraData.P_DATA3=="C"){
	    copyActive="Y";
        this.fnCopyTrx("MAIN");
    }

    // 신규등록 시
    if(objPopupExtraData.P_DATA3=="N"){
    }
}

/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	objPopupExtraData = this.screen.getextradata();
	    
	this.fldDeptName.settext(objPopupExtraData.P_DATA6);
	this.fldEmpName.settext(objPopupExtraData.P_DATA8);
	this.fldEmpNo.settext(objPopupExtraData.P_DATA7);
	this.fldJikwiName.settext(objPopupExtraData.P_DATA10);
	
	UT.gfnHrEditorStyle(this.fldDeptName, "D");
	UT.gfnHrEditorStyle(this.fldEmpName, "D");
	UT.gfnHrEditorStyle(this.fldEmpNo, "D");
	UT.gfnHrEditorStyle(this.fldJikwiName, "D");	
	UT.gfnHrEditorStyle(this.fldWorkDateRemark, "D");
	UT.gfnHrEditorStyle(this.fldPjtName, "D");
	UT.gfnHrEditorStyle(this.fldPjtCode, "D");	
}

/*
* 업무성격 콤보 박스
*/
function setWorkTypeCombo(active_date){
	var vParam = "OU_CODE=" + objPopupExtraData.P_DATA1 + " GROUP_CODE=R001 WORK_DATE=" + active_date; 
    TRN.gfnTranDataSetHandle(this.screen, this.dsWorkType, "NONE", "CLEAR", "", "", "TR_WORK_TYPE");           
	TRN.gfnCommonTransactionClear(this.screen, "TR_WORK_TYPE");                                                      
	TRN.gfnCommonTransactionAddSearch(this.screen, "RndWorkHourMapper.SELECT_COMBO_WORK_TYPE", "", "dsWorkType", vParam);   
	TRN.gfnCommonTransactionRun(this.screen, "SELECT_COMBO_WORK_TYPE", true, false, false, "TR_WORK_TYPE");
}

/*
* 업무단계 콤보 박스
*/
function setDevPhaseCombo(work_type_code,active_date){
	var vParam = "OU_CODE=" + objPopupExtraData.P_DATA1 + " GROUP_CODE=R002 MAIN_CODE=" + work_type_code + " WORK_DATE=" + active_date; 
	TRN.gfnTranDataSetHandle(this.screen, this.dsDevPhase, "NONE", "CLEAR", "", "", "TR_DEV_PHASE");
	TRN.gfnCommonTransactionClear(this.screen, "TR_DEV_PHASE"); 
	TRN.gfnCommonTransactionAddSearch(this.screen, "RndWorkHourMapper.SELECT_COMBO_DEV_PHASE", "", "dsDevPhase", vParam); 
	TRN.gfnCommonTransactionRun(this.screen, "SELECT_COMBO_DEV_PHASE", true, false, false, "TR_DEV_PHASE"); 
}

/*
* 업무명 콤보 박스
*/
function setWorkNameCombo(work_type_code,dev_phase_code,active_date){
	var vParam = "OU_CODE=" + objPopupExtraData.P_DATA1 + " GROUP_CODE=R003 MAIN_CODE=" + work_type_code + " MIDDLE_CODE=" + dev_phase_code + " WORK_DATE=" + active_date; 
	TRN.gfnTranDataSetHandle(this.screen, this.dsWorkName, "NONE", "CLEAR", "", "", "TR_WORK_NAME_ACTIVE");
	TRN.gfnCommonTransactionClear(this.screen, "TR_WORK_NAME_ACTIVE"); 
	TRN.gfnCommonTransactionAddSearch(this.screen, "RndWorkHourMapper.SELECT_COMBO_WORK_NAME", "", "dsWorkName", vParam);
	TRN.gfnCommonTransactionRun(this.screen, "workName_SELECT_COMBO_WORK_NAME", true, false, false, "TR_WORK_NAME_ACTIVE");
}

/*
* 콤보박스 셋팅
*/
function fnComboSet(work_type_code,dev_phase_code,work_date)
{
	var vWorkDate ;	
	if(UT.isNull(work_date)){
	    vWorkDate = UT.getDate("%Y%M%D");
	}
	else{
	    vWorkDate = work_date ;
	}
		    
    // 업무성격 
    this.setWorkTypeCombo(vWorkDate);
	
	// 개발단계 
    this.setDevPhaseCombo(work_type_code,vWorkDate)
	
	// 업무명 	
    this.setWorkNameCombo(work_type_code,dev_phase_code,vWorkDate);
}

/*
*   조회 
*/
function fnSearch(search_type)
{
	
	if(search_type=="LOAD"){
		this.dsSearch.removeallrows();
		var iRow = this.dsSearch.getrowcount();
		this.dsSearch.insertrow(iRow);	 
		this.dsSearch.setdatabyname(iRow, "WORK_ID", objPopupExtraData.P_DATA2);
		this.dsSearch.setdatabyname(iRow, "OU_CODE", objPopupExtraData.P_DATA1);
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsWork, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_RND_WORK_POPUP" ,"dsSearch" , "dsWork");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "search" , true , true , false , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	//UT.alert(this.screen , "" , this.dsWork.getrowcount());
	
	if(recv_code != 0){	
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(mapid == "TR_SEARCH"){	
		// Update를 위해 User Id를 지정해 놓음.
		this.dsWork.setdatabyname(this.dsWork.getpos(), "USER_ID", INI.GV_USER_ID);
		
	    var work_date = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_DATE") ;	
	    var ou_code = this.dsWork.getdatabyname(this.dsWork.getpos(),"OU_CODE") ;	
		    
	    // 삭제 시에도 저장 버튼 시 재조회가 되므로 날짜 요일 정보를 체크하면 안됨. 
	    if(!UT.isNull(work_date)){
	        // 최초 상세내역 조회 시 요일 정보 표시
	        this.getWorkDateInfo("Q",ou_code,work_date) ;
	    }
	    
	    // 업무성격이 프로젝트가 아니면 프로젝트 버튼을 비활성화 함. 프로젝트이면 활성화함.
	    var workTypeCode = this.fldWorkType.getselectedcode();
	    this.fnChangePjtText(workTypeCode) ; 
	
	    // 조회 시 데이터셋의 최종 상태를 None 으로 셋팅 : 수정안하고 바로 닫을 수 있으므로 --> 원래는 조회만 하면 NONE일 텐데 어딘가에서 필드를 제어하면서 상태가 U로 변경되었으므로.
	    this.dsWork.setrowoperation(0," ");
	    prevWorkDate = work_date ;
	}
	
	if(mapid == "TR_SAVE_COM_CO")  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리	

		if(this.dsWork.getrowoperation(0) == "D"){	
		    // 삭제 시는 아래에서 DB삭제를 위해 남겨놓은 Work ID를 데이터셋에서 삭제하고 조회를 위해 저장해 놓은 Work Id을 클리어 함. 입력 후 저장시 넣어 줌.		    
		    this.dsWork.deleteallrows(); 		
			this.dsWork.insertrow(0);
	        this.dsSearch.setdatabyname(0, "WORK_ID", "");
		}
		else{
		    this.fnSearch("QUERY");
		}
	}
}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}

/*
* 메시지 박스 처리
*/
function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData(true);
		}	
	}
	
		
	if(messagebox_id == "delete_confirm") {	    
		if(result == XFD_MB_RESYES)  {
			// 화면에서 삭제 처리를 하고 실제 DB를 삭제하기 위해 Dataset에 work id만 저장해 놓고 상태를 삭제로 변경함.			
			var workId = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_ID");
			// 삭제 후 화면을 닫을 경우 해당 삭제 데이터의 일자를 조회해 주기 위함.
			prevWorkDate = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_DATE");
			
			this.dsWork.deleteallrows(); 
			this.dsWork.insertrow(0);	 
			this.dsWork.setdatabyname(0, "WORK_ID", workId);
			this.dsWork.setrowoperation(0, XFD_ROWOP_DELETE);
			this.fnSaveData(true);
		}	
	}
	
	if(messagebox_id == "clear_confirm"){
		if(result == XFD_MB_RESYES)  {
			this.dsWork.deleteallrows(); 
			this.dsWork.insertrow(0);
			this.dsWork.setrowoperation(0, XFD_ROWOP_INSERT);
	    }
	}
	
	if(messagebox_id == "close_confirm") {	    
		if(result == XFD_MB_RESYES)  {
	        this.dsWork.setrowoperation(0, XFD_ROWOP_NONE);
	        this.btnClose_on_mouseup();
	    }
    }
}

/*
* 삭제 시
*/
function btnCommonDelete_on_mouseup(objInst)
{
	var workId = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_ID");
	if(UT.isNull(workId) ){
	    UT.confirm(this.screen,"","현재 데이터 입력 중입니다. 입력 중인 데이터를 삭제하시겠습니까?","",0,"clear_confirm");
	}
	else{
		UT.confirm(this.screen,"","삭제 후 자동저장됩니다. 그래도 삭제하시겠습니까?","",0,"delete_confirm");
	}
}

/*
* 저장
*/
function btnCommonSave_on_mouseup(objInst)
{
	if(this.dsWork.getrowoperation(0) != "D"){
		//필수 항목 검사		
	    if( !this.fnValidForm()){
			return;
	    }
	}
	
    UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");		
}

function fnSaveData(callbackflag)
{
	var workId = this.dsWork.getdatabyname(0,"WORK_ID");
	if( UT.isNull(workId)){
		TRN.gfnTranDataSetHandle(this.screen , this.dsWorkIdSeq , "NONE" , "CLEAR" ,  "" , "" , "TR_WORK_ID");	
		TRN.gfnCommonTransactionClear(this.screen, "TR_WORK_ID");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_RND_WORK_SEQ" ,"" , "dsWorkIdSeq");	//조회만	
		TRN.gfnCommonTransactionRun(this.screen , "SELECT_RND_WORK_SEQ" , true , false , false , "TR_WORK_ID");
	
    	var workId = this.dsWorkIdSeq.getdatabyname(this.dsWorkIdSeq.getpos(),"SEQ_ID");

	    this.dsWork.setdatabyname(0, "WORK_ID", workId);
	    this.dsSearch.setdatabyname(0, "WORK_ID", workId);
	
	    this.dsWork.setdatabyname(0, "OU_CODE", objPopupExtraData.P_DATA1);
	    this.dsWork.setdatabyname(0, "EMP_NO", objPopupExtraData.P_DATA7);
	    this.dsWork.setdatabyname(0, "DEPT_CODE", objPopupExtraData.P_DATA5);
	    this.dsWork.setdatabyname(0, "JIKJONG_CODE", objPopupExtraData.P_DATA11);
	    this.dsWork.setdatabyname(0, "JIKWI_CODE", objPopupExtraData.P_DATA9);
	    this.dsWork.setdatabyname(0, "USER_ID", objPopupExtraData.P_DATA4);
	    
	    // 신규입력 후 저장 시 조회조건 셋팅
	    if(this.dsSearch.getrowcount()==0){
		    var iRow = this.dsSearch.getrowcount();
	   	 this.dsSearch.insertrow(iRow);	 
		    this.dsSearch.setdatabyname(iRow, "WORK_ID", workId);
		    this.dsSearch.setdatabyname(iRow, "OU_CODE", objPopupExtraData.P_DATA1);
	    }
	}
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsWork , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "RndWorkHourMapper.INSERT_RND_WORK" , "RndWorkHourMapper.UPDATE_RND_WORK" , "RndWorkHourMapper.DELETE_RND_WORK", "dsWork" );// 추가 수정 삭제
    TRN.gfnCommonTransactionRun(this.screen , "save" , true , callbackflag , false , "TR_SAVE_COM_CO");
   
    return true;		
}

/* 
* 요일 정보 가져오기 호출
*/
function getWorkDateInfo(event_type,ou_code,work_date)
{
    var vParam = "";
    vParam = vParam + "O_DATE_INFO="  + "" ;
    vParam = vParam + " O_ERROR_MSG=" + ""; 
    vParam = vParam + " I_OU_CODE=" + ou_code ;
    vParam = vParam + " I_WORK_DATE=" + work_date;

    TRN.gfnTranDataSetHandle(this.screen, this.dsReturn, "", "", "", "", "TR_GET_INFO");
    TRN.gfnCommonTransactionClear(this.screen,"TR_GET_INFO");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"RndWorkHourMapper.GET_RND_WORKDATE_INFO" ,"","dsReturn",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_GET_INFO");  

	if(this.dsReturn.getdatabyname(this.dsReturn.getpos() ,"O_ERROR_MSG") != "S"){
		if(event_type == "C"){
	    	this.fldWorkDate.settext("");
		    this.fldWorkDateRemark.settext("");
		    this.fldWorkDate.setfocus();
		}
	    UT.alert(this.screen , "" , "요일정보 가져오는 중 오류 발생 : " + this.dsReturn.getdatabyname(this.dsReturn.getpos(), "O_ERROR_MSG")); 
	    return;
	}
	else{
	    if(this.dsReturn.getdatabyname(this.dsReturn.getpos(), "O_DATE_INFO").includes("휴일")){
		    this.fldWorkDateRemark.setforecolor(255,0,0);
		    this.fldWorkDateRemark.setfont("맑은 고딕", 9, true, false, false, false);

	    }
	    else{
	        this.fldWorkDateRemark.setforecolor(0,0,0);
		    this.fldWorkDateRemark.setfont("맑은 고딕", 9, false, false, false, false);
	    }
	}
}

/*
닫기 버튼
*/
function btnClose_on_mouseup(objInst)
{
	if(this.dsWork.getrowoperation(0) == "" || this.dsWork.getrowoperation(0) == " " || 
	    (this.dsWork.getrowoperation(0) == "I" && (this.dsWork.getdatabyname(0, "WORK_DATE")=="" && this.dsWork.getdatabyname(0, "WORK_TYPE")==""&& this.dsWork.getdatabyname(0, "PJT_CODE")=="" &&
	                                               this.dsWork.getdatabyname(0, "DEV_PHASE")=="" && this.dsWork.getdatabyname(0, "WORK_NAME")==""&& this.dsWork.getdatabyname(0, "WORK_TEXT")=="" &&
	                                               this.dsWork.getdatabyname(0, "WORK_TIME")=="" 
	                                              )
		)
	   )
    {	
		var aryHash = [];
		var objExtraData;
		
		aryHash = UT.gfnDsRowToAry(this.dsWork , this.dsWork.getpos());
				
		// 입력,수정,삭제 데이터를 저장하지 창을 닫으면 WORK_DATE 값을 넘기지 않아서 마스터 화면에서 재조회를 못하게 함.
		if(prevWorkDate==""){
		    aryHash["WORK_DATE"] = "99991231";
		}
		else{
		    aryHash["WORK_DATE"] = prevWorkDate ;
		}
		
		// 팝업화면 열때 전달한 extra_data 얻기
		objExtraData = this.screen.getextradata();	
		// 값 전달 및 팝업닫기
		this.ReturnClosePopup(aryHash, objExtraData);
    }
    else{
        UT.confirm(this.screen,"","입력,수정,삭제중인 데이터가 있습니다. 무시하고 닫으시겠습니까?","",0,"close_confirm");
    }
}

/**
 * 상세화면을 부모화면으로 전달 후 팝업을 닫는다.
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

/*
창닫기(X) 클릯
*/
function screen_on_destroy()
{
    this.btnClose_on_mouseup();
	return 1;
}

/*
* 근무일자 변경 시 
*/
function fldWorkDate_on_changed(objInst, prev_text, curr_text, event_type)
{
	var sysDate = UT.getDate("%Y%M%D");
	var vWorkDate = this.fldWorkDate.gettext();
	
	// 복사등록했을 경우에는 메시지를 띄우지 않음.
	if(copyActive="Y" & UT.isNull(vWorkDate)){
	    UT.alert(this.screen , "" , "근무일자를 입력하세요(1)!");
	    return;
	}
	
	if(vWorkDate.length != "8"){
		this.fldWorkDate.settext("");
		this.fldWorkDateRemark.settext("");
		this.fldWorkDate.setfocus();
		
		if(vWorkDate.length > "0" && vWorkDate.length < "8"){ 
		    UT.alert(this.screen , "" , "날짜형식(YYYYMMDD)을 맞추어 입력하세요!");
		    return;
		}
	}
	else{
		if(event_type==1){
			if(vWorkDate>sysDate){
				this.fldWorkDate.settext("");
				this.fldWorkDate.setfocus();
				UT.alert(this.screen , "" , "근무일자로 미래일자를 입력할 수 없습니다.");
		        return;
			}
			
			// 근무일자에 따른 개인정보 가져오기
			this.fnGetEmpInfo(vWorkDate);
			
			// 사번 및 부서 사용여부 체크		
			this.fnCheckDeptEmpEnable(vWorkDate);
			
			// 근무일자 변경 시 요일 정보 표시
		    var ou_code = objPopupExtraData.P_DATA1 ;
		    this.getWorkDateInfo("C",ou_code,vWorkDate) ;
		
		    // Combo 리프레쉬
		    this.fnGetComboActive();
	    }
    }		
}

/* 
* 저장 전 필수항목 등 체크
*/
function fnValidForm()
{
	//필수 항목 검사	
	var workDate = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_DATE");
	if(UT.isNull(workDate) ){
	    UT.alert(this.screen , "" , "근무일자을 입력하세요.");
		this.fldWorkDate.setfocus();
	    return false;
	}	
	
	var workType = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_TYPE");
	if(UT.isNull(workType) ){
	    UT.alert(this.screen , "" , "업무성격을 입력하세요.");
		return false;
	}
	else{
		var pjtName = this.dsWork.getdatabyname(this.dsWork.getpos(),"PJT_NAME");
		if(workType == "PJT"){
			if(UT.isNull(pjtName)){
			    UT.alert(this.screen , "" , "프로젝트를 입력하세요.");
			    this.fldPjtName.setfocus();
				return false;
			}
	    }
	    else if(workType == "GTA"){
			if(UT.isNull(pjtName)){
			    UT.alert(this.screen , "" , "정부과제를 입력하세요.");
			    this.fldPjtName.setfocus();
				return false;
	        }
	    }
	}
	
	var devPhase = this.dsWork.getdatabyname(this.dsWork.getpos(),"DEV_PHASE");
	if(UT.isNull(devPhase)){
	    UT.alert(this.screen , "" , "업무단계를 입력하세요.");
	    this.fldDevPhase.setfocus();	
		return false;
	}
	
	var workName = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_NAME");
	if(UT.isNull(workName)){
	    UT.alert(this.screen , "" , "업무명을 입력하세요.");
	    this.fldWorkName.setfocus();	
		return false;
	}
	
	var workText = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_TEXT");
	if(UT.isNull(workText)){
	    UT.alert(this.screen , "" , "설명을 입력하세요.");
	    this.fldWorkText.setfocus();	
		return false;
	}
	
	var workTime = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_TIME");
	if(UT.isNull(workTime) || workTime == "0" ){
	    UT.alert(this.screen , "" , "근무시간을 입력하세요.");
	    this.fldWorkTime.setfocus();	
		return false;
	}
	
	return true;
}

/*
* 업무단계 변경시 업무명 콤보 박스 Refresh
*/
function fldDevPhase_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	if(event_type==1 && nprev_item!=ncur_item){
        this.fldWorkName.settext("");	
    } 
}

/*
* 복사등록 버튼 시
*/
function btnCommonCopy_on_mouseup(objInst)
{
	var dsWorkStatus = this.dsWork.getrowoperation(0) ;
	if(dsWorkStatus == "I" || dsWorkStatus == "U" || dsWorkStatus == "D"){
        UT.alert(this.screen, "", "현재 데이터의 상태가 입력,수정,삭제 중입니다. 복사 등록할 수 없습니다.");
        return;
    }
    else{
	    copyActive="Y";
		this.fnCopyTrx("DETAIL");
	}	
}

/*
* 복사등록 시
*/
function fnCopyTrx(trx_type)
{
	// 복사대상 데이터를 조회함.
    this.fnSearch("LOAD");
	
	// 복사 등록 체크
    var nWorkId = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_ID") ;
	if(UT.isNull(nWorkId)){
		UT.alert(this.screen, "", "복사대상인 시간관리 상세내역이 선택되지 않았습니다.");
		return;
	}

    // 콤보박스 Refresh	
    var workTypeCode = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_TYPE") ;
    var devPhaseCode = this.dsWork.getdatabyname(this.dsWork.getpos(),"DEV_PHASE") ;
    var workDate = this.dsWork.getdatabyname(this.dsWork.getpos(),"WORK_DATE") ;	
    this.fnComboSet(workTypeCode,devPhaseCode,workDate);
	
	if(trx_type=="MAIN"){	    
	    // 복사 시 데이터를 현재 Active상태를 비교하여 유효하면 복사값 유지하고 유효하지 않으면 복사값 삭제하고 현재 Active한 값으로 콤보박스를 Refresh 함.
	    if(objPopupExtraData.P_DATA13=="N"){
	        this.dsWork.setdatabyname(0, "WORK_TYPE", "");
	        this.dsWork.setdatabyname(0, "PJT_CODE", "");
	        this.dsWork.setdatabyname(0, "PJT_NAME", "");
	        this.dsWork.setdatabyname(0, "DEV_PHASE", "");
	        this.dsWork.setdatabyname(0, "WORK_NAME", "");
	    }
	    else{
		    if(objPopupExtraData.P_DATA14=="N"){
		        this.dsWork.setdatabyname(0, "DEV_PHASE", "");
			    this.dsWork.setdatabyname(0, "WORK_NAME", "");
		    }
		    else{
			    if(objPopupExtraData.P_DATA15=="N"){
			        this.dsWork.setdatabyname(0, "WORK_NAME", "");
			    }
		    }
	    }	    
	}
	
	if(trx_type=="DETAIL"){		
		var workId = this.dsWork.getdatabyname(0, "WORK_ID");
		var workDate = "";
		this.fnCopyComboActive(workId, workDate);
		
	    // 복사 시 데이터를 현재 Active상태를 비교하여 유효하면 복사값 유지하고 유효하지 않으면 복사값 삭제하고 현재 Active한 값으로 콤보박스를 Refresh 함.
	    if(this.dsComboReturn.getdatabyname(this.dsComboReturn.getpos(),"O_WORKTYPE_FLAG")=="N"){
	        this.dsWork.setdatabyname(0, "WORK_TYPE", "");
	        this.dsWork.setdatabyname(0, "PJT_CODE", "");
	        this.dsWork.setdatabyname(0, "PJT_NAME", "");
	        this.dsWork.setdatabyname(0, "DEV_PHASE", "");
			this.dsWork.setdatabyname(0, "WORK_NAME", "");
	    }
	    else{
		    if(this.dsComboReturn.getdatabyname(this.dsComboReturn.getpos(),"O_DEVPHASE_FLAG")=="N"){
	            this.dsWork.setdatabyname(0, "DEV_PHASE", "");
			    this.dsWork.setdatabyname(0, "WORK_NAME", "");
	        }
	        else{
		        if(this.dsComboReturn.getdatabyname(this.dsComboReturn.getpos(),"O_WORKNAME_FLAG")=="N"){
			        this.dsWork.setdatabyname(0, "WORK_NAME", "");
			    }
	        }
	    }    
	}
	
	// Work Id 및 근무일자를 삭제함. 조회조건을 위하여 Work Id 도 기존 데이터를 삭제함. 저장 시 Work Id가 입력됨.
    this.dsSearch.setdatabyname(0, "WORK_ID", "");
    this.dsWork.setdatabyname(0, "WORK_ID", "");
    this.dsWork.setdatabyname(0, "WORK_DATE", "");
    
    // 입력상태로 변경함.
    this.dsWork.setrowoperation(0,"I");
    
    // 근무일자가 클리어할때 메시지 안 뜨게 하기 위한 값을 원복해줌. 
    copyActive="N";
}

/*
* 복사 시 콤보박스 사용가능 여부 체크 
*/
function fnCopyComboActive(work_id, work_date)
{
	// 신규 버튼 시에는 체크 안함.
    if(!UT.isNull(work_id)){	
		var vParam = "";
	    vParam = vParam + "O_WORKTYPE_FLAG="  + "" ;
	    vParam = vParam + " O_DEVPHASE_FLAG=" + ""; 
	    vParam = vParam + " O_WORKNAME_FLAG=" + ""; 
	    vParam = vParam + " O_ERROR_MSG=" + ""; 
	    vParam = vParam + " I_WORK_ID=" + work_id ;
	    vParam = vParam + " I_ACTIVE_DATE=" + work_date ;
	
	    TRN.gfnTranDataSetHandle(this.screen, this.dsComboReturn, "", "", "", "", "TR_GET_COPY_COMBO_INFO");
	    TRN.gfnCommonTransactionClear(this.screen,"TR_GET_COPY_COMBO_INFO");
	    TRN.gfnCommonTransactionAddSearch(this.screen ,"RndWorkHourMapper.GET_COPY_COMBO_ENABLE_INFO" ,"","dsComboReturn",vParam);
	    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_GET_COPY_COMBO_INFO");  
	    
	    var errorMsg = this.dsReturn.getdatabyname(0,"O_ERROR_MSG") ;    
	    if(errorMsg != 'S'){
		    UT.alert(this.screen, "", errorMsg );
		    return;
	    }
    }
}

/*
* 근무일 변경 시 콤보박스 사용가능 여부 체크 
*/
function fnGetComboActive()
{
	var vParam = "";
    vParam = vParam + "O_WORKTYPE_FLAG="  + "" ;
    vParam = vParam + " O_DEVPHASE_FLAG=" + ""; 
    vParam = vParam + " O_WORKNAME_FLAG=" + ""; 
    vParam = vParam + " O_ERROR_MSG=" + ""; 
    vParam = vParam + " I_OU_CODE=" + objPopupExtraData.P_DATA1 ;
    vParam = vParam + " I_WORKTYPE_CODE=" + this.dsWork.getdatabyname(0, "WORK_TYPE") ;
    vParam = vParam + " I_DEVPHASE_CODE=" + this.dsWork.getdatabyname(0, "DEV_PHASE") ;
    vParam = vParam + " I_WORKNAME_CODE=" + this.dsWork.getdatabyname(0, "WORK_NAME") ;
    vParam = vParam + " I_WORK_DATE=" + this.dsWork.getdatabyname(0, "WORK_DATE") ;

    TRN.gfnTranDataSetHandle(this.screen, this.dsComboReturn, "", "", "", "", "TR_GET_COMBO_INFO");
    TRN.gfnCommonTransactionClear(this.screen,"TR_GET_COMBO_INFO");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"RndWorkHourMapper.GET_COMBO_ENABLE_INFO" ,"","dsComboReturn",vParam);
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_GET_COMBO_INFO");  
    
    var errorMsg = this.dsReturn.getdatabyname(0,"O_ERROR_MSG") ;    
    if(errorMsg != 'S'){
	    UT.alert(this.screen, "", errorMsg );
	    return;
    }
    else{
        // 근무일자 기준 현재 입력된 콤보박스의 사용 가능 여부를 체크하여 Refresh함. 
	    if(this.dsComboReturn.getdatabyname(this.dsComboReturn.getpos(),"O_WORKTYPE_FLAG")=="N"){
	        this.dsWork.setdatabyname(0, "WORK_TYPE", "");
	        this.dsWork.setdatabyname(0, "PJT_CODE", "");
	        this.dsWork.setdatabyname(0, "PJT_NAME", "");
	        this.dsWork.setdatabyname(0, "DEV_PHASE", "");
			this.dsWork.setdatabyname(0, "WORK_NAME", "");
	    }
	    else{
		    if(this.dsComboReturn.getdatabyname(this.dsComboReturn.getpos(),"O_DEVPHASE_FLAG")=="N"){
	            this.dsWork.setdatabyname(0, "DEV_PHASE", "");
			    this.dsWork.setdatabyname(0, "WORK_NAME", "");
	        }
	        else{
		        if(this.dsComboReturn.getdatabyname(this.dsComboReturn.getpos(),"O_WORKNAME_FLAG")=="N"){
			        this.dsWork.setdatabyname(0, "WORK_NAME", "");
			    }
	        }
	    }    
    }
}

/*
* 신규등록 버튼 클릭 시 
*/
function btnCommonCreate_on_mouseup(objInst)
{
	var dsWorkStatus = this.dsWork.getrowoperation(0) ;
	if(dsWorkStatus == "I" || dsWorkStatus == "U" || dsWorkStatus == "D"){
        UT.alert(this.screen, "", "현재 데이터의 상태가 입력,수정,삭제 중입니다. 신규 등록할 수 없습니다.");
        return;
    }
    else{
		this.dsWork.removeallrows();
		var iRow = this.dsWork.getrowcount();
		this.dsWork.insertrow(iRow);	
	}	
}

/*
* 프로젝트 / 정부과제 POPUP
*/ 
function btnPjtPopup_on_click(objInst)
{
	if(this.fldWorkType.getselectedcode()=="PJT"){
		var strPopupName = UT.gfnGetMetaData("", "프로젝트정보조회"); 
		objPjtPopExtraData.P_DATA1 = objPopupExtraData.P_DATA1; //OU_CODE 
		objPjtPopExtraData.P_DATA2 = INI.GV_DEPT_CODE;
		objPjtPopExtraData.P_DATA3 = INI.GV_DEPT_NAME;
		objPjtPopExtraData.P_DATA4 = INI.GV_EMP_NO;
		objPjtPopExtraData.P_DATA5 = INI.GV_EMP_NAME;
		objPjtPopExtraData.P_DATA6 = authScope;
		objPjtPopExtraData.P_DATA7 = "";
		objPjtPopExtraData.RETURN_FUNCTION_NAME = "fnPjtClosePopCallback";
		screen.loadportletpopup("PjtSelect", "/RND/Rnd1012", "프로젝트정보 조회", false, 0, 0, 0, 686, 410, true, true, false, objPjtPopExtraData);
	}
	else if(this.fldWorkType.getselectedcode()=="GTA"){
	    var strPopupName = UT.gfnGetMetaData("", "정부과제정보조회"); 
		objTaskPopExtraData.P_DATA1 = objPopupExtraData.P_DATA1; //OU_CODE 
		objTaskPopExtraData.P_DATA2 = INI.GV_DEPT_CODE;
		objTaskPopExtraData.P_DATA3 = INI.GV_DEPT_NAME;
		objTaskPopExtraData.P_DATA4 = INI.GV_EMP_NO;
		objTaskPopExtraData.P_DATA5 = INI.GV_EMP_NAME;
		objTaskPopExtraData.P_DATA6 = authScope;
		objTaskPopExtraData.P_DATA7 = "";
		objTaskPopExtraData.RETURN_FUNCTION_NAME = "fnTaskClosePopCallback";
		screen.loadportletpopup("TaskSelect", "/RND/Rnd1013", "정부과제정보 조회", false, 0, 0, 0, 686, 410, true, true, false, objTaskPopExtraData);
    }
}

function fnPjtClosePopCallback(aryHash) 
{ 
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		//editMode = "P";
		this.fldPjtName.settext(aryHash["PROJECT_NAME"]);
		this.fldPjtCode.settext(aryHash["PROJECT_CODE"]);
	}
	
	// 설정했던 objPjtPopExtraData 초기화
	objPjtPopExtraData.P_DATA1 = "";
	objPjtPopExtraData.P_DATA2 = "";
	objPjtPopExtraData.P_DATA3 = "";
	objPjtPopExtraData.P_DATA4 = "";
	objPjtPopExtraData.P_DATA5 = "";
	objPjtPopExtraData.P_DATA6 = "";
	objPjtPopExtraData.P_DATA7 = "";
	objPjtPopExtraData.RETURN_FUNCTION_NAME = "";
}

function fnTaskClosePopCallback(aryHash) 
{ 
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		//editMode = "P";
		this.fldPjtName.settext(aryHash["TASK_NAME"]);
		this.fldPjtCode.settext(aryHash["TASK_CODE"]);
	}
	
	// 설정했던 objPjtPopExtraData 초기화
	objTaskPopExtraData.P_DATA1 = "";
	objTaskPopExtraData.P_DATA2 = "";
	objTaskPopExtraData.P_DATA3 = "";
	objTaskPopExtraData.P_DATA4 = "";
	objTaskPopExtraData.P_DATA5 = "";
	objTaskPopExtraData.P_DATA6 = "";
	objTaskPopExtraData.P_DATA7 = "";
	objTaskPopExtraData.RETURN_FUNCTION_NAME = "";
}

/*
* 업무성격 변경 시
*/ 
function fldWorkType_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	// 콤보가 바뀌거나 공통업무일 경우에는 프로젝트 정보를 Empty 처리함
	if(event_type == 1 && (nprev_item!=ncur_item || this.fldWorkType.getselectedcode()=="COM") ){
		this.fldPjtName.settext("");
		this.fldPjtCode.settext("");	
		this.fldDevPhase.settext("");	
		this.fldWorkName.settext("");	
	}
	
	this.fnChangePjtText(this.fldWorkType.getselectedcode());
}

/*
* 업무성격 변경 시 프로젝트 타이틀 제어하기 
*/ 
function fnChangePjtText(work_type)
{
	if(work_type=="PJT"){
        this.TAB_HOUR.setcelltext("PJT_TEXT","*프로젝트");
	    this.btnPjtPopup.setenable(true);
	    this.btnPjtPopup.setvisible(true);
    }
    else if(work_type=="GTA"){
        this.TAB_HOUR.setcelltext("PJT_TEXT","*정부과제");
	    this.btnPjtPopup.setenable(true);
	    this.btnPjtPopup.setvisible(true);
    }
    else{
	    this.TAB_HOUR.setcelltext("PJT_TEXT","");
	    this.btnPjtPopup.setenable(false);
	    this.btnPjtPopup.setvisible(false);
    }
	
}	

/*
* 콤보 선택시 근무일자 없으면 메시지 처리
*/
function fldWorkType_on_focusin(objInst)
{
	if(this.fldWorkDate.gettext()==""){
		UT.alert(this.screen,"","근무일자를 먼저 입력하세요!");
	    this.fldWorkDate.setfocus();
	    return ;
	}
	else{
		var activeDate = this.fldWorkDate.gettext();		
		this.setWorkTypeCombo(activeDate);	
	}
}

function fldDevPhase_on_focusin(objInst)
{
	if(this.fldWorkDate.gettext()==""){
		UT.alert(this.screen,"","근무일자를 먼저 입력하세요!");
	    this.fldWorkDate.setfocus();
	    return ;
	}
	else{
		if(this.fldWorkType.gettext()==""){
			UT.alert(this.screen,"","업무성격을 먼저 선택하세요!");
		    this.fldWorkDate.setfocus();			
		    return;
		}
		else{
			var workTypeCode = this.fldWorkType.getselectedcode();
			var activeDate = this.fldWorkDate.gettext();		
			this.setDevPhaseCombo(workTypeCode,activeDate);	
		}
	}
}

function fldWorkName_on_focusin(objInst)
{
	if(this.fldWorkDate.gettext()==""){
		UT.alert(this.screen,"","근무일자를 먼저 입력하세요!");
	    this.fldWorkDate.setfocus();
	    return ;
	}
	else{	
		if(this.fldWorkType.gettext()==""){
			UT.alert(this.screen,"","업무성격을 먼저 선택하세요!");
		    this.fldWorkDate.setfocus();			
		    return;
		}
		else{
			if(this.fldDevPhase.gettext()==""){
				UT.alert(this.screen,"","업무단계를 먼저 선택하세요!");
			    this.fldWorkDate.setfocus();	
			    return;
			}
			else{
				var workTypeCode = this.fldWorkType.getselectedcode();
				var devPhaseCode = this.fldDevPhase.getselectedcode(); 
				var activeDate = this.fldWorkDate.gettext();		
				this.setWorkNameCombo(workTypeCode,devPhaseCode,activeDate);	
			}
		}
	}	
}

/* 
* 근무일자 기준 부서 및 사번의 사용여부 체크
*/
function fnGetEmpInfo(work_date)
{
	var ouCode = objPopupExtraData.P_DATA1 ;
	var empCode = objPopupExtraData.P_DATA7 ;
	
    var vParam = "";
    vParam = vParam + "O_DEPT_CODE="  + "" ;
    vParam = vParam + " O_DEPT_NAME=" + ""; 
    vParam = vParam + " O_JIKJONG_CODE=" + ""; 
    vParam = vParam + " O_JIKWI_CODE=" + ""; 
    vParam = vParam + " O_JIKWI_NAME=" + ""; 
    vParam = vParam + " O_ERROR_MSG=" + ""; 
    vParam = vParam + " I_OU_CODE=" + ouCode ;
    vParam = vParam + " I_EMP_NO=" + empCode ;
    vParam = vParam + " I_WORK_DATE=" + work_date ;


    TRN.gfnTranDataSetHandle(this.screen, this.dsEmpInfo, "", "", "", "", "TR_GET_EMP_INFO");
    TRN.gfnCommonTransactionClear(this.screen,"TR_GET_EMP_INFO");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"RndWorkHourMapper.GET_RND_EMP_INFO" ,"","dsEmpInfo",vParam);
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_GET_EMP_INFO");  
    
    var errorMsg = this.dsEmpInfo.getdatabyname(0,"O_ERROR_MSG") ;  
    if(errorMsg != 'S'){
	    UT.alert(this.screen, "", errorMsg );
	    this.fldWorkDate.settext("");
	    this.fldWorkDateRemark.settext("");
	    this.fldWorkDate.setfocus();
	    return;
    }
    else{
	    objPopupExtraData.P_DATA5 = this.dsEmpInfo.getdatabyname(0,"O_DEPT_CODE");
	    objPopupExtraData.P_DATA6 = this.dsEmpInfo.getdatabyname(0,"O_DEPT_NAME");
	    objPopupExtraData.P_DATA11 = this.dsEmpInfo.getdatabyname(0,"O_JIKJONG_CODE");
	    objPopupExtraData.P_DATA9 = this.dsEmpInfo.getdatabyname(0,"O_JIKWI_CODE");
	    objPopupExtraData.P_DATA10 = this.dsEmpInfo.getdatabyname(0,"O_JIKWI_NAME");
	
	    this.fldDeptName.settext(objPopupExtraData.P_DATA6);
	    this.fldJikwiName.settext(objPopupExtraData.P_DATA10);
    }
}

/* 
* 근무자 발령 정보 가져오기
*/
function fnCheckDeptEmpEnable(work_date)
{
	var ouCode = objPopupExtraData.P_DATA1 ;
	var deptCode = objPopupExtraData.P_DATA5 ;
	var deptName = objPopupExtraData.P_DATA6 ;
	var empCode = objPopupExtraData.P_DATA7 ;
	var empName = objPopupExtraData.P_DATA8 ;
	
    var vParam = "";
    vParam = vParam + "O_DEPT_FLAG="  + "" ;
    vParam = vParam + " O_EMP_FLAG=" + ""; 
    vParam = vParam + " O_ERROR_MSG=" + ""; 
    vParam = vParam + " I_OU_CODE=" + ouCode ;
    vParam = vParam + " I_DEPT_CODE=" + deptCode ;
    vParam = vParam + " I_EMP_NO=" + empCode ;
    vParam = vParam + " I_WORK_DATE=" + work_date ;


    TRN.gfnTranDataSetHandle(this.screen, this.dsDeptEmpReturn, "", "", "", "", "TR_CHECK_DEPT_EMP_ENABLE");
    TRN.gfnCommonTransactionClear(this.screen,"TR_CHECK_DEPT_EMP_ENABLE");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"RndWorkHourMapper.SELECT_RND_DEPT_ENABLE_CHK" ,"","dsDeptEmpReturn",vParam);
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_CHECK_DEPT_EMP_ENABLE");  
    
    var errorMsg = this.dsDeptEmpReturn.getdatabyname(0,"O_ERROR_MSG") ;  
    var deptFlag = this.dsDeptEmpReturn.getdatabyname(0,"O_DEPT_FLAG") ;  
    var empFlag = this.dsDeptEmpReturn.getdatabyname(0,"O_EMP_FLAG") ;    

    if(errorMsg != 'S'){
	    UT.alert(this.screen, "", errorMsg );
	    this.fldWorkDate.settext("");
	    this.fldWorkDateRemark.settext("");
	    this.fldWorkDate.setfocus();
	    return;
    }
    else{
	    if(deptFlag=='N' || empFlag=='N'){
	        if(deptFlag=='N'){
	            UT.alert(this.screen, "", "입력한 근무일자(" + work_date + ") 기준으로는 해당 부서(" + deptName + "[" + deptCode + "])는 사용 불가합니다.");
	        }
	
	        if(empFlag=='N'){
	            UT.alert(this.screen, "", "입력한 근무일자(" + work_date + ") 기준으로는 해당 사번(" + empName + "[" + empCode + "])은 사용 불가합니다.");
	        }
	        
        	this.fldWorkDate.settext("");
	        this.fldWorkDateRemark.settext("");
	        this.fldWorkDate.setfocus();
	        return ;
	    }	    
    }
}	