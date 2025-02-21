/*------------------------------------
* program id Pso1052
* desc	   : PSO프로젝트서류목록요약현황 팝업
* dev date   : 2023-07-20
* made by	: SEYUN
*-------------------------------------*/

var fvMultiYn = "N";
var fvFirstSearch = true;
var authScope ="PINFO";
/*
 * 온로드
 */
function screen_on_load()
{
	INI.initPopup(this.screen);	 //팝업 공통 	
	this.fnDsSearchSet();       	//검색조건 세팅
	this.btnSearch_on_mouseup();	
}

/*
 * 검색조건 초기화 및 세팅
 */
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	var objExtraData;
	
    // 팝업화면 열때 전달한 extra_data 얻기
    objExtraData = this.screen.getextradata();
    var searchName  = "";
	if (objExtraData !== null) {
		
		// 초기값 설정
		this.dsSearch.setdatabyname(0, "OU_CODE", objExtraData.P_DATA1);
		this.dsSearch.setdatabyname(0, "PSO_DOCU_ID", objExtraData.P_DATA2);
		authScope   = objExtraData.P_DATA6;
	}

}

/*
 * 조회버튼시
 */
function btnSearch_on_mouseup(objInst){
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsChgList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	
	TRN.gfnTranDataSetHandle(this.screen , this.dsPDList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DOCU_CHG_LIST" ,"dsSearch" , "dsChgList");	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DOCU_PLAN_DATE_LIST" ,"dsSearch" , "dsPDList");	//조회만
	TRN.gfnCommonTransactionRun(this.screen , "select" , false , true , true , "TR_SEARCH");
}

function screen_on_destroy()
{
	this.screen.unload();
	return 1;
}

/*
 * 닫기 버튼 클릭시
 */
function btnClose_on_mouseup(objInst){	
	this.screen.unload();
}

/*
 * 페이지 트랜젝션 콜백
 */
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(screen);	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}

	if(recv_userheader == "select"){
		if(this.dsChgList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		}
		fvFirstSearch = false;	//최초 조회 아님으로 변경
	}
}