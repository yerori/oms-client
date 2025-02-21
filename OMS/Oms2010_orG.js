/*------------------------------------
* program id : Oms2010
* desc	   : 중장기계획 분석
* dev date   : 2023-07-06
* made by    : SEYUN
*-------------------------------------*/
var ouCode;
var authScope;
var fvSelectedRow;	//그리드 선택된 row
var authScope;

// 등록 화면으로 전달할 파라미터 설정
var objRegExtraData = {
	P_DATA1: "",	      	// 등록 화면으로 전달할 데이터1
	P_DATA2: "",	      	// 등록 화면으로 전달할 데이터2
	P_DATA3: "",	      	// 등록 화면으로 전달할 데이터3
	P_DATA4: "",	      	// 등록 화면으로 전달할 데이터4	
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


}
/*
* 데이터셋 
*/
function fnDsSet(){

	UT.gfnGetOuCodes(this.dsOU);	// ou code set
		
	UT.gfnGetCommCodes(this.dsActStatus, "O015");		
	UT.gfnGetCommCodes(this.dsCustGroup, "O014");	 //고객그룹(O014)		
	UT.gfnGetCommCodes(this.dsProGroup, "O007");	  //제품군 (O007)		
	UT.gfnGetCommCodes(this.dsImportance, "O017");	//중요도 코드(O017)				
	UT.gfnGetCommCodes(this.dsDetailStatus, "O016");	//Detail Status Code(O016)				
	UT.gfnGetCommCodes(this.dsCustNa, "O005");	//D고객국가(O005)
	this.fnSearchExchange();
	this.fnSetTitle();		
}

/*
* 버젼 정보 데이터 가져오기.
* DB조회
*/
function fnSearchExchange(){		
	var pamrams = "";
	params = "OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	params = params + " BASE_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"BASE_YEAR");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsExchange , "NONE" , "CLEAR" ,  "" , "" , "TR_EXCHANGE");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_EXCHANGE");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmeAnalysisMapper.SELECT_EXCHANGE" ,"" , "dsExchange", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_EXCHANGE" , true , true , false , "TR_EXCHANGE");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
/*
* 필드 title 정보 데이터 가져오기.
* DB조회
*/
function fnSetTitle(){		
	var pamrams = "";
	params = "OU_CODE=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	params = params + " BASE_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"BASE_YEAR");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMonth , "NONE" , "CLEAR" ,  "" , "" , "TR_MONTH");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_MONTH");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmeAnalysisMapper.SELECT_MONTH" ,"" , "dsMonth", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_MONTH" , true , true , false , "TR_MONTH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)

    this.grdList.setheadertext(0, 0, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M1"));

}
/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화
    this.comOu.setselectedcodeex(ouCode,true,true); 


    
//    this.fldLatestDegree.settext("Y"); 
 
    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.comOu.setenable( false );
    }


    //내부 사용자인지 확인
    //내부 사용자이면 협력업체 변경 가능
    //협력업체이면 고정
    var userType;
    if( INI.GV_USER_TYPE == "U"){   //유저사용자유형 (내부사용자:U, 외부사용자:V)
	   userType = "INNER"; //INNER: 내부사용자 
    } else{
	   userType = "OUTER"; //INNER: 내부사용자 
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
	//기준년
	var today = new Date();
	var dateS=Number(today.getFullYear())
    this.fldDateS.settext(dateS);

   UT.gfnHrEditorStyle(this.comOu, "D");
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
		if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(this.screen , "MSG001" , "검색 결과가 없습니다.");
			return;
		} else {
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리
		}
	}
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{

//	var year = this.fldYear.gettext();

/*	if (! year ) {
		UT.alert(this.screen, "MSG524", "기준년을 입력하세요"); 
		return; 
	}
*/

	TRN.gfnTranDataSetHandle(this.screen , this.dsMonth , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");		
	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmeAnalysisMapper.SELECT_INFO" ,"dsMonth" , "dsList", "TR_SEARCH");	//조회만		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	//진행중이 보이려면 싱크 방식을 false로 해야됨. false , true , true 로 설정 
	// screen_on_submitcomplete 힘수에 UT.gfnWaitDestroy(screen); 코딩 들어 있는지 확인 
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , false , true , true , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}


function screen_on_messagebox(messagebox_id, result)
{

}




function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);	
}



function grdMaster_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick)
{
	this.btnView_on_mouseup();
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
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
	}else {
        this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , "");
        this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , "");	
    }
}

function btnVendorPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"VENDOR_NAME");
	objPopupExtraData.P_DATA6 = authScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorClosePopCallback";
	screen.loadportletpopup("VendorNameSelect", "/FRAME/popupVendor", "협력업체정보조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

/*
* 기준날짜에서 nDayGap일만큼 지난 년월일을 8자리 년월일 형태로 반환한다.
* strDate : (string) YYYYMMDD 형태의 날짜 strDate 기준 날짜 년월일
* nDayGap : (int) YYYYMMDD 형태의 날짜 nDayGap 현재일을 기준으로 날 차이, 음수는 이전 날자
* [return] => (string) 계산된 년월일(YYYY-MM-DD)
*/
function fnGetDateByDayGap(strDate, nDayGap)
{
	try {
		if(UT.gfnIsYYYYMMDD(strDate) == false) {
			return "";
		}

		nDayGap = parseInt(nDayGap, 10);
		var strOp = "+";
		if(nDayGap < 0) {
			strOp = "-";
		}

		var nYYYY = parseInt(strDate.substr(0, 4), 10);
		var nMM = parseInt(strDate.substr(4, 2), 10) - 1;
		var nDD = parseInt(strDate.substr(6, 2), 10);
		
		var objTempDate = new Date(nYYYY, nMM, nDD);
		
		objTempDate.setDate(eval(objTempDate.getDate() + strOp + Math.abs(nDayGap)));

		var nCalcYYYY = objTempDate.getFullYear(); 	//연도 가져오기
		
		//달 가져오기 달은 0부터 11까지이므로 1을 더한다
		var nCalcMM = objTempDate.getMonth() + 1; 

		nCalcMM = nCalcMM < 10 ? UT.gfnLpad("" + nCalcMM, "0" , 2) : nCalcMM; 	// 달이 10보다 적으면 앞에 0 붙이기
		
		var nCalcDD = objTempDate.getDate(); //날짜 가져오기
		nCalcDD = nCalcDD < 10 ? UT.gfnLpad("" + nCalcDD, "0" , 2) : nCalcDD; 	// 날짜가 10보다 작으면 앞에 0 붙이기

		var strCalcDate = nCalcYYYY.toString(10)+"-" + nCalcMM.toString(10)+"-"+ nCalcDD.toString(10); 
		return strCalcDate; 
	}
	catch(EXCEP) {
		return "";
	}
}

function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{	
    ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	//UT.gfnGetUserSiteCodes(this.dsSite,ouCode,INI.GV_USER_ID);	
    //  this.comSite.setselectedindex(0);   	
}



function grdList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.grdList.setcheckedrow(nClickRow, true);
}


function btnCustomerPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
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
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
	}
}

function edtCustomerName_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "CUSTOMER_ID" , "");
	return 0;
}




function btnDownLoad_on_mouseup(objInst)
{
	var excel_file_name, is_show_option, is_save_onerow,
	is_include_pattern, is_include_header, is_include_statdata,
	is_include_border, is_include_align, is_include_backcolor, 
	is_include_font, is_include_forecolor, is_include_itemstyle, 
	is_include_itemmerge, is_include_linenumber, is_include_masking, 
	file_download_type, convert_number_type, is_checkrow_only,
	is_save_onerow_mergedata, excel_password;
	
	excel_file_name = "download.xlsx";
	is_show_option = false;
	is_save_onerow = true;
	is_include_pattern = true;
	is_include_header = true;
	is_include_statdata = true;
	is_include_border = true;
	is_include_align = true;
	is_include_backcolor = true;
	is_include_font = true;
	is_include_forecolor = true;
	is_include_itemstyle = true;
	is_include_itemmerge = true;
	is_include_linenumber = true;
	is_include_masking = true;
	file_download_type = 0;		// 0: local download, 1: server_save_only
	convert_number_type = 0;
	is_checkrow_only = false;
	is_save_onerow_mergedata = true;
	excel_password = "";
	
	this.grdList.downloadexcelex(excel_file_name, is_show_option, is_save_onerow,
		is_include_pattern, is_include_header, is_include_statdata,
		is_include_border, is_include_align, is_include_backcolor, 
		is_include_font, is_include_forecolor, is_include_itemstyle, 
		is_include_itemmerge, is_include_linenumber, is_include_masking, 
		file_download_type, convert_number_type, is_checkrow_only,
		is_save_onerow_mergedata, excel_password);	
}

function fldDateS_on_changed(objInst, prev_text, curr_text, event_type)
{
    this.fnSearchExchange();
	this.dsList.removeallrows();
	this.fnSetTitle();		
}