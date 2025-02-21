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
	SYSVar.SUB3_SCREEN = this.screen;
	SYSVar.SUB3_MEMBER = this.screen.getmembers();
	this.fnPjtStat();
}

/*
* 금년 PJT 진행현황 가져오기
*/
function fnPjtStat(){		
	
	var params = "OU_CODE=" + INI.GV_OU_CODE ;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPjtStat , "NONE" , "CLEAR" ,  "" , "" , "TR_PJT_STAT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_PJT_STAT");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_PJT_STAT" ,"" , "dsPjtStat", params);	
	TRN.gfnCommonTransactionRun(this.screen , "selectPjtStat" , true , false , false , "TR_PJT_STAT");	
}

//function btnDetailView_on_mouseup(objInst)
//{
//	var ouCode = INI.GV_OU_CODE;
//	//var vendorCode = INI.GV_VENDOR_CODE;
//	//var vendorName = INI.GV_VENDOR_NAME;
//	var vendorCode = "80009";
//	var vendorName = "㈜한성전장부산공장";
//	
//	var planDate = this.dsEvalStat.getdatabyname(0, "PLAN_DATE");
//	var evalYear = planDate.substr(0,4);
//	
//	objPopupExtraData.clear();
//	objPopupExtraData.P_DATA1 = ouCode; 
//	objPopupExtraData.P_DATA2 = vendorCode;	
//	objPopupExtraData.P_DATA3 = vendorName;
//	objPopupExtraData.P_DATA4 = evalYear; 
//	objPopupExtraData.P_DATA5 = "V";
//	
//	UT.gfnOpenMenuByURL("/SMT/SmtSet1150",objPopupExtraData);
//}
//
//function grdEval_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
//{
//	this.btnDetailView_on_mouseup();
//}