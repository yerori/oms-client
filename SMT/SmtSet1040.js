/*------------------------------------
* program id : SmtSet1040
* desc	   : 코드관리
* dev date   : 2022-02-15
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
	
	this.btnCommonSearch_on_mouseup();
	
	
	//UT.gfnComboFilterSet(this.screen , [this.cboLangScnCd]);	//해당 콤보에 필터 기능 적용   on_keydown on_focusout 사용
	
}
/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
    ouCode = INI.GV_OU_CODE;
	/*
	필수,일반,비활성화 스타일 적용 스크립트
	objControl : 스타일 적용 대상 객체
	objStyleType : 필수 : Required(R)    일반 : General(G)     비활성 : disable(D)
	objActiveType :필수 : Required(R)    일반 : General(G)     비활성 : disable(D)
	*/
	//비활성 필드 처리
	UT.gfnHrEditorStyle(this.fldMenuID, "D");
	UT.gfnHrEditorStyle(this.fldEshGbn, "D");
	UT.gfnHrEditorStyle(this.fldLvl, "D");
	//UT.gfnHrEditorStyle(this.fldPath, "D");
}
/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	//생성권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_C")) {         
        this.btnLangAddRow.setenable(false);
    }
	//삭제권한
    if(!INI.gfnIsAuthDeptEtc(this.screen,"AT_D")) {         
        this.btnLangDelRow.setenable(false);
    }	
	
	//dsSearch.setdatabyname(iRow , "OBJ_SCN_CD" , "CD");
     //업무 데이터 가져오기
     this.taskData();
     this.task_sch.setselectedcode("0");
     //상위메뉴 데이터 가져오기 
    this.upMenuData();
    //사용여부(입력) 가져오기 
    var params = "GRP_CODE=F010";
    TRN.gfnTranDataSetHandle(this.screen , this.dsActiveFlag , "NONE" , "CLEAR" , "" , "" , "TR_ACTIVEFLAG");
	TRN.gfnCommonTransactionClear(this.screen , "TR_ACTIVEFLAG");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_COMM_CODE1" , "" , "dsActiveFlag" , params);
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_ACTIVE_FLAG" , true , false , false , "TR_ACTIVEFLAG");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		

    //메뉴타입(입력) 가져오기 
    var params = "GRP_CODE=F016";
    TRN.gfnTranDataSetHandle(this.screen , this.dsMenuType , "NONE" , "CLEAR" , "" , "" , "TR_MENU_TYPE");
	TRN.gfnCommonTransactionClear(this.screen , "TR_MENU_TYPE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_COMM_CODE1" , "" , "dsMenuType" , params);
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_MENU_TYPE" , true , false , false , "TR_MENU_TYPE");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)		
	
	//언어종류 가져오기 
	TRN.gfnTranDataSetHandle(this.screen , this.dsCommLangKind , "NONE" , "CLEAR" ,  "" , "" , "TR_CO_LANG_KIND");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_CO_LANG_KIND");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_LANG_KIND" ,"" , "dsCommLangKind");	//조회만	
	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_LANG_KIND" , true , true , false , "TR_CO_LANG_KIND");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)

}
/*
* 상위메뉴 데이터 가져오기 
*/
function upMenuData()
{
	//상위메뉴(입력) 가져오기
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_UPMENU_INPUT");
	TRN.gfnTranDataSetHandle(this.screen , this.dsUpMenuInput, "NONE" , "CLEAR" ,  "" , "" , "TR_UPMENU_INPUT");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_UPMENU_INPUT");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_UP_MENU_I" ,"dsSearch" , "dsUpMenuInput");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_UP_MENU_I" , true , true , false , "TR_UPMENU_INPUT");	// recv_userheader 값에 select 반환 	
	
	//상위메뉴(조회) 가져오기 
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_UPMENU_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsUpMenuSearch, "NONE" , "CLEAR" ,  "" , "" , "TR_UPMENU_SEARCH");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_UPMENU_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_UP_MENU_S" ,"dsSearch" , "dsUpMenuSearch");	//조회만		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_UP_MENU_S" , true , true , false , "TR_UPMENU_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)


}
/*
* 업무 데이터 가져오기 
*/
function taskData()
{
	//업무데이터 가져오기 
	TRN.gfnTranDataSetHandle(this.screen , this.dsTask, "NONE" , "CLEAR" ,  "" , "" , "TRANSACITON_COMMON");	
	TRN.gfnCommonTransactionClear(this.screen, "TRANSACITON_COMMON");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_TASK" ,"" , "dsTask");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_TASK" , true , true , false , "TRANSACITON_COMMON");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)

}

/*
* 검색조건에서 업무가 바뀌었을 경우
* 업무에 해당되는 상위메뉴를 가져온다. 
*/
function task_sch_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{

    //상위메뉴 데이터 가져오기 
    this.upMenuData();	
}

/*
* TREE ITEM 선택 시 수행  
*/


function treeMenu_on_itemclick(objInst, item, iconclick, checkclick)
{
	mode ="U";
	updatePos = this.dsMenu.getpos();	
	//입력화면 값 변경
	this.fldMenuID.settext(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"MENU_ID"));
	this.fldEshGbn.settext(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"ESH_GBN"));
	this.cboUpMenu.setselectedcode(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"UP_MENU_ID")); 
	this.fldOrderNo.settext(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"ORDER_NO"));
	this.fldLvl.settext(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"LVL")); 
	this.cboACtiveFlag.setselectedcode(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"ACTIVE_FLAG")); 
	this.cboMenuType.setselectedcode(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"MENU_TYPE")); 
	this.fldMenuName.settext(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"MENU_NAME")); 
	this.fldPageName.settext(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"PAGE_NAME")); 
	this.fldPathName.settext(this.dsMenu.getdatabyname(this.dsMenu.getpos(),"FORM_NAME"));	
	
	
	//다국어 입력 창 데이터 변경 
	//언어종류 가져오기 
	var menuID = this.dsMenu.getdatabyname(this.dsMenu.getpos(),"MENU_ID") ;
    var params = "MENU_ID="+menuID;
    TRN.gfnTranDataSetHandle(this.screen , this.dsMenuLang , "NONE" , "CLEAR" , "" , "" , "TR_MENU_LANG");
	TRN.gfnCommonTransactionClear(this.screen , "TR_MENU_LANG");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_MENU_LANG" , "" , "dsMenuLang" , params);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_SMT_MENU_LANG" , true , false , false , "TR_MENU_LANG");	
	
	/* 수정모드 변경 */
	for(var i=0;i<this.dsMenuLang.getrowcount();i++){
   	var aryColumn = ["LANG","MENU_ID"]; 
 	  //GRD.gfnGrdCellHandle(this.grdLang , i , aryColumn , "editable" , false);
       GRD.gfnHrGrdCellHandle(this.grdLang, i, aryColumn, "D");  

    }		
}
/*
* 그리드 선택 시 수행  
*/

function grdList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
    //다국어 입력 데이터 가져오기
	this.getLang();
	
}

/*
* 다국어 입력 데이터 가져오기 
*/
function getLang()
{
	
	//다국어 입력 창 데이터 변경 
	var menuID = this.fldMenuID.gettext();
	//if ( UT.isNull(menuID)   ){
	// UT.alert(this.screen , "" , "메뉴 ID 값이 없습니다.");
	//	return;
	//}

    var params = "MENU_ID="+menuID;
    TRN.gfnTranDataSetHandle(this.screen , this.dsMenuLang , "NONE" , "CLEAR" , "" , "" , "TR_MENU_LANG");
	TRN.gfnCommonTransactionClear(this.screen , "TR_MENU_LANG");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_MENU_LANG" , "" , "dsMenuLang" , params);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_SMT_MENU_LANG" , true , false , false , "TR_MENU_LANG");	
	
	/* 수정모드 변경 */
	for(var i=0;i<this.dsMenuLang.getrowcount();i++){
   	var aryColumn = ["LANG","MENU_ID"]; 
 	  //  	GRD.gfnGrdCellHandle(this.grdLang , i , aryColumn , "editable" , false); 
       GRD.gfnHrGrdCellHandle(this.grdLang, i, aryColumn, "D"); 

    }
}

/*
* 상위메뉴 선택 시 수행
* 선택된 상위메뉴에 맞게 level를 조정해 준다.   
*/


function cboUpMenu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{ 
	//var lvl = this.dsUpMenuInput.getdatabyname(UT.gfnFindRow(dsUpMenuInput, "MENU_ID",this.cboUpMenu.getselectedcode() ,1),"LVL");
    var menuID = this.cboUpMenu.getselectedcode();
    var pos = UT.gfnFindRow(this.dsUpMenuInput, "MENU_ID", menuID+"");	
	var lvl = this.dsUpMenuInput.getdatabyname(pos,"LVL");
	lvl = Number(lvl) +1;
	this.fldLvl.settext( lvl); 
}


/*
* 언어 추가 버튼 클릭  
*/

function btnLangAddRow_on_mouseup(objInst)
{
	var menuID = this.fldMenuID.gettext();
	if ( UT.isNull(menuID)   ){
	 UT.alert(this.screen , "" , "메뉴 ID 값이 없습니다.");
		return;
	}
	//UT.alert(this.screen , "" , menuID + "");
	var iRow = GRD.gfnInsertRow(this.screen,this.grdLang,false);
	this.dsMenuLang.setdatabyname(iRow, "MENU_ID", menuID );
	//this.dsItemLangInfo.setdatabyname(iRow, "OBJ_SCN_CD", "ITEM_CODE");  // 세부코드로 set
	//this.dsItemLangInfo.setdatabyname(iRow, "SUB_OBJ_CD", this.dsItemCode.getdatabyname(this.dsItemCode.getpos(),"GRP_CODE") );  // 그룹코드로 set	
}

/*
* 언어 삭제 버튼 클릭  
*/
function btnLangDelRow_on_mouseup(objInst)
{
	GRD.gfnDeleteRow(this.screen,this.grdLang);
}

/*
* 메듀 삭제 버튼 클릭  
*/

function btnDelRow_on_mouseup(objInst)
{

	var menuId = this.dsMenu.getdatabyname(this.dsMenu.getpos(), "MENU_ID"); //공통코드값
	
	if(this.treeMenu.itemhaschildren(this.treeMenu.getselecteditem()) == true )
	{
		UT.alert(screen , "MSG067" , "자식노드가 존재합니다. 자식노드가 존재하지 않는 아이템만 삭제 가능합니다.");
		return false;
	}
	else
	{	
		
			for(var i=0; i<this.dsMenuLang.getrowcount(); i++)
			{				
				if(this.dsMenuLang.getdatabyname(i, "MENU_ID") == menuId )
				{
					this.dsMenuLang.deleterow(i);					
				}
			}

		
		var delPntTreeItem = this.treeMenu.getparentitem(this.treeMenu.getselecteditem()); //선택한 아이템의 부모 아이템값을 return	      
		this.treeMenu.deleteitem(this.treeMenu.getselecteditem());                         //아이템을 삭제
		this.treeMenu.selectitem(delPntTreeItem);                                   //삭제한 아이템의 부모 아이템으로 focus이동 		
	} 
	//저장
	this.btnApply_on_mouseup(objInst);	
	
	//초기화
	this.btnIniRow_on_mouseup(objInst)
}

/*
* 신규 버튼 클릭  
*/

function btnNew_on_mouseup(objInst)
{
	mode = "I";
	//메뉴ID Seq 가져오기 
	TRN.gfnTranDataSetHandle(this.screen , this.dsMenuIDSeq , "NONE" , "CLEAR" ,  "" , "" , "TR_MENU_ID_SEQ");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_MENU_ID_SEQ");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_MENU_ID_SEQ" ,"" , "dsMenuIDSeq");	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_MENU_ID_SEQ" , true , true , false , "TR_MENU_ID_SEQ");
	
    var strOrgSequence = this.dsMenuIDSeq.getdatabyname(this.dsMenuIDSeq.getpos(),"SEQ")
	this.fldMenuID.settext(strOrgSequence);
	this.fldEshGbn.settext("1");
	this.cboUpMenu.setselectedcode(""); 
	this.fldOrderNo.settext("1");
	this.fldLvl.settext(""); 
	this.cboACtiveFlag.setselectedcode("Y"); 
	this.cboMenuType.setselectedcode("PROG"); 
	this.fldMenuName.settext(""); 
	this.fldPageName.settext(""); 
	this.fldPathName.settext(""); 
	this.fldPathName.settext("/");
    //lang 초기화
	this.dsMenuLang.init();	
}

/*
* 저장 버튼 클릭  
*/


function btnApply_on_mouseup(objInst)
{
	var menuID = this.fldMenuID.gettext();
	if ( UT.isNull(menuID)   ){
	    UT.alert(this.screen , "" , "메뉴 ID 값이 없습니다.");
		return;
	}

	var menuName = this.fldMenuName.gettext();
	if ( UT.isNull(menuName)   ){
	    UT.alert(this.screen , "" , "메뉴명이 없습니다.");
		return;
	}	
	var upMenu = this.cboUpMenu.gettext();
	if ( UT.isNull(upMenu)   ){
	    UT.alert(this.screen , "" , "상위메뉴명이 없습니다.");
		return;
	}

    UT.confirm(this.screen,"MSG043","저장하시겠습니까?","",0,"save_confirm");
		
}
/*
* 저장
*/
function fnSaveData()
{
	//ds에 row 추가 
	var iRow;
	if( mode == "I" )
	{
		//그리드에 행주가
		//iRow = GRD.gfnInsertRow(this.screen,this.grdList,false);
		//dsMenu 데이터셋에 행 추가
			iRow = this.dsMenu.getrowcount();
	        this.dsMenu.insertrow(iRow);
		
	
	} else {
		iRow = updatePos;
	}
	// 값 설정	
	this.dsMenu.setdatabyname(iRow, "MENU_ID", this.fldMenuID.gettext());
	this.dsMenu.setdatabyname(iRow, "ESH_GBN", this.fldEshGbn.gettext());
	this.dsMenu.setdatabyname(iRow, "UP_MENU_ID",this.cboUpMenu.getselectedcode());
	this.dsMenu.setdatabyname(iRow, "ORDER_NO", this.fldOrderNo.gettext());
	this.dsMenu.setdatabyname(iRow, "LVL", this.fldLvl.gettext());	
	this.dsMenu.setdatabyname(iRow, "ACTIVE_FLAG_NAME",this.cboACtiveFlag.getselectedcomment());
	this.dsMenu.setdatabyname(iRow, "ACTIVE_FLAG",this.cboACtiveFlag.getselectedcode());
	this.dsMenu.setdatabyname(iRow, "MENU_TYPE", this.cboMenuType.getselectedcode()); 
	this.dsMenu.setdatabyname(iRow, "MENU_TYPE_NAME", this.cboMenuType.getselectedcomment() );     
	this.dsMenu.setdatabyname(iRow, "MENU_NAME", this.fldMenuName.gettext());
	this.dsMenu.setdatabyname(iRow, "H_MENU_NAME", this.fldMenuName.gettext());
	this.dsMenu.setdatabyname(iRow, "PAGE_NAME", this.fldPageName.gettext());
	this.dsMenu.setdatabyname(iRow, "FORM_NAME", this.fldPathName.gettext());
	
    

    
    //DB에 저장(등록, 수정, 삭제)
	//메뉴저장
	TRN.gfnTranDataSetHandle(this.screen , this.dsMenu , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_COM_CO"); //데이터셋 인:ALL 아웃:CLEAR 정의
	TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_COM_CO");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_MENU" , "systemMapper.UPDATE_SMT_MENU" , "systemMapper.DELETE_SMT_MENU", "dsMenu" );	// 추가 수정 삭제
    TRN.gfnCommonTransactionRun(this.screen , "SAVE_SMT_MENU" , true , true , false , "TR_SAVE_COM_CO");

    //다국어 저장
    TRN.gfnTranDataSetHandle(this.screen , this.dsMenuLang , "ALL" , "NONE" ,  "" , "" , "TR_SAVE_MENU_LANG");//데이터셋 인:ALL 아웃:CLEAR 정의
    TRN.gfnCommonTransactionClear(this.screen , "TR_SAVE_MENU_LANG");	//트랜젝션 데이터셋 초기화 (필수)
    TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_MENU_LANG" , "systemMapper.UPDATE_SMT_MENU_LANG" , "systemMapper.DELETE_SMT_MENU_LANG", "dsMenuLang" );
    TRN.gfnCommonTransactionRun(this.screen , "SAVE_SMT_MENU_LANG" , true , true , false , "TR_SAVE_MENU_LANG");
    
    //상위메뉴 데이터 가져오기 
    this.upMenuData();
    //업무 데이터 가져오기
     this.taskData();	
     
}
/*
* 행 초기화 버튼 클릭  
*/

function btnIniRow_on_mouseup(objInst)
{

	this.fldMenuID.settext("");
	this.fldEshGbn.settext("1");
	this.cboUpMenu.setselectedcode(""); 
	this.fldOrderNo.settext("1");
	this.fldLvl.settext(""); 
	this.cboACtiveFlag.setselectedcode("Y"); 
	this.cboMenuType.setselectedcode("PROG"); 
	this.fldMenuName.settext(""); 
	this.fldPageName.settext(""); 
	this.fldPathName.settext(""); 

    this.dsMenu.moveat(this.dsMenu.getpos());
	//lang 초기화
	this.dsMenuLang.init();	
}

/*
* 엑셀 다운로드 버튼 클릭시
* 
*/

function btnExcelDown_on_mouseup(objInst)
{
	this.grdList.downloadexcel("download.xlsx");

}
/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	//입력화면 초기화
	this.fldMenuID.settext("");
	this.fldEshGbn.settext("1");
	this.cboUpMenu.setselectedcode(""); 
	this.fldOrderNo.settext("1");
	this.fldLvl.settext(""); 
	this.cboACtiveFlag.setselectedcode("Y"); 
	this.cboMenuType.setselectedcode("PROG"); 
	this.fldMenuName.settext(""); 
	this.fldPageName.settext(""); 
	this.fldPathName.settext(""); 

   //다국어 초기화
    this.dsMenuLang.init();

	//메뉴 정보 가져오기 
    this.searchDB();
	
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

/*
* 메뉴 정보 가져오기 
*/
function searchDB()
{

	//메뉴 정보 가져오기 
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsMenu, "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_MENU" ,"dsSearch" , "dsMenu");	//조회만	
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "searchMenu" , true , true , false , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
	this.treeMenu.expandall(2);
	this.treeMenu.selectitem(this.treeMenu.getrootitem());



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
		if(this.dsMenu.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsMenu.getrowcount());	//하단메세지 처리
		}

	}
	else if(mapid == 'TR_SAVE_COM_CO')  //저장처리 후
	{
		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	//경고창 처리
		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
		

	}
	else if(mapid == 'TR_SAVE_MENU_LANG')  //저장처리 후
	{
        mode ="U";
		this.searchDB();
	}	
}



function screen_on_messagebox(messagebox_id, result)
{
	if(messagebox_id == "save_confirm") {
		if(result == XFD_MB_RESYES)  {
			this.fnSaveData();
		}	
	}


}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);	
}