function screen_on_load()
{
	SYSVar.SUB1_SCREEN = this.screen;
	SYSVar.SUB1_MEMBER = this.screen.getmembers();
	this.fnRndSummary();
}

/*
* 조회
*/
function fnRndSummary(){		
    var workYyyyMm = UT.getDate("%Y%M");
    this.txtYyyyMm.settext("(" + workYyyyMm.substr(0,4) + "년 " + workYyyyMm.substr(4,2) + "월)");

	if(INI.GV_JIKCHAK_NAME=="팀원"){
		var params = "WORK_YYYYMM=" + workYyyyMm ;
		params += " EMP_NO=" + INI.GV_EMP_NO; 
		params += " DEPT_EMP_NO=" + INI.GV_EMP_NO; 
		params += " JIKCHAK_NAME=" + INI.GV_JIKCHAK_NAME; 
		
		//UT.alert(this.screen,"",params);
    } 
    else{
		var params = "WORK_YYYYMM=" + workYyyyMm ;
		params += " EMP_NO=" + ""; 
		params += " DEPT_EMP_NO=" + INI.GV_EMP_NO; 
		params += " JIKCHAK_NAME=" + INI.GV_JIKCHAK_NAME; 
    }
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsRndSummary , "NONE" , "CLEAR" ,  "" , "" , "TR_RND_SUMMARY");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_RND_SUMMARY");		
	TRN.gfnCommonTransactionAddSearch(this.screen , "RndWorkHourMgtMapper.SELECT_RND_SUMMARY1" ,"" , "dsRndSummary", params);	
	TRN.gfnCommonTransactionRun(this.screen , "selectRNDSummary" , true , false , false , "TR_RND_SUMMARY");
}