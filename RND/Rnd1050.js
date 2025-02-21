/*------------------------------------
* program id : Rnd1050 
* desc	   : 연구원 업무코드 구성 관리
* dev date   : 2024-05-31
* made by    : HS IT Team
*-------------------------------------*/
var fvAuth ;
var addRowNum ;
var objWorkPopExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	P_DATA6: "",	      	// 팝업화면으로 전달할 데이터6
	P_DATA7: "",	      	// 팝업화면으로 전달할 데이터7
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}

/*
* 페이지 온로드
*/
function screen_on_load()
{	
    INI.init(this.screen);  // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet()
{
    //법인 데이터셋 설정 
	UT.gfnGetOuCodes(this.dsOU); // 데이터 셋에 해당 접속자의 권한 체크하여 해당 법인 모두 들고오기
    
    // 검색 조건 초기값 설정 
    this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	this.dsSearch.setdatabyname(iRow, "OU_CODE", INI.GV_OU_CODE);
	
    // 법인 변경 권한 적용
	if(INI.GV_AT_OU == "Y"){
		this.comOu.setenable(true);
    }		
	else{
		this.comOu.setenable(false);
	}
    
    // 권한 체크
    fvAuth = INI.gfnIsAuth(this.screen ,"C") ; // 수정 권한 체크 
    if(fvAuth==true){
		this.btnAddRow.setvisible(true);
		this.btnDelRow.setvisible(true);
    }
    else{
		this.btnAddRow.setvisible(false);
		this.btnDelRow.setvisible(false);
    }
}


/*
* 공통 조회버튼 클릭시 : 조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
    this.fnSearch();
}

/*
*   상세내역 조회 
*/
function fnSearch()
{
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SERACH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList, "NONE" , "CLEAR" ,  "" , "" , "TR_SERACH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_SERACH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMgtMapper.SELECT_RND_WORK_CODE" ,"dsSearch" , "dsList");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "search" , true , true , false , "TR_SERACH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
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
	
	if(mapid == 'TR_SERACH'){ 
		if(this.dsList.getrowcount() > 0){
			if(fvAuth==true){							
				for(var i=0; i < this.dsList.getrowcount(); i++){
					this.grdList.setitemimageshow(i, 5, false);
					this.grdList.setitemimageshow(i, 8, false);
					this.grdList.setitemimageshow(i, 11, false);
					
					this.grdList.setitemeditable(i, 6, true);
					this.grdList.setitemeditable(i, 9, true);
					this.grdList.setitemeditable(i, 12, true);
					
					//this.grdList.setitemeditable(i, 14, false);
					this.grdList.setiteminputtype(i, 14, XFD_GRID_INPUTEDITBOX);
					this.grdList.setitemeditable(i, 15, true);
					this.grdList.setiteminputtype(i, 15, XFD_GRID_INPUTCALENDAR );
				}
		    }
			else{				
				for(var i=0; i < this.dsList.getrowcount(); i++){
					this.grdList.setitemimageshow(i, 5, false);
					this.grdList.setitemimageshow(i, 8, false);
					this.grdList.setitemimageshow(i, 11, false);					
					
					this.grdList.setitemeditable(i, 6, false);
					this.grdList.setitemeditable(i, 9, false);
					this.grdList.setitemeditable(i, 12, false);
					
					this.grdList.setiteminputtype(i, 14, XFD_GRID_INPUTEDITBOX);
					this.grdList.setitemeditable(i, 15, false);
					this.grdList.setiteminputtype(i, 15, XFD_GRID_INPUTEDITBOX);
			    }
			}
			
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount()); // 하단메시지 처리
			return;
		}
    }
}

/*
* 추가 버튼 클릭  
*/
function btnAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdList.getselectrow();
	addRowNum = GRD.gfnInsertRow(this.screen,this.grdList,false,rowCount+1);	
	this.dsList.setdatabyname(addRowNum, "OU_CODE", INI.GV_OU_CODE);
		
	this.grdList.setitemeditable(addRowNum, 6, true);
	this.grdList.setitemeditable(addRowNum, 9, true);
	this.grdList.setitemeditable(addRowNum, 12, true);
	
	this.grdList.setitemeditable(addRowNum, 14, true);
	this.grdList.setiteminputtype(addRowNum, 14, XFD_GRID_INPUTCALENDAR );
}



/*
* 삭제 버튼 클릭  
*/
function btnDelRow_on_mouseup(objInst)
{
	var iRow = this.grdList.getselectrow();
	var usedYN = this.dsList.getdatabyname(iRow , "USED_YN");
	
	if(usedYN=="Y"){
		UT.alert(this.screen,"","이미 해당 업무코드구성은 사용 중이므로 삭제할 수 없습니다.");
		return;
	}
	else{
		var strRowStat = this.dsList.getrowoperation(iRow);
					
		if(strRowStat==XFD_ROWOP_NONE || strRowStat==XFD_ROWOP_UPDATE){
	        UT.confirm(this.screen,"","정말 데이터를 삭제하시겠습니까?","",0,"delete_confirm");
	    }
	    else{
		    GRD.gfnDeleteRow(this.screen,this.grdList);
	    }	    
	}
}

/*
* 메시지 박스 처리
*/
function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "delete_confirm") {	    
		if(result == XFD_MB_RESYES)  {
			GRD.gfnDeleteRow(this.screen,this.grdList);
		}	
	}
	
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
			this.fnSearch();
		}	
	}
}

/*
* 저장 버튼 클릭  
*/
function btnCommonSave_on_mouseup(objInst)
{
	var mainCode = "" ;
	var middleCode = "" ;
	var smallCode = "" ;
	var workCode = "" ;
	var mainName = "" ;
	var middleName = "" ;
	var smallName = "" ;
	var workName = "" ;
	
	for(var i=0;i<this.dsList.getrowcount();i++){		
		//필수 항목 검사		 
		mainCode = this.dsList.getdatabyname(i,"MAIN_CODE");
		mainName= this.dsList.getdatabyname(i,"MAIN_NAME");
		if( UT.isNull(mainCode)){ 
		    UT.alert(this.screen , "" , "업무성격를 선택하세요.");
		    return;
		}
		middleCode = this.dsList.getdatabyname(i,"MIDDLE_CODE");
		middleName= this.dsList.getdatabyname(i,"MIDDLE_NAME");
		if( UT.isNull(middleCode)){ 
		    UT.alert(this.screen , "" , "업무단계를 선택하세요.");
		    return;
		}
		smallCode = this.dsList.getdatabyname(i,"SMALL_CODE");
		smallName = this.dsList.getdatabyname(i,"SMALL_NAME");
		if( UT.isNull(smallCode)){ 
		    UT.alert(this.screen , "" , "업무명을 선택하세요.");
		    return;
		}
		var startDate = this.dsList.getdatabyname(i,"START_DATE");
		if( UT.isNull(startDate)){ 
		    UT.alert(this.screen , "" , "시작일자를 선택하세요.");
		    return;
		}	
				
		// 중복 확인 check 
		workName = mainName + "-" + middleName + "-" + smallName ; 
		for(var j=0;j<this.dsList.getrowcount();j++){
			//같은 정부과제가 존재하는지 검사
            var workCodeJ = this.dsList.getdatabyname(j,"MAIN_CODE") + "-" + this.dsList.getdatabyname(j,"MIDDLE_CODE") + "-" + this.dsList.getdatabyname(j,"SMALL_CODE") ; 
			if( (i!=j) && (workCode == workCodeJ) ){	
		       UT.alert(this.screen , "" , workName + "[그리드] >> " + UT.gfnGetMsgMetaData("MSG358","중복된 데이터가 존재합니다.",""));		
		   	return; 
			}
		}	
	}
	
    //TABLE에서 중복 확인
	for(var i=0;i<this.dsList.getrowcount();i++){	
		var strRowStat = this.dsList.getrowoperation(i); 
		mainCode = this.dsList.getdatabyname(i,"MAIN_CODE");
		middleCode = this.dsList.getdatabyname(i,"MIDDLE_CODE");
		smallCode = this.dsList.getdatabyname(i,"SMALL_CODE");
	    mainName = this.dsList.getdatabyname(i,"MAIN_NAME");
	    middleName = this.dsList.getdatabyname(i,"MIDDLE_NAME");
	    smallName = this.dsList.getdatabyname(i,"SMALL_NAME");
	    workName = mainName + "-" + middleName + "-" + smallName ;
	
		if(strRowStat == XFD_ROWOP_INSERT || strRowStat == XFD_ROWOP_UPDATE){			
			var params = "O_CNT=" + "" + " O_ERROR_MSG=" + "";
		    params = params + " I_OU_CODE=" + INI.GV_OU_CODE + " I_MAIN_CODE=" + mainCode + " I_MIDDLE_CODE=" + middleCode + " I_SMALL_CODE=" + smallCode;
			TRN.gfnTranDataSetHandle(this.screen , this.dsValidation, "NONE" , "CLEAR" ,  "" , "" , "TR_VALIDATION");
			TRN.gfnCommonTransactionClear(this.screen , "TR_VALIDATION");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMgtMapper.CHECK_RND_WORK_CODE_DUP" , "" , "dsValidation" , params);
            TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_VALIDATION");  

            if(strRowStat == XFD_ROWOP_INSERT && this.dsValidation.getdatabyname(this.dsValidation.getpos() ,"O_CNT") != "0"){
	        	UT.alert(this.screen , "" , workName + "[DB] >> " + UT.gfnGetMsgMetaData("MSG358","중복된 데이터가 존재합니다.",""));	
	    		return;
            }
            
            if(strRowStat == XFD_ROWOP_UPDATE && this.dsValidation.getdatabyname(this.dsValidation.getpos() ,"O_CNT") > "1"){
	        	UT.alert(this.screen , "" , workName + "[DB] >> " + UT.gfnGetMsgMetaData("MSG358","중복된 데이터가 존재합니다.",""));	
	    		return;
            }
		}
	}	
		
    UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");		
}

function fnSaveData()
{
    //DB에 저장(등록, 수정, 삭제)
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COMMON"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COMMON");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "RndWorkHourMgtMapper.INSERT_WORK_CODE" , "RndWorkHourMgtMapper.UPDATE_WORK_CODE" , "RndWorkHourMgtMapper.DELETE_WORK_CODE", "dsList" );	// 추가 수정 삭제
    TRN.gfnCommonTransactionRun(this.screen , "save" , true , true , false , "TR_SAVE_COMMON"); 		 
}

/*
* 업무코드 POPUP
*/ 
function grdList_on_columnclick(objInst, nColumn, bBtnClick, nImgIndex, strImgUrl)
{
	var popupName = this.grdList.getcolumnname(nColumn) ;	
	this.btnPopup_on_click(popupName);
}

function btnPopup_on_click(popup_type)
{
	if(popup_type=="MAIN_POPUP"){
		var strPopupName = UT.gfnGetMetaData("", "업무성격 조회"); 
		objWorkPopExtraData.P_DATA1 = "R001" ; 
		objWorkPopExtraData.P_DATA2 = "업무성격";
		objWorkPopExtraData.P_DATA3 = "";
		objWorkPopExtraData.P_DATA4 = "";
		objWorkPopExtraData.P_DATA5 = "";
		objWorkPopExtraData.RETURN_FUNCTION_NAME = "fnClosePopCallback";
		screen.loadportletpopup("WorkSelect1", "/RND/Rnd1051", "업무성격 조회", false, 0, 0, 0, 686, 410, true, true, false, objWorkPopExtraData);
	}
	else if(popup_type=="MIDDLE_POPUP"){
		if(this.grdList.getitemtextbyname(addRowNum, "MAIN_CODE")==""){
			UT.alert(this.screen,"","업무성격이 선택되지 않았습니다.");
			return;
		}
		
		var strPopupName = UT.gfnGetMetaData("", "업무단계 조회"); 
		objWorkPopExtraData.P_DATA1 = "R002" ;  
		objWorkPopExtraData.P_DATA2 = "업무단계";
		objWorkPopExtraData.P_DATA3 = "";
		objWorkPopExtraData.P_DATA4 = "";
		objWorkPopExtraData.P_DATA5 = "";
		objWorkPopExtraData.RETURN_FUNCTION_NAME = "fnClosePopCallback";
		screen.loadportletpopup("WorkSelect2", "/RND/Rnd1051", "업무단계 조회", false, 0, 0, 0, 686, 410, true, true, false, objWorkPopExtraData);
	}
	else if(popup_type=="SMALL_POPUP"){
		if(this.grdList.getitemtextbyname(addRowNum, "MAIN_CODE")==""){
			UT.alert(this.screen,"","업무성격이 선택되지 않았습니다.");
			return;
		}
		
		if(this.grdList.getitemtextbyname(addRowNum, "MIDDLE_CODE")==""){
			UT.alert(this.screen,"","업무단계가 선택되지 않았습니다.");
			return;
		}
		
		var strPopupName = UT.gfnGetMetaData("", "업무명 조회"); 
		objWorkPopExtraData.P_DATA1 = "R003" ; 
		objWorkPopExtraData.P_DATA2 = "업무명";
		objWorkPopExtraData.P_DATA3 = "";
		objWorkPopExtraData.P_DATA4 = "";
		objWorkPopExtraData.P_DATA5 = "";
		objWorkPopExtraData.RETURN_FUNCTION_NAME = "fnClosePopCallback";
		screen.loadportletpopup("WorkSelect3", "/RND/Rnd1051", "업무명 조회", false, 0, 0, 0, 686, 410, true, true, false, objWorkPopExtraData);
	}
}

function fnClosePopCallback(aryHash) 
{ 
	var params = "O_SORT_NO=" + "" + " O_ERROR_MSG=" + ""  + " I_OU_CODE=" + INI.GV_OU_CODE ;
	
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
	    if(objWorkPopExtraData.P_DATA1=="R001"){
		    this.grdList.setitemtextbyname(addRowNum, "MAIN_CODE", aryHash["CODE"]);
		    this.grdList.setitemtextbyname(addRowNum, "MAIN_NAME", aryHash["NAME"]);
		    this.grdList.setitemtextbyname(addRowNum, "MIDDLE_CODE", "");
		    this.grdList.setitemtextbyname(addRowNum, "MIDDLE_NAME", "");
		    this.grdList.setitemtextbyname(addRowNum, "MIDDLE_SORT_NO", "");
		    this.grdList.setitemtextbyname(addRowNum, "SMALL_CODE", "");
		    this.grdList.setitemtextbyname(addRowNum, "SMALL_NAME", "");
		    this.grdList.setitemtextbyname(addRowNum, "SMALL_SORT_NO", "");
		    
		    params = params + " I_MAIN_CODE=" + aryHash["CODE"] + " I_MIDDLE_CODE=" + "" + " I_SMALL_CODE=" + "";
			this.getSortNo(params);
			if(this.dsSortNo.getdatabyname(0,"O_SORT_NO")=="-999"){
				UT.alert(this.screen,"","정렬번호 가져오는 중 오류가 발생했습니다. IT팀에 연락하세요! - " + this.dsSortNo.getdatabyname(0,"O_ERROR_MSG"));
		        this.grdList.setitemtextbyname(addRowNum, "MAIN_CODE", "");
		        this.grdList.setitemtextbyname(addRowNum, "MAIN_NAME", "");
		        this.grdList.setitemtextbyname(addRowNum, "MAIN_SORT_NO", "");
		        this.grdList.setitemtextbyname(addRowNum, "MIDDLE_CODE", "");
		        this.grdList.setitemtextbyname(addRowNum, "MIDDLE_NAME", "");
		        this.grdList.setitemtextbyname(addRowNum, "MIDDLE_SORT_NO", "");
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_CODE", "");
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_NAME", "");
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_SORT_NO", "");
				return;
			}
			else{
				this.grdList.setitemtextbyname(addRowNum, "MAIN_SORT_NO", this.dsSortNo.getdatabyname(0,"O_SORT_NO"));
			}
	    }
	    else if(objWorkPopExtraData.P_DATA1=="R002"){
		    this.grdList.setitemtextbyname(addRowNum, "MIDDLE_CODE", aryHash["CODE"]);
		    this.grdList.setitemtextbyname(addRowNum, "MIDDLE_NAME", aryHash["NAME"]);
		    this.grdList.setitemtextbyname(addRowNum, "SMALL_CODE", "");
		    this.grdList.setitemtextbyname(addRowNum, "SMALL_NAME", "");
		    this.grdList.setitemtextbyname(addRowNum, "SMALL_SORT_NO", "");
		
		    params = params + " I_MAIN_CODE=" + this.grdList.getitemtextbyname(addRowNum, "MAIN_CODE") + " I_MIDDLE_CODE=" + aryHash["CODE"] + " I_SMALL_CODE=" + "";
			this.getSortNo(params);
			if(this.dsSortNo.getdatabyname(0,"O_SORT_NO")=="-999"){
				UT.alert(this.screen,"","정렬번호 가져오는 중 오류가 발생했습니다. IT팀에 연락하세요! - " + this.dsSortNo.getdatabyname(0,"O_ERROR_MSG"));
		        this.grdList.setitemtextbyname(addRowNum, "MIDDLE_CODE", "");
		        this.grdList.setitemtextbyname(addRowNum, "MIDDLE_NAME", "");
		        this.grdList.setitemtextbyname(addRowNum, "MIDDLE_SORT_NO", "");
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_CODE", "");
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_NAME", "");
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_SORT_NO", "");
				return;
			}
			else{
				this.grdList.setitemtextbyname(addRowNum, "MIDDLE_SORT_NO", this.dsSortNo.getdatabyname(0,"O_SORT_NO"));
			}
	    }
	    else if(objWorkPopExtraData.P_DATA1=="R003"){
		    this.grdList.setitemtextbyname(addRowNum, "SMALL_CODE", aryHash["CODE"]);
		    this.grdList.setitemtextbyname(addRowNum, "SMALL_NAME", aryHash["NAME"]);
		
		    params = params + " I_MAIN_CODE=" + this.grdList.getitemtextbyname(addRowNum, "MAIN_CODE")+ " I_MIDDLE_CODE=" + this.grdList.getitemtextbyname(addRowNum, "MIDDLE_CODE") + " I_SMALL_CODE=" + aryHash["CODE"];
			this.getSortNo(params);
			if(this.dsSortNo.getdatabyname(0,"O_SORT_NO")=="-999"){
				UT.alert(this.screen,"","정렬번호 가져오는 중 오류가 발생했습니다. IT팀에 연락하세요! - " + this.dsSortNo.getdatabyname(0,"O_ERROR_MSG"));
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_CODE", "");
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_NAME", "");
		        this.grdList.setitemtextbyname(addRowNum, "SMALL_SORT_NO", "");
				return;
			}
			else{
				this.grdList.setitemtextbyname(addRowNum, "SMALL_SORT_NO", this.dsSortNo.getdatabyname(0,"O_SORT_NO"));
			}
	    }
	}
	
	// 설정했던 objWorkPopExtraData 초기화
	objWorkPopExtraData.P_DATA1 = "";
	objWorkPopExtraData.P_DATA2 = "";
	objWorkPopExtraData.P_DATA3 = "";
	objWorkPopExtraData.P_DATA4 = "";
	objWorkPopExtraData.P_DATA5 = "";
	objWorkPopExtraData.RETURN_FUNCTION_NAME = "";
}

function getSortNo(parameters){
	TRN.gfnTranDataSetHandle(this.screen , this.dsSortNo, "NONE" , "CLEAR" ,  "" , "" , "TR_SORT_NO");
	TRN.gfnCommonTransactionClear(this.screen , "TR_SORT_NO");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMgtMapper.GET_SORT_NO" , "" , "dsSortNo" , parameters);
    TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_SORT_NO"); 
}