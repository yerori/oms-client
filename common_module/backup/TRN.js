/*-----------------------------------------------------------------------------------------------------------------

FV_TRS_NAME	:	공통 트랜젝션 TRAN_MAP ID	
FV_DS_NAME	:	공통 트랜젝션 데이터 셋
FV_BASE_URL	:	기본 베이스 URL;
FV_CONSOLE_PRINT_RESULT	:	트랜젠션 실행시 factory.consoleprint 여부

gfnCommonTransactionClear(objScreen , strTranMapId)	:	해당 스크린에 공통 트랜젝션 데이터셋을 생성합니다
gfnCommonTransactionAddSearch(objScreen , strSelectSql , strInDataset , strOutDataset , strParams)	:	트랜젝션데이터셋에 조회 데이터를 추가합니다
gfnCommonTransactionAddInsert(objScreen , strInsetSql , strInDataset , strParams)	:	트랜젝션데이터셋에 등록 데이터를 추가합니다
gfnCommonTransactionAddUpdate(objScreen , strUpdateSql , strInDataset , strParams)	:	트랜젝션데이터셋에 수정 데이터를 추가합니다
gfnCommonTransactionAddDelete(objScreen , strDeleteSql , strInDataset , strParams)	:	트랜젝션데이터셋에 삭제 데이터를 추가합니다
gfnCommonTransactionAddSave(objScreen , strInsetSql , strUpdateSql , strDeleteSql , strInDataset , strParams)	:	트랜젝션데이터셋에 추가 , 수정 , 삭제 데이터를 추가합니다
gfnCommonTransactionAddAll(objScreen , strSelectSql , strInsetSql , strUpdateSql , strDeleteSql , strInDataset , strOutDataset , strParams)	:	트랜젝션데이터셋에 데이터를 추가합니다	
gfnCommonTransactionRun(objScreen , strLogicType , blSync , blCallBack , blWait , strTranMapId , strBaseUrl)	:	트랜젝션을 실행합니다

gfnTranDataSetHandle(objScreen , objDataSet , strInputType , strOutPutType  , strAryInColumn , strAryOutColumn , strTranMapId)	:	해당데이터셋의 인풋 , 아웃풋 값을 핸들링 합니다
----------------------------------------------------------------------------------------------------------------- */

var FV_TRS_NAME = "TRANSACITON_COMMON";				//공통 트랜젝션 TRAN_MAP ID	
var FV_DS_NAME = "dsCommonTransaction";				//공통 트랜젝션 데이터 셋
//var FV_BASE_URL = "http://127.0.0.1:8080/hrm/xframe";		//기본 베이스 URL;
//var FV_BASE_URL = "http://152.149.2.55:9000/hrm/xframe";		//기본 베이스 URL;
var FV_BASE_URL;		//기본 베이스 URL;
var FV_CONSOLE_PRINT_RESULT = true;					//트랜젠션 실행시 factory.consoleprint 여부



/*
* 해당 스크린에 공통 트랜젝션 데이터셋을 생성합니다
* objScreen    : (object) 스크린 객체
* strTranMapId : (string) 실행할 트란맵 아이디
*/
function gfnCommonTransactionClear(objScreen , strTranMapId){	
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnCommonTransactionClear 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnCommonTransactionClear 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	if(UT.isNull(strTranMapId)){
		strTranMapId = FV_TRS_NAME;
	}
					
	var iResultCreateDataset = objScreen.addxdataset(FV_DS_NAME , "");	//데이터셋 생성
	
	if(iResultCreateDataset == 0 || iResultCreateDataset == -2){		//0 , -2 실패
		objScreen.alert("[gfnCommonTransactionClear 개발자 확인] 공통 " + FV_DS_NAME +" 생성실패");
		return;
	}else if(iResultCreateDataset == -1){	//이미존재
		var objDataset = objScreen.getxdataset(FV_DS_NAME);
		objDataset.removeallrows();
	}else if(iResultCreateDataset == 1){	//이상없이 생성
		var objDataset = objScreen.getxdataset(FV_DS_NAME);		
		objDataset.addcolumn("SELECT_SQL","",255);
		objDataset.addcolumn("INSERT_SQL","",255);
		objDataset.addcolumn("UPDATE_SQL","",255);
		objDataset.addcolumn("DELETE_SQL","",255);
		objDataset.addcolumn("IN_DATASET","",255);
		objDataset.addcolumn("OUT_DATASET","",255);
		objDataset.addcolumn("PARAM","",255);
	}	

	objScreen.setxtranmapiotype(strTranMapId, FV_DS_NAME , XFD_XDATASET_TRAN_ALL , XFD_XDATASET_TRAN_UPDATE );	
	objScreen.setxtranmapiocolumn(strTranMapId , FV_DS_NAME , "SELECT_SQL" , true , true);
	objScreen.setxtranmapiocolumn(strTranMapId , FV_DS_NAME , "INSERT_SQL"  , true , true);
	objScreen.setxtranmapiocolumn(strTranMapId , FV_DS_NAME , "UPDATE_SQL"  , true , true);
	objScreen.setxtranmapiocolumn(strTranMapId , FV_DS_NAME , "DELETE_SQL"  , true , true);
	objScreen.setxtranmapiocolumn(strTranMapId , FV_DS_NAME , "IN_DATASET"  , true , true);
	objScreen.setxtranmapiocolumn(strTranMapId , FV_DS_NAME , "OUT_DATASET"  , true , true);
	objScreen.setxtranmapiocolumn(strTranMapId , FV_DS_NAME , "PARAM"  , true , true);
}



/*
* 트랜젝션데이터셋에 조회 데이터를 추가합니다
* objScreen  	 : (object) 스크린 객체
* strSelectSql	: (string) 조회 쿼리 아이디
* strInDataset	: (string) 입력에 이용될 데이터셋명
* strOutDataset   : (string) 출력에 이용될 데이터셋명
* strParams   	: (string) 입력 보조 파라메터 문자열 (ex: A=B C=A)
*/
function gfnCommonTransactionAddSearch(objScreen , strSelectSql , strInDataset , strOutDataset , strParams){	
	gfnCommonTransactionAddAll(objScreen , strSelectSql , "" , "" , "" , strInDataset , strOutDataset , strParams);
}


/*
* 트랜젝션데이터셋에 등록 데이터를 추가합니다
* objScreen  	 : (object) 스크린 객체
* strInsetSql	 : (string) 추가 쿼리 아이디
* strInDataset	: (string) 입력에 이용될 데이터셋명
* strParams   	: (string) 입력 보조 파라메터 문자열 (ex: A=B C=A)
*/
function gfnCommonTransactionAddInsert(objScreen , strInsetSql , strInDataset , strParams){	
	gfnCommonTransactionAddAll(objScreen , "" , strInsetSql , "" , "" , strInDataset , "" , strParams);
}


/*
* 트랜젝션데이터셋에 수정 데이터를 추가합니다
* objScreen  	 : (object) 스크린 객체
* strUpdateSql	: (string) 수정 쿼리 아이디
* strInDataset	: (string) 입력에 이용될 데이터셋명
* strParams   	: (string) 입력 보조 파라메터 문자열 (ex: A=B C=A)
*/
function gfnCommonTransactionAddUpdate(objScreen , strUpdateSql , strInDataset , strParams){	
	gfnCommonTransactionAddAll(objScreen , "" , "" , strUpdateSql , "" , strInDataset , "" , strParams);
}



/*
* 트랜젝션데이터셋에 삭제 데이터를 추가합니다
* objScreen  	 : (object) 스크린 객체
* strDeleteSql	: (string) 삭제 쿼리아이디
* strInDataset	: (string) 입력에 이용될 데이터셋명
* strParams   	: (string) 입력 보조 파라메터 문자열 (ex: A=B C=A)
*/
function gfnCommonTransactionAddDelete(objScreen , strDeleteSql , strInDataset , strParams){	
	gfnCommonTransactionAddAll(objScreen , "" , "" , "" , strDeleteSql , strInDataset , "" , strParams);
}

/*
* 트랜젝션데이터셋에 추가 , 수정 , 삭제 데이터를 추가합니다
* objScreen  	 : (object) 스크린 객체
* strInsetSql	 : (string) 추가 쿼리 아이디
* strUpdateSql	: (string) 수정 쿼리 아이디
* strDeleteSql	: (string) 삭제 쿼리아이디
* strInDataset	: (string) 입력에 이용될 데이터셋명
* strParams   	: (string) 입력 보조 파라메터 문자열 (ex: A=B C=A)
*/
function gfnCommonTransactionAddSave(objScreen , strInsetSql , strUpdateSql , strDeleteSql , strInDataset , strParams){	
	gfnCommonTransactionAddAll(objScreen , "" , strInsetSql , strUpdateSql , strDeleteSql , strInDataset , "" , strParams);
}

/*
* 트랜젝션데이터셋에 데이터를 추가합니다
* objScreen  	 : (object) 스크린 객체
* strSelectSql	: (string) 조회 쿼리 아이디
* strInsetSql	 : (string) 추가 쿼리 아이디
* strUpdateSql	: (string) 수정 쿼리 아이디
* strDeleteSql	: (string) 삭제 쿼리아이디
* strInDataset	: (string) 입력에 이용될 데이터셋명
* strOutDataset   : (string) 출력에 이용될 데이터셋명
* strParams   	: (string) 입력 보조 파라메터 문자열 (ex: A=B C=A)
*/
function gfnCommonTransactionAddAll(objScreen , strSelectSql , strInsetSql , strUpdateSql , strDeleteSql , strInDataset , strOutDataset , strParams){	
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnCommonTransactionAddAll 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnCommonTransactionAddAll 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}		
		
	// 업무 화면의 멤버를 구함
	var objBizScreenMember = objScreen.getmembers(XFD_JAVASCRIPT);
	if(!factory.isobject(objBizScreenMember)) {
		UT.alert(objScreen , "" , "업무 화면의 멤버를 찾을 수 없습니다.");
		return false;
	}
		
	var objDataset = objScreen.getxdataset(FV_DS_NAME);
	var iRow = objDataset.getrowcount();
	objDataset.insertrow(iRow);
	
	if(!UT.isNull(strSelectSql)){
		objDataset.setdatabyname(iRow , "SELECT_SQL" , strSelectSql);
	}
	
	if(!UT.isNull(strInsetSql)){
		objDataset.setdatabyname(iRow , "INSERT_SQL" , strInsetSql);
	}
	
	if(!UT.isNull(strUpdateSql)){
		objDataset.setdatabyname(iRow , "UPDATE_SQL" , strUpdateSql);
	}
	
	if(!UT.isNull(strDeleteSql)){
		objDataset.setdatabyname(iRow , "DELETE_SQL" , strDeleteSql);
	}

	if(!UT.isNull(strInDataset)){	//입력 데이터셋이 널이 아니면
		objDataset.setdatabyname(iRow , "IN_DATASET" , strInDataset);		
	}
	
	if(!UT.isNull(strOutDataset)){
		objDataset.setdatabyname(iRow , "OUT_DATASET" , strOutDataset);
	}
	
//	var strAdminYn = "";
//	if(INI.GV_ADMIN){	//어드민일경우
//		strAdminYn = "Y";
//	}
	
	var strAppendParam = "GV_OU_CODE=" + INI.GV_OU_CODE + " GV_USER_ID=" + INI.GV_USER_ID + " GV_LANG=" + INI.GV_LANG; 
	//+ " GV_ADMIN=" + strAdminYn+ " GV_EENO=" + INI.GV_EENO + " GV_ERP_LOGIN_ID=" + INI.GV_ERP_LOGIN_ID
	strAppendParam += " GV_EMP_NO=" + INI.GV_EMP_NO + " GV_NAME=" + INI.GV_USER_ID_NM;  
	//+ " GV_LEGAL_ORG_ID=" + INI.GV_LEGAL_ENTITY+ " GV_OPERATING_ORG_ID=" + INI.GV_OPERATING_ORG_ID
	//+ " GV_NAME=" + INI.GV_USER_ID_NM+ " GV_DEPT_NAME=" + INI.GV_DEPT_NAME+ " GV_GRADE1_NAME=" + INI.GV_PAY_GRADE1_NAME
	strAppendParam += " GV_VENDOR_CODE=" + INI.GV_VENDOR_CODE + " GV_USER_TYPE=" + INI.GV_USER_TYPE;
	//+ " GV_DEPT_CODE=" + INI.GV_DEPT_CODE+ " GV_COA_DEPT_CODE=" + INI.GV_COA_DEPT_CODE + " GV_COA_DEPT_NAME=" + INI.GV_COA_DEPT_NAME  
	//+ " GV_ORG_ID=" + INI.GV_ORG_ID + " GV_SET_OF_BOOKS_ID=" + INI.GV_SET_OF_BOOKS_ID + " GV_USER_ROLE=" + INI.GV_USER_ROLE ;
	//strAppendParam += " GV_USER_IP_ADDR=" + factory.getlocalipaddress();
	strAppendParam += " GV_USER_IP_ADDR=" + SYSVar.LOCAL_IP_ADDR;
	
	if(!UT.isNull(strParams)){
		objDataset.setdatabyname(iRow , "PARAM" , strParams + " " + strAppendParam);
	}else{
		objDataset.setdatabyname(iRow , "PARAM" , strAppendParam);
	}	
}



/*
* 트랜젝션을 실행합니다
* objScreen  	: (object) 스크린 객체
* strLogicType   : (string) 해당 로직 구분 명
* blSync  	   : (boolean) 싱크방식
* blCallBack     : (boolean) 싱크시 콜백 호출여부
* blWait     	: (boolean) 진행중 모달 보여주기 여부
* strTranMapId   : (string) 실행할 트란맵 아이디
* strBaseUrl     : (string) 기초 URL* strBaseUrl     : (string) 
*/
function gfnCommonTransactionRun(objScreen , strLogicType , blSync , blCallBack , blWait , strTranMapId , strBaseUrl){
	//UT.trace("gfnCommonTransactionRun start 1" + factory.getsystemtime("%h:%m:%s %ms")) ;
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnCommonTransactionRun 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnCommonTransactionRun 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	if(UT.isNull(strTranMapId)){
		strTranMapId = FV_TRS_NAME;
	}
							
//	if(UT.isNull(blSync)){
//		blSync = false;
//	}
	if(UT.isNull(blSync)){
		blSync = true;
	}
	
	if(UT.isNull(blCallBack)){
		if(blSync){
			blCallBack = false;
		}else{
			blCallBack = true;
		}
	}
	
	if(UT.isNull(blWait)){		
		blWait = true;
	}
		
	if(UT.isNull(strBaseUrl)){
		strBaseUrl = FV_BASE_URL;
	}	
	
	if(UT.isNull(strLogicType)){
		UT.alert(objScreen , "" , "[gfnCommonTransactionRun 개발자 오류] Logic 명(문자형)을 넘겨주세요");
		return;
	}

	if(FV_CONSOLE_PRINT_RESULT){	//콘솔 프린트 true 시
		factory.consoleprint("requestsubmit screen = " + objScreen.getscreenid());
		factory.consoleprint("requestsubmit LogicType = " + strLogicType);	
		factory.consoleprint("requestsubmit blSync = " + blSync);	
		factory.consoleprint("requestsubmit BASEURL = " + strBaseUrl);		
	}
	
	if(strLogicType != "logInfoSystemLog"){		//시스템 로그가 아닐경우
		gfnTranLogInsert(objScreen);	//트랜젝션 로그 insert 추가 
	}	
			
	factory.setsubmitbaseurl(strBaseUrl);		
	
	objScreen.setuserheader(strLogicType);
	
//	if(blWait){
//		//UT.gfnShowWait(objScreen);			//진행중 팝업
//		objScreen.setscreenprotect(true);
//	}
		
	if(blSync){	//동기일경우		(true)		
	
		objScreen.requestsubmit(strTranMapId, false);	
	
//		console.log("objScreen.getscreenprotect() : " + objScreen.getscreenprotect());
//		console.log("blWait : " + blWait);
//		if(blWait){
//			if(objScreen.getscreenprotect()==true){
//				objScreen.setscreenprotect(false);
//				objScreen.setscreenprotect(true);
//			} else {
//				objScreen.setscreenprotect(true);
//			}
//			objScreen.setscreenprotect(true);
//		}
		
		var objTranResult = objScreen.getsubmitresult();
		
		//UT.gfnWaitDestroy(objScreen);	//진행중 없애기		
		
		var nResult = objTranResult.result;
		var strRecvUserHeader = objTranResult.recvuserheader;
		var strRecvCode = objTranResult.recvcode;
		var strRecvMsg = objTranResult.recvmsg;
			
		if(blCallBack){			
			if(objScreen.findscriptmethod(XFD_JAVASCRIPT, "screen_on_submitcomplete")){	
				var objScreenMember = objScreen.getmembers(XFD_JAVASCRIPT);	
				objScreenMember.screen_on_submitcomplete(strTranMapId, nResult, strRecvUserHeader, strRecvCode, strRecvMsg);
			}
		}else{
			var aryHash = [];
			aryHash["mapid"] = strTranMapId;
			aryHash["result"] = nResult;
			aryHash["recv_userheader"] = strRecvUserHeader;
			aryHash["recv_code"] = strRecvCode;
			aryHash["recv_msg"] = strRecvMsg;
			
			if(strRecvCode != 0){
				UT.alert(objScreen , "" , strRecvMsg);
			}else{
				return aryHash;
			}
		}
	}else{
		//비동기일경우 null  또는 false
		var rt = objScreen.requestsubmit(strTranMapId, true);
		
		//console.log("objScreen.getscreenprotect() : " + objScreen.getscreenprotect());
		//console.log("blWait : " + blWait);
		if(blWait){
			if(objScreen.getscreenprotect()==true){
				objScreen.setscreenprotect(false);
				objScreen.setscreenprotect(true);
			} else {
				objScreen.setscreenprotect(true);
			}
			objScreen.setscreenprotect(true);
		}
		
		
		var objTranResult = objScreen.getsubmitresult();
		
		//UT.gfnWaitDestroy(objScreen);	//진행중 없애기		
		
		var nResult = objTranResult.result;
		var strRecvUserHeader = objTranResult.recvuserheader;
		var strRecvCode = objTranResult.recvcode;
		var strRecvMsg = objTranResult.recvmsg;
			
		if(blCallBack){			
			if(objScreen.findscriptmethod(XFD_JAVASCRIPT, "screen_on_submitcomplete")){	
				var objScreenMember = objScreen.getmembers(XFD_JAVASCRIPT);	
				objScreenMember.screen_on_submitcomplete(strTranMapId, nResult, strRecvUserHeader, strRecvCode, strRecvMsg);
			}
		}else{
			var aryHash = [];
			aryHash["mapid"] = strTranMapId;
			aryHash["result"] = nResult;
			aryHash["recv_userheader"] = strRecvUserHeader;
			aryHash["recv_code"] = strRecvCode;
			aryHash["recv_msg"] = strRecvMsg;
			
			if(strRecvCode != 0){
				UT.alert(objScreen , "" , strRecvMsg);
			}else{
				return aryHash;
			}
		}
	}
	//UT.trace("gfnCommonTransactionRun end" + factory.getsystemtime("%h:%m:%s %ms")) ;
}





/*
* 로그 정보를 삽입합니다
* objScreen  		: (object) 스크린 객체
*/
function gfnTranLogInsert(objScreen){
	var objDataset = objScreen.getxdataset(FV_DS_NAME);	
	
	var strLogNotes = "";
	
	for(var i=0;i<objDataset.getrowcount();i++){
		var strSQuery = objDataset.getdatabyname(i,"SELECT_SQL");
		var strIQuery = objDataset.getdatabyname(i,"INSERT_SQL");
		var strUQuery = objDataset.getdatabyname(i,"UPDATE_SQL");
		var strDQuery = objDataset.getdatabyname(i,"DELETE_SQL");

		if(i!=0){
			strLogNotes += ",";
		}
		
		strLogNotes += "[" + strSQuery + "," + strIQuery + "," + strUQuery + "," + strDQuery + "]";
	}
	
	var strTranLogParam = "LOG_K_CD=LOG005";
	//strTranLogParam += " USER_IP_ADDR=" + factory.getlocalipaddress();
	strTranLogParam += " USER_IP_ADDR=" + SYSVar.LOCAL_IP_ADDR;
	strTranLogParam += " LOG_NOTE=" + strLogNotes;
	strTranLogParam += " LOG_OBJ_ID=" + objScreen.getscreenid();	
		
	gfnCommonTransactionAddInsert(objScreen , "systemMapper.INSERT_SMT_LOG_INFO" , "" , strTranLogParam);	//로그를 추가합니다
}
 


/*
* 해당데이터셋의 인풋 , 아웃풋 값을 핸들링 합니다
* objScreen  		: (object) 스크린 객체
* objDataSet		 : (object) 데이터셋 객체
* strInputType 	  : (string) "" , null , "ALL" ,"UPDATE" , "CHECK" , "NONE"
* strOutPutType 	 : (string) "" , null , "UPDATE" , "CLEAR" , "NONE"
* strAryInColumn 	: (string[]) 입력에 해당하는 문자열 컬럼 배열  => 매칭 안될시 false 처리
* strAryOutColumn	: (string[]) 출력에 해당하는 문자열 컬럼 배열 => 매칭 안될시 false 처리	
* strTranMapId       : (string) 실행할 트란맵 아이디
*/
function gfnTranDataSetHandle(objScreen , objDataSet , strInputType , strOutPutType  , strAryInColumn , strAryOutColumn , strTranMapId){
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnTranDataSetHandle 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnTranDataSetHandle 개발자 오류] screen 객체를 넘겨주세요");
		return;	
	}
	
	if(UT.isNullObj(objDataSet)){
		UT.alert(objScreen , "" , "[gfnTranDataSetHandle 개발자 오류] dataset 객체를 넘겨주세요");
		return;
	}

	if(UT.isNull(strTranMapId)){
		strTranMapId = FV_TRS_NAME;
	}
	
	if(UT.isNull(strInputType)){
		strInputType = XFD_XDATASET_TRAN_UPDATE;
	}else if(strInputType == "ALL"){
		strInputType = XFD_XDATASET_TRAN_ALL;
	}else if(strInputType == "UPDATE"){
		strInputType = XFD_XDATASET_TRAN_UPDATE ;
	}else if(strInputType == "CHECK"){
		strInputType = XFD_XDATASET_TRAN_CHECK;
	}else if(strInputType == "NONE"){
		strInputType = XFD_XDATASET_TRAN_NONE;
	}
	
	if(UT.isNull(strOutPutType)){
		strOutPutType = XFD_XDATASET_TRAN_DELETE;		
	}else if(strOutPutType == "UPDATE"){
		strOutPutType = XFD_XDATASET_TRAN_UPDATE ;
	}else if(strOutPutType == "CLEAR"){
		strOutPutType = XFD_XDATASET_TRAN_DELETE;
	}else if(strOutPutType == "NONE"){
		strOutPutType = XFD_XDATASET_TRAN_NONE;
	}
	
	var dsName = objDataSet.getid();	
	objScreen.setxtranmapiotype(strTranMapId, dsName , strInputType , strOutPutType);	

	var columnInResult = true;
	var columnOutResult = true;
	
	if(strInputType == XFD_XDATASET_TRAN_NONE){
		columnInResult = false;
	}
	
	if(strOutPutType == XFD_XDATASET_TRAN_NONE){
		columnOutResult = false;
	}
		
	for(var i=0;i<objDataSet.getcolumncount();i++){	//컬럼만큼
		var columnId = objDataSet.getcolumnid(i);		
		var inCatchResult = false;
	
		if(!UT.isNull(strAryInColumn)){	//인컬럼정의시
			for(var j=0;j<strAryInColumn.length;j++){
				if(strAryInColumn[j] == columnId){				
					columnInResult = true;
					break;	
				}
			}
		}	
		
		if(!UT.isNull(strAryOutColumn)){	//인컬럼정의시
			for(var j=0;j<strAryOutColumn.length;j++){
				if(strAryOutColumn[j] == columnId){				
					columnOutResult = true;
					break;	
				}
			}
		}	
		objScreen.setxtranmapiocolumn(strTranMapId , dsName , columnId , columnInResult , columnOutResult);				
	}
}


/*
* 로그 남기기
* strLogKCd	: (string) 로그구분 
* strLogObjId  : (string) 로그오브젝트 아이디
* strLogNote   : (string) 로그비고
*/
function gfnLogInsertProcessor(strLogKCd , strLogObjId , strLogNote){
//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
	var objMainScreen = SYSVar.WINMAIN_SCREEN;
	var objMainScreenMember = SYSVar.WINMAIN_MEMBER;
	
	if(UT.isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnLogInsertProcessor")){ 
		objMainScreenMember.ufnLogInsertProcessor(strLogKCd , strLogObjId , strLogNote);
	}
}