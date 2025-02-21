/*
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */
function _getFrameType() {
	return "BOTTOM_MAIN";
}

/*
 * 화면 최초 로드시에
 */
function screen_on_load()
{
	SYSVar.BOTTOMMAIN_SCREEN = screen;
	SYSVar.BOTTOMMAIN_MEMBER = this;
}

function _setStatusMsg(strMsg)
{
	this.txtStatusMsg.settext(strMsg);
}

function _setSystemId(strId)
{
	this.txSystemIdValue.settext(strId);
}

function txSystemIdValue_on_click(objInst)
{
	let id = objInst.gettext();
	//console.log("id:"+id);
	
	let objExtra_data = {};
	objExtra_data.SCR_ID     = "";
	objExtra_data.SCR_PATH   = "/FRAME/EmpSummaryInfo";
	objExtra_data.MENU_ID    = "EmpSummaryInfo";
	objExtra_data.MENU_NM    = "사용자 정보";
	objExtra_data.P_MENU_ID  = "";
	objExtra_data.PARENT_SCR = screen;
	
	SYSVar.MODULE_MEMBER.loadPopup(screen, objExtra_data, 1);
}

// Tab 전 체닫기
function btnTabAllClose_on_mouseup(objInst)
{
//	if(!UT.confirm(this.screen , "MSG061" , "전체 창을 닫으시겠습니까?")){
//		return;
//	}
//	
//	console.log("1");
////	for(var i=SYSVar.MIDDLE_TAB.gettabitemcount()-1;i>-1;i--){
////		SYSVar.MIDDLE_TAB.deletetab(i);
////	}
//    
	//SYSVar.HOME_MEMBER.deleteScreenTab(); 20230425
	SYSVar.MIDDLE_TAB.deletealltab(true, false);
	//SYSVar.HOME_MEMBER.addScreenTab();
}


//Tab 좌측으로
function btnTabLeft_on_mouseup(objInst)
{
	var iItem = SYSVar.MIDDLE_TAB.gettabitemfocus();
	if(iItem != 0){
		SYSVar.MIDDLE_TAB.settabitemclick(iItem - 1);	
	}	
}


//Tab 우측으로
function btnTabRight_on_mouseup(objInst)
{
	var iItem = SYSVar.MIDDLE_TAB.gettabitemfocus();
	if(iItem != SYSVar.MIDDLE_TAB.gettabitemcount() - 1){
		SYSVar.MIDDLE_TAB.settabitemclick(iItem + 1);	
	}
}

//MyInfo (비밀번호변경)
function btnMyInfo_on_mouseup(objInst)
{
	screen.loadportletpopup("MyInfoSelect", "/FRAME/UserInfoP", "사용자정보조회", false, 0, 0, 0, 624, 330, true, true, false);
}