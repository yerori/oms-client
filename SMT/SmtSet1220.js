/*------------------------------------
* program id : SmtSet1220
* desc	   : 게시판
* dev date   : 2022-03-03
* made by    : SEYUN
*-------------------------------------*/

var authScope;
var fvSelectedRow;	//그리드 선택된 row

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
};
/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통

    this.fnGetBoardInfo();
	
	this.fnDsSearchSet();   //검색조건 세팅	
	
	//UT.gfnComboFilterSet(this.screen , [this.cboLangScnCd]);	//해당 콤보에 필터 기능 적용   on_keydown on_focusout 사용
	this.btnCommonSearch_on_mouseup();
}

/*
* board 정보 가져오기
*/
function fnGetBoardInfo(){

	var iRow = INI.gfnMdiGetTabIndexScreenDsRow(this.screen);	//스크린데이터셋에서 나의 mdi 줄 반환
	var strMenuId = gdsScreen.getdatabyname(iRow , "SCREEN_NAME");	
    var vParam = "";
    vParam = "MENU_ID="  + strMenuId;
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsBoardInfo , "NONE" , "CLEAR" ,  "" , "" , "TR_BOARD_INFO");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_BOARD_INFO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "BoardMapper.SELECT_BOARD_INFO" ,"" , "dsBoardInfo",vParam);	//조회만		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_BOARD_INFO" , true , true , false , "TR_BOARD_INFO");
}





/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	var boardID = this.dsBoardInfo.getdatabyname( this.dsBoardInfo.getpos(), "BOARD_ID");
	//BOARD ID 설정
	this.dsSearch.setdatabyname(iRow , "BOARD_ID" , boardID);
	
/*	
	var today = new Date();
	var startDay = new Date(today.getFullYear(), today.getMonth() - 23, 0);

    var dateS=Number(startDay.getFullYear())*10000+Number(startDay.getMonth()+1)*100+today.getDate();
    var dateE=Number(today.getFullYear())*10000+Number(today.getMonth()+1)*100+today.getDate();

*/
    var today = UT.getDate("%Y%M%D");
    var dateS=UT.gfnGetDateByMonthGap(today,-23);
    var dateE=UT.gfnGetDateByMonthGap(today,1);
    this.fldDateS.settext(dateS);
    this.fldDateE.settext(dateE);

    //사용자 변경권한 
    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
        authScope = "DEPT";
    } else {
        if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
	    	authScope = "EMP";  
	    } else{
        	authScope = "PINFO";
        }  

   }
	//생성권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_C")) {         
        this.btnCommonCreate.setenable(false);
    }  

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
	
	if(recv_userheader == "selectLogInfo") 
	{		
		if(this.dsLogList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(screen , "MSG001" , "검색 결과가 없습니다.");
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsLogList.getrowcount());	//하단메세지 처리
		}

	}
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{

	var dateST = this.fldDateS.gettext();
	var dateEd = this.fldDateE.gettext();

	if (! dateST || ! dateEd) {
		UT.alert(this.screen, "", "등록일을 입력하세요"); 
		return; 
	}

	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "BoardMapper.SELECT_SMT_BOARDS_LIST" ,"dsSearch" , "dsList", "TR_SEARCH");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_SMT_BOARDS_LIST" , true , true , false , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}


function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
//		}
//		else if(result == XFD_MB_RESNO)  {
//			return 0;
		}
//		else if(result == XFD_MB_RESCANCEL)  {
//			UT.alert(this.screen,"","[취소]를 선택하셨습니다");
//		}
//		else if(result == XFD_MB_RESCONTINUE)  {
//			UT.alert(this.screen,"","[계속]를 선택하셨습니다");
//		}
	}
	
	if(messagebox_id == "pwdReset_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnPwdReSet();
		}
	}
}



/*
* 날짜 이상유무 확인
*/
function fldDateS_on_change(objInst, event_type)
{
	var datelen = this.fldDateS.gettext();
	
	if(datelen.length == "8"){
		if(this.fldDateS.gettext() != "" && this.fldDateE.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.fldDateS , this.fldDateE , true);
			if(!rt){
				this.fldDateS.settext("");
				this.fldDateS.setfocus();
			}
			
		}
	} 	
}

/*
* 날짜 이상유무 확인
*/
function fldDateE_on_change(objInst, event_type)
{
	var datelen = this.fldDateE.gettext();
	
	if(datelen.length == "8"){
		if(this.fldDateS.gettext() != "" && this.fldDateE.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.fldDateS , this.fldDateE , true);
			if(!rt){
				this.fldDateE.settext("");
				this.fldDateE.setfocus();
			}
			
		}
	}
}

function btnView_on_mouseup(objInst)
{
	
	var boardId = this.dsBoardInfo.getdatabyname( this.dsBoardInfo.getpos(), "BOARD_ID");
	var boardNo = this.dsList.getdatabyname( this.dsList.getpos(), "BOARD_NO");
	var writerId = this.dsList.getdatabyname( this.dsList.getpos(), "INS_USER_ID");
	if( UT.isNull(boardNo)){
		UT.alert(this.screen , "" , "게시글을 선택하세요.");
		return;
	}
	objPopupExtraData.P_DATA1 = boardId; 
	objPopupExtraData.P_DATA2 = boardNo;	
	//게사자와 login user가 같으면 수정 가능
	if ( writerId ==  INI.GV_USER_ID ){
		objPopupExtraData.P_DATA3 = "E";  //E:수정 
	} else {
		objPopupExtraData.P_DATA3 = "V";  //V:조회 
	}	

	objPopupExtraData.P_DATA4 = this.dsBoardInfo.getdatabyname( this.dsBoardInfo.getpos(), "REPLY_FLAG");; //reply_flag
	objPopupExtraData.P_DATA5 = authScope;  
	objPopupExtraData.P_DATA6 = "1"; //lvl
	objPopupExtraData.P_DATA7 = "0"; //P_BOARD
	
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnViewClosePopCallback";
	screen.loadportletpopup("view", "/SMT/SmtSet1230", "게시판 상세", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);	
}

function fnViewClosePopCallback(aryHash) 
{ 
	
	// 설정했던 objPopupExtraData값 초기화
	objPopupExtraData.P_DATA1 = "";
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.P_DATA4 = "";
	objPopupExtraData.P_DATA5 = "";
	objPopupExtraData.P_DATA6 = "";
	objPopupExtraData.P_DATA7 = "";
	objPopupExtraData.P_DATA8 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "";
	
	this.btnCommonSearch_on_mouseup();  //조회
}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);	
}

//신규
function btnCommonCreate_on_mouseup(objInst)
{
	var boardId = this.dsBoardInfo.getdatabyname( this.dsBoardInfo.getpos(), "BOARD_ID");
	var boardNo = this.dsList.getdatabyname( this.dsList.getpos(), "BOARD_NO");
	//var writerId = this.dsList.getdatabyname( this.dsList.getpos(), "INS_USER_ID");

	objPopupExtraData.P_DATA1 = boardId; 
	objPopupExtraData.P_DATA2 = "";	
	objPopupExtraData.P_DATA3 = "I";  //I: 신규생성 	

	objPopupExtraData.P_DATA4 = "";
	objPopupExtraData.P_DATA5 = authScope;  
	objPopupExtraData.P_DATA6 = "1"; //lvl
	objPopupExtraData.P_DATA7 = "0"; //P_BOARD
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnViewClosePopCallback";
	screen.loadportletpopup("New", "/SMT/SmtSet1230", "게시판 글 생성", false, 0, 0, 0, 1200, 551, true, true, false, objPopupExtraData);	
}

function grdMaster_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick)
{
	this.btnView_on_mouseup();
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}