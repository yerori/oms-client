/*-----------------------------------------------------------------------------------------------------------------

trace(strMsg)	:	트레이에 해당 로그를 찍음
traceDataset(objDataset)	:	데이터셋 을 트레이에 로그를 찍음
traceHashAry(aryHash)	:	트레이에 해당 Hash 형 배열값을 로그를 찍음

getDate(strFormat) 	:	오늘 날짜를 YYYYMMDD 형식으로 구함
getTime()	:	현재 시각을 hhmmss 형식으로 구함

isScreen(objSource)	:	스크린 객체 여부
isNull(strSource)	:	문자열 널 확인 
isNullObj(objSource)	:	객체 널 확인

confirm(objScreen , strMetaCode , strMsg , strTranceMsg)	:	확인 창을 뛰웁니다
alert(objScreen , strMetaCode , strMsg , strTranceMsg)	:	경고 창을 뛰웁니다

statMsg(objScreen , strMetaCode , strMsg , strTranceMsg)	:	메세지 란에 메세지를 삽입합니다

setParam(strKey , strValue)	:	글로벌 param 데이터셋에 value 를 삽입합니다
getParam(strKey , blClear)	:	글로벌 param 데이터셋에서 value를 가져옵니다


------------------------------------------------------------ [ 코드관련 ] ------------------------------------------------------

gfnGetCode(strSupiCodeId , objDataset , strAppendType , blAppend , blGetNotUse)	:	해당 코드데이터셋에 세팅합니다  gfnTranceCodeSet 자동호출
gfnGetChildsCode(strSupiCodeId , objDataset , strAppendType , blAppend , blGetNotUse)	:	해당 코드데이터셋에 세팅합니다  gfnTranceCodeSet 자동호출
gfnGetAndFilterCode(strSupiCodeId , objDataset , iColumn , strFilter , strAppendType , blAppend)	:	해당코드데이터셋에 필터하여 데이터를 세팅함  RESERVED_ iColumn == strFilter
gfnTranceCodeSet(objDataset , strAppendType)	:	해당 코드데이터셋 첫줄에 세팅합니다
gfnSystemCodeLoad(objScreen)	:	글로벌 gdsSystemCode 데이터셋에서 해당 언에에 맞는 코드를 로딩 합니다
gfnGetCodeName(strCode)	:	코드 명칭을 반환합니다
gfnGetPrjIdCodes(objTargetDs , blMyResult)	:	해당 코드성 데이터셋에 프로젝트마스터 정보를 반환합니다  true시 팀정보에 내가있는것만
gfnSetYearComboDs(objDs , iPre , iPost , iYear)	:	코드형 콤보데이터셋에 년도를 삽입해줍니다


------------------------------------------------------------ [ 확인 관련 ] ------------------------------------------------------

gfnValidationObj(objScreen , aryDual , blNotAlertShow)	:	해당 객체들의 값이 널인지의 여부 반환
gfnVaildataionGrd(objScreen , objGrid , aryColumn ,blNotAlertShow)	:	해당 그리드의 필수값을 확인합니다 널여부 반환
gfnVaildataionDs(objScreen , objDs , aryColumn ,blNotAlertShow)	:	해당 그리드의 필수값을 확인합니다 널여부 반환



------------------------------------------------------------ [ 데이터셋 관련 ] ------------------------------------------------------

gfnCopyTowRow(objGetDataset , iGetRow , objSetDataset , iSetRow)	:	해당 줄의 데이터셋을 복사합니다
gfnCopyDataSet(objGetDataset, objSetDataset, strCopyType , blAppend)	:	원본 데이터 셋에서 대상 데이터 셋으로 값을 복사한다.
gfnFindRow(objDataset , strColumn , strSearchValue , iCnt)	:	데이터셋에서 해당줄을 찾습니다	
gfnAndFindRow(objDataset , aryDual)	:	데이터셋에서 해당줄을 찾습니다 (이차원 배열 필요)
gfnLookUp(objDataset , strColumn , strSearchValue , strGetColumn)	:	데이터셋에서 해당줄을 찾습아 해당 컬럼값을 반환합니다
gfnGetCaseCount(objDataset , strColumn , strCatchWord)	:	테이터셋에서 해당 컬럼의 값의 동일 갯술를 반환합니다
gfnGetCaseLikeCount(objDataset , strColumn , strCatchWord)	:	테이터셋에서 해당 컬럼의 값이 동일한 문자를 포함하고 있는 갯술를 반환합니다
gfnIsDatasetUpdate(objDs)	:	데이터셋 업데이트 유무 반환

gfnDsToAry(objDs)	:	데이터셋을 배열로
gfnDsRowToAry(objDs , iRow)	:	데이터셋 해당 로우를 배열로
gfnAryToDs(objDs , aryDs , blAppend)	:	배열데이터셋을 데이터셋으로
gfnGetAryData(aryDs , iRow , strColumn)	:	배열데이터 셋에서 해당 줄의 컬럼값을 반환합니다
gfnDsAddRow(dsObj)	:	데이터셋에 마지막에 줄을 삽입합니다 ( 리턴 마지막줄 값)
gfnAryDsFindRow(aryDs , strColumn , strSearchValue , iCnt )	:	배열데이터셋 해당줄을 찾습니다	
gfnDsColumnToAry(objDs , strColumn , blDistinct)	:	해당 데이터셋의 컬럼을 배열로 만듭니다



------------------------------------------------------------ [ 반환관련 ] ------------------------------------------------------
gfnIsMemberObj(obj ,  strObj)	:	해당 오브젝트에서 멤버 객체의 해당 함수 및 변수 존재 여부 반환
gfnGetMemberScript(obj)	:	해당 오브젝트에서 멤버 객체의 여부 반환
gfnGetVariableByMember(obj , strVar)	:	해당 스크린이나 탭에서 해당 변수 값을 반환합니다
gfnGetSortHashKeys(aryHash)	:	hash 형 배열의 키값만을 일반 배열형으로 반환해줍니다
gfnGetMetaData(strMetaCode , strMsg , strTranceMsg)	:	메타에 지정된 데이터를 가져옵니다
gfnGetObjectByName(objScreen , strObjName)	:	스크린 객체에서 해당 객체를 반환해줍니다
gfnGetParentVaribleByMember(objScreen , strVar)	:	내부모에서 해당 변수 값을 반환합니다
gfnSetParentVaribleByMember(objscreen , strVar , strValue)	:	내부모에서 해당 변수 값을 세팅합니다
gfnGetParentObjectByName(objScreen , strObjName)	: 나의 부모 객체에서 해당 객체를 반환해줍니다
gfnSetParentMemberVaribleByName
gfnGetObjectTabInByName(instObj , strObjName)	:	탭객체에서 해당 객체를 반환합니다
gfnGetParentTabObj(objScreen )	:	나를 호출한 부모 탭 객체를 반환합니다
gfnGetParentTabObjInTab(instObj , objMyScreen )	:	나를 호출한 부모 탭 객체를 반환합니다
gfnCallFunctionMember(obj , strFunction , aryHash)	:	해당 오브젝트에서 멤버객체의 해당 함수를 호출합니다 변수는 줄수 없습니다



gfnGetTabChildCtrlIdAry(objTab , iItem)	:	탭안의 오브젝트 컨트롤아이디를 반환합니다
gfnGetSequence(strSeqId , strSeqType , strAppendWord , iTotalLength)	:	시퀀스를 반환해줍니다
gfnGetPrjSequence(strSeqId , strSeqType , strPrjId , strPrjLength)	:	 프로젝트별 시퀀스를 반환해줍니다
gfnLpad(strValue , strAppend , iTotalLength)	:	문자 좌측에 채워넣기
gfnReplaceStr(strSrc, strFrom, strTo)	:	정규형 replace
gfnReplaceAll(strData, strFind, strReplace)	:	replacAll 구현
gfnGetMailForm(strMailType)	:	이메일 폼 반환

gfnMainGetApprovalStat(strRdcsObjId , strRdcsObjVerId , strRdcsRptsNo)	:	결새 상태 코드를 반환합니다

gfnIsAuth(objScreen , strAuth)	:	해당 권한을 반환합니다    권한 "R":조회 , "W":추가(등록) , "M":수정 , "D":삭제 , "S":저장 , "E":기타
gfnPopParentIsAuth(objScreen , strAuth)	:	팝업의 부모의 해당 권한을 반환합니다   권한 "R":조회 , "W":추가(등록) , "M":수정 , "D":삭제 , "S":저장 , "E":기타

gfnGetAryHashCount(aryHash)	: 해쉬 배열의 갯수를 반환합니다
gfnMultiToInSql(objDs , strColumn , strCompareColumn , strCompareValue , blSqlType)	:	테이터셋에서 해당 컬럼의 값을 비교해서 또는 전체를 콤마형식으로 연결해서 반환합니다 ( ' 없이도 가능)


gfnOnKeyDownIsRealKey(keycode)	:	키값이 기능키가 아닌 입력키인지의 여부 반환
gfnMainGetIsPrjTeamRole(strLgiId , strPrjId , strCrgrRoleCd)	:	프로젝트의 해당 아이디가 해당룰을 가지고있는지의 여부를 반환합니다
gfnDSGetMax(objDs , strColumn , blNumberType)	:	데이터셋에서 해당 컬럼의 맥스값 반환


gfnEncodeBase64(strKey)	:	base64로 인코딩
gfnDecodeBase64(strKey)	:	base64를 디코딩
gfnStringToAscii(str)	:	문자를 아스키코드로
gfnAsciiToString(str)	:    아스키 코드를 문자열로
------------------------------------------------------------ [ 팝업관련 ] ------------------------------------------------------

gfnShowPopup(objScreen , strPopName , strUrl , strHead , blModal , strCallBackFunction , aryHash)	:	팝업을 뛰웁니다
gfnClosePopup(objScreen , aryHash)	:	팝업을 닫습니다
gfnClosePopupXButton(objScreen)	:	팝업에서 맨위에 X 버튼을 눌러 닫을때의 이벤트 destroy 이벤트에서 실행
gfnClosePopupXButtonCallBack(objScreen) : 팝업에서 맨위에 X 버튼을 눌러 닫을때의 이벤트 destroy 이벤트에서 실행하고 Callback함수를 실행함.
                                          2015.07.01 BPA Front-Office 프로젝트 중 추가함.

gfnGetParentReciveDataAry(objScreen)	:	팝업에서 호출하는 부모가 보낸 데이터 가져오기
gfnGetPopFindRow(objScreen)	:	스크린 데이터셋에서 해당 팝업의 줄을 반환합니다

gfnShowWait(objScreen , strAppendId)	:	진행중 모달 팝업을 뛰웁니다
gfnWaitDestroy(objScreen , strAppendId)	:	진행중 모달 팝업을 닫습니다

gfnShowMsgBox(objScreen , strBoxStyle , strMsgMetaCode , strMsg , strTranceMsg)	:	창을 뛰웁니다
gfnShowError(objScreen , strMetaCode , strMsg)	:	에러 창을 뛰웁니다

gfnShowCalendar(objScreen, objButton, objField , strCallBackFunction)	:	날짜 달력을 뛰웁니다
gfnShowGrdCalendar(objScreen , objGrid , iRow , iCell , strCallBackFunction)	:	그리듸 해당 컬럼에 날짜 달력을 뛰웁니다

gfnShowMultiCombo(objScreen , objDataset , objDataNameField , objInDataset , strInDataColumn , strOnCheckRowCallBack)	:	해당 코드 데이터셋을 멀티롤 뛰우는 작업및 처리를 합니다
gfnShowMultiDataHandle(objScreen , objDataset , objDataNameField , objInDataset , strInDataColumn , strOnDelRowCallBack)	:	멀티 데이터를 세팅하는 함수

gfnFileDialogPop(objScreen , strFilObjId , strFilObjCl , strFilObjVerId)	:	파일 다이얼로그를 뛰웁니다



------------------------------------------------------------ [ 날짜관련 ] ------------------------------------------------------

gfnIsMMDD(strDate) 	:	 MMDD 형식의 일자 유효성 검증 함수 
gfnIsYYYYMM(strDate) 	:	YYYYMM 형식의 일자 유효성 검증 함수 
gfnIsYYMM(strDate) 	:	YYMM 형식의 일자 유효성 검증 함수
gfnIsYYYYMMDD(strDate)	:	YYYYMMDD 형식의 일자 유효성 검증 함수
gfnIsYYMMDD(strDate)	:	YYMMDD 형식의 일자 유효성 검증 함수 
gfnGetDateByDayGap(strDate, nDayGap)	:	기준날짜에서 nDayGap일만큼 지난 년월일을 8자리 년월일 형태로 반환한다.
gfnGetDateByMonthGap(strDate, nMonthGap)	:	기준날짜에서 nMonthGap월만큼 지난 년월일을 8자리 년월일 형태로 반환한다.
gfnStringToDate(strDate) : String형식의 날짜를 Date형식으로 변환한다.
gfnGgetLastDate(strDate)	:	지정일자 마지막일자 반환 
gfnDateStrDiff(objScreen , strPreDate , strPosDate , blNeed , blNotAlertShow)	:	시작날짜와 종료날짜를 확인합니다
gfnDateObjDiff(objScreen , objPreDate , objPosDate , blNeed , blNotAlertShow)	:	해당 에디터에서 시작날짜 종료날짜를 확인합니다



------------------------------------------------------------ [ 행위관련 ] ------------------------------------------------------
gfnCombokeyfilter(objInst, keycode)	:	콤보 키 필터 처리  (조건 : 숨길컬럼이 코드컬럼과 같아야 한다)
gfnComboOutFocus(objInst)	:	콤보 포커스 아웃시 체크
gfnSetEditorStyle(objControl, strStyleType , strActiveType)	:	필드 , 콤보   필수,일반,비활성화 스타일 적용 스크립트
gfnSendEmail(strMailTitle , strMailContents , strSendUserID , aryReciveUserId , strProgramPath , aryHash)	:	이메일 보내기
gfnSendSms(strContents , strSendHp , strSendUserID , aryReciveUserHp , aryReciveUserId)	:	 SMS 보내기
gfnOpenMenu(strMenuId)	:	메뉴를 열어줍니다
gfnCloseMenu(strCloseMenuID)	:	메뉴가 열려져있을경우 닫습니다
gfnComboFilterSet(aryObj)	:	해당 콤보에 필터 이벤트를 적용시켜 줍니다  on_keydown on_focusout 사용

gfnShowLeftMenu(blShow)	:	좌측 메뉴 펼치기 여부
gfnShowIntro(blShow , blLeftMenuShow)	:	인트로 보이기 여부

gfnArySetEnable(aryObj, blEnable)	:	해당 오브젝트 Enable 처리 사용true
gfnArySetVisible(aryObj, blVisible)	:	해당 오브젝트 Visible 처리 사용true


------------------------------------------------------------ [ 파일관련  / 나모 에디터 관련] ------------------------------------------------------
gfnFileTabSetProcessor(objTabFile , objParentOrgDs , strObjId , strObjCl , strFilObjVerId , strMode , iMaxCnt , iMaxByte)	:	파일 설정 공통파일  (조회후 자동 세팅 부모의 해당 파일 데이터셋 객체)
gfnFileTabSaveProcessor(objTabFile)	:	파일공통 물리 저장함수 (자동 세팅 부모의 해당 파일 데이터셋 객체)
gfnImgFileTabSetProcessor(objTabImage , objParentOrgDs , strObjId , strObjCl , strFilObjVerId , strMode)	:	이미지 파일 설정 공통파일  (조회후 자동 세팅 부모의 해당 파일 데이터셋 객체)
gfnImgFileTabSaveProcessor(objTabImage)	:	파일공통 물리 저장함수 (자동 세팅 부모의 해당 파일 데이터셋 객체) 객체)
gfnFileTabGetCount(objTabFile)	:	파일 데이터셋의 갯수를 반환

gfnNamoEditorSetMIMEValue(objTabEditor , strValue)	:	나모에디터 에 MIME 값을 세팅합니다
gfnNamoEditorGetMIMEValue(objTabEditor)	:	나모에디터 에 MIME 값을 가져옵니다
gfnNamoEditorGetValue(objTabEditor)	:	나모에디터의 화면에 보이는 값을 가져옵니다
gfnNamoEditorSetHtmlType(objTabEditor , strHtmlType)	:	나모에디터의 폼을 가져옵니다
------------------------------------------------------------[ 프로젝트 목록 권한 관련] ----------------------------------------------------------------
gfnPrjComboListTabSetProcessor(objTabPrjCombo, objParentSetDs, strParentDsColumnName,bEndPrjChk, strOnchangeFunctionName , bAuthAll , bAuthOrg , bAuthPrj , bAuthTeam , strPrjStdCdList, strRoleList, bRequired)	:	프로젝트 권한 목록 공통파일  (조회후 자동 세팅 부모의 해당 검색 데이터셋 객체)
----------------------------------------------------------------------------------------------------------------- */




var GFN_MULTI_HEIGHT = 400;
var GFV_SCREEN_OBJ = [];	//팝업을 위한 스크린 배열
var GFV_PARENT_SCREEN_OBJ = [];	//팝업에서 사용되는 스크린 배열 부모값
var GFV_SCREEN_HASH_ARRAY = [];	//팝업에서 값을 주고 받기 위한 해쉬형 배열
var GFV_SCREEN_CNT = -1;


/*
* 탭안의 컨트롤 아이디들을 배열에 담아 반환합니다
* objTab  : (object) 탭 객체
* iItem   : (int) 탭 아이템 인덱스
*/
function gfnGetTabChildCtrlIdAry(objTab , iItem){
	var aryCtrlId = [];
	var iTabcnt = objTab.getchildcontrolcount(iItem);
	var instFirstObj = objTab.getchildinstancefirst(iItem);
	
	if(factory.isobject(instFirstObj)){
		aryCtrlId[aryCtrlId.length] = instFirstObj.getcontrolid();
		var objNow = instFirstObj;
		
		for(var i=1;i<iTabcnt;i++){
			var insObj = objTab.getchildinstancenext(iItem , objNow);
			
			if(factory.isobject(insObj)){
				aryCtrlId[aryCtrlId.length] = insObj.getcontrolid();
			}
			
			objNow = insObj;	//다음으로 넘겨야 처리됨
		}	
	}
	
	return aryCtrlId;
}

/**
 * 원본문자열을 원하는 길이만큼 필러를 이용해 채워 반환해 주는 함수
 * @param strSource 원본 문자열
 * @param strFillerChar 채워줄 문자, 문자 길이는 1자리여야 함.
 * @param nMaxLen 최대 데이터 길이
 * @param bLeftFill 왼쪽부터 채울지 여부
 * @return 
 * 	strPadString 가공된 문자열
 */
function padStr(strSource, strFillerChar, nMaxLen, bLeftFill)
{
	var strTempSource = "";

	var strDataType = typeof(strSource);	
	if(strDataType.toUpperCase() == "NUMBER") {
		strTempSource = strSource.toString(10);
	}
	else {
		strTempSource = strSource;
	}

	var nDataLength = factory.stringbytelen(strTempSource);
			
	var nFillerLength = nMaxLen - nDataLength;
	var i;
	
	if(nFillerLength <= 0) {
		return strSource;
	}
	
	var strFiller = "";
	for(i = 0 ; i < nFillerLength; i++) {
		strFiller += strFillerChar;
	}

	if(bLeftFill == true) {
		return strFiller + strSource;	
	}
	else {
		return strSource + strFiller;
	}
}

/*
* 스크린프레임의 하단 스테이트 메세지에 세칭
* objScreen    : (object) 스크린 객체
* strMetaCode  : (string) 메타코드
* strMsg	   : (string) 메세지
* strTranceMsg : (string) %% 문자 대체 문자
*/
function statMsg(objScreen , strMetaCode , strMsg , strTranceMsg){
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[statMsg 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[statMsg 개발자 오류] screen 객체를 넘겨주세요");
		return;
	} 
	
	//var strNewMsg = gfnGetMetaData(strMetaCode , strMsg , strTranceMsg);
	var strNewMsg = gfnGetMsgMetaData(strMetaCode , strMsg , strTranceMsg);
	//var objScreenFrame = objScreen.getparent();
	var objScreenFrame = SYSVar.BOTTOMMAIN_SCREEN;
	
	if(!isScreen(objScreenFrame)){
		return;
	}

//	if(objScreenFrame.getscreenid() == "ScreenFrame" && objScreenFrame.findscriptmethod(XFD_JAVASCRIPT, "setTranStatusMsg")){
//		var objScreenMember = objScreenFrame.getmembers(XFD_JAVASCRIPT);
//		objScreenMember.setTranStatusMsg(strNewMsg);
//	}
	if(objScreenFrame.getscreenid() == "bottomMain" && objScreenFrame.findscriptmethod(XFD_JAVASCRIPT, "_setStatusMsg")){
		var objScreenMember = objScreenFrame.getmembers(XFD_JAVASCRIPT);
		objScreenMember._setStatusMsg(strNewMsg);
	}
	//SYSVar.BOTTOMMAIN_MEMBER._setStatusMsg(strNewMsg);
}



/*
* 트레이에 해당 로그를 찍음
* strMsg : (string) 문자
*/
function trace(strMsg){
	factory.consoleprint("[trace] : " + strMsg);
}


/*
* 트레이에 해당 데이터셋정보와 값 로그를 찍음
* objDataset : (object) 데이터셋 객체
*/
function traceDataset(objDataset){
	if(isNullObj(objDataset)){
		return;
	}
	
	var strDatasetName = objDataset.getid();
	
	for(var i=0;i<objDataset.getrowcount();i++){		
		for(var j=0;j<objDataset.getcolumncount();j++){
			var strColumnName = objDataset.getcolumnid(j);				
			var strValue = objDataset.getdata(i , j);	
			
			trace(strDatasetName + " :  ROW='" + i + " ' COLUMN='" + strColumnName + "'  VALUE='" + strValue + "'");
		}
	}
}


/*
* 트레이에 해당 Hash 형 배열값을 로그를 찍음
* aryHash : (array) hash 형 배열  => aty["A"] = "B"
*/
function traceHashAry(aryHash){
	var aryKeys = gfnGetSortHashKeys(aryHash);
	for(var i=0;i<aryKeys.length;i++){
		trace("key[" + aryKeys[i] + "] : value[" + aryHash[aryKeys[i]] + "]");
	}
}



/*
* 스크린 객체 인지 여부
* objScreen   : (object) 스크린 객체
* [return] => (boolean)
*/
function isScreen(objSource){
	var blScreen = true;
	try{
		objSource.getscreenid();
	}catch(e){
		blScreen = false;
	}
	return blScreen;
}


/*
* null , "" , undefined 일경우 true 반환
* strSource : (string) 메타코드
* [return] => (boolean)
*/
function isNull(strSource){	
	if(strSource == undefined || strSource == null || factory.stringltrim("" + strSource).length == 0) {
		return true;
	}
	
	return false;
}


/*
* null ,  undefined 객체일경우 true 반환
* objScreen   : (object) 스크린 객체
* strMetaCode : (string) 메타코드
* strMsg	  : (string) 메세지
* [return] => (boolean)
*/
function isNullObj(objSource){
	if(objSource == null || objSource == undefined) {
		return true;
	}
	
	return false;
}




/*
* 확인 창을 뛰웁니다
* objScreen    : (object) 스크린 객체
* strMetaCode  : (string) 메타코드
* strMsg	   : (string) 메세지
* strTranceMsg : (string) %% 문자 대체 문자
* [return] => (boolean)
*/
function confirm(objScreen , strMetaCode , strMsg , strTranceMsg, nFocusButton, strMsgBoxId){
	return gfnShowMsgBox(objScreen , "CONFRIM" , strMetaCode , strMsg , strTranceMsg, nFocusButton, strMsgBoxId);
}

/*
* 에러 창을 뛰웁니다
* objScreen   : (object) 스크린 객체
* strMetaCode : (string) 메타코드
* strMsg	  : (string) 메세지
*/
function errorMsg(objScreen , strMetaCode , strMsg , strTranceMsg, nFocusButton, strMsgBoxId){
	return gfnShowMsgBox(objScreen , "ERROR_YES_NO" , strMetaCode , strMsg , strTranceMsg, nFocusButton, strMsgBoxId);
}

/*
* 에러 창을 뛰웁니다
* objScreen   : (object) 스크린 객체
* strMetaCode : (string) 메타코드
* strMsg	  : (string) 메세지
*/
function gfnShowError(objScreen , strMetaCode , strMsg , strTranceMsg){
	gfnShowMsgBox(objScreen , "ERROR" , strMetaCode , strMsg , strTranceMsg);
}


/*
* 경고 창을 뛰웁니다
* objScreen    : (object) 스크린 객체
* strMetaCode  : (string) 메타코드
* strMsg	   : (string) 메세지
* strTranceMsg : (string) %% 문자 대체 문자
*/
function alert(objScreen , strMetaCode , strMsg , strTranceMsg){
	gfnShowMsgBox(objScreen , "ALERT" , strMetaCode , strMsg , strTranceMsg);
}






/*
* 현재 시각을 hhmmss 형식으로 구함
* [return] => (string) 현재 시각을 hhmmss으로 리턴
*/
function getTime()
{
	return factory.getsystemtime("%h%m%s");
}




/*
* 오늘 날짜를 YYYYMMDD 형식으로 구함
* strBoxStyle  : (strFormat) xframe 방식 참고 => getsystemtime 
* [return] => (boolean) 오늘 날짜를 YYYYMMDD으로 리턴
*/
function getDate(strFormat) 
{
	if(isNull(strFormat)){
		strFormat = "%Y%M%D";
	}
	
	return factory.getsystemtime(strFormat);
}




/*
* 창을 뛰웁니다
* objScreen    : (object) 스크린 객체
* strBoxStyle  : (string) 메타코드
* strMetaCode  : (string) 메타코드
* strMsg	   : (string) 메세지
* strTranceMsg : (string) %% 문자 대체 문자
* nFocusButton : (short) 포커스 받을 버튼 [옵션] (XFD_MB_FOCUSBUTTON1:0,XFD_MB_FOCUSBUTTON1:1,XFD_MB_FOCUSBUTTON1:2)
* strMsgBoxId  : (string) 메세지 박스 ID [옵션]
*/
function gfnShowMsgBox(objScreen , strBoxStyle , strMsgMetaCode , strMsg , strTranceMsg, nFocusButton, strMsgBoxId){	
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnShowMsgBox 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnShowMsgBox 개발자 오류] screen 객체를 넘겨주세요");
		return;
	} 
	
	var iBoxType = 1;
	var iButtonType = 2;
	var strMsgTitle = "경고";
	var strMsgTitleMetaCode = "";
	
	if(strBoxStyle == "CONFRIM"){
		iBoxType = 3;
		iButtonType = 5;
		strMsgTitle = "확인";
		strMsgTitleMetaCode = "";
	}else if(strBoxStyle == "ERROR"){
		iBoxType = 2;
		strMsgTitle = "오류";
		strMsgTitleMetaCode = "";
	}else if(strBoxStyle == "ERROR_YES_NO"){
		iBoxType = 2;
		iButtonType = 5;
		strMsgTitle = "확인";
		strMsgTitleMetaCode = "";
	}else{
		iBoxType = 1;
	}	
	
	var strViewTitle = gfnGetMetaData(strMsgTitleMetaCode , strMsgTitle);
	//var strViewMsg = gfnGetMetaData(strMsgMetaCode , strMsg);
	var strViewMsg = gfnGetMsgMetaData(strMsgMetaCode , strMsg);
	
	if(!isNull(strViewMsg)){
		strViewMsg = strViewMsg.replace("%%" , strTranceMsg);
	}
	
	if (isNull(nFocusButton)){
		nFocusButton = 0;
	}
	
	objScreen.messagebox(strViewMsg , strViewTitle , iBoxType , iButtonType, nFocusButton, strMsgBoxId);

//	console.log("gfnShowMsgBox returnValue : " + returnValue);
//	
//	if(strBoxStyle == "CONFRIM"){
//		if(returnValue == XFD_MB_RESYES){
//			return true;
//		}else if(returnValue == XFD_MB_RESNO){
//			return false;
//		}
//	}
}


/*
* 메타에 지정된 데이터를 가져옵니다
* strMetaCode  : (string) 메타코드
* strMsg	   : (string) 메세지
* strTranceMsg : (string) %% 문자 대체 문자
* [return] => (string) strMetaCode 의 값이 없을경우 strMsg 리턴
*/
function gfnGetMetaData(strMetaCode , strMsg , strTranceMsg){
	var strReturnData = strMsg;
	
	if(!isNull(strMetaCode)){
		var strMetaMsg = gfnLookUp(gdsLabelLang , "OBJ_CD" , strMetaCode , "LANG_DISPLAY");
		if(isNull(strMetaMsg)){
			strMetaMsg = strMsg;
		}
		
		strReturnData = strMetaMsg;
	}
	
	strReturnData = gfnReplaceAll(strReturnData , "<BR>" ,  "\n");
	strReturnData = gfnReplaceAll(strReturnData , "<br>" ,  "\n");
	
	if(!isNull(strTranceMsg)){
		strReturnData = strReturnData.replace("%%" , strTranceMsg);
	}
	
	return strReturnData;	
}

/*
* 메타에 지정된 Message 데이터를 가져옵니다
* strMetaCode  : (string) 메타코드
* strMsg	   : (string) 메세지
* strTranceMsg : (string) %% 문자 대체 문자
* [return] => (string) strMetaCode 의 값이 없을경우 strMsg 리턴
*/
function gfnGetMsgMetaData(strMetaCode , strMsg , strTranceMsg){
	var strReturnData = strMsg;
	
	if(!isNull(strMetaCode)){
		var strMetaMsg = gfnLookUp(gdsMsgLang , "MSG_CODE" , strMetaCode , "LANG_DISPLAY");
		if(isNull(strMetaMsg)){
			strMetaMsg = strMsg;
		}
		
		strReturnData = strMetaMsg;
	}

	strReturnData = gfnReplaceAll(strReturnData , "<BR>" ,  "\n");
	strReturnData = gfnReplaceAll(strReturnData , "<br>" ,  "\n");
	
	if(!isNull(strTranceMsg)){
		strReturnData = strReturnData.replace("%%" , strTranceMsg);
	}
	
	return strReturnData;	
}



/*
* 해당 객체들의 값이 널인지의 여부 반환
* objScreen      : (object) 스크린 객체
* aryDual        : (object[]) 2차원 배열   =>   [ [obj , "metaCode" , "msg"]  , [obj , "메타코드" , "메타코드없을시 보여줄메세지값"] ]
* blNotAlertShow : (boolean) 경고차 비활성 여부
* [return] => (boolean)
*/
function gfnValidationObj(objScreen , aryDual , blNotAlertShow){
	if(isNull(blNotAlertShow)){
		blNotAlertShow = false;
	}
	
	//XFD_CTRLKIND_FIELD = 1 , XFD_CTRLKIND_CHECKBOX = 5 , XFD_CTRLKIND_RADIOBUTTON = 6 , XFD_CTRLKIND_COMBOBOX = 9
	for(var i=0;i<aryDual.length;i++){
		var datas = aryDual[i];
		var obj = datas[0];	
		var strObjectName = gfnGetMetaData(datas[1] , datas[2]);
		var vu = "";
				
		if(obj.getcontrolkind() == XFD_CTRLKIND_FIELD || obj.getcontrolkind() == XFD_CTRLKIND_MULTILINE){			
			vu = obj.gettext();
		}else if(obj.getcontrolkind() == XFD_CTRLKIND_CHECKBOX && obj.GetCheck()){
			vu = obj.GetCheck();
		}else if(obj.getcontrolkind() == XFD_CTRLKIND_RADIOBUTTON){
			var iRadioGroupCnt = obj.getgroupcount();
			
			for(var j=0;j<iRadioGroupCnt;j++){
				var objRadio = obj.getgroupat(j);
				
				if(objRadio == null) {
					continue;
				}
				
				if(objRadio.getcheck()) {
					vu = getcheck();
					break;
				}
			}			
		}else if(obj.getcontrolkind() == XFD_CTRLKIND_COMBOBOX){			
			vu = obj.getselectedcode();
		}
		
		if(isNull(vu)){
			if(!blNotAlertShow){
				if(!isScreen(objScreen)){	
					//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnValidationObj 개발자 오류] screen 객체를 넘겨주세요");
					alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnValidationObj 개발자 오류] screen 객체를 넘겨주세요");
					return;
				} 
								
				obj.setfocus();
				alert(objScreen , "MSG004" , "%% 은(는) 필수입력항목입니다." , strObjectName );
			}
			
			return false;			
		}
	}
	

	return true;
}



/*
* 해당 그리드의 값이 널인지의 여부 반환
* objScreen      : (object) 스크린 객체
* objGrid		: (object) 그리드 객체
* aryColumn	  : (string[]) 컬럼   =>   [ "A" , "B" ]
* blNotAlertShow : (boolean) 경고차 비활성 여부
* [return] => (boolean)
*/
function gfnVaildataionGrd(objScreen , objGrid , aryColumn ,blNotAlertShow){
	if(isNull(blNotAlertShow)){
		blNotAlertShow = false;
	}
	
	for(var i=0;i<objGrid.getrowcount();i++){
		for(var j=0;j<aryColumn.length;j++){
			var strColumn = aryColumn[j];
			var iCell = objGrid.getcolumn(strColumn);
			var vu = objGrid.getitemtextbyname(i, strColumn);
			var strGridColumnHead = objGrid.getheadertext(0 , iCell);
			
			if(isNull(vu)){										
				if(!blNotAlertShow){
					if(!isScreen(objScreen)){	
						//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnVaildataionGrd 개발자 오류] screen 객체를 넘겨주세요");
						alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnVaildataionGrd 개발자 오류] screen 객체를 넘겨주세요");
						return;
					} 
				
					alert(objScreen , "MSG004" , "%% 은(는) 필수입력항목입니다." , strGridColumnHead );
				}
				
				objGrid.setselectitem(i, iCell);
				objGrid.setfocus();
				objGrid.setitemeditstart(i , iCell , true);	
			
				return false;			
			}
		}
	}	

	return true;
}





/*
* 해당 데이터셋의 값이 널인지의 여부 반환
* objScreen      : (object) 스크린 객체
* objDs      	: (object) 데이터셋 객체
* aryColumn	  : (string[]) 컬럼   =>   [ "A" , "B" ]
* blNotAlertShow : (boolean) 경고차 비활성 여부
* [return] => (boolean)
*/
function gfnVaildataionDs(objScreen , objDs , aryColumn ,blNotAlertShow){
	if(isNull(blNotAlertShow)){
		blNotAlertShow = false;
	}
	
	for(var i=0;i<objDs.getrowcount();i++){
		for(var j=0;j<aryColumn.length;j++){
			var strColumn = aryColumn[j];			
			var vu = objDs.getdatabyname(i, strColumn);
						
			if(isNull(vu)){				
				if(!blNotAlertShow){
					if(!isScreen(objScreen)){	
						//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnVaildataionDs 개발자 오류] screen 객체를 넘겨주세요");
						alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnVaildataionDs 개발자 오류] screen 객체를 넘겨주세요");
						return;
					} 
				
					var msgH = gfnGetMetaData("" , "%%행" , i);								

					alert(objScreen , "MSG004" , "%% 은(는) 필수입력항목입니다." , msgH );
				}
			
				return false;			
			}
		}
	}	

	return true;
}


/*
* 해당 데이터셋의 값이 널인지의 여부 반환
* objScreen      : (object) 스크린 객체
* objDs      	: (object) 데이터셋 객체
* aryColumn	  : (string[]) 컬럼   =>   [ "A" , "B" ]
* blNotAlertShow : (boolean) 경고차 비활성 여부
* [return] => (boolean)
*/
function gfnVaildataionDsNeo(objScreen , objDs , aryColumn ,blNotAlertShow){
	if(isNull(blNotAlertShow)){
		blNotAlertShow = false;
	}
	
	for(var i=0;i<objDs.getrowcount();i++){
		for(var j=0;j<aryColumn.length;j++){
			var strColumn = aryColumn[j];			
			var vu = objDs.getdatabyname(i, strColumn);
						
			if(isNull(vu)){				
				if(!blNotAlertShow){
					if(!isScreen(objScreen)){	
						alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnVaildataionDs 개발자 오류] screen 객체를 넘겨주세요");
						return;
					} 
				
					var strDsColumnHead = objDs.getcolumndesc(objDs.getcolumn(strColumn));

					alert(objScreen , "MSG004" , "%% 은(는) 필수입력항목입니다." , strDsColumnHead);
				}
			
				return false;			
			}
		}
	}	

	return true;
}



/*
* 글로벌 param 데이터셋에 value 를 삽입합니다
* strKey   : (string) 키 문자
* strValue : (string) 값 문자
*/
function setParam(strKey , strValue){
	var iRow = -1;
	
	for(var i=0;i<gdsParams.getrowcount();i++){
		var strGetkey = gdsParams.getdatabyname(i , "KEY");
		if(strGetkey == strKey){
			iRow = i;
			break;
		}
	}
	
	if(iRow == -1){
		iRow = gdsParams.getrowcount();
		gdsParams.insertrow(iRow);
	}
		
	gdsParams.setdatabyname(iRow , "KEY" , strKey);
	gdsParams.setdatabyname(iRow , "VALUE" , strValue);
}


/*
* 글로벌 param 데이터셋에서 value를 가져옵니다
* strKey   : (string) 키 문자
* blClear  : (boolean) 논리형
* [return] => (string)
*/
function getParam(strKey , blClear){
	var strReturn = "";
	if(isNull(blClear)){
		blClear =  false;
	}
	
	var iRow = -1;
	
	for(var i=0;i<gdsParams.getrowcount();i++){
		var strGetkey = gdsParams.getdatabyname(i , "KEY");
		if(strGetkey == strKey){
			iRow = i;
			break;
		}
	}

	if(iRow != -1){
		strReturn = gdsParams.getdatabyname(iRow , "VALUE");
		
		if(blClear){
			gdsParams.deleterow(iRow);
		}
	}
	
	return strReturn;
}





/*
* 해당 줄의 데이터셋을 복사합니다
* objGetDataset : (object) 가져올 데이터셋
* iGetRow  	 : (int) 가져올 줄
* objSetDataset : (object) 삽입항 데이터셋
* iSetRow  	 : (int) 삽입할 줄
*/
function gfnCopyTowRow(objGetDataset , iGetRow , objSetDataset , iSetRow){
	for(var i=0;i<objSetDataset.getcolumncount();i++){
		var strColumnName = objGetDataset.getcolumnid(i);
		var strValue = objGetDataset.getdata(iGetRow , i);
		objSetDataset.setdatabyname(iSetRow , strColumnName , strValue);
	}
}


/*
* 원본 데이터 셋에서 대상 데이터 셋으로 값을 복사한다.
* objGetDataset : (object) 가져올 데이터셋
* objSetDataset : (object) 삽입항 데이터셋
* strCopyType   : (string) 가져올타입	"ALL" , "CHECK" , "INSERT" , "UPDATE"
* blAppend	  : (boolean) 추가할것인지
*/
function gfnCopyDataSet(objGetDataset, objSetDataset, strCopyType , blAppend)
{
	if(isNull(strCopyType)){
		strCopyType = "ALL";
	}
	
	var nColumnCount = objGetDataset.getcolumncount();
	var nRowCount = objGetDataset.getrowcount();	
	var iRow = 0;
		
	if(isNull(blAppend)){
		blAppend = false;
	}

	if(!blAppend){
		objSetDataset.removeallrows();
	}else{
		iRow = objSetDataset.getrowcount();
	}	
	
	for(var i=0;i<nRowCount;i++) {
		if(strCopyType != "ALL"){
			if(strCopyType == "CHECK") {	
				if(!objGetDataset.ischeckedrow(i)) {
					continue;
				}
			}
			
			if(strCopyType == "INSERT") {	
				if(!objGetDataset.ischeckedrow(i)) {
					continue;
				}
			}
			
			if(strCopyType == "UPDATE") {	
				if(!objGetDataset.ischeckedrow(i)) {
					continue;
				}
			}
			
			objSetDataset.insertrow(iRow);
			
			for(j=0;j< nColumnCount;j++) {
				var strColumnName = objGetDataset.getcolumnid(j);
				var strValue = objGetDataset.getdata(i , j);
				objSetDataset.setdatabyname(iRow , strColumnName , strValue);
			}
		
			objSetDataset.setrowoperation(iRow , XFD_ROWOP_NONE);
			
			iRow++;						
		}else{ 		
			objSetDataset.insertrow(iRow);
						
			for(j=0;j< nColumnCount;j++) {
				var strColumnName = objGetDataset.getcolumnid(j);
				var strValue = objGetDataset.getdata(i , j);
				objSetDataset.setdatabyname(iRow , strColumnName , strValue);
			}
		
			objSetDataset.setrowoperation(iRow , XFD_ROWOP_NONE);
			
			iRow++;
		}
	}
	
	return iRow;
}

/*
* 해당 코드 데이터셋 맨 첫줄에 값 삽입
* objDataset      : (object) 삽입할 데이터셋
* strAppendType   : (string) 구성할 첫번째 로우타입   "A" = "전체" , "N" = 빈값 , "S" = 선택  null 또는 "" 은 아무것도 하지않음
*/
function gfnTranceCodeSet(objDataset , strAppendType){
	if(isNullObj(objDataset)){
		return;
	}
	
	if(isNull(strAppendType)){
		return;
	}		
	
	var iRow = 0;
	
	if(strAppendType == "A" || strAppendType == "N" || strAppendType == "S"){
		objDataset.insertrow(iRow);
		objDataset.setdatabyname(iRow , "CODE" , "");
		
		if(strAppendType == "A"){			
			objDataset.setdatabyname(iRow , "NAME" , gfnGetMetaData("" , "전체") );
		}else if(strAppendType == "N"){
			objDataset.setdatabyname(iRow , "NAME" , gfnGetMetaData("" , "") );
		}else if(strAppendType == "S"){
			objDataset.setdatabyname(iRow , "NAME" , gfnGetMetaData("" , "선택") );
		}
	}
}

/*
* 팝업을 뛰웁니다
* objScreen   		  : (object) 스크린 객체
* strPopName			: (string) 팝업 아이디
* strUrl				: (string) 팝업경로
* strHead			   : (string) 팝업 타이틀
* blModal			   : (boolean) 모달여부
* strCallBackFunction   : (string) 콜백함수명
* aryHash	           : (array hash) 팝업에게 보낼 hash 형 배열 => aty["A"] = "B"
* blNotShowTitle 	   : (boolean) 팝업에서 타이틀바를 보일지의 여부 
* nBorderStyle		  :  XFD_BORDER_NONE = 0 (테두리 없음)
						   XFD_BORDER_FLAT = 1 (선 테두리)
						   XFD_BORDER_RAISED = 2 (리사이즈 불가능한 창 테두리)
						   XFD_BORDER_RESIZE = 4 (리사이즈 가능한 창 테두리)
*/
//function gfnShowPopupPlanning(objScreen , strPopName , strUrl , strHead , blModal , strCallBackFunction , aryHash , blNotShowTitle, nBorderStyle){
//	if(!isScreen(objScreen)){	
//		alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnShowPopup 개발자 오류] screen 객체를 넘겨주세요");
//		return;
//	}
//	
//	if(isNull(blModal)){
//		blModal = false;
//	}
//
//	if(isNull(blNotShowTitle)){
//		blNotShowTitle = false;
//	}
//
//	var strScreenID = objScreen.getscreenid();
//	var objParentScreen = objScreen.getparent();
//	var strParentScreenID = objParentScreen.getscreenid();
//	 
//	var objPopup = factory.findpopup(strPopName);	
//	if(factory.isobject(objPopup)){
//		objPopup.setfocus();
//	}else{		
//		var aryDual = [ ["TYPE" , "POP"]  ,  ["SCREEN_NAME" , strPopName] ];
//		var iSRow = gfnAndFindRow(gdsScreen , aryDual);			
//		
//		if(iSRow != -1){ //있을경우 데이터를 지움 이유는 그냥닫은것임						
//			var iTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");	
//			gdsScreen.deleterow(iSRow);
//			
//			GFV_SCREEN_OBJ[iTabIndex] = null;
//			GFV_PARENT_SCREEN_OBJ[iTabIndex] = null;	
//			GFV_SCREEN_HASH_ARRAY[iTabIndex] = null;				
//		}
//
//		factory.loadpopup(strPopName , strUrl , strHead , blNotShowTitle , nBorderStyle , 0 , 0 , true , blModal , objScreen);		
//		objPopup = factory.findpopup(strPopName);
//			trace("objPopup###########################");
//			
//		if(factory.isobject(objPopup)) {
//			GFV_SCREEN_CNT ++;	//추가 시키고
//			var iTabIndex = GFV_SCREEN_CNT;
//			
//			iSRow = gdsScreen.getrowcount();
//			gdsScreen.insertrow(iSRow);
//			gdsScreen.setdatabyname(iSRow , "TYPE" , "POP");
//			gdsScreen.setdatabyname(iSRow , "SCREEN_NAME" , strPopName);
//			gdsScreen.setdatabyname(iSRow , "PARENT_SCREEN_NAME" , strScreenID);
//			gdsScreen.setdatabyname(iSRow , "CALL_BACK_FUNCTION" , strCallBackFunction);
//			gdsScreen.setdatabyname(iSRow , "SCREEN_WINDOW_ID" , objPopup.getwindowid());
//			gdsScreen.setdatabyname(iSRow , "PARENT_SCREEN_WINDOW_ID" , objScreen.getwindowid());	
//			gdsScreen.setdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX" , iTabIndex);	
//		
//			GFV_SCREEN_OBJ[iTabIndex] = objPopup;	//데이터셋에는 객체가 들어가지 않음 
//			GFV_PARENT_SCREEN_OBJ[iTabIndex] = objScreen;	//데이터셋에는 객체가 들어가지 않음
//			GFV_SCREEN_HASH_ARRAY[iTabIndex] = aryHash;	//데이터셋에는 객체가 들어가지 않음
//			trace("###########################");
//			if(blModal){
//				objPopup.domodal();	
//			}
//
//		}				
//	}
//	
//	return;
//}


/*
* 팝업을 뛰웁니다
* objScreen   		  : (object) 스크린 객체
* strPopName			: (string) 팝업 아이디
* strUrl				: (string) 팝업경로
* strHead			   : (string) 팝업 타이틀
* blModal			   : (boolean) 모달여부
* strCallBackFunction   : (string) 콜백함수명
* aryHash	           : (array hash) 팝업에게 보낼 hash 형 배열 => aty["A"] = "B"
* blNotShowTitle 	   : (boolean) 팝업에서 타이틀바를 보일지의 여부 
*/
function gfnShowPopup(objScreen , strPopName , strUrl , strHead , blModal , strCallBackFunction , aryHash , blNotShowTitle){
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnShowPopup 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnShowPopup 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	if(isNull(blModal)){
		blModal = false;
	}

	if(isNull(blNotShowTitle)){
		blNotShowTitle = false;
	}
						
	var strScreenID = objScreen.getscreenid();
	var objParentScreen = objScreen.getparent();
	var strParentScreenID = objParentScreen.getscreenid();
	 
	var objPopup = factory.findpopup(strPopName);	
	if(factory.isobject(objPopup)){
		objPopup.setfocus();
	}else{		
		var aryDual = [ ["TYPE" , "POP"]  ,  ["SCREEN_NAME" , strPopName] ];
		var iSRow = gfnAndFindRow(gdsScreen , aryDual);			
		
		if(iSRow != -1){ //있을경우 데이터를 지움 이유는 그냥닫은것임						
			var iTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");	
			gdsScreen.deleterow(iSRow);
			
			GFV_SCREEN_OBJ[iTabIndex] = null;
			GFV_PARENT_SCREEN_OBJ[iTabIndex] = null;	
			GFV_SCREEN_HASH_ARRAY[iTabIndex] = null;				
		}
		
		//factory.loadpopup(strPopName , strUrl , strHead , blNotShowTitle , 0 , 0 , 0 , true , blModal , objScreen);		
		objScreen.loadportletpopup(strPopName, strUrl, strHead, blNotShowTitle, 0, 0, 0, 820, 410, true, true, false);
		objPopup = factory.findpopup(strPopName);
			
		if(factory.isobject(objPopup)) {
			GFV_SCREEN_CNT ++;	//추가 시키고
			var iTabIndex = GFV_SCREEN_CNT;
			
			iSRow = gdsScreen.getrowcount();
			gdsScreen.insertrow(iSRow);
			gdsScreen.setdatabyname(iSRow , "TYPE" , "POP");
			gdsScreen.setdatabyname(iSRow , "SCREEN_NAME" , strPopName);
			gdsScreen.setdatabyname(iSRow , "PARENT_SCREEN_NAME" , strScreenID);
			gdsScreen.setdatabyname(iSRow , "CALL_BACK_FUNCTION" , strCallBackFunction);
			gdsScreen.setdatabyname(iSRow , "SCREEN_WINDOW_ID" , objPopup.getwindowid());
			gdsScreen.setdatabyname(iSRow , "PARENT_SCREEN_WINDOW_ID" , objScreen.getwindowid());	
			gdsScreen.setdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX" , iTabIndex);	
		
			GFV_SCREEN_OBJ[iTabIndex] = objPopup;	//데이터셋에는 객체가 들어가지 않음 
			GFV_PARENT_SCREEN_OBJ[iTabIndex] = objScreen;	//데이터셋에는 객체가 들어가지 않음
			GFV_SCREEN_HASH_ARRAY[iTabIndex] = aryHash;	//데이터셋에는 객체가 들어가지 않음
			objPopup.domodal();	
		} else {
			console.log("not find");
		}	
	}
	
	return;
}


/*
* 팝업에서 맨위에 X 버튼을 눌러 닫을때의 이벤트 destroy 이벤트에서 실행
* objScreen   		  : (object) 스크린 객체
* aryHash	           : (array hash) 부모한테 보낼 hash 형 배열 => aty["A"] = "B"
*/
function gfnClosePopupXButton(objScreen){
	var iSRow = gfnGetPopFindRow(objScreen);

	if(iSRow != -1){	
		var iTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");			
		var objParentScreen = GFV_PARENT_SCREEN_OBJ[iTabIndex];		
		var strCallBackFunction = gdsScreen.getdatabyname(iSRow , "CALL_BACK_FUNCTION");
		var strScreenID = gdsScreen.getdatabyname(iSRow , "SCREEN_NAME");

		gdsScreen.deleterow(iSRow);
		GFV_SCREEN_OBJ[iTabIndex] = null;
		GFV_PARENT_SCREEN_OBJ[iTabIndex] = null;	
		GFV_SCREEN_HASH_ARRAY[iTabIndex] = null;	
	}
}

/* 
* 팝업에서 맨위에 X 버튼을 눌러 닫을때의 이벤트 destroy 이벤트에서 실행하고 콜백함수 실행 가능하게함.
* objScreen       : (object) 스크린 객체
* aryHash            : (array hash) 부모한테 보낼 hash 형 배열 => aty["A"] = "B"
*/
function gfnClosePopupXButtonCallBack(objScreen){
	var iSRow = gfnGetPopFindRow(objScreen);
	
	if(iSRow != -1){
		var iTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");   
		var objParentScreen = GFV_PARENT_SCREEN_OBJ[iTabIndex];  
		var strCallBackFunction = gdsScreen.getdatabyname(iSRow , "CALL_BACK_FUNCTION");
		var strScreenID = gdsScreen.getdatabyname(iSRow , "SCREEN_NAME");
		
		gdsScreen.deleterow(iSRow);
		GFV_SCREEN_OBJ[iTabIndex] = null;
		GFV_PARENT_SCREEN_OBJ[iTabIndex] = null; 
		GFV_SCREEN_HASH_ARRAY[iTabIndex] = null;
		
		if(isScreen(objParentScreen) && objParentScreen.findscriptmethod(XFD_JAVASCRIPT, strCallBackFunction)){ 
		    var objScreenMember = objParentScreen.getmembers(XFD_JAVASCRIPT); 
		    eval("objScreenMember." + strCallBackFunction)(""); 
		}
	}  
}

/*
* 팝업을 닫습니다
* objScreen   		  : (object) 스크린 객체
* aryHash	           : (array hash) 부모한테 보낼 hash 형 배열 => aty["A"] = "B"
*/
function gfnClosePopup(objScreen , aryHash){	
	var iSRow = gfnGetPopFindRow(objScreen);
	if(iSRow != -1){
		var iTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");
		var objParentScreen = GFV_PARENT_SCREEN_OBJ[iTabIndex];		
		var strCallBackFunction = gdsScreen.getdatabyname(iSRow , "CALL_BACK_FUNCTION");
		var strScreenID = gdsScreen.getdatabyname(iSRow , "SCREEN_NAME");

		gdsScreen.deleterow(iSRow);
		GFV_SCREEN_OBJ[iTabIndex] = null;
		GFV_PARENT_SCREEN_OBJ[iTabIndex] = null;	
		GFV_SCREEN_HASH_ARRAY[iTabIndex] = null;	

		var objPopup = factory.findpopup(strScreenID);

		if(factory.isobject(objPopup)) {
			objPopup.unload();
			objPopup = null;		
		}		
		
		if(isScreen(objParentScreen) && objParentScreen.findscriptmethod(XFD_JAVASCRIPT, strCallBackFunction)){	
			var objScreenMember = objParentScreen.getmembers(XFD_JAVASCRIPT);	
			eval("objScreenMember." + strCallBackFunction)(aryHash);	
		}		
	}
}



/*
* 처리중을 모달로 뛰웁니다
* objScreen   	: (object) 스크린 객체
* strAppendId	 : (string) 아이디
*/
function gfnShowWait(objScreen , strAppendId){
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnShowWait 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnShowWait 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}

	var strScreenID = objScreen.getscreenid();	
	
	console.log("strScreenID : " + strScreenID);
	if(!isNull(strAppendId)){
		strScreenID += strAppendId;
	}
	
	var commonWaitDiglog = factory.findpopup("commonWaitDialog_" + strScreenID);		
	if(factory.isobject(commonWaitDiglog))
	{
		commonWaitDiglog.setfocus();
	}else{
		var strHead = gfnGetMetaData("", "처리중");
		//factory.loadpopup("commonWaitDialog_" + strScreenID , "/FRAME/processing" , strHead , true , 2 , 0 , 0 , true , false , objScreen);
		//factory.loadpopup("commonWaitDialog_" + strScreenID, "/FRAME/processing", strHead, false, XFD_BORDER_RAISED, 0, 0, true, true, objScreen, "");
		//objScreen.loadportletpopup("commonWaitDialog_" + strScreenID, "/FRAME/processing", strHead, true, 0, 0, 0, 0, 0, true, true, false, "");
		//objScreen.loadportletpopup(strPopupName, strUrl, "MESSAGE_PORTLET", true, 0, 0, 0, 0, 0, true, true, false, extraData);
		
		//AParentScr.loadportletpopup(strPopupName, objInfo.FrameUrl, "POPUP_PORTLET", true, resize == true? XFD_BORDER_RESIZE : 0, 0 ,0, 0, 0, true, true, false, AExtraData);
		var ret = objScreen.loadportletpopupsync("commonWaitDialog_" + strScreenID, "/FRAME/processing", strHead, false, XFD_BORDER_RAISED, 0, 0, 419, 230, true, false, ""); 
		//commonWaitDiglog = factory.findpopup("commonWaitDialog_" + strScreenID);
		commonWaitDiglog = objScreen.findportletpopup("commonWaitDialog_" + strScreenID);
		if(factory.isobject(commonWaitDiglog)) {
			console.log("commonWaitDiglog isobject : true");
			commonWaitDiglog.domodal();
		}
	}

	return;	
}



/*
* 처리중을 없앱니다
* objScreen   		  : (object) 스크린 객체
* strAppendId	 : (string) 아이디
*/
function gfnWaitDestroy(objScreen , strAppendId){
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnWaitDestroy 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnWaitDestroy 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	objScreen.setscreenprotect(false);
//	var strScreenID = objScreen.getscreenid();
//	
//	if(!isNull(strAppendId)){
//		strScreenID += strAppendId;
//	}
//	
//	var commonWaitDiglog = factory.findpopup("commonWaitDialog_" + strScreenID);
//	
//	if(factory.isobject(commonWaitDiglog)) {
//		commonWaitDiglog.unload();
//		commonWaitDiglog = null;
//	}
	
	return;
}



/*
* 데이터셋에서 해당줄을 찾습니다
* objDataset     : (object) 데이터셋 객체
* strColumn	  : (string) 해당 컬럼
* strSearchValue : (string) 값
* iCnt		   : (int) 몇번째 순번
* [return] => int 
*/
function gfnFindRow(objDataset , strColumn , strSearchValue , iCnt){
	var iSRow = -1;
	if(isNullObj(objDataset)){
		return iSRow;
	}
	
	if(isNull(iCnt)){
		iCnt = 0;
	}
	
	if(isNull(strColumn)){
		return iSRow;
	}
	
	if(isNull(strSearchValue)){
		return iSRow;
	}
	
	var iCatchCnt = 0;
	for(var i=0;i<objDataset.getcolumncount();i++){
		var strColumnName = objDataset.getcolumnid(i);		
		
		if(strColumn == strColumnName){
			for(var j=0;j<objDataset.getrowcount();j++){
				var strValue = objDataset.getdatabyname(j , strColumn);		
				
				if(strSearchValue == strValue){		
					if(iCnt == iCatchCnt){
						iSRow = j;
						break;						
					}else{
						iCatchCnt ++;
					}
				}
			}	
		}		
	}
	
	return iSRow;
}


/*
* 데이터셋에서 해당줄을 찾습니다
* aryDs          : (array) 데이터셋 객체
* strColumn	  : (string) 해당 컬럼
* strSearchValue : (string) 값
* iCnt		   : (int) 몇번째 순번
* [return] => int 
*/
function gfnAryDsFindRow(aryDs , strColumn , strSearchValue , iCnt ){
	var iSRow = -1;

	if(isNullObj(aryDs)){
		return iSRow;
	}
	
	if(isNull(iCnt)){
		iCnt = 0;
	}
	
	if(isNull(strColumn)){
		return iSRow;
	}
	
	if(isNull(strSearchValue)){
		return iSRow;
	}
	
	var iCatchCnt = 0;

	for(var i=0;i<gfnGetAryHashCount(aryDs);i++){
		var strValue = gfnGetAryData(aryDs , i , strColumn);		
		
		if(strSearchValue == strValue){		
			if(iCnt == iCatchCnt){
				iSRow = i;
				break;						
			}else{
				iCatchCnt ++;
			}
		}		
	}
	
	return iSRow;
}


/*
* 데이터셋에서 해당줄을 찾습니다 (이차원 배열 필요)
* objDataset   : (object) 데이터셋 객체
* aryDual	  : (aryDual) 이차원 배열
* [return] => int 
*/
function gfnAndFindRow(objDataset , aryDual){
	var iSRow = -1;
	if(isNullObj(objDataset)){
		return iSRow;
	}
		
	if(isNull(aryDual)){
		return iSRow;
	}
	
	var iCatchFirstRowAry = [];
	var iCatchLemainderRowAry = [];	

	for(var i=0;i<aryDual.length;i++){
		var dataAry = aryDual[i];	
		var strColumn = dataAry[0];
		var strValue = dataAry[1];

		for(var j=0;j<objDataset.getcolumncount();j++){
			var strColumnName = objDataset.getcolumnid(j);		

			if(strColumn == strColumnName){
				for(var k=0;k<objDataset.getrowcount();k++){
					var strGetValue = objDataset.getdatabyname(k , strColumn);		

					if(strGetValue == strValue){	
						if(i==0){
							iCatchFirstRowAry[iCatchFirstRowAry.length] = k;	
						}else{
							iCatchLemainderRowAry[iCatchLemainderRowAry.length] = k;	
						}								
					}
				}
			}		
		}		
	}

	for(var i=0;i<iCatchFirstRowAry.length;i++){		
		var iCatchCnt = 0;
		for(var j=0;j<iCatchLemainderRowAry.length;j++){			
			if(iCatchFirstRowAry[i] == iCatchLemainderRowAry[j]){
				iCatchCnt ++;
			}
		}
		
		if(iCatchCnt == aryDual.length-1){
			iSRow = iCatchFirstRowAry[i];
			break;
		}
	}
	
	return iSRow;
}


/*
* 데이터셋에서 해당줄을 찾아 해당 컬럼값을 반환합니다
* objDataset     : (object) 데이터셋 객체
* strColumn	  : (string) 컬럼
* strSearchValue : (string) 찾을 값
* strGetColumn   : (string) 가져올 컬럼
* [return] => string 
*/
function gfnLookUp(objDataset , strColumn , strSearchValue , strGetColumn){
	var iSRow = gfnFindRow(objDataset , strColumn , strSearchValue);
	if(iSRow != -1){
		return objDataset.getdatabyname(iSRow , strGetColumn);	
	}else{
		return "";
	}
}


/*
* hash 형 배열의 키값만을 일반 배열형으로 반환해줍니다
* aryHash        : (array) hash 형 배열   => aty["A"] = "B"
* [return] => array 
*/
function gfnGetSortHashKeys(aryHash){
	var aryKeys = new Array();
	for(var aryKeyIn in aryHash){
		aryKeys[aryKeys.length] = aryKeyIn;
	}
	
	aryKeys.sort();
	return aryKeys;
}



/*
* hash 형 배열의 갯수를 반환합니다
* aryHash        : (array) hash 형 배열   => aty["A"] = "B"
* [return] => int 
*/
function gfnGetAryHashCount(aryHash){
	var ary = gfnGetSortHashKeys(aryHash);
	return ary.length;
}



/*
* 팝업에서 호출하는 부모가 보낸 데이터 가져오기
* objScreen   : (object) 스크린 객체
* [return] => array hasy 
*/
function gfnGetParentReciveDataAry(objScreen){
	var aryHash = [];
	
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnGetParentReciveDataAry 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetParentReciveDataAry 개발자 오류] screen 객체를 넘겨주세요");
		return;
	} 

	var iSRow = gfnGetPopFindRow(objScreen);

	if(iSRow != -1){	
		var iTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");
		aryHash = GFV_SCREEN_HASH_ARRAY[iTabIndex];		
	}
	
	return aryHash;
}


/*
* 스크린 데이터셋에서 해당 팝업의 줄을 반환합니다
* objScreen   : (object) 스크린 객체
* [return] => int 
*/
function gfnGetPopFindRow(objScreen){
	var aryDual = [ ["TYPE" , "POP"]  ,  ["SCREEN_WINDOW_ID" , objScreen.getwindowid()] ];
	
	return gfnAndFindRow(gdsScreen , aryDual);
}


/*
* 나의 부모에서 해당 객체를 반환합니다
* objScreen   : (object) 스크린 객체
* strObjName  : (string) 객체 name
* [return] => object 
*/
function gfnGetParentObjectByName(objScreen , strObjName){
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnGetParentObjectByName 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetParentObjectByName 개발자 오류] screen 객체를 넘겨주세요");
		return null;
	} 
	
	var ObjParentScreen = objScreen.getparent();
	return gfnGetObjectByName(ObjParentScreen , strObjName);
}

/*
* 스크린에서 해당 객체를 반환합니다
* objScreen   : (object) 스크린 객체
* strObjName  : (string) 객체 name
* [return] => object 
*/
function gfnGetObjectByName(objScreen , strObjName){
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnGetObjectByName 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetObjectByName 개발자 오류] screen 객체를 넘겨주세요" + strObjName);
		return null;
	} 
	
	if(!isNull(strObjName)){		
		var aryObj = objScreen.getinstanceall(0);

		for(var i=0;i<aryObj.length;i++){
			var instObj = aryObj[i];
			if(isNullObj(instObj)){
				continue;
			}

			if(instObj.getcontrolkind() == XFD_CTRLKIND_TAB){	//탭일경우	
				if(instObj.getname() == strObjName){
					return instObj;
				}
				
				for(var j=0;j<instObj.gettabitemcount();j++){			
					var objTabScreenFrame = instObj.getchildscreeninstance(j);
				
					if(isScreen(objTabScreenFrame)){	//스크린 객체면						
						var objCatch = gfnGetObjectByName(objTabScreenFrame , strObjName);
						
						if(!isNullObj(objCatch)){
							return objCatch;
						} 
					}else{
						var aryTabCtrlObjs = gfnGetTabChildCtrlIdAry(instObj , j);
					
						for(var k=0;k<aryTabCtrlObjs.length;k++){
							var instTabObj = instObj.getchildinstance(j , aryTabCtrlObjs[k]);
					
							if(isNullObj(instTabObj)){
								continue;
							}	
							
							if(instTabObj.getcontrolkind() == XFD_CTRLKIND_TAB){	//탭일경우
								var objCatch = gfnGetObjectTabInByName(instTabObj , strObjName);
								
								if(!isNullObj(objCatch)){
									return objCatch;
								} 
							}else{
								if(instTabObj.getname() == strObjName){
									return instTabObj;
								}
							}
						}
					}								
				}	
			}else{
				if(instObj.getname() == strObjName){
					return instObj;
				}
			}	
		}
		
		return null;
	}

	return null;
}


/*
* 탭 객체에서 해당 객체를 반환합니다
* objScreen   : (object) 스크린 객체
* strObjName  : (string) 객체 name
* [return] => object 
*/
function gfnGetObjectTabInByName(instObj , strObjName){
	if(instObj.getcontrolkind() == XFD_CTRLKIND_TAB){	//탭일경우	
		if(instObj.getname() == strObjName){
			return instObj;
		}
				
		for(var j=0;j<instObj.gettabitemcount();j++){			
			var objTabScreenFrame = instObj.getchildscreeninstance(j);
		
			if(isScreen(objTabScreenFrame)){	//스크린 객체면
				var objCatch = gfnGetObjectByName(objTabScreenFrame , strObjName);

				if(!isNullObj(objCatch)){
					return objCatch;
				} 				
			}else{
				var aryTabCtrlObjs = gfnGetTabChildCtrlIdAry(instObj , j);

				for(var k=0;k<aryTabCtrlObjs.length;k++){
					var instTabObj = instObj.getchildinstance(j , aryTabCtrlObjs[k]);

					if(isNullObj(instTabObj)){
						continue;
					}	
					
					if(instTabObj.getcontrolkind() == XFD_CTRLKIND_TAB){	//탭일경우
						var objCatch = gfnGetObjectTabInByName(instTabObj , strObjName);
				
						if(!isNullObj(objCatch)){
							return objCatch;
						} 
					}else{
						if(instTabObj.getname() == strObjName){
							return instTabObj;
						}
					}
				}
			}								
		}	

		return null;
	}
	return null;
}	

/*
* 시퀀스를 반환합니다
* strSeqId      : (string) 시퀀스구분
* strSeqType    : (string) 시퀀스 타입  'YYYYMMDD' , 'YYYY' , 'YYYYMM' , 9999'
* strAppendWord : (string) 앞쪽에 붙여질 문자
* iTotalLength  : (int) 총 길이
* [return] => string 
*/
function gfnGetSequence(strSeqId , strSeqType , strAppendWord , iTotalLength){

//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
	var objMainScreen = SYSVar.WINMAIN_SCREEN;
	var objMainScreenMember = SYSVar.WINMAIN_MEMBER;
	var strReturnSeq = "";
	
	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnMainGetSequence")){ 
		strReturnSeq = objMainScreenMember.ufnMainGetSequence(strSeqId , strSeqType , strAppendWord , iTotalLength);
	}
	  
	return strReturnSeq;	
}

/*
* 프로젝트 시퀀스를 반환합니다
* strSeqId      : (string) 시퀀스구분
* strSeqType    : (string) 시퀀스 타입  'YYYYMMDD' , 'YYYY' , 'YYYYMM' , 9999'
* strPrjId : (string) 프로젝트 ID
* strPrjLength  : (int) 총 길이
* [return] => string 
*/
//function gfnGetPrjSequence(strSeqId , strSeqType , strPrjId , strPrjLength){
//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
//	var strReturnPrjSeq = "";
//	
//	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnMainGetPrjSequence")){ 
//		strReturnPrjSeq = objMainScreenMember.ufnMainGetPrjSequence(strSeqId , strSeqType , strPrjId , strPrjLength);
//	}
//	  
//	return strReturnPrjSeq;	
//}

/*
* 업무일을 반환합니다.
* strStrtYMD      : (string) 시작일
* strFnhYMD      : (string) 종료일
*/
//function gfnGetWorkingDay(strStrtYMD , strFnhYMD){
//
//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
//	var strReturnWorkingDay = "";
//	
//	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnMainGetWorkingDay")){ 
//		strReturnWorkingDay = objMainScreenMember.ufnMainGetWorkingDay(strStrtYMD, strFnhYMD);
//	}
//	  
//	return strReturnWorkingDay;	
//}


/*
* 문자 좌측에 채워넣기
* strValue     : (string) 원래 값
* strAppend    : (string) 추가할 문자
* iTotalLength : (int) 전체 길이
* [return] => (string)
*/
function gfnLpad(strValue , strAppend , iTotalLength){
	if(isNull(strValue) || isNull(strAppend) || strValue.length >= iTotalLength){
		return strValue;  
	}

	while(strValue.length<iTotalLength){
		strValue = strAppend + strValue;
	}

	return strValue;
}


/*
* MMDD 형식의 일자 유효성 검증 함수 
* strDate : (string) 월일 형태의 날짜
* [return] => (boolean)
*/
function gfnIsMMDD(strDate) 
{
	try {
		if(strDate.length != 4) {
			return false;
		}

		var objTempDate = new Date();
		var nYYYY = objTempDate.getFullYear();
		var nMM = parseInt(strDate.substr(0, 2), 10) - 1; 
		var nDD = parseInt(strDate.substr(2, 2), 10);
	
		var cDate = new Date(nYYYY, nMM, nDD);
		if(cDate.getMonth() != nMM || cDate.getDate() != nDD) {
			return false;
		}
		else {
			return true;
		}
	}
	catch(EXCEP) {
		return false;
	}
}

/*
* YYYYMM 형식의 일자 유효성 검증 함수 
* strDate : (string)  년월 형태의 날짜
* [return] => (boolean) 정상적인 날짜인 경우 true, 아닌 경우 false
*/
function gfnIsYYYYMM(strDate) 
{
	try {
		if(strDate.length != 6) {
			return false;
		}

		var nYYYY = parseInt(strDate.substr(0, 4), 10);
		var nMM = parseInt(strDate.substr(4, 2), 10) - 1; 
	
		var objTempDate = new Date(nYYYY, nMM);

		if(objTempDate.getFullYear() != nYYYY || objTempDate.getMonth() != nMM) {
			return false;
		}
		else {
			return true;
		}
	}
	catch(EXCEP) {
		return false;
	}
}

/*
* YYMM 형식의 일자 유효성 검증 함수 
* strDate : (string) 년2자리 월 형태의 날짜
* [return] => (boolean) 정상적인 날짜인 경우 true, 아닌 경우 false
*/
function gfnIsYYMM(strDate) 
{
	try {
		if(strDate.length != 4) {
			return false;
		}

		var nYYYY = parseInt(strDate.substr(0, 2), 10);
		var nMM = parseInt(strDate.substr(2, 2),10) -1;  
	  	
		var objTempDate = new Date(nYYYY, nMM);
		if(objTempDate.getFullYear() != nYYYY || objTempDate.getMonth() != nMM) {
			return false;
		}
		else {
			return true;
		}
	}
	catch(EXCEP) {
		return false;
	}
}

/*
* YYYYMMDD 형식의 일자 유효성 검증 함수 
* strDate : (string) YYYYMMDD 형태의 날짜
* [return] => (boolean) 정상적인 날짜인 경우 true, 아닌 경우 false
*/
function gfnIsYYYYMMDD(strDate) 
{
	try {
		if(strDate.length != 8) {
			return false;
		}

		var nYYYY = parseInt(strDate.substr(0, 4), 10);
		var nMM = parseInt(strDate.substr(4, 2),10) - 1;   //월은 0~11월이므로 1을 빼준다.
		var nDD = parseInt(strDate.substr(6, 2), 10);
	
		var objTempDate = new Date(nYYYY, nMM, nDD);	  
		if(objTempDate.getFullYear() != nYYYY || objTempDate.getMonth() != nMM || objTempDate.getDate() != nDD) {
			return false;
		}
		else {
			return true;
		}
	}
	catch(EXCEP) {
		return false;
	}
}

/*
* YYMMDD 형식의 일자 유효성 검증 함수 
* strDate : (string) YYMMDD 형태의 날짜
* [return] => (boolean) 정상적인 날짜인 경우 true, 아닌 경우 false
*/
function gfnIsYYMMDD(strDate) 
{
	try {
		if(strDate.length != 6) {
			return false;
		}

		var nYYYY = parseInt(strDate.substr(0, 2), 10);
		var nMM = parseInt(strDate.substr(2, 2), 10) - 1;   
		var nDD = parseInt(strDate.substr(4, 2), 10);

		var objTempDate = new Date(nYYYY, nMM, nDD);
		if(cDate.getFullYear() != nYYYY || cDate.getMonth() != nMM || cDate.getDate() != nDD) {
			return false;
		}
		else {
			return true;
		}
	}
	catch(EXCEP) {
		return false;
	}
}


/*
* 기준날짜에서 nDayGap일만큼 지난 년월일을 8자리 년월일 형태로 반환한다.
* strDate : (string) YYYYMMDD 형태의 날짜 strDate 기준 날짜 년월일
* nDayGap : (int) YYYYMMDD 형태의 날짜 nDayGap 현재일을 기준으로 날 차이, 음수는 이전 날자
* [return] => (string) 계산된 년월일(YYYYMMDD)
*/
function gfnGetDateByDayGap(strDate, nDayGap)
{
	try {
		if(gfnIsYYYYMMDD(strDate) == false) {
			return "";
		}

		nDayGap = parseInt(nDayGap, 10);
		var strOp = "+";
		if(nDayGap < 0) {
			strOp = "-";
		}

		var nYYYY = parseInt(strDate.substr(0, 4), 10);
		var nMM = parseInt(strDate.substr(4, 2), 10) - 1;
		var nDD = parseInt(strDate.substr(6, 2), 10);
		
		var objTempDate = new Date(nYYYY, nMM, nDD);
		
		objTempDate.setDate(eval(objTempDate.getDate() + strOp + Math.abs(nDayGap)));

		var nCalcYYYY = objTempDate.getFullYear(); 	//연도 가져오기
		
		//달 가져오기 달은 0부터 11까지이므로 1을 더한다
		var nCalcMM = objTempDate.getMonth() + 1; 

		nCalcMM = nCalcMM < 10 ? gfnLpad("" + nCalcMM, "0" , 2) : nCalcMM; 	// 달이 10보다 적으면 앞에 0 붙이기
		
		var nCalcDD = objTempDate.getDate(); //날짜 가져오기
		nCalcDD = nCalcDD < 10 ? gfnLpad("" + nCalcDD, "0" , 2) : nCalcDD; 	// 날짜가 10보다 작으면 앞에 0 붙이기

		var strCalcDate = nCalcYYYY.toString(10) + nCalcMM.toString(10) + nCalcDD.toString(10); 
		return strCalcDate; 
	}
	catch(EXCEP) {
		return "";
	}
}

/*
* 기준날짜에서 nMonthGap월만큼 지난 년월일을 8자리 년월일 형태로 반환한다.
* strDate : (string) YYYYMMDD 형태의 날짜 strDate 기준 날짜 년월일
* nMonthGap : (int) YYYYMMDD 형태의 날짜 nMonthGap 현재일을 기준으로 날 차이, 음수는 이전 달
* [return] => (string) 계산된 년월일(YYYYMMDD)
*/
function gfnGetDateByMonthGap(strDate, nMonthGap)
{
	var add_m;
	var lastDay; // 마지막 날(30,31..)
	var pyear, pmonth, pday;
	
	strDate = gfnStringToDate(strDate); // javascript 날짜형변수로 변환
	if (strDate == "") return "";
	pyear = strDate.getFullYear();
	pmonth= strDate.getMonth() + 1;
	pday = strDate.getDate();
	
	add_m = new Date(pyear, pmonth + nMonthGap, 1); // 더해진 달의 첫날로 셋팅
	
	lastDay = new Date(pyear, pmonth, 0).getDate(); // 현재월의 마지막 날짜를 가져온다.
	if (lastDay == pday) { // 현재월의 마지막 일자라면 더해진 월도 마지막 일자로 
	pday = new Date(add_m.getFullYear(), add_m.getMonth(), 0).getDate();
	}
	
	add_m = new Date(add_m.getFullYear(), add_m.getMonth()-1, pday);
	

	var nCalcYYYY = add_m.getFullYear(); 	//연도 가져오기
		
	//달 가져오기 달은 0부터 11까지이므로 1을 더한다
	var nCalcMM = add_m.getMonth() + 1; 

	nCalcMM = nCalcMM < 10 ? gfnLpad("" + nCalcMM, "0" , 2) : nCalcMM; 	// 달이 10보다 적으면 앞에 0 붙이기
	
	var nCalcDD = add_m.getDate(); //날짜 가져오기
	nCalcDD = nCalcDD < 10 ? gfnLpad("" + nCalcDD, "0" , 2) : nCalcDD; 	// 날짜가 10보다 작으면 앞에 0 붙이기

	var strCalcDate = nCalcYYYY.toString(10) + nCalcMM.toString(10) + nCalcDD.toString(10); 

	return strCalcDate;
}

/*
* String 날짜를 자바스크립트 Date Object로 변환한다.
* strDate : (string) 기준날짜 년월일
* [return] => (Date) Date형식으로 변환된 Object
* @remarks String 날짜를 자바스크립트 Date Object로 변환한다.
*/

function gfnStringToDate(strDate) {
	var yy, mm, dd, yymmdd;
	var ar;
	if (strDate.indexOf(".") > -1) { // yyyy-mm-dd
	ar = strDate.split(".");
	yy = ar[0];
	mm = ar[1];
	dd = ar[2];
	
	if (mm < 10) mm = "0" + mm;
	if (dd < 10) dd = "0" + dd;
	} else if (strDate.indexOf("-") > -1) {// yyyy.mm.dd
	ar = strDate.split("-");
	yy = ar[0];
	mm = ar[1];
	dd = ar[2];
	
	if (mm < 10) mm = "0" + mm;
	if (dd < 10) dd = "0" + dd;
	} else if (strDate.length == 8) {
	yy = strDate.substr(0,4);
	mm = strDate.substr(4,2);
	dd = strDate.substr(6,2);
	}
	
	yymmdd = yy+"/"+mm+"/"+dd;
	
	yymmdd = new Date(yymmdd);
	
	if (isNaN(yymmdd)) {
	//alert("날짜 형식이 올바르지 않습니다.");
	return false;
	}
	
	return yymmdd;
}


/*
* 지정일자 마지막일자 반환 
* strDate : (string) 기준날짜 년월일
* [return] => (int) 해당 월의 마지막 일수
* @remarks 대상날짜가 포함된 월의 마지막 날을 반환한다.
*/
function gfnGetLastDate(strDate)
{	
	try {
		if(gfnIsYYYYMMDD(strDate) == false) {
			return "";
		}

		var nYYYY = parseInt(strDate.substr(0, 4), 10);
		var nMM = parseInt(strDate.substr(4, 2), 10); //월은 0~11월이므로 1을 빼줘야 하지만 원하는 달의 다음달을 구해야 하므로 빼지 않는다.
		var nDD = "1";
	
		var objTempDate = new Date(nYYYY, nMM, nDD);
		
		objTempDate.setDate(objTempDate.getDate() - 1); 
		
		var nCalcYYYY = objTempDate.getFullYear(); 
		
		//달 가져오기 달은 0부터 11까지이므로 1을 더한다
		var nCalcMM = objTempDate.getMonth() + 1; 
		nCalcMM = nCalcMM < 10 ? padStr(nCalcMM, "0" , 2, true) : nCalcMM; 	// 달이 10보다 적으면 앞에 0 붙이기
		
		var nCalcDD = objTempDate.getDate(); //날짜 가져오기
		nCalcDD = nCalcDD < 10 ? padStr(nCalcDD, "0" , 2, true) : nCalcDD; 	// 날짜가 10보다 작으면 앞에 0붙이기
		
		var strCalcDate = nCalcYYYY.toString(10) + nCalcMM.toString(10) + nCalcDD.toString(10); 
				
		return strCalcDate;
	}
	catch(EXCEP) {
		return "";
	}
}

/*
* 시작시간과 종료시간 차이계산 (시간 소수점 2자리 (ex)2.67) 반환)
* strStart       : (string) '1540' 형식
* strEnd         : (string) '1300' 형식
* [return] => (int) 시간 소수점 2자리 (ex)2.67)
*/
function gfnTimeDiffHour(strStart , strEnd)
{
	if(isNull(strStart)){
		return "";
	}
	
	if(isNull(strEnd)){
		return "";
	}
	var startDate = new Date(2022,0,1,strStart.substr(0,2),strStart.substr(2,2));
	var endDate = new Date(2022,0,1,strEnd.substr(0,2),strEnd.substr(2,2));
	var diff = endDate.getTime() - startDate.getTime();
	var hour = diff / 1000 / 60 / 60;	
	var roundhour = Math.round(hour * 100) / 100;
	
	return roundhour;
}

/*
* 시작날짜와 종료 날짜를 
* objScreen      : (object) 스크린 객체
* strPreDate     : (string) 'YYYYMMDD' 형식
* strPosDate     : (string) 'YYYYMMDD' 형식
* blNeed 		: (boolean) 필수 여부
* blNotAlertShow : (boolean) 경고차 비활성 여부
* [return] => (boolean)
*/
function gfnDateStrDiff(objScreen , strPreDate , strPosDate , blNeed , blNotAlertShow){
	if(!isScreen(objScreen)){	
//		alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnDateStrDiff 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnDateStrDiff 개발자 오류] screen 객체를 넘겨주세요");
		return false;
	}
	
	if(isNull(blNeed)){
		blNeed = false;
	}
	
	if(isNull(blNotAlertShow)){
		blNotAlertShow = false;
	}
		
	if( (!isNull(strPreDate) && !gfnIsYYYYMMDD(strPreDate)) || (!isNull(strPosDate) && !gfnIsYYYYMMDD(strPosDate)) ) {
		if(!blNotAlertShow){
			alert(objScreen , "" , "날짜형식 'YYYYMMDD' (을)를 확인해주세요");
		}
		return false;
	}
	
	if(blNeed){
		if(isNull(strPreDate) || isNull(strPosDate)){	
			if(!blNotAlertShow){
				alert(objScreen , "" , "시작 날짜와 종료 날자는 필수 입력 입니다");
			}
			
			return false;
		}
	}
	
	if(!isNull(strPreDate) && isNull(strPosDate)){
		if(!blNotAlertShow){
			alert(objScreen , "" , "종료 날짜가 없습니다");
		}
		
		return false;
	}else if(isNull(strPreDate) && !isNull(strPosDate)){
		if(!blNotAlertShow){
			alert(objScreen , "" , "시작날짜가 없습니다");
		}
		
		return false;
	}
	
	if(!isNull(strPreDate) && !isNull(strPosDate)){
		var iSDay = parseInt(strPreDate);
		var iEDay = parseInt(strPosDate);
	
		if(iSDay > iEDay){
			if(!blNotAlertShow){
				alert(objScreen , "" , "시작 날짜가 종료 날자보다 큽니다 확인해주세요");
			}
			
			return false;
		}
	}
	
	return true;
}





/*
* 해당 에디터에서 시작날짜와 종료 날짜를 확인합니다
* objScreen      : (object) 스크린 객체
* strPreDate     : (object) edit 객체
* strPosDate     : (object) edit 객체
* blNeed 		: (boolean) 필수 여부
* blNotAlertShow : (boolean) 경고차 비활성 여부
* [return] => (boolean)
*/
function gfnDateObjDiff(objScreen , objPreDate , objPosDate , blNeed , blNotAlertShow){	
	var strPreDate = objPreDate.gettext();
	var strPosDate = objPosDate.gettext();
	
	var blReturn = gfnDateStrDiff(objScreen , strPreDate , strPosDate , blNeed , blNotAlertShow);	
	
	if(!blReturn){
		if(isNull(strPreDate)){
			objPreDate.setfocus();
		}else{
			objPosDate.setfocus();
		}
	}
	
	return blReturn;
}

/*
* 좌측 메뉴 펼치기 여부
* blShow : (boolean) 펼치기 true
*/
//function gfnShowLeftMenu(blShow){
//	var objMiddleScreen = CCNConst.MIDDLE_MAIN_SCREEN;
//	var objMiddleScreenMember = CCNConst.MIDDLE_MAIN_MEMBER;
//
//	if(isScreen(objMiddleScreen) && objMiddleScreen.findscriptmethod(XFD_JAVASCRIPT, "showLeftTab")){ 
//		objMiddleScreenMember.showLeftTab(blShow);	//메뉴바 보이기
//	}	
//}


/*
* 인트로 보이기 여부
* blShow 	    : (boolean) 보이기 true
* blLeftMenuShow : (boolean) 좌측 메뉴 보이기여부
*/
//function gfnShowIntro(blShow , blLeftMenuShow){
//	var objIntroTab = CCNConst.MIDDLE_MAIN_INTRO_TAB;
//	
//	if(isNull(blLeftMenuShow)){
//		blLeftMenuShow = false;
//	}
//	
//	if(!isNullObj(objIntroTab)){ //보여주기를 선택하면
//		if(blShow && !blLeftMenuShow){
//			gfnShowLeftMenu(false);	//좌측메뉴를 안보이게 처리함
//		}
//				
//		objIntroTab.SetVisible(blShow);	// 인트로를 숨김/보임
//		
//		var objReturn = CCNConst.MAIN_INTRO_SCREEN.findscriptmethod(XFD_JAVASCRIPT , "btnCommonSearch_on_mouseup");
//			
//		if(blShow && objReturn){
//			CCNConst.MAIN_INTRO_MEMBER.btnCommonSearch_on_mouseup(null);
//		}
//	}	
//}


/*
* 날짜 달력을 뛰웁니다 
* objScreen  : (object) 스크린 객체
* objButton  : (object) 버튼 객체
* objField   : (object) 값이 들어갈 필드 객체
* strCallBackFunction : (string) 콜백함수명 널일시 on_calendar_selectdate 기본 호출
*/
function gfnShowCalendar(objScreen , objButton , objField , strCallBackFunction){
	//CCNUtil.showCalendar(objScreen , objButton , objField , strCallBackFunction);
	var	nCalendarScreenWidth = 200;
	var	nCalendarScreenHeight = 167;
	
	// return CCNCore.ShowCalendar(objParentScreen, objBtn, objDateField);
	if(objField.getinputtype()==2 || !objField.getenable()){ 
		return false;
	}
	
	// var nXPos = objCalendarBtn.getwindowleft() + objCalendarBtn.getwidth();
	var nXPos = objField.getwindowleft();
	var nYPos = objField.getwindowtop() + objField.getheight();

	
		
	// 메뉴 형태로 load
	if(factory.loadmenu("달력", "/FRAME/CalendarP", nXPos, nYPos, nCalendarScreenWidth, nCalendarScreenHeight, objScreen) == false) {
		return false;
	}
	
	// 로드된 달력 메뉴를 찾아서 메뉴화면안에 있는 텍스트 오브젝트에 현재 날짜 필드 이름을 복사해둔다.
	var objCalendarScreen = factory.findmenu("달력");
	if(factory.isobject(objCalendarScreen) == false) {
		return false;
	}

	var objCalendarScreenMember = objCalendarScreen.getmembers(XFD_JAVASCRIPT);
	objCalendarScreenMember.m_objDateField = objField;
	objCalendarScreenMember.m_objCalendarButton = objButton;
	objCalendarScreenMember.m_fldCallBackFunction = strCallBackFunction;
	
	
	// 달력팝업에서 날짜선택시 입력을 받을 필드 오브젝트의 이름을 팝업화면에 복사
	var fldDateFieldName = objCalendarScreen.getinstancebyname("fldDateFieldName");
	if (factory.isobject(fldDateFieldName) == true) {
		fldDateFieldName.settext(objField.getname());
	}
	
	// 달력팝업에 현재 날짜 필드오브젝트에 입력된 날짜가 있다면 현재 날짜를 달력에 반영
	var objCalendarCtrl = objCalendarScreen.getinstancebyname("objCalendarCtrl");
	if(factory.isobject(objCalendarCtrl) == false) {
		return false;
	}
	
	// jbs append 2011.10.05 필드의 날짜를 검증하여 정상적인 날짜인경우 필드 값 세팅. 비정상적인 날짜인 경우 영업일 세팅
	//var bIsValid = SYSTime.isYYYYMMDD(objDateField.gettext());
	var bIsValid = gfnIsYYYYMMDD(objField.gettext());
	
	if(bIsValid == true) {
		objCalendarCtrl.setdate(objField.gettext());
	}
	else{
		// ctrlCalendar.setdate( getTodayBiz(objParentScreen) );
	}
}


/*
* 그리드에서 날짜 달력을 뛰웁니다 
* objScreen  : (object) 스크린 객체
* objGrid    : (object) 그리드 객체
* iRow  	 : (int) 그리드 줄
* iCell      : (int) 그리드 컬럼
* strCallBackFunction : (string) 콜백함수명 널일시 on_calendar_selectdate_forgrid 기본 호출
*/
function gfnShowGrdCalendar(objScreen , objGrid , iRow , iCell , strCallBackFunction){
	//CCNUtil.showCalendarForGrid(objScreen , objGrid , iRow , iCell , strCallBackFunction);
	var nCalendarScreenWidth = 200;
	var nCalendarScreenHeight = 167;
	
	var strColumnName = objGrid.getcolumnname(iCell);

	var nXPos = objGrid.getwindowleft() + CCNGrid.getGridCellRight(objGrid, iCell);
	var nYPos = objGrid.getwindowtop() + CCNGrid.getGridCellBottom(objGrid, iRow);

	// 2009.01.07 달력팝업 화면영역벗어나는것 방지하기위해 위치 재조정
	var nBizScreenWidth = objScreen.getscreenwidth();
	var nBizScreenHeight = objScreen.getscreenheight();
	
	if(nXPos < 0) {
		nXPos = 0;
	}
		
	if(nYPos < 0) {
		nYPos = 0;
	}
	
	if(nXPos > (nBizScreenWidth - nCalendarScreenWidth)) {
		nXPos = nXPos- nCalendarScreenWidth;
	}
	
	if(nYPos > (nBizScreenHeight - nCalendarScreenHeight)) {
		nYPos = nYPos - nCalendarScreenHeight;
	}
	
	if(factory.loadmenu("달력", "/FRAME/CalendarP", nXPos, nYPos, nCalendarScreenWidth, nCalendarScreenHeight, objScreen) == false) {
		return;
	}
	
	//load된 메뉴를 찾아서 메뉴화면안에 있는 text object에 현재 날짜 필드 이름을 복사해둔다.
	var objCalendarScreen = factory.findmenu("달력");
	if(factory.isobject(objCalendarScreen) == false) {
		return false;
	}
	var objCalendarScreenMember = objCalendarScreen.getmembers(XFD_JAVASCRIPT);
	objCalendarScreenMember.m_objDateGrid = objGrid;
	objCalendarScreenMember.m_fldCallBackFunction = strCallBackFunction;
	
	//달력팝업에서 날짜선택시 입력을 받을 필드오브젝트의 이름을 팝업화면에 복사
	var fldDateGridName = objCalendarScreen.getinstancebyname("fldDateGridName");
	if(factory.isobject(fldDateGridName) == true) {
		fldDateGridName.settext(objGrid.getname());
	}
	
	var objFldRow = objCalendarScreen.getinstancebyname("fldRow");
	if(factory.isobject(objFldRow) == true) {
		objFldRow.settext(iRow);
	}
	
	var objFldColumn = objCalendarScreen.getinstancebyname("fldColumn");
	if (factory.isobject(objFldColumn) == true) {
		objFldColumn.settext(iCell);
	}
	
	//달력팝업에 현재 날짜 필드오브젝트에 입력된 날짜가 있다면 현재 날짜를 달력에 반영
	var objCalendarCtrl = objCalendarScreen.getinstancebyname("objCalendarCtrl");
	if(factory.isobject(objCalendarCtrl) == false) {
		return;
	}
	
	var bIsValid = SYSTime.isYYYYMMDD(objGrid.getitemtext(iRow, iCell));
	if(bIsValid == true) {
		objCalendarCtrl.setdate(objGrid.getitemtext(iRow, iCell));
	}
}


/*
* 멀티 콤보를 세팅하는 함수
* objScreen  		   : (object) 스크린 객체
* objDataset    		: (object) 팝업에서 보여줄 코드 데이터셋
* objDataNameField  	: (object) 네임이 보여질 객체
* objInDataset  	    : (object) 집접 삽입하게될 데이터셋
* strInDataColumn  	 : (string) 직접삽입하게될 데이터셋 컬럼
* strOnCheckRowCallBack : (string) 온체크 콜백 함수명
*/
//function gfnShowMultiCombo(objScreen , objDataset , objDataNameField , objInDataset , strInDataColumn , strOnCheckRowCallBack)
//{
//	var iHeight = 23 + (objDataset.getrowcount() * 20 );
//	
//	if(iHeight > GFN_MULTI_HEIGHT){
//		iHeight = GFN_MULTI_HEIGHT;
//	}
//	
//	var nLPos = objDataNameField.getwindowleft();
//	var nTPos = objDataNameField.getwindowtop() + objDataNameField.getheight();
//	var nRPos = objDataNameField.getwidth() + 16
//	var nBPos = iHeight ;
//
//	if(!factory.loadmenu("MultiSelectCombo", "/FRAME/MultiSelectComboP", nLPos, nTPos, nRPos, nBPos, objScreen)) {
//		return false;
//	}
//	
//	// 로드된 메뉴를 찾아서 메뉴화면안에 있는 텍스트 오브젝트에 현재 날짜 필드 이름을 복사해둔다.
//	var objMultiSelectComboScreen = factory.findmenu("MultiSelectCombo");
//	if(!factory.isobject(objMultiSelectComboScreen)){
//		return false;
//	}
//
//	var objMultiSelectComboScreenScreenMember = objMultiSelectComboScreen.getmembers(XFD_JAVASCRIPT);	
//	objMultiSelectComboScreenScreenMember.strObjNameFieldName = objDataNameField.getname();	//팝업창에 부모객체 저장 (보여주는명칭)
//	objMultiSelectComboScreenScreenMember.objInDataset = objInDataset;					//팝업창에 부모객체 저장(적용될 부모데이터셋)
//	objMultiSelectComboScreenScreenMember.strInDataColumn = strInDataColumn;				//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiSelectComboScreenScreenMember.iMultiWidth = nRPos;					//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiSelectComboScreenScreenMember.strReciveCode = objInDataset.getdatabyname(objInDataset.getpos() , strInDataColumn);	// 현재 값들
//	objMultiSelectComboScreenScreenMember.strOnCheckRowCallBack = strOnCheckRowCallBack;	// 체크시 호출 함수명
//
//		
//	var objTargetDs = objMultiSelectComboScreen.getxdataset("dsMultiCombo");
//
//	if(!isNullObj(objTargetDs)){
//		gfnCopyDataSet(objDataset , objTargetDs);
//	}
//	
//	objMultiSelectComboScreenScreenMember.fnSetData();
//}


/*
* 멀티 콤보를 세팅하는 함수
* objScreen  		   : (object) 스크린 객체
* objDataset    		: (object) 팝업에서 보여줄 코드 데이터셋
* objDataNameField  	: (object) 네임이 보여질 객체
* objInDataset  	    : (object) 집접 삽입하게될 데이터셋
* strInDataColumn  	 : (string) 직접삽입하게될 데이터셋 컬럼
* strOnCheckRowCallBack : (string) 온체크 콜백 함수명
* inSingleQ 			: (bool) '' 추가 여부 디폴트는 false
*/
//function gfnShowMultiComboColumn(objScreen , objDataset , objDataNameField , objInDataset , strInDataColumn , strOnCheckRowCallBack, inSingleQ)
//{
//	var iHeight = 23 + (objDataset.getrowcount() * 20 );
//	
//	if(iHeight > GFN_MULTI_HEIGHT){
//		iHeight = GFN_MULTI_HEIGHT;
//	}
//	
//	var nLPos = objDataNameField.getwindowleft();
//	var nTPos = objDataNameField.getwindowtop() + objDataNameField.getheight();
//	var nRPos = objDataNameField.getwidth() + 16
//	var nBPos = iHeight ;
//
//	if(!factory.loadmenu("MultiSelectComboColumn", "/FRAME/MultiSelectComboColumnP", nLPos, nTPos, nRPos, nBPos, objScreen)) {
//		return false;
//	}
//	
//	if(isNull(inSingleQ))
//		inSingleQ = false;
//	
//	// 로드된 메뉴를 찾아서 메뉴화면안에 있는 텍스트 오브젝트에 현재 날짜 필드 이름을 복사해둔다.
//	var objMultiSelectComboScreen = factory.findmenu("MultiSelectComboColumn");
//	if(!factory.isobject(objMultiSelectComboScreen)){
//		return false;
//	}
//
//	var objMultiSelectComboScreenScreenMember = objMultiSelectComboScreen.getmembers(XFD_JAVASCRIPT);	
//	objMultiSelectComboScreenScreenMember.strObjNameFieldName = objDataNameField.getname();	//팝업창에 부모객체 저장 (보여주는명칭)
//	objMultiSelectComboScreenScreenMember.objInDataset = objInDataset;					//팝업창에 부모객체 저장(적용될 부모데이터셋)
//	objMultiSelectComboScreenScreenMember.strInDataColumn = strInDataColumn;				//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiSelectComboScreenScreenMember.iMultiWidth = nRPos;					//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiSelectComboScreenScreenMember.strReciveCode = objInDataset.getdatabyname(objInDataset.getpos() , strInDataColumn);	// 현재 값들
//	objMultiSelectComboScreenScreenMember.strOnCheckRowCallBack = strOnCheckRowCallBack;	// 체크시 호출 함수명
//	objMultiSelectComboScreenScreenMember.inSingleQ = inSingleQ					//추가시 '' 추가여부
//
//		
//	var objTargetDs = objMultiSelectComboScreen.getxdataset("dsMultiCombo");
//
//	if(!isNullObj(objTargetDs)){
//		gfnCopyDataSet(objDataset , objTargetDs);
//	}
//	
//	objMultiSelectComboScreenScreenMember.fnSetData();
//}



/*
* 멀티 콤보를 세팅하는 함수
* objScreen  		   : (object) 스크린 객체
* objDataset    		: (object) 팝업에서 보여줄 코드 데이터셋
* objDataNameField  	: (object) 네임이 보여질 객체
* objInDataset  	    : (object) 집접 삽입하게될 데이터셋
* strInDataColumn  	 : (string) 직접삽입하게될 데이터셋 컬럼
* strInDataColumnCode   : (string) 직접삽입하게될 code 데이터셋 컬럼
* strOnCheckRowCallBack : (string) 온체크 콜백 함수명
* inSingleQ 			: (bool) '' 추가 여부 디폴트는 false
*/
//function gfnShowMultiComboColumnCode(objScreen , objDataset , objDataNameField , objInDataset , strInDataColumn , strInDataColumnCode, strOnCheckRowCallBack, inSingleQ)
//{
//	var iHeight = 23 + (objDataset.getrowcount() * 20 );
//	
//	if(iHeight > GFN_MULTI_HEIGHT){
//		iHeight = GFN_MULTI_HEIGHT;
//	}
//	
//	var nLPos = objDataNameField.getwindowleft();
//	var nTPos = objDataNameField.getwindowtop() + objDataNameField.getheight();
//	var nRPos = objDataNameField.getwidth() + 16
//	var nBPos = iHeight ;
//
//	if(!factory.loadmenu("MultiSelectComboColumn", "/FRAME/MultiSelectComboColumnResP", nLPos, nTPos, nRPos, nBPos, objScreen)) {
//		return false;
//	}
//	
//	if(isNull(inSingleQ))
//		inSingleQ = false;
//	
//	// 로드된 메뉴를 찾아서 메뉴화면안에 있는 텍스트 오브젝트에 현재 날짜 필드 이름을 복사해둔다.
//	var objMultiSelectComboScreen = factory.findmenu("MultiSelectComboColumn");
//	if(!factory.isobject(objMultiSelectComboScreen)){
//		return false;
//	}
//
//	var objMultiSelectComboScreenScreenMember = objMultiSelectComboScreen.getmembers(XFD_JAVASCRIPT);	
//	objMultiSelectComboScreenScreenMember.strObjNameFieldName = objDataNameField.getname();	//팝업창에 부모객체 저장 (보여주는명칭)
//	objMultiSelectComboScreenScreenMember.objInDataset = objInDataset;					//팝업창에 부모객체 저장(적용될 부모데이터셋)
//	objMultiSelectComboScreenScreenMember.strInDataColumn = strInDataColumn;				//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiSelectComboScreenScreenMember.strInDataColumnCode = strInDataColumnCode;				//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiSelectComboScreenScreenMember.iMultiWidth = nRPos;					//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiSelectComboScreenScreenMember.strReciveCode = objInDataset.getdatabyname(objInDataset.getpos() , strInDataColumnCode);	// 현재 값들
//	objMultiSelectComboScreenScreenMember.strOnCheckRowCallBack = strOnCheckRowCallBack;	// 체크시 호출 함수명
//	objMultiSelectComboScreenScreenMember.inSingleQ = inSingleQ					//추가시 '' 추가여부
//
//		
//	var objTargetDs = objMultiSelectComboScreen.getxdataset("dsMultiCombo");
//
//	if(!isNullObj(objTargetDs)){
//		gfnCopyDataSet(objDataset , objTargetDs);
//	}
//	
//	objMultiSelectComboScreenScreenMember.fnSetData();
//}




/*
* 멀티 데이터를 세팅하는 함수
* objScreen  		   : (object) 스크린 객체
* objDataset    		: (object) 팝업에서 보여줄 코드 데이터셋
* objDataNameField  	: (object) 네임이 보여질 객체
* objInDataset  	    : (object) 집접 삽입하게될 데이터셋
* strInDataColumn  	 : (string) 직접삽입하게될 데이터셋 컬럼
* strOnDelRowCallBack : (string) 온체크 콜백 함수명
*/
//function gfnShowMultiDataHandle(objScreen , objDataset , objDataNameField , objInDataset , strInDataColumn , strOnDelRowCallBack)
//{
//	var iHeight = 23 + (objDataset.getrowcount() * 20 );
//	
//	if(iHeight > GFN_MULTI_HEIGHT){
//		iHeight = GFN_MULTI_HEIGHT;
//	}
//	
//	var nLPos = objDataNameField.getwindowleft();
//	var nTPos = objDataNameField.getwindowtop() + objDataNameField.getheight();
//	var nRPos = objDataNameField.getwidth() + 16
//	var nBPos = iHeight ;
//
//	if(!factory.loadmenu("MultiDataHandle", "/FRAME/MultiDataHandleP", nLPos, nTPos, nRPos, nBPos, objScreen)) {
//		return false;
//	}
//	
//	// 로드된 메뉴를 찾아서 메뉴화면안에 있는 텍스트 오브젝트에 현재 날짜 필드 이름을 복사해둔다.
//	var objMultiDataHandleScreen = factory.findmenu("MultiDataHandle");
//	if(!factory.isobject(objMultiDataHandleScreen)){
//		return false;
//	}
//
//	var objMultiDataHandleScreenMember = objMultiDataHandleScreen.getmembers(XFD_JAVASCRIPT);	
//	objMultiDataHandleScreenMember.objDataset = objDataset;
//	objMultiDataHandleScreenMember.strObjNameFieldName = objDataNameField.getname();	//팝업창에 부모객체 저장 (보여주는명칭)
//	objMultiDataHandleScreenMember.objInDataset = objInDataset;					//팝업창에 부모객체 저장(적용될 부모데이터셋)
//	objMultiDataHandleScreenMember.strInDataColumn = strInDataColumn;				//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiDataHandleScreenMember.iMultiWidth = nRPos;					//팝업창에 부모객체 저장 (	적용될 부모데이터셋 컬럼)
//	objMultiDataHandleScreenMember.strReciveCode = objInDataset.getdatabyname(objInDataset.getpos() , strInDataColumn);	// 현재 값들
//	objMultiDataHandleScreenMember.strOnDelRowCallBack = strOnDelRowCallBack;	// 체크시 호출 함수명
//
//		
//	var objTargetDs = objMultiDataHandleScreen.getxdataset("dsMultiCombo");
//
//	if(!isNullObj(objTargetDs)){
//		gfnCopyDataSet(objDataset , objTargetDs);
//	}
//	
//	objMultiDataHandleScreenMember.fnSetData();
//}


/*
* 테이터셋에서 해당 컬럼의 값의 동일 갯수를 반환합니다
* objDataset   : (object) 데이터셋 객체
* strColumn    : (string) 컬럼명
* strCatchWord : (string) 비교할 값
*/
function gfnGetCaseCount(objDataset , strColumn , strCatchWord){
	var iCatchCnt = 0;
	for(var i=0;i<objDataset.getrowcount();i++){
		var strGetData = objDataset.getdatabyname(i , strColumn);
		
		if(strGetData.length == strCatchWord.length && strGetData.indexOf(strCatchWord) == 0){
			iCatchCnt++;
		}
	}
	
	return iCatchCnt;
}


/*
* 테이터셋에서 해당 컬럼의 값이 동일한 문자를 포함하고 있는 갯수를 반환합니다
* objDataset   : (object) 데이터셋 객체
* strColumn    : (string) 컬럼명
* strCatchWord : (string) 비교할 값
*/
function gfnGetCaseLikeCount(){
	var iCatchCnt = 0;
	for(var i=0;i<objDataset.getrowcount();i++){
		var strGetData = objDataset.getdatabyname(i , strColumn);
		
		if(strGetData.indexOf(strCatchWord) > -1){
			iCatchCnt++;
		}
	}
	
	return iCatchCnt;
}



/*
* 나를 호출한 탭 객체를 반환합니다
* objScreen   : (object) 스크린 객체
*/
function gfnGetParentTabObj(objScreen){
	if(!isScreen(objScreen)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnGetParentTabObj 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetParentTabObj 개발자 오류] screen 객체를 넘겨주세요");
		return null;
	} 
	
	var parentObj = objScreen.getparent();
	var iType = parentObj.getobjectkind();
	
	var aryObj = parentObj.getinstanceall(0);

	for(var i=0;i<aryObj.length;i++){
		var instObj = aryObj[i];
		if(isNullObj(instObj)){
			continue;
		}

		if(instObj.getcontrolkind() == XFD_CTRLKIND_TAB){	//탭일경우		
			for(var j=0;j<instObj.gettabitemcount();j++){			
				var objTabScreenFrame = instObj.getchildscreeninstance(j);
			
				if(isScreen(objTabScreenFrame)){
					if(objTabScreenFrame == objScreen){
						return instObj;
					}
				}else{
					var aryTabCtrlObjs = gfnGetTabChildCtrlIdAry(instObj , j);
				
					for(var k=0;k<aryTabCtrlObjs.length;k++){
						var instTabObj = instObj.getchildinstance(j , aryTabCtrlObjs[k]);
				
						if(isNullObj(instTabObj)){
							continue;
						}	
						
						if(instTabObj.getcontrolkind() == XFD_CTRLKIND_TAB){	//탭일경우
							return gfnGetParentTabObjInTab(instTabObj , objScreen );	//하위탭에서 검색
						}
					}
				}								
			}	
		}				
	}
	
	return null;
}


/*
* 나를 호출한 탭 객체를 반환합니다 
* instObj     : (object) 탭이 있는 객체
* objMyScreen : (object) 스크린 객체
*/
function gfnGetParentTabObjInTab(instObj , objMyScreen ){
	if(!isScreen(objMyScreen || !isNullObj(instObj))){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnGetParentTabObjInTab 개발자 오류] screen 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetParentTabObjInTab 개발자 오류] screen 객체를 넘겨주세요");
		return null;
	} 
	
	if(instObj.getcontrolkind() == XFD_CTRLKIND_TAB){	//탭일경우		
		for(var j=0;j<instObj.gettabitemcount();j++){			
			var objTabScreenFrame = instObj.getchildscreeninstance(j);
		
			if(isScreen(objTabScreenFrame)){
				if(objTabScreenFrame == objMyScreen){
					return instObj;
				}
			}else{
				var aryTabCtrlObjs = gfnGetTabChildCtrlIdAry(instObj , j);
			
				for(var k=0;k<aryTabCtrlObjs.length;k++){
					var instTabObj = instObj.getchildinstance(j , aryTabCtrlObjs[k]);
			
					if(isNullObj(instTabObj)){
						continue;
					}	
					
					if(instTabObj.getcontrolkind() == XFD_CTRLKIND_TAB){	//탭일경우
						return gfnGetParentTabObjInTab(instTabObj , objMyScreen );	//하위탭에서 검색
					}
				}
			}								
		}	
	}
	return null;
}


/*
* 정규형 리플레이스
* strSrc  : (string) 소스문자
* strFrom : (string) 바꿀문자
* strTo   : (string) 바뀔문자
*/
function gfnReplaceStr(strSrc, strFrom, strTo){
	var regularexpression = new RegExp(strFrom, "g");
	strSrc = strSrc.replace(regularexpression, strTo);
	return strSrc;
}





/*
	필수,일반,비활성화 스타일 적용 스크립트
	objControl : 스타일 적용 대상 객체
	objStyleType : 필수 : Required(R)    일반 : General(G)     비활성 : disable(D)
	objActiveType :필수 : Required(R)    일반 : General(G)     비활성 : disable(D)
	
*/
function gfnSetEditorStyle(objControl, strStyleType, strActiveType)
{

	if(factory.isobject(objControl))
	{
		if(!isNull(strStyleType))
		{
			switch(strStyleType)
			{
				case "R" :
					objControl.setinputtype(1);
					objControl.setforecolor(0,0,0);
					objControl.setbackcolor(210,231,250);
					objControl.setbordercolor(factory.rgb(89,103,163));
					//objControl.registerevent("on_focusin", "UT.gfnSetFocusInBorderColorTypeR(objInst);");
					//objControl.registerevent("on_focusout", "UT.gfnSetFocusOutBorderColorTypeR(objInst);");
					break;
				case "G" :
					objControl.setinputtype(0);
					objControl.setforecolor(51,51,51);
					objControl.setbackcolor(255,255,255);
					objControl.setbordercolor(factory.rgb(180,180,180));
					//objControl.registerevent("on_focusin", "UT.gfnSetFocusInBorderColorTypeG(objInst);");
					//objControl.registerevent("on_focusout", "UT.gfnSetFocusOutBorderColorTypeG(objInst);");
					
					break;
				case "D" :
					objControl.setinputtype(2);
					objControl.setforecolor(70,70,70);
					objControl.setbackcolor(253,253,253);
					objControl.setbordercolor(factory.rgb(221,221,221));
					//objControl.registerevent("on_focusin", "UT.gfnSetFocusInBorderColorTypeD(objInst);");
					//objControl.registerevent("on_focusout", "UT.gfnSetFocusOutBorderColorTypeD(objInst);");
					break;
			}
		}
		
		if(!isNull(strActiveType))
		{
			if(strActiveType == "R")
			{
				objControl.setinputtype(1);
			}
			else if(strActiveType == "G")
			{
				objControl.setinputtype(0);
			}
			else if(strActiveType == "D")
			{
				objControl.setinputtype(2);
			}
		}
	}
}
/*
* obj 에 focus in 이벤트 발생하는 경우 border 색상 변경
*/
function gfnSetFocusInBorderColorTypeR(objInst)
{	
	objInst.setbordercolor(factory.rgb(0,0,123));
}

function gfnSetFocusInBorderColorTypeG(objInst)
{	
	objInst.setbordercolor(factory.rgb(150,150,150));
}

function gfnSetFocusInBorderColorTypeD(objInst)
{	
	objInst.setbordercolor(factory.rgb(225,225,225));
}
/*
* obj 에 focus out 이벤트 발생하는 경우 border 색상 변경
*/
function gfnSetFocusOutBorderColorTypeR(objInst)
{	
	objInst.setbordercolor(factory.rgb(89,103,163));
}

function gfnSetFocusOutBorderColorTypeG(objInst)
{	
	objInst.setbordercolor(factory.rgb(180,180,180));
}

function gfnSetFocusOutBorderColorTypeD(objInst)
{	
	objInst.setbordercolor(factory.rgb(221,221,221));
}





/*
* 해당 오브젝트에서 멤버객체의 해당 함수를 호출합니다 
* obj    : (object) 해당 객체
* strFunction : (string) 해당 변수
* aryHash	:	(array) 해쉬형 배열
*/
function gfnCallFunctionMember(obj , strFunction , aryHash){
	if(gfnIsMemberObj(obj ,  strFunction)){	//탭의 조회 호출
		var objMember = gfnGetMemberScript(obj);
		eval("objMember." + strFunction)(aryHash);
	}
}


/*
* 해당 스크린이나 탭에서 해당 변수 값을 반환합니다
* obj    : (object) 해당 객체
* strVar : (string) 해당 변수
*/
function gfnGetVariableByMember(obj , strVar){
	if(gfnIsMemberObj(obj , strVar)){
		var objMember = gfnGetMemberScript(obj);
		return eval("objMember." + strVar);		
	}else{
		return null;
	}
}


/*
* 내부모에서 해당 변수 값을 반환합니다
* objScreen  : (object) 스크린 객체
* strVar 	: (string) 해당 변수
*/
function gfnGetParentVaribleByMember(objScreen , strVar){
	var objParentScreen = objScreen.getparent();

	if(!isScreen(objParentScreen) ){
		if( objParentScreen.getcontrolkind() ==  XFD_CTRLKIND_TAB){	//스크린이 아니면
			var objTabScreen = objParentScreen.getchildscreeninstance(0);
			return gfnGetVariableByMember(objTabScreen , strVar);
		}
	}else{
		return gfnGetVariableByMember(objParentScreen , strVar);
	}
}


/*
* 내부모에서 해당 변수 값을 세팅합니다
* objScreen  : (object) 스크린 객체
* strVar 	: (string) 해당 변수
* strValue   : (string) 값
*/
function gfnSetParentVaribleByMember(objScreen , strVar , strValue){
	var objParentScreen = objScreen.getparent();
	if(gfnIsMemberObj(objParentScreen , strVar)){
		var objMember = gfnGetMemberScript(objParentScreen);
		eval("objMember." + strVar + " = '" + strValue +"'");
	}
}


/*
* 해당 오브젝트에서 멤버 객체의 여부 반환
* obj  : (object) 해당 객체
*/
function gfnGetMemberScript(obj){
	var objReturn = null;
	
	if(!isNullObj(obj)){
		if(isScreen(obj)){
			objReturn = obj.getmembers(XFD_JAVASCRIPT);
			
		}else if(XFD_OBJKIND_CONTROL && obj.getcontrolkind() ==  XFD_CTRLKIND_TAB){
			for(var i=0;i<obj.gettabitemcount();i++){			
				var objTabScreenFrame = obj.getchildscreeninstance(i);
				
				if(isScreen(objTabScreenFrame)){					
					objReturn = objTabScreenFrame.getmembers(XFD_JAVASCRIPT);					
					break;						
				}
			}		
		}
	}
	
	return objReturn;
}



/*
* 해당 오브젝트에서 멤버 객체의 해당 함수 및 변수 존재 여부 반환
* obj    : (object) 스타일 적용 대상 객체
* strObj : (string) 해함수명 및 변수
*/
function gfnIsMemberObj(obj ,  strObj){
	var objReturn = null;
	
	if(!isNullObj(obj)){
		if(isScreen(obj)){
			objReturn = obj.findscriptmethod(XFD_JAVASCRIPT , strObj);
			
			if(!objReturn){	//없을경우 변수일수도 있다
				var objMember = gfnGetMemberScript(obj);
				var objValue = eval("objMember." + strObj);
				
				if(!isNull(objValue)){
					objReturn = true;
				}else{
					objReturn = false; 
				}
				
				if(!objReturn){
					if(gfnGetAryHashCount(objValue) != 0){
						objReturn = true;
					}else{
						objReturn = false;
					}
				}
			}
		}else if(XFD_OBJKIND_CONTROL && obj.getcontrolkind() ==  XFD_CTRLKIND_TAB){
			for(var i=0;i<obj.gettabitemcount();i++){			
				var objTabScreenFrame = obj.getchildscreeninstance(i);
				
				if(isScreen(objTabScreenFrame)){					
					objReturn = objTabScreenFrame.findscriptmethod(XFD_JAVASCRIPT , strObj);
					
					if(!objReturn){	//없을경우 변수일수도 있다
						var objMember = gfnGetMemberScript(obj);
						var objValue = eval("objMember." + strObj);
						
						if(!isNull(objValue)){
							objReturn = true;
						}else{
							objReturn = false; 
						}
					}
					
					break;						
				}
			}		
		}
	}
	
	return objReturn;
}


/*
* 파일 설정 공통파일  (조회후 자동 세팅 부모의 해당 파일 데이터셋 객체)
* objTabFile     : (object) 파일 링크된 탭 객체
* objParentOrgDs : (object) 부모의 파일 데이터셋 객체
* strObjId 	  : (string) 오브젝트 아이디
* strObjCl   	: (string) 오브젝트 구분 
* strFilObjVerId : (string) 오브젝트 버젼 아이디
* strMode 	   : (string) W , R 모드값
* iMaxCnt 	   : (int) 최대 갯수
* iMaxByte 	  : (int) 최대 용량
*/
//function gfnFileTabSetProcessor(objTabFile , objParentOrgDs , strObjId , strObjCl , strFilObjVerId , strMode , iMaxCnt , iMaxByte){
//	var objMember = gfnGetMemberScript(objTabFile);
//
//	if(gfnIsMemberObj(objTabFile , "fnSetFileProcessor")){	
//		objMember.fnSetFileProcessor(objParentOrgDs , strObjId , strObjCl , strFilObjVerId ,strMode , iMaxCnt , iMaxByte);
//	}
//}


/*
* 파일공통 물리 저장함수 (자동 세팅 부모의 해당 파일 데이터셋 객체)
* objTabFile     : (object) 파일 링크된 탭 객체
* [return] => (boolean)
*/
//function gfnFileTabSaveProcessor(objTabFile){
//	var objMember = gfnGetMemberScript(objTabFile);
//
//	if(gfnIsMemberObj(objTabFile , "fnFileSave")){	
//		return objMember.fnFileSave();
//	}	
//}

/*
* 파일공통 테이터셋의 파일 갯수를 반환합니다
* objTabFile     : (object) 파일 링크된 탭 객체
*/
//function gfnFileTabGetCount(objTabFile){
//	var iCnt = 0;
//	var objMember = gfnGetMemberScript(objTabFile);
//
//	if(gfnIsMemberObj(objTabFile , "fnGetFilecount")){	
//		iCnt =  objMember.fnGetFilecount();
//	}
//	
//	return iCnt;	
//}




/*
* 이미지 파일 설정 공통파일  (조회후 자동 세팅 부모의 해당 파일 데이터셋 객체)
* objTabFile     : (object) 파일 링크된 탭 객체
* objParentOrgDs : (object) 부모의 파일 데이터셋 객체
* strObjId 	  : (string) 오브젝트 아이디
* strObjCl   	: (string) 오브젝트 구분 
* strFilObjVerId : (string) 오브젝트 버젼 아이디
* strMode 	   : (string) W , R 모드값
*/
//function gfnImgFileTabSetProcessor(objTabImage , objParentOrgDs , strObjId , strObjCl , strFilObjVerId , strMode , iMaxCnt , iMaxByte){
//	var objMember = gfnGetMemberScript(objTabImage);
//
//	if(gfnIsMemberObj(objTabImage , "fnSetImageFileProcessor")){	
//		objMember.fnSetImageFileProcessor(objParentOrgDs , strObjId , strObjCl , strFilObjVerId , strMode , iMaxCnt , iMaxByte);
//	}
//}



/*
* 이미지파일공통 물리 저장함수 (자동 세팅 부모의 해당 파일 데이터셋 객체)
* objTabFile     : (object) 파일 링크된 탭 객체
*/
//function gfnImgFileTabSaveProcessor(objTabImage){
//	var objMember = gfnGetMemberScript(objTabImage);
//
//	if(gfnIsMemberObj(objTabImage , "fnImageFileSave")){	
//		objMember.fnImageFileSave();
//	}	
//}




/*
* 데이터셋 업데이트 유무 반환
* objDs : (object) 데이터셋 객체
* [return] => (boolean) 
*/
function gfnIsDatasetUpdate(objDs){
	var blUpdate =  false;
	for(var i=0;i<objDs.getrowcount();i++){
		if(objDs.getrowoperation(i) != XFD_ROWOP_NONE){
			blUpdate = true;
			break;
		}
	}
	
	if(!blUpdate && objDs.getdeletedrowcount() > 0){
		blUpdate = true;
	}
	
	return blUpdate;		
}


/*
* 콤보 키 필터 처리  (조건 : 숨길컬럼이 코드컬럼과 같아야 한다)	(gfnComboOutFocus 같이사용)
* objInst : (object) 콤보 객체
* keycode : (char) 키값
*/
function gfnCombokeyfilter(objInst , keycode){	
	if(keycode == 340 || keycode == 338){
		return;
	}	
	
	if(keycode == 13){
		if(!objInst.isshowselectbox()){
			objInst.showselectbox(true);
		}
	}else if(keycode == 9){			//탭일경우 탭이동시킴
		return false;
	}else{
		var objDs = objInst.getlinkxdataset();
		var strCboText = objInst.gettext();

		for(var i=0;i<objInst.getcount();i++){
			objInst.setitemhidden(i , false);
		}
		
		if(!isNull(strCboText)){
			for(var i=0;i<objInst.getcount();i++){
				var strItemText = objInst.getitemtext(i);			
				var strSplit = strItemText.split(":");
				
				if(strSplit[strSplit.length-1].indexOf(strCboText) != 0){
					objInst.setitemhidden(i , true);				
				}				
			}				
		}		

		objInst.showselectbox(true);
	}
}


/*
* 콤보 포커스 아웃시 체크
* objInst : (object) 콤보 객체
*/
function gfnComboOutFocus(objInst){
	var objDs = objInst.getlinkxdataset();
	var strCboText = objInst.getitemtext(objInst.getselectedindex());

	//var strCboText = objInst.gettext();

	for(var i=0;i<objInst.getcount();i++){
		objInst.setitemhidden(i , false);
	}
	
	if(!isNull(strCboText)){
		var blClear = true;
		
		for(var i=0;i<objInst.getcount();i++){
			var strItemText = objInst.getitemtext(i);			
			var strSplit = strItemText.split(":");
			
			//if(strSplit[strSplit.length-1] == strCboText){
			var strCboSplit = strCboText.split(":");
			if(strSplit[strSplit.length-1] == strCboSplit[strCboSplit.length-1]){

				blClear = false;
				break;				
			}				
		}
		
		if(blClear){			
			objInst.setselectedindex(-1);			
		}						
	}	
}



/*
* 데이터셋의 해당줄을 배열로
* objDs : (object) 데이터셋 객체
* iRow  : (int) 데이터 줄
* [return] => (array) (hash) 
*/
function gfnDsRowToAry(objDs , iRow){
	var aryHash = [];
	
	if(!isNullObj(objDs)){
		for(var i=0;i<objDs.getcolumncount();i++){
			var strColumn = objDs.getcolumnid(i);
			aryHash[strColumn] = objDs.getdatabyname(iRow , strColumn);
		}	
	}	
	
	return aryHash;		
}


/*
* 데이터셋을 배열로
* objDs : (object) 데이터셋 객체
* [return] => (array) (hash) 
*/
function gfnDsToAry(objDs){
	var aryDs = [];
	
	if(!isNullObj(objDs)){
		for(var i=0;i<objDs.getrowcount();i++){
			var aryHash = [];
			
			for(var j=0;j<objDs.getcolumncount();j++){
				var strColumn = objDs.getcolumnid(j);
				
				aryHash[strColumn] = objDs.getdatabyname(i , strColumn);
			}
			
			aryDs[i] = aryHash;
		}
	}	
	
	return aryDs;		
}


/*
* 배열데이터셋을 데이터셋으로
* objDs : (object) 데이터셋 객체
* aryDs : (array) 배열 데이터셋
* blAppend : (boolean) 추가할것인지의 여부
*/
function gfnAryToDs(objDs , aryDs , blAppend){
	if(isNull(blAppend)){
		blAppend = false;
	}
	
	if(!blAppend){
		objDs.removeallrows();
	}
	
	if(!isNullObj(objDs) && !isNullObj(aryDs)){
		for(var i=0;i<aryDs.length;i++){
			var aryHash = aryDs[i];			
			var aryKeys = gfnGetSortHashKeys(aryHash);
			var iRow = objDs.getrowcount();

			objDs.insertrow(iRow);
			
			for(var j=0;j<aryKeys.length;j++){
				objDs.setdatabyname(iRow , aryKeys[j] , aryHash[aryKeys[j]]);
			}
		}
	}
}


/*
* 배열데이터 셋에서 해당 줄의 컬럼값을 반환합니다
* aryDs 	: (array) 배열 데이터셋
* iRow 	 : (int) 라인값
* strColumn : (string) 컬럼명
* [return] => (string) 
*/
function gfnGetAryData(aryDs , iRow , strColumn){
	var strReturn = "";
	
	if(!isNullObj(aryDs) && !isNull(iRow) && !isNull(strColumn)){
		var aryHash = aryDs[iRow];			
		strReturn = aryHash[strColumn];	
	}
	
	return strReturn;
}


/*
* replaceAll 구현
* strData    : (array) 배열 데이터셋
* strFind    : (int) 라인값
* strReplace : (string) 컬럼명
* [return] => (string) 
*/
function gfnReplaceAll(strData, strFind, strReplace){
	while(strData.indexOf(strFind) > -1){
		strData = strData.replace(strFind, strReplace);	
	}
	return strData;
}


/*
* 데이터셋의 마지막에 줄을 추가합니다
* dsObj 	: (object) 데이터셋
* [return] => (int) 
*/
function gfnDsAddRow(dsObj){
	var iRow = dsObj.getrowcount();
	dsObj.insertrow(iRow);
	return iRow;
}


/*
* 결재상태를 반환합니다
* strRdcsObjId    : (string) 결재 오브젝트 아이디   (RDCS_OBJ_ID) 
* strRdcsObjVerId : (string) 결재 오브젝트 버전 ID  (RDCS_OBJ_VER_ID)
* strRdcsRptsNo   : (string) 결재 상신번호
* [return] => string 
*/
//function gfnMainGetApprovalStat(strRdcsObjId , strRdcsObjVerId , strRdcsRptsNo){		
//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
//	var strReturnStat = "";
//	
//	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnMainGetApprovalStat")){ 
//		strReturnStat = objMainScreenMember.ufnMainGetApprovalStat(strRdcsObjId , strRdcsObjVerId , strRdcsRptsNo);
//	}
//	  
//	return strReturnStat;	
//}



/*
* 프로젝트의 해당 아이디가 해당룰을 가지고있는지의 여부를 반환합니다
* strLoginId	: (string) 로그인 아이디 
* strPrjId      : (string) 프로젝트 아이디
* strCrgrRoleCd : (string) 역활코드
* [return] => string 
*/
//function gfnMainGetIsPrjTeamRole(strLgiId , strPrjId , strCrgrRoleCd){		
//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
//	var blIsRole = false;
//	
//	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnIsTeamRole")){ 
//		blIsRole = objMainScreenMember.ufnIsTeamRole(strLgiId , strPrjId , strCrgrRoleCd);
//	}
//	  
//	return blIsRole;	
//}



///*
//* 코드명을 반환합니다
//* strCode    : (string) 코드아이디
//* [return] => (string) 
//*/
//function gfnGetCodeName(strCode){
//	return gfnLookUp(gdsSystemCode , "COM_CD_ID" ,  strCode , "COM_CD_ID_NM");
//}



/*
* 메뉴화면을 엽니다 (화면URL 기준으로)
* strMenuURL     : (string) 메뉴URL
* objExt	     : (object) 화면으로 전달할 파라미터
*/
function gfnOpenMenuByURL(strMenuURL, objExt){
	
	var strScreenUrl = strMenuURL;
	var strMenuId = gfnLookUp(gdsAuthMenu , "MENU_PATH" , strMenuURL , "MENU_ID");
	var strMenuNm = gfnLookUp(gdsAuthMenu , "MENU_PATH" , strMenuURL , "MENU_NM");
	
	var iRow = gfnFindRow(gdsAuthMenu , "MENU_ID" , strMenuId);
	if(iRow == -1){
		alert(SYSVar.WINMAIN_SCREEN , "" , "해당 메뉴에 대한 권한이 없거나 잘못된 메뉴 아이디 입니다.");
		return;	
	}	
	
	var tabItemCount = SYSVar.MIDDLE_TAB.gettabitemcount();
	if (tabItemCount >= SYSVar.MAX_SCREEN_OPEN_COUNT) {
		alert(SYSVar.WINMAIN_SCREEN , "MSG495" , "허용 가능한 최대 갯수에 도달하였습니다.");
        return;
	}
	
	//화면 leftmenu index 찾기
	var iIndex = SYSVar.LEFTMAIN_MEMBER.fnFindtreMenuIndex(strMenuId);
	var objTopScreen = SYSVar.TOPMAIN_SCREEN;		
	var objTopbtn = objTopScreen.getinstancebyname("btnMain" + iIndex);
	SYSVar.TOPMAIN_MEMBER.btnMain_on_mouseup(objTopbtn);
	
	var objTreeScreen = SYSVar.LEFTMAIN_SCREEN;		
	var objViewTree = objTreeScreen.getinstancebyname("treMenu_" + iIndex);
	objViewTree.selectitemex(strMenuId);
		
	SYSVar.MODULE_MEMBER.loadScreenByPathMenuId(screen, strScreenUrl , strMenuId , strMenuNm, iIndex, objExt);
}



/*
* 해당 콤보에 필터 이벤트를 적용시켜 줍니다   on_keydown on_focusout 사용
* aryObj    : (array) 적용시킬 콤보 오브젝트
*/
function gfnComboFilterSet(objScreen , aryObj){
	for(var i=0;i<aryObj.length;i++){
		var objControl = aryObj[i];
		var aryDsInfo = objControl.getpicklistlinkxdataset();
		var objComboDs = objScreen.getxdataset(aryDsInfo[0]); 
		
		if(isNullObj(objComboDs)){
			//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnComboFilterSet 개발자 오류] 콤보에 데이터셋을 확인부탁합니다");
			alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnComboFilterSet 개발자 오류] 콤보에 데이터셋을 확인부탁합니다");
			return;
		}
		
		if(objComboDs.getcolumn("HIDDEN_YN") < 0){
			objComboDs.addcolumn("HIDDEN_YN" , "" , 255);
		}
		
		objControl.setpicklistlinkxdataset(aryDsInfo[0] , aryDsInfo[1] , aryDsInfo[2] , "HIDDEN_YN");
		
		objControl.registerevent("on_keydown", "UT.gfnCombokeyfilter(objInst , keycode);");
		objControl.registerevent("on_focusout", "UT.gfnComboOutFocus(objInst);");
	}
}


/*
* 해당 스크린의 해당 권한여부를 반환합니다
* objScreen     : (object) 스크린 객체
* strAuth 	  : (string) 권한 "R":조회 , "W":추가(등록) , "M":수정 , "D":삭제 , "S":저장 , "E":기타
* [return] => (boolean) 
*/
function gfnIsAuth(objScreen , strAuth){
	return INI.gfnIsAuth(objScreen , strAuth);
}


/*
* 팝업의 부모 스크린의 해당 권한여부를 반환합니다
* objScreen     : (object) 스크린 객체
* strAuth 	  : (string) 권한 "R":조회 , "W":추가(등록) , "M":수정 , "D":삭제 , "S":저장 , "E":기타
* [return] => (boolean) 
*/
function gfnPopParentIsAuth(objScreen , strAuth){
	var objParentScreen = objScreen.getparent();
	if(!isScreen(objParentScreen)){
		return;
	}

	return gfnIsAuth(objParentScreen , strAuth);	
}



/*
* 파일 다이얼 로그를 뛰웁니다
* objScreen      : (object) 스크린 객체
* strFilObjId    : (object) 파일오브젝트ID 
* strFilObjCl    : (string) 파일오브젝트분류값 
* strFilObjVerId : (string) 파일버전오브젝트ID  
*/
//function gfnFileDialogPop(objScreen , strFilObjId , strFilObjCl , strFilObjVerId){
//	if(!isScreen(objScreen)){	
//		alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnFileDialogPop 개발자 오류] screen 객체를 넘겨주세요");
//		return;
//	}
//	
//	var objPopup = factory.findpopup("AttachDialogPopup");	
//	if(!factory.isobject(objPopup)){
//		factory.loadpopup("AttachDialogPopup", "/FRAME/AttachFileP", "AttachDialogPopup" , true , 5 , 0 , 0 , true , false , objScreen);
//	}
//	
//	objPopup = factory.findpopup("AttachDialogPopup");	
//
//	if(gfnIsMemberObj(objPopup ,  "fnFileProcessor")){
//		var objMember = gfnGetMemberScript(objPopup);	
//
//		objMember.fnFileProcessor(strFilObjId , strFilObjCl , strFilObjVerId);
//	}
//}	

/*
* 파일 다이얼 로그를 뛰웁니다
* objScreen      : (object) 스크린 객체
* strFilIdList    : (object) 파일ID 목록
* strFilObjCl    : (string) 파일오브젝트분류값 
* strFilObjVerId : (string) 파일버전오브젝트ID  
*/
//function gfnFileDialogPopByFileIdList(objScreen , strFilIdList){
//	if(!isScreen(objScreen)){	
//		alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnFileDialogPop 개발자 오류] screen 객체를 넘겨주세요");
//		return;
//	}
//	
//	var objPopup = factory.findpopup("AttachDialogPopup");	
//	if(!factory.isobject(objPopup)){
//		factory.loadpopup("AttachDialogPopup", "/FRAME/AttachFileP", "AttachDialogPopup" , true , 5 , 0 , 0 , true , false , objScreen);
//	}
//	
//	objPopup = factory.findpopup("AttachDialogPopup");	
//
//	if(gfnIsMemberObj(objPopup ,  "fnFileProcessorByFileIdList")){
//		var objMember = gfnGetMemberScript(objPopup);	
//
//		objMember.fnFileProcessorByFileIdList(strFilIdList);
//	}
//}


/*
* 테이터셋에서 해당 컬럼의 값을 비교해서 또는 전체를 콤마형식으로 연결해서 반환합니다 ( ' 없이도 가능)
* objDs      	  : (object) 데이터셋 객체
* strColumn    	: (object) 가져올 컬럼
* strCompareColumn : (string) 비교할 컬럼 null 시 가져올 컬럼
* strCompareValue  : (string) 비교값  null 시 전체값
* blSqlType 	   : (string) 쿼리에서 사용하는 타입이냐   null 쿼리용  false = ' 빼고
* [return] => (string) 
*/
function gfnMultiToInSql(objDs , strColumn , strCompareColumn , strCompareValue , blSqlType){
	var strReturn = "";
	var iCnt = 0;
	
	if(isNullObj(objDs)){
		return;
	}
	
	if(isNull(blSqlType)){
		blSqlType = true;
	}
	
	if(isNull(strCompareColumn)){
		strCompareColumn = strColumn;
	}
	
	if(isNull(strColumn) || isNull(strCompareColumn)){
		return;
	}
	
	for(var i=0;i<objDs.getrowcount();i++){		
		var strTargetValue = objDs.getdatabyname(i , strColumn);
		var strValue = objDs.getdatabyname(i , strCompareColumn);
		
		var strCheckValue = strCompareValue;
		if(isNull(strCheckValue)){
			strCheckValue = strValue;
		}
		
		if(!isNull(strTargetValue) && strValue == strCheckValue){
			if(iCnt != 0){
				strReturn += ",";
			}
			
			if(blSqlType){
				strReturn += "'" + strTargetValue + "'";
			}else{
				strReturn += strTargetValue;
			}
			
			iCnt++;
		}
	}
	
	return strReturn;
}


/*
* 해당 키값이 기능키들이 아닌 실제 입력키일경우 true  아닐경우 false
* keycode   : (int) 데이터셋 객체
* [return] => (boolean) 
*/
function gfnOnKeyDownIsRealKey(keycode){
	if( (keycode >= 35 && keycode <= 57) // ,-./
			|| (keycode >= 64 && keycode <= 123) // A~Z
			|| (keycode >= 96 && keycode <= 109) || keycode == 8 ||  keycode == 346
			|| keycode == 229 //한글들
			|| keycode == 33 || keycode == 59 || keycode == 61 || keycode == 124 || keycode == 126 || keycode == 32
		)
	{
		return true;
	}else{
		return false;
	}
}


/*
* 해당 오브젝트 사용여부 처리
* aryObj     : (array)  객체 배열
* blEnable   : (boolean) 사용 : true  , 비사용 false
*/
function gfnArySetEnable(aryObj, blEnable){
	for (var i = 0; i < aryObj.length; i ++){	
		try{
			if (factory.isobject(aryObj[i]))
			{
				aryObj[i].setenable(blEnable);
			}
		}catch(e){}		
	}
}


/*
* 해당 오브젝트 사용여부 처리
* aryObj     : (array)  객체 배열
* blVisible  : (boolean) 보임 : true  , 안보임 false
*/
function gfnArySetVisible(aryObj, blVisible){
	for (var i = 0; i < aryObj.length; i ++){	
		try{
			if (factory.isobject(aryObj[i]))
			{
				aryObj[i].setvisible(blVisible);
			}
		}catch(e){}		
	}
}



/*
* 데이터셋의 해당 컬럼의 맥스값을 반환합니다
* objDs        : (object)  객체 배열
* strColumn    : (string) 컬럼명칭
* blNumberType : (boolean) 숫자타입여부	숫자 : true  , 문자 false
*/
function gfnDSGetMax(objDs , strColumn , blNumberType){
	if(isNullObj(objDs)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnDSGetMax 개발자 오류] 데이터셋 객체를 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnDSGetMax 개발자 오류] 데이터셋 객체를 넘겨주세요");
		return;
	}
	
	if(isNull(strColumn)){	
		//alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnDSGetMax 개발자 오류] 해당 컬럼을 넘겨주세요");
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnDSGetMax 개발자 오류] 해당 컬럼을 넘겨주세요");
		return;
	}
	
	if(isNull(blNumberType)){
		blNumberType = false;
	}
	
	var strMaxValue = "";
	var iMaxValue = -1;
	
	for(var i=0;i<objDs.getrowcount();i++){		
		if(blNumberType){
			var iGetValue = parseInt(objDs.getdatabyname(i , strColumn) , 10);
			if(iMaxValue < iGetValue){
				iMaxValue = iGetValue;
			}
		}else{
			var strGetValue = objDs.getdatabyname(i , strColumn);
			
			if(strMaxValue < strGetValue){
				strMaxValue = strGetValue;
			}
		}		
	}
	
	if(blNumberType){
		return iMaxValue;
	}else{
		return strMaxValue;
	}
}



/*
* 해당 코드성 데이터셋에 공통코드 정보를 반환합니다
* objTargetDs : (object) 데이터셋
* strGrpCode  : (string) Grp_Code (SMT_COMM_GRP.GRP_CODE)
* strActFlag  : (string) Active Flag (Y:사용인것만 or NULL, N :전체)  
*/
function gfnGetCommCodes(objTargetDs , strGrpCode, strActFlag){ 
	var sActFlag = "";
	if(isNullObj(objTargetDs)){	
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetCommCodes 개발자 오류] 데이터셋 객체를 넘겨주세요");
		return;
	}
	
	if(isNull(strGrpCode)){	
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetCommCodes 개발자 오류] GrpCode 값을 넘겨주세요");
		return;
	}
	
	if(isNull(strActFlag) || strActFlag == "Y"){
		sActFlag = "Y";
	} else {
		sActFlag = "N";
	}
	
	var objMainScreen = SYSVar.WINMAIN_SCREEN;
	var objMainScreenMember = SYSVar.WINMAIN_MEMBER;
	
	var aryDs;
	
	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnCommCodeLoad")){ 
		aryDs = objMainScreenMember.ufnCommCodeLoad(strGrpCode, sActFlag);
	}
	
	gfnAryToDs(objTargetDs , aryDs);
}

/*
* 해당 코드성 데이터셋에 SQL 실행결과 정보를 반환합니다(SQL 컬럼은 CODE, NAME 으로 구성)
* objTargetDs : (object) 데이터셋
* strSQLid    : (string) 실행 SQL 아이디
* strParam    : (string) 실행조건
*/
function gfnGetComboCodes(objTargetDs , strSQLid, strParam){ 
	if(isNullObj(objTargetDs)){	
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetComboCodes 개발자 오류] 데이터셋 객체를 넘겨주세요");
		return;
	}
	
	if(isNull(strSQLid)){	
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetComboCodes 개발자 오류] SQL id 값을 넘겨주세요");
		return;
	}

	var sStrParam = "";
	if (strParam) sStrParam = strParam;

	var objMainScreen = SYSVar.WINMAIN_SCREEN;
	var objMainScreenMember = SYSVar.WINMAIN_MEMBER;
	
	var aryDs;
	
	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnComboLoad")){ 
		aryDs = objMainScreenMember.ufnComboLoad(strSQLid, sStrParam);
	}
	
	gfnAryToDs(objTargetDs , aryDs);
}

/*
* 해당 코드성 데이터셋에 법인 정보를 반환합니다
* objTargetDs : (object) 데이터셋
*/
function gfnGetOuCodes(objTargetDs){ 
	if(isNullObj(objTargetDs)){	
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetOuCodes 개발자 오류] 데이터셋 객체를 넘겨주세요");
		return;
	}
	
	var objMainScreen = SYSVar.WINMAIN_SCREEN;
	var objMainScreenMember = SYSVar.WINMAIN_MEMBER;
	
	var aryDs;
	
	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnOuCodeLoad")){ 
		aryDs = objMainScreenMember.ufnOuCodeLoad();
	}
	
	gfnAryToDs(objTargetDs , aryDs);
}

/*
* 해당 코드성 데이터셋에 해당 Ou의 사업장 정보를 반환합니다
* objTargetDs : (object) 데이터셋
* strOuCode   : (string) Ou_Code
*/
function gfnGetSiteCodes(objTargetDs, strOuCode){ 
	if(isNullObj(objTargetDs)){	
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetSiteCodes 개발자 오류] 데이터셋 객체를 넘겨주세요");
		return;
	}
	
	var objMainScreen = SYSVar.WINMAIN_SCREEN;
	var objMainScreenMember = SYSVar.WINMAIN_MEMBER;
	
	var aryDs;
	
	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnSiteCodeLoad")){ 
		aryDs = objMainScreenMember.ufnSiteCodeLoad(strOuCode);
	}
	
	gfnAryToDs(objTargetDs , aryDs);
}

/*
* 해당 코드성 데이터셋에 해당 사용자의 사업장 정보를 반환합니다
* objTargetDs : (object) 데이터셋
* strOuCode   : (string) Ou_Code
* strUserID   : (string) User_ID
*/
function gfnGetUserSiteCodes(objTargetDs, strOuCode, strUserID){ 
	if(isNullObj(objTargetDs)){	
		alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetSiteCodes 개발자 오류] 데이터셋 객체를 넘겨주세요");
		return;
	}
	
	var objMainScreen = SYSVar.WINMAIN_SCREEN;
	var objMainScreenMember = SYSVar.WINMAIN_MEMBER;
	
	var aryDs;
	
	if(isNull(strOuCode)){
		strOuCode = INI.GV_OU_CODE;
	}
	
	if(isNull(strUserID)){
		strUserID = INI.GV_USER_ID;
	}
	
	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnSiteUserCodeLoad")){ 
		aryDs = objMainScreenMember.ufnSiteUserCodeLoad(strOuCode, strUserID);
	}
	
	gfnAryToDs(objTargetDs , aryDs);
}

/*
* 권한이 적용된 프로젝트 목록 콤보박스(2013-05-06 PTW)
* objTabPrjCombo : 탭 ID
* objParentSetDs : 부모창의 검색 데이터셋
* strParentDsColumnName : 부모창의 검색 데이터셋 컬럼 ID
* bEndPrjChk : 종료프로젝트 선택 컨트롤 활성화 여부
* strOnchangeFunctionName : Onchange Event 함수명
* strAuthAll : 모든 프로젝트 보기(true or false)
* strAuthOrg : 내부서 및 하위 부서 프로젝트 보기(내 부서의 부서원이 투입된 프로젝트도 권한 부여)(true or false)
* strAuthPrj : PM으로 설정된 프로젝트 목록 보기 권한(true or false)
* strAuthTeam : 팀원으로 배정된 프로젝트 목록 보기 권한(true or false)
* strPrjStdCdList : 프로젝트 상태(계획,진행...)ex) "'PRJ_ST_02','PRJ_ST_03'"
* strRoleList : 특정 Role에 배정되었는 프로젝트 목록만 출력하는 경우
* bRequired : 필수 디자인 여부
* strParentStCdDsColumnName : 부모창의 프로젝트 상태 코드 목록 데이터셋 컬럼 ID

*/
//function gfnPrjComboListTabSetProcessor(objTabPrjCombo, objParentSetDs, strParentDsColumnName,bEndPrjChk, strOnchangeFunctionName , bAuthAll , bAuthOrg , bAuthPrj , bAuthTeam , strPrjStdCdList, strRoleList, bRequired, strParentStCdDsColumnName)
//{
//	var objMember = gfnGetMemberScript(objTabPrjCombo);
//
//	if(gfnIsMemberObj(objTabPrjCombo , "fnSetPrjListProcessor")){	
//		objMember.fnSetPrjListProcessor(objTabPrjCombo, objParentSetDs, strParentDsColumnName,bEndPrjChk, strOnchangeFunctionName , bAuthAll , bAuthOrg , bAuthPrj , bAuthTeam , strPrjStdCdList, strRoleList, bRequired, strParentStCdDsColumnName);
//	}
//}


/*
* 코드형 콤보데이터셋에 년도를 삽입해줍니다
* objDs : (object)  테이터셋
* iPre  : (int) 이전 년도 기간
* iPost : (int) 이후 년도 기간
* iYear : (int) 현재 기준년도
*/
//function gfnSetYearComboDs(objDs , iPre , iPost , iYear){
//	objDs.removeallrows();
//	
//	if(isNull(iYear)){
//		iYear = Number(factory.getsystemtime("%Y"));
//	}
//	trace(iYear);
//	for(var i = Number(iYear - iPre); i <= Number(iYear + iPost); i ++)
//	{
//		var iRow = objDs.getrowcount();
//
//		objDs.insertrow(iRow);
//		objDs.setdatabyname(iRow , "COM_CD_ID" , i);
//		objDs.setdatabyname(iRow , "COM_CD_ID_NM" , i);
//
//	}
//}


/*
* base64로 인코딩
* strKey : (string) 문자
* [return] => (string)
*/
function gfnEncodeBase64(strKey){	
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	var out = ""; 
	var chr1, chr2, chr3 = ""; 
	var enc1, enc2, enc3, enc4 = ""; 
	var i = 0; 
	
	do {
		chr1 = strKey.charCodeAt(i++); 
		chr2 = strKey.charCodeAt(i++); 
		chr3 = strKey.charCodeAt(i++); 
	
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2))
		{
		enc3 = enc4 = 64;
		}
		else if (isNaN(chr3))
		{
		enc4 = 64;
		}
		//Lets spit out the 4 encoded bytes
		out = out + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) +
		keyStr.charAt(enc4);
		// OK, now clean out the variables used.
		chr1 = chr2 = chr3 = "";
		enc1 = enc2 = enc3 = enc4 = "";
	} while (i < strKey.length);
		//And finish off the loop
		//Now return the encoded values.
	return out;
}

/*
* base64를 디코딩
* strKey : (string) 문자
* [return] => (string)
*/
function gfnDecodeBase64(strKey){
	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var out = "";
	var chr1, chr2, chr3 = ""; 
	var enc1, enc2, enc3, enc4 = ""; 
	var i = 0; 
	
	var base64test = "/[^A-Za-z0-9+/=]/g";
	if (base64test.exec(strKey))
	{
//		alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnDecodeBase64 개발자 오류] There were invalid base64 characters in the strKeyut text.n" +
//			"Valid base64 characters are A-Z, a-z, 0-9, ?+?, ?/?, and ?=?n" +
//			"Expect errors in decoding.");
	    alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnDecodeBase64 개발자 오류] There were invalid base64 characters in the strKeyut text.n" +
			"Valid base64 characters are A-Z, a-z, 0-9, ?+?, ?/?, and ?=?n" +
			"Expect errors in decoding.");
	}
	strKey = strKey.replace("/[^A-Za-z0-9+/=]/g", "");
	do //Here’s the decode loop.
	{
	//Grab 4 bytes of encoded content.
	enc1 = keyStr.indexOf(strKey.charAt(i++));
	enc2 = keyStr.indexOf(strKey.charAt(i++));
	enc3 = keyStr.indexOf(strKey.charAt(i++));
	enc4 = keyStr.indexOf(strKey.charAt(i++));
	//Heres the decode part. There’s really only one way to do it.
	chr1 = (enc1 << 2) | (enc2 >> 4);
	chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	chr3 = ((enc3 & 3) << 6) | enc4;
	//Start to output decoded content
	out = out + String.fromCharCode(chr1);
	if (enc3 != 64)
	{
	out = out + String.fromCharCode(chr2);
	}
	if (enc4 != 64)
	{
	out = out + String.fromCharCode(chr3);
	}
	//now clean out the variables used
	chr1 = chr2 = chr3 = "";
	enc1 = enc2 = enc3 = enc4 = "";
	} while (i < strKey.length); //finish off the loop
	//Now return the decoded values.
	return out;
}


/*
* 이메일 보내기
* strMailTitle	: (string) 제목 
* strMailContents : (string) 메일내용
* strSendUserID   : (string) 보내는아이디
* aryReciveUserId : (array) 받는아이디 배열
* strProgramPath  : (string) 프로그램경로
* aryHash		 : (array) hash 형 변수 
*/
//function gfnSendEmail(strMailTitle , strMailContents , strSendUserID , aryReciveUserId , strProgramPath , aryHash){
//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
//	
//	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnSendEmailProcessor")){ 
//		return objMainScreenMember.ufnSendEmailProcessor(strMailTitle , strMailContents , strSendUserID , aryReciveUserId , strProgramPath , aryHash);
//	}	
//}


/*
* SMS 보내기
* strContents 	: (string) 내용
* strSendHp	   : (string) 보내는 핸드폰 번호
* strSendUserID   : (string) 보내는아이디
* aryReciveUserHp : (array) 받는핸드폰번호 배열
* aryReciveUserId : (array) 받는아이디 배열
*/
//function gfnSendSms(strContents , strSendHp , strSendUserID , aryReciveUserHp , aryReciveUserId){
//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
//	
//	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnSendSmsProcessor")){ 
//		return objMainScreenMember.ufnSendSmsProcessor(strContents , strSendHp , strSendUserID , aryReciveUserHp , aryReciveUserId );
//	}	
//}



/*
* 문자열의 각 char를 간단히 변경합니다아스키 변경합니다
* str : (string) 문자 
* [return] => (string)
*/
function gfnStringToAscii(str){
	var strRtn = "";
	for(var i=0;i<str.length;i++){
		strRtn += "$$" + str.charCodeAt(i)+";";
	}
	return strRtn;
}

/*
* 아스키코드값으로 변경된걸 문자로 변환합니다
* str	: (string) 제목 
* [return] => (string)
*/
function gfnAsciiToString(str){
	var arySplit = str.split(";");
	var strRtn = "";
	
	for(var i=0;i<arySplit.length;i++){
		strRtn += String.fromCharCode(arySplit[i].replace("$$",""));
	}
	
	return strRtn;
}


/*
* 해당 데이터셋의 컬럼을 배열로 만듭니다
* objDs		: (object) 데이터셋 
* strColumn	: (string) 컬럼
* blDistinct   : (boolean) 중복여부
* [return] => (array)
*/
function gfnDsColumnToAry(objDs , strColumn , blDistinct){
	var ary = [];
	
	if(isNull(blDistinct)){
		blDistinct = false;
	}
	
	if(!isNullObj(objDs)){
		for(var i=0;i<objDs.getrowcount();i++){			
			var strValue = objDs.getdatabyname(i , strColumn);
			
			if(!isNull(strValue)){
				if(blDistinct){	//중복제거면
					var blSame = false;
					for(var j=0;j<ary.length;j++){
						if(ary[j] == strValue){
							blSame = true;
							break;
						}
					}
					
					if(!blSame){
						ary[ary.length] = strValue;
					}
				}else{
					ary[ary.length] = strValue;
				}
			}
		}
	}	
	
	return ary;
}


/*
* 해당 메뉴가 열려져있을경우 닫습니다
* strCloseMenuID	: (string) 메뉴 아이디
*/
//function gfnCloseMenu(strCloseMenuID){
//	var iMdiTabItem = -1;
//	
//	for(var i=0;i<gdsScreen.getrowcount();i++){
//		if(gdsScreen.getdatabyname(i , "TYPE") == "MDI"){			
//			var strMenuId = gdsScreen.getdatabyname(i , "SCREEN_NAME");
//			var strMdiWindowId = gdsScreen.getdatabyname(i , "SCREEN_WINDOW_ID");			
//			
//			if(strMenuId == strCloseMenuID){
//				iMdiTabItem = INI.gfnMdiGetTabItemFromWindowId(strMdiWindowId);
//				break;
//			}
//		}
//	}
//	
//	if(iMdiTabItem > -1){
//		CCNConst.MIDDLE_MAIN_MIDDLE_TAB.deletetab(iMdiTabItem);
//	}		
//}

/*
* 로그인 사용자의 해당 권한 여부를 판단함.
* strAuthGId      : (string) 조회할 권한(IN절 사용) ex) 'AUTHG0065','AUTHG0021'....
* [return] => string (Y:권한포함, N:권한미포함)
*/
function gfnUserAuth(strAuthGId){

//	var objMainScreen = CCNConst.WIN_MAIN_SCREEN;
//	var objMainScreenMember = CCNConst.WIN_MAIN_MEMBER;
	var objMainScreen = SYSVar.WINMAIN_SCREEN;
	var objMainScreenMember = SYSVar.WINMAIN_MEMBER;
	var strUserAuthYn = "";
	
	if(isScreen(objMainScreen) && objMainScreen.findscriptmethod(XFD_JAVASCRIPT, "ufnUserAuth")){ 
		strUserAuthYn = objMainScreenMember.ufnUserAuth(strAuthGId);
	}
	  
	return strUserAuthYn;	
}

/*
필수,일반,비활성화 스타일 적용 스크립트
objControl : 스타일 적용 대상 객체
objStyleType : 필수 : Required(R)    일반 : General(G)     비활성 : disable(D)
*/
function gfnHrEditorStyle(objControl, strStyleType)
{

	if(factory.isobject(objControl))
	{
		if(!isNull(strStyleType))
		{
			switch(strStyleType)
			{
				case "R" :
					objControl.setinputtype(1);
					//objControl.setenable(true);
					objControl.setbackcolor(255,253,160);
					break;
				case "G" :
					objControl.setinputtype(0);
					//objControl.setenable(true);
					objControl.setbackcolor(255,255,255);
					break;
				case "D" :
					objControl.setinputtype(2);
					//objControl.setenable(false);
					objControl.setbackcolor(245,245,255);
					break;
			}
		}
	}
}