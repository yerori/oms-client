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
	SYSVar.SUB2_SCREEN = this.screen;
	SYSVar.SUB2_MEMBER = this.screen.getmembers();
	this.fnPSOPlanStat();
}

/*
* PSO 진행 요약 (상태) 가져오기
*/
function fnPSOPlanStat(){		
	
	var params = "OU_CODE=" + INI.GV_OU_CODE ;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoPlanStat , "NONE" , "CLEAR" ,  "" , "" , "TR_PSO_PLAN_STAT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_PSO_PLAN_STAT");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_PSO_PLAN_STAT" ,"" , "dsPsoPlanStat", params);	
	TRN.gfnCommonTransactionRun(this.screen , "selectPsoPlanStat" , true , false , false , "TR_PSO_PLAN_STAT");	

}

//function btnDetailView_on_mouseup(objInst)
//{
//	var orderType = this.dsSNStat.getdatabyname( this.dsSNStat.getpos(), "ORDER_TYPE");
//	var asnNum = this.dsSNStat.getdatabyname( this.dsSNStat.getpos(), "ASN_NUM");
//	var vendorCode = this.dsSNStat.getdatabyname( this.dsSNStat.getpos(), "VENDOR_CODE");
//	var vendorName = this.dsSNStat.getdatabyname( this.dsSNStat.getpos(), "VENDOR_NAME");
//	if( UT.isNull(asnNum)){
//		UT.alert(this.screen , "" , "입고현황 라인을 먼저 선택하세요.");
//		return;
//	}
//	objPopupExtraData.clear();
//	objPopupExtraData.P_DATA1 = INI.GV_OU_CODE;
//	objPopupExtraData.P_DATA2 = orderType;	
//	var strMenuURL = "";
//	//오더유형에 따라 화면 분기
//	if(orderType=="OI"){                  //유상사급거래명세서조회
//		strMenuURL = "/ASN/Asn1100";
//	} else if (orderType=="IY") {		 //무상사급거래명세서조회
//		strMenuURL = "/ASN/Asn2030";
//	} else {
//		strMenuURL = "/ASN/Asn1030";	  //나머지. 거래명세서조회
//	}
//	objPopupExtraData.P_DATA3 = asnNum;
//	objPopupExtraData.P_DATA4 = vendorCode;  
//	objPopupExtraData.P_DATA5 = vendorName;  
//	objPopupExtraData.P_DATA6 = "V";  
//		
//	UT.gfnOpenMenuByURL(strMenuURL,objPopupExtraData);
//}
//
//function grdSN_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
//{
//	this.btnDetailView_on_mouseup();
//}