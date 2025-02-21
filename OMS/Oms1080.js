/*------------------------------------
* program id : Oms1080
* desc	   : 환율관리
* dev date   : 2023-07-20
* made by    : SEYUN
*-------------------------------------*/
var ouCode;
var authScope;
var fvSelectedRow;	//그리드 선택된 row
var authScope;

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
    this.btnCommonSearch_on_mouseup();
}



/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
    ouCode = INI.GV_OU_CODE;

	//기준년도
	this.dtpStdYear.settext( UT.getDate("%Y") );
}
/*
* 데이터셋 
*/
function fnDsSet()
{
	UT.gfnGetOuCodes(this.dsOU);	// ou code set 
	UT.gfnGetCommCodes(this.dsCurrency, "F018");		  // 통화코드 (F018)
}



/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화
    this.comOu.setselectedcodeex(ouCode,true,true); 
	
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.comOu.setenable( false );
    }
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
		if(this.dsMain.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(this.screen , "MSG001" , "검색 결과가 없습니다.");		  

		} else {
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsMain.getrowcount());	//하단메세지 처리						
			 
            var count = this.dsMain.getrowcount();

            var aryColumn = ["STD_YEAR","EXG_NAME","REMARK"];
	        for( var iRow = 0; iRow < count ; iRow++){
			    var strExgName = this.dsMain.getdatabyname(iRow,"EXG_NAME");
			    if(strExgName =="사업계획환율" ){
					GRD.gfnHrGrdCellHandle(this.grdMain, iRow, aryColumn, "D");
			    } else{	    
					GRD.gfnHrGrdCellHandle(this.grdMain, iRow, aryColumn, "G");
				}	
	    	}
			this.grdMain.refresh();
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
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	//회사코드(OU_CODE)
	var ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	if(UT.isNull(ouCode) ){
	    UT.alert(this.screen , "MSG582" , "회사를 먼저 선택바랍니다.");
		this.comOu.setfocus();
	    return;
	}
	
	//기준년도(STD_YEAR)
	var strYear = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"STD_YEAR");
	if(UT.isNull(strYear) ){
	    UT.alert(this.screen , "MSG352" , "기준년도를 입력하세요");
		this.dtpStdYear.setfocus();
	    return;
	}
	
	this.dsDetail.removeallrows();
	this.fnSearch();
}

function btnCommonCreate_on_mouseup(objInst)
{
	var params = "OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	params += " STD_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"STD_YEAR");
	params += " EXG_NAME=" + "사업계획환율";
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsValidation, "NONE" , "CLEAR" ,  "" , "" , "TR_VALIDATION");
	TRN.gfnCommonTransactionClear(this.screen , "TR_VALIDATION");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsExchangeMapper.SELECT_OMS_EXG_DUP_CHK" , "" , "dsValidation" , params);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_OMS_EXG_DUP_CHK" , true , false , false , "TR_VALIDATION");
		
    if(this.dsValidation.getdatabyname(this.dsValidation.getpos() ,"CNT") != "0"){
    	UT.confirm(screen , "MSG588" , "해당년도의 사업계획환율 데이터가 존재합니다. " + "\n" +
                                       "다시 가져오기를 실행 하시겠습니까?", "", 0, "recreate_confirm");
    } else {
		UT.confirm(screen , "MSG589" , "해당년도의 사업계획환율 가져오기를 실행하시겠습니까?", "", 0, "create_confirm");
	}
}

function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
		}
	}
	if(messagebox_id == "recreate_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnCreateExRate();
		}
	}
	if(messagebox_id == "create_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnCreateExRate();
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

function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{	
    ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
}
/*
* 복사 버튼 클릭
*/
function btnCopy_on_mouseup(objInst)
{
	var iRow = this.grdMain.getselectrow();
	var exgID = this.dsMain.getdatabyname(iRow,"EXG_ID");
	if( UT.isNull(exgID)){
		UT.alert(this.screen , "MSG598" , "해당 데이터를 먼저 저장 후 복사할 수 있습니다.");
		return;
	}

	// 프로세스 호출
    var vParam = "";
    
    vParam = "USER_ID="  + INI.GV_USER_ID ;
    vParam += " OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") ;
    vParam += " EXG_ID=" + this.dsMain.getdatabyname(this.dsMain.getpos(),"EXG_ID") ;
    vParam += " RETCODE=" + "";
    vParam += " RETMESG=" + ""; 

    TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, "", "", "", "", "TR_COPY");
    TRN.gfnCommonTransactionClear(this.screen,"TR_COPY");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsExchangeMapper.COPY_EXCHANGE_RATE_PROC" ,"","dsProcResult",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, false, false, "TR_COPY"); 

	if(this.dsProcResult.getdatabyname(this.dsProcResult.getpos() ,"RETCODE") != "S"){
	    UT.alert(this.screen , "MSG475" , "생성 중 오류 발생 : %%", this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG")); 
	    return;
	} else {
		//UT.alert(this.screen , "MSG365" , "생성되었습니다");
		this.fnSearch();
	}
}
/*
* 환율버젼 행추가
*/
function btnMAddRow_on_mouseup(objInst)
{
	var iRow = this.grdMain.getselectrow();
	GRD.gfnInsertRow(this.screen,this.grdMain,false,iRow + 1);
	
	this.dsMain.setdatabyname(iRow+1, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") ); 
	this.dsMain.setdatabyname(iRow+1, "STD_YEAR", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"STD_YEAR") ); 	
	this.dsDetail.removeallrows();
	
	this.grdMain.setitemeditstart(iRow + 1 , 0 , true);
	
}
/*
* 환율버젼 행삭제
*/
function btnMDelRow_on_mouseup(objInst)
{
	var detailcnt = 0;
	detailcnt = Number(this.dsDetail.getrowcount());
	if( detailcnt != 0 ){
		UT.alert(screen,"MSG587","선택된 데이터의 환율정보가 존재합니다." + "\n" +
						         "환율데이터 삭제처리 후 환율버젼을 삭제 할 수 있습니다." + "\n" +
		                         "확인바랍니다." );
        return;
	} else {
		GRD.gfnDeleteRow(this.screen,this.grdMain);
	}
}
/*
* 환율 행추가
*/
function btnDAddRow_on_mouseup(objInst)
{
	var iRow = this.grdDetail.getselectrow();
	GRD.gfnInsertRow(this.screen,this.grdDetail,false,iRow + 1);
	
	this.dsDetail.setdatabyname(iRow+1, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") ); 
	this.dsDetail.setdatabyname(iRow+1, "STD_YEAR", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"STD_YEAR") ); 	
	
	this.grdDetail.setitemeditstart(iRow + 1 , 0 , true);
}
/*
* 환율 행삭제
*/
function btnDDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdDetail);
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
	var aryDual = [ "STD_YEAR","EXG_NAME"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdMain, aryDual, false))
	{
		return false;
	}
	
	var aryDual = [ "STD_YEAR","FROM_CURR_CODE","TO_CURR_CODE","EXCHANGE_RATE"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdDetail, aryDual, false))
	{
		return false;
	}
	
	//그리드에서 중복확인
	var arr = ["EXG_NAME"];
	var dupResult = GRD.gfnGrdDuplicateCheck(this.screen, this.grdMain, arr);
	if (dupResult) {
		UT.alert(this.screen, "MSG358", "중복된 데이타가 존재합니다"); 
		return;
	}
	
	return true;
}

function fnSearch(){		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsMain , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsExchangeMapper.SELECT_EXCHANGE_RATE_HEADER" ,"dsSearch" , "dsMain");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
* 환율정보 데이터 가져오기.
*/
function fnSearchExgLine(){		
	
	var pamrams = "";
	params = "OU_CODE=" + this.dsMain.getdatabyname(this.dsMain.getpos(),"OU_CODE");
	params += " EXG_ID=" + this.dsMain.getdatabyname(this.dsMain.getpos(),"EXG_ID");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetail , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH_LINE");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH_LINE");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsExchangeMapper.SELECT_EXCHANGE_RATE_LINE" ,"" , "dsDetail", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectExgLine" , true , false , false , "TR_SEARCH_LINE");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)

	if(this.dsDetail.getrowcount() != 0){
		var strExgName = this.dsMain.getdatabyname(this.dsMain.getpos(),"EXG_NAME");
		//## 2023-12-05 Modified by Youngho.Kang : 년도는 Header정보를 따라가도록 함
		//var aryColumn = ["STD_YEAR","FROM_CURR_CODE","TO_CURR_CODE","EXCHANGE_RATE","REMARK"];
		var aryColumn = ["FROM_CURR_CODE","TO_CURR_CODE","EXCHANGE_RATE","REMARK"];
		//// 2023-12-05 Modified end
		if(strExgName =="사업계획환율" ){
			for( var iRow = 0; iRow < this.dsDetail.getrowcount() ; iRow++){
				GRD.gfnHrGrdCellHandle(this.grdDetail, iRow, aryColumn, "D");
			}
		} else {
			for( var iRow = 0; iRow < this.dsDetail.getrowcount() ; iRow++){
				GRD.gfnHrGrdCellHandle(this.grdDetail, iRow, aryColumn, "G");
			}
		}
		this.grdDetail.refresh();
	}	
}

/*
* 저장
*/
function fnSaveData(alertshow){

	var rCnt = this.dsMain.getrowcount();
	for(var iRow=0;iRow<rCnt;iRow++){
		var mainOuCode = this.dsMain.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(mainOuCode)){
			this.dsMain.setdatabyname(iRow, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") );
		}
		var mainstdYear = this.dsMain.getdatabyname(iRow,"STD_YEAR");
		if( UT.isNull(mainstdYear)){
			this.dsMain.setdatabyname(iRow, "STD_YEAR", this.dsSearch.getdatabyname(this.dsSearch.getpos(),"STD_YEAR") );
		}
		var exgID = this.dsMain.getdatabyname(iRow,"EXG_ID");
		if( UT.isNull(exgID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsExgID , "NONE" , "CLEAR" ,  "" , "" , "TR_EXG_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_EXG_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsExchangeMapper.SELECT_OMS_EXG_ID_SEQ" ,"" , "dsExgID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_OMS_EXG_ID_SEQ" , true , false , false , "TR_EXG_ID");
			var newExgID = this.dsExgID.getdatabyname(this.dsExgID.getpos(),"SEQ");
			this.dsMain.setdatabyname(iRow, "EXG_ID", newExgID);
		}
	}
	
	var rCnt1 = this.dsDetail.getrowcount();
	for(var iRow=0;iRow<rCnt1;iRow++){
		var detailOuCode = this.dsDetail.getdatabyname(iRow,"OU_CODE");
		if( UT.isNull(detailOuCode)){
			this.dsDetail.setdatabyname(iRow, "OU_CODE", this.dsMain.getdatabyname(this.dsMain.getpos(),"OU_CODE") );
		}
		var detailstdYear = this.dsDetail.getdatabyname(iRow,"STD_YEAR");
		if( UT.isNull(detailstdYear)){
			this.dsDetail.setdatabyname(iRow, "STD_YEAR", this.dsMain.getdatabyname(this.dsMain.getpos(),"STD_YEAR") );
		}
		var detailexgID = this.dsDetail.getdatabyname(iRow,"EXG_ID");
		if( UT.isNull(detailexgID)){
			this.dsDetail.setdatabyname(iRow, "EXG_ID", this.dsMain.getdatabyname(this.dsMain.getpos(),"EXG_ID") );
		}
		var exgLineID = this.dsDetail.getdatabyname(iRow,"EXG_LINE_ID");
		if( UT.isNull(exgLineID)){
			TRN.gfnTranDataSetHandle(this.screen , this.dsExgLineID , "NONE" , "CLEAR" ,  "" , "" , "TR_EXG_LINE_ID");	
			TRN.gfnCommonTransactionClear(this.screen, "TR_EXG_LINE_ID");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "OmsExchangeMapper.SELECT_OMS_EXG_LINE_ID_SEQ" ,"" , "dsExgLineID");	//조회만	
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_OMS_EXG_LINE_ID_SEQ" , true , false , false , "TR_EXG_LINE_ID");
			var newExgLineID = this.dsExgLineID.getdatabyname(this.dsExgLineID.getpos(),"SEQ");
			this.dsDetail.setdatabyname(iRow, "EXG_LINE_ID", newExgLineID);
		}
	}
	
	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
    
	TRN.gfnTranDataSetHandle(this.screen , this.dsMain   , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetail , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsExchangeMapper.INSERT_EXCHANGE_RATE_HEADER" , "OmsExchangeMapper.UPDATE_EXCHANGE_RATE_HEADER" , "OmsExchangeMapper.DELETE_EXCHANGE_RATE_HEADER", "dsMain" );
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsExchangeMapper.INSERT_EXCHANGE_RATE_LINE" , "OmsExchangeMapper.UPDATE_EXCHANGE_RATE_LINE" , "OmsExchangeMapper.DELETE_EXCHANGE_RATE_LINE", "dsDetail" );
	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	
		
}
/*
* 환율 가져오기 프로세스 호출
*/
function fnCreateExRate(){
	
	// 프로세스 호출
    var vParam = "";
    
    vParam = "USER_ID="  + INI.GV_USER_ID ;
    vParam += " OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE") ;
    vParam += " STD_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"STD_YEAR") ;
    vParam += " RETCODE=" + "";
    vParam += " RETMESG=" + ""; 

    TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, "", "", "", "", "TR_CREATE");
    TRN.gfnCommonTransactionClear(this.screen,"TR_CREATE");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsExchangeMapper.OMS_EXCHANGE_RATE_IF_PROC" ,"","dsProcResult",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, false, false, "TR_CREATE");  

	if(this.dsProcResult.getdatabyname(this.dsProcResult.getpos() ,"RETCODE") != "S"){
	    UT.alert(this.screen , "MSG475" , "생성 중 오류 발생 : %%", this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG")); 
	    return;
	} else {
		UT.alert(this.screen , "MSG365" , "생성되었습니다");
		this.fnSearch();
	}
} 

function grdMain_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.grdMain.setcheckedrow(nClickRow, true);
}

function grdMain_on_itemselchange(objInst, nPrevSelectRow, nPrevSelectColumn, nCurSelectRow, nCurSelectColumn)
{
	//## 2023-12-05 Added by Youngho.Kang
	if (nPrevSelectRow == nCurSelectRow) { 
		return; 
	}

	if (this.dsDetail.getmodifyrowcount() > 0 || this.dsDetail.getdeletedrowcount() > 0) {
		UT.alert(this.screen, "", "변경 내역이 있습니다. \n저장 또는 재조회 후 이동 하세요");
		this.grdMain.setselectrow(nPrevSelectRow, false);
		this.grdMain.setcheckedrow(nPrevSelectRow, true);
		return 1;
	}
	//// 2023-12-05 Added end

	this.fnSearchExgLine();
}

function grdDetail_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.grdDetail.setcheckedrow(nClickRow, true);
}

//## 2023-12-05 Added by Youngho.Kang
function grdMain_on_itemvaluechanged(objInst, nRow, nColumn, strPrevItemText, strItemText)
{
	var strColumn = this.grdMain.getcolumnname(nColumn);

    if (strColumn == "STD_YEAR") {
	    for(var i=0; i<this.dsDetail.getrowcount(); i++){
			this.dsDetail.setdatabyname(i, "STD_YEAR", strItemText);
		}
	}
}
//// 2023-12-05 Added end