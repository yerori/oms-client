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
	SYSVar.SUB4_SCREEN = this.screen;
	SYSVar.SUB4_MEMBER = this.screen.getmembers();
	this.fnPsoDeptStat();
}

/*
* 팀별 진행율 (PSO 진행 프로젝트 기준) 가져오기
*/
function fnPsoDeptStat(){		
	
	var params = "OU_CODE=" + INI.GV_OU_CODE ;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoDeptStat , "NONE" , "CLEAR" ,  "" , "" , "TR_PSO_DEPT_STAT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_PSO_DEPT_STAT");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_PSO_DEPT_STAT" ,"" , "dsPsoDeptStat", params);	
	TRN.gfnCommonTransactionRun(this.screen , "selectPsoDeptStat" , true , false , false , "TR_PSO_DEPT_STAT");	

}

//function btnDetailView_on_mouseup(objInst)
//{
//	var offType = this.dsODocStat.getdatabyname( this.dsODocStat.getpos(), "OFFICIAL_TYPE");
//	var docNum = this.dsODocStat.getdatabyname( this.dsODocStat.getpos(), "DOC_NUM");
//	var vendorCode = this.dsODocStat.getdatabyname( this.dsODocStat.getpos(), "VENDOR_CODE");
//	var vendorName = this.dsODocStat.getdatabyname( this.dsODocStat.getpos(), "VENDOR_NAME");
//	if( UT.isNull(docNum)){
//		UT.alert(this.screen , "" , "공문수신현황 라인을 먼저 선택하세요.");
//		return;
//	}
//	objPopupExtraData.clear();
//	objPopupExtraData.P_DATA1 = INI.GV_OU_CODE;
//	objPopupExtraData.P_DATA2 = offType;	
//	var strMenuURL = "";
//	//공문등록 기준에 따라 공문접수 화면 분기
//	if(offType=="H"){
//		strMenuURL = "/SMT/SmtSet1200";
//	} else {
//		strMenuURL = "/SMT/SmtSet1190";
//	}
//	objPopupExtraData.P_DATA3 = docNum;
//	objPopupExtraData.P_DATA4 = vendorCode;  
//	objPopupExtraData.P_DATA5 = vendorName;  
//	objPopupExtraData.P_DATA6 = "V";  
//		
//	UT.gfnOpenMenuByURL(strMenuURL,objPopupExtraData);
//}
//
//function grdODoc_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
//{
//	this.btnDetailView_on_mouseup();
//}