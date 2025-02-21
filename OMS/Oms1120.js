/*------------------------------------
* program id : Oms1120
* desc	   : 중장기계획 Upload
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
	//this.btnCommonSearch_on_mouseup();
}



/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
    ouCode = INI.GV_OU_CODE;

	//기준년
	var today = new Date();
	var dateS=Number(today.getFullYear())
    this.fldDateS.settext(dateS);

   UT.gfnHrEditorStyle(this.comOu, "D");
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
	UT.gfnGetCommCodes(this.dsCurrency, "F018");		  // 통화코드 (F018)
	var rowConnt = this.dsDetailStatus.getrowcount();
	for(  var iRow = 0; iRow < rowConnt ; iRow++) {
		var code = this.dsDetailStatus.getdatabyname(iRow,"CODE");
	   if(code == "D10"){	
	   	this.dsDetailStatus.removerow( iRow );
	   }
	}
	this.fnSetTitle();		
}


/*
* 필드 title 정보 데이터 가져오기.
* DB조회
*/
function fnSetTitle(){		
	var pamrams = "";
	params = "OU_CODE=" + ouCode;
	params = params + " BASE_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"BASE_YEAR");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMonth , "NONE" , "CLEAR" ,  "" , "" , "TR_MONTH");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_MONTH");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmeAnalysisMapper.SELECT_MONTH" ,"" , "dsMonth", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_MONTH" , true , true , false , "TR_MONTH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
    var qty = UT.gfnGetMetaData("LABEL02667", "수량"); 
    var price = UT.gfnGetMetaData("LABEL02668", "단가"); 
    var amt = UT.gfnGetMetaData("LABEL01089", "금액"); 
    var amt_ex = UT.gfnGetMetaData("LABEL02670", "금액(환율적용)"); 
    this.grdList.setheadertext(0, 9, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M1")+" "+qty);
    this.grdList.setheadertext(0, 10, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M2")+" "+qty);
    this.grdList.setheadertext(0, 11, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M3")+" "+qty);
    this.grdList.setheadertext(0, 12, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M4")+" "+qty);
    this.grdList.setheadertext(0, 13, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M5")+" "+qty);
    this.grdList.setheadertext(0, 14, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M6")+" "+qty);
    this.grdList.setheadertext(0, 15, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M7")+" "+qty);
    this.grdList.setheadertext(0, 16, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M8")+" "+qty);
    this.grdList.setheadertext(0, 17, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M9")+" "+qty);
    this.grdList.setheadertext(0, 18, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M10")+" "+qty);
    this.grdList.setheadertext(0, 19, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M11")+" "+qty);
    this.grdList.setheadertext(0, 20, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M12")+" "+qty);
    this.grdList.setheadertext(0, 21, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y1")+" "+qty);
    this.grdList.setheadertext(0, 22, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y2")+" "+qty);
    this.grdList.setheadertext(0, 23, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y3")+" "+qty);
    this.grdList.setheadertext(0, 24, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y4")+" "+qty);
    this.grdList.setheadertext(0, 25, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y5")+" "+qty);
    this.grdList.setheadertext(0, 26, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y6")+" "+qty);
    this.grdList.setheadertext(0, 27, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y7")+" "+qty);
    this.grdList.setheadertext(0, 28, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y8")+" "+qty);
    this.grdList.setheadertext(0, 29, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y9")+" "+qty);
    this.grdList.setheadertext(0, 30, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y10")+" "+qty);
    this.grdList.setheadertext(0, 31, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y11")+" "+qty);
    this.grdList.setheadertext(0, 32, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y12")+" "+qty);
    this.grdList.setheadertext(0, 33, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y13")+" "+qty);
    this.grdList.setheadertext(0, 34, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y14")+" "+qty);


    this.grdList.setheadertext(0, 35, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M1")+" "+price);
    this.grdList.setheadertext(0, 36, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M2")+" "+price);
    this.grdList.setheadertext(0, 37, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M3")+" "+price);
    this.grdList.setheadertext(0, 38, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M4")+" "+price);
    this.grdList.setheadertext(0, 39, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M5")+" "+price);
    this.grdList.setheadertext(0, 40, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M6")+" "+price);
    this.grdList.setheadertext(0, 41, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M7")+" "+price);
    this.grdList.setheadertext(0, 42, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M8")+" "+price);
    this.grdList.setheadertext(0, 43, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M9")+" "+price);
    this.grdList.setheadertext(0, 44, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M10")+" "+price);
    this.grdList.setheadertext(0, 45, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M11")+" "+price);
    this.grdList.setheadertext(0, 46, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M12")+" "+price);
    this.grdList.setheadertext(0, 47, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y1")+" "+price);
    this.grdList.setheadertext(0, 48, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y2")+" "+price);
    this.grdList.setheadertext(0, 49, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y3")+" "+price);
    this.grdList.setheadertext(0, 50, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y4")+" "+price);
    this.grdList.setheadertext(0, 51, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y5")+" "+price);
    this.grdList.setheadertext(0, 52, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y6")+" "+price);
    this.grdList.setheadertext(0, 53, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y7")+" "+price);
    this.grdList.setheadertext(0, 54, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y8")+" "+price);
    this.grdList.setheadertext(0, 55, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y9")+" "+price);
    this.grdList.setheadertext(0, 56, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y10")+" "+price);
    this.grdList.setheadertext(0, 57, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y11")+" "+price);
    this.grdList.setheadertext(0, 58, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y12")+" "+price);
    this.grdList.setheadertext(0, 59, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y13")+" "+price);
    this.grdList.setheadertext(0, 60, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y14")+" "+price);


    this.grdList.setheadertext(0, 62, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M1")+" "+amt);
    this.grdList.setheadertext(0, 63, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M2")+" "+amt);
    this.grdList.setheadertext(0, 64, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M3")+" "+amt);
    this.grdList.setheadertext(0, 65, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M4")+" "+amt);
    this.grdList.setheadertext(0, 66, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M5")+" "+amt);
    this.grdList.setheadertext(0, 67, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M6")+" "+amt);
    this.grdList.setheadertext(0, 68, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M7")+" "+amt);
    this.grdList.setheadertext(0, 69, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M8")+" "+amt);
    this.grdList.setheadertext(0, 70, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M9")+" "+amt);
    this.grdList.setheadertext(0, 71, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M10")+" "+amt);
    this.grdList.setheadertext(0, 72, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M11")+" "+amt);
    this.grdList.setheadertext(0, 73, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M12")+" "+amt);
    this.grdList.setheadertext(0, 74, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y1")+" "+amt);
    this.grdList.setheadertext(0, 75, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y2")+" "+amt);
    this.grdList.setheadertext(0, 76, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y3")+" "+amt);
    this.grdList.setheadertext(0, 77, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y4")+" "+amt);
    this.grdList.setheadertext(0, 78, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y5")+" "+amt);
    this.grdList.setheadertext(0, 79, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y6")+" "+amt);
    this.grdList.setheadertext(0, 80, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y7")+" "+amt);
    this.grdList.setheadertext(0, 81, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y8")+" "+amt);
    this.grdList.setheadertext(0, 82, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y9")+" "+amt);
    this.grdList.setheadertext(0, 83, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y10")+" "+amt);
    this.grdList.setheadertext(0, 84, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y11")+" "+amt);
    this.grdList.setheadertext(0, 85, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y12")+" "+amt);
    this.grdList.setheadertext(0, 86, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y13")+" "+amt);
    this.grdList.setheadertext(0, 87, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y14")+" "+amt);

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
	
	if(recv_userheader == "insertAndselect")
	{

		this.fnUpload();
	}

	
	//upload
	if(recv_userheader == "SelectProc")
	{
       this.fnDsSearchSet();
       this.fnSetInitControl();
	   this.dsList.removeallrows();
	}		
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{

	var year = this.fldDateS.gettext();

	if (! year ) {
		UT.alert(this.screen, "MSG524", "기준년을 입력하세요"); 
		return; 
	}


	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");		
	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.SELECT_LONG_PLAN_UPLOAD_WIDTH" ,"dsSearch" , "dsList", "TR_SEARCH");	//조회만		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	//진행중이 보이려면 싱크 방식을 false로 해야됨. false , true , true 로 설정 
	// screen_on_submitcomplete 힘수에 UT.gfnWaitDestroy(screen); 코딩 들어 있는지 확인 
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , false , true , true , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
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
function fnSaveData(alertshow){

	//callback true => alert & 재검색
	if (UT.isNull(alertshow)){
		alertshow = true;
	}
    for(var i=0;i<this.dsList.getrowcount();i++){
	    var sRow = this.dsSearch.getpos();
		this.dsList.setdatabyname(i , "OU_CODE" , ouCode);
		this.dsList.setdatabyname(i , "PLAN_VERSION" , "-999");
		this.dsList.setdatabyname(i , "LATEST_YN" , "N");  
		this.dsList.setrowoperation(i, XFD_ROWOP_INSERT);
	//	UT.alert(this.screen,"", this.dsList.getdatabyname(i,"PROJECT_CODE"));
	}		
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_ALL");						//데이터셋 인:ALL 아웃:CLEAR 정의	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_ALL");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.INSERT_PLAN_UPLOAD" , "" , "", "dsList" );	// 추가 수정 삭제
	TRN.gfnCommonTransactionAddSave(this.screen , "OmsProjectMapper.INSERT_PLAN_HEADER_UPLOAD" , "" , "", "dsList" );	// 추가 수정 삭제	
	//추가후 재조회 실행						
	TRN.gfnCommonTransactionRun(this.screen , "insertAndselect" , true , alertshow , false , "TR_SAVE_ALL");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	// recv_userheader 값에 insertAndselect 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
		
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
	var day = UT.getDate();
	excel_file_name = "planDownload_"+day+".xlsx";
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
	this.dsList.removeallrows();
	this.fnSetTitle();		
}

function ComCustGroup_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "CUSTOMER_GROUP" , "");
	return 0;

}

function ComProductGroup_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "PRODUCT_GROUP_CODE" , "");	
	return 0;
}

function ComImportance_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "IMPORTANCE_CODE" , "");		
	return 0;
}

function btnUpload_on_mouseup(objInst)
{
	this.grdList.uploadexcelex(1, 1, 2, "A", 1,false);
}

function grdList_on_fileload(objInst, nResult, strCode, strMsg, strFileName, nLoadStartTime, nStartRowIndex, nEndRowIndex)
{
    //잘못된 데이터가 있는지 검토
    var errorYn = "N";
    //기준년도가 잘 못된 데이터가 있는지 검토 
    var count = this.dsList.getrowcount();
    for( var iRow = 0; iRow < count ; iRow++){	
	   //중장기계획을 전부 null로 만듦.
	   this.dsList.setdatabyname(iRow , "PLAN_VERSION" , "" ); 
	   //금액 값을 넣어 줌
	   //var price = this.dsList.getdatabyname( iRow,"M1_UNIT_PRICE");
	   //var qty  = this.dsList.getdatabyname( iRow,"M1_QTY");
	   //var amt = Number( price) * Number(qty);
	   this.dsList.setdatabyname(iRow , "M1_AMT" , this.dsList.getdatabyname( iRow,"M1_QTY") * this.dsList.getdatabyname( iRow,"M1_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M2_AMT" , this.dsList.getdatabyname( iRow,"M2_QTY") * this.dsList.getdatabyname( iRow,"M2_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M3_AMT" , this.dsList.getdatabyname( iRow,"M3_QTY") * this.dsList.getdatabyname( iRow,"M3_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M4_AMT" , this.dsList.getdatabyname( iRow,"M4_QTY") * this.dsList.getdatabyname( iRow,"M4_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M5_AMT" , this.dsList.getdatabyname( iRow,"M5_QTY") * this.dsList.getdatabyname( iRow,"M5_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M6_AMT" , this.dsList.getdatabyname( iRow,"M6_QTY") * this.dsList.getdatabyname( iRow,"M6_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M7_AMT" , this.dsList.getdatabyname( iRow,"M7_QTY") * this.dsList.getdatabyname( iRow,"M7_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M8_AMT" , this.dsList.getdatabyname( iRow,"M8_QTY") * this.dsList.getdatabyname( iRow,"M8_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M9_AMT" , this.dsList.getdatabyname( iRow,"M9_QTY") * this.dsList.getdatabyname( iRow,"M9_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M10_AMT" , this.dsList.getdatabyname( iRow,"M10_QTY") * this.dsList.getdatabyname( iRow,"M10_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M11_AMT" , this.dsList.getdatabyname( iRow,"M11_QTY") * this.dsList.getdatabyname( iRow,"M11_UNIT_PRICE") ); 
	   this.dsList.setdatabyname(iRow , "M12_AMT" , this.dsList.getdatabyname( iRow,"M12_QTY") * this.dsList.getdatabyname( iRow,"M12_UNIT_PRICE") );
	   this.dsList.setdatabyname(iRow , "Y1_AMT" , this.dsList.getdatabyname( iRow,"Y1_QTY") * this.dsList.getdatabyname( iRow,"Y1_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y2_AMT" , this.dsList.getdatabyname( iRow,"Y2_QTY") * this.dsList.getdatabyname( iRow,"Y2_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y3_AMT" , this.dsList.getdatabyname( iRow,"Y3_QTY") * this.dsList.getdatabyname( iRow,"Y3_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y4_AMT" , this.dsList.getdatabyname( iRow,"Y4_QTY") * this.dsList.getdatabyname( iRow,"Y4_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y5_AMT" , this.dsList.getdatabyname( iRow,"Y5_QTY") * this.dsList.getdatabyname( iRow,"Y5_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y6_AMT" , this.dsList.getdatabyname( iRow,"Y6_QTY") * this.dsList.getdatabyname( iRow,"Y6_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y7_AMT" , this.dsList.getdatabyname( iRow,"Y7_QTY") * this.dsList.getdatabyname( iRow,"Y7_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y8_AMT" , this.dsList.getdatabyname( iRow,"Y8_QTY") * this.dsList.getdatabyname( iRow,"Y8_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y9_AMT" , this.dsList.getdatabyname( iRow,"Y9_QTY") * this.dsList.getdatabyname( iRow,"Y9_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y10_AMT" , this.dsList.getdatabyname( iRow,"Y10_QTY") * this.dsList.getdatabyname( iRow,"Y10_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y11_AMT" , this.dsList.getdatabyname( iRow,"Y11_QTY") * this.dsList.getdatabyname( iRow,"Y11_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y12_AMT" , this.dsList.getdatabyname( iRow,"Y12_QTY") * this.dsList.getdatabyname( iRow,"Y12_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y13_AMT" , this.dsList.getdatabyname( iRow,"Y13_QTY") * this.dsList.getdatabyname( iRow,"Y13_UNIT_PRICE") );  
	   this.dsList.setdatabyname(iRow , "Y14_AMT" , this.dsList.getdatabyname( iRow,"Y14_QTY") * this.dsList.getdatabyname( iRow,"Y14_UNIT_PRICE") );  
       //기준년도가 잘 못된 데이터가 있는지 검토 
	   var sBaseYear = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"BASE_YEAR");
	   var baseYear = this.dsList.getdatabyname( iRow,"BASE_YEAR");
	   if ( sBaseYear != baseYear){
		   errorYn = "Y";
		  // UT.alert(this.screen , "" , "1"+iRow);
		   var errorMessage=UT.gfnGetMsgMetaData("MSG568", "기준년도가 상이합니다."); 
		   this.dsList.setdatabyname(iRow , "ERROR_MESSAGE" , errorMessage ); 
		   this.grdList.setitembackcolorrange(iRow,0,iRow,88, factory.rgb(225, 253, 160));

	   }
	   //계획년월 검증
	 /*  var planYyyymm = this.dsList.getdatabyname( iRow,"PLAN_YYYYMM");
	   var planYear = planYyyymm.substring(0,4);
	   var planYyyymmCnt = planYyyymm.length;
	   if( sBaseYear > planYear || planYyyymmCnt < 6){
	   	errorYn = "Y";
		   //UT.alert(this.screen , "" , "2"+iRow);
		   var errorMessage=UT.gfnGetMsgMetaData("MSG571", "계획년월이 잘못입력되었습니다."); 
		   this.dsList.setdatabyname(iRow , "ERROR_MESSAGE" , errorMessage ); 
		   this.grdList.setitembackcolorrange(iRow,0,iRow,15, factory.rgb(225, 253, 160));
	   }*/
	  //통화 검증
	  var currencyCode = this.dsList.getdatabyname( iRow,"CURRENCY_CODE");
	  //UT.alert(this.screen , "" , "currencyCode:"+currencyCode);
	  var rowNum = UT.gfnFindRow(this.dsCurrency , "CODE" , currencyCode );
	  //UT.alert(this.screen , "" , "rowNum:"+rowNum);
	  if (rowNum == -1 ){
		   errorYn = "Y";
		   var errorMessage=UT.gfnGetMsgMetaData("MSG601", "통화 코드가 잘못 입력되었습니다."); 
		   this.dsList.setdatabyname(iRow , "ERROR_MESSAGE" , errorMessage ); 
		   this.grdList.setitembackcolorrange(iRow,0,iRow,88, factory.rgb(225, 253, 160));		
	  }
	
	  //Product ID ,incotermsCode 검증	
	  var projectProductId = this.dsList.getdatabyname( iRow,"PROJECT_PRODUCT_ID");
	  var projectCode = this.dsList.getdatabyname( iRow,"PROJECT_CODE");
	  var incotermsCode = this.dsList.getdatabyname( iRow,"INCOTERMS_CODE");
	
	  var param = "OU_CODE=" + ouCode;
	  param = param + " PROJECT_PRODUCT_ID=" + projectProductId;	
	  param = param + " PROJECT_CODE=" + projectCode.replaceAll(' ','^');
	  param = param + " INCOTERMS_CODE=" + incotermsCode;		
      param = param + " RETCODE="  + "" ;
      param = param + " RETMESG=" + ""; 	  		  		
	  TRN.gfnTranDataSetHandle(this.screen , this.dsProcResult , "NONE" , "CLEAR" ,  "" , "" , "TR_VALIDATE");
	  TRN.gfnCommonTransactionClear(this.screen, "TR_VALIDATE");	//트랜젝션 데이터셋 초기화 (필수)	
	  TRN.gfnCommonTransactionAddSearch(this.screen , "OmsProjectMapper.UPLOAD_VALIDATION_PROC" ,"" , "dsProcResult",param);	//조회만	
	  // screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	  TRN.gfnCommonTransactionRun(this.screen , "SelectProc" , true , false , false , "TR_VALIDATE");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	  var retcode = this.dsProcResult.getdatabyname(this.dsProcResult.getpos() ,"RETCODE");
		if( retcode != "S"){
	   	errorYn = "Y";
			if( !retcode.includes("MSG") ){
		       UT.alert(this.screen , "MSG545" , "Error : " +this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG"), this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG")); 
		    }else{
		       var errorMessage=UT.gfnGetMsgMetaData(retcode, ""); 
			  // UT.alert(this.screen , retcode ,errorMessage);
		       this.dsList.setdatabyname(iRow , "ERROR_MESSAGE" , errorMessage ); 
		       this.grdList.setitembackcolorrange(iRow,0,iRow,88, factory.rgb(225, 253, 160));
			}	    
		}

	}
	if (errorYn == "Y" ){
		UT.alert(this.screen , "MSG569" , "데이터의 오류로 저장할 수 없습니다. 오류를 확인하세요.");
		this.btnCommonSave.setenable(false);
	}else{
		this.btnCommonSave.setenable(true);	
	    UT.alert(this.screen , "MSG567" , "저장을 버튼을 클릭 후 Upload 반영됩니다.");
    }	
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
	var aryDual = [ "BASE_YEAR","INCOTERMS_CODE","PROJECT_CODE","PROJECT_PRODUCT_ID","CURRENCY_CODE"];
    if(!UT.gfnVaildataionGrd(this.screen,this.grdList, aryDual, false))
	{
		return false;
	}
	
	return true;
}

function fnUpload()
{
	//기준년도 필수 입력 Check
	var baseYear = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"BASE_YEAR");
	if( UT.isNull(baseYear)){
		var label = UT.gfnGetMetaData("LABEL01802", "*기준년도");
		UT.alert(this.screen , "MSG004" , label+"는 필수입력항목입니다.",label );
		return;		
	}
	//upload

	var baseYear = this.dsSearch.getdatabyname( this.dsSearch.getpos(),"BASE_YEAR") ;

    var vParam =  "USER_ID=" + INI.GV_USER_ID ;
    vParam = vParam + " OU_CODE=" + ouCode ;
    vParam = vParam + " BASE_YEAR=" + baseYear;
    vParam = vParam + " RETCODE="  + "" ;
    vParam = vParam + " RETMESG=" + ""; 
    
    TRN.gfnTranDataSetHandle(this.screen, this.dsProcResult, "", "", "", "", "TR_UPLOAD");
    TRN.gfnCommonTransactionClear(this.screen,"TR_UPLOAD");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"OmsProjectMapper.UPLOAD_LONG_PLAN_WIDTH_PROC" ,"","dsProcResult",vParam);
	// 프로시져를 Call할 때는 반드시 SelectProc여야 함.
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false,"TR_UPLOAD");
    var mesCode = this.dsProcResult.getdatabyname(this.dsProcResult.getpos() ,"RETCODE");
	if( mesCode != "S"){		 
	    UT.alert(this.screen , mesCode , "Error : " +this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG"), this.dsProcResult.getdatabyname(this.dsProcResult.getpos(), "RETMESG")); 
	    return;
	}else{
	   UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
	   UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");		
	}	
}