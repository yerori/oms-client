/*------------------------------------
* program id : popupNotice
* desc	   : [팝업]공지사항
* dev date   : 2023-03-27
* made by    : SEYUN
*-------------------------------------*/
var fvSelectedRow;	//그리드 선택된 row
var pBoardNo;		 // 앞화면에서 전달받은 bordNo 
var pTitle; 		  // 앞화면에서 전달받은 제목 

// 파일첨부 팝업화면으로 전달할 파라미터 설정
var objPopupAttData = {
	P_ATT_ID: "",	         // 팝업화면으로 전달할 데이터1
	P_REF_ID: "",      	   // 팝업화면으로 전달할 데이터1
	P_MODE: "",			   // 팝업화면으로 전달할 데이터1
	P_FILE_GUBUN: "",	     // 팝업화면으로 전달할 데이터2
	P_REF_NAME: "",	       // 팝업화면으로 전달할 데이터3
	P_DIR_TYPE: "",	       // 팝업화면으로 전달할 데이터4
	P_OU_CODE: "",	        // 팝업화면으로 전달할 데이터5
	RET_FUNC_NAME: ""  	   // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};

/************************************************************************************************/
/* 화면 초기 on load
/************************************************************************************************/

/*
* 페이지 온로드
*/
function screen_on_load()
{	
    INI.initPopup(this.screen);	 //팝업 공통 
    this.fnPageSet();               //POPUP 파라메터 처리 
	this.fnSearch();				//Data Search
	
	this.hEditContent.seteditable(false);
    this.hEditContent.setmenubarshow(false);
    this.hEditContent.settoolbarshow(false);
    this.hEditContent.setfootbarshow(false);
}

/*
* 받은 데이터로 페이지 세팅
*/
function fnPageSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);	

	var objExtraData;
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata(true);
	if (objExtraData !== null) {
		// 초기값 설정
		pBoardNo = objExtraData.P_DATA1;
		console.log("pBoardNo : " + pBoardNo);
		pTitle = objExtraData.P_DATA2;
		this.dsSearch.setdatabyname(0, "BOARD_NO", objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(0, "TITLE", objExtraData.P_DATA2);
    }    
}

/*
*   조회 
*/
function fnSearch()
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsPopup, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsAttachList, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_POPUP_NOTICE" ,"dsSearch" , "dsPopup");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_POPUP_ATTACH" ,"dsSearch" , "dsAttachList");	
	TRN.gfnCommonTransactionRun(this.screen , "search" , true , true , false , "TR_SEARCH");	
}

/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	//조회 후
    if(recv_userheader == "search"){
		var strContent = this.dsPopup.getdatabyname( this.dsPopup.getpos(), "CONTENT");
		this.hEditContent.settext(strContent );
	}		
}

function btnClose_on_mouseup(objInst)
{
	if(this.chkTodayClose.getcheck()){
		var strCookieID = "divPop" + pBoardNo;
		factory.setcookie(strCookieID,"Y",1);
	}
	this.screen.unload();
}

function grdAttach_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	if (pBoardNo == "") {
		UT.alert(screen , "" , "등록번호가 없습니다.");
		return;
	}
	
	var strPopupName = UT.gfnGetMetaData("", "첨부파일"); 
	objPopupAttData.clear();
	objPopupAttData.P_ATT_ID = "";
	objPopupAttData.P_REF_ID = pBoardNo;
	objPopupAttData.P_MODE = "R";
	objPopupAttData.P_FILE_GUBUN = "POPUP";
	objPopupAttData.P_REF_NAME = "";
	objPopupAttData.P_DIR_TYPE = "POPB";
	objPopupAttData.P_OU_CODE = INI.GV_OU_CODE;	
	objPopupAttData.RET_FUNC_NAME = "";
	var attPopupName = "AttFilePopup" + pBoardNo;
	screen.loadportletpopup(attPopupName, "/FRAME/AttachFilePop", "첨부파일팝업", false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
}

function screen_on_popupdestroy(popup_screen, popup_name, result)
{
	if(this.chkTodayClose.getcheck()){
		var strCookieID = "divPop" + pBoardNo;
		factory.setcookie(strCookieID,"Y",1);
	}
	this.screen.unload();
	return 1;
}

function chkTodayClose_on_click(objInst) {
	if(this.chkTodayClose.getcheck()){
		var strCookieID = "divPop" + pBoardNo;
		factory.setcookie(strCookieID,"Y",1);
		this.screen.unload();
	}
}