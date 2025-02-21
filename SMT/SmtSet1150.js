/*------------------------------------
* program id : SmtSet1150
* desc	   : 업체평가관리
* dev date   : 2022-10-20
* made by    : SEYUN
*-------------------------------------*/

var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";
var fvSelectedMonth = "";   // 그리드 선택된 월
var fvMode = "";

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
	
	if(INI.GV_USER_TYPE == "V" || fvMode == "V"){
		this.btnCommonSearch_on_mouseup();  //최초조회	
	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE);
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    }
	
	//사용자 권한 Control
    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
        fvauthScope = "DEPT";
    } else {
		if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
	    	fvauthScope = "EMP";  
	    } else{
        	fvauthScope = "PINFO";
        }  
    }
	
	//사용자 유형 Control (외부사용자)
	if(INI.GV_USER_TYPE == "V"){
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_CODE",INI.GV_VENDOR_CODE);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_NAME",INI.GV_VENDOR_NAME);
		UT.gfnHrEditorStyle(this.edtVendorName, "D");
		this.btnVendorNamePop.setenable(false);
		this.btnDownload.setvisible(false);
		this.btnUpload.setvisible(false);
		this.btnAddPlan.setvisible(false);
		this.fldScore.setvisible(false);
		this.fldGrade.setvisible(false);
		this.txtScore.setvisible(false);
		this.txtGrade.setvisible(false);
	}
	
	//평가년도
	this.dtpEvalYear.settext( UT.getDate("%Y") );
	
	var objExtraData;
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
	if (objExtraData !== null) {
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"OU_CODE",objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_CODE",objExtraData.P_DATA2);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_NAME",objExtraData.P_DATA3);
		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"EVAL_YEAR",objExtraData.P_DATA4);
		fvMode = objExtraData.P_DATA5;
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
	
	if(recv_userheader == "selectEvalList")
	{		
		if(this.dsEvalList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsEvalList.getrowcount());	//하단메세지 처리
			for(i=0;i<this.dsEvalList.getrowcount();i++){
				for(j=1;j<=12;j++){
					var month = UT.gfnLpad("" + j, "0", 2);
					var evalchk = this.dsEvalList.getdatabyname(i, "EVAL_DATE_" + month);
					var aryColumn = ["PLAN_DATE_" + month];
					if(UT.isNull(evalchk)){
						GRD.gfnHrGrdCellHandle(this.grdEvalList, i, aryColumn, "G");
					} else {
						GRD.gfnHrGrdCellHandle(this.grdEvalList, i, aryColumn, "D");
					}
				}
			}
		}

	}
	
	if(recv_userheader == "insertAndselect")
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		this.fnSearch();
	}	
}

/*
* 평가 상태에 따라 버튼 등 Control
*/
function fnPageSet(){
	var strStatus = this.dsEvalList.getdatabyname(this.dsEvalList.getpos(), "STATUS_" + fvSelectedMonth);	
	//상태값 없음
	if(UT.isNull(strStatus)){
		if(INI.GV_USER_TYPE == "V"){
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(false);		// 유효성확인
			this.btnComplete.setenable(false);		// 완료
			this.btnCancel.setvisible(false);		 // 평가취소
		} else {
			this.btnImpReqCom.setenable(true);	    // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(false);		// 유효성확인
			this.btnComplete.setenable(false);		// 완료
			this.btnCancel.setvisible(true);		  // 평가취소
		}
		
		UT.gfnHrEditorStyle(this.dtpEvalDate, "G");
		UT.gfnHrEditorStyle(this.fldScore, "G");
		UT.gfnHrEditorStyle(this.fldGrade, "D");
		UT.gfnHrEditorStyle(this.fldImpReq, "G");
		UT.gfnHrEditorStyle(this.fldImpMeasure, "D");
	// 개선요구확정상태
	} else if(strStatus == "IR") {
		if(INI.GV_USER_TYPE == "V"){
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(true);        // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(false);		// 유효성확인
			this.btnComplete.setenable(false);		// 완료
		} else {
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(false);		// 유효성확인
			this.btnComplete.setenable(false);		// 완료
		}
		this.btnCancel.setvisible(false);			 // 평가취소
		UT.gfnHrEditorStyle(this.dtpEvalDate, "D");
		UT.gfnHrEditorStyle(this.fldScore, "D");
		UT.gfnHrEditorStyle(this.fldGrade, "D");
		UT.gfnHrEditorStyle(this.fldImpReq, "D");
		UT.gfnHrEditorStyle(this.fldImpMeasure, "G");
	// 개선대책입력완료
	} else if(strStatus == "IC") {
		if(INI.GV_USER_TYPE == "V"){
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(true);		 // 유효성확인요청
			this.btnValidCom.setenable(false);		// 유효성확인
			this.btnComplete.setenable(false);		// 완료
		} else {
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(false);		// 유효성확인
			this.btnComplete.setenable(false);		// 완료
		}
		this.btnCancel.setvisible(false);			 // 평가취소
		UT.gfnHrEditorStyle(this.dtpEvalDate, "D");
		UT.gfnHrEditorStyle(this.fldScore, "D");
		UT.gfnHrEditorStyle(this.fldGrade, "D");
		UT.gfnHrEditorStyle(this.fldImpReq, "D");
		UT.gfnHrEditorStyle(this.fldImpMeasure, "D");
	// 유효성확인요청
	} else if(strStatus == "ER") {
		if(INI.GV_USER_TYPE == "V"){
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(false);		// 유효성확인
			this.btnComplete.setenable(false);		// 완료
		} else {
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(true);		 // 유효성확인
			this.btnComplete.setenable(false);		// 완료
		}
		this.btnCancel.setvisible(false);			 // 평가취소
		UT.gfnHrEditorStyle(this.dtpEvalDate, "D");
		UT.gfnHrEditorStyle(this.fldScore, "D");
		UT.gfnHrEditorStyle(this.fldGrade, "D");
		UT.gfnHrEditorStyle(this.fldImpReq, "D");
		UT.gfnHrEditorStyle(this.fldImpMeasure, "D");
	// 유효성확인
	} else if(strStatus == "EC") {
		if(INI.GV_USER_TYPE == "V"){
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(false);	    // 유효성확인
			this.btnComplete.setenable(false);	    // 완료
		} else {
			this.btnImpReqCom.setenable(false);	   // 개선요구확정
			this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
			this.btnValidReq.setenable(false);		// 유효성확인요청
			this.btnValidCom.setenable(false);	    // 유효성확인
			this.btnComplete.setenable(true);		 // 완료
		}
		this.btnCancel.setvisible(false);			 // 평가취소
		UT.gfnHrEditorStyle(this.dtpEvalDate, "D");
		UT.gfnHrEditorStyle(this.fldScore, "D");
		UT.gfnHrEditorStyle(this.fldGrade, "D");
		UT.gfnHrEditorStyle(this.fldImpReq, "D");
		UT.gfnHrEditorStyle(this.fldImpMeasure, "D");
	// 완료
	} else if(strStatus == "CO") {
		this.btnImpReqCom.setenable(false);	   // 개선요구확정
		this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
		this.btnValidReq.setenable(false);		// 유효성확인요청
		this.btnValidCom.setenable(false);	    // 유효성확인
		this.btnComplete.setenable(false);		// 완료
		this.btnCancel.setvisible(false);		 // 평가취소
		UT.gfnHrEditorStyle(this.dtpEvalDate, "D");
		UT.gfnHrEditorStyle(this.fldScore, "D");
		UT.gfnHrEditorStyle(this.fldGrade, "D");
		UT.gfnHrEditorStyle(this.fldImpReq, "D");
		UT.gfnHrEditorStyle(this.fldImpMeasure, "D");
	// 평가취소
	} else if(strStatus == "CN") {
		this.btnImpReqCom.setenable(false);	   // 개선요구확정
		this.btnImpMeaCom.setenable(false);	   // 개선대책입력완료
		this.btnValidReq.setenable(false);		// 유효성확인요청
		this.btnValidCom.setenable(false);	    // 유효성확인
		this.btnComplete.setenable(false);		// 완료
		this.btnCancel.setvisible(false);		 // 평가취소
		UT.gfnHrEditorStyle(this.dtpEvalDate, "D");
		UT.gfnHrEditorStyle(this.fldScore, "D");
		UT.gfnHrEditorStyle(this.fldGrade, "D");
		UT.gfnHrEditorStyle(this.fldImpReq, "D");
		UT.gfnHrEditorStyle(this.fldImpMeasure, "D");
	}
	
}		
/*
* 업체평가 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsEvalList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPP_EVAL" ,"dsSearch" , "dsEvalList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectEvalList" , true , true , true , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 업체평가 결과정보 데이터 가져오기.
* DB조회
*/
function fnSearchEvalResult(){		
	
	if(UT.isNull(fvSelectedMonth) ){
	    UT.alert(this.screen , "" , "정기검사 월을 먼저 선택하세요.");
		return;
	}	
	
	var pamrams = "";
	params = "OU_CODE=" + this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"OU_CODE");
	params += " EVAL_YEAR=" + this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"EVAL_YEAR");
	params += " EVAL_MONTH=" + fvSelectedMonth;
	params += " VENDOR_CODE=" + this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"VENDOR_CODE");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsEvalResult , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH_RESULT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH_RESULT");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPP_EVAL_RESULT" ,"" , "dsEvalResult", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectSuppEvalRes" , true , false , true , "TR_SEARCH_RESULT");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 업체평가 문서첨부정보 데이터 가져오기.
* DB조회
*/
function fnSearchEvalAttach(){		
	
	if(UT.isNull(fvSelectedMonth) ){
	    UT.alert(this.screen , "" , "정기검사 월을 먼저 선택하세요.");
		return false;
	}	
	
	var pamrams = "";
	params = "OU_CODE=" + this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"OU_CODE");
	params += " EVAL_YEAR=" + this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"EVAL_YEAR");
	params += " EVAL_MONTH=" + fvSelectedMonth;
	params += " VENDOR_CODE=" + this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"VENDOR_CODE");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsEvalAttach , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH_ATT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH_ATT");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPP_EVAL_ATTACH" ,"" , "dsEvalAttach", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectSuppEvalAtt" , true , false , true , "TR_SEARCH_ATT");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	//업체구분
	var vendorCode = this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"VENDOR_CODE");
	if(UT.isNull(vendorCode) ){
	    UT.alert(this.screen , "" , "협력업체를 먼저 선택하세요.");
		this.grdEvalList.setfocus();
	    return false;
	}	
	
//	//개선요구사항 입력값이 있을경우
//	var impReq = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"IMPROVE_REQ");
//	if(!UT.isNull(impReq)){
//	    var evalDate = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"EVAL_DATE");
//		var score = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"SCORE");
//		if(UT.isNull(evalDate)||UT.isNull(score)){
//			UT.alert(this.screen , "" , "평가일 및 평가점수를 먼저 입력하세요.");
//			this.dtpEvalDate.setfocus();
//	    	return false;
//		}
//	}		
	
	return true;
}
/*
* 저장
*/
function fnSaveData(alertshow){
	
	var rCnt = this.dsEvalResult.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var ouCode = this.dsEvalResult.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsEvalResult.setdatabyname(iRow, "OU_CODE", this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"OU_CODE") );
		}
		var evalYear = this.dsEvalResult.getdatabyname(iRow,"EVAL_YEAR");
		if( UT.isNull(evalYear)){
			this.dsEvalResult.setdatabyname(iRow, "EVAL_YEAR", this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"EVAL_YEAR") );
		}
		var evalMonth = this.dsEvalResult.getdatabyname(iRow,"EVAL_MONTH");
		if( UT.isNull(evalMonth)){
			this.dsEvalResult.setdatabyname(iRow, "EVAL_MONTH", fvSelectedMonth );
		}
		var vendorCode = this.dsEvalResult.getdatabyname(iRow,"VENDOR_CODE");
		if( UT.isNull(vendorCode)){
			this.dsEvalResult.setdatabyname(iRow, "VENDOR_CODE", this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"VENDOR_CODE") );
		}
	}
	
	var rowCount = this.dsEvalAttach.getrowcount();
	for(var iRow=0;iRow<rowCount;iRow++){
		var ouCode = this.dsEvalAttach.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(ouCode)){
			this.dsEvalAttach.setdatabyname(iRow, "OU_CODE", this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"OU_CODE") );
		}
		var evalYear = this.dsEvalAttach.getdatabyname(iRow,"EVAL_YEAR");
		if( UT.isNull(evalYear)){
			this.dsEvalAttach.setdatabyname(iRow, "EVAL_YEAR", this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"EVAL_YEAR") );
		}
		var evalMonth = this.dsEvalAttach.getdatabyname(iRow,"EVAL_MONTH");
		if( UT.isNull(evalMonth)){
			this.dsEvalAttach.setdatabyname(iRow, "EVAL_MONTH", fvSelectedMonth );
		}
		var vendorCode = this.dsEvalAttach.getdatabyname(iRow,"VENDOR_CODE");
		if( UT.isNull(vendorCode)){
			this.dsEvalAttach.setdatabyname(iRow, "VENDOR_CODE", this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"VENDOR_CODE") );
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsEvalList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsEvalResult , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");							//데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsEvalAttach , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");							//데이터셋 인:ALL 아웃:CLEAR 정의
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtVendorMapper.INSERT_SUPP_EVAL" , "ProcSmtVendorMapper.UPDATE_SUPP_EVAL" , "" , "dsEvalList" );					// 추가 수정
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtVendorMapper.INSERT_SUPP_EVAL_RESULT" , "ProcSmtVendorMapper.UPDATE_SUPP_EVAL_RESULT" , "", "dsEvalResult" );	 // 추가 수정
	TRN.gfnCommonTransactionAddUpdate(this.screen, "ProcSmtVendorMapper.UPDATE_SUPP_EVAL_ATTACH", "dsEvalAttach");
	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}
/*
* 진행상태 UPDATE PKG CALL
*/
function fnEvalStausUpd(stausCode){
	
	// 필수 값 check
	// 개선요구확정시 
	if(stausCode == "IR"){
		var evalDate = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"EVAL_DATE");
		var score = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"SCORE");
		if(UT.isNull(evalDate)||UT.isNull(score)){
			UT.alert(this.screen , "" , "평가일 및 평가점수를 먼저 입력하세요.");
			this.dtpEvalDate.setfocus();
	    	return false;
		}
		var impReq = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"IMPROVE_REQ");
		if(UT.isNull(impReq)){
			UT.alert(this.screen , "" , "개선요구사항을 먼저 입력하세요.");
			this.fldImpReq.setfocus();
	    	return false;
		}
		var attachYN = "";
		for(var iRow=0;iRow<this.dsEvalAttach.getrowcount();iRow++){
			var docType = this.dsEvalAttach.getdatabyname(iRow,"DOC_TYPE");
			if(docType == "RSA"){
				attachYN = this.dsEvalAttach.getdatabyname(iRow,"ATTFILE_YN");
			}
		}
		if(UT.isNull(attachYN)||attachYN=="N"){
			UT.alert(this.screen , "" , "실적첨부(효성) 문서첨부가 없습니다. 실적첨부(효성) 문서첨부 이후 개선요구 확정을 할 수 있습니다.");
			return false;
		}
	// 개선대책입력완료시
	} else if(stausCode == "IC"){
		var impMea = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"IMPROVE_MEASURE");
		if(UT.isNull(impMea)){
			UT.alert(this.screen , "" , "개선대책을 먼저 입력하세요.");
			this.fldImpMeasure.setfocus();
	    	return false;
		}
		var attachYN = "";
		for(var iRow=0;iRow<this.dsEvalAttach.getrowcount();iRow++){
			var docType = this.dsEvalAttach.getdatabyname(iRow,"DOC_TYPE");
			if(docType == "IMA"){
				attachYN = this.dsEvalAttach.getdatabyname(iRow,"ATTFILE_YN");
			}
		}
		if(UT.isNull(attachYN)||attachYN=="N"){
			UT.alert(this.screen , "" , "개선대책서(협력사) 문서첨부가 없습니다. 개선대책서(협력사) 문서첨부 이후 개선요구 확정을 할 수 있습니다.");
			return false;
		}
	} else if(stausCode == "ER"){
	    var attachYN = "";
		for(var iRow=0;iRow<this.dsEvalAttach.getrowcount();iRow++){
			var docType = this.dsEvalAttach.getdatabyname(iRow,"DOC_TYPE");
			if(docType == "EBA"){
				attachYN = this.dsEvalAttach.getdatabyname(iRow,"ATTFILE_YN");
			}
		}
		if(UT.isNull(attachYN)||attachYN=="N"){
			UT.alert(this.screen , "" , "유효성근거(협력사) 문서첨부가 없습니다. 유효성근거(협력사) 문서첨부 이후 유효성확인 요청을 할 수 있습니다.");
			return false;
		}
	} else if(stausCode == "CN"){ 
		var evalDate = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"EVAL_DATE");
		if(UT.isNull(evalDate)){
			UT.alert(this.screen , "" , "평가취소일을 먼저 입력하세요.");
			this.dtpEvalDate.setfocus();
	    	return false;
		}
	}
	
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return false;
    }
	
	// 저장한다
	this.fnSaveData(false);
	
    // 프로세스 호출
    var vParam = "";
    
    vParam = "USER_ID="  + INI.GV_USER_ID ;
    vParam += " OU_CODE=" + this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"OU_CODE") ;
    vParam += " X_RETCODE=" + "";
    vParam += " X_RETMESG=" + ""; 
    vParam += " EVAL_YEAR=" + this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"EVAL_YEAR") ;
	vParam += " EVAL_MONTH=" + this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"EVAL_MONTH") ;
    vParam += " VENDOR_CODE=" + this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"VENDOR_CODE") ;
	vParam += " EVAL_DATE=" + this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"EVAL_DATE") ;
	vParam += " STATUS_CODE=" + stausCode ;
    
    TRN.gfnTranDataSetHandle(this.screen, this.dsReturn, "", "", "", "", "TR_STATUS_UPDATE");
    TRN.gfnCommonTransactionClear(this.screen,"TR_STATUS_UPDATE");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"ProcSmtVendorMapper.EVAL_STATUS_UPDATE_PROC" ,"","dsReturn",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, false, false, "TR_STATUS_UPDATE");  

	if(this.dsReturn.getdatabyname(this.dsReturn.getpos() ,"X_RETCODE") != "S"){
	    UT.alert(this.screen , "" , "진행상태 갱신 처리중 오류 발생 : " + this.dsReturn.getdatabyname(this.dsReturn.getpos(), "X_RETMESG")); 
	    return false;
	} else {
		UT.alert(this.screen , "MSG041" , "처리 완료 되었습니다.");
	}
	
	return true;
}
/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	this.dsEvalResult.deleteallrows();
	this.dsEvalAttach.deleteallrows();
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
	
	if(messagebox_id == "cancel_confirm") {
		if(result == XFD_MB_RESYES)  {
			if(this.fnEvalStausUpd("CN")){
				this.fnSearch();
				this.fnSearchEvalResult();
				this.fnSearchEvalAttach();
				this.fnPageSet();
			}
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

function cboOuCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function dtpEvalYear_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}

function edtVendorName_on_changed(objInst, prev_text, curr_text, event_type)
{
	if( event_type == 5 ){
		if (!curr_text) {
			this.txtVendorCode.settext("");
			this.edtVendorName.settext("");
		} else {
			this.fnVendorPopupCall("", this.edtVendorName.gettext());
		}
	}
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

function grdEvalList_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	if (nCurSelectColumn >= 3) {
		var nCalcMon = Math.ceil((nCurSelectColumn - 2) / 4);
		nCalcMon = nCalcMon < 10 ? UT.padStr(nCalcMon, "0" , 2, true) : nCalcMon; 	// 달이 10보다 적으면 앞에 0 붙이기
		fvSelectedMonth = nCalcMon.toString(10);
		this.fnSearchEvalResult();
		this.fnSearchEvalAttach();
		this.fnPageSet();
	}
	
}

function grdEvalList_on_fileload(objInst, nResult, strCode, strMsg, strFileName, nLoadStartTime)
{
	for(var i=0;i<this.grdEvalList.getrowcount();i++){
		
		var params = "OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
		params += " EVAL_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"EVAL_YEAR");
		params += " VENDOR_CODE=" + this.grdEvalList.getitemtext(i, this.grdEvalList.getcolumn("VENDOR_CODE"));
		
		TRN.gfnTranDataSetHandle(this.screen , this.dsValidation, "NONE" , "CLEAR" ,  "" , "" , "TR_VALIDATION");
		TRN.gfnCommonTransactionClear(this.screen , "TR_VALIDATION");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPP_EVAL_DUP_CHK" , "" , "dsValidation" , params);
		TRN.gfnCommonTransactionRun(this.screen , "SELECT_SUPP_EVAL_DUP_CHK" , true , false , false , "TR_VALIDATION");	
        if(this.dsValidation.getdatabyname(this.dsValidation.getpos() ,"CNT") != "0"){
        	UT.alert(screen , "" , "중복된 데이터가 존재합니다. (업체코드 : " + this.grdEvalList.getitemtext(i, this.grdEvalList.getcolumn("VENDOR_CODE")) + ")\n\n" 
	                             + "모든 데이터를 삭제합니다.");
			this.grdEvalList.deleteall(); 
    		return;
        }

		var param = "OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
		param += " VENDOR_CODE=" + this.grdEvalList.getitemtext(i, this.grdEvalList.getcolumn("VENDOR_CODE"));
		TRN.gfnTranDataSetHandle(this.screen , this.dsVendor, "NONE" , "CLEAR" ,  "" , "" , "TR_VENDOR");
		TRN.gfnCommonTransactionClear(this.screen , "TR_VENDOR");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPP_INFO" , "" , "dsVendor" , param);
		TRN.gfnCommonTransactionRun(this.screen , "SELECT_SUPP_INFO" , true , false , false , "TR_VENDOR");
		
		if(this.dsVendor.getrowcount() != 0){
			this.dsEvalList.setdatabyname(i, "VENDOR_NAME",this.dsVendor.getdatabyname(this.dsVendor.getpos(),"VENDOR_NAME"));
			this.dsEvalList.setdatabyname(i, "BIZ_TYPE",this.dsVendor.getdatabyname(this.dsVendor.getpos(),"BIZ_TYPE"));
			this.dsEvalList.setdatabyname(i, "BIZ_TYPE_NAME",this.dsVendor.getdatabyname(this.dsVendor.getpos(),"BIZ_TYPE_NAME"));
		}
		
		this.dsEvalList.setdatabyname(i, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE"));
		this.dsEvalList.setdatabyname(i, "EVAL_YEAR", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"EVAL_YEAR"));
	}
}

function grdAttList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	if(this.grdAttList.getcolumnname(nColumn) == "ATTACH_FILE_POP"){
		
		var strStatus = this.dsEvalList.getdatabyname(this.dsEvalList.getpos(), "STATUS_" + fvSelectedMonth);
		var docType = this.dsEvalAttach.getdatabyname(this.dsEvalAttach.getpos(),"DOC_TYPE");
		
		if(strStatus == "CO"){
			//완료일 경우 전체 수정불가
			var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
			var attchID = this.dsEvalAttach.getdatabyname(this.dsEvalAttach.getpos(),"ATTACH_ID");
			if( UT.isNull(attchID)){
				attchID = -1;	
			}
			objPopupAttData.clear();
			objPopupAttData.P_ATT_ID = "";
			objPopupAttData.P_REF_ID = attchID;
			objPopupAttData.P_MODE = "R";
			objPopupAttData.P_FILE_GUBUN = "SmtSet1150";
			objPopupAttData.P_REF_NAME = docType;
			objPopupAttData.P_DIR_TYPE = "EVAL";
			objPopupAttData.P_OU_CODE = this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"OU_CODE");	
			objPopupAttData.RET_FUNC_NAME = "";
			screen.loadportletpopup("AttFile1153", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
		} else {
			//실적첨부(효성)만 첨부문서 - 협력사는 수정불가
			if(docType=="RSA" && INI.GV_USER_TYPE =="V"){
				var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
				var attchID = this.dsEvalAttach.getdatabyname(this.dsEvalAttach.getpos(),"ATTACH_ID");
				if( UT.isNull(attchID)){
					attchID = -1;	
				}
				objPopupAttData.clear();
				objPopupAttData.P_ATT_ID = "";
				objPopupAttData.P_REF_ID = attchID;
				objPopupAttData.P_MODE = "R";
				objPopupAttData.P_FILE_GUBUN = "SmtSet1150";
				objPopupAttData.P_REF_NAME = docType;
				objPopupAttData.P_DIR_TYPE = "EVAL";
				objPopupAttData.P_OU_CODE = this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"OU_CODE");	
				objPopupAttData.RET_FUNC_NAME = "";
				screen.loadportletpopup("AttFile1151", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
			// 실적첨부외 나머지 효성은 수정불가
			} else if(docType!="RSA" && INI.GV_USER_TYPE =="U") {
				var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
				var attchID = this.dsEvalAttach.getdatabyname(this.dsEvalAttach.getpos(),"ATTACH_ID");
				if( UT.isNull(attchID)){
					attchID = -1;	
				}
				objPopupAttData.clear();
				objPopupAttData.P_ATT_ID = "";
				objPopupAttData.P_REF_ID = attchID;
				objPopupAttData.P_MODE = "R";
				objPopupAttData.P_FILE_GUBUN = "SmtSet1150";
				objPopupAttData.P_REF_NAME = docType;
				objPopupAttData.P_DIR_TYPE = "EVAL";
				objPopupAttData.P_OU_CODE = this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"OU_CODE");	
				objPopupAttData.RET_FUNC_NAME = "";
				screen.loadportletpopup("AttFile1152", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
			} else {
				var attchID = this.dsEvalAttach.getdatabyname(this.dsEvalAttach.getpos(),"ATTACH_ID");
				if( UT.isNull(attchID)){
					TRN.gfnTranDataSetHandle(this.screen , this.dsEvalAttSEQ , "NONE" , "CLEAR" ,  "" , "" , "TR_EVAL_ATT_ID");	
					TRN.gfnCommonTransactionClear(this.screen, "TR_EVAL_ATT_ID");	//트랜젝션 데이터셋 초기화 (필수)	
					TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPP_EVAL_ATT_ID_SEQ" ,"" , "dsEvalAttSEQ");	//조회만	
					TRN.gfnCommonTransactionRun(this.screen , "SELECT_EVAL_ATT_ID_SEQ" , true , false , false , "TR_EVAL_ATT_ID");
					var newattchID = this.dsEvalAttSEQ.getdatabyname(this.dsEvalAttSEQ.getpos(),"SEQ");
					this.dsEvalAttach.setdatabyname(this.dsEvalAttach.getpos(), "ATTACH_ID", newattchID);
				}
		
				var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
				objPopupAttData.clear();
				objPopupAttData.P_ATT_ID = "";
				objPopupAttData.P_REF_ID = this.dsEvalAttach.getdatabyname(this.dsEvalAttach.getpos(),"ATTACH_ID");
				objPopupAttData.P_MODE = "W";
				objPopupAttData.P_FILE_GUBUN = "SmtSet1150";
				objPopupAttData.P_REF_NAME = docType;
				objPopupAttData.P_DIR_TYPE = "EVAL";
				objPopupAttData.P_OU_CODE = this.dsEvalList.getdatabyname(this.dsEvalList.getpos(),"OU_CODE");	
				objPopupAttData.RET_FUNC_NAME = "fnAttFilePopCallback";
				screen.loadportletpopup("AttFile1150", "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
			}
		}
	}
}

/*
* 첨부파일 Callback
*/
function fnAttFilePopCallback(aryHash) 
{ 
	//필수 항목 검사		
    if( !this.fnValidForm()){
		return;
    }
	
	// 저장한다
	this.fnSaveData(false);
	
	// 재조회
	this.fnSearchEvalResult();
	this.fnSearchEvalAttach();
}

/*
* Download 버튼 클릭
*/
function btnDownload_on_mouseup(objInst)
{
	this.grdEvalList.downloadexcelex("협력업체평가계획.xlsx",true, false, true, true, true, true, true, false, false);
}
/* 
* Upload 버튼 클릭 
*/
function btnUpload_on_mouseup(objInst)
{
	this.grdEvalList.uploadexcelex(1, 1, 3, "A", 1);
}

function btnAddPlan_on_mouseup(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "업체평가 계획등록"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"EVAL_YEAR");
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnAddPlanPopCallback";
	screen.loadportletpopup("AddPlan", "/SMT/SmtSet1151", "업체평가 계획등록", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

/*
* 계획추가 Callback
*/
function fnAddPlanPopCallback(aryHash) 
{ 
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		
		var params = "OU_CODE=" + aryHash["OU_CODE"];
		params += " EVAL_YEAR=" + aryHash["EVAL_YEAR"];
		params += " VENDOR_CODE=" + aryHash["VENDOR_CODE"];
		TRN.gfnTranDataSetHandle(this.screen , this.dsValidation, "NONE" , "CLEAR" ,  "" , "" , "TR_VALIDATION");
		TRN.gfnCommonTransactionClear(this.screen , "TR_VALIDATION");	//트랜젝션 데이터셋 초기화 (필수)	
		TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtVendorMapper.SELECT_SUPP_EVAL_DUP_CHK" , "" , "dsValidation" , params);
		TRN.gfnCommonTransactionRun(this.screen , "SELECT_SUPP_EVAL_DUP_CHK" , true , false , false , "TR_VALIDATION");	
           if(this.dsValidation.getdatabyname(this.dsValidation.getpos() ,"CNT") != "0"){
        	UT.alert(screen , "" , "중복된 데이터가 존재합니다. (업체코드 : " + aryHash["VENDOR_CODE"] + ")"); 
    		return;
        }
		
		var rowCount = this.grdEvalList.getrowcount();
		var iRow = GRD.gfnInsertRow(this.screen,this.grdEvalList,false,rowCount);
	
		this.dsEvalList.setdatabyname(iRow , "OU_CODE" , aryHash["OU_CODE"]);
		this.dsEvalList.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsEvalList.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
		this.dsEvalList.setdatabyname(iRow , "EVAL_YEAR" , aryHash["EVAL_YEAR"]);
		this.dsEvalList.setdatabyname(iRow , "BIZ_TYPE" , aryHash["BIZ_TYPE"]);
		this.dsEvalList.setdatabyname(iRow , "BIZ_TYPE_NAME" , aryHash["BIZ_TYPE_NAME"]);
		
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_01" , aryHash["PLAN_DATE_01"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_02" , aryHash["PLAN_DATE_02"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_03" , aryHash["PLAN_DATE_03"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_04" , aryHash["PLAN_DATE_04"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_05" , aryHash["PLAN_DATE_05"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_06" , aryHash["PLAN_DATE_06"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_07" , aryHash["PLAN_DATE_07"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_08" , aryHash["PLAN_DATE_08"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_09" , aryHash["PLAN_DATE_09"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_10" , aryHash["PLAN_DATE_10"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_11" , aryHash["PLAN_DATE_11"]);
		this.dsEvalList.setdatabyname(iRow , "PLAN_DATE_12" , aryHash["PLAN_DATE_12"]);
	}
}

function btnImpReqCom_on_mouseup(objInst)
{
	if(this.fnEvalStausUpd("IR")){
		this.fnSearch();
		this.fnSearchEvalResult();
		this.fnSearchEvalAttach();
		this.fnPageSet();
	}
}

function btnImpMeaCom_on_mouseup(objInst)
{
	if(this.fnEvalStausUpd("IC")){
		this.fnSearch();
		this.fnSearchEvalResult();
		this.fnSearchEvalAttach();
		this.fnPageSet();
	}
}

function btnValidReq_on_mouseup(objInst)
{
	if(this.fnEvalStausUpd("ER")){
		this.fnSearch();
		this.fnSearchEvalResult();
		this.fnSearchEvalAttach();
		this.fnPageSet();
	}
}

function btnValidCom_on_mouseup(objInst)
{
	if(this.fnEvalStausUpd("EC")){
		this.fnSearch();
		this.fnSearchEvalResult();
		this.fnSearchEvalAttach();
		this.fnPageSet();
	}
}

function btnComplete_on_mouseup(objInst)
{
	if(this.fnEvalStausUpd("CO")){
		this.fnSearch();
		this.fnSearchEvalResult();
		this.fnSearchEvalAttach();
		this.fnPageSet();
	}
}

function btnCancel_on_mouseup(objInst)
{
	UT.errorMsg(this.screen,"","정말로 평가취소 하시겠습니까?","",0,"cancel_confirm");
}

function fldScore_on_focusout(objInst, focusouttype)
{
	var evalScore = this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"SCORE") ;
	if(!UT.isNull(evalScore)){
		// 평가등급 set
	    var vParam = "";
	    vParam = "SCORE=" + this.dsEvalResult.getdatabyname(this.dsEvalResult.getpos(),"SCORE") ; 
	    
	    TRN.gfnTranDataSetHandle(this.screen, this.dsEvalGrade, "NONE", "CLEAR", "", "", "TR_GRADE");
	    TRN.gfnCommonTransactionClear(this.screen,"TR_GRADE");
	    TRN.gfnCommonTransactionAddSearch(this.screen ,"ProcSmtVendorMapper.SELECT_EVAL_GRADE" ,"","dsEvalGrade",vParam);
		TRN.gfnCommonTransactionRun(this.screen , "SelectGrade", true, false, false, "TR_GRADE");  
	
		if(!UT.isNull(this.dsEvalGrade.getdatabyname(this.dsEvalGrade.getpos() ,"ITEM_CODE"))){
			this.dsEvalResult.setdatabyname(this.dsEvalResult.getpos(), "GRADE", this.dsEvalGrade.getdatabyname(this.dsEvalGrade.getpos(),"ITEM_CODE") );
		} 
	}
}

