/*------------------------------------
* program id : popupECommerce
* desc	   : 전자상거래동의
* dev date   : 2023-01-11
* made by    : seyun
*-------------------------------------*/
function screen_on_destroy()
{
	if(!this.chkAgree.getcheck()){
		SYSVar.MIDDLE_TAB.deletealltab(true, false);
		SYSVar.ACTIVE_SCREEN = null;
		SYSVar.STARTMAIN_TAB.settabitemfocus(0,true);
	}
	this.screen.unload();
	return 1;
}

/*
* 닫기버튼시
*/
function btnClose_on_mouseup(objInst)
{		
	if(!this.chkAgree.getcheck()){
		SYSVar.MIDDLE_TAB.deletealltab(true, false);
		SYSVar.ACTIVE_SCREEN = null;
		SYSVar.STARTMAIN_TAB.settabitemfocus(0,true);
	}
	this.screen.unload();
}

/*
* 페이지 온로드
*/
function screen_on_load()
{		
	INI.initPopup(this.screen);	//팝업 공통 
	this.fnDsUserInfoSet();
	this.fnSearch();
}

function fnDsUserInfoSet(){
	this.dsUserInfo.removeallrows();
	var iRow = this.dsUserInfo.getrowcount();
	this.dsUserInfo.insertrow(iRow);
	
	this.dsUserInfo.setdatabyname(this.dsUserInfo.getpos(),"USER_ID",INI.GV_USER_ID);
	this.dsUserInfo.setdatabyname(this.dsUserInfo.getpos(),"E_COMMERCE_YN",INI.GV_E_COMMERCE_YN);
	this.dsUserInfo.setallrowoperation(XFD_ROWOP_UPDATE);
}
/*
* 조회
*/
function fnSearch()
{		
	var params = "AGREE_ID=" + "ECOMMERCE" ;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsAgree, "NONE" , "CLEAR" ,  "" , "", "TR_AGREE" );				   //데이터셋 인:ALL 아웃:CLEAR 정의	
	TRN.gfnCommonTransactionClear(this.screen, "TR_AGREE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_AGREE_CONTENT_SET" ,"" , "dsAgree" , params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectAgreeSet" , true , false , false , "TR_AGREE");
}

function fnAgreeConfirm(){
	
	TRN.gfnTranDataSetHandle(this.screen, this.dsUserInfo, "ALL", "NONE", "", "", "TR_CONFIRM");
    TRN.gfnCommonTransactionClear(this.screen,"TR_CONFIRM");
    TRN.gfnCommonTransactionAddUpdate(this.screen ,"systemMapper.UPDATE_AGREE_ECOMMERCE" ,"dsUserInfo");
	TRN.gfnCommonTransactionRun(this.screen , "ECommerceUpdate", true, true, false, "TR_CONFIRM");
	
	
}

/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "ECommerceUpdate"){	
		this.screen.unload();
	}
	
}

function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "Agree_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnAgreeConfirm();
		}
	}
}

function chkAgree_on_click(objInst)
{
	if(this.chkAgree.getcheck()){
		UT.confirm(this.screen,"","전자상거래 약관에 동의하시겠습니까?","",0,"Agree_confirm");
	}
}