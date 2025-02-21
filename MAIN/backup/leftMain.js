var FV_MY_MENU_ARY;

function screen_on_load()
{
	SYSVar.LEFTMAIN_SCREEN = screen;
	SYSVar.LEFTMAIN_MEMBER = this;
}

// 트리 클릭 이벤트 처리
function treMenu_on_itemclick(objInst, item, iconclick, checkclick)
{
	var tabItemCount = SYSVar.MIDDLE_TAB.gettabitemcount();
	if (tabItemCount >= SYSVar.MAX_SCREEN_OPEN_COUNT) {
		UT.alert(this.screen , "MSG495" , "허용 가능한 최대 갯수에 도달하였습니다.");
        return;
	}
	
//	if(CCNConst.MIDDLE_MAIN_MIDDLE_TAB.gettabitemcount() >= SYSConst.MAX_SCREEN_OPEN_COUNT){
//		UT.alert(screen , "MSG042" , "오픈 가능한 화면 갯수는 %% 개입니다" , SYSConst.MAX_SCREEN_OPEN_COUNT);
//		return;
//	}

	var strMenuId = objInst.getitemdata(item);
	var iIndex = 0;
	
	if(objInst.getname() != "treMenu"){	//마이메뉴가 아닐경우
		iIndex = parseInt(objInst.getname().replace("treMenu_","") , 10);		
	}else{
		for(var i=1;i<12;i++){
			var objDs = this.screen.getxdataset("dsLeftMenu_" + i);
			var iSRow = UT.gfnFindRow(objDs , "LEFT_MENU_KEY" , strMenuId);
			
			if(iSRow != -1){
				iIndex = i;
				break;
			}
		}
	}

	var strLeftMenuLevel = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "LEFT_MENU_IMAGE_LEVEL");
	if(strLeftMenuLevel == "1" || strLeftMenuLevel == "2"){
		return;
	}
	
	if(INI.GV_MENU_OPEN_TYPE == "F"){	
	
		var aryDual = [ ["TYPE" , "PTL"]  ,  ["SCREEN_NAME" , strMenuId] ];
		var iSRow = UT.gfnAndFindRow(gdsScreen , aryDual);
		//UT.alert(screen , "" , "strMenuId : " + strMenuId);
		//UT.alert(screen , "" , "iSRow : " + iSRow);
		if(iSRow != -1){			
			var iWindowId = gdsScreen.getdatabyname(iSRow , "SCREEN_WINDOW_ID");
			//UT.alert(screen , "" , "iWindowId : " + iWindowId);
			var iMdiTabIndex = INI.gfnMdiGetTabItemFromWindowId(iWindowId);			

			//CCNConst.MIDDLE_MAIN_MIDDLE_TAB.settabitemclick(iMdiTabIndex);
			SYSVar.MIDDLE_TAB.settabitemclick(iMdiTabIndex);

			return;
		}
	}
	
	var strMenuNm = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "MENU_NM");	
	var strScreenUrl = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "MENU_PATH");
	
	SYSVar.MODULE_MEMBER.loadScreenByPathMenuId(screen, strScreenUrl , strMenuId , strMenuNm, iIndex);
}

// 마이메뉴 트리 더블클릭 이벤트 처리
function treMenu_on_itemdblclick(objInst, item)
{
	var tabItemCount = SYSVar.MIDDLE_TAB.gettabitemcount();
	if (tabItemCount >= SYSVar.MAX_SCREEN_OPEN_COUNT) {
		UT.alert(this.screen , "MSG495" , "허용 가능한 최대 갯수에 도달하였습니다.");
        return;
	}
	
//	if(CCNConst.MIDDLE_MAIN_MIDDLE_TAB.gettabitemcount() >= SYSConst.MAX_SCREEN_OPEN_COUNT){
//		UT.alert(screen , "MSG042" , "오픈 가능한 화면 갯수는 %% 개입니다" , SYSConst.MAX_SCREEN_OPEN_COUNT);
//		return;
//	}

	var strMenuId = objInst.getitemdata(item);
	var iIndex = 0;
	
	if(objInst.getname() != "treMenu"){	//마이메뉴가 아닐경우
		iIndex = parseInt(objInst.getname().replace("treMenu_","") , 10);		
	}else{
		for(var i=1;i<12;i++){
			var objDs = this.screen.getxdataset("dsLeftMenu_" + i);
			var iSRow = UT.gfnFindRow(objDs , "LEFT_MENU_KEY" , strMenuId);
			
			if(iSRow != -1){
				iIndex = i;
				break;
			}
		}
	}

	var strLeftMenuLevel = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "LEFT_MENU_IMAGE_LEVEL");
	if(strLeftMenuLevel == "1" || strLeftMenuLevel == "2"){
		return;
	}
	
	if(INI.GV_MENU_OPEN_TYPE == "F"){	
	
		var aryDual = [ ["TYPE" , "PTL"]  ,  ["SCREEN_NAME" , strMenuId] ];
		var iSRow = UT.gfnAndFindRow(gdsScreen , aryDual);
		//UT.alert(screen , "" , "strMenuId : " + strMenuId);
		//UT.alert(screen , "" , "iSRow : " + iSRow);
		if(iSRow != -1){			
			var iWindowId = gdsScreen.getdatabyname(iSRow , "SCREEN_WINDOW_ID");
			//UT.alert(screen , "" , "iWindowId : " + iWindowId);
			var iMdiTabIndex = INI.gfnMdiGetTabItemFromWindowId(iWindowId);			

			//CCNConst.MIDDLE_MAIN_MIDDLE_TAB.settabitemclick(iMdiTabIndex);
			SYSVar.MIDDLE_TAB.settabitemclick(iMdiTabIndex);

			return;
		}
	}
	
	var strMenuNm = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "MENU_NM");	
	var strScreenUrl = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "MENU_PATH");
	
	SYSVar.MODULE_MEMBER.loadScreenByPathMenuId(screen, strScreenUrl , strMenuId , strMenuNm, iIndex);
}

//화면 leftmenu index 찾기
function fnFindtreMenuIndex(strMenuId){
	
	var iIndex = 0;
	for(var i=1;i<12;i++){
		var objDs = this.screen.getxdataset("dsLeftMenu_" + i);
		var iSRow = UT.gfnFindRow(objDs , "LEFT_MENU_KEY" , strMenuId);
		
		if(iSRow != -1){
			iIndex = i;
			break;
		}
	}
	
	return iIndex;
}

function fnMyMenuShow(bFlag)
{

	if (bFlag) 
	{
		this.tabLeftMenu.settabitemfocus(1);
	} else {
		this.tabLeftMenu.settabitemfocus(0);
	}
}

//메뉴 우측마우스 클릭 호출 함수
function treMenuR_on_rclick(objInst, nClickItem, nXPoint, nYPoint, nWinXPoint, nWinYPoint)
{
	if(objInst.itemhaschildren(objInst.getselecteditem())){
		return;
	}
	
	var strMenuId = objInst.getitemdata(nClickItem);
	var strMyMenuType = "IN";
	
	if(objInst.getname() == "treMenu"){
		if(INI.GV_MENU_BEFORE_VIEW == "Y"){	//이전창 보이기면
			strMyMenuType = "OUT";	
		}else{		
			if(SYSVar.TOPMAIN_MEMBER.FV_INDEX == null || SYSVar.TOPMAIN_MEMBER.FV_INDEX == 0){
				strMyMenuType = "OUT";
			}
		}
	}		

	var objExtra_data = {
			MENU_ID    : strMenuId,
			MENU_TYPE  : strMyMenuType
	};
	
	if(!factory.loadmenu("MyMenuHandle", "/MAIN/MyMenuHandleP", nWinXPoint, nWinYPoint, 198 , 30, this.screen, objExtra_data)) {
		return false;
	}
	
}

//마이메뉴 세팅
function fnMyMenuLoad(aryDs){
	UT.gfnAryToDs(this.dsMyMenu , aryDs);
	FV_MY_MENU_ARY = aryDs;
	
	gdsLeftMenu.removeallrows();
	
	for(var i=0;i<this.dsMyMenu.getrowcount();i++){
		var iRow = gdsLeftMenu.getrowcount();
		gdsLeftMenu.insertrow(iRow);
			
		gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_KEY" , this.dsMyMenu.getdatabyname(i , "MENU_ID") );
		gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_NM" , this.dsMyMenu.getdatabyname(i , "MENU_NM") );
		gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_LEVEL" , this.dsMyMenu.getdatabyname(i , "MENU_LEVEL") );
		gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_IMAGE_LEVEL" , this.dsMyMenu.getdatabyname(i , "LEFT_MENU_IMAGE_LEVEL") );
		gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_IMAGE_SELECT" , this.dsMyMenu.getdatabyname(i , "LEFT_MENU_IMAGE_SELECT") );
		gdsLeftMenu.setdatabyname(iRow , "MASTER_MENU_ID" , this.dsMyMenu.getdatabyname(i , "MASTER_MENU_ID") );
		gdsLeftMenu.setdatabyname(iRow , "SORT_ORDER" , this.dsMyMenu.getdatabyname(i , "SORT_ORDER") );
	}
}

//마이메뉴 순번 버튼 세팅
function fnMyMenuOrderButtonSet(blVisible){	
	this.btnMyMenu_Top.setvisible(blVisible);
	this.btnMyMenu_Up.setvisible(blVisible);
	this.btnMyMenu_Down.setvisible(blVisible);
	this.btnMyMenu_Bottom.setvisible(blVisible);
	
	this.btnMyMenu_Top.setzorder(0);
	this.btnMyMenu_Up.setzorder(0);
	this.btnMyMenu_Down.setzorder(0);
	this.btnMyMenu_Bottom.setzorder(0);
}

//마이메뉴 순번 저장
function fnMyMenuOrderSave(){
	for(var i=0;i<gdsLeftMenu.getrowcount();i++){	//순번 재정립
		gdsLeftMenu.setrowoperation(i , XFD_ROWOP_NONE);
		gdsLeftMenu.setdatabyname(i , "SORT_ORDER" , i);
	}
	
	TRN.gfnTranDataSetHandle(this.screen , gdsLeftMenu , "ALL" , "NONE");	//데이터셋 인:ALL 아웃:NONE 정의		

	TRN.gfnCommonTransactionClear(this.screen);	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddUpdate(this.screen , "systemMapper.UPDATE_MY_MENU_INFO" , "gdsLeftMenu");	//수정만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "select" , true , false , false);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	
	for(var i=0;i<gdsLeftMenu.getrowcount();i++){	//전체 상태 노멀
		gdsLeftMenu.setrowoperation(i , XFD_ROWOP_NONE);
	}
}

//줄 바꿈
function fnMyMenuMove(iSourceRow , iTargetRow){
	this.dsTempLeftMyMenu.removeallrows();
	var iRow = UT.gfnDsAddRow(this.dsTempLeftMyMenu);
		
	UT.gfnCopyTowRow(gdsLeftMenu , iSourceRow , this.dsTempLeftMyMenu , iRow);	//내꺼 임시저장
	UT.gfnCopyTowRow(gdsLeftMenu , iTargetRow , gdsLeftMenu , iSourceRow);	//내위에껄 내꺼에 저장하고
	UT.gfnCopyTowRow(this.dsTempLeftMyMenu , this.dsTempLeftMyMenu.getpos() , gdsLeftMenu , iTargetRow);	//해당꺼의 맨윌줄꺼 임시저장
}

//마이메뉴 순번 최상버튼 클릭시
function btnMyMenu_Top_on_mouseup(objInst)
{
	var strMenuId = this.treMenu.getitemdata(this.treMenu.getselecteditem());
	var iSRow = UT.gfnFindRow(gdsLeftMenu , "LEFT_MENU_KEY" , strMenuId);	
	var strMasterMenuID = gdsLeftMenu.getdatabyname(iSRow , "MASTER_MENU_ID");
	var iMSRow = UT.gfnFindRow(gdsLeftMenu , "MASTER_MENU_ID" , strMasterMenuID);	
	
	if(strMasterMenuID == strMenuId){	//마스터는 실행안함
		return;
	}
	
	for(var i=iSRow;i>iMSRow+1;i--){
		this.fnMyMenuMove(i , i-1);	//줄 바꿈
		gdsLeftMenu.moveat(i-1);
	}
	
	this.fnMyMenuOrderSave();	//마이메뉴 순번 저장	
}

//마이메뉴 순번 한칸위로 버튼 클릭시
function btnMyMenu_Up_on_mouseup(objInst)
{
	var strMenuId = this.treMenu.getitemdata(this.treMenu.getselecteditem());
	var iSRow = UT.gfnFindRow(gdsLeftMenu , "LEFT_MENU_KEY" , strMenuId);	
	var strMasterMenuID = gdsLeftMenu.getdatabyname(iSRow , "MASTER_MENU_ID");
	
	if(strMasterMenuID == strMenuId){	//마스터는 실행안함
		return;
	}
	
	this.fnMyMenuMove(iSRow , iSRow-1);	//줄 바꿈
	gdsLeftMenu.moveat(iSRow-1);
	
	this.fnMyMenuOrderSave();	//마이메뉴 순번 저장	
}

//마이메뉴 순번 최하버튼 클릭시
function btnMyMenu_Down_on_mouseup(objInst)
{
	var strMenuId = this.treMenu.getitemdata(this.treMenu.getselecteditem());
	var iSRow = UT.gfnFindRow(gdsLeftMenu , "LEFT_MENU_KEY" , strMenuId);	
	var strMasterMenuID = gdsLeftMenu.getdatabyname(iSRow , "MASTER_MENU_ID");	
	var strCheckMasterMenuId = gdsLeftMenu.getdatabyname(iSRow+1 , "MASTER_MENU_ID");

	if(strMasterMenuID == strMenuId){	//마스터는 실행안함
		return;
	}
	
	if(strMasterMenuID == strCheckMasterMenuId){
		this.fnMyMenuMove(iSRow , iSRow+1);	//줄 바꿈
		gdsLeftMenu.moveat(iSRow+1);
	}
	
	this.fnMyMenuOrderSave();	//마이메뉴 순번 저장	
}

//마이메뉴 순번 최하버튼 클릭시
function btnMyMenu_Bottom_on_mouseup(objInst)
{
	var strMenuId = this.treMenu.getitemdata(this.treMenu.getselecteditem());
	var iSRow = UT.gfnFindRow(gdsLeftMenu , "LEFT_MENU_KEY" , strMenuId);	
	var strMasterMenuID = gdsLeftMenu.getdatabyname(iSRow , "MASTER_MENU_ID");
	var iMSRow = UT.gfnFindRow(gdsLeftMenu , "MASTER_MENU_ID" , strMasterMenuID);	
	
	if(strMasterMenuID == strMenuId){	//마스터는 실행안함
		return;
	}
	
	for(var i=iSRow;i<gdsLeftMenu.getrowcount();i++){
		var strCheckMasterMenuId = gdsLeftMenu.getdatabyname(i+1 , "MASTER_MENU_ID");
		if(strMasterMenuID == strCheckMasterMenuId){
			this.fnMyMenuMove(i , i+1);	//줄 바꿈
			gdsLeftMenu.moveat(i+1);
		}
	}
	
	this.fnMyMenuOrderSave();	//마이메뉴 순번 저장	
}
