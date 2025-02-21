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

function screen_on_load()
{
	SYSVar.SUB5_SCREEN = this.screen;
	SYSVar.SUB5_MEMBER = this.screen.getmembers();
	//this.grdNoti.setcolumnwidth(1,30);
	this.fnMyPjtStat();
}

/*
* 나의 프로젝트 현황 가져오기
*/
function fnMyPjtStat(){		
	
	var params = "OU_CODE=" + INI.GV_OU_CODE ;
	params += " USER_ID=" + INI.GV_USER_ID;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMyPjtStat , "NONE" , "CLEAR" ,  "" , "" , "TR_MY_PJT_STAT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_MY_PJT_STAT");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_MY_PJT_STAT" ,"" , "dsMyPjtStat", params);	
	TRN.gfnCommonTransactionRun(this.screen , "selectMyPjtStat" , true , false , false , "TR_MY_PJT_STAT");

}

/*
* 첨부파일 Image Set
*/
//function fnAttImgSet(){
//	for(i=0; i < this.dsNotice.getrowcount(); i++){
//		if(this.dsNotice.getdatabyname(i,"ATTCH_FLAG") == "Y"){
//			this.grdNoti.setitemimage(i,1,"/icon_attached.png",false);
//		}
//	}
//	this.grdNoti.refresh();
//}

//function btnDetailView_on_mouseup(objInst)
//{
//	var boardId = this.dsNotice.getdatabyname( this.dsNotice.getpos(), "BOARD_ID");
//	var boardNo = this.dsNotice.getdatabyname( this.dsNotice.getpos(), "BOARD_NO");
//	var writerId = this.dsNotice.getdatabyname( this.dsNotice.getpos(), "INS_USER_ID");
//	if( UT.isNull(boardNo)){
//		UT.alert(this.screen , "" , "공지사항 라인을 먼저 선택하세요.");
//		return;
//	}
//	objPopupExtraData.clear();
//	objPopupExtraData.P_DATA1 = boardId; 
//	objPopupExtraData.P_DATA2 = boardNo;	
//	//게사자와 login user가 같으면 수정 가능
//	if ( writerId ==  INI.GV_USER_ID ){
//		objPopupExtraData.P_DATA3 = "E";  //E:수정 
//	} else {
//		objPopupExtraData.P_DATA3 = "V";  //V:조회 
//	}	
//
//	objPopupExtraData.P_DATA4 = "N";
//	objPopupExtraData.P_DATA5 = "PINFO";  
//	objPopupExtraData.P_DATA6 = "1"; //lvl
//	objPopupExtraData.P_DATA7 = "0"; //P_BOARD
//	
//	screen.loadportletpopup("noti_view", "/SMT/SmtSet1230", "공지사항 상세", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);
//}
//
//function grdNoti_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick)
//{
//	this.btnDetailView_on_mouseup();
//}
//
//function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
//{
//	UT.gfnWaitDestroy(screen);
//	
//	if(recv_code != 0){
//		UT.alert(this.screen , "" , recv_msg);
//		return;
//	}
//	
//	if(recv_userheader == "selectNotice") {		
//		if(this.dsNotice.getrowcount() > 0){
//			// 첨부파일 Image Set
//			for(i=0; i < this.dsNotice.getrowcount(); i++){
//				if(this.dsNotice.getdatabyname(i,"ATTCH_FLAG") == "Y"){
//					this.grdNoti.setitemimage(i,1,"/icon_attached.png",false);
//				}
//			}
//			this.grdNoti.refresh();	
//		}
//	}
//}