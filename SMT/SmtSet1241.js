/*------------------------------------
* program id : SmtSet1241
* desc	   : [팝업]수신그룹등록
* dev date   : 2023-01-09
* made by    : SEYUN
*-------------------------------------*/

var fvMultiYn = "N";
var fvFirstSearch = false;
var ouCode;
var v_delete_falg = "N";

/*
 * 온로드
 */
function screen_on_load()
{
	INI.initPopup(this.screen);	 //팝업 공통 	
	this.fnDsSearchSet();       	//검색조건 세팅
	this.fnPageSet();	           //받은 데이터로 페이지 세팅
	this.btnSearch_on_mouseup();	
}

/*
 * 검색조건 초기화 및 세팅
 */
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
}

/*
* 받은 데이터로 페이지 세팅
*/
function fnPageSet(){
	
	var objExtraData;
	
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
	if (objExtraData !== null) {
		
		// 초기값 설정
		this.dsSearch.setdatabyname(0, "OU_CODE", objExtraData.P_DATA1); 
	}
	
}

/*
 * 조회버튼시
 */
function btnSearch_on_mouseup(objInst){
 
	this.fnSearch();

}

function fnSearch(){
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");//데이터셋 인:ALL 아웃:NONE 정의 
	TRN.gfnTranDataSetHandle(this.screen , this.dsList, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnCommonTransactionClear(this.screen,"TR_SEARCH" );//트랜젝션 데이터셋 초기화 (필수) 
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_SUPPLIER_GROUP" ,"dsSearch" , "dsList");//조회만
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "select"  , true , true , false , "TR_SEARCH");// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)

}


/*
 * 적용 버튼시
 */
function btnApply_on_mouseup(objInst){
		
	//필수 항목 검사		
    if( !this.fnValidForm() ){
		return;
    } 
    this.fnSaveData(true);
	
    // UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");	
	 
}


function screen_on_messagebox(messagebox_id, result)
{
	
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData(true); 
		} 
	}  
	 
}

/*
* 필수 항목 검사
*/
function fnValidForm()
{
	//필수 항목 검사
	var aryDual = ["RECEIVE_GROUP_CODE","RECEIVE_GROUP_NAME"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return false;
	} 
	
	//그리드에서 중복확인
	var arr = ["RECEIVE_GROUP_CODE","RECEIVE_GROUP_NAME"];
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
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtMapper.INSERT_SMT_SUPPLIER_GROUP" , "ProcSmtMapper.UPDATE_SMT_SUPPLIER_GROUP" , "ProcSmtMapper.DELETE_SMT_SUPPLIER_GROUP", "dsList" );	// 추가 수정 삭제
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , true , false , "TR_SAVE_COM_CO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
}

function screen_on_destroy()
{
	this.screen.unload();
	return 1;
}

/*
 * 닫기 버튼 클릭시
 */
function btnClose_on_mouseup(objInst){	
	//this.screen.unload();
	
	var aryHash = UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	
	var objExtraData;
	
	// 팝업화면 열때 전달한 extra_data 얻기
	objExtraData = this.screen.getextradata();
	
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objExtraData);
	
}

/*
 * 페이지 트랜젝션 콜백
 */
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	if(recv_userheader == "select"){
		if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		}
		if(this.dsList.getrowcount() == 1 && fvMultiYn == "N" && fvFirstSearch){	//멀티가 아니면서 사람이름 넘어온 최초 조회일경우
			//btnApply_on_mouseup();	//적용버튼 클릭이벤트 으로 바로 한개 처리
		}
		fvFirstSearch = false;	//최초 조회 아님으로 변경
	}
	
	if(recv_userheader == "insertAndselect"){
		if (v_delete_falg == "Y") {
		    this.fnDelteData();
		} else { 
			UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
			this.fnSearch();
	    } 	
		this.btnClose_on_mouseup();	 
	}  		
}

 

/*
 * 엔터처리
 */
function fnEnter(keycode){
	if(keycode == 13){
		this.btnSearch_on_mouseup();
	}	
}

/**
 * 계산 결과를 부모화면으로 전달 후 팝업을 닫는다.
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

function btnAddRow_on_mouseup(objInst)
{
	// 행추가
	var iRow = this.grdList.getselectrow();
	var v_ou_code = this.dsSearch.getdatabyname(0,"OU_CODE");
	
	GRD.gfnInsertRow(this.screen,this.grdList,false,iRow + 1);
	this.grdList.setitemeditstart(iRow + 1, 0, true);  
	this.dsList.setdatabyname(iRow+1, "OU_CODE", v_ou_code );   
	
	// 수신코드 디폴트 값 셋팅
	var strInObjScnCd = "RG";
	var strSequence = "";
		
	strSequence = UT.gfnGetSequence(strInObjScnCd , "" , strInObjScnCd , strInObjScnCd.length + 5 );	//시퀀스 가져오기
	this.dsList.setdatabyname(iRow+1, "RECEIVE_GROUP_CODE", strSequence ); 
	
	// 입력가능 하도록 설정
	var aryColumn = ["RECEIVE_GROUP_NAME" ];
	GRD.gfnHrGrdCellHandle(this.grdList, iRow + 1, aryColumn, "G");
	 

}

function btnDelRow_on_mouseup(objInst)
{  
	GRD.gfnDeleteRow(this.screen,this.grdList); 
	v_delete_falg = "Y";
}

/*
* 삭제
*/
function fnDelteData()
{
	var vParam = "USER_ID="  + INI.GV_USER_ID ; 
    vParam += " OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE"); 
    
    TRN.gfnTranDataSetHandle(this.screen, this.dsReturn, "", "", "", "", "TR_DELETE_COM_CO");
    TRN.gfnCommonTransactionClear(this.screen,"TR_DELETE_COM_CO");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"ProcSmtMapper.DELETE_RECORD_GROUP" ,"","dsReturn",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, false, false,"TR_DELETE_COM_CO");  

	if(this.dsReturn.getdatabyname(this.dsReturn.getpos() ,"X_RETCODE") != "S"){
	    UT.alert(this.screen , "" , "수신그룹삭제중 오류 발생 : " + this.dsReturn.getdatabyname(this.dsReturn.getpos(), "X_RETMESG")); 
	    return;
	}else{ 
		 UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
	}
	//조회
    this.fnSearch();
}