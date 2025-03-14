/*------------------------------------
* program id : Oms1140
* desc	   : RFQ 담당자 정보 이력 조회
* dev date   : 2024-12-16
* made by    : YELEE
*-------------------------------------*/
var ouCode;
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

/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅	
	this.fnDsSet();              // DATASET 세팅
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
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
	    } else{
        	authScope = "PINFO";
        }  
   }
    UT.gfnHrEditorStyle(this.comOu, "D");	
	UT.gfnHrEditorStyle(this.rbPrev, "D");	
	UT.gfnHrEditorStyle(this.rbCur, "D");	
	this.rbPrev.setcheck(true);
	
	if(INI.GV_LGI_ID == "admin" && INI.GV_USER_ID == 1) {
		this.txtChargeUserId.setvisible(true);
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
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		this.fnSearch();
	}
}

// 담당자 이름 유효한지 체크
function checkInvalidChargeUser() {
	var chargeUserId = this.dsSearch.getdatabyname(0, "CHARGE_USER_ID");
	
	// USER ID가 음수라면, null을 의미
	var isNotValidUserId = chargeUserId < 0;
	
	return isNotValidUserId;
}

function fnInvalidSearch() {
	// 조회 시 반드시 한 항목 이상은 입력되어야 하는 컬럼명들
	var aryDual = [ "RFQ_CODE", "CHARGE_USER_NAME", "RFQ_DATE"];
	var aryCnt = aryDual.length;
	var cnt = this.dsSearch.getcolumncount();
	
	var invalidIndex = 0;
	for(var i=0; i<aryCnt; i++) {
		var targetValue = this.dsSearch.getdatabyname(0, aryDual[i]);
		if(!targetValue) {
			invalidIndex++;
		}
	}
	
	// 필수 항목 모두가 null인지 체크하는 값 반환
	var isInvalid = aryCnt == invalidIndex;
	return isInvalid;
}


/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	var isInvalid = this.fnInvalidSearch();
	var isNotValidUserId = this.checkInvalidChargeUser();
	
	if(isInvalid) {
		UT.alert(this.screen , "MSG611" , "검색 항목은 한 개 이상 입력되어야 합니다.");
		return;
	}
	
	if(isNotValidUserId) {
		UT.alert(this.screen, "MSG613" , "담당자를 다시 입력해 주세요.");
		return;
	}
	
	this.fnSearch();
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



function fnSearch(){	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsRfqMapper.SELECT_RFQ_BY_CHARGE_USER_CHANGE" ,"dsSearch" , "dsList");
	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , true , true , false , "TR_SEARCH");
}



/*
* 기준일자
*/
function stdDate_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return;
}


/*
* RFQ 코드
*/
function edtRfqCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return;
}

/*
* RFQ 담당자 팝업
*/
function btnChargeUserPop_on_click(objInst, searchName)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02377", "RFQ response");
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA6 = authScope;
	objPopupExtraData.P_DATA7 = searchName;
	
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupRFQResponsePopCallback";
	
	screen.loadportletpopup(strPopupName, "/FRAME/popupCharge", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}


/*
* RFQ Response Callback
*/
function fnPopupRFQResponsePopCallback(aryHash) 
{ 	
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		var iRow = this.dsSearch.getpos();	
		this.dsSearch.setdatabyname(iRow , "CHARGE_USER_ID" , aryHash["USER_ID"]);
		this.dsSearch.setdatabyname(iRow , "CHARGE_USER_NAME" ,aryHash["USER_NAME"]);	
		
	}
}

function edtChargeUserName_on_changed(objInst, prev_text, curr_text, event_type)
{
	var chargeName = this.dsSearch.getdatabyname(0, "CHARGE_USER_NAME");
	
	if(!chargeName) {
		UT.gfnHrEditorStyle(this.rbPrev, "D");	
		UT.gfnHrEditorStyle(this.rbCur, "D");	
		
		this.dsSearch.setdatabyname(0 , "CHARGE_USER_ID" , SYSVar.NO_USER_ID);
		
	} else {
		this.btnChargeUserPop_on_click(objInst, chargeName);
		UT.gfnHrEditorStyle(this.rbPrev, "G");	
		UT.gfnHrEditorStyle(this.rbCur, "G");	
	}
}


function edtChargeUserName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	// 초기화
	this.dsSearch.setdatabyname(0 , "CHARGE_USER_ID" , SYSVar.NO_USER_ID);
	
	// Backspace
	if(keycode == 8) {
		this.dsSearch.setdatabyname(0 , "CHARGE_USER_ID" , SYSVar.NO_USER_ID);
		return;
	}
	// Enter
	if(keycode==13){   
		var chargeName = this.dsSearch.getdatabyname(0, "CHARGE_USER_NAME");
		
		if(chargeName) {
			this.btnChargeUserPop_on_click(objInst, chargeName);		
		} else {
			UT.gfnHrEditorStyle(this.rbPrev, "D");	
			UT.gfnHrEditorStyle(this.rbCur, "D");	
			this.dsSearch.setdatabyname(0, "CHARGE_USER_ID" , SYSVar.NO_USER_ID);
			this.btnCommonSearch_on_mouseup();
		}
		return;
	}
	return 0;
}