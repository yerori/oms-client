/*------------------------------------
* program id : SmtSet1050
* desc	   : ROLE 그룹등록
* dev date   : 2022-03-04
* made by    : SEYUN
*-------------------------------------*/
var ouCode;

var fvStrSearchEndObjScnCd;	//조회 완료한 구분 코드
var treeSelectComCoId;         //트리에서 아이템 선택시 comcoid값을 담아준다. 수정시 이전값과 비교하기 위해서
var saveBeforeComCoId;         //저장시 선택되어 있는 dataset의 comcoid 값을 담아준다.
var saveBeforeItemId;          //저장시 선택되어 있는 tree의  item값을 담아준다.
var noneComcoFocusComco;       //트리 추가시 keyin한 comcoid값을 담아준다.
var tempKey = 1;
var beforeMode = "M";
var exsitAfter = 0;
var mode = "I"; // I : insert U: Update
var updatePos = 0; //Update 위치

var fvSelectedRow;	//그리드 선택된 row
/*
* 페이지 온로드
*/
function screen_on_load()
{	

 
    INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통

	
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정
	
	this.fnDsSearchSet();   //검색조건 세팅	
	
	this.fnSearch();  //조회
	
	//this.fnCoLangKind();    //언어종류 가져오기
	
	//this.btnCommonSearch_on_mouseup();  //최초조회
	
	//UT.gfnComboFilterSet(this.screen , [this.cboLangScnCd]);	//해당 콤보에 필터 기능 적용   on_keydown on_focusout 사용
	
}

/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{

	/*
	필수,일반,비활성화 스타일 적용 스크립트
	objControl : 스타일 적용 대상 객체
	objStyleType : 필수 : Required(R)    일반 : General(G)     비활성 : disable(D)
	objActiveType :필수 : Required(R)    일반 : General(G)     비활성 : disable(D)
	*/
	//비활성 필드 처리
	//UT.gfnSetEditorStyle(this.fldMenuID, "D", "D");
	//UT.gfnSetEditorStyle(this.fldEshGbn, "D", "D");
	//UT.gfnSetEditorStyle(this.fldLvl, "D", "D");
	//UT.gfnSetEditorStyle(this.fldPath, "D", "D");
}
/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);

    ouCode = INI.GV_OU_CODE;	
    //OU 가져오기 
    var params = "OU_CODE="+ouCode;
    TRN.gfnTranDataSetHandle(this.screen , this.dsOU , "NONE" , "CLEAR" , "" , "" , "TR_OU");
	TRN.gfnCommonTransactionClear(this.screen , "TR_OU");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_OU_MSTR_LIST" , "" , "dsOU" , params);
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_SMT_OU_MSTR" , true , false , false , "TR_OU");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
    this.fldOu.setselectedcode(ouCode); 

    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.fldOu.setenable( false );
    }    
	//생성권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_C")) {         
        this.btnAddRow.setenable(false);
    }
	//삭제권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_D")) {         
        this.btnDelRow.setenable(false);
    }
}

//트리 그리드 아이템 선택시
function treeGrd_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick)
{
	//ROLE GROUP 가져오기 
	var AUTH_CODE = this.dsAuthLevel.getdatabyname(this.dsAuthLevel.getpos(),"AUTH_CODE");
	var OU_CODE = this.dsAuthLevel.getdatabyname(this.dsAuthLevel.getpos(),"OU_CODE");
    var params = "AUTH_CODE="+AUTH_CODE+" OU_CODE="+OU_CODE;
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuth, "NONE" , "CLEAR" ,  "" , "" , "TR_AUTH");
	TRN.gfnCommonTransactionClear(this.screen , "TR_AUTH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_AUTH" , "" , "dsAuth" , params);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_SMT_AUTH" , true , false , false , "TR_AUTH");	
	
	/* 수정모드 변경 */
	for(var i=0;i<this.dsAuth.getrowcount();i++){
   	var aryColumn = ["AUTH_CODE","AUTH_LEVEL","UP_AUTH_CODE"];   
             GRD.gfnHrGrdCellHandle(this.grdRoleGroup, i, aryColumn, "D");

    }	
	

}





/*
* 저장 버튼 클릭  
*/


function btnCommonSave_on_mouseup(objInst)
{

    //Validation
    //중복확인
	for(var i=0;i<this.dsAuth.getrowcount();i++){	
		var strRowStat = this.dsAuth.getrowoperation(i);
	
		if(strRowStat == XFD_ROWOP_INSERT){
			var AUTH_CODE = this.dsAuth.getdatabyname(i,"AUTH_CODE");
			var OU_CODE = this.dsAuth.getdatabyname(i,"OU_CODE");
		    var params = "AUTH_CODE="+AUTH_CODE+" OU_CODE="+OU_CODE;
			TRN.gfnTranDataSetHandle(this.screen , this.dsValidation, "NONE" , "CLEAR" ,  "" , "" , "TR_VALIDATION");
			TRN.gfnCommonTransactionClear(this.screen , "TR_VALIDATION");	//트랜젝션 데이터셋 초기화 (필수)	
			TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_AUTH_CNT" , "" , "dsValidation" , params);
			TRN.gfnCommonTransactionRun(this.screen , "SELECT_SMT_AUTH_CNT" , true , false , false , "TR_VALIDATION");	
            if(this.dsValidation.getdatabyname(this.dsValidation.getpos() ,"CNT") != "0"){
	        	UT.alert(screen , "" , AUTH_CODE + " : 중복된 그룹코드 입니다."  ); 
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
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

/*
* 저장
*/
function fnSaveData()
{
    //DB에 저장(등록, 수정, 삭제)
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuth , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_AUTH" , "systemMapper.UPDATE_SMT_AUTH" , "systemMapper.DELETE_SMT_AUTH", "dsAuth" );	// 추가 수정 삭제
    TRN.gfnCommonTransactionRun(this.screen , "save" , true , true , false , "TR_SAVE_COM_CO");
		
}
/*
* 메뉴 정보 가져오기 
*/
function fnSearch()
{

	//ROLE GROUP LEVEL  정보 가져오기 
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuthLevel, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsAuth, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_AUTH_LEVEL" ,"dsSearch" , "dsAuthLevel");	//조회만
//	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_AUTH" ,"dsSearch" , "dsAuth");	//조회만		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "search" , true , true , false , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
//	this.treeMenu.expandall(2);
//	this.treeMenu.selectitem(this.treeMenu.getrootitem());

	/* 수정모드 변경 */
	for(var i=0;i<this.dsAuthLevel.getrowcount();i++){
   	var aryColumn = ["AUTH_CODE","AUTH_NAME"]; 
 	    	GRD.gfnHrGrdCellHandle(this.treeGrd , i , aryColumn , "D");  

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
	
	if(mapid == 'TR_SEARCH') //공통코드 그룹코드 데이터셋팅후
	{		
		if(this.dsAuthLevel.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsAuthLevel.getrowcount());	//하단메세지 처리
		}

	}
	else if(mapid == 'TR_SAVE_COM_CO')  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		
		this.fnSearch();
	}	
}



function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
		}	
	}
/*	if(messagebox_id == "") {
		if(result == XFD_MB_RESYES)  {
			UT.alert(this.screen,"","[예]를 선택하셨습니다");
		}
		else if(result == XFD_MB_RESNO)  {
			UT.alert(this.screen,"","[아니오]를 선택하셨습니다");
		}
		else if(result == XFD_MB_RESCANCEL)  {
			UT.alert(this.screen,"","[취소]를 선택하셨습니다");
		}
		else if(result == XFD_MB_RESCONTINUE)  {
			UT.alert(this.screen,"","[계속]를 선택하셨습니다");
		}
	}
*/
}




function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);	
}
//행 삭제
function btnDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdRoleGroup);
}



//행 추가
function btnAddRow_on_mouseup(objInst)
{
	var iRow = this.grdRoleGroup.getrowcount();
	//UT.alert(this.screen,"","rCnt : "+rCnt);
	
	GRD.gfnInsertRow(this.screen, this.grdRoleGroup, false, iRow);   
	
	var lvl = this.dsAuthLevel.getdatabyname(this.dsAuthLevel.getpos(),"AUTH_LEVEL")
	//AUTH_LEVEL 이 null 이면 TOP를 생성
	if( UT.isNull(lvl) ){
	   this.dsAuth.setdatabyname(iRow, "OU_CODE", this.fldOu.getselectedcode() );
	   this.dsAuth.setdatabyname(iRow, "UP_AUTH_CODE","ROOT" );
	   this.dsAuth.setdatabyname(iRow, "AUTH_CODE","TOP" ); 
	   this.dsAuth.setdatabyname(iRow, "AUTH_NAME","TOP" ); 			
	   lvl = 0;
	} else{
	   this.dsAuth.setdatabyname(iRow, "OU_CODE", this.dsAuthLevel.getdatabyname(this.dsAuthLevel.getpos(),"OU_CODE") );
	   this.dsAuth.setdatabyname(iRow, "UP_AUTH_CODE", this.dsAuthLevel.getdatabyname(this.dsAuthLevel.getpos(),"AUTH_CODE") ); 	
	   lvl = Number(lvl) +1;
	}	
	this.dsAuth.setdatabyname(iRow, "AUTH_LEVEL", lvl );
	this.dsAuth.setdatabyname(iRow, "ACTIVE_FLAG", "Y" );
	this.grdRoleGroup.setitemeditstart(iRow, 0 , true);	
}

function fldOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{
	ouCode = this.fldOu.getselectedcode();	
}