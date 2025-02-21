/*------------------------------------
* program id : SmtSet1270
* desc	   : 팝업 등록
* dev date   : 2023-04-13
* made by    : SEYUN
*-------------------------------------*/
var ouCode;
var editMode;
var mode;//I: 신규생성, V:상세내역 , E:수정   
var fvSelectedRow;	//그리드 선택된 row
var boardId;
var authScope;
var reply_flag; 
var pTitle; // 앞화면에서 전달받은 제목 
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
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정
	this.fnPageSet();            // POPUP 파라메터 처리 
	
    if( mode == "V" ){  // 수정 불가 
       this.fnSearch();   // 조회
       this.btnCommonCreate.setenable(false);
       this.btnCommonDelete.setenable(false);
       this.btnCommonSave.setenable(false);
       var attachFlag = this.dsInsert.getdatabyname( this.dsInsert.getpos(), "ATTCH_FLAG");
       if ( attachFlag == "N"){
	      this.btnAttach.setenable(false);
       }


       UT.gfnHrEditorStyle(this.fldTitle, "D");

       this.hEditContent.seteditable(false);
       this.hEditContent.setmenubarshow(false);
       this.hEditContent.settoolbarshow(false);
       this.hEditContent.setfootbarshow(false);

 //      UT.gfnHrEditorStyle(this.hEditContent, "D");
     } 

	if( mode =="E") {  //수정 
		this.fnSearch();   // 조회


	}	
	
	if( mode =="I"){  //신규
		this.txtWriter.settext(INI.GV_USER_ID_NM);
		this.dsInsert.setdatabyname(this.dsInsert.getpos(),"TITLE",pTitle);
		this.dsInsert.setdatabyname(this.dsInsert.getpos(),"OU_CODE",INI.GV_OU_CODE);
		//게시 일자
		var today = UT.getDate("%Y%M%D");
	    var dateS=UT.gfnGetDateByMonthGap(today,0);
	    var dateE=UT.gfnGetDateByMonthGap(today,1);
	    this.fldDateFrom.settext(dateS);
	    this.fldDateTo.settext(dateE);		
	}	


}

/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	UT.gfnHrEditorStyle(this.fldBoardNo, "D");
}

/*
* 받은 데이터로 페이지 세팅
*/
function fnPageSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);	

	this.dsInsert.removeallrows();
	var iRow = this.dsInsert.getrowcount();
	this.dsInsert.insertrow(iRow);	
	
	var objExtraData;
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
	if (objExtraData !== null) {
		// 초기값 설정
		boardId = objExtraData.P_DATA1;		
		this.dsSearch.setdatabyname(0, "OU_CODE", INI.GV_OU_CODE);
		this.dsSearch.setdatabyname(0, "BOARD_NO", objExtraData.P_DATA2);
		mode = objExtraData.P_DATA3;
		this.dsInsert.setdatabyname(0, "OU_CODE", INI.GV_OU_CODE);
		this.dsInsert.setdatabyname(0, "BOARD_NO", objExtraData.P_DATA2);
		reply_flag = objExtraData.P_DATA4; 
		authScope = objExtraData.P_DATA5; 		
		pTitle = objExtraData.P_DATA8; 
    }


	//화면초기화
    editMode ="P";
    //사용자 변경권한 
    if(authScope == "PINFO") {         
      // this.btnRequesterPop.setvisible(false);
   }
    

}


/************************************************************************************************/
/* 공통버튼 영역
/************************************************************************************************/
/*
* 신규 버튼 클릭  
*/
function btnCommonCreate_on_mouseup(objInst)
{
   //입력 항목을 reset
	this.dsInsert.removeallrows();
	var iRow = this.dsInsert.getrowcount();
	this.dsInsert.insertrow(iRow);  
		
	this.fnPageSet();

		
}

function fnValidateHeaderRequiredField()
{
    //제목
	var title = this.dsInsert.getdatabyname(0,"TITLE");
	if( UT.isNull(title)){
	   var strfieldName = UT.gfnGetMetaData("LABEL00006", "제목");
	   UT.alert(this.screen , "MSG004" , "제목를 입력하세요.",strfieldName );
	   return false;
	}

    //내용
	var strContent = this.hEditContent.gettext();	
	if(UT.isNull(strContent) ){
	   var strfieldName =  "게시글";
	   UT.alert(this.screen , "MSG004" , "게시글를 입력하세요.", strfieldName);
	   return false;
	}
	this.dsInsert.setdatabyname( this.dsInsert.getpos(),"CONTENT" ,strContent);

	
   return true;
}
/*
* 저장 버튼 클릭  
*/


function btnCommonSave_on_mouseup(objInst)
{	
		
     //Header 필수 항목 검사
    if( !this.fnValidateHeaderRequiredField())
    {
		return false;
    }
				
  
    UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");		
}

/*
* 공통 삭제 버튼 클릭시
* 
*/
function btnCommonDelete_on_mouseup(objInst)
{
	

	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_DELETE");
	TRN.gfnTranDataSetHandle(this.screen , this.dsInsert , "ALL" , "NONE" ,  "" , "" , "TR_DELETE"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_DELETE");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "BoardMapper.DELETE_POPUP" ,"dsSearch" , "dsInsert");
    TRN.gfnCommonTransactionRun(this.screen , "DELETE_POPUP" , true , true , false , "TR_DELETE");	

}


/*
* 저장
*/
function fnSaveData( callbackflag )
{
	var boardNo = this.dsInsert.getdatabyname(this.dsInsert.getpos(), "BOARD_NO");
	if ( UT.isNull( boardNo)) {
	    //BOARD_NO 가져오기 
	    
		TRN.gfnTranDataSetHandle(this.screen , this.dsBoardNo , "NONE" , "CLEAR" ,  "" , "" , "TR_BOARD_NO");
		TRN.gfnCommonTransactionClear(this.screen, "TR_BOARD_NO");	//트랜젝션 데이터셋 초기화 (필수)		//조회만
		TRN.gfnCommonTransactionAddSearch(this.screen , "BoardMapper.SELECT_POPUP_NO" ,"" , "dsBoardNo");	//조회만
		TRN.gfnCommonTransactionRun(this.screen , "GET_BOARD_NO" , true , false , false , "TR_BOARD_NO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
        boardNo= this.dsBoardNo.getdatabyname(this.dsBoardNo.getpos(),"BOARD_NO");
        this.dsInsert.setdatabyname( this.dsInsert.getpos(),"BOARD_NO" ,boardNo);
        this.dsSearch.setdatabyname( this.dsSearch.getpos(),"BOARD_NO" ,boardNo);
}
    //저장
	TRN.gfnTranDataSetHandle(this.screen , this.dsInsert , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "BoardMapper.INSERT_SMT_POPUP" , "BoardMapper.UPDATE_SMT_POPUP" , "", "dsInsert" );// 추가 수정 삭제 삭제
    TRN.gfnCommonTransactionRun(this.screen , "SAVE" , true , callbackflag , false , "TR_SAVE_COM_CO");

  
    return true;
		
}
/*
* 공통 조회버튼 클릭시
* 조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
    this.fnSearch();	
}
/*
*   조회 
*/
function fnSearch()
{

	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsInsert, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsAttachList, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "BoardMapper.SELECT_SMT_POPUP" ,"dsSearch" , "dsInsert");	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "BoardMapper.SELECT_SMT_POPUP_ATTACH" ,"dsSearch" , "dsAttachList");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "search" , true , true , false , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)

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
	
   if(recv_userheader =="SAVE")  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		this.btnClose_on_mouseup();

	}	
   if(mapid == 'TR_DELETE')  //삭제 후
	{
		UT.alert(this.screen , "MSG019" , "삭제되었습니다.");	//경고창 처리
		this.btnClose_on_mouseup();
	}	
   if(mapid == 'TR_SEARCH')  //조회 후
	{
	
		var strContent = this.dsInsert.getdatabyname( this.dsInsert.getpos(), "CONTENT");
	   // UT.alert(this.screen , "" , strContent);
		this.hEditContent.settext(strContent );

	}
	//첨부파일 처리 
	if(  recv_userheader =="ATTACH"){	
        
		var boardNo = this.dsInsert.getdatabyname(this.dsInsert.getpos(), "BOARD_NO");
		if (boardNo == "") {
			UT.alert(screen , "MSG596" , "등록번호가 없습니다.");
			return;
		}
        this.fnSearch();
		var strPopupName = UT.gfnGetMetaData("", "파일첨부"); 
		objPopupAttData.P_ATT_ID = "";
		objPopupAttData.P_REF_ID = "";
		if( mode =="E" ||mode =="I" ) {  /*I: 신규생성, V:상세내역 , E:수정 */
			objPopupAttData.P_MODE = "W"; //W:첨부파일 내리고 올리기 가능.
		}else{
			objPopupAttData.P_MODE = "R"; //R:읽기만 가능
		}	
		objPopupAttData.P_FILE_GUBUN = "POPUP";
		objPopupAttData.P_REF_ID = boardNo;
		objPopupAttData.P_DIR_TYPE = "POPB";
		objPopupAttData.P_OU_CODE = this.dsInsert.getdatabyname(this.dsInsert.getpos(),"OU_CODE");	
		objPopupAttData.RET_FUNC_NAME = "";
		screen.loadportletpopup("AttFile", "/FRAME/AttachFilePop", strPopupName, false, 0, 0, 0, 584, 256, true, true, false, objPopupAttData);
    }    	
}



function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData(true);
		}	
	}

}


/************************************************************************************************/
/* EVENT 처리
/************************************************************************************************/


function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}



function btnClose_on_mouseup(objInst)
{
	//this.screen.unload();
	var aryHash;
	var objExtraData;
	
	// 팝업화면 열때 전달한 extra_data 얻기
	objExtraData = this.screen.getextradata();	
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objExtraData);
}




/**
 * 계산 결과를 부모화면으로 전달 후 팝업을 닫는다.
 * @param aryHash 부모화면으로 전달할 결과값
 * @param objExtraData 부모화면에서 전달된 extra 데이터
 */
function ReturnClosePopup(aryHash, objExtraData) 
{
	var srcParent, scrParentMember;

	// 리턴받는데 사용할 함수명을 전달한 경우
	if (objExtraData != null && objExtraData.RETURN_FUNCTION_NAME !== "") {
		// 부모화면 screen 구하고 유효성 처리
		srcParent = this.screen.getparent();
		if (factory.isobject(srcParent)) {
			// 부모화면의 멤버 오브젝트 구하기
			scrParentMember = srcParent.getmembers();
			if (factory.isobject(scrParentMember) == true) {
				if (factory.isfunction(scrParentMember[objExtraData.RETURN_FUNCTION_NAME])) {
					// 부모화면의 함수를 통하여 값 전달
					scrParentMember[objExtraData.RETURN_FUNCTION_NAME](aryHash);
				}
			}
		}
	}

	// 팝업화면 닫기
	this.screen.unloadpopup(aryHash);
}

/*
*  파일 첨부 클릭시 이벤트
*/

function btnAttach_on_mouseup(objInst)
{	
     //Header 필수 항목 검사
    if( !this.fnValidateHeaderRequiredField())
    {
		return false;
    }
    //저장 후 첨부 	
	var boardNo = this.dsInsert.getdatabyname(this.dsInsert.getpos(), "BOARD_NO");
	if ( UT.isNull( boardNo)) {
	    //BOARD_NO 가져오기 	    
		TRN.gfnTranDataSetHandle(this.screen , this.dsBoardNo , "NONE" , "CLEAR" ,  "" , "" , "TR_BOARD_NO");
		TRN.gfnCommonTransactionClear(this.screen, "TR_BOARD_NO");	//트랜젝션 데이터셋 초기화 (필수)		//조회만
		TRN.gfnCommonTransactionAddSearch(this.screen , "BoardMapper.SELECT_POPUP_NO" ,"" , "dsBoardNo");	//조회만
		TRN.gfnCommonTransactionRun(this.screen , "GET_POPUP_NO" , true , false , false , "TR_BOARD_NO");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
        boardNo= this.dsBoardNo.getdatabyname(this.dsBoardNo.getpos(),"BOARD_NO");
        this.dsInsert.setdatabyname( this.dsInsert.getpos(),"BOARD_NO" ,boardNo);
        this.dsSearch.setdatabyname( this.dsSearch.getpos(),"BOARD_NO" ,boardNo);
   
    }
    //저장
	TRN.gfnTranDataSetHandle(this.screen , this.dsInsert , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "BoardMapper.INSERT_SMT_POPUP" , "BoardMapper.UPDATE_SMT_POPUP" , "", "dsInsert" );// 추가 수정 삭제 삭제
    TRN.gfnCommonTransactionRun(this.screen , "ATTACH" , true , true , false , "TR_SAVE_COM_CO");

    //screen_on_submitcomplete 함수에서 첨부파일 처리 

}




function grdAttach_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.btnAttach_on_mouseup();
}


function fnAttFilePopCallback(aryHash) 
{ 
	// 팝업화면 닫기
	this.screen.unloadpopup(aryHash);
}	

function screen_on_popupdestroy(popup_screen, popup_name, result)
{
	if ( popup_name == "AttFile"){
		
	    var boardNo = this.dsInsert.getdatabyname( this.dsInsert.getpos(), "BOARD_NO");
	    this.dsInsert.setdatabyname( this.dsInsert.getpos(), "ATTATCH_ID", boardNo ); 
		this.fnSaveData( false );
		this.fnSearch();		
	}
}