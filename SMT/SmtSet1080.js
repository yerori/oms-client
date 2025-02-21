/*------------------------------------
* program id : SmtSet1080
* desc	   : 접속로그조회
* dev date   : 2022-03-03
* made by    : SEYUN
*-------------------------------------*/


var fvSelectedRow;	//그리드 선택된 row

// 팝업화면으로 전달할 파라미터 설정
var objPopupExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};
/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	
	this.fnOuCodeSet();     //법인코드 가져오기
	
	this.fnLogCodeSet();     //로그코드 가져오기
	
	this.fnDsSearchSet();   //검색조건 세팅	
	
	//UT.gfnComboFilterSet(this.screen , [this.cboLangScnCd]);	//해당 콤보에 필터 기능 적용   on_keydown on_focusout 사용
	
}

/*
* 법인코드 가져오기
* DB조회 : TR_OU_CODE
*/
function fnOuCodeSet(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsOuCode , "NONE" , "CLEAR" ,  "" , "" , "TR_OU_CODE");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_OU_CODE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_OU_DATA" ,"" , "dsOuCode");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectOuCode" , true , true , false , "TR_OU_CODE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 로그코드 가져오기
* DB조회 : TR_LOG_CODE
*/
function fnLogCodeSet(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsLogKCd , "NONE" , "CLEAR" ,  "" , "" , "TR_LOG_CODE");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_LOG_CODE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LOG_KIND" ,"" , "dsLogKCd");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectLogCode" , true , true , false , "TR_LOG_CODE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	//dsSearch.setdatabyname(iRow , "OBJ_SCN_CD" , "CD");
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
	
	if(recv_userheader == "selectLogInfo") 
	{		
		if(this.dsLogList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(screen , "MSG001" , "검색 결과가 없습니다.");
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsLogList.getrowcount());	//하단메세지 처리
		}

	}
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	var ouCode = this.cboOuCode.getselectedcode();
	var dateST = this.fldDateS.gettext();
	var dateEd = this.fldDateE.gettext();

	if (! ouCode) {
		UT.alert(this.screen, "", "법인을 입력하세요"); 
		return; 
	}

	if (! dateST || ! dateEd) {
		UT.alert(this.screen, "", "접속기간을 입력하세요"); 
		return; 
	}

	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_LOG_INFO");
	TRN.gfnTranDataSetHandle(this.screen , this.dsLogList , "NONE" , "CLEAR" ,  "" , "" , "TR_LOG_INFO");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_LOG_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LOG_INFO" ,"dsSearch" , "dsLogList", "TR_LOG_INFO");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectLogInfo" , true , true , false , "TR_LOG_INFO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
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
	
	if(messagebox_id == "pwdReset_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnPwdReSet();
		}
	}
}

/*
* 사원번호 Callback
*/
function fnEmpNoClosePopCallback(aryHash) 
{ 
	var iRow = this.dsUserList.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsUserList.setdatabyname(iRow , "USER_NAME" , aryHash["EMP_NAME"]);
		this.dsUserList.setdatabyname(iRow , "EMP_NAME" , aryHash["EMP_NAME"]);
		this.dsUserList.setdatabyname(iRow , "EMP_NO" , aryHash["EMP_NO"]);
	}
	
	// 설정했던 objPopupExtraData값 초기화
	objPopupExtraData.P_DATA1 = "";
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.P_DATA4 = "";
	objPopupExtraData.P_DATA5 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "";
}

/*
* 날짜 이상유무 확인
*/
function fldDateS_on_change(objInst, event_type)
{
	var datelen = this.fldDateS.gettext();
	
	if(datelen.length == "8"){
		if(this.fldDateS.gettext() != "" && this.fldDateE.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.fldDateS , this.fldDateE , true);
			if(!rt){
				this.fldDateS.settext("");
				this.fldDateS.setfocus();
			}
			
		}
	} 	
}

/*
* 날짜 이상유무 확인
*/
function fldDateE_on_change(objInst, event_type)
{
	var datelen = this.fldDateE.gettext();
	
	if(datelen.length == "8"){
		if(this.fldDateS.gettext() != "" && this.fldDateE.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.fldDateS , this.fldDateE , true);
			if(!rt){
				this.fldDateE.settext("");
				this.fldDateE.setfocus();
			}
			
		}
	}
}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}