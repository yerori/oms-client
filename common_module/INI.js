/*-----------------------------------------------------------------------------------------------------------------

gfnIniChageDisplayText(objScreen)	:	다국어를 처리합니다
gfnPageIniDefaultButtonAuthSet(objScreen) :	화면 제목 표시 및 버튼 권한 반영
gfnPageIniProcessor(objScreen)	:	버튼 위치조정
//gfnPageIniResizeInfoSet(objScreen)	:	페이지 공통 타이틀 및 권한 버튼들 리싸이징 처리
//gfnIniResizeCall(objScreen)	:	페이지 처음에 들어올때 리싸이징이 안되므로 최초 실행

gfnAryButtonRePosition(objTarget , aryButton , strStandardPosotion , iFirstTerm)	:	해당 버튼 객체를 기준 객체에서 좌측으로 보이는 기준으로 정렬합니다
gfnAryButtonReOrderPosition(objTarget , aryButton , strStandardPosotion , iFirstTerm)	:	 해당 버튼 객체를 기준 객체에서 좌측으로 보이는것을 배열순으로 정렬합니다

gfnScreenCommonOnKeyEvent(objScreen , keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)	:	스크린 공통 키다운 이벤트 처리
gfnPopScreenCommonOnKeyEvent(objScreen , keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)	:	팝업 스크린 공통 키다운 이벤트 처리

------------------------------------------------------------ [ MDI관련 ] ------------------------------------------------------
gfnMdiTabAddScreenDs(strMenuId , iMdiTabIndex)	:	스크린데이터셋에 mdi 탭 index 와 메뉴 아이디를 삽입합니다
gfnMdiScreenDsSetData(objScreen)	:	스크린데이터셋에서 mdi 탭 index 를 삭제합니다
gfnMdiTabDelScreenDs(objScreen)	:	스크린데이터셋에서 mdi 탭 index 를 삭제합니다
gfnMdiTabItemDelScreenDs(iMdiTabItem)	:	스크린데이터셋에서 mdi 탭 item 를 삭제합니다
gfnMdiGetTabItem(objScreen)	:	스크린데이터셋을 던지면 Mdi 안의 Tab 인덱스를 반환한다
gfnMdiGetTabIndexScreenDsRow(objScreen)	:	스크린데이터셋을 던지면 Mdi 안의 Tab 인덱스가 있는 로우를 반환합니다
gfnIsAuth(objScreen , strAuth)	:	해당 스크린의 해당 권한여부를 반환합니다    권한 "R":조회 , "W":추가(등록) , "M":수정 , "D":삭제 , "S":저장 , "E":기타
gfnMdiTabClose()   : MDI 페이지 공통 닫기 버튼용
----------------------------------------------------------------------------------------------------------------- */
var GV_MENU_OPEN_TYPE = "F";	//F 는 포커스 그외는 추가
var GV_MENU_BEFORE_VIEW = "Y";	// "N" 는 아무것도 "Y"는 기존메뉴로변환

var GV_OU_CODE = "H01";		//회사구분 (효성전기본사)
var GV_AT_OU = "";			 //회사변경가능여부
var GV_USER_ID = -1;		   //사용자아이디
var GV_LGI_ID = "sysadmin";	//사용자명
var GV_USER_ID_NM = "sysadmin";	//사용자명
//var GV_USER_IP = "";	     //사용자PC IP
//var GV_USER_ID_NM = "";	//사용자명
//var GV_USER_HP_TN = "";	//사용자 해드폰번호
var GV_ORG_NM = "";		//회사명
var GV_ORG_CD = "";	//회사코드
var GV_LANG = "KO";	//다국어 언어

var GV_EMP_NO = "";		//유저사번
var GV_VENDOR_CODE = "";   //유저업체코드
var GV_VENDOR_NAME = "";   //유저업체명
var GV_USER_TYPE = "";	 //유저사용자유형 (내부사용자:U, 외부사용자:V)
var GV_USER_BIZ_DIV = "";  //유저담당업무구분 (구매담당자:PA, 품질담당자:QA)

var GV_ATTACH_FILE_DIR = "C:/OMS_UPLOAD/";	//첨부파일 경로
var GV_LOGIN_TYPE = "NOR";

//var GV_REPORT_WEB_HTML = "http://152.149.2.54:8080/ReportingServer/html5/rdViewhsproc.jsp";
//var GV_REPORT_MID = "HSPROC";
var GV_REPORT_WEB_HTML = "";  // RD Agent 경로
var GV_REPORT_MID = "";       // RD MID 경로

var GV_DOC_VIEW_SERVER_URL = "";    // 문서변환서버 경로
var GV_DOC_VIEW_CONVERT_TYPE = "";  // 문서변환형식 (0:HTML, 1:IMAGE, 2:PDF)

var GFV_SERVER_TYPE;    //LOCAL, TEST, LIVE
var GFV_SERVER_URL; 	//= "http://127.0.0.1:8080/proc";
var GFV_SERVER_PATH;
var GFV_ATTACH_DIR;
var GV_XFRAME_ONLY;
var GV_LOGOFF = false;

var GV_E_COMMERCE_YN = "N";    //전자상거래동의
var GV_PERSONAL_INFO_YN = "N"; //개인정보동의 
var GV_INFO_SECURIT_YN = "N";  //정보보안서약서
var GV_FIRST_PWD_CHANGE = "N";  //최초로그인 패스워드변경 CHECK

// Added by IT Team. 24.05.16
var GV_EMP_NAME = "" ;	  // 성명
var GV_DEPT_CODE = "" ;     // 현재 부서 코드
var GV_DEPT_NAME = "" ;     // 현재 부서 명
var GV_JIKJONG_CODE = "" ;  // 현재 직종 코드
var GV_JIKWI_CODE = "" ;    // 현재 직위 코드
var GV_JIKWI_NAME = "" ;    // 현재 직위 명
var GV_JIKCHAK_CODE = "" ;  // 현재 직책 코드
var GV_JIKCHAK_NAME = "" ;  // 현재 직책 코드
//
 
var GFV_PAGE_TOP_BUTTON = [
	{name:"btnCommonSearch", auth:"R", authKey:"AT_R"},
	{name:"btnCommonCreate", auth:"C", authKey:"AT_C"},
	{name:"btnCommonSave"   , auth:"U", authKey:"AT_U"},
	{name:"btnCommonDelete", auth:"D", authKey:"AT_D"},
	{name:"btnCommonPrint"   , auth:"P", authKey:"AT_P"}
	];

var GFV_TAB_TOP_COMMON_NAME = "tabTopCommon";	// 페이지의 탑 Tab 네임
var GFV_TAB_TOP_COMMON_CLOSE_NAME = "btnCommonClose" ; //공통 닫기버튼
var GFV_TAB_TOP_IN_TAB_END_POINT_NAME = "tabEndPoint";	// 페이지의 탑 Tab 안의 닫기버튼
var GFV_TAB_TOP_IN_TAB_END_POINT_WIDTH = 100;
var GFV_BUTTON_TERM = 7;

//var aryKeyCode = [ ["Ctrl + W" , 87 , "btnCommonAdd" , "btnCommonAdd_on_mouseup" , "추가"]
//						, ["Ctrl + D" , 68 , "btnCommonDel" , "btnCommonDel_on_mouseup" , "삭제"]
//						, ["Ctrl + R" , 82 , "btnCommonSearch" , "btnCommonSearch_on_mouseup" , "조회"]
//						, ["Ctrl + S" , 83 , "btnCommonSave" , "btnCommonSave_on_mouseup" , "저장"]
//						, ["Ctrl + Q" , 81 , "btnCommonClose" , "btnCommonClose_on_mouseup" , "닫기"]
//						];
//
//var aryEtcKeyCode = [ ["Ctrl + W" , 87 , "btnAdd" , "btnAdd_on_mouseup" , "추가"]
//						, ["Ctrl + D" , 68 , "btnDel" , "btnDel_on_mouseup" , "삭제"]
//						, ["Ctrl + R" , 82 , "btnSearch" , "btnSearch_on_mouseup" , "조회"]
//						, ["Ctrl + S" , 83 , "btnSave" , "btnSave_on_mouseup" , "저장"]
//						, ["Ctrl + Q" , 81 , "btnClose" , "btnClose_on_mouseup" , "닫기"]
//						];
//	
//var aryRowKeyCode = [ ["Ctrl + W" , 87 , "btnCommonAddRow" , "btnCommonAddRow_on_mouseup" , "행추가"]
//						, ["Ctrl + D" , 68 , "btnCommonDelRow" , "btnCommonDelRow_on_mouseup" , "행삭제"]						
//						];
//						
//var aryEtcRowKeyCode = [ ["Ctrl + W" , 87 , "btnAddRow" , "btnAddRow_on_mouseup" , "행추가"]
//						, ["Ctrl + D" , 68 , "btnDelRow" , "btnDelRow_on_mouseup" , "행삭제"]						
//						];

						
/*
* 모든 폼 온로드 최초 공통
* objScreen  : (object) 스크린 객체
*/
function init(objScreen){

	gfnIniChageDisplayText(objScreen);		//다국어 처리합니다

	gfnMdiScreenDsSetData(objScreen);	// Mdi 페이지 정보를 세팅합니다

	gfnPageIniDefaultButtonAuthSet(objScreen);	//화면 제목 표시 및 버튼 권한 반영

	gfnCheckAuthRowButtonVisible(objScreen);	//공통 행추가 삭제 버튼 권한 확인후 보여주지않음 처리

	gfnPageIniProcessor(objScreen);	// 버튼 위치 조정

    return;
    
//---------------------- 이하 삭제 -----------------

//	gfnPageIniResizeInfoSet(objScreen);		//페이지 공통 타이틀 및 권한 버튼들 리싸이징 처리

//	gfnIniResizeCall(objScreen);	// 페이지 처음에 들어올때 리싸이징이 안되므로 최초 실행

	//gfnCommonButtonAddToolTip(objScreen);	//페이지의 버튼에 핫키 툴팁 삽입

//	objScreen.setscrollbarstyle(0 , 0);

}


/*
* 모든 폼 온로드 최초 공통
* objScreen  : (object) 스크린 객체
*/
function initPopup(objScreen){
	gfnIniChageDisplayText(objScreen);		//다국어 처리합니다
	//gfnCommonButtonAddToolTip(objScreen);	//페이지의 버튼에 핫키 툴팁 삽입
}

/*
* 페이지 처음에 들어올때 리싸이징이 안되므로 최초 실행
* objScreen  : (object) 스크린 객체
*/
/*
function gfnIniResizeCall(objScreen){
	var objScreenFrame = objScreen.getparent();
	
	if(!UT.isScreen(objScreenFrame)){
		return;
	}
	
	var objTabBizScreen = UT.gfnGetObjectByName(objScreenFrame , "tabBizScreen");
	if(!UT.isNullObj(objTabBizScreen)){
//		CCNLayout.processSizeEvent(objScreen, objTabBizScreen.getwidth(), objTabBizScreen.getheight());	//자동 리싸이징
	}	
}
*/


/*
* 해당 스크린의 TopPage 안의 공통 버튼의 리싸이징 객체를 삽입합니다
* objScreen  : (object) 스크린 객체
*/
/*
function gfnPageIniResizeInfoSet(objScreen){	
	var objTabTopCommon = UT.gfnGetObjectByName(objScreen , GFV_TAB_TOP_COMMON_NAME);
	
	if(!UT.isNullObj(objTabTopCommon)){
//		CCNLayout.addLayout(objScreen, objTabTopCommon, CCNLayout.RESIZE, CCNLayout.HORZ);	//버튼영역 탭 
		
		var aryTabCtrlObjs = UT.gfnGetTabChildCtrlIdAry(objTabTopCommon , 0);	//하위 탭의 컨트롤 아이디들을 가져옵니다
		
		for(var i=0;i<aryTabCtrlObjs.length;i++){		
			var instObj = objTabTopCommon.getchildinstance(0 , aryTabCtrlObjs[i]);
			
			if(UT.isNullObj(instObj)){
				continue;
			}
			
			if(XFD_CTRLKIND_PUSHBUTTON == instObj.getcontrolkind()){
//				CCNLayout.addLayout(objScreen, instObj, CCNLayout.MOVE, CCNLayout.HORZ);
			}else if(GFV_TAB_TOP_IN_TAB_END_POINT_NAME == instObj.getname()){	//탑 닫기버튼 Tab 
//				CCNLayout.addLayout(objScreen, instObj, CCNLayout.MOVE, CCNLayout.HORZ);
			}
		}
	}
}
*/

/*
* 화면 제목 표시 및 버튼 권한 반영
* objScreen  : (object) 스크린 객체
*/
function gfnPageIniDefaultButtonAuthSet(objScreen){

	var newVersion = false;

	var objTabTopCommon = UT.gfnGetObjectByName(objScreen , GFV_TAB_TOP_COMMON_NAME);
	if (UT.isNullObj(objTabTopCommon)) {
		return;
	}

    //소스 전환과정에서 신규 소스 발생
    var newVersionCheck = UT.gfnGetObjectByName(objScreen , "tabEndPoint");
	if(UT.isNullObj(newVersionCheck)){
		newVersion = true;
	}

	var iRow = gfnMdiGetTabIndexScreenDsRow(objScreen);	//스크린데이터셋에서 나의 mdi 줄 반환
	var strMenuId = gdsScreen.getdatabyname(iRow , "SCREEN_NAME");

	var aryTabCtrlObjs = UT.gfnGetTabChildCtrlIdAry(objTabTopCommon , 0);	//하위 탭의 컨트롤 아이디들을 가져옵니다	
	
	for(var i=0;i<aryTabCtrlObjs.length;i++){		

		var instObj = objTabTopCommon.getchildinstance(0 , aryTabCtrlObjs[i]);
		if(UT.isNullObj(instObj)){
			continue;
		}

		if (instObj.getname() == "stSystemMenuTitle"){
			//화면 제목 표시
			var strMenuNm = UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "MENU_NM");	//룩업
			instObj.settext(strMenuNm);	

		} 	else  if(XFD_CTRLKIND_PUSHBUTTON == instObj.getcontrolkind()){
			//버튼 권한 반영

            var buttonName = instObj.getname();
            var buttonAuth   = null;
            var buttonAuthKey = null;

			if (instObj.getname() == GFV_TAB_TOP_COMMON_CLOSE_NAME){ 	//공통 닫기 버튼
				continue;
			}

			for(var k=0; k<GFV_PAGE_TOP_BUTTON.length; k++){
				if (buttonName == GFV_PAGE_TOP_BUTTON[k].name ){	//버튼 이름이 같으면	
					buttonAuth      = GFV_PAGE_TOP_BUTTON[k].auth;
					buttonAuthKey = GFV_PAGE_TOP_BUTTON[k].authKey;
					break;
				}
			}

			if (buttonAuth) {
				var authCheck = 	UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , buttonAuthKey);

			    if (authCheck == "1"){
					instObj.setvisible(true);
					instObj.setuserdata("Y");
				}else{
					if (newVersion) {
						const element = instObj.getdom();
						element.remove();
					} else {
						instObj.setvisible(false);
						instObj.setenable(false);
					}
				}
			}
		}
	}
}


/*
* 해당 스크린의 해당 권한여부를 반환합니다
* objScreen     : (object) 메뉴아이디
* strAuth 	  : (string) 권한 "R":조회 , "C":추가(등록) , "U":수정 , "D":삭제 , "P":출력
*/
function gfnIsAuth(objScreen , strAuth){
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnIsAuth 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnIsAuth 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var strMenuId = gfnGetMdiMenuId(objScreen);
	var blResult = false;
	
	for(var i=0;i<GFV_PAGE_TOP_BUTTON.length;i++){
		if(strAuth == GFV_PAGE_TOP_BUTTON[i].auth){
	
			var iRow = UT.gfnFindRow(gdsAuthMenu , "MENU_ID" , strMenuId);
			if(iRow > -1){
				var strYN = gdsAuthMenu.getdatabyname(iRow , GFV_PAGE_TOP_BUTTON[i].authKey);
				//if(strYN == "Y"){
				if(strYN == "1"){
					blResult = true;
					break;
				}
			}
		}		
	}
	
	return blResult;	
}


/*
* 페이지 공통 행추가 삭제 버튼 권환에서 권한 없을시 안보여주게 처리
* objScreen  : (object) 스크린 객체
*/
function gfnCheckAuthRowButtonVisible(objScreen){
	var iRow = gfnMdiGetTabIndexScreenDsRow(objScreen);	//스크린데이터셋에서 나의 mdi 줄 반환
	var strMenuId = gdsScreen.getdatabyname(iRow , "SCREEN_NAME");

	var objAry = objScreen.getinstanceall(1);
	
	for(var i=0;i<objAry.length;i++){
		if(UT.isNullObj(objAry[i])){
			continue;
		} 
		
		if(objAry[i].getname() == "btnCommonAddRow"){
			if(UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "AT_C") == "1"){
				objAry[i].setvisible(true);
				objAry[i].setenable(true);
			}else{
				objAry[i].setvisible(false);
				objAry[i].setenable(false);
			}
		}else if(objAry[i].getname() == "btnCommonDelRow"){
			if(UT.gfnLookUp(gdsAuthMenu , "MENU_ID" , strMenuId , "AT_D") == "1"){
				objAry[i].setvisible(true);
				objAry[i].setenable(true);
			}else{
				objAry[i].setvisible(false);
				objAry[i].setenable(false);
			}
		}				
	}
}



/*
* 버튼 위치 조정
* objScreen  : (object) 스크린 객체
*/
function gfnPageIniProcessor(objScreen){

	var newVersion = false;

    //Top Common 블록이 없으면 종료
	var objTabTopCommon = UT.gfnGetObjectByName(objScreen , GFV_TAB_TOP_COMMON_NAME);
	if(UT.isNullObj(objTabTopCommon)){
	    return;
	}

    //소스 전환과정에서 신규 소스 발생
    var newVersionCheck = UT.gfnGetObjectByName(objScreen , "tabEndPoint");
	if(UT.isNullObj(newVersionCheck)){
		newVersion = true;
	}

    if (newVersion) {
		var aryTabCtrlObjs = UT.gfnGetTabChildCtrlIdAry(objTabTopCommon , 0);	//하위 탭의 컨트롤 아이디들을 가져옵니다

		var buttonArray = [];

		//버튼의 현재 좌표 속성 추출
		for(var i=0; i<aryTabCtrlObjs.length; i++){
			var instObj = objTabTopCommon.getchildinstance(0 , aryTabCtrlObjs[i]);
			if(UT.isNullObj(instObj)){
				continue;
			}

			if (instObj.getcontrolkind() == XFD_CTRLKIND_PUSHBUTTON){	//버튼이면
				var objright = null;

				if (instObj.getname() == GFV_TAB_TOP_COMMON_CLOSE_NAME) { //공통닫기 버튼은 가장 우측에 고정
					objright = 99999999;
				} else if (instObj.getuserdata() == "Y") {  //사용권한 있음
					objright = instObj.getright();
				}
	
				if (objright) { //remove 된 버튼 제외
					var buttonObj = { btnId: instObj
											, width: instObj.getwidth()
											, right : objright
											};
					buttonArray.push( buttonObj );
				}
			}
		}

		//위치 좌표로 우측부터 정렬(내림차순)
		buttonArray.sort( function(a, b) {
			return b.right - a.right;
		});

		var objRight = null;

		//우측 기준으로 버튼 위치 이동
		for(var i=0; i<buttonArray.length; i++){
			if (! objRight) {
				objRight = 20; //가장 우측버튼의 우측여백
			} else {
				if(i!=0){
					objRight += buttonArray[i-1].width + 4;  //버튼간 간격 4px
				} else {
					objRight += buttonArray[i].width + 4;  //버튼간 간격 4px
				}	
			}

			
			const btnObj = buttonArray[i].btnId.getdom();
			btnObj.style.inset = "";
			btnObj.style.position = "absolute";
			btnObj.style.top = "4px";
			btnObj.style.right = objRight + "px";
		};

	//--------- 이하 old version ----------------------

    } else {
		var aryTabCtrlObjs = UT.gfnGetTabChildCtrlIdAry(objTabTopCommon , 0);	//하위 탭의 컨트롤 아이디들을 가져옵니다
		var objTabEndPoint = null;

		var aryButtonCtrlId = [];
		var aryButtonWidth = [];
		var aryButtonRight = [];

		//버튼의 현재 좌표 속성 추출
		for(var i=0;i<aryTabCtrlObjs.length;i++){
			var instObj = objTabTopCommon.getchildinstance(0 , aryTabCtrlObjs[i]);
			if(UT.isNullObj(instObj)){
				continue;
			}

			if(instObj.getcontrolkind() == XFD_CTRLKIND_PUSHBUTTON){	//버튼이면
				aryButtonCtrlId[aryButtonCtrlId.length] = aryTabCtrlObjs[i];
				aryButtonWidth[aryButtonWidth.length] = instObj.getwidth();
				aryButtonRight[aryButtonRight.length] = instObj.getright();

			}else if(instObj.getname() == GFV_TAB_TOP_IN_TAB_END_POINT_NAME){	//공통 닫기 버튼이면
				objTabEndPoint = instObj;
				var iL = objTabTopCommon.getright() - GFV_TAB_TOP_IN_TAB_END_POINT_WIDTH;
				//var iL = objTabTopCommon.getright() - GFV_TAB_TOP_IN_TAB_END_POINT_WIDTH - 15;
				var iT = objTabEndPoint.gettop();
				var iR = iL + GFV_TAB_TOP_IN_TAB_END_POINT_WIDTH;
				var iB = objTabEndPoint.getbottom();

				objTabEndPoint.setrect(iL , iT , iR , iB);	//닫기버튼 위치 재조정
			}
		}

		//위치 좌표로 우측부터 순서 정렬
		for(var j=0;j<aryButtonRight.length;j++){
			for(var k=1;k<aryButtonRight.length;k++){
				if(aryButtonRight[k-1] < aryButtonRight[k]){
					var iTempCtrl , iTempWidth , iTempRight;
					iTempCtrl = aryButtonCtrlId[k-1];
					iTempWidth = aryButtonWidth[k-1];
					iTempRight = aryButtonRight[k-1];

					aryButtonCtrlId[k-1] = aryButtonCtrlId[k];
					aryButtonWidth[k-1] = aryButtonWidth[k];
					aryButtonRight[k-1] = aryButtonRight[k];

					aryButtonCtrlId[k] = iTempCtrl;
					aryButtonWidth[k] = iTempWidth;
					aryButtonRight[k] = iTempRight;
				}
			}
		}

		//우측 기준으로 버튼 위치 이동
		var beForeCtrlId = -1;
		for(var i=0;i<aryButtonRight.length;i++){
			var instObj = objTabTopCommon.getchildinstance(0 , aryButtonCtrlId[i]);
			if(instObj.getvisible()){
				if(beForeCtrlId == -1){
					var iTabEndPoint = objTabTopCommon.getright();

					if(!UT.isNullObj(objTabEndPoint)){
						iTabEndPoint =objTabEndPoint.getleft();
					}

					var iL = iTabEndPoint - GFV_BUTTON_TERM - aryButtonWidth[i];
					var iR = iTabEndPoint - GFV_BUTTON_TERM;

					instObj.setrect(iL , instObj.gettop() , iR , instObj.getbottom());
				}else{
					var objBeFore = objTabTopCommon.getchildinstance(0 , aryButtonCtrlId[beForeCtrlId]);
					var iL = objBeFore.getleft() - GFV_BUTTON_TERM - aryButtonWidth[i];
					var iR = objBeFore.getleft() - GFV_BUTTON_TERM;

					instObj.setrect(iL , instObj.gettop() , iR , instObj.getbottom());
				}

				beForeCtrlId = i;
			}
		}
	}
}





/*
* 해당 스크린의 해당 권한여부를 반환합니다
* objScreen     : (object) 메뉴아이디
* strAuth 	  : (string) 권한 "AT_R":조회,"AT_C":생성,"AT_U":수정(저장),"AT_D":삭제,"AT_P":출력,"AT_E":엑셀
*                              "AT_DEPT":부서, "AT_EMP":개인, "AT_PINFO":개인정보, "AT_USER1~5":사용자1~5
*/
function gfnIsAuthDeptEtc(objScreen , strAuth){
	if(!UT.isScreen(objScreen)){	
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnIsAuth 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var strMenuId = gfnGetMdiMenuId(objScreen);
	var blResult = false;
	
	var iRow = UT.gfnFindRow(gdsAuthMenu , "MENU_ID" , strMenuId);
	if(iRow > -1){
		var strYN = gdsAuthMenu.getdatabyname(iRow , strAuth);
		if(strYN == "1"){
			blResult = true;
		}
	}
		
	return blResult;	
}

/*
* 해당 메뉴아이디 기준으로 해당 권한여부를 반환합니다
* strMenuId     : (object) 해당 화면의 메뉴ID
* strAuth 	  : (string) 권한 "AT_R":조회,"AT_C":생성,"AT_U":수정(저장),"AT_D":삭제,"AT_P":출력,"AT_E":엑셀
*                              "AT_DEPT":부서, "AT_EMP":개인, "AT_PINFO":개인정보, "AT_USER1~5":사용자1~5
*/
function gfnIsAuthDeptEtcByMenuId(strMenuId , strAuth){
	
	var blResult = false;
	
	var iRow = UT.gfnFindRow(gdsAuthMenu , "MENU_ID" , strMenuId);
	if(iRow > -1){
		var strYN = gdsAuthMenu.getdatabyname(iRow , strAuth);
		if(strYN == "1"){
			blResult = true;
		}
	}
		
	return blResult;	
}



/*
* 스크린데이터셋에 mdi 탭 index 와 메뉴 아이디를 삽입합니다
* strMenuId	: (string) 팝업 아이디
* iPtlTabIndex : (string) Ptl 탭 인덱스
*/
function gfnMdiTabAddScreenDs(strMenuId , iPtlTabIndex , iLeftMenuIndex){
	var iRow = gdsScreen.getrowcount();
	gdsScreen.insertrow(iRow);
	gdsScreen.setdatabyname(iRow , "TYPE" , "PTL");
	gdsScreen.setdatabyname(iRow , "SCREEN_NAME" , strMenuId);	//메뉴 아이디
	gdsScreen.setdatabyname(iRow , "SCREEN_MDI_TAB_INDEX" , iPtlTabIndex);	//탭의 시퀀스 라고 생각하면됨
	gdsScreen.setdatabyname(iRow , "LEFT_MENU_INDEX" , iLeftMenuIndex);	//좌측 메뉴 트리 인덱스		
}



/*
* 스크린데이터셋에서 데이터를 세팅 합니다
* objScreen   		  : (object) 스크린 객체
*/
function gfnMdiScreenDsSetData(objScreen){
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnMdiScreenDsSetData 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnMdiScreenDsSetData 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var iMdiTabItem = gfnMdiGetTabItem(objScreen);
	var iWindowId = gfnGetMdiTabScreen(iMdiTabItem).getwindowid();
	
	var aryDual = [ ["TYPE" , "PTL"]  ,  ["SCREEN_WINDOW_ID" , iWindowId] ];
	var iSRow = UT.gfnAndFindRow(gdsScreen , aryDual);		
	var iMdiTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");
	
	if(iSRow >-1){
		var strScreenID = objScreen.getscreenid();
		var objParentScreen = objScreen.getparent();
		var strParentScreenID = objParentScreen.getscreenid();
	
		gdsScreen.setdatabyname(iSRow , "TYPE" , "PTL");
		gdsScreen.setdatabyname(iSRow , "PARENT_SCREEN_NAME" , strParentScreenID);
		gdsScreen.setdatabyname(iSRow , "SCREEN_WINDOW_ID" , objScreen.getwindowid());
		gdsScreen.setdatabyname(iSRow , "PARENT_SCREEN_WINDOW_ID" , objParentScreen.getwindowid());				
			
		UT.GFV_SCREEN_OBJ[iMdiTabIndex] = objScreen;	//데이터셋에는 객체가 들어가지 않음 
		UT.GFV_PARENT_SCREEN_OBJ[iMdiTabIndex] = objParentScreen;	//데이터셋에는 객체가 들어가지 않음
		UT.GFV_SCREEN_HASH_ARRAY[iMdiTabIndex] = null;	//데이터셋에는 객체가 들어가지 않음		
	}	
}


/*
* 스크린데이터셋에서 메뉴 아이디를 반환합니다
* objScreen   		  : (object) 스크린 객체
*/
function gfnGetMdiMenuId(objScreen){
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnGetMdiMenuId 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGetMdiMenuId 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var iMdiTabItem = gfnMdiGetTabItem(objScreen);	
	var iWindowId = gfnGetMdiTabScreen(iMdiTabItem).getwindowid();	
	var aryDual = [ ["TYPE" , "PTL"]  ,  ["SCREEN_WINDOW_ID" , iWindowId] ];
	var iSRow = UT.gfnAndFindRow(gdsScreen , aryDual);	
	
	return gdsScreen.getdatabyname(iSRow , "SCREEN_NAME");
}

/*
* 스크린데이터셋에서 mdi 탭 item 를 삭제합니다
* iMdiTabItem    : (int) Mdi tab index
*/
function gfnMdiTabItemDelScreenDs(iMdiTabItem){
	if(UT.isNull(iMdiTabItem)){
		return;
	}
	
	var objThisScreen = gfnGetMdiTabScreen(iMdiTabItem);
	
	if(!UT.isScreen(objThisScreen)){
		return;
	}
	
	var iWindowId = objThisScreen.getwindowid();		

	var aryDual = [ ["TYPE" , "PTL"]  ,  ["SCREEN_WINDOW_ID" , iWindowId] ];
	var iSRow = UT.gfnAndFindRow(gdsScreen , aryDual);	
	var iMdiTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");
	
	if(iSRow >-1){
		gdsScreen.deleterow(iSRow);
		
		var objScreen = UT.GFV_SCREEN_OBJ[iMdiTabIndex];		
		if(UT.isScreen(objScreen)){
//			CCNLayout.deleteScreenLayout(UT.GFV_SCREEN_OBJ[iMdiTabIndex]);	//리싸이징 객체를 같이 지워줍니다
		}
		
		UT.GFV_SCREEN_OBJ[iMdiTabIndex] = null;
		UT.GFV_PARENT_SCREEN_OBJ[iMdiTabIndex] = null;	
		UT.GFV_SCREEN_HASH_ARRAY[iMdiTabIndex] = null;	
		
	}
}



/*
* 스크린을 던지면 스크린데이터셋에서 mdi 탭 Item 를 삭제합니다
* objScreen   		  : (object) 스크린 객체
*/
function gfnMdiTabDelScreenDs(objScreen){
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnMdiTabDelScreenDs 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnMdiTabDelScreenDs 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var iMdiTabItem = gfnMdiGetTabItem(objScreen);
	
	gfnMdiTabItemDelScreenDs(iMdiTabItem);	//mdi 탭 아이템 지움
}


/*
* 스크린을 던지면 스크린데이터셋에서 Mdi 안의 Tab 인덱스를 반환한다
* objScreen   		  : (object) 스크린 객체
*/
function gfnMdiGetTabItem(objScreen){
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnMdiGetTabItem 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnMdiGetTabItem 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var iTabIndex = -1;
//	for(var i=0;i<CCNConst.MIDDLE_MAIN_MIDDLE_TAB.gettabitemcount();i++){			
//		var objScreenFrame = CCNConst.MIDDLE_MAIN_MIDDLE_TAB.getchildscreeninstance(i);
	for(var i=0;i<SYSVar.MIDDLE_TAB.gettabitemcount();i++){			
		var objScreenFrame = SYSVar.MIDDLE_TAB.getchildscreeninstance(i);	
		if(!UT.isScreen(objScreenFrame)){
			return;
		}
		
		var objTab = objScreenFrame.getinstancebyname("tabBizScreen");
		var objTabInScreen = objTab.getchildscreeninstance(0);
				
		if(objTabInScreen == objScreen){
			iTabIndex = i ;
			break;
		}
	}
	
	return iTabIndex;	
}



/*
* 스크린데이터셋에서 해당 윈도우 아이디에 맞는 탭 아이템 를 반환합니다
* objScreen   		  : (object) 스크린 객체
*/
function gfnMdiGetTabItemFromWindowId(iWindowId){
	var aryDual = [ ["TYPE" , "PTL"]  ,  ["SCREEN_WINDOW_ID" , iWindowId] ];
	var iSRow = UT.gfnAndFindRow(gdsScreen , aryDual);	
	var iMdiTabIndex = gdsScreen.getdatabyname(iSRow , "SCREEN_MDI_TAB_INDEX");
	
	return gfnMdiGetTabItem(UT.GFV_SCREEN_OBJ[iMdiTabIndex]);
}


/*
* 스크린데이터셋을 던지면 Mdi 안의 Tab 인덱스가 있는 로우를 반환한다
* objScreen   		  : (object) 스크린 객체
*/
function gfnMdiGetTabIndexScreenDsRow(objScreen){
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnMdiGetTabIndexScreenDsRow 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnMdiGetTabIndexScreenDsRow 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var iMdiTabItem = gfnMdiGetTabItem(objScreen);
	var iWindowId = gfnGetMdiTabScreen(iMdiTabItem).getwindowid();
	var aryDual = [ ["TYPE" , "PTL"]  ,  ["SCREEN_WINDOW_ID" , iWindowId] ];
	var iSRow = UT.gfnAndFindRow(gdsScreen , aryDual);			
	
	return iSRow;	
}




/*
* Mdi 안의 Tab 인덱스의 스크린을 반환합니다
* iTabIndex   		  : (int) 스크린 객체
*/
function gfnGetMdiTabScreen(iTabIndex){	
	if(UT.isNull(iTabIndex)){
		return;
	}
	
	//var objScreenFrame = CCNConst.MIDDLE_MAIN_MIDDLE_TAB.getchildscreeninstance(iTabIndex);
	var objScreenFrame = SYSVar.MIDDLE_TAB.getchildscreeninstance(iTabIndex);
		
	if(!UT.isScreen(objScreenFrame)){
		return;
	}
	
	var objTab = objScreenFrame.getinstancebyname("tabBizScreen");
	return objTab.getchildscreeninstance(0);	
}


/*
* 해당 스크린의 메타 값 확인후 해당값으로 변환합니다
* objScreen : (object) 스크린 객체
*/
function gfnIniChageDisplayText(objScreen)
{
	var arrComponentAndShapes = gfnIniGetAllComponentInscreen(objScreen);	
	if (arrComponentAndShapes.length > 0){
		gfnIniSetMultiLanguageText(arrComponentAndShapes);
	}
}




/*
* 스크린 의 모든 컨트롤 객체를 반환합니다
* objScreen : (object) 스크린 객체
*/
function gfnIniGetAllComponentInscreen(objScreen)
{
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnIniGetAllComponentInscreen 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnIniGetAllComponentInscreen 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
    var nControlCount = 0;
    nControlCount = objScreen.getcontrolcount();
    var arrComponent = new Array();
    var instControl = objScreen.getinstancefirst();
 
	if(factory.isobject(instControl)) {
		// table view control
        if (instControl.getname() == "tbv"){
			;
		} else if(instControl.getname() == "chartRate"){
			;		
		} else if(instControl.getname() == "fileControl"){
			;
		} else if(instControl.getname() == "uploader_basic"){
			;
		} else if(instControl.getname() == "downloader_basic"){
			;
		} else if(instControl.getname() == "schedule"){
			;
		} else {
			arrComponent.push(instControl);
		}	
		
        for(var nControlIdx = 0; nControlIdx < nControlCount; nControlIdx++)
        {
            instControl = objScreen.getinstancenext(instControl);
			
			if(factory.isobject(instControl) && instControl.getname() != "downloader_basic" && instControl.getname() != "uploader_basic" && instControl.getname() != "schedule" && instControl.getname() != "tbv" && instControl.getname() != "fileControl" && instControl.getname() != "chartRate") {
                arrComponent.push(instControl);
            } else {
                continue;
            }
        }
    }

    var instShape = objScreen.getshapeinstancefirst();
	if(factory.isobject(instShape)) {
        arrComponent.push(instShape);
        while(factory.isobject(objScreen.getshapeinstancenext(instShape))) {
            instShape = objScreen.getshapeinstancenext(instShape);
            arrComponent.push(instShape);
        }
    }
    return arrComponent;
}


/*
* 스크린 의 메타 값 확인후 해당값으로 변환 처리 합니다
* arrCompoList : (array) 객체 배열
*/
function gfnIniSetMultiLanguageText(arrCompoList)
{
	//console.dir(arrCompoList);

	// 다국어 텍스트 변경 시 폰트 정보 변경 처리 수정
	var nObjectkind    = 0;
	var nControlkind   = -1;
	var nFontSize      = 9;
	var bFontBold      = false;
    var bFontItalic    = false;
	var bFontUnderLine = false;
			
	for(var nArr = 0; nArr < arrCompoList.length; nArr++)    //전체 컴포넌트 분류하기 위한 for문
	{
		var strUniqueID = "";
		nObjectkind = arrCompoList[nArr].getobjectkind();
		if(nObjectkind == XFD_OBJKIND_CONTROL) //object가 control류 일때..
		{
			nControlkind = arrCompoList[nArr].getcontrolkind();

			if (nControlkind == XFD_CTRLKIND_TABLEVIEW) continue;

			nFontSize      = arrCompoList[nArr].getfontsize();
			bFontBold      = arrCompoList[nArr].getfontbold();
            bFontItalic    = arrCompoList[nArr].getfontitalic();
			bFontUnderLine = arrCompoList[nArr].getfontunderline();
			
			// grid분류 (grid/multilinegrid/treegrid)
			 if((nControlkind == XFD_CTRLKIND_GRID) || (nControlkind == XFD_CTRLKIND_MULTILINEGRID) || (nControlkind == XFD_CTRLKIND_TREEGRID))
			{
				for(var nCol =0; nCol < arrCompoList[nArr].getcolumncount(); nCol++)
				{
					for(var nHeader = 0; nHeader < arrCompoList[nArr].gethorzheadercount(); nHeader++)
					{
						strUniqueID  = arrCompoList[nArr].getheadermetaid(nHeader, nCol);
						
						//화면에 존재하는 그리드의 헤더 텍스트와 만들어져있는 array의 텍스가 같은게 있다면..
						if( !UT.isNull(UT.gfnGetMetaData(strUniqueID,"")))
						{
							arrCompoList[nArr].setheadertext(nHeader, nCol, UT.gfnGetMetaData(strUniqueID,""));
						}
					}   // end for(nHeader)
				}   // end for(nCol)
				
				if(nControlkind == XFD_CTRLKIND_GRID) {
					// 2012/05/02, softbase, 통계행 다국어 텍스트 처리
					for (var nStatRow = 0; nStatRow < arrCompoList[nArr].getstatrowcount(); nStatRow++)
					{
						strUniqueID  = arrCompoList[nArr].getstatrowmetaid(nStatRow);
							 
						//화면에 존재하는 그리드의 헤더 텍스트와 만들어져있는 array의 텍스가 같은게 있다면..
						if( !UT.isNull(UT.gfnGetMetaData(strUniqueID,"")))
						{
							arrCompoList[nArr].setstatrowtitle(nStatRow, UT.gfnGetMetaData(strUniqueID,""));
						}							
					}
				}
			}   // end if(grid)
	
			// radio/check분류
			else if((nControlkind == XFD_CTRLKIND_RADIOBUTTON) || (nControlkind == XFD_CTRLKIND_CHECKBOX))
			{
				strUniqueID = arrCompoList[nArr].getmetaid();
				if(strUniqueID !== "" && !UT.isNull(UT.gfnGetMetaData(strUniqueID,"")))
				{
					arrCompoList[nArr].setcaption(UT.gfnGetMetaData(strUniqueID,""));
				}
			}
			else if(nControlkind == XFD_CTRLKIND_TAB)
			{
				var nItemCnt = arrCompoList[nArr].gettabitemcount();
				for(var nTabIdx = 0 ; nTabIdx < nItemCnt ; nTabIdx++ )
				{
					strUniqueID = arrCompoList[nArr].gettabitemmetaid (nTabIdx);
					if(strUniqueID !== "" && !UT.isNull(UT.gfnGetMetaData(strUniqueID,"")))
					{
						arrCompoList[nArr].settabitemtext(nTabIdx, UT.gfnGetMetaData(strUniqueID,""));
					}
				}
			}
			else if(nControlkind == XFD_CTRLKIND_TABLE)
			{
				var nCellCount = arrCompoList[nArr].getcellcount();
				var strCellID  = "";
				for(var nCellIdx = 0 ; nCellIdx < nCellCount ; nCellIdx++)
				{
					strCellID  = arrCompoList[nArr].getcellid(nCellIdx);
					strUniqueID = arrCompoList[nArr].getcellmetaid(strCellID);
					if(strCellID !== "" && !UT.isNull(UT.gfnGetMetaData(strUniqueID,"")))
					{
						arrCompoList[nArr].setcelltext(strCellID, UT.gfnGetMetaData(strUniqueID,""));
					}
				}
			}
			else if(nControlkind == XFD_CTRLKIND_PUSHBUTTON)
			{
				strUniqueID = arrCompoList[nArr].getmetaid();			
				if(strUniqueID !== "" && !UT.isNull(UT.gfnGetMetaData(strUniqueID,"")))
				{
					//arrCompoList[nArr].settext("      " + UT.gfnGetMetaData(strUniqueID,""));
					arrCompoList[nArr].settext(UT.gfnGetMetaData(strUniqueID,""));
				}			                     
			}
			else if(nControlkind == XFD_CTRLKIND_HYPERTEXT)
			{
				strUniqueID = arrCompoList[nArr].getmetaid();

				if(strUniqueID !== "" && !UT.isNull(UT.gfnGetMetaData(strUniqueID,"")))
				{
					arrCompoList[nArr].settext(UT.gfnGetMetaData(strUniqueID,""));
				}
			}
//			else // 그외 control
//			{
//				continue;
//			}	 
							
		}   // end if(control)
		else if(nObjectkind == XFD_OBJKIND_SHAPE) //object가 shape류 일때..
		{
			nControlkind = arrCompoList[nArr].getshapekind();
	
			// caption분류
			if(nControlkind == XFD_SHAPEKIND_CAPTION)
			{
				strUniqueID = arrCompoList[nArr].getmetaid();
				if(strUniqueID !== "" && !UT.isNull(UT.gfnGetMetaData(strUniqueID,"")))
				{
					arrCompoList[nArr].settext(UT.gfnGetMetaData(strUniqueID,""));
				}
			}
		}   // end else if(shape)
	} // end for(nArr)
} // end func



/*
* 해당 버튼 객체를 기준 객체에서 좌측으로 보이는 기준으로 정렬합니다
* objTarget  		  : (object) 기준객체 객체 
* aryButton  		  : (array) 버튼 객체 배열
* strStandardPosotion  : (string) 기준위치 "L" , "R"
* iFirstTerm 		  : (int) 최초 기준에서 좌로 더 뛰울 치수
*/
function gfnAryButtonRePosition(objTarget , aryButton , strStandardPosotion , iFirstTerm){
	if(UT.isNullObj(objTarget)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnAryButtonRePosition 개발자 오류] 기준 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnAryButtonRePosition 개발자 오류] 기준 객체를 넘겨주세요");
		return;
	}

	if(UT.isNull(iFirstTerm)){
		iFirstTerm = 0;
	}
	
	if(UT.isNull(strStandardPosotion)){
		strStandardPosotion = "R";
	}
	
	var aryButtonObject = [];
	var aryButtonRight = [];
	var aryButtonWidth = [];
	
	var iTargetLeft = 0;
	
	if(strStandardPosotion == "R"){
		iTargetLeft = objTarget.getright() - iFirstTerm;	
	}else if(strStandardPosotion == "L"){
		iTargetLeft = objTarget.getleft() - iFirstTerm;	
	}	
	
	for(var i=0;i<aryButton.length;i++){	//정보 사입
		aryButtonObject[aryButtonObject.length] = aryButton[i];
		aryButtonWidth[aryButtonWidth.length] = aryButton[i].getwidth();		
		aryButtonRight[aryButtonRight.length] = aryButton[i].getright();	
	}	
	
	for(var j=0;j<aryButtonRight.length;j++){	//위치로 버블정렬
		for(var k=1;k<aryButtonRight.length;k++){
			if(aryButtonRight[k-1] < aryButtonRight[k]){
				var iTempRight , objTemp , iTempWidth;
				iTempRight = aryButtonRight[k-1];
				iTempWidth = aryButtonWidth[k-1];
				objTemp = aryButtonObject[k-1];	

				aryButtonRight[k-1] = aryButtonRight[k];
				aryButtonWidth[k-1] = aryButtonWidth[k];
				aryButtonObject[k-1] = aryButtonObject[k];

				aryButtonRight[k] = iTempRight;					
				aryButtonWidth[k] = iTempWidth;
				aryButtonObject[k] = objTemp;
			}
		}
	}
			
	var beForeIndex = -1;
	for(var i=0;i<aryButtonRight.length;i++){	//우측기준으로 정렬된 배열
		var instObj = aryButtonObject[i];
		if(instObj.getvisible()){
			if(beForeIndex == -1){	
				var iL = iTargetLeft - iFirstTerm - aryButtonWidth[i];
				var iR = iTargetLeft - iFirstTerm;
				
				instObj.setrect(iL , instObj.gettop() , iR , instObj.getBottom());
			}else{
				var objBeFore = aryButtonObject[beForeIndex];
				var iL = objBeFore.getleft() - GFV_BUTTON_TERM - aryButtonWidth[i];
				var iR = objBeFore.getleft() - GFV_BUTTON_TERM;
				
				instObj.setrect(iL , instObj.gettop() , iR , instObj.getBottom());
			}
			
			beForeIndex = i;																
		}
	}
}





/*
* 해당 버튼 객체를 기준 객체에서 좌측으로 보이는 기준으로 정렬합니다
* objTarget  		  : (object) 기준객체 객체 
* aryButton  		  : (array) 버튼 객체 배열
* strStandardPosotion  : (string) 기준위치 "L" , "R"
* iFirstTerm 		  : (int) 최초 기준에서 좌로 더 뛰울 치수
*/
function gfnAryButtonReOrderPosition(objTarget , aryButton , strStandardPosotion , iFirstTerm){
	if(UT.isNullObj(objTarget)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnAryButtonReOrderPosition 개발자 오류] 기준 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnAryButtonReOrderPosition 개발자 오류] 기준 객체를 넘겨주세요");
		return;
	}

	if(UT.isNull(iFirstTerm)){
		iFirstTerm = 0;
	}
	
	if(UT.isNull(strStandardPosotion)){
		strStandardPosotion = "R";
	}
	
	var aryButtonObject = [];
	var aryButtonRight = [];
	var aryButtonWidth = [];
	
	var iTargetLeft = 0;
	
	if(strStandardPosotion == "R"){
		iTargetLeft = objTarget.getright() - iFirstTerm;	
	}else if(strStandardPosotion == "L"){
		iTargetLeft = objTarget.getleft() - iFirstTerm;	
	}	
	
	var beForeIndex = aryButton.length;
	for(var i=aryButton.length-1;i>-1;i--){	//정보 사입
		
		var instObj = aryButton[i];

		if(instObj.getvisible()){
			if(beForeIndex == aryButton.length){	
				var iL = iTargetLeft - iFirstTerm - aryButton[i].getwidth();
				var iR = iTargetLeft - iFirstTerm;
				
				instObj.setrect(iL , instObj.gettop() , iR , instObj.getBottom());
			}else{
				var objBeFore = aryButton[beForeIndex];
				var iL = objBeFore.getleft() - GFV_BUTTON_TERM - aryButton[i].getwidth();
				var iR = objBeFore.getleft() - GFV_BUTTON_TERM;
				
				instObj.setrect(iL , instObj.gettop() , iR , instObj.getBottom());
			}
			
			beForeIndex = i;																
		}	
	}		
}


/*
* 스크린 공통 키다운 이벤트 처리
* objScreen  		  : (object) 스크린 객체
* keycode  		    : (int) 키값
* bctrldown  		  : (boolean) 컨트롤 눌림여부
* bshiftdown 		  : (boolean) 쉬프트 눌림여부
* baltdown 		    : (boolean) 알트 눌림여부
* bnumpadkey 		  : (boolean) 키패드 인지의 여부
*/
function gfnScreenCommonOnKeyEvent(objScreen , keycode, bctrldown, bshiftdown, baltdown, bnumpadkey){		
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnScreenCommonOnKeyEvent 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnScreenCommonOnKeyEvent 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var iSameKeyCodeIndex = -1;
	var screenMember = objScreen.getmembers(XFD_JAVASCRIPT);
	
	if(bctrldown && keycode != 17){	//컨트롤키가 눌렸으면
		for(var i=0;i<aryKeyCode.length;i++){
			if(keycode == aryKeyCode[i][1]){
				iSameKeyCodeIndex = i;
				break;
			}
		}

		if(iSameKeyCodeIndex > -1){
			// 화면의 그리드에 입력을 하던중이면 변경 내용이 전송되지 않기때문에 입력완료 상태로 만들어 준다.
			var aryInst = objScreen.getinstanceall(1);
			for (var i = 0; i < aryInst.length; i ++)
			{
				var instObj = aryInst[i];
				if ( instObj.getcontrolkind() == XFD_CTRLKIND_GRID
					|| instObj.getcontrolkind() == XFD_CTRLKIND_TREEGRID
					|| instObj.getcontrolkind() == XFD_CTRLKIND_MULTILINEGRID )
				{
					instObj.editcomplete();
				}
			}
			
			var objTabTopCommon = UT.gfnGetObjectByName(objScreen , GFV_TAB_TOP_COMMON_NAME);
			
			if(!UT.isNullObj(objTabTopCommon)){
				var aryTabCtrlObjs = UT.gfnGetTabChildCtrlIdAry(objTabTopCommon , 0);	//하위 탭의 컨트롤 아이디들을 가져옵니다			
				
				for(var i=0;i<aryTabCtrlObjs.length;i++){		
					var instObj = objTabTopCommon.getchildinstance(0 , aryTabCtrlObjs[i]);
					
					if(UT.isNullObj(instObj)){
						continue;
					}								
	
					if(XFD_CTRLKIND_PUSHBUTTON == instObj.getcontrolkind() && aryKeyCode[iSameKeyCodeIndex][2] == instObj.getname()){
						if(objScreen.findscriptmethod(XFD_JAVASCRIPT, aryKeyCode[iSameKeyCodeIndex][3])){
							eval("screenMember." + aryKeyCode[iSameKeyCodeIndex][3])(instObj);
							return;
						}
					}else if(GFV_TAB_TOP_IN_TAB_END_POINT_NAME == instObj.getname()){	//탑 닫기버튼 Tab 
						var objCloseScreen = instObj.getchildscreeninstance(0);
						var objCloseButton = UT.gfnGetObjectByName(objCloseScreen , GFV_TAB_TOP_COMMON_CLOSE_NAME);
	
						if(aryKeyCode[iSameKeyCodeIndex][2] == objCloseButton.getname()){
							if(objCloseScreen.findscriptmethod(XFD_JAVASCRIPT, aryKeyCode[iSameKeyCodeIndex][3])){
								var closeMember = objCloseScreen.getmembers(XFD_JAVASCRIPT);
								eval("closeMember." + aryKeyCode[iSameKeyCodeIndex][3])(objCloseButton);
								return;
							}
						}
					}
				}
			}

			//공통 추가 삭제가 실행이 안되었으면 (탭스크린 또는 팝업에서 찾음)
			var objScreenInButton = UT.gfnGetObjectByName(objScreen , aryEtcKeyCode[iSameKeyCodeIndex][2]);	

			if(!UT.isNullObj(objScreenInButton) && objScreenInButton.getvisible() && objScreenInButton.getenable()){
				if(XFD_CTRLKIND_PUSHBUTTON == objScreenInButton.getcontrolkind()){
					if(objScreen.findscriptmethod(XFD_JAVASCRIPT, aryEtcKeyCode[iSameKeyCodeIndex][3])){								
						eval("screenMember." + aryEtcKeyCode[iSameKeyCodeIndex][3])(objScreenInButton);
						return;
					}
				}
			}

			if(iSameKeyCodeIndex <2){	//행추가 행삭제일경우
				var objButton = UT.gfnGetObjectByName(objScreen , aryRowKeyCode[iSameKeyCodeIndex][2]);	

				if(!UT.isNullObj(objButton) && objButton.getvisible() && objButton.getenable()){									
					if(XFD_CTRLKIND_PUSHBUTTON == objButton.getcontrolkind()){
						if(objScreen.findscriptmethod(XFD_JAVASCRIPT, aryRowKeyCode[iSameKeyCodeIndex][3])){								
							eval("screenMember." + aryRowKeyCode[iSameKeyCodeIndex][3])(objButton);
							return;
						}
					}	
				}
				
				objButton = UT.gfnGetObjectByName(objScreen , aryEtcRowKeyCode[iSameKeyCodeIndex][2]);	

				if(!UT.isNullObj(objButton) && objButton.getvisible() && objButton.getenable()){									
					if(XFD_CTRLKIND_PUSHBUTTON == objButton.getcontrolkind()){
						if(objScreen.findscriptmethod(XFD_JAVASCRIPT, aryEtcRowKeyCode[iSameKeyCodeIndex][3])){								
							eval("screenMember." + aryEtcRowKeyCode[iSameKeyCodeIndex][3])(objButton);
							return;
						}
					}	
				}
			}
		}
	}
}



/*
* 팝업 스크린 공통 키다운 이벤트 처리
* objScreen  		  : (object) 스크린 객체
* keycode  		    : (int) 키값
* bctrldown  		  : (boolean) 컨트롤 눌림여부
* bshiftdown 		  : (boolean) 쉬프트 눌림여부
* baltdown 		    : (boolean) 알트 눌림여부
* bnumpadkey 		  : (boolean) 키패드 인지의 여부
*/
function gfnPopScreenCommonOnKeyEvent(objScreen , keycode, bctrldown, bshiftdown, baltdown, bnumpadkey){		
	if(!UT.isScreen(objScreen)){	
		//UT.alert(CCNConst.WIN_MAIN_SCREEN , "" , "[gfnScreenCommonOnKeyEvent 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnScreenCommonOnKeyEvent 개발자 오류] screen 객체를 넘겨주세요");
		return;
	}
	
	var iSameKeyCodeIndex = -1;
	var screenMember = objScreen.getmembers(XFD_JAVASCRIPT);
	
	if(bctrldown && keycode != 17){	//컨트롤키가 눌렸으면
		for(var i=0;i<aryEtcKeyCode.length;i++){
			if(keycode == aryEtcKeyCode[i][1]){
				iSameKeyCodeIndex = i;
				break;
			}
		}
		
		if(iSameKeyCodeIndex > -1){			
			var objButton = UT.gfnGetObjectByName(objScreen , aryEtcKeyCode[iSameKeyCodeIndex][2]);	//하위 탭의 컨트롤 아이디들을 가져옵니다
			
			if(UT.isNullObj(objButton)){
				return;
			}
			
			if(iSameKeyCodeIndex <2 && (!objButton.getvisible() || !objButton.getenable())){	//공통 추가 삭제가 사용안함이면
				var objRowButton = UT.gfnGetObjectByName(objScreen , aryRowKeyCode[iSameKeyCodeIndex][2]);	//하위 탭의 컨트롤 아이디들을 가져옵니다
		
				if(UT.isNullObj(objRowButton) || !objRowButton.getvisible() || !objRowButton.getenable()){
					return;
				}
						
				if(XFD_CTRLKIND_PUSHBUTTON == objButton.getcontrolkind()){
					if(objScreen.findscriptmethod(XFD_JAVASCRIPT, aryRowKeyCode[iSameKeyCodeIndex][3])){
						eval("screenMember." + aryRowKeyCode[iSameKeyCodeIndex][3])(objRowButton);
						return;
					}
				}					
			}else{					
				if(XFD_CTRLKIND_PUSHBUTTON == objButton.getcontrolkind()){//행추가면
					if(objScreen.findscriptmethod(XFD_JAVASCRIPT, aryEtcKeyCode[iSameKeyCodeIndex][3])){
						eval("screenMember." + aryEtcKeyCode[iSameKeyCodeIndex][3])(instObj);
						return;
					}
				}
			}
		}
	}
}


function gfnCommonButtonAddToolTip(objScreen){
	var objTabTopCommon = UT.gfnGetObjectByName(objScreen , GFV_TAB_TOP_COMMON_NAME);
			
	if(!UT.isNullObj(objTabTopCommon)){	//공통버튼 툴팁 삽입
		var aryTabCtrlObjs = UT.gfnGetTabChildCtrlIdAry(objTabTopCommon , 0);	//하위 탭의 컨트롤 아이디들을 가져옵니다			
		
		for(var i=0;i<aryTabCtrlObjs.length;i++){		
			var instObj = objTabTopCommon.getchildinstance(0 , aryTabCtrlObjs[i]);
			
			if(UT.isNullObj(instObj)){
				continue;
			}								
			
			for(var j=0;j<aryKeyCode.length;j++){
				if(aryKeyCode[j][2] != GFV_TAB_TOP_COMMON_CLOSE_NAME && aryKeyCode[j][2] == instObj.getname()){
					var objBtn = UT.gfnGetObjectByName(objScreen , aryKeyCode[j][2]);
					
					if(!UT.isNullObj(objBtn)){
						objBtn.settooltiptext(objBtn.gettooltiptext() + aryKeyCode[j][0]);
					}
					
					break;
				}else if(aryKeyCode[j][2] == GFV_TAB_TOP_COMMON_CLOSE_NAME && GFV_TAB_TOP_IN_TAB_END_POINT_NAME == instObj.getname()){
					
					var objCloseScreen = instObj.getchildscreeninstance(1);
					//var objCloseScreen = SYSVar.PAGE_TOP_END_SCREEN;
					if(factory.isobject(objCloseScreen) == false) {
				        var objCloseScreen1 = instObj.getchildscreeninstance(0);
				 	   if(factory.isobject(objCloseScreen) == false) {
							return "";
				   	 }
				    }

					var objCloseButton = UT.gfnGetObjectByName(objCloseScreen , GFV_TAB_TOP_COMMON_CLOSE_NAME);
					
					if(!UT.isNullObj(objCloseButton)){
						objCloseButton.settooltiptext(objCloseButton.gettooltiptext() + aryKeyCode[j][0]);
					}
				}			
			}			
		}
	}

	for(var j=0;j<aryEtcKeyCode.length;j++){
		var objBtn = UT.gfnGetObjectByName(objScreen , aryEtcKeyCode[j][2]);
					
		if(!UT.isNullObj(objBtn)){
			objBtn.settooltiptext(objBtn.gettooltiptext() + aryEtcKeyCode[j][0]);
		}
	}
	
	for(var j=0;j<aryRowKeyCode.length;j++){
		var objBtn = UT.gfnGetObjectByName(objScreen , aryRowKeyCode[j][2]);
					
		if(!UT.isNullObj(objBtn)){
			objBtn.settooltiptext(objBtn.gettooltiptext() + aryRowKeyCode[j][0]);
		}
	}
	
	for(var j=0;j<aryEtcRowKeyCode.length;j++){
		var objBtn = UT.gfnGetObjectByName(objScreen , aryEtcRowKeyCode[j][2]);
					
		if(!UT.isNullObj(objBtn)){
			objBtn.settooltiptext(objBtn.gettooltiptext() + aryEtcRowKeyCode[j][0]);
		}
	}
}

/*
* MDI 페이지 공통 닫기 버튼용
*/
function gfnMdiTabClose() {
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	var nFocusIdx = SYSVar.SELECTED_MIDDLE_TAB.gettabitemfocus();
	SYSVar.SELECTED_MIDDLE_TAB.deletetab(nFocusIdx);
}