/*------------------------------------
* program id : MyMenuHandleP
* desc	   : 마이 메뉴 핸들용
* dev date   : 2022-03-12
* made by    : SEYUN
*-------------------------------------*/


var strMenuId;	
var strMyMenuType;


//해당 데이터로 
function fnSetData(){
	btnMyNenuAdd.setvisible(false);
	btnMyNenuDel.setvisible(false);
	
	if(strMyMenuType == "IN"){
		btnMyNenuAdd.setvisible(true);
	}else{
		btnMyNenuDel.setvisible(true);
	}	
}


/*
* 닫기버튼시
*/
function btnClose_on_mouseup(objInst)
{
	screen.unload();
}

/*
* 온로드
*/
function screen_on_load()
{
	INI.initPopup(screen);	//팝업 공통 
	var objExtra_data = screen.getextradata();
	strMenuId = objExtra_data.MENU_ID;
	strMyMenuType = objExtra_data.MENU_TYPE;
	fnSetData();
}

/*
* 추가버튼시
*/
function btnMyNenuAdd_on_mouseup(objInst)
{
	//var param = "MENU_ID=" + strMenuId + " MENU_ORDER=9999";
	var param = "MENU_ID=" + strMenuId ;
		
	TRN.gfnCommonTransactionClear(screen);	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddInsert(screen , "systemMapper.INSERT_MY_MENU_INFO" , "" , param);	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(screen , "myMenuInsert" , true , false , false);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)			
	
	fnParentCallBackRun();
	
	screen.unload();
}


/*
* 삭제버튼시
*/
function btnMyNenuDel_on_mouseup(objInst)
{
	var param = "MENU_ID=" + strMenuId;
		
	TRN.gfnCommonTransactionClear(screen);	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddDelete(screen , "systemMapper.DELETE_MY_MENU_INFO" , "" , param);	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(screen , "myMenuUpdate" , true , false , false);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)	
	
	fnParentCallBackRun();	//부모창 마이메뉴 재조회시키기
}


/*
* 부모창 마이메뉴 재조회시키기
*/
function fnParentCallBackRun(){	

	if(SYSVar.WINMAIN_SCREEN.findscriptmethod(XFD_JAVASCRIPT , "ufnMyMenuLoad")){
		SYSVar.WINMAIN_MEMBER.ufnMyMenuLoad();			
	}
	
	screen.unload();
}