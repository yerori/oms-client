/*------------------------------------
* program id : Rnd1040 
* desc	   : 연구원 시간 다운로드
* dev date   : 2024-05-20
* made by    : HS IT Team
*-------------------------------------*/
var editMode;//POPUP에 의해 수정되는지 확인 
var editModeDept;//POPUP에 의해 수정되는지 확인 
var fvSelectedRow;	//그리드 선택된 row
var fvauthScope;
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
    this.dsDetailSearch.removeallrows();
	var iRow = this.dsDetailSearch.getrowcount();
	this.dsDetailSearch.insertrow(iRow);
	this.dsDetailSearch.setdatabyname(iRow, "OU_CODE", INI.GV_OU_CODE);
	this.dsDetailSearch.setdatabyname(iRow, "WORK_YYYYMM", UT.getDate("%Y%M"));
	this.dsDetailSearch.setdatabyname(iRow, "DEPT_CODE", "");
	this.dsDetailSearch.setdatabyname(iRow, "DEPT_NAME", "");
	this.dsDetailSearch.setdatabyname(iRow, "EMP_NO", "");
	this.dsDetailSearch.setdatabyname(iRow, "EMP_NAME", "");
	
    // 법인 변경 권한 적용
	if(INI.GV_AT_OU == "Y"){
		this.comOu.setenable(true);
    }		
	else{
		this.comOu.setenable(false);
	}

    menuId = INI.gfnGetMdiMenuId(this.screen)  ;
    menuName = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , menuId , "MENU_NM");
    
    // 전체를 조회하고자 하는 권한은 메뉴명을 다르게 생성해서 처리함.
    if(menuName!="연구원 시간 다운로드"){ 
	    fvauthScope = "ALL";		
		this.titleDeptName.setvisible(true);
		this.edsDeptName.setenable(true);
		this.edsDeptName.setvisible(true);
		this.btnDeptPop.setvisible(true);	
		this.btnEmpPop.setvisible(true);
		
		
		this.dsDetailSearch.setdatabyname(iRow, "EMP_NAME", "");
		this.dsDetailSearch.setdatabyname(iRow, "EMP_NO", "");
		this.dsDetailSearch.setdatabyname(iRow, "DEPT_EMP_NO", INI.GV_EMP_NO);
		this.dsDetailSearch.setdatabyname(iRow, "AUTH_CODE", fvauthScope);
    }
    else{
	    if(INI.GV_JIKCHAK_CODE=="" || INI.GV_JIKCHAK_CODE=="99"){
			fvauthScope = "PERSONAL";		
			this.titleDeptName.setvisible(false);
			this.edsDeptName.setenable(false);
			this.edsDeptName.setvisible(false);
			this.btnDeptPop.setvisible(false);
			this.btnEmpPop.setvisible(false);
			
			this.dsDetailSearch.setdatabyname(iRow, "EMP_NAME", INI.GV_EMP_NAME);
			this.dsDetailSearch.setdatabyname(iRow, "EMP_NO", INI.GV_EMP_NO);
			this.dsDetailSearch.setdatabyname(iRow, "DEPT_EMP_NO", INI.GV_EMP_NO);
			this.dsDetailSearch.setdatabyname(iRow, "AUTH_CODE", fvauthScope);
			
		}
		else{
			fvauthScope = "DEPT";		
			this.titleDeptName.setvisible(true);
			this.edsDeptName.setenable(true);
			this.edsDeptName.setvisible(true);
			this.btnDeptPop.setvisible(true);	
			this.btnEmpPop.setvisible(true);
			
			
			this.dsDetailSearch.setdatabyname(iRow, "EMP_NAME", "");
			this.dsDetailSearch.setdatabyname(iRow, "EMP_NO", "");
			this.dsDetailSearch.setdatabyname(iRow, "DEPT_EMP_NO", INI.GV_EMP_NO);
			this.dsDetailSearch.setdatabyname(iRow, "AUTH_CODE", fvauthScope);
		}
    }
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
    
    if(fvauthScope != "PERSONAL"){
	    if(this.edsDeptName.gettext()==""){
		    UT.alert(this.screen,"","조회조건의 부서를 선택하세요!");
		    return;	
	    }
    }

    this.fnDetailSearch();
}

/*
*   상세내역 조회 
*/
function fnDetailSearch()
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsDetailSearch , "ALL" , "NONE" ,  "" , "" , "TR_DETAIL_SERACH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList, "NONE" , "CLEAR" ,  "" , "" , "TR_DETAIL_SERACH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_DETAIL_SERACH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMgtMapper.SELECT_DW_WORK_DETAIL" ,"dsDetailSearch" , "dsList");	//조회만
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
		this.dsDetailSearch.setdatabyname(this.dsDetailSearch.getpos(), "DEPT_CODE", deptCode);	
		this.dsDetailSearch.setdatabyname(this.dsDetailSearch.getpos(), "DEPT_NAME", deptName);	
    }
}

/*
* 부서 변경 시 연구원 조회조건 지우기
*/
function edsDeptName_on_changed(objInst, prev_text, curr_text, event_type)
{
	if(fvauthScope=="ALL" || fvauthScope=="DEPT" ){
		if(prev_text!=curr_text){
			this.fldEmpName.settext("");
		    this.fldEmpNo.settext("");
		}
	}
}

/*
* 근무월 변경 시 부서, 연구원 조회조건 지우기
*/
function edsWorkYyyyMm_on_changed(objInst, prev_text, curr_text, event_type)
{
	if(fvauthScope=="ALL" || fvauthScope=="DEPT" ){
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

    if(this.edsDeptName.gettext()==""){
	    UT.alert(this.screen,"","조회조건의 부서를 선택하세요!");
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
		this.dsDetailSearch.setdatabyname(this.dsDetailSearch.getpos(), "EMP_NO", empCode);	
		this.dsDetailSearch.setdatabyname(this.dsDetailSearch.getpos(), "EMP_NAME", empName);	
    }
}