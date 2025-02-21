var FV_TOP_MENU_ID_ARY = [];
var FV_INDEX;

/**
 * 화면 최초 로드시에
 */
function screen_on_load() 
{
	SYSVar.TOPMAIN_SCREEN = screen;
	SYSVar.TOPMAIN_MEMBER = this;
	
	this.txtServerType.settext(INI.GFV_SERVER_TYPE);
	if(INI.GFV_SERVER_TYPE=="LIVE"){
		this.txtServerType.setvisible(false);
	}
}


function screen_on_size(window_width, window_height)
{
//	CCNLayout.processSizeEvent(this.screen, window_width, window_height);
}

/*
* 권한을 확인해서 1 메뉴만 확인하여 
*/
function ufnSetOneLevelMenu(){

//	if(INI.GV_XFRAME_ONLY == "TRUE")
//	{
//		//최초 한번만 셋팅
//		if(fFirst)
//		{
//			lblUserNm.settext(INI.GV_USER_ID_NM + " " + INI.GV_OLV_CD_NM + "  [" + INI.GV_ORG_NM + "]");
//			fFirst = false;
//		}
//		btnLogOff.setvisible(true);		
//	}
//	else
//	{
//		lblUserNm.setvisible(false); 
//		btnLogOff.setvisible(false);	
//	}
	//this.txtUserNm.settext(INI.GV_USER_ID_NM + " " + INI.GV_JIKWI_NAME);
	this.txtUserNm.settext(INI.GV_USER_ID_NM);
	
	var iOneCnt = 1;	
	//UT.alert(this.screen , "" , "gdsAuthMenu.getrowcount() : " + gdsAuthMenu.getrowcount());
	
	for(var i=0;i<gdsAuthMenu.getrowcount();i++){
		var strMenuId = gdsAuthMenu.getdatabyname(i , "MENU_ID");
		var strMenuTitle = gdsAuthMenu.getdatabyname(i , "MENU_NM");
		var iMenuLevel = gdsAuthMenu.getdatabyname(i , "MENU_LEVEL");
		//var strIntroYN = gdsAuthMenu.getdatabyname(i , "INTRO_YN");		
	
		//if(iMenuLevel == -1 && strIntroYN != "Y"){
		if(iMenuLevel == -1){	
			var obj = UT.gfnGetObjectByName(this.screen , "btnMain" + (iOneCnt));
			
			if(!UT.isNullObj(obj)){	
				obj.setvisible(true);				
				obj.settext(strMenuTitle);
				FV_TOP_MENU_ID_ARY[iOneCnt] = strMenuId;	//배열에 삽입
				
				if(INI.GV_MENU_BEFORE_VIEW == "Y"){	//이전 메뉴가 보이게 처리하기면
					this.fnLeftFrameMenuDsSet(iOneCnt);
				}
				
				iOneCnt++;
			}
		}		
	}
	
	for(var i=iOneCnt;i<11;i++){
		var obj = UT.gfnGetObjectByName(this.screen , "btnMain" + i);
		if(!UT.isNullObj(obj)){
			obj.setvisible(false);
			obj.settext("");
		}
		
		var img_obj = UT.gfnGetObjectByName(this.screen , "btnImg" + i);
		if(!UT.isNullObj(img_obj)){
			img_obj.setvisible(false);
		}
	}		
}

/*
* 1댑스 이하 메뉴들을 세팅해 넣습니다
* objBtnName = "btnMain3"
*/
function fnLeftFrameMenuDsSet(iIndex){
	var objTreeScreen = SYSVar.LEFTMAIN_SCREEN;
	var objDs = objTreeScreen.getxdataset("dsLeftMenu_" + iIndex);
	var strMenuId = FV_TOP_MENU_ID_ARY[iIndex];

	objDs.removeallrows();

	for(var i=0;i<gdsAuthMenu.getrowcount();i++){
		var strMenuOneLevelId = gdsAuthMenu.getdatabyname(i,"MENU_ONE_LEVEL_ID");
			
		if(strMenuId == strMenuOneLevelId){
			var iRow = objDs.getrowcount();
			objDs.insertrow(iRow);
			
			objDs.setdatabyname(iRow , "LEFT_MENU_KEY" , gdsAuthMenu.getdatabyname(i , "MENU_ID") );
			objDs.setdatabyname(iRow , "LEFT_MENU_NM" , gdsAuthMenu.getdatabyname(i , "MENU_NM") );
			objDs.setdatabyname(iRow , "LEFT_MENU_LEVEL" , gdsAuthMenu.getdatabyname(i , "MENU_LEVEL") );
			objDs.setdatabyname(iRow , "LEFT_MENU_IMAGE_LEVEL" , gdsAuthMenu.getdatabyname(i , "LEFT_MENU_IMAGE_LEVEL") );
			objDs.setdatabyname(iRow , "LEFT_MENU_IMAGE_SELECT" , gdsAuthMenu.getdatabyname(i , "LEFT_MENU_IMAGE_SELECT") );
		}
	}
}

/*
*  버튼 클릭시
*/
function btnHome_on_mouseup(objInst)
{
	FV_INDEX = 0;
	
	//UT.gfnShowIntro(true);	// 인트로를 보이기
	//SYSVar.WINMAIN_MEMBER.showHome(true);
			
	if(INI.GV_MENU_BEFORE_VIEW == "Y"){	//이전 메뉴가 보이게 처리하기면
		var objTreeScreen = SYSVar.LEFTMAIN_SCREEN;		
		var objViewTree = objTreeScreen.getinstancebyname("treMenu");
		objViewTree.setzorder(0);
	}			
		
	var objLeftScreen = SYSVar.LEFTMAIN_SCREEN;
	var objTtitle = UT.gfnGetObjectByName(objLeftScreen , "MymenuTreeTitle");
	objTtitle.settext(objInst.gettext());	//좌측 메뉴 상단 타이틀 	
	
	//UT.gfnShowLeftMenu(true);	//메뉴 보이기
	//SYSVar.WINMAIN_MEMBER.tabLeft.setvisible(true);
	SYSVar.LEFTMAIN_MEMBER.fnMyMenuShow(true);
	
	SYSVar.LEFTMAIN_MEMBER.fnMyMenuOrderButtonSet(true);
	//CCNConst.TREE_MENU_MEMBER.fnMyMenuOrderButtonSet(true);	//마이메뉴 이동 버튼 보이기
}

/*
* 1댑스 메뉴 클릭시
*/
function btnMain_on_mouseup(objInst)
{
	var btnName = objInst.getname();
	var iMenuIndex = parseInt(btnName.replace("btnMain",""));
	var strMenuId = FV_TOP_MENU_ID_ARY[iMenuIndex];
	
	FV_INDEX = iMenuIndex;
	
	//UT.alert(this.screen , "" , "INI.GV_MENU_BEFORE_VIEW : " + INI.GV_MENU_BEFORE_VIEW);		
	if(INI.GV_MENU_BEFORE_VIEW == "Y"){	//이전 메뉴가 보이게 처리하기면
		var objTreeScreen = SYSVar.LEFTMAIN_SCREEN;		
		var objViewTree = objTreeScreen.getinstancebyname("treMenu_" + iMenuIndex);
		objViewTree.setzorder(0);
		objViewTree.expandall(XFD_TREEITEM_EXPAND);
	}else{		
		gdsLeftMenu.removeallrows();
	
		for(var i=0;i<gdsAuthMenu.getrowcount();i++){
			var strMenuOneLevelId = gdsAuthMenu.getdatabyname(i,"MENU_ONE_LEVEL_ID");
				
			if(strMenuId == strMenuOneLevelId){
				var iRow = gdsLeftMenu.getrowcount();
				gdsLeftMenu.insertrow(iRow);
				
				gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_KEY" , gdsAuthMenu.getdatabyname(i , "MENU_ID") );
				gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_NM" , gdsAuthMenu.getdatabyname(i , "MENU_NM") );
				gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_LEVEL" , gdsAuthMenu.getdatabyname(i , "MENU_LEVEL") );
				gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_IMAGE_LEVEL" , gdsAuthMenu.getdatabyname(i , "LEFT_MENU_IMAGE_LEVEL") );
				gdsLeftMenu.setdatabyname(iRow , "LEFT_MENU_IMAGE_SELECT" , gdsAuthMenu.getdatabyname(i , "LEFT_MENU_IMAGE_SELECT") );
			}
		}			
	}
	
	var objLeftScreen = SYSVar.LEFTMAIN_SCREEN;
	var objTtitle = UT.gfnGetObjectByName(objLeftScreen , "menuTreeTitle");
	objTtitle.settext(objInst.gettext());	//좌측 메뉴 상단 타이틀 	
	
	SYSVar.WINMAIN_MEMBER.tabLeft.setvisible(true);
	//UT.gfnShowLeftMenu(true);	//메뉴 보이기
	
	SYSVar.LEFTMAIN_MEMBER.fnMyMenuShow(false);
	SYSVar.LEFTMAIN_MEMBER.fnMyMenuOrderButtonSet(false);
	//CCNConst.TREE_MENU_MEMBER.fnMyMenuOrderButtonSet(false);	//마이메뉴버튼 숨기기
}

function btnMain1_on_mousein(objInst)
{
    this.btnMain1.setforecolor(255,255,255); 
}

function btnMain1_on_mouseout(objInst)
{
    this.btnMain1.setforecolor(13,37,76); 
}

function btnMain2_on_mousein(objInst)
{
    this.btnMain2.setforecolor(255,255,255); 
}

function btnMain2_on_mouseout(objInst)
{
    this.btnMain2.setforecolor(13,37,76); 
}

function btnMain3_on_mousein(objInst)
{
    this.btnMain3.setforecolor(255,255,255);
}

function btnMain3_on_mouseout(objInst)
{
    this.btnMain3.setforecolor(13,37,76); 
}

function btnMain4_on_mousein(objInst)
{
    this.btnMain4.setforecolor(255,255,255);
}

function btnMain4_on_mouseout(objInst)
{
    this.btnMain4.setforecolor(13,37,76); 
}

function btnMain5_on_mousein(objInst)
{
    this.btnMain5.setforecolor(255,255,255);
}

function btnMain5_on_mouseout(objInst)
{
    this.btnMain5.setforecolor(13,37,76); 
}

function btnMain6_on_mousein(objInst)
{
    this.btnMain6.setforecolor(255,255,255);
}

function btnMain6_on_mouseout(objInst)
{
    this.btnMain6.setforecolor(13,37,76); 
}

function btnMain7_on_mousein(objInst)
{
    this.btnMain7.setforecolor(255,255,255);
}

function btnMain7_on_mouseout(objInst)
{
    this.btnMain7.setforecolor(13,37,76); 
}

function btnMain8_on_mousein(objInst)
{
    this.btnMain8.setforecolor(255,255,255);
}

function btnMain8_on_mouseout(objInst)
{
    this.btnMain8.setforecolor(13,37,76);
}

function btnMain9_on_mousein(objInst)
{
    this.btnMain9.setforecolor(255,255,255);
}

function btnMain9_on_mouseout(objInst)
{
    this.btnMain9.setforecolor(13,37,76);
}

function btnMain10_on_mousein(objInst)
{
    this.btnMain10.setforecolor(255,255,255);
}

function btnMain10_on_mouseout(objInst)
{
    this.btnMain10.setforecolor(13,37,76);
}

function btnLogOff_on_mouseup(objInst)
{
	//factory.browserexit();
	//SYSVar.SELECTED_MIDDLE_TAB.deletealltab();	
	SYSVar.MIDDLE_TAB.deletealltab(true, false);
	SYSVar.ACTIVE_SCREEN = null;
	//SYSVar.HOME_TAB.deletealltab(true, false);
	//SYSVar.STARTMAIN_TAB.deletetab(1);
	//SYSVar.WINMAIN_MEMBER.loadHomeScreen();
	//SYSVar.WINMAIN_MEMBER.showHome(true);
	//SYSVar.STARTMAIN_MEMBER.fnShowLoginMainScreen();		
	SYSVar.STARTMAIN_TAB.settabitemfocus(0,true);
}

function btnClose_on_mouseup(objInst)
{
	SYSVar.WINMAIN_MEMBER.setWideScreen(false);
}

function btnOpen_on_mouseup(objInst)
{
	SYSVar.WINMAIN_MEMBER.setWideScreen(true);
}

function imgLogo_on_click(objInst)
{
	SYSVar.HOME_MEMBER.deleteScreenTab();
	SYSVar.MIDDLE_TAB.deletealltab(true, false);
	SYSVar.HOME_MEMBER.addScreenTab();
}