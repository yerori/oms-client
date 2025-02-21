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
	SYSVar.SUB1_SCREEN = this.screen;
	SYSVar.SUB1_MEMBER = this.screen.getmembers();
	this.fnRFQStat();
}

/*
* 금년 RFQ 등록 현황 가져오기
*/
function fnRFQStat(){		
	
	var params = "OU_CODE=" + INI.GV_OU_CODE ;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsRfq , "NONE" , "CLEAR" ,  "" , "" , "TR_RFQ_STAT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_RFQ_STAT");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_RFQ_STAT" ,"" , "dsRfq", params);	
	TRN.gfnCommonTransactionRun(this.screen , "selectRFQStat" , true , false , false , "TR_RFQ_STAT");	

}

//function btnDetailView_on_mouseup(objInst)
//{
//	var poNum = this.dsPOStat.getdatabyname( this.dsPOStat.getpos(), "PO_NUM");
//	var vendorCode = this.dsPOStat.getdatabyname( this.dsPOStat.getpos(), "VENDOR_CODE");
//	var vendorName = this.dsPOStat.getdatabyname( this.dsPOStat.getpos(), "VENDOR_NAME");
//	if( UT.isNull(poNum)){
//		UT.alert(this.screen , "" , "발주현황 라인을 먼저 선택하세요.");
//		return;
//	}
//	objPopupExtraData.clear();
//	objPopupExtraData.P_DATA1 = INI.GV_OU_CODE;
//	objPopupExtraData.P_DATA2 = poNum;	
//	objPopupExtraData.P_DATA3 = vendorCode;
//	objPopupExtraData.P_DATA4 = vendorName;  
//	objPopupExtraData.P_DATA5 = "V";  
//		
//	UT.gfnOpenMenuByURL("/ASN/Asn1010",objPopupExtraData);
//}
//
//function grdPO_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
//{
//	this.btnDetailView_on_mouseup();
//}