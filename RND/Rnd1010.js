/*------------------------------------
* program id : Rnd1010 
* desc	   : 연구원 시간 관리
* dev date   : 2024-04-12
* made by    : HS IT Team
*-------------------------------------*/
var fvPrevColId ;
var editMode;//POPUP에 의해 수정되는지 확인 
var editModeDept;//POPUP에 의해 수정되는지 확인 
var fvSelectedRow;	//그리드 선택된 row
var fvauthScope;
var fvnColumn = 0 ;
var objPopupExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	P_DATA6: "",	      	// 팝업화면으로 전달할 데이터6
	P_DATA7: "",	      	// 팝업화면으로 전달할 데이터7
	P_DATA8: "",	      	// 팝업화면으로 전달할 데이터8	
	P_DATA9: "",	      	// 팝업화면으로 전달할 데이터9		
	P_DATA10: "",	         // 팝업화면으로 전달할 데이터10		
	P_DATA11: "",	         // 팝업화면으로 전달할 데이터11		
	P_DATA12: "",	         // 팝업화면으로 전달할 데이터12	
	P_DATA13: "",	         // 팝업화면으로 전달할 데이터13	
	P_DATA14: "",	         // 팝업화면으로 전달할 데이터14	
	P_DATA15: "",	         // 팝업화면으로 전달할 데이터15
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};

var menuId ;
var menuName = "";

/*
* 페이지 온로드
*/
function screen_on_load()
{	
    INI.init(this.screen);  // 모든 폼 Onload 최초 공통
    this.fnEmpInfoLoad();   // 직원 추가 정보 가져오기	
	this.fnDsSearchSet();   //검색조건 세팅	
	//this.fnSearch();  //조회	
}

function fnEmpInfoLoad(){
    TRN.gfnTranDataSetHandle(this.screen, this.dsEmpInfo, "ALL", "CLEAR", "", "", "TR_EMP_INFO");
	TRN.gfnCommonTransactionClear(this.screen , "TR_EMP_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_EMP_INFO" , "" , "dsEmpInfo" , "");	//로그를 추가합니다
		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "empInfo" , true , false , false , "TR_EMP_INFO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	
	if(this.dsEmpInfo.getrowcount() == 0){
		UT.alert(this.screen , "" , "임직원 정보가 존재하지 않습니다." + "\n\n" + "확인 바랍니다.");
		return;
	}
	else{
		var iRow = this.dsEmpInfo.getpos();
		INI.GV_EMP_NAME = this.dsEmpInfo.getdatabyname(iRow , "EMP_NAME");
		INI.GV_DEPT_CODE = this.dsEmpInfo.getdatabyname(iRow, "DEPT_CODE");
		INI.GV_DEPT_NAME = this.dsEmpInfo.getdatabyname(iRow , "DEPT_NAME");
		INI.GV_JIKJONG_CODE = this.dsEmpInfo.getdatabyname(iRow , "JIKJONG_CODE");
		INI.GV_JIKWI_CODE = this.dsEmpInfo.getdatabyname(iRow , "JIKWI_CODE");
		INI.GV_JIKWI_NAME = this.dsEmpInfo.getdatabyname(iRow , "JIKWI_NAME");
		INI.GV_JIKCHAK_CODE = this.dsEmpInfo.getdatabyname(iRow , "JIKCHAK_CODE");
	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
    //법인 데이터셋 설정 
	UT.gfnGetOuCodes(this.dsOU); // 데이터 셋에 해당 접속자의 권한 체크하여 해당 법인 모두 들고오기
    
    // 캘린더 검색 조건 초기값 설정 
    this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	this.dsSearch.setdatabyname(iRow, "OU_CODE", INI.GV_OU_CODE);
	this.dsSearch.setdatabyname(iRow, "WORK_YYYYMM", UT.getDate("%Y%M"));
	this.dsSearch.setdatabyname(iRow, "DEPT_CODE", "");
	this.dsSearch.setdatabyname(iRow, "DEPT_NAME", "");
		
	var vYyyyMm = this.edsWorkYyyyMm.gettext() ;
	this.grdCalendar.setheadertext(0, 0, vYyyyMm.substr(0,4) + "-" + vYyyyMm.substr(4,2)); 
	
    // 법인 변경 권한 적용
	if(INI.GV_AT_OU == "Y"){
		this.comOu.setenable(true);
    }		
	else{
		this.comOu.setenable(false);
	}

    menuId = INI.gfnGetMdiMenuId(this.screen)  ;
    menuName = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , menuId , "MENU_NM");

	if(menuName=="연구원 시간 조회"){
		fvauthScope = "DEPT";
		this.btnNew.setvisible(false);
		this.btnCopy.setvisible(false);
		this.btnView.setvisible(false);
		
		this.titleDeptName.setvisible(true);
		this.edsDeptName.setenable(true);
		this.edsDeptName.setvisible(true);
		this.btnDeptPop.setvisible(true);		    
		//this.fldEmpName.setenable(false);
		//this.fldEmpNo.setenable(false);
		this.btnEmpPop.setvisible(true);
		
		
		this.dsSearch.setdatabyname(iRow, "EMP_NAME", "");
		this.dsSearch.setdatabyname(iRow, "EMP_NO", "");
		this.dsSearch.setdatabyname(iRow, "DEPT_EMP_NO", INI.GV_EMP_NO);
		this.dsSearch.setdatabyname(iRow, "AUTH_CODE", fvauthScope);
	}
	else{
		fvauthScope = "PERSONAL";
		this.btnNew.setvisible(true);
		this.btnCopy.setvisible(true);
		this.btnView.setvisible(true);
		
		this.titleDeptName.setvisible(false);
		this.edsDeptName.setenable(false);
		this.edsDeptName.setvisible(false);
		//this.fldEmpName.setenable(false);
		//this.fldEmpNo.setenable(false);
		this.btnDeptPop.setvisible(false);
		this.btnEmpPop.setvisible(false);
		
		this.dsSearch.setdatabyname(iRow, "EMP_NAME", INI.GV_EMP_NAME);
		this.dsSearch.setdatabyname(iRow, "EMP_NO", INI.GV_EMP_NO);
		this.dsSearch.setdatabyname(iRow, "DEPT_EMP_NO", INI.GV_EMP_NO);
		this.dsSearch.setdatabyname(iRow, "AUTH_CODE", fvauthScope);
	}
}

function fnDsDetailSearchSet(dClickDate){
    // 상세내역 검색 조건 초기값 설정 
    this.dsDetailSearch.removeallrows();
	var iRow = this.dsDetailSearch.getrowcount();
	this.dsDetailSearch.insertrow(iRow);
	this.dsDetailSearch.setdatabyname(iRow, "OU_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "OU_CODE"));
	this.dsDetailSearch.setdatabyname(iRow, "WORK_YYYYMMDD", dClickDate);
	this.dsDetailSearch.setdatabyname(iRow, "DEPT_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "DEPT_CODE"));
	this.dsDetailSearch.setdatabyname(iRow, "EMP_NO", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "EMP_NO"));
	this.dsDetailSearch.setdatabyname(iRow, "WORK_YYYYMM", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "WORK_YYYYMM"));
	this.dsDetailSearch.setdatabyname(iRow, "DEPT_EMP_NO", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "DEPT_EMP_NO"));
	this.dsDetailSearch.setdatabyname(iRow, "AUTH_CODE", this.dsSearch.getdatabyname(this.dsSearch.getpos(), "AUTH_CODE"));
}

/*
* 공통 조회버튼 클릭시
* 조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
    if(this.edsWorkYyyyMm.gettext()==""){
	    UT.alert(this.screen,"","조회조건의 근무년월을 선택하세요!");
	    return;	
    }
    
    if(this.fldEmpName.gettext()==""){
	    UT.alert(this.screen,"","조회조건의 연구원을 선택하세요!");
	    return;	
    }

    this.fnSearch();
    this.fnDetailSearch("Q");
}

/*
*   캘린더 조회 
*/
function fnSearch()
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsWorkCal, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsWcDate, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsWcHoliday, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_RND_WORK_CALENDAR" ,"dsSearch" , "dsWorkCal");	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_RND_WC_DATE" ,"dsSearch" , "dsWcDate");	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_RND_WC_HOLIDAY" ,"dsSearch" , "dsWcHoliday");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "search" , true , true , false , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
*   상세내역 조회 
*/
function fnDetailSearch(search_type)
{
	// 다시 조회 버튼을 누를 시 상세 그리드의 기준을 현재일자로 셋팅
	if(search_type=='Q'){
		var sysDate = UT.getDate("%Y%M%D");
		var defaultDate = this.edsWorkYyyyMm.gettext() + sysDate.substr(6,2) ;
		this.fnDsDetailSearchSet(defaultDate);
    }

	TRN.gfnTranDataSetHandle(this.screen , this.dsDetailSearch , "ALL" , "NONE" ,  "" , "" , "TR_DETAIL_SERACH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList, "NONE" , "CLEAR" ,  "" , "" , "TR_DETAIL_SERACH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_DETAIL_SERACH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_RND_WORK_DETAIL" ,"dsDetailSearch" , "dsList");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "search" , true , true , false , "TR_DETAIL_SERACH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
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
	
	if(mapid == 'TR_SEARCH'){		
		if(this.dsWorkCal.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "시간관리를 위한 캘린더의 검색 결과가 없습니다.");	//경고창 처리
			return;
		}
		
		// 조회조건 근무년월 변경 시 달력의 헤더 년월 변경함.
	    var vYyyyMm = this.edsWorkYyyyMm.gettext() ;
	    this.grdCalendar.setheadertext(0, 0, vYyyyMm.substr(0,4) + "-" + vYyyyMm.substr(4,2)); 
		
		if(this.dsWorkCal.getrowcount() == 1){
		    this.dsWorkCal.deleteallrows();
		}
		else{ 
			// 월별 일수 체크, 공휴일 및 입력시간 글자 색상 제어
			var vDate ;
			for(var i=1;i<32;i++){
			    if(i<10){
			        vDate = "0" + i; 
			    }
			    else{
			        vDate = i;
			    }
			    		
			    //월별 일수 체크하여 감추기 
			    var vHeaderDate = this.dsWcDate.getdatabyname(0,"DD_"+vDate) ;
			    if(!vHeaderDate){
			        this.grdCalendar.setcolumnhidden(i,true);
			    }
			    else{
			        this.grdCalendar.setcolumnhidden(i,false);
			        
			        // 입력시간 글자색 제어 : 규정시간보다 입력시간이 작으면 빨간색, 같으면 검은색, 크면 파란색
			        this.grdCalendar_inputhour_forecolor(i,"DD_"+vDate);
			    }
			    
			    // 공휴알의 요일 색깔 빨간색으로, 평일은 검은색으로
			    if(this.dsWcHoliday.getdatabyname(0,"DD_"+vDate) == "Y"){
			        this.grdCalendar.setcolumnforecolor(i,factory.rgb(255,0,0));
			    }
			    else{
			        this.grdCalendar.setcolumnforecolor(i,factory.rgb(0,0,0));
			    }	
			}
			
			// 합계 입력시간 글자색 제어 : 규정시간보다 입력시간이 작으면 빨간색, 같으면 검은색, 크면 파란색
			this.grdCalendar_inputhour_forecolor(32,"ROW_TOTAL");
			
			// 그리시 조회 시 클릭일자 Highlight
			if(fvnColumn==0){
	            this.grdCalendar_highlight_column("Q",0);
	        }
	        else{
	            this.grdCalendar_highlight_column("C",fvnColumn);
	            fvnColumn = 0 ;
	        }
	    }
	    
	}	
	
	if(mapid == 'TR_DETAIL_SERACH'){ 
		if(this.dsList.getrowcount() > 0){
			UT.statMsg(screen , "MSG003" , "%% 건의 시간관리 상세데이터가 조회되었습니다." , this.dsList.getrowcount()); // 하단메시지 처리
			return;
		}
    }
}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}

function grdCalendar_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{ 
	// 그리시 클릭 시 클릭일자 Highlight
    this.grdCalendar_highlight_column("C",nClickColumn);
}

/*
입력시간 글자색 제어 : 규정시간보다 입력시간이 작으면 빨간색, 같으면 검은색, 크면 파란색
*/
function grdCalendar_inputhour_forecolor(nColumn,strColumn)
{
    var vReguralHour = parseFloat(this.dsWorkCal.getdatabyname(1,strColumn)) ;
    var vInputHour = parseFloat(this.dsWorkCal.getdatabyname(2,strColumn)) ;
    
    if(vReguralHour > vInputHour){
        this.grdCalendar.setitemforecolor(2,nColumn,factory.rgb(255,0,0));
    }
    else if(vReguralHour == vInputHour){
        this.grdCalendar.setitemforecolor(2,nColumn,factory.rgb(0,0,0));
    }
    else if(vReguralHour < vInputHour){
        this.grdCalendar.setitemforecolor(2,nColumn,factory.rgb(0,0,255));
    }
}

/*
조회 시 현재일자, 클릭 시 클릭일자를 Highlight하고 이전 Highlight일자를 원배경색으로 변경해주는 Function
클리 시 클릭일자의 상세내역을 그리드에 Display하는 Function
*/
function grdCalendar_highlight_column(strEvent,nCurrColumn)
{
    // 조회 시 현재일자 
    if(strEvent=="Q"){ 
        // 이전 Highlight 된 컬럼이 있으면 원배경색으로 변경
	    fvPrevColId = this.fldPrevColId.gettext();   
	    
	    if(fvPrevColId){        
	    	this.grdCalendar.setcolumnbackcolor(fvPrevColId,factory.rgb(247,251,255));
	    }
       
		var today = new Date();
		var vDD = today.getDate();
    }
    // 클릭 시 클릭일자 
    else if(strEvent=="C"){		
        var vColumnName = this.grdCalendar.getcolumnname(nCurrColumn);	

        if(vColumnName == "GUBUN" || vColumnName == "ROW_TOTAL"){
            return;
        }
        else{
            // 이전 Highlight 된 컬럼이 있으면 원배경색으로 변경
		    fvPrevColId = this.fldPrevColId.gettext();   
		    
		    if(fvPrevColId){        
		    	this.grdCalendar.setcolumnbackcolor(fvPrevColId,factory.rgb(247,251,255));
		    }
        }
	    var vDD = Number(this.dsWcDate.getdatabyname(0,vColumnName));	
	    
	    // 캘린더 클릭 시 해당일자의 상세 그리드 조회
	    if(vDD){
			var vClickDate = this.grdCalendar.getheadertext(0,0);
			var vYyyy = vClickDate.substr(0,4);
			var vMm = vClickDate.substr(5,2);
			var vYyyyMmDd = vYyyy + vMm + this.dsWcDate.getdatabyname(0,vColumnName) ;
									
			this.fnDsDetailSearchSet(vYyyyMmDd);			
			this.fnDetailSearch("C");	 
        }
    }    
    
    // Highlight
    this.grdCalendar.setcolumnbackcolor(vDD,factory.rgb(255,255,0));
	    
	// 이전일자 저장
	this.fldPrevColId.settext(vDD);	
}

/*
* 상세내역 버튼
*/
function btnView_on_mouseup(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "연구원 시간관리 상세내역"); 
	var nWorkID = this.dsList.getdatabyname(this.dsList.getpos(),"WORK_ID");
	if( UT.isNull(nWorkID)){
		UT.alert(this.screen , "" , "연구원 시간관리 상세내역을 선택하세요!");
		return;
	}	
	
	objPopupExtraData.P_DATA1 = this.dsList.getdatabyname(this.dsList.getpos(),"OU_CODE"); 
	objPopupExtraData.P_DATA2 = nWorkID;
	objPopupExtraData.P_DATA3 = "V";  //V:상세내역
	objPopupExtraData.P_DATA4 = INI.GV_USER_ID;  
	objPopupExtraData.P_DATA5 = this.dsList.getdatabyname(this.dsList.getpos(),"DEPT_CODE");
    objPopupExtraData.P_DATA6 = this.dsList.getdatabyname(this.dsList.getpos(),"DEPT_NAME");
	objPopupExtraData.P_DATA7 = this.dsList.getdatabyname(this.dsList.getpos(),"EMP_NO");
    objPopupExtraData.P_DATA8 = this.dsList.getdatabyname(this.dsList.getpos(),"EMP_NAME");
	objPopupExtraData.P_DATA9 = this.dsList.getdatabyname(this.dsList.getpos(),"JIKWI_CODE");
    objPopupExtraData.P_DATA10 = this.dsList.getdatabyname(this.dsList.getpos(),"JIKWI_NAME");
	objPopupExtraData.P_DATA11 = this.dsList.getdatabyname(this.dsList.getpos(),"JIKJONG_CODE");
    objPopupExtraData.P_DATA12 = fvauthScope;
    objPopupExtraData.P_DATA13 = "";
    objPopupExtraData.P_DATA14 = "";
    objPopupExtraData.P_DATA15 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnNewClosePopCallback";
	screen.loadportletpopup("View", "/RND/Rnd1011", "연구원시간관리상세내역", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);	
}

function fnNewClosePopCallback(aryHash) 
{ 
	// 설정했던 objPopupExtraData값 초기화
	objPopupExtraData.P_DATA1 = "";
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.P_DATA4 = "";
	objPopupExtraData.P_DATA5 = "";
	objPopupExtraData.P_DATA6 = "";
	objPopupExtraData.P_DATA7 = "";
	objPopupExtraData.P_DATA8 = "";
	objPopupExtraData.P_DATA9 = "";
	objPopupExtraData.P_DATA10 = "";
	objPopupExtraData.P_DATA11 = "";
	objPopupExtraData.P_DATA12 = "";
    objPopupExtraData.P_DATA13 = "";
    objPopupExtraData.P_DATA14 = "";
    objPopupExtraData.P_DATA15 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "";

    var workDate = aryHash["WORK_DATE"] ;
    
    // 변경후 저장 되지 않았거나 ,삭제 후 신규 입력이 없을 시 기존으로 복귀한다.  
    if(workDate!="99991231"){
		this.dsSearch.setdatabyname(this.dsSearch.getpos(), "WORK_YYYYMM", workDate.substr(0,6));
		this.dsDetailSearch.setdatabyname(this.dsDetailSearch.getpos(), "WORK_YYYYMMDD", workDate);		
		fvnColumn = Number(workDate.substr(6,2)) ;		
    }

    this.fnSearch();  //조회
}

/*
* 복사등록 버튼 클릭 시
*/
function btnCopy_on_mouseup(objInst)
{
	var nWorkId = this.dsList.getdatabyname(this.dsList.getpos(),"WORK_ID") ;
	
	if(UT.isNull(nWorkId)){
		UT.alert(this.screen, "", "복사대상인 시간관리 상세내역이 선택되지 않았습니다.");
		return;
	}
	
	var vParam = "";
    vParam = vParam + "O_WORKTYPE_FLAG="  + "" ;
    vParam = vParam + " O_DEVPHASE_FLAG=" + ""; 
    vParam = vParam + " O_WORKNAME_FLAG=" + ""; 
    vParam = vParam + " O_ERROR_MSG=" + ""; 
    vParam = vParam + " I_WORK_ID=" + nWorkId ;
    vParam = vParam + " I_ACTIVE_DATE=" + "" ;


    TRN.gfnTranDataSetHandle(this.screen, this.dsReturn, "", "", "", "", "TR_GET_COPY_COMBO_INFO");
    TRN.gfnCommonTransactionClear(this.screen,"TR_GET_COPY_COMBO_INFO");
    TRN.gfnCommonTransactionAddSearch(this.screen ,"RndWorkHourMapper.GET_COPY_COMBO_ENABLE_INFO" ,"","dsReturn",vParam);
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_GET_COPY_COMBO_INFO");  
    
    var errorMsg = this.dsReturn.getdatabyname(0,"O_ERROR_MSG") ;    
    if(errorMsg != 'S'){
	    UT.alert(this.screen, "", errorMsg );
	    return;
    }
    else{
	    var strPopupName = UT.gfnGetMetaData("", "연구원 시간관리 상세내역"); 
		
		objPopupExtraData.P_DATA1 = INI.GV_OU_CODE; 
		objPopupExtraData.P_DATA2 = nWorkId;
		objPopupExtraData.P_DATA3 = "C";  //C:복사등록
		objPopupExtraData.P_DATA4 = INI.GV_USER_ID;  
		objPopupExtraData.P_DATA5 = this.dsList.getdatabyname(this.dsList.getpos(),"DEPT_CODE");
	    objPopupExtraData.P_DATA6 = this.dsList.getdatabyname(this.dsList.getpos(),"DEPT_NAME");
		objPopupExtraData.P_DATA7 = this.dsList.getdatabyname(this.dsList.getpos(),"EMP_NO");
	    objPopupExtraData.P_DATA8 = this.dsList.getdatabyname(this.dsList.getpos(),"EMP_NAME");
		objPopupExtraData.P_DATA9 = this.dsList.getdatabyname(this.dsList.getpos(),"JIKWI_CODE");
	    objPopupExtraData.P_DATA10 = this.dsList.getdatabyname(this.dsList.getpos(),"JIKWI_NAME");
		objPopupExtraData.P_DATA11 = this.dsList.getdatabyname(this.dsList.getpos(),"JIKJONG_CODE");
	    objPopupExtraData.P_DATA12 = fvauthScope;
	    objPopupExtraData.P_DATA13 = this.dsReturn.getdatabyname(this.dsReturn.getpos(),"O_WORKTYPE_FLAG");
	    objPopupExtraData.P_DATA14 = this.dsReturn.getdatabyname(this.dsReturn.getpos(),"O_DEVPHASE_FLAG");
	    objPopupExtraData.P_DATA15 = this.dsReturn.getdatabyname(this.dsReturn.getpos(),"O_WORKNAME_FLAG");
		objPopupExtraData.RETURN_FUNCTION_NAME = "fnNewClosePopCallback";
		screen.loadportletpopup("Copy", "/RND/Rnd1011", "연구원시간관리상세내역", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);	
    }
}

/*
* 신규등록 버튼 클릭 시
*/
function btnNew_on_mouseup(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "연구원 시간관리 상세내역"); 
		
	objPopupExtraData.P_DATA1 = INI.GV_OU_CODE; 
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = "N";  //N:신규등록
	objPopupExtraData.P_DATA4 = INI.GV_USER_ID;  
	objPopupExtraData.P_DATA5 = INI.GV_DEPT_CODE;
    objPopupExtraData.P_DATA6 = INI.GV_DEPT_NAME;
	objPopupExtraData.P_DATA7 = INI.GV_EMP_NO;
    objPopupExtraData.P_DATA8 = INI.GV_EMP_NAME;
	objPopupExtraData.P_DATA9 = INI.GV_JIKWI_CODE;
    objPopupExtraData.P_DATA10 = INI.GV_JIKWI_NAME;
	objPopupExtraData.P_DATA11 = INI.GV_JIKJONG_CODE;
    objPopupExtraData.P_DATA12 = fvauthScope;
    objPopupExtraData.P_DATA13 = this.dsReturn.getdatabyname(this.dsReturn.getpos(),"O_WORKTYPE_FLAG");
    objPopupExtraData.P_DATA14 = this.dsReturn.getdatabyname(this.dsReturn.getpos(),"O_DEVPHASE_FLAG");
    objPopupExtraData.P_DATA15 = this.dsReturn.getdatabyname(this.dsReturn.getpos(),"O_WORKNAME_FLAG");
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnNewClosePopCallback";
	screen.loadportletpopup("New", "/RND/Rnd1011", "연구원시간관리상세내역", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);	
}

/*
* 부서 팝업 클릭 시
*/
function btnDeptPop_on_click(objInst)
{
	if(this.edsWorkYyyyMm.gettext()==""){
	    UT.alert(this.screen,"","조회조건의 근무년월을 선택하세요!");
	    return;	
    }
	
	var strPopupName = UT.gfnGetMetaData("", "부서정보 조회"); 
		
	objPopupExtraData.P_DATA1 = INI.GV_OU_CODE; 
	objPopupExtraData.P_DATA2 = this.edsWorkYyyyMm.gettext();
	objPopupExtraData.P_DATA3 = fvauthScope;  
	objPopupExtraData.P_DATA4 = INI.GV_USER_ID;  
	objPopupExtraData.P_DATA5 = INI.GV_DEPT_CODE;
    objPopupExtraData.P_DATA6 = INI.GV_DEPT_NAME;
	objPopupExtraData.P_DATA7 = INI.GV_EMP_NO;
    objPopupExtraData.P_DATA8 = INI.GV_EMP_NAME;
	objPopupExtraData.P_DATA9 = INI.GV_JIKWI_CODE;
    objPopupExtraData.P_DATA10 = INI.GV_JIKWI_NAME;
	objPopupExtraData.P_DATA11 = INI.GV_JIKJONG_CODE;
    objPopupExtraData.P_DATA12 = INI.GV_JIKCHAK_CODE;
    objPopupExtraData.P_DATA13 = "";
    objPopupExtraData.P_DATA14 = "";
    objPopupExtraData.P_DATA15 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnDeptClosePopCallback";
	screen.loadportletpopup("PopupDept", "/RND/Rnd1014", "부서정보조회", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);	
}

function fnDeptClosePopCallback(aryHash) 
{ 
	// 설정했던 objPopupExtraData값 초기화
	objPopupExtraData.P_DATA1 = "";
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.P_DATA4 = "";
	objPopupExtraData.P_DATA5 = "";
	objPopupExtraData.P_DATA6 = "";
	objPopupExtraData.P_DATA7 = "";
	objPopupExtraData.P_DATA8 = "";
	objPopupExtraData.P_DATA9 = "";
	objPopupExtraData.P_DATA10 = "";
	objPopupExtraData.P_DATA11 = "";
	objPopupExtraData.P_DATA12 = "";
    objPopupExtraData.P_DATA13 = "";
    objPopupExtraData.P_DATA14 = "";
    objPopupExtraData.P_DATA15 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "";

    var deptCode = aryHash["DEPT_CODE"] ;
    var deptName = aryHash["DEPT_NAME"] ;
    
    // 변경후 저장 되지 않았거나 ,삭제 후 신규 입력이 없을 시 기존으로 복귀한다.  
    if(deptCode!=""){
		this.dsSearch.setdatabyname(this.dsSearch.getpos(), "DEPT_CODE", deptCode);	
		this.dsSearch.setdatabyname(this.dsSearch.getpos(), "DEPT_NAME", deptName);	
    }
}

/*
* 부서 변경 시 연구원 조회조건 지우기
*/
function edsDeptName_on_changed(objInst, prev_text, curr_text, event_type)
{
	if(menuName=="연구원 시간 조회"){
		if(this.edsDeptName.gettext()==""){
			this.edsDeptName.settext("");
	    	this.fldDeptCode.settext("");
		    this.fldEmpName.settext("");
		    this.fldEmpNo.settext("");
		}
	    else{
	        if(prev_text!="" && prev_text!=curr_text){
		        UT.alert(this.screen,"","부서명이 불명확하니 다시 선택하거나 연구원을 선택하세요!");
		        		        
				this.edsDeptName.settext("");
		    	this.fldDeptCode.settext("");
			    this.fldEmpName.settext("");
			    this.fldEmpNo.settext("");
		
		        return;
	        }
        }
	}
}

/*
* 근무월 변경 시 부서, 연구원 조회조건 지우기
*/
function edsWorkYyyyMm_on_changed(objInst, prev_text, curr_text, event_type)
{
	if(menuName=="연구원 시간 조회"){
		if(prev_text!=curr_text){
			this.edsDeptName.settext("");
	    	this.fldDeptCode.settext("");
		    this.fldEmpName.settext("");
		    this.fldEmpNo.settext("");
		}
	}
}

/*
* 연구원 팝업 클릭 시
*/
function btnEmpPop_on_click(objInst)
{
	if(this.edsWorkYyyyMm.gettext()==""){
	    UT.alert(this.screen,"","조회조건의 근무년월을 선택하세요!");
	    return;	
    }
	
	var strPopupName = UT.gfnGetMetaData("", "연구원정보 조회"); 
		
	objPopupExtraData.P_DATA1 = INI.GV_OU_CODE; 
	objPopupExtraData.P_DATA2 = this.edsWorkYyyyMm.gettext();
	objPopupExtraData.P_DATA3 = fvauthScope;  
	objPopupExtraData.P_DATA4 = INI.GV_USER_ID;  
	objPopupExtraData.P_DATA5 = this.fldDeptCode.gettext();
    objPopupExtraData.P_DATA6 = this.edsDeptName.gettext();
	objPopupExtraData.P_DATA7 = INI.GV_EMP_NO;
    objPopupExtraData.P_DATA8 = INI.GV_EMP_NAME;
	objPopupExtraData.P_DATA9 = INI.GV_JIKWI_CODE;
    objPopupExtraData.P_DATA10 = INI.GV_JIKWI_NAME;
	objPopupExtraData.P_DATA11 = INI.GV_JIKJONG_CODE;
    objPopupExtraData.P_DATA12 = INI.GV_JIKCHAK_CODE;
    objPopupExtraData.P_DATA13 = "";
    objPopupExtraData.P_DATA14 = "";
    objPopupExtraData.P_DATA15 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnEmpClosePopCallback";
	screen.loadportletpopup("PopupEmp", "/RND/Rnd1015", "연구원정보조회", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);	
}

function fnEmpClosePopCallback(aryHash) 
{ 
	// 설정했던 objPopupExtraData값 초기화
	objPopupExtraData.P_DATA1 = "";
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.P_DATA4 = "";
	objPopupExtraData.P_DATA5 = "";
	objPopupExtraData.P_DATA6 = "";
	objPopupExtraData.P_DATA7 = "";
	objPopupExtraData.P_DATA8 = "";
	objPopupExtraData.P_DATA9 = "";
	objPopupExtraData.P_DATA10 = "";
	objPopupExtraData.P_DATA11 = "";
	objPopupExtraData.P_DATA12 = "";
    objPopupExtraData.P_DATA13 = "";
    objPopupExtraData.P_DATA14 = "";
    objPopupExtraData.P_DATA15 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "";

    var empCode = aryHash["EMP_NO"] ;
    var empName = aryHash["EMP_NAME"] ;
    
    // 변경후 저장 되지 않았거나 ,삭제 후 신규 입력이 없을 시 기존으로 복귀한다.  
    if(empCode!=""){
		this.dsSearch.setdatabyname(this.dsSearch.getpos(), "EMP_NO", empCode);	
		this.dsSearch.setdatabyname(this.dsSearch.getpos(), "EMP_NAME", empName);	
    }
}