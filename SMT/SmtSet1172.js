var fvMultiYn = "N";
var fvFirstSearch = false; 

/*
 * 온로드
 */
function screen_on_load()
{
	INI.initPopup(this.screen);	 //팝업 공통 	
	this.fnDsSearchSet();       	//검색조건 세팅
	this.fnPageSet();	           //받은 데이터로 페이지 세팅
	this.btnSearch_on_mouseup();
	this.btnSearch_detail();	
}

/*
 * 검색조건 초기화 및 세팅
 */
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	//UT.gfnGetCommCodes(this.dsDept, "F040");		   // 담당자부서
	//UT.gfnTranceCodeSet(this.dsDept, "N");  //빈줄추가
	
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
		this.dsSearch.setdatabyname(0, "DOC_ID", objExtraData.P_DATA2);
	 
	}
	
	
	this.fnGetReceiveGroup();
	
}

//수신그룹 가져오기 
function fnGetReceiveGroup(){
	
	var v_ou_code = this.dsSearch.getdatabyname(0,"OU_CODE");
	 
    var params = "OU_CODE="+v_ou_code;
    TRN.gfnTranDataSetHandle(this.screen , this.dsReceiveGroup , "NONE" , "CLEAR" , "" , "" , "TR_RECEIVE_GROUP");
	TRN.gfnCommonTransactionClear(this.screen , "TR_RECEIVE_GROUP");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_RECEIVE_GROUP" , "" , "dsReceiveGroup" , params);
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_RECEIVE_GROUP" , true , false , false , "TR_RECEIVE_GROUP");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
	UT.gfnTranceCodeSet(this.dsReceiveGroup, "N");  //빈줄추가
}


/*
 * 조회버튼시
 */
function btnSearch_on_mouseup(objInst){

	 /*
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE");	//데이터셋 인:ALL 아웃:NONE 정의
	TRN.gfnTranDataSetHandle(this.screen , this.dsVendorList);	       		    //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen);	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_VENDOR_POP" ,"dsSearch" , "dsVendorList");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "select");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	//TRN.gfnCommonTransactionRun(this.screen , "select"  , true , true , false , "TR_SEARCH");// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	 
	*/
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");//데이터셋 인:ALL 아웃:NONE 정의 
	TRN.gfnTranDataSetHandle(this.screen , this.dsVendorList, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnCommonTransactionClear(this.screen,"TR_SEARCH" );//트랜젝션 데이터셋 초기화 (필수) 
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_VENDOR_POP" ,"dsSearch" , "dsVendorList");//조회만
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "select"  , true , true , false , "TR_SEARCH");// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)


}

function btnSearch_detail(objInst){
    
    var v_doc_id = this.dsSearch.getdatabyname(0,"DOC_ID"); 
    var params = "DOC_ID="+v_doc_id ;
	TRN.gfnTranDataSetHandle(this.screen , this.dsList, "NONE" , "CLEAR" ,  "" , "" , "TR_DETAIL_INFO");
	TRN.gfnCommonTransactionClear(this.screen , "TR_DETAIL_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "ProcSmtMapper.SELECT_OFFICIAL_DTL" , "" , "dsList" , params);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_DETAIL_INFO" , false , false , false , "TR_DETAIL_INFO");	 
}
 
/*
 * 적용 버튼시
 */
function btnApply_on_mouseup(objInst){
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "ProcSmtMapper.INSERT_SMT_OFFICIA_DTL" , "ProcSmtMapper.UPDATE_SMT_OFFICIA_DTL" , "ProcSmtMapper.DELETE_SMT_OFFICIA_DTL", "dsList" );	// 추가 수정 삭제
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
	 
	this.screen.unload();
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
			return;
		}
		if(this.dsList.getrowcount() == 1 && fvMultiYn == "N" && fvFirstSearch){	//멀티가 아니면서 사람이름 넘어온 최초 조회일경우
			//btnApply_on_mouseup();	//적용버튼 클릭이벤트 으로 바로 한개 처리
		}
		fvFirstSearch = false;	//최초 조회 아님으로 변경
	}
    if(recv_userheader == "insertAndselect")  //저장처리 후
	{
		UT.alert(this.screen , "MSG525" , "적용되었습니다.");	 
	    var aryHash = UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	    var objExtraData;
	
	     // 팝업화면 열때 전달한 extra_data 얻기
	    objExtraData = this.screen.getextradata();
	
		// 값 전달 및 팝업닫기
    	this.ReturnClosePopup(aryHash, objExtraData);
	} 
	
}

/*
 * 그리드 더블 클릭시
 */
function grdList_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.btnApply_on_mouseup();	//적용버튼 클릭이벤트
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
 

function btnLine_RIGHT_on_mouseup(objInst)
{
	var dsObj = this.grdList.getlinkxdataset();
	var iRow = this.grdList.getselectrow();
	var v_tot_row = this.dsList.getrowcount();
    var v_doc_id = this.dsSearch.getdatabyname(0,"DOC_ID");
    var v_ou_code = this.dsSearch.getdatabyname(0,"OU_CODE");
    var v_del_cnt = 0;
	
    // 수신사 등록
	for(var i=0; i<this.dsVendorList.getrowcount(); i++){
	    var v_check_flag = this.dsVendorList.getdatabyname(i,"CHECK_FLAG"); 
		
		if (v_check_flag =="Y" ){ 
			GRD.gfnInsertRow(this.screen,this.grdList,false,v_tot_row);
			
			this.grdList.setitemeditstart(v_tot_row, 0, true); 
			this.dsList.setdatabyname(v_tot_row, "DOC_ID", v_doc_id);  
			this.dsList.setdatabyname(v_tot_row, "OU_CODE"  , v_ou_code ); 
			this.dsList.setdatabyname(v_tot_row, "VENDOR_CODE" , this.dsVendorList.getdatabyname(i,"VENDOR_CODE") ); 
			this.dsList.setdatabyname(v_tot_row, "VENDOR_NAME" , this.dsVendorList.getdatabyname(i,"VENDOR_NAME") ); 
			this.dsList.setdatabyname(v_tot_row, "CHG_NAME" , this.dsVendorList.getdatabyname(i,"CHG_NAME") ); 
			this.dsList.setdatabyname(v_tot_row, "CHG_JIKGUB" , this.dsVendorList.getdatabyname(i,"CHG_JIKGUB") ); 
			this.dsList.setdatabyname(v_tot_row, "CHG_EMAIL_ADDR" , this.dsVendorList.getdatabyname(i,"CHG_EMAIL_ADDR") );  
             
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