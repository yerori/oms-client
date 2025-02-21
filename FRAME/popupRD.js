/*------------------------------------
* program id : popupRD
* desc	   : ReportDesigner Call
* dev date   : 2022-04-06
* made by    : SEYUN
*-------------------------------------*/

/*
* objExtraData.P_DATA1  -- 타이틀
* objExtraData.P_DATA2  -- mrd 파일명 (sample.mrd => sample)
* objExtraData.P_DATA3  -- parameter ([사원번호] [사업장] => [123003][H01])
*/

/*
* 페이지 온로드
*/
function screen_on_load()
{
	INI.initPopup(this.screen);	//팝업 공통 

	this.fnPageSet();	          //받은 데이터로 페이지 세팅
}


/*
* 받은 데이터로 페이지 세팅
*/
function fnPageSet(){
	var objExtraData;
    objExtraData = this.screen.getextradata(); // 팝업화면 열때 전달한 extra_data 얻기
	
	var p_title = "";
	var p_pid = "";
	var p_param = "";
	
	if (objExtraData !== null) {
		p_title = objExtraData.P_DATA1;
		p_pid = objExtraData.P_DATA2;
		p_param = objExtraData.P_DATA3;
	}
	
	var v_url = INI.GV_REPORT_WEB_HTML;
	v_url += "?mid=" + INI.GV_REPORT_MID;
	v_url += "&pid=" + p_pid;
	v_url += "&t=" + p_title;
	v_url += "&p=" + p_param;
	v_url += "&bt=A" ;  // 추후 사용할지 몰라서...
	
	this.openUrl.seturl(v_url);
}

/*
* 닫기버튼시
*/
function btnClose_on_mouseup(objInst)
{
	this.screen.unload();
}



/*
* 최상단 닫기로 닫혔을시
*/
function screen_on_destroy()
{
	this.screen.unload();
	return 1;
}