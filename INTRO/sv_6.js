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
	SYSVar.SUB6_SCREEN = this.screen;
	SYSVar.SUB6_MEMBER = this.screen.getmembers();
	//this.grdRef.setcolumnwidth(2,30);
	this.fnPsoMyStat();
}

/*
* 나의 PSO 진행 현황 가져오기
*/
function fnPsoMyStat(){		
	
	var params = "OU_CODE=" + INI.GV_OU_CODE ;
	params += " USER_ID=" + INI.GV_USER_ID;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoMyStatSum , "NONE" , "CLEAR" ,  "" , "" , "TR_PSO_MY_STAT");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoMyStat    , "NONE" , "CLEAR" ,  "" , "" , "TR_PSO_MY_STAT");
	TRN.gfnCommonTransactionClear(this.screen, "TR_PSO_MY_STAT");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_PSO_MY_STAT_SUMMARY" ,"" , "dsPsoMyStatSum", params);	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_PSO_MY_STAT" ,"" , "dsPsoMyStat", params);	
	TRN.gfnCommonTransactionRun(this.screen , "selectPsoMyStat" , true , true , false , "TR_PSO_MY_STAT");

}

/*
* 첨부파일 Image Set
*/
//function fnAttImgSet(){
//	for(i=0; i < this.dsReference.getrowcount(); i++){
//		if(this.dsReference.getdatabyname(i,"ATTCH_FLAG") == "Y"){
//			this.grdRef.setitemimage(i,2,"/icon_attached.png",false);
//		}
//	}
//	this.grdRef.refresh();
//}

//function btnDetailView_on_mouseup(objInst)
//{
//	var boardId = this.dsReference.getdatabyname( this.dsReference.getpos(), "BOARD_ID");
//	var boardNo = this.dsReference.getdatabyname( this.dsReference.getpos(), "BOARD_NO");
//	var writerId = this.dsReference.getdatabyname( this.dsReference.getpos(), "INS_USER_ID");
//	if( UT.isNull(boardNo)){
//		UT.alert(this.screen , "" , "자료실 라인을 먼저 선택하세요.");
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
//	screen.loadportletpopup("ref_view", "/SMT/SmtSet1230", "자료실 상세", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);
//}
//
//function grdRef_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick)
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
//		if(this.dsReference.getrowcount() > 0){
//			// 첨부파일 Image Set
//			for(i=0; i < this.dsReference.getrowcount(); i++){
//				if(this.dsReference.getdatabyname(i,"ATTCH_FLAG") == "Y"){
//					this.grdRef.setitemimage(i,2,"/icon_attached.png",false);
//				}
//			}
//			this.grdRef.refresh();	
//		}
//	}
//}

function grdList_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	var ouCode = this.dsPsoMyStat.getdatabyname( this.dsPsoMyStat.getpos(), "OU_CODE");
	var projectCode = this.dsPsoMyStat.getdatabyname( this.dsPsoMyStat.getpos(), "PROJECT_CODE");
	var psodocuID = this.dsPsoMyStat.getdatabyname( this.dsPsoMyStat.getpos(), "PSO_DOCU_ID");
	if( UT.isNull(projectCode)){
		UT.alert(this.screen , "MSG228" , "프로젝트를 먼저 선택하세요.");
		return;
	}
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode; 
	objPopupExtraData.P_DATA2 = projectCode;
	objPopupExtraData.P_DATA3 = psodocuID;
	objPopupExtraData.P_DATA4 = "V";  //V:조회 
	
	UT.gfnOpenMenuByURL("/PSO/Pso1050",objPopupExtraData);
}