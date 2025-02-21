var fvMultiYn = "N";
var fvFirstSearch = false;
var ouCode="";
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
/*
 * 온로드
 */
function screen_on_load()
{
	INI.initPopup(this.screen);	 //팝업 공통 	
	this.fnDsSearchSet();       	//검색조건 세팅
	this.fnPageSet();	           //받은 데이터로 페이지 세팅

}

/*
 * 검색조건 초기화 및 세팅
 */
function fnDsSearchSet(){
	this.dsProject.removeallrows();
	var iRow = this.dsProject.getrowcount();
	this.dsProject.insertrow(iRow);
	
	//등록일
	var today = new Date();
    var dateS=Number(today.getFullYear());
    this.fldYear.settext(dateS);	
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
		this.dsProject.setdatabyname(0, "OU_CODE", objExtraData.P_DATA1);
		ouCode = objExtraData.P_DATA1;
		this.dsProject.setdatabyname(0, "PROJECT_CODE", objExtraData.P_DATA2);	

	}
	UT.gfnGetCommCodes(this.dsCarPlatfrom, "O018");

}



/*
 * 적용 버튼시
 */
function btnApply_on_mouseup(objInst){
	//등록년도 필수 입력 Check
	var registerYear = this.dsProject.getdatabyname( this.dsProject.getpos(),"REGISTER_YEAR");
	if( UT.isNull(registerYear)){
		var label = UT.gfnGetMetaData("LABEL02367", "등록년도");
		UT.alert(this.screen , "MSG004" , label+"는 필수입력항목입니다.",label );
		return;		
	}
	//RFQ 필수 입력 Check
	var rfqCode = this.dsProject.getdatabyname( this.dsProject.getpos(),"RFQ_CODE");
	if( UT.isNull(rfqCode)){
		var label = UT.gfnGetMetaData("LABEL02469", "RFQ");
		UT.alert(this.screen , "MSG004" , label+"는 필수입력항목입니다.",label );
		return;		
	}	
	//차종 필수 입력 Check
	var carTypeCode = this.dsProject.getdatabyname( this.dsProject.getpos(),"CAR_TYPE_CODE");
	if( UT.isNull(carTypeCode)){
		var label = UT.gfnGetMetaData("LABEL01587", "차종");
		UT.alert(this.screen , "MSG004" , label+"는 필수입력항목입니다.",label );
		return;		
	}	
	//고객명 필수 입력 Check
	var customerID = this.dsProject.getdatabyname( this.dsProject.getpos(),"CUSTOMER_ID");
	if( UT.isNull(customerID)){
		var label = UT.gfnGetMetaData("LABEL00193", "고객명");
		UT.alert(this.screen , "MSG004" , label+"는 필수입력항목입니다.",label );
		return;		
	}
		
	//복사
	var projectCode = this.dsProject.getdatabyname( this.dsProject.getpos(),"PROJECT_CODE") ;
	var vParam = "";	    
    vParam = "PROJECT_CODE="  + projectCode.replaceAll(' ','^');
    vParam = vParam + " USER_ID=" + INI.GV_USER_ID ;
    vParam = vParam + " OU_CODE=" + ouCode ;
    vParam = vParam + " RFQ_CODE=" + rfqCode;
    vParam = vParam + " CAR_TYPE_CODE=" + carTypeCode;
    vParam = vParam + " CUSTOMER_ID=" + customerID;
    vParam = vParam + " REGISTER_YEAR=" + registerYear;
    vParam = vParam + " RETCODE="  + "" ;
    vParam = vParam + " RETMESG=" + ""; 
    vParam = vParam + " NEW_PROJECT_CODE=" + ""; 
    vParam = vParam + " NEW_PROJECT_VERSION=" + ""; 
    
    TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, "", "", "", "", "TR_COPY");
    TRN.gfnCommonTransactionClear(this.screen,"TR_COPY");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsProjectMapper.COPY_PROJECT_ALL_PROC" ,"","dsProcResult",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false,"TR_COPY");

	if(this.dsProcResult.getdatabyname(this.dsProcResult.getpos() ,"RETCODE") != "S"){
	    UT.alert(this.screen , "MSG545" , "오류 발생 : " +this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG"), this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG")); 
	    return;
	}
	

	var aryHash = UT.gfnDsRowToAry(this.dsProcResult , this.dsProcResult.getpos());
	//UT.alert(this.screen ,"",this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "NEW_PROJECT_CODE") );
	//UT.alert(this.screen ,"",this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "NEW_PROJECT_VERSION") );
	var objExtraData;
	var objExtraData;
	
	// 팝업화면 열때 전달한 extra_data 얻기
	objExtraData = this.screen.getextradata();
	
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objExtraData);
	
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
	if(recv_userheader == "SELECT"){

		fvFirstSearch = false;	//최초 조회 아님으로 변경
	}else if(recv_userheader == "SAVE")  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");		
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

function btnCommonSave_on_mouseup(objInst)
{
	    //필수 항목 검사
	var aryDual = [ "DELIVERY_QTY","LOT_NUM"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return;
	}
	
			
    UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");
		
}
function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
		}	
	}

}
/*
* 저장
*/
function fnSaveData()
{
	
    //DB에 저장(등록, 수정, 삭제)
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "AsnMapper.INSERT_LOT_INPUT" , "AsnMapper.UPDATE_LOT_INPUT" , "AsnMapper.DELETE_LOT_INPUT", "dsList" );	// 추가 수정 삭제
    TRN.gfnCommonTransactionRun(this.screen , "SAVE" , true , true , false , "TR_SAVE_COM_CO");
		
}

function btnCustomerPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsProject.getdatabyname(this.dsProject.getpos(),"OU_CODE");
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupCustClosePopCallback";
	screen.loadportletpopup(strPopupName, "/FRAME/popupCust", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	
}


/*
* 고객정보 Callback
*/
function fnPopupCustClosePopCallback(aryHash) 
{ 
	var iRow = this.dsProject.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsProject.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsProject.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
	}
}

function btnRFQPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02469", "RFQ");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupRFQPopCallback";
	screen.loadportletpopup(strPopupName, "/OMS/Oms1111", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

/*
* RFQ Callback
*/
function fnPopupRFQPopCallback(aryHash) 
{ 
	var iRow = this.dsProject.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsProject.setdatabyname(iRow , "RFQ_CODE" , aryHash["RFQ_CODE"]);
		this.dsProject.setdatabyname(iRow , "CAR_TYPE_CODE" , aryHash["CAR_TYPE_CODE"]);
		this.dsProject.setdatabyname(iRow , "CAR_TYPE_NAME" , aryHash["CAR_TYPE_NAME"]);
		this.dsProject.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
		this.dsProject.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
	}
	
}