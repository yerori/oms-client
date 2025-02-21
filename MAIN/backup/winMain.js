/****************************************************************************/
// 상수 몇 변수 정의


/*
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */
function _getFrameType()
{
	return "WIN_MAIN";
}

function screen_on_load()
{
	//this.tabMiddle.addcustomclass("_frame_portlet_screen");
	//this.tabMiddleSub.addcustomclass("_frame_portlet_screen");
	
	SYSVar.WINMAIN_SCREEN = screen;
	SYSVar.WINMAIN_MEMBER = this;
	this.addScreenTab();

	//this.tabTop.addcustomclass("_topOverflow");
	
	SYSVar.TOP_TAB    = this.tabTop;
	SYSVar.MIDDLE_TAB = this.tabMiddle;
	//SYSVar.SUB_MIDDLE_TAB = this.tabMiddleSub;
	SYSVar.LEFT_TAB   = this.tabLeft;
	//SYSVar.RIGHT_TAB  = this.tabRight;
	SYSVar.HOME_TAB   = this.tabHome;
	
	this.setUseBizSplit(SYSVar.USE_SUB_MIDDLE_TAB);
	//this.tabMiddleSub.setvisible(false);
	//this.splitMiddle.setvisible(false);	
	
	SYSVar.SELECTED_MIDDLE_TAB = this.tabMiddle;
	/* active tab을 체크하기 위한 이벤트 등록*/
	this.tabMiddle.getdom().onclick = onClickMiddleTab.bind(this);
	//this.tabMiddleSub.getdom().onclick = onClickSubMiddleTab.bind(this);
}

function setUseBizSplit(bUse)
{
	if (UT.isNull(bUse)){
		bUse = false;
	}
	
	if(bUse)
	{
		//this.tabMiddle.setsize(50, -1);
		//this.tabMiddleSub.setsize(49 , -1 );
		//this.splitMiddle.setleft(this.tabMiddle.getright());
		//this.splitMiddle.setvisible(true);
		//this.tabMiddleSub.setvisible(true)
		this.tv1.setrowheightex(2, 50, 0);
	}
	else
	{
		//this.tabMiddle.setsize(100, -1);
		//this.tabMiddleSub.setsize(0, -1 );
		//this.splitMiddle.setleft(this.tabMiddle.getright());
		//this.splitMiddle.setvisible(false);
		//this.tabMiddleSub.setvisible(false);
		//this.tv1.setrowheightex(2, 1, 0);
		//this.tabMiddleSub.deletealltab(true, false);
		SYSVar.ACTIVE_SCREEN = null;
		if(this.tabMiddle.gettabitemcount() > 0 )
		{
			let itemIdx = this.tabMiddle.gettabitemfocus();
			SYSVar.ACTIVE_SCREEN = this.tabMiddle.getchildscreeninstance(itemIdx);
		}
	}
	
	SYSVar.USE_SUB_MIDDLE_TAB = bUse;
}

function onClickMiddleTab()
{
	//console.log("onClickMiddleTab");

	//SYSVar.UNSELECT_MIDDLE_TAB_BACKCOLOR??= parseInt("EBEBEB", 16);
	//SYSVar.SELECTED_MIDDLE_TAB_BACKCOLOR??= parseInt("FFFFFF", 16);
	if(SYSVar.UNSELECT_MIDDLE_TAB_BACKCOLOR == null || SYSVar.UNSELECT_MIDDLE_TAB_BACKCOLOR == undefined) {
		SYSVar.UNSELECT_MIDDLE_TAB_BACKCOLOR = parseInt("EBEBEB", 16);
	}
	if(SYSVar.SELECTED_MIDDLE_TAB_BACKCOLOR == null || SYSVar.SELECTED_MIDDLE_TAB_BACKCOLOR == undefined) {
		SYSVar.SELECTED_MIDDLE_TAB_BACKCOLOR = parseInt("FFFFFF", 16);
	}
	
	//this.tabMiddle.settabcolor(SYSVar.SELECTED_MIDDLE_TAB_BACKCOLOR);
	//this.tabMiddleSub.settabcolor(SYSVar.UNSELECT_MIDDLE_TAB_BACKCOLOR);
	SYSVar.SELECTED_MIDDLE_TAB = this.tabMiddle;
	
	if(this.tabMiddle.gettabitemcount()  < 1 )
	{
//		if(this.tabMiddleSub.gettabitemcount() > 0) 
//		{
//			let itemIdx = this.tabMiddleSub.gettabitemfocus();
//			SYSVar.ACTIVE_SCREEN = this.tabMiddleSub.getchildscreeninstance(itemIdx);
//		}
		return;
	}
	else
	{
		let itemIdx = this.tabMiddle.gettabitemfocus();
		SYSVar.ACTIVE_SCREEN = this.tabMiddle.getchildscreeninstance(itemIdx);
	}
}

//function tabMiddle_on_itemrclick(objInst, itemindex)
//{
//	this.tabMiddle.settabitemfocus(itemindex, false, false, false);
//	this.loadMenuTabMiddle(itemindex);
//}

function tabMiddle_on_itemcreate(objInst, itemindex)
{
	SYSVar.ACTIVE_SCREEN = objInst.getchildscreeninstance(itemindex);
	this.showHome(false);
}

function tabTop_on_itemcreate(objInst, itemindex)
{
	let childScreen = this.tabTop.getchildscreeninstance(itemindex);
	let childDom = childScreen.getdom();
	//console.log("childDom.style.overflow:"+childDom.style.overflow);
	//childDom.style.overflow = "visible";
	//console.log(childDom);
	childDom.parentElement.style.overflow = "visible";
	
	//console.log("childDom.style.overflow:"+childDom.style.overflow);
	
	//= 메뉴 정보 로드??
	
	this.tabTop.settabitemfocus(1);
}

/*
 * 화면을 탭에 추가한다.
 */
function addScreenTab()
{
//	this.tabTop.   addportlettab("TOP",    0, 0, "/SYS/MAIN/topMain",    "", true);
//	this.tabTop.   addportlettab("TOP",    0, 0, "/SYS/MAIN/topMain_sm",    "", true);
	this.tabBottom.addportlettab("BOTTOM", 0, 0, "/MAIN/bottomMain", "", true);
	this.tabLeft.addportlettab("LEFT",   0, 0, "/MAIN/leftMain",   "", true);
	//this.tabRight.addportlettab("RIGHT",  0, 0, "/MAIN/rightMain",  "", true);
}

/**
 * 로그인 완료 처리
 * @return 없음
 */
function txLoginComplete()
{
	//SYSVar.STARTMAIN_TAB.settabitemfocus(1, true);
	this.ufnLangLoad();				  //시스템 다국어를 로드합니다 (label만)
	this.ufnMsgLangLoad();			   //시스템 다국어를 로드합니다 (message만)	
	//this.ufnMainSystemCodeLoad();		//코드 로드 CO_ID , LANG_SCN_CD
	this.ufnAuthMenuLoad();		  	//메뉴권한 로드 CO_ID , USER_ID , LANG_SCN_CD
	this.ufnMyMenuLoad();				//나의 메뉴 로드
	this.ufnTopMenuSet();			    //탑 프레임 메뉴 세팅 함수 호출 함수
	
	var objTopScreen = SYSVar.TOPMAIN_SCREEN;	
	var objBtnMain = objTopScreen.getinstancebyname("btnMain1");
	SYSVar.TOPMAIN_MEMBER.btnMain_on_mouseup(objBtnMain);
	
	TRN.gfnLogInsertProcessor("LOG001" , INI.GV_USER_ID , INI.GV_USER_ID_NM);	//로그인 로그 남기기
	
	UT.statMsg(screen , "" , "로그인되었습니다.");
	
	SYSVar.STARTMAIN_TAB.settabitemfocus(1, true, true, true);


    var rndMenu ="N";
    for(var i = 0 ;i<gdsAuthMenu.getrowcount();i++){
	    if(gdsAuthMenu.getdatabyname(i,"MENU_NM")=="연구소"){
		    rndMenu="Y";
	    }
	}
    
    if(rndMenu!="Y"){
		this.loadHomeScreen();
		if(UT.isScreen(SYSVar.SUB1_SCREEN)){ 
			SYSVar.SUB1_MEMBER.fnRFQStat();
			SYSVar.SUB2_MEMBER.fnPSOPlanStat();
			SYSVar.SUB3_MEMBER.fnPjtStat();
			SYSVar.SUB4_MEMBER.fnPsoDeptStat();
			SYSVar.SUB5_MEMBER.fnMyPjtStat();
			SYSVar.SUB6_MEMBER.fnPsoMyStat();
		}
    }
    else{
		this.loadHomeScreen1();
		if(UT.isScreen(SYSVar.SUB1_SCREEN)){ 
			SYSVar.SUB1_MEMBER.fnRndSummary();
		}
    }
		
	if(INI.GV_INFO_SECURIT_YN=="N"){
		this.showInfoSecurit();
	}
	
	if(INI.GV_FIRST_PWD_CHANGE=="N"){
		this.showPwdChange();
	}
}

//function setThema(thema)
//{
//	if(thema == null || thema == undefined) {
//		thema = null;
//	}
//	
//	if(!thema ) return;
//	
//	SYSThema.setFrameThema(thema);
//}

function setWideScreen(bFlag){
	
	var tabWidth =0;
	
	if(bFlag == undefined)
	{
		if(this.tv1.ishiddencolumn(0)){
			this.tv1.setcolumnhidden(0, false, true,300);
		}else{
			this.tv1.setcolumnhidden(0, true, true,300);
		}
		if(this.tv1.ishiddencolumn(2)){
			this.tv1.setcolumnhidden(2, false, true,300);
		}else{
			this.tv1.setcolumnhidden(2, true, true,300);
			
			
		}
	} else {
		if(bFlag)
		{
			//활성
			if (this.tv1.ishiddencolumn(0) )
			{	
				this.tv1.setcolumnhidden(0, false, true);
				//this.tv1.setcolumnhidden(2, false, true);
				
				//tabWidth = this.tabMiddle.getwidth();//-240;
				tabWidth =this.tv1.getitemwidth(1,1);
				var item0With =this.tv1.getitemwidth(1,0);
				//최소 사이즈 : 960PX 
				
				//this.tv1.setcolumnwidth(1,960,true);
				this.tv1.setcolumnwidthex(0,240,0);
				this.tv1.setcolumnwidthex(1,100,1);
			}
		}
		else
		{
			//숨기기
			if ( !this.tv1.ishiddencolumn(0) )
			{	
				this.tv1.setcolumnhidden(0, true, true);
				//this.tv1.setcolumnhidden(2, true, true);
				tabWidth =this.tv1.getitemwidth(1,1);
				this.tv1.setcolumnwidthex(1,100,1);
			}
		}
	}	
}

//function setWideScreen_test()
//{
//	let leftColWidth = this.tv1.getitemwidth(1,0);
//	let rightColWidth = this.tv1.getitemwidth(1,2);
//	let orgLeftWidth = 240;
//	if(!SYSVar.LEFT_QUICK_USE)
//	{
//		orgLeftWidth = 200;
//	}
//	
//	let orgRightWidth = 280;
//	if(!SYSVar.USE_RIGHT_MENU)
//	{
//		orgRightWidth = 40;
//	}
//	
//	if(leftColWidth == 0){
//		this.tv1.setcolumnwidth(0, orgLeftWidth, true);
//	}else{
//		this.tv1.setcolumnwidth(0, 0, true);
//	}
//	if(rightColWidth == 0){
//		this.tv1.setcolumnwidth(2, rightColWidth, true);
//	}else{
//		this.tv1.setcolumnwidth(2, 0, true);
//	}
//}

//function screen_on_messagebox(messagebox_id, result)
//{
//	
//console.log("messagebox_id:" + messagebox_id);
//console.log("result:" + result);
//	
//	switch(messagebox_id) 
//	{
//		case "close" :
//			if(XFD_MB_RESYES == result) {
//				SYSVar.MODULE_MEMBER.unloadScreen();
//			}
//			break;
//		case "closeAllEx" :
//			 if(XFD_MB_RESYES == result) {
//	//			SYSVar.MODULE_MEMBER.unloadScreenAll(false);
//				this.tabMiddle.deletealltab(false, false);
//			}
//			break;
//		case "closeAll" :
//			if(XFD_MB_RESYES == result) {
////				SYSVar.MODULE_MEMBER.unloadScreenAll(true);
//				this.tabMiddle.deletealltab(true, false);
//			}
//			break;
//	}
//
//}

//function splitMiddle_on_move(objInst, nStartPos, nPos, nMoveGap, nArriveLimit)
//{
//	console.log("npos:"+nPos);
//	let isToLeft = false;
//	if(nStartPos > nPos) isToLeft = true;
//	let splitLeft = objInst.getleft();
//	let splitLeftPosPercent = parseInt( (splitLeft / this.tv1.getitemwidth(1,1) ) * 100,10);
//	this.tabMiddle.setsize(splitLeftPosPercent, -1);
//	this.tabMiddleSub.setwidth(100-(splitLeftPosPercent+1) , -1 );
//}

//function splitMiddle_on_moveend(objInst, nStartPos, nPos, nMoveGap)
//{
//	if(SYSVar.USE_SUB_MIDDLE_TAB == true)
//	{
//		this.splitMiddle.setleft(this.tabMiddle.getright());
//		this.splitMiddle.setvisible(true);
//	}
//}


function bizTab_on_itemdestroy(objInst, itemindex)
{
	SYSVar.ACTIVE_SCREEN = null;
	
	// MainFrame 화면의 인스턴스를 구함
	var objFrameScreen = this.tabMiddle.getchildscreeninstance(itemindex);
	if(factory.isobject(objFrameScreen) == false) {
		return 0;
	}	
	
	INI.gfnMdiTabItemDelScreenDs(itemindex);	//스크린데이터셋에서 해당 인덱스 삭제
	
	if(objInst.gettabitemcount()-1 != 0 )
	{
//		let otherTab;
//		if(objInst.getcontrolid() === "tabMiddleSub") otherTab = this.tabMiddle;
//		else otherTab = this.tabMiddleSub;
//		
//		if(otherTab.gettabitemcount() > 0) 
//		{
//			let itemIdx = otherTab.gettabitemfocus();
//			SYSVar.ACTIVE_SCREEN = otherTab.getchildscreeninstance(itemIdx);
//		}
//	}
//	else
//	{
		SYSVar.ACTIVE_SCREEN = objInst.getchildscreeninstance(objInst.gettabitemcount()-1);
	}
	
	this.showHome(!this._hasLoadedBizScreen());
	return 1;
}

function bizTab_on_itemchange(objInst, itemindex)
{
	let itemIdx = objInst.gettabitemfocus();
	SYSVar.ACTIVE_SCREEN = objInst.getchildscreeninstance(itemindex);
}

function _setLockScreen(bUse)
{
	if(bUse == null || bUse == undefined) {
		bUse = true;
	}
	if(bUse !== false) bUse = true;
	this.pnlMainLock.setvisible(bUse);
}

function showHome(bShow)
{
	if(UT.isNull(bShow)){
		bShow = true;
	}
	if(bShow !== true) bShow = false;
	this.tabHome.setvisible(bShow);
	
}

function toggleHome()
{
	let show = this.tabHome.getvisible();
	this.tabHome.setvisible(!show);
}


function _hasLoadedBizScreen()
{
	if(SYSVar.ACTIVE_SCREEN == null) return false;
	else return true;	
}

/* 로그인시 호출 */
function loadHomeScreen()
{
	//SYSVar.STARTMAIN_TAB.settabitemfocus(1,true);
	//this.tabHome.addportlettab("homeScreen",0,0,SYSVar.HOME_SCREEN,"homeScreen",true);
	SYSVar.HOME_TAB.addportlettab("homeScreen",0,0,SYSVar.HOME_SCREEN,"homeScreen",true);
	//SYSVar.HOME_TAB.addportlettabsync("",0,0,SYSVar.HOME_SCREEN,"",true);
	SYSVar.HOME_TAB.settabitemfocus(0,true);
	SYSVar.HOME_TAB.setzorder(0);
	//this.tabHome.settabitemfocus(0,true);
	//this.tabHome.setzorder(0);
	
	//SYSVar.HOME_MEMBER.addScreenTab();
	//let HomeMember = this.tabHome.getchildscreeninstance(0).getmembers();
	//HomeMember.screen_on_load();
	//HomeMember["btnLogin"].setenable(true);
}

function loadHomeScreen1()
{
	SYSVar.HOME_TAB.addportlettab("homeScreen",0,0,SYSVar.HOME_SCREEN1,"homeScreen",true);
	SYSVar.HOME_TAB.settabitemfocus(0,true);
	SYSVar.HOME_TAB.setzorder(0);
}

function tabHome_on_itemcreate(objInst, itemindex)
{
	this.tabHome.settabitemfocus(itemindex,true);
}

function tabHome_on_itemchange(objInst, itemindex)
{
	this.tabHome.settabitemfocus(itemindex,true);
}

function getHomeScreenInst()
{
	return this.tabHome.getchildscreeninstance(0);
}

function screen_on_keydown(keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(bctrldown){
		if(keycode == 68){
			SYSVar.SELECTED_MIDDLE_TAB.deletealltab();
		}
	}
	return 0;
}

//function topMenuMake()
//{
//	let topTabCnt = this.tabTop.gettabitemcount();
//	
//	for(var idx = 0; idx < topTabCnt; idx++)
//	{
//		
//		let tabChildInst = this.tabTop.getchildscreeninstance(idx);
//		let members = tabChildInst.getmembers();
//		
//		members.convMenu();
//	}
//	
//	let domObj = this.tabTop.getdom();
//	let panelDomArr = domObj.querySelectorAll("._xf_tab_panel_box");
//	for(var idx = 0; idx < panelDomArr.length; idx++)
//	{
//		let panelDomObj = panelDomArr[idx];
//		panelDomObj.style.overflow = "hidden";
//	}
//}


/*
* 로그 남기기
* strLogKCd	: (string) 로그구분 
* strLogObjId  : (string) 로그오브젝트 아이디
* strLogNote   : (string) 로그비고
*/
function ufnLogInsertProcessor(strLogKCd , strLogObjId , strLogNote){
	this.dsMainSystemLog.removeallrows();
	var iRow = UT.gfnDsAddRow(this.dsMainSystemLog);
	
	this.dsMainSystemLog.setdatabyname(iRow , "LOG_K_CD" , strLogKCd);
	//this.dsMainSystemLog.setdatabyname(iRow , "USER_IP_ADDR" , factory.getlocalipaddress());
	this.dsMainSystemLog.setdatabyname(iRow , "USER_IP_ADDR" , SYSVar.LOCAL_IP_ADDR);
	this.dsMainSystemLog.setdatabyname(iRow , "LOG_NOTE" , strLogNote);
	this.dsMainSystemLog.setdatabyname(iRow , "LOG_OBJ_ID" , strLogObjId);

	TRN.gfnTranDataSetHandle(this.screen , this.dsMainSystemLog , "ALL" , "NONE" , "" , "" , "TR_LOG");

	TRN.gfnCommonTransactionClear(this.screen , "TR_LOG");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddInsert(this.screen , "systemMapper.INSERT_SMT_LOG_INFO" , "dsMainSystemLog");	//로그를 추가합니다
		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "logInfoSystemLog" , true , false , false , "TR_LOG");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
}



/*
* 시퀀스를 반환합니다
* strSeqId      : (string) 시퀀스구분
* strSeqType    : (string) 시퀀스 타입  'YYYYMMDD' , 'YYYY' , 'YYYYMM' , '9999'
* strAppendWord : (string) 앞쪽에 붙여질 문자
* iTotalLength  : (int) 총 길이
*/
function ufnMainGetSequence(strSeqId , strSeqType , strAppendWord , iTotalLength){		
	if(UT.isNull(strSeqId)){
		UT.alert( screen , "" , "[ufnMainGetSequence 개발자 오류] 쿼리 구분 값을 넘겨주세요");
	}
	
	if(UT.isNull(strSeqType)){
		strSeqType = "9999";
	}
		
	var strDay = UT.getDate();
	if(strSeqType == "YYYY"){
		strDay = strDay.substr(0 , 4);
	}else if(strSeqType == "YYYYMM"){
		strDay = strDay.substr(0 , 6);
	}
		
	this.dsMainSequence.removeallrows();
	var iRow = this.dsMainSequence.getrowcount();
	this.dsMainSequence.insertrow(iRow);
	this.dsMainSequence.setdatabyname(iRow , "SEQ_SCN_CD" , strSeqId);
	this.dsMainSequence.setdatabyname(iRow , "CRTN_VAL" , strSeqType);
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsMainSequence , "ALL" , "CLEAR" , "" , "" , "TR_SEQUENCE");	//데이터셋 인:ALL 아웃:CLEAR 정의

	TRN.gfnCommonTransactionClear(this.screen , "TR_SEQUENCE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_SEQ_INFO" ,"dsMainSequence" , "dsMainSequence");	//조회만	

	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "sequence" , true , false , false , "TR_SEQUENCE");	
	  
	var strReturnSeq = "" + this.dsMainSequence.getdatabyname(0, "CRTN_SEQ_VAL"); 
	 
	if(UT.isNull(iTotalLength)){
		iTotalLength = 20;
	}

	if(UT.isNull(strAppendWord)){
		strReturnSeq = strSeqId + strDay + UT.gfnLpad(strReturnSeq , "0" , iTotalLength - strSeqId.length - strDay.length); 
	}else{
		strReturnSeq = strAppendWord + UT.gfnLpad(strReturnSeq ,  "0" , iTotalLength - strAppendWord.length); 
	}
	  
	return strReturnSeq;	
}

/*
* 로그인 사용자가 해당권한을 가지고 있는지 판단
* strAuthGId	: (string) 권한
*/
function ufnUserAuth(strAuthGId){		
	var strUserAuthYn = "N";
	var params = "AUTH_G_ID=" + strAuthGId;	
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsUserAuth , "NONE" , "CLEAR" , "" , "" , "TR_USER_AUTH");

	TRN.gfnCommonTransactionClear(this.screen , "TR_USER_AUTH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_AUTH_YN" , "" , "dsUserAuth" , params);
		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "dsUserAuth" , true , false , false , "TR_USER_AUTH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		

	strUserAuthYn = dsUserAuth.getdatabyname(0, "AUTH_YN");
	
	return strUserAuthYn;
}

/*
* 시스템(LABEL만 해당) 다국어를 로드합니다
*/
function ufnLangLoad(){
	
	TRN.gfnTranDataSetHandle(this.screen , gdsLabelLang , "NONE" , "CLEAR" ,  "" , "" , "TR_LANG");

	TRN.gfnCommonTransactionClear(this.screen , "TR_LANG");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LABEL_LANG_INFO" ,"" , "gdsLabelLang");	//조회만	
	
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadLang" , true , false , false , "TR_LANG");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
}

/*
* 시스템(MESSAGE 만 해당) 다국어를 로드합니다
*/
function ufnMsgLangLoad(){
	
	TRN.gfnTranDataSetHandle(this.screen , gdsMsgLang , "NONE" , "CLEAR" ,  "" , "" , "TR_MSG_LANG");

	TRN.gfnCommonTransactionClear(this.screen , "TR_MSG_LANG");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_MSG_LANG_INFO" ,"" , "gdsMsgLang");	//조회만	
	
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadMsgLang" , true , false , false , "TR_MSG_LANG");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
}

/*
* 지정된 SQL로 코드를 로드합니다
* strSQLid  : SQL아이디 
*/
function ufnComboLoad(strSQLid, strParam){

	var params = "";
	if (strParam) {
		params = strParam;
	}
	
	//공통코드 가져오기
	TRN.gfnTranDataSetHandle(this.screen , this.dsCommCode , "NONE" , "CLEAR" , "" , "" , "TR_SYSTEM_CODE");

	TRN.gfnCommonTransactionClear(this.screen , "TR_SYSTEM_CODE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , strSQLid , "" , "dsCommCode" , params);	//조회만	

	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadCombo" , true , false , false , "TR_SYSTEM_CODE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	
	return UT.gfnDsToAry(this.dsCommCode);
}

/*
* 시스템 공통 코드를 로드합니다
* strGrpCode  : 그룹코드 
*/
function ufnCommCodeLoad(strGrpCode, strActFlag){
	
	var params = "";
	params = params + " GRP_CODE=" + strGrpCode;
	params = params + " ACTIVE_FLAG=" + strActFlag;
	
	
	//공통코드 가져오기
	TRN.gfnTranDataSetHandle(this.screen , this.dsCommCode , "NONE" , "CLEAR" , "" , "" , "TR_SYSTEM_CODE");

	TRN.gfnCommonTransactionClear(this.screen , "TR_SYSTEM_CODE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_COMM_CODE" , "" , "dsCommCode" , params);	//조회만	

	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadCode" , true , false , false , "TR_SYSTEM_CODE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	
	return UT.gfnDsToAry(this.dsCommCode);
}

/*
* OU 코드를 로드합니다
*/
function ufnOuCodeLoad(){
	
	//OU 가져오기
	TRN.gfnTranDataSetHandle(this.screen , this.dsOuCodes , "NONE" , "CLEAR" , "" , "" , "TR_OU_CODE");

	TRN.gfnCommonTransactionClear(this.screen , "TR_OU_CODE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE_OU" , "" , "dsOuCodes");	//조회만	

	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadOU" , true , false , false , "TR_OU_CODE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	
	return UT.gfnDsToAry(this.dsOuCodes);
}

/*
* Site 코드를 로드합니다
* strOuCode  : Ou_Code 
*/
function ufnSiteCodeLoad(strOuCode){
	
	var params = "";
	params = params + " OU_CODE=" + strOuCode;
	
	
	//공통코드 가져오기
	TRN.gfnTranDataSetHandle(this.screen , this.dsSiteCodes , "NONE" , "CLEAR" , "" , "" , "TR_SITE_CODE");

	TRN.gfnCommonTransactionClear(this.screen , "TR_SITE_CODE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_CODE_SITE" , "" , "dsSiteCodes" , params);	//조회만	

	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadSite" , true , false , false , "TR_SITE_CODE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	
	return UT.gfnDsToAry(this.dsSiteCodes);
}

/*
* Site 코드를 로드합니다
* strOuCode  : Ou_Code 
* strUserID  : User_ID
*/
function ufnSiteUserCodeLoad(strOuCode, strUserID){
	
	var params = "";
	params += " OU_CODE=" + strOuCode;
	params += " USER_ID=" + strUserID;
	
	
	//공통코드 가져오기
	TRN.gfnTranDataSetHandle(this.screen , this.dsUserSiteCodes , "NONE" , "CLEAR" , "" , "" , "TR_USER_SITE_CODE");

	TRN.gfnCommonTransactionClear(this.screen , "TR_USER_SITE_CODE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsCommonMapper.SELECT_USER_SITE_CODE" , "" , "dsUserSiteCodes" , params);	//조회만	

	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectUserSite" , true , false , false , "TR_USER_SITE_CODE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	
	return UT.gfnDsToAry(this.dsUserSiteCodes);
}

/*
* 사용자 메뉴 권한을 로드합니다
*/
function ufnAuthMenuLoad(){
	
	TRN.gfnTranDataSetHandle(this.screen , gdsAuthMenu , "NONE" , "CLEAR" ,  "" , "" , "TR_AUTH_MENU");

	TRN.gfnCommonTransactionClear(this.screen , "TR_AUTH_MENU");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_GDS_AUTH_MENU" , "" , "gdsAuthMenu");	//조회만	

	TRN.gfnCommonTransactionRun(this.screen , "selectLoadAuthMenu" , true , false , false , "TR_AUTH_MENU");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
	//UT.alert(this.screen , "" , "gdsAuthMenu.getrowcount() : " + gdsAuthMenu.getrowcount());			
}

function ufnMyMenuLoad(){	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMyMenu , "NONE" , "CLEAR" ,  "" , "" , "TR_MY_MENU");

	TRN.gfnCommonTransactionClear(this.screen , "TR_MY_MENU");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_MY_MENU_INFO" ,"" , "dsMyMenu");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "selectMyMenu" , true , false , false , "TR_MY_MENU");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)

	//CCNConst.TREE_MENU_MEMBER.fnMyMenuLoad(UT.gfnDsToAry(dsMyMenu));
	SYSVar.LEFTMAIN_MEMBER.fnMyMenuLoad(UT.gfnDsToAry(this.dsMyMenu));
}

/*
* Top 프레임 메뉴 세팅 함수를 호출합니다
*/
function ufnTopMenuSet(){
	var objTopScreen = SYSVar.TOPMAIN_SCREEN;
	var objTopScreenMember = SYSVar.TOPMAIN_MEMBER;

	if(UT.isScreen(objTopScreen) && objTopScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnSetOneLevelMenu")){ 
		objTopScreenMember.ufnSetOneLevelMenu();
	}	
}

/*
* 전자상거래 동의 popup 호출합니다
*/
function showECommerce(){
	screen.loadportletpopup("ecommerce_view", "/FRAME/popupECommerce", "전자상거래 동의", false, 0, 0, 0, 900, 600, true, true, false, "");
}

/*
* 개인정보 동의 popup 호출합니다
*/
function showPersonalInfo(){
	screen.loadportletpopup("personalinfo_view", "/FRAME/popupPersonalInfo", "개인정보 동의", false, 0, 0, 0, 900, 600, true, true, false, "");
}

/*
* 정보보안서약서 popup 호출합니다
*/
function showInfoSecurit(){
	screen.loadportletpopup("infosecurit_view", "/FRAME/popupInfoSecurit", "정보보안서약서 동의", false, 0, 0, 0, 900, 600, true, true, false, "");
}

/*
* 비밀번호변경 popup 호출합니다
*/
function showPwdChange(){
	screen.loadportletpopup("pwdchg_view", "/FRAME/UserPwdChg", "최초 로그인 비밀번호 변경", false, 0, 0, 0, 420, 300, true, true, false, "");
}