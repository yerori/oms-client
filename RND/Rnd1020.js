/*------------------------------------
* program id : Rnd1013
* desc	   : 정부과제 등록
* dev date   : 2024-05-08
* made by    : HS IT Team
*-------------------------------------*/
var searchCount = 0 ;
var ouCode = INI.GV_OU_CODE;
var editMode;//POPUP에 의해 수정되는지 확인 
var fvSelectedRow;	//그리드 선택된 row
var authScope;

// 팝업화면으로 전달할 파라미터 설정
var objPopupExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	P_DATA6: "",	      	// 팝업화면으로 전달할 데이터6
	P_DATA7: "",	      	// 팝업화면으로 전달할 데이터7
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
};
/************************************************************************************************/
/* 화면 초기 on load
/************************************************************************************************/

/*
* 페이지 온로드
*/
function screen_on_load()
{
    INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();        // 검색조건 세팅	
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
}

/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화    
    //OU변경 권한을 가진 자 만 활성     
    if( INI.GV_AT_OU != "Y"){
	   this.comOu.setenable( false );
    }
  
    editMode ="P";

    //사용자 변경권한 
    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
        authScope = "DEPT";
    } else {
        if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
	    	authScope = "EMP";  
	    } else{
        	authScope = "PINFO";
           // this.btnDelegatePop.setvisible(false);
        }  

   }
   //생성권한
   if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_C")) {           
       this.btnAddRow.setvisible(false);    
       this.btnAddRow.setenable(false);
       this.grdList.setcolumneditable(this.grdList.getcolumn("TASK_CODE"),false);
   }
	//삭제권한
   if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_D")) {         
       this.btnDelRow.setvisible(false);    
       this.btnDelRow.setenable(false);
       this.grdList.setcolumneditable(this.grdList.getcolumn("TASK_NAME"),false);
   }
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet()
{
	//법인 데이터셋 설정 
	UT.gfnGetOuCodes(this.dsOU); // 데이터 셋에 해당 접속자의 권한 체크하여 해당 법인 모두 들고오기
	
	//조건 초기값 설정 
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	this.dsSearch.setdatabyname(iRow, "OU_CODE", INI.GV_OU_CODE);
	
	//초기화
    editMode = "";
  
     //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU == "Y"){
	   this.comOu.setenable( true );
    }
    else{
	   this.comOu.setenable( false );
    }
    editMode ="P"; 
      
    //사용자 변경권한 
    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
        authScope = "DEPT";
    } 
    else{
        if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
	    	authScope = "EMP";  
	    } else{
        	authScope = "PINFO";
        }  
    } 
}

/************************************************************************************************/
/* 공통버튼 영역
/************************************************************************************************/
/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
    var checkIUD = "N";
    for(var i=0;i<this.dsList.getrowcount();i++){	
		var strRowStat = this.dsList.getrowoperation(i);
		if(strRowStat == "I" || strRowStat == "U"){
			checkIUD = "Y";
			break;
		}
    }
    
    // 삭제된 건이 있는 지 체크, 조회시 건수와 현재 건수를 체크하여 차이 나면 삭제되었다고 봄.
    // 입력,수정된 건이 있으면 굳이 삭제된 건을 체크할 필요가 없으므로 checkIUD가 "N"만 체크함.
    if(checkIUD == "N" && searchCount != this.dsList.getrowcount()){
        checkIUD = "Y";
    }
 
    if(checkIUD=="Y"){
        UT.confirm(this.screen,"","입력,수정,삭제중인 데이터가 있습니다. 무시하고 닫으시겠습니까?","",0,"close_confirm");
    }
    else{
	    INI.gfnMdiTabClose();
    }
}

/*
* 추가 버튼 클릭  
*/
function btnAddRow_on_mouseup(objInst)
{
	var rowCount = this.grdList.getselectrow();
	var iRow = GRD.gfnInsertRow(this.screen,this.grdList,false,rowCount+1);	
	this.dsList.setdatabyname(iRow, "OU_CODE", ouCode );

}

/*
* 삭제 버튼 클릭  
*/
function btnDelRow_on_mouseup(objInst)
{
	if(this.dsList.getdatabyname(this.grdList.getselectrow(),"USED_YN")=="Y"){
	    UT.alert(this.screen,"","이미 사용 중인 정부과제는 삭제할 수 없습니다.");
	    return;
	}
    else{	
	    GRD.gfnDeleteRow(this.screen,this.grdList);	
    }
}

/*
* 저장 버튼 클릭  
*/
function btnCommonSave_on_mouseup(objInst)
{
	for(var i=0;i<this.dsList.getrowcount();i++){		
		//필수 항목 검사		 
		var taskCode = this.dsList.getdatabyname(i,"TASK_CODE");
		if( UT.isNull(taskCode)){ 
		    UT.alert(this.screen , "" , "정부과제코드를 입력하세요.");
		    return;
		}
		var taskName = this.dsList.getdatabyname(i,"TASK_NAME");
		if( UT.isNull(taskName)){ 
		    UT.alert(this.screen , "" , "정부과제명을 입력하세요.");
		    return;
		}		 
				
		// 중복 확인 check  	 
		for(var j=0;j<this.dsList.getrowcount();j++){
			//같은 정부과제가 존재하는지 검사
            var taskCodeJ = this.dsList.getdatabyname(j,"TASK_CODE");	   
			if( (i!=j) && (taskCode == taskCodeJ) ){	
		       UT.alert(this.screen , "" , taskCode + "[그리드] >> " + UT.gfnGetMsgMetaData("MSG358","중복된 데이터가 존재합니다.",""));		
		   	return; 
			}
		}	
	}
	
    //TABLE에서 중복 확인
	for(var i=0;i<this.dsList.getrowcount();i++){	
		var strRowStat = this.dsList.getrowoperation(i);
	
		if(strRowStat == XFD_ROWOP_INSERT || strRowStat == XFD_ROWOP_UPDATE){
			var taskCode = this.dsList.getdatabyname(i,"TASK_CODE");			
			
			var params = "O_CNT=" + "" + " O_ERROR_MSG=" + "";
		    params = params + " I_OU_CODE=" + ouCode + " I_TASK_CODE=" + taskCode ;
			TRN.gfnTranDataSetHandle(this.screen , this.dsValidation, "NONE" , "CLEAR" ,  "" , "" , "TR_VALIDATION");
			TRN.gfnCommonTransactionClear(this.screen , "TR_VALIDATION");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_RND_GOV_TASK_DUP_CHK" , "" , "dsValidation" , params);
            TRN.gfnCommonTransactionRun(this.screen , "SelectProc", true, true, false, "TR_VALIDATION");  

            if(strRowStat == XFD_ROWOP_INSERT && this.dsValidation.getdatabyname(this.dsValidation.getpos() ,"O_CNT") != "0"){
	        	UT.alert(this.screen , "" , taskCode + "[DB] >> " + UT.gfnGetMsgMetaData("MSG358","중복된 데이터가 존재합니다.",""));	
	    		return;
            }
            
            if(strRowStat == XFD_ROWOP_UPDATE && this.dsValidation.getdatabyname(this.dsValidation.getpos() ,"O_CNT") > "1"){
	        	UT.alert(this.screen , "" , taskCode + "[DB] >> " + UT.gfnGetMsgMetaData("MSG358","중복된 데이터가 존재합니다.",""));	
	    		return;
            }
		}
	}	
		
    UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");		
}

/*
* 공통 조회버튼 클릭시
* 조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	// 조회 
    this.fnSearch();	
}

/*
* 저장
*/
function fnSaveData()
{
    //DB에 저장(등록, 수정, 삭제)
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "RndWorkHourMapper.INSERT_GOV_TASK" , "RndWorkHourMapper.UPDATE_GOV_TASK" , "RndWorkHourMapper.DELETE_GOV_TASK", "dsList" );	// 추가 수정 삭제
    TRN.gfnCommonTransactionRun(this.screen , "save" , true , true , false , "TR_SAVE_COM_CO"); 		 
}
/*
* 조회 
*/
function fnSearch()
{
    TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMapper.SELECT_GOV_TASK" ,"dsSearch" , "dsList");	//조회만
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
	
	if(mapid == "TR_SEARCH") //공통코드 그룹코드 데이터셋팅후
	{		
		if(this.dsList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} 
		else {
			//this.grdList.setcolumneditable(this.grdList.getcolumn("TASK_CODE"), false);
			
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리
			searchCount =  this.dsList.getrowcount() ;
		}
	}
	else if(mapid == "TR_SAVE_COM_CO")  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리		
	    this.fnSearch();
	}	
}

/*
* 메시지 박스 처리
*/
function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
		}	
	}
	
	if(messagebox_id == "close_confirm") {	    
		if(result == XFD_MB_RESYES)  {
	        INI.gfnMdiTabClose();
	    }
    }
}

function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	ouCode = this.comOu.getselectedcode();
	this.dsList.removeallrows();
}