/****************************************************************************/
// 포틀릿 프레임 타입
var PORTLET_FRAME = 0;
// 컨테이너 프레임 타입
var CONTAINER_FRAME = 1;
// 일반화면 프레임 타입
var SCREEN_FRAME = 2;
/*
 * 현재 Frame 종류를 리턴한다.
 * @return {string} Frame 종류
 */
var _BizCommonBtnJsLoaded = false;

function _getFrameType() {
	return "MODULE";
}

/*
 * 화면 최초 로드시에
 */
function screen_on_load()
{
	SYSVar.MODULE_MEMBER = this;
	//this.setLibModule();
}

var m_BizCode         = ["BIZ"];

/**
 * 컴포넌트 여부를 확인한다
 * @param objCtrl 컴포넌트
 * @return true, false
 */
function isObjCtrl(objCtrl)
{
	try {
		if(factory.isobject(objCtrl) == true && objCtrl.getobjectkind() == XFD_OBJKIND_CONTROL && objCtrl.isexpired() == false) {
			return true;	
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (isObjCtrl) Error :" + e.message);
	}
	return false;
}

/**
 * 컴포넌트 여부를 확인한다
 * @param objCtrl 컴포넌트
 * @param nControlKind 컴포넌트 종류
 * @return true, false
 */
function isObjCtrlEx(objCtrl, nControlKind)
{
	try {
		if(factory.isobject(objCtrl) == true && objCtrl.getobjectkind() == XFD_OBJKIND_CONTROL && objCtrl.getcontrolkind() == nControlKind && objCtrl.isexpired() == false) {
			return true;	
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (isObjCtrlEx) Error :" + e.message);
	}
	return false;
}

/**
 * 도형 여부를 확인 한다.
 * @param objShape 도형 컴포넌트
 * @return true, false
 */
function isObjShape(objShape)
{
	try {
		if(factory.isobject(objShape) == true && objShape.getobjectkind() == XFD_OBJKIND_SHAPE && objShape.isexpired() == false) {
			return true;
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (isObjShape) Error :" + e.message);
	}
	return false;
}

/**
 * 화면에 스크립트 메서드가 있는지 확인한다.
 * @param objScreen 확인 하고자 하는 화면
 * @param strScriptMethod 스크립트 메서드
 * @return true, false
 */
function isScriptMethod(objScreen, strScriptMethod)
{
	try {
		if(this.isScrObject(objScreen) == true) {
			return objScreen.findscriptmethod(XFD_JAVASCRIPT, strScriptMethod);
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (isScriptMethod) Error :" + e.message);
	}
	return false;
}

/**
 * 화면 오브젝트인지 검증한다.
 * @param objScreen 업무화면 오브젝트
 * @return true, false
 */
function isScrObject(objScreen)
{
	try {
		if(factory.isobject(objScreen) == true && objScreen.getobjectkind() == XFD_OBJKIND_SCREEN) {
			return true;
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (isScrObject) Error :" + e.message);
	}
	return false;
}

/**
 * 화면 오브젝트인지 검증한다.
 * @param objScreen 업무화면 오브젝트
 * @return true, false
 */
function isPortletObject(objScreen)
{
	try {
		if(factory.isobject(objScreen) == true && objScreen.getobjectkind() == XFD_OBJKIND_SCREEN && objScreen.getscreentype() == 1) {
			return true;
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (isPortletObject) Error :" + e.message);
	}
	return false;
}


/**
 * 화면에 이벤트처리 함수가 링크되어 있는지 확인 한다.
 * @param objScreen 업무화면 오브젝트
 * @param strEventName 이벤트명
 * @return true, false
 */
function isScrEventHandler(objScreen, strEventName)
{
	var strRetData = "";
	try {
		if(this.isScrObject(objScreen) == true) {
			strRetData = objScreen.geteventhandler(strEventName);
			if(strRetData == "") {
				return false;
			}
			return true;
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (isScrEventHandler) Error :" + e.message);		
	}		
	return false;
}

/**
 * 컴포넌트에 이벤트처리 함수가 링크되어 있는지 확인 한다.
 * @param objScreen 업무화면 오브젝트
 * @param strEventName 이벤트명
 * @return true, false
 */
function isCtrlEventHandler(objCtrl, strEventName)
{
	var strRetData = "";
	try {
		if(this.isObjCtrl(objCtrl) == true) {
			strRetData = objCtrl.geteventhandler(strEventName);
			if(strRetData == "") {
				return false;
			}
			return true;
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (isCtrlEventHandler) Error :" + e.message);	
	}		
	return false;
}

/**
 * 화면내 패널에 속한 오브젝트를 CLEAR한다.
 * @param objBizScreen 부모화면 인스턴스 업무 화면 오브젝트
 * @param objPanel 패널 오브젝트
 * @return 없음
 */
function clearPanel(objBizScreen, objPanel)
{
	if(this.isObjCtrlEx(objPanel, XFD_CTRLKIND_PANEL) == false || objPanel.getparentscrinstance() != objBizScreen) {
		return;
	}
	
	var componentTarget = null;
	var objCnt          = 0;
	var objFirst        = null;
	var objCtrl         = null;
	var nCtrlIdx        = 0;
	var objtype         = -1;
	var scrTabCnt, TabSCR;
	
	try {
		componentTarget = objPanel;
		objCnt          = componentTarget.getchildcontrolcount();
		objFirst        = componentTarget.getinstancefirst();
		objCtrl         = objFirst;
		nCtrlIdx        = 0;
		objtype         = -1;
	
		do {
			try {
				// 오브젝트의 타입을 구한다.
				objtype = objCtrl.getcontrolkind();
			} catch(EXCP) {
				nCtrlIdx++;
				objCtrl = componentTarget.getinstancenext(objCtrl);
				continue;
			}
			switch(objtype)
			{
				case XFD_CTRLKIND_FIELD :
					objCtrl.settextex("", false, false);
					break;
				case XFD_CTRLKIND_MULTILINE :
					objCtrl.settext("");
					break;
				case XFD_CTRLKIND_GRID :
					objCtrl.deleteall();
					break;
				case XFD_CTRLKIND_MULTILINEGRID :
					objCtrl.deleteallrows();
					break;
				case XFD_CTRLKIND_CHECKBOX :
					objCtrl.setcheck(false);
					break;
				case XFD_CTRLKIND_RADIOBUTTON :
					objCtrl.setcheck(false);
					break;
				case XFD_CTRLKIND_COMBOBOX :
					objCtrl.settext("");
					break;
				case XFD_CTRLKIND_PANEL : 
					this.clearPanel(objBizScreen, objCtrl);
					break;
				case XFD_CTRLKIND_TAB :
					this.clearAllTabObjectData(objBizScreen, objCtrl);
					break;
				default:
					break;
			}
			// 다음번째 오브젝트를 구한다.
			objCtrl = componentTarget.getinstancenext(objCtrl);
			nCtrlIdx++;
		} while(nCtrlIdx < objCnt && objCtrl != objFirst);
	
	} catch(e) {
		console.log("[SYS_CORE_Module] (clearPanel) Error :" + e.message);
	}
}


/**
 * 전체 탭 아이템의 링크된 화면 및 패널내의 오브젝트 데이터를 CLEAR 한다.
 * @param objBizScreen 업무 화면 오브젝트
 * @param objTab 탭 오브젝트
 * @return 없음
 */
function clearAllTabObjectData(objBizScreen, objTab)
{
	try {
		for(var nTabItem = 0; nTabItem < objTab.gettabitemcount(); nTabItem++) {
			this.clearTabObjectData(objBizScreen, objTab, nTabItem);
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (clearAllTabObjectData) Error :" + e.message);
	}
}


/**
 * 선택된 탭 아이템의 링크된 화면 및 패널내의 오브젝트 데이터를 CLEAR 한다.
 * @param objBizScreen 업무 화면 오브젝트
 * @param objTab 탭 오브젝트
 * @param nTabItem 탭아이템 인덱스
 * @return 없음
 */
function clearTabObjectData(objBizScreen, objTab, nTabItem)
{
	var objFirst  = objTab.getchildinstancefirst(nTabItem);
	var objCnt    = objTab.getchildcontrolcount(nTabItem);
	var objCtrl   = objFirst;
	var nCtrlIdx  = 0;
	var objtype   = -1;
	var objParent = null;
	
	if(this.isObjCtrlEx(objTab, XFD_CTRLKIND_TAB) == false) {
		return;
	}
	try {
		do {
			try {
				// 오브젝트의 타입을 구한다.
				objtype = objCtrl.getcontrolkind();
			} catch(EXCP) {
				nCtrlIdx++;
				objCtrl = objTab.getchildinstancenext(nTabItem, objCtrl);
				continue;
			}
			switch(objtype)
			{
				case XFD_CTRLKIND_FIELD :
					objCtrl.settextex("", false, false);
					break;
				case XFD_CTRLKIND_MULTILINE :
					objCtrl.settext("");
					break;
				case XFD_CTRLKIND_GRID :
					objCtrl.deleteall();
					break;
				case XFD_CTRLKIND_MULTILINEGRID :
					objCtrl.deleteallrows();
					break;
				case XFD_CTRLKIND_CHECKBOX :
					objCtrl.setcheck(false);
					break;
				case XFD_CTRLKIND_RADIOBUTTON :
					objCtrl.setcheck(false);
					break;
				case XFD_CTRLKIND_COMBOBOX :
					objCtrl.settext("");
					break;
				case XFD_CTRLKIND_PANEL :
					objParent = objCtrl.getparentscrinstance();
					if(objParent.getobjectkind() == XFD_OBJKIND_SCREEN) {
						this.clearPanel(objParent, objCtrl);
					}
					break;	
				case XFD_CTRLKIND_TAB :
					objParent = objCtrl.getparentscrinstance();
					this.clearAllTabObjectData(objParent, objCtrl);
					break;
				default:
					break;
			}
			// 다음번째 오브젝트를 구한다.
			objCtrl = objTab.getchildinstancenext(nTabItem, objCtrl);
			nCtrlIdx++;
		} while(nCtrlIdx < objCnt && objCtrl != objFirst);
	} catch(e) {
		console.log("[SYS_CORE_Module] (clearTabObjectData) Error :" + e.message);
	}	
	return true;
}


/**
 * 오브젝트의 데이터를 CLEAR 한다.
 * @param objBizScreen 부모화면 인스턴스 업무 화면 오브젝트
 * @param objCtrl 오브젝트
 * @return 없음
 */
function clearObjectData(objBizScreen, objArguments)
{
	var arrArgs = new Array();
	var nType   = 0;
	try  {
		for(var nIdx = 1; nIdx < objArguments.length; nIdx++) {
			try {
				// 오브젝트의 타입을 구한다.
				objtype = objArguments[nIdx].getcontrolkind();
			} catch(EXCP) {
				continue;
			}
			switch(objtype)
			{
				case XFD_CTRLKIND_FIELD :
					objArguments[nIdx].settextex("", false, false);
					break;
				case XFD_CTRLKIND_MULTILINE :
					objArguments[nIdx].settext("");
					break;
				// 20170923 PJS 그리드와 멀티라인그리드 분리처리
				case XFD_CTRLKIND_GRID :
					objArguments[nIdx].deleteall();
					break;
				case XFD_CTRLKIND_MULTILINEGRID :
					objArguments[nIdx].deleteallrows();
					break;
				case XFD_CTRLKIND_CHECKBOX :
					objArguments[nIdx].setcheck(false);
					break;
				case XFD_CTRLKIND_RADIOBUTTON :
					objArguments[nIdx].setcheck(false);
					break;
				case XFD_CTRLKIND_COMBOBOX :
					objArguments[nIdx].settext("");
					break;
				default:
					break;
			}
		}
	} catch(e) {
		console.log("[SYS_CORE_Module] (clearObjectData) Error :" + e.message);
	}
}

/**
 * 패널에 속한 모든 항목에 대하여 Enable 처리
 * @param panel_name 패널명 
 * @param screen 해당 화면
 * @param type_name 특정 타입의 컨포넌트만 enable하고 싶은 경우 (Option)
 * @return 없음
 */
function enableAll(objBizScreen, panel_name, type_name)
{
	var components = this.getallcomponent(objBizScreen, panel_name);
	var size       = components.length;
	var styleid    = "";
	
	for (var i = 0; i < size; i++) {
		components[i].setenable(true);
	}
}

/**
 * 패널에 속한 모든 항목에 대하여 Disable 처리
 * @param panel_name 패널명 
 * @param screen 해당 화면
 * @param type_name 특정 타입의 컨포넌트만 Disable 하고 싶은 경우 (Option)
 * @return 없음
 */
function disableAll(objBizScreen, panel_name, type_name)
{
	var components = this.getallcomponent(objBizScreen, panel_name);
	var size       = components.length;
	var styleid    = "";
	for (var i = 0; i < size; i++) {
		components[i].setenable(false);
	}
}


/**
 * 패널안의 컨트롤들을 탭오더 기준으로 Array에 저장 후 반환
 * @param panel_name 패널명 
 * @param screen 해당 화면
 * @return arrControls 패널 안의 컴포넌트 리스트
 */
function getallcomponent(objBizScreen, panel_name)
{
	var panel       = objBizScreen.getinstancebyname(panel_name);
	var arrControls = new Array();
	
	// 1. 패널의 첫 컴포넌트 조회
	var instFirst = panel.getinstancefirstex(0);
	
	// 2. 패널 내부의 컴포넌트가 없는 경우 빈 배열 반환
	if(factory.isobject(instFirst) == false) {
		return arrControls;
	}
	
	// 3. 다음 컴포넌트 조회 후 Object가 맞는 경우 Array에 추가
//	do {
	arrControls.push(instFirst);
	instFirst = panel.getinstancenextex(instFirst, 0);
//	}
	while(factory.isobject(instFirst)) {
		if(instFirst != null) {
			arrControls.push(instFirst);
			instFirst = panel.getinstancenextex(instFirst, 0);
		}
	}
	return arrControls;
}

/**
 * 파라메터로 받은 컨트롤에 대해 enable 또는 disable 시킨다.
 * @param {screen}  objScreen 화면 
 * @param {Boolean} bEnable   enable여부 true, false
 * @param {array}   arrCtrls  enable 또는 disable 시킬 컨트롤오브젝트들
 * @return 없음
 */
function setEnable(objScreen, bEnable, arrCtrls)
{
	for(var i = 0; i < arrCtrls.length; i++) {
		if(this.isObjCtrl(arrCtrls[i]) == true) {
			arrCtrls[i].setenable(bEnable);
		}
	}
}

/**
 * 파라메터로 받은 컨트롤에 대해 보이기 또는 숨기기한다.
 * @param objScreen 화면 
 * @param arrCtrls   visible 시킬 컨트롤오브젝트
 * @param bShow  	visible 여부 true, false
 * @return 없음
 */
function setVisibleCtrls(objBizscreen, arrCtrls, bShow)
{
	for(var nIdx = 0; nIdx < arrCtrls.length; nIdx++) {
		if(factory.isobject(arrCtrls[nIdx]) == true) {
			arrCtrls[nIdx].setvisible(bShow);
		}
	}
}


/**
 * 메뉴형식으로 화면을 호출시 위치 변경
 * @param objMenuDlg 메뉴 화면 오브젝트
 * @param arrBtnLoadMenuRect 메뉴 호출시 버튼 정보
 * @param nDirect 호출될 방향
 * @param OBJ_SCREEN 메뉴화면 정보
 */
function setReposition(objMenuDlg, objButton, nDirect)//, OBJ_SCREEN) {
{
	var nMenuWidth     = 0;
	var nMenuHeight    = 0;
	var nMenuLeft      = 0;
	var nMenuTop       = 0;
	var nMenuRight     = 0;
	var nMenuBottom    = 0;
	var nMenuBtnLeft   = 0;
	var nMenuBtnTop    = 0;
	var nMenuBtnRight  = 0;
	var nMenuBtnBottom = 0;

	var nLeftMonitorLeft   = 0;
	var nLeftMonitorBottom = 0;
	var nMonitorCount      = 0;
	var nScreenLeft        = 0;
	var nScreenRight       = 0;
	var nScreenTop         = 0;
	var nScreenBottom      = 0;
	var arrBtnLoadMenuRect = [];
	
	
	try {
		//load된 메뉴를 찾아서 화면 사이즈로 조정한다.
		if(this.isScrObject(objMenuDlg) == true) {
			arrBtnLoadMenuRect = objButton.getrect();
			
			nMenuWidth      = objMenuDlg.getscreenwidth();
			nMenuHeight     = objMenuDlg.getscreenheight();
			nMenuBtnLeft    = arrBtnLoadMenuRect[0];
			nMenuBtnTop     = arrBtnLoadMenuRect[1];
			nMenuBtnRight   = arrBtnLoadMenuRect[2];
			nMenuBtnBottom  = arrBtnLoadMenuRect[3];
			
//			console.log("[Module](setReposition) nMenuBtnLeft  :" + nMenuBtnLeft);			
//			console.log("[Module](setReposition) nMenuBtnTop   :" + nMenuBtnTop);			
//			console.log("[Module](setReposition) nMenuBtnRight :" + nMenuBtnRight);			
//			console.log("[Module](setReposition) nMenuBtnBottom:" + nMenuBtnBottom);			
			
			
			
//			if(this.isScrObject(OBJ_SCREEN) == true) {
//				nMenuWidth  = OBJ_SCREEN.WIDTH;
//				nMenuHeight = OBJ_SCREEN.HEIGHT;
//			}
			
			// 메뉴화면의 위치
			if(nDirect == 0) {	//= 버튼 우측 하단 기준
				nMenuLeft   = nMenuBtnRight - nMenuWidth;
				nMenuTop    = nMenuBtnBottom;
				nMenuRight  = nMenuLeft + nMenuWidth;
				nMenuBottom = nMenuTop  + nMenuHeight;
			} else if(nDirect == 1) {	//= 버튼 좌측 하단 기준
				nMenuLeft   = nMenuBtnLeft;
				nMenuTop    = nMenuBtnBottom;
				nMenuRight  = nMenuLeft + nMenuWidth;
				nMenuBottom = nMenuTop  + nMenuHeight;
			} else if(nDirect == 3) {	//= 버튼 우측 상단 기준
				nMenuLeft   = nMenuBtnRight;
				nMenuTop    = nMenuBtnTop;
				nMenuRight  = nMenuLeft + nMenuWidth;
				nMenuBottom = nMenuTop  + nMenuHeight;
			} else if(nDirect == 4) {	//= 버튼 좌측 상단 기준
				nMenuLeft   = nMenuBtnLeft;
				nMenuTop    = nMenuBtnTop;
				nMenuRight  = nMenuLeft + nMenuWidth;
				nMenuBottom = nMenuTop  + nMenuHeight;
			} else {
				nMenuLeft   = nMenuBtnRight;
				nMenuTop    = nMenuBtnTop;
				nMenuRight  = nMenuLeft + nMenuWidth;
				nMenuBottom = nMenuTop  + nMenuHeight;
			}
			
	
			// 듀얼모니터를 쓰는 경우를 고려하여 좌표상 가장 좌측 모니터의 위치를 저장해둔다.
			nMonitorCount = factory.getsysmoniters();
			//console.log("[Module](setReposition) nMonitorCount  :" + nMonitorCount);			
			
			for(var nMonitor = 0; nMonitor < nMonitorCount; nMonitor++) {
				// 현재 모니터의 작업영역을 고려하여 좌표및 크기 정보를 구함.
				nScreenLeft   = factory.getsysmonitorinfo(nMonitor, XFD_SYS_MONITOR_LEFT);
				nScreenRight  = factory.getsysmonitorinfo(nMonitor, XFD_SYS_CXWORKAREA);
				nScreenTop    = factory.getsysmonitorinfo(nMonitor, XFD_SYS_MONITOR_TOP);
				nScreenBottom = factory.getsysmonitorinfo(nMonitor, XFD_SYS_CYWORKAREA);
				nScreenRight  = nScreenLeft + factory.getsysmonitorinfo(nMonitor, XFD_SYS_CXWORKAREA);
				nScreenBottom = nScreenTop  + factory.getsysmonitorinfo(nMonitor, XFD_SYS_CYWORKAREA);
	
				// 듀얼모니터를 쓰는 경우를 고려하여 좌표상 가장 좌측 모니터의 위치를 저장해둔다.
				if(nScreenLeft <= nLeftMonitorLeft) {
					nLeftMonitorLeft   = nScreenLeft;
					nLeftMonitorBottom = nScreenBottom;
				}
	
				// 메뉴화면의 x position이 해당 모니터 사이에 있나?
				// 메뉴화면의 반짤라서 가운데를 비교해야 하지 않나??
				if(nScreenLeft <= nMenuLeft && nMenuLeft < nScreenRight) {
					// 메뉴화면이 해당 모니터의 오른쪽끝을 넘어가나?
					if(nScreenRight < nMenuRight) {
						nMenuLeft = nScreenRight - nMenuWidth;
					}
					// 메뉴화면이 해당 모니터의 아래쪽끝을 넘어가나?
					if(nScreenBottom < nMenuBottom) {
						// 버튼이 화면보다 아래 있는 경우를 고려..
						nMenuTop = (Math.min(nMenuBtnTop, nScreenBottom) - nMenuHeight);
					}
					break;
				}
			}
			// 모니터내에 메뉴화면이 존재 하지 않는다면 가장 좌측 모니터의 왼쪽끝보다 더 왼쪽에 메뉴가 위치한 경우일거다.
			if(nMonitorCount <= nMonitor) {
				// 가장 좌측 모니터의 왼쪽끝보다 메뉴의 위치가 더 왼쪽이라면..(화면상에서 잘림)
				if(nMenuLeft < nLeftMonitorLeft) {
					nMenuLeft = nLeftMonitorLeft;
					// 모니터 아래쪽으로 메뉴화면이 잘리면 보정..
					if(nLeftMonitorBottom < nMenuBottom) {
						nMenuTop = (Math.min(nMenuBtnTop, nScreenBottom) - nMenuHeight);
					}
				}
			}
			objMenuDlg.setmenupos(nMenuLeft, nMenuTop, nMenuWidth, nMenuHeight, true, true, false);
			return true;
		} else {
			console.log("[Module](setReposition) 화면이 아님");
		}
	} catch(e) {
		console.log("[Module](setReposition) Error :" + e.message);
		return false;
	}			
}

/*
 * 업무화면 로드 처리한다.
 * @param {Object} AParentScr 호출하는 부모화면
 * @param {Object} AExtraData 호출할때 넘겨주는 데이터값
 * @param {Number} AFrameType 프레임 형식 0:컨테이너 방식(기본값), 1:일반화면, 2:포틀릿 
 */
function loadScreen(AParentScr, AExtraData, AFrameType)
{
	var nRet = 0;
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	var objFrameInfo = [
						{FrameUrl:"/FRAME/mainFrame",   isPortlet:true },
						{FrameUrl:"/FRAME/mainContainer", isPortlet:false},
						];
	var objInfo = objFrameInfo[AFrameType];
	if (objInfo == undefined) {
		// 범위 외면은 기본값 0번
		objInfo = objFrameInfo[0];
	}
	if (objInfo.isPortlet === true) {
		// 포틀릿 형식으로 로드한다.
		//= 파라미터 bVisible 값은 true 로 주어야 신규 생성된 탭으로 포커스가 이동됨
		nRet = SYSVar.SELECTED_MIDDLE_TAB.addportlettab("", 0, 120, objInfo.FrameUrl, "", true, AExtraData);
	} else {
		// 일반형식으로 로드한다.
		//= 파라미터 bVisible 값은 true 로 주어야 신규 생성된 탭으로 포커스가 이동됨
		nRet = SYSVar.SELECTED_MIDDLE_TAB.addtab("", 0, 120, objInfo.FrameUrl, true, AExtraData);
	}
	
	if(nRet == -1) {
		screen.alert("화면 호출 오류[" + nRet + "]");		
	}
}

/**
 * POPUP 화면을 로드처리한다.
 * @param {Object} AParentScr 호출하는 부모화면
 * @param {Object} AExtraData 호출할때 넘겨주는 데이터값
 * @param {Number} AFrameType 프레임 형식 0:포틀릿 방식(기본값), 1:일반 컨테이너방식 
 */
function loadPopup(AParentScr, AExtraData, AFrameType)
{
	let resize = AExtraData.RESIZE;
	let modal = AExtraData.MODAL;
	if(modal !== false) modal = true;
	if(!resize) resize = false;
	var objFrameInfo = [
						{FrameUrl:"/FRAME/popupFrame", isPortlet:true},
						{FrameUrl:"/FRAME/popupContainer", isPortlet:false}
						];
	var objInfo = objFrameInfo[AFrameType];
	if (objInfo == undefined) {
		// 범위 외면은 기본값 0번
		objInfo = objFrameInfo[0];
	}
	var strPopupName = "POPUP_" + factory.getsystemtime("%h%m%s%ms");
	if (objInfo.isPortlet === true) {
		// 포틀릿 형식으로 로드한다.
		AParentScr.loadportletpopup(strPopupName, objInfo.FrameUrl, "POPUP_PORTLET", true, resize == true? XFD_BORDER_RESIZE : 0, 0 ,0, 0, 0, true, true, false, AExtraData);
	} else {
		// 일반형식으로 로드한다.
		factory.loadpopupex(strPopupName, objInfo.FrameUrl, "POPUP_SCREEN", true, resize == true? XFD_BORDER_RESIZE : 0, 0, 0, 0, 0, true, false, modal== true? true : false, AParentScr, AExtraData);
	}
}

/**
 * 팝업 화면 호출
 * @param {object} objScreen  화면 오브젝트
 * @param {string} strMenuId 호출할 메뉴ID
 * @return 없음
 */
function loadPopupByMenuId(objScreen, strMenuId, objExtdata)
{
	var objExtra_data = {
			SCR_ID     : "",
			SCR_PATH   : "",
			MENU_ID    : "",
			MENU_NM    : "",
			P_MENU_ID  : "",
			PARENT_SCR : null,
			BIZ_EXT    : null
	};
	
// {menu_id: l_MenuId, menu_nm : l_MenuNm, menu_path : l_MenuPath, menu_level: l_MenuLevel, sort_no: l_SortNo, menu_row: iIdx, child: [] }

	var objMenuInfo = SYSVar.MENU_BY_ID[strMenuId];
	objExtra_data.SCR_ID     = "";
	objExtra_data.SCR_PATH   = objMenuInfo.menu_path;
	objExtra_data.MENU_ID    = objMenuInfo.menu_id;
	objExtra_data.MENU_NM    = objMenuInfo.menu_nm;
	objExtra_data.P_MENU_ID  = "";
	objExtra_data.PARENT_SCR = objScreen;
	objExtra_data.EXT_DATA = objExtdata;
	
	this.loadPopup(objScreen, objExtra_data, CONTAINER_FRAME);
}

/**
 * 포틀릿 팝업 화면 호출
 * @param {object} objScreen  화면 오브젝트
 * @param {string} strMenuId 호출할 메뉴ID
 * @return 없음
 */
function loadPortletPopupByMenuId(objScreen, strMenuId, objExtdata)
{
	var objExtra_data = {
			SCR_ID     : "",
			SCR_PATH   : "",
			MENU_ID    : "",
			MENU_NM    : "",
			P_MENU_ID  : "",
			PARENT_SCR : null,
			BIZ_EXT    : null
	};
	
// {menu_id: l_MenuId, menu_nm : l_MenuNm, menu_path : l_MenuPath, menu_level: l_MenuLevel, sort_no: l_SortNo, menu_row: iIdx, child: [] }

	var objMenuInfo = SYSVar.MENU_BY_ID[strMenuId];
	objExtra_data.SCR_ID     = "";
	objExtra_data.SCR_PATH   = objMenuInfo.menu_path;
	objExtra_data.MENU_ID    = objMenuInfo.menu_id;
	objExtra_data.MENU_NM    = objMenuInfo.menu_nm;
	objExtra_data.P_MENU_ID  = "";
	objExtra_data.PARENT_SCR = objScreen;
	objExtra_data.EXT_DATA = objExtdata;
	
	this.loadPopup(objScreen, objExtra_data, PORTLET_FRAME);
}

/**
 * 컨테이너 방식 화면로드하기
 */
/**
 * 화면 호출 화면URL기준으로 호출
 */
function loadScreenByPath(objScreen, strScrUrl, strItemTitle)
{
//	var strFrameUrl = "/SYS/FRAME/mainContainer";
	
	// 화면 정보가 있는지 체크
//	if(strScrUrl) {
//		//= todo 화면 또는 메뉴 정보가 있는지 확인 후 컨테이너 화면 호출
//	}
	
	var objExtra_data = {
			SCR_ID     : "",
			SCR_PATH   : strScrUrl,
			MENU_ID    : "",
			MENU_NM    : strItemTitle,
			P_MENU_ID  : "",
			PARENT_SCR : factory.getmainscrinstance(),
			BIZ_EXT    : null
	};
	this.loadScreen(objScreen, objExtra_data, CONTAINER_FRAME);
}

/**
 * 컨테이너 방식 화면로드하기
 */
/**
 * 화면 호출 화면URL기준으로 호출
 */
function loadScreenByPathMenuId(objScreen, strScrUrl, strMenuId, strItemTitle, iLeftMenuIndex, objExtdt)
{
	UT.GFV_SCREEN_CNT++;
	var iTabIndex = UT.GFV_SCREEN_CNT;
	
	//UT.alert(screen , "" , "iLeftMenuIndex : " + iLeftMenuIndex);
	INI.gfnMdiTabAddScreenDs(strMenuId , iTabIndex , iLeftMenuIndex); //나머지는 오픈후  페이지 공통 INI.init gfnMdiScreenDsSetData 에서 삽입
	
	var strFrameUrl = "/FRAME/mainFrame";
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	
	var objExtra_data = {
			SCR_ID     : "",
			SCR_PATH   : strScrUrl,
			MENU_ID    : strMenuId,
			MENU_NM    : strItemTitle,
			TAB_INDEX  : iTabIndex,
			L_MENU_INX : iLeftMenuIndex,
			PARENT_SCR : factory.getmainscrinstance(),
			BIZ_EXT    : objExtdt
	};
			
	//this.loadScreen(objScreen, objExtra_data, CONTAINER_FRAME);
	//SYSVar.SELECTED_MIDDLE_TAB.addtab("", 0, 120, strFrameUrl, true, objExtra_data);
	SYSVar.SELECTED_MIDDLE_TAB.addportlettab("", 1, 160, strFrameUrl, "", true, objExtra_data);
}

/**
 * 화면 호출
 */
function loadScreenByMenuId(objScreen, strMenuId, objBizExtData)
{
	var strFrameUrl = "/FRAME/mainContainer";
	var objExtra_data = {
			SCR_ID     : "",
			SCR_PATH   : "",
			MENU_ID    : "",
			MENU_NM    : "",
			P_MENU_ID  : "",
			PARENT_SCR : null,
			BIZ_EXT    : null
	};
	
// {menu_id: l_MenuId, menu_nm : l_MenuNm, menu_path : l_MenuPath, menu_level: l_MenuLevel, sort_no: l_SortNo, menu_row: iIdx, child: [] }

	var objMenuInfo = SYSVar.MENU_BY_ID[strMenuId];
	objExtra_data.SCR_ID     = "";
	objExtra_data.SCR_PATH   = objMenuInfo.menu_path;
	objExtra_data.MENU_ID    = objMenuInfo.menu_id;
	objExtra_data.MENU_NM    = objMenuInfo.menu_nm;
	objExtra_data.P_MENU_ID  = "";
	objExtra_data.PARENT_SCR = objScreen;
	objExtra_data.BIZ_EXT    = objBizExtData;
	
	this.loadScreen(objScreen, objExtra_data, CONTAINER_FRAME);
}

// 포틀릿 FRAME 방식 호출하기
/**
 * 화면 호출 화면URL기준으로 호출
 */
function loadPortletByPath(objScreen, strScrUrl, strItemTitle)
{
	var strFrameUrl = "/FRAME/mainFrame";
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	// 화면 정보가 있는지 체크
//	if(strScrUrl) {
//		//= todo 화면 또는 메뉴 정보가 있는지 확인 후 컨테이너 화면 호출
//	}
	var objExtra_data = {
			SCR_ID     : "",
			SCR_PATH   : strScrUrl,
			MENU_ID    : "",
			MENU_NM    : strItemTitle,
			P_MENU_ID  : "",
			PARENT_SCR : factory.getmainscrinstance(),
			BIZ_EXT    : null
	};
	
	SYSVar.SELECTED_MIDDLE_TAB.addportlettab("", 0, 60, strFrameUrl, "", true, objExtra_data);
}

/**
 * 화면 호출 (메뉴ID 기준)
 */
function loadPortletByMenuId(objScreen, strMenuId)
{
	
	var strFrameUrl = "/FRAME/mainFrame";
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	var objExtra_data = {
			SCR_ID     : "",
			SCR_PATH   : "",
			MENU_ID    : "",
			MENU_NM    : "",
			P_MENU_ID  : "",
			PARENT_SCR : null,
			BIZ_EXT    : null
	};
	
// {menu_id: l_MenuId, menu_nm : l_MenuNm, menu_path : l_MenuPath, menu_level: l_MenuLevel, sort_no: l_SortNo, menu_row: iIdx, child: [] }

	var objMenuInfo = SYSVar.MENU_BY_ID[strMenuId];
	objExtra_data.SCR_ID     = "";
	objExtra_data.SCR_PATH   = objMenuInfo.menu_path;
	objExtra_data.MENU_ID    = objMenuInfo.menu_id;
	objExtra_data.MENU_NM    = objMenuInfo.menu_nm;
	objExtra_data.P_MENU_ID  = "";
	objExtra_data.PARENT_SCR = objScreen;
	
//	SYSVar.LEFTMAIN_SCREEN.eventlock(true, true);
	SYSVar.SELECTED_MIDDLE_TAB.addportlettab("", 0, 60, strFrameUrl, "", true, objExtra_data);
//	return SYSVar.SELECTED_MIDDLE_TAB.addportlettab("", 0, 60, strFrameUrl, "", true, objExtra_data);
}

/**
 * 화면을 닫는다.
 * @param {Number} MIDDLE 탭 인덱스(옵션)
 * @return 없음
 */
function unloadScreen(nFocusIdx)
{
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	if(nFocusIdx == undefined) {
		nFocusIdx = SYSVar.SELECTED_MIDDLE_TAB.gettabitemfocus();
	}
	SYSVar.SELECTED_MIDDLE_TAB.deletetab(nFocusIdx);
}

/**
 * 화면을 모두 닫는다.
 * @param {Boolean} 고정화면을 닫을지 여부[true:모두 닫음 | false:고정화면제외]
 * @return 없음
 */
function unloadScreenAll(bForce)
{
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	SYSVar.SELECTED_MIDDLE_TAB.deletealltab(bForce, false);
}

/**
 * 화면을 고정/해제(LOCK/UNLOCK) 한다.(TOGGLE)
 * @param {Number} MIDDLE 탭 인덱스(옵션)
 * @return 없음
 */
function setScreenLock(nFocusIdx)
{
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	var tabMiddle = SYSVar.SELECTED_MIDDLE_TAB;
	if(nFocusIdx == undefined) {
		nFocusIdx = SYSVar.SELECTED_MIDDLE_TAB.gettabitemfocus();
	}
	
	if(tabMiddle.gettabitemlock(nFocusIdx) == true) {
		tabMiddle.settabitemlock(nFocusIdx, false);
	} else {
		tabMiddle.settabitemlock(nFocusIdx, true);
	}
}

/**
 * 업무화면의 프레임 스크립트 멤버을 구한다.(portlet 화면에서 사용)
 * @param objScreen 업무화면 오브젝트 or this
 * @return objFrameMembers [스크립트 멤버 | null]
 */
function getFrameMembers(objParam)
{
	var objFrameMembers = null;
	if(isScrObject(objParam) == true) {
		objFrameMembers = objParam.getparent().getmembers();
	} else {
		objFrameMembers = objParam.screen.getparent().getmembers();
	}
	return objFrameMembers;
}

/**
 * 탭 context 메뉴 동작을 정의한다. createBizTabMenu 호출시에 arrMenu 정보로 구성
 * @param objScreen 업무화면 오브젝트
 * @param objInst context의 버튼 오브젝트
 * @return 없음
 */
function setBizTabMenuOperation(objScreen, objInst)
{
	var strText = objInst.getuserdata();
	switch(strText)
	{
		case "화면고정" : 
			setScreenLock();
			break;
		case "화면닫기" : 
			objScreen.messagebox("화면을 닫으시겠습니까?", "화면 닫기", XFD_MB_QUESTION, XFD_MB_YESNO,  XFD_MB_FOCUSBUTTON2, "close");
			break;
		case "열린화면닫기(고정제외)" : 
			objScreen.messagebox("열려 있는 화면(고정제외)을 모두 닫으시겠습니까?", "화면 닫기", XFD_MB_QUESTION, XFD_MB_YESNO,  XFD_MB_FOCUSBUTTON2, "closeAllEx");
			break;
		case "열린화면닫기" : 
			objScreen.messagebox("열려 있는 화면을 모두 닫으시겠습니까?", "화면 닫기", XFD_MB_QUESTION, XFD_MB_YESNO,  XFD_MB_FOCUSBUTTON2, "closeAll");
			break;
	}
}

function unloadPopup(screenInst,rtnValue)
{
	let parentScreen = screenInst.getparent();
	if(parentScreen)
	{
		let parentMembers = parentScreen.getmembers();
		if(parentMembers._getFrameType != undefined && parentMembers._getFrameType() === "POPUP_CONTAINER" )
		{
			parentScreen.unloadpopup(rtnValue);
		}
		else
		{
			unloadPopup(parentScreen,rtnValue);
		}
	}
}

/**
 * 메시지 팝업 화면 호출(화면 on_messagebox 이벤트 호출)
 * @param {object} objScreen  화면 오브젝트
 * @param {object} strTitle  메시지 팝업 타이틀
 * @param {object} nMsgType  메시지 팝업 타입
  							XFD_MB_INFORMATION or 1
	  						XFD_MB_ERROR       or 2
		  					XFD_MB_QUESTION    or 3
			  				XFD_MB_STOP        or 4
 * @param {object} nBtnType  화면 오브젝트
  							XFD_MB_ABORTRETRYIGNORE    or 1
	  						XFD_MB_OK                  or 2
		  					XFD_MB_OKCANCEL            or 3
			  				XFD_MB_RETRYCANCEL         or 4
				  			XFD_MB_YESNO               or 5
					  		XFD_MB_YESNOCANCEL         or 6
						  	XFD_MB_CANCELRETRYCONTINUE or 7
 * @param {object} strMsg    메시지 내용
 * @param {object} nFocus    화면 오브젝트
							  XFD_MB_FOCUSBUTTON1 or 0
							  XFD_MB_FOCUSBUTTON2 or 1
							  XFD_MB_FOCUSBUTTON3 or 2
 * @param {object} strMsgId  on_messagebox에서 받을 메시지 ID
 * @return 없음
 */
function loadMessageBox(objScreen, strTitle, nMsgType, nBtnType, strMsg, nFocus, strMsgId)
{
	var strPopupName = "MessagBox";
	var strUrl       = "/UTIL/messageBox";
//	
	var extraData = {
			CALLTYPE : 1,
			TITLE    : strTitle,
			MSG_TYPE : nMsgType,
			BTN_TYPE : nBtnType,
			MSG      : strMsg,
			FOCUS    : nFocus,
			MSG_ID   : strMsgId
	};
	objScreen.loadportletpopup(strPopupName, strUrl, "MESSAGE_PORTLET", true, 0, 0, 0, 0, 0, true, true, false, extraData);
}

/**
 * 메시지 팝업 화면 호출(화면 내 callback 호출)
 * @param {object} objScreen  화면 오브젝트
 * @param {object} strTitle  메시지 팝업 타이틀
 * @param {object} nMsgType  메시지 팝업 타입
  							XFD_MB_INFORMATION or 1
	  						XFD_MB_ERROR       or 2
		  					XFD_MB_QUESTION    or 3
			  				XFD_MB_STOP        or 4
 * @param {object} nBtnType  화면 오브젝트
  							XFD_MB_ABORTRETRYIGNORE    or 1
	  						XFD_MB_OK                  or 2
		  					XFD_MB_OKCANCEL            or 3
			  				XFD_MB_RETRYCANCEL         or 4
				  			XFD_MB_YESNO               or 5
					  		XFD_MB_YESNOCANCEL         or 6
						  	XFD_MB_CANCELRETRYCONTINUE or 7
 * @param {object} strMsg    메시지 내용
 * @param {object} nFocus    화면 오브젝트
							  XFD_MB_FOCUSBUTTON1 or 0
							  XFD_MB_FOCUSBUTTON2 or 1
							  XFD_MB_FOCUSBUTTON3 or 2
 * @param {object} strCallScript  callback 화면내 수신 받을 함수
 * @return 없음
 */
function loadMessageBoxEx(objScreen, strTitle, nMsgType, nBtnType, strMsg, nFocus, strCallScript)
{
	var strPopupName = "MessagBox";
	var strUrl       = "/UTIL/messageBox";
//	
	var extraData = {
			CALLTYPE : 2,
			TITLE    : strTitle,
			MSG_TYPE : nMsgType,
			BTN_TYPE : nBtnType,
			MSG      : strMsg,
			FOCUS    : nFocus,
			CALLFUNC : strCallScript
	};
	objScreen.loadportletpopup(strPopupName, strUrl, "MESSAGE_PORTLET", true, 0, 0, 0, 0, 0, true, true, false, extraData);
}

/**
 * 거래 수신시 오류 메시지 팝업 호출 처리(메시지 팝업 종료 후 업무화면 txSubmitComplete 호출)
 * @param {object} objScreen  화면 오브젝트
 * @param {object} strTitle  메시지 팝업 타이틀
 * @param {object} nMsgType  메시지 팝업 타입
  							XFD_MB_INFORMATION or 1
	  						XFD_MB_ERROR       or 2
		  					XFD_MB_QUESTION    or 3
			  				XFD_MB_STOP        or 4
 * @param {object} nBtnType  화면 오브젝트
  							XFD_MB_ABORTRETRYIGNORE    or 1
	  						XFD_MB_OK                  or 2
		  					XFD_MB_OKCANCEL            or 3
			  				XFD_MB_RETRYCANCEL         or 4
				  			XFD_MB_YESNO               or 5
					  		XFD_MB_YESNOCANCEL         or 6
						  	XFD_MB_CANCELRETRYCONTINUE or 7
 * @param {object} strMsg    메시지 내용
 * @param {object} nFocus    화면 오브젝트
							  XFD_MB_FOCUSBUTTON1 or 0
							  XFD_MB_FOCUSBUTTON2 or 1
							  XFD_MB_FOCUSBUTTON3 or 2
 * @param {object} strMsgId  on_messagebox에서 받을 메시지 ID
 * @return 없음
 */
function loadMessageBoxTran(objScreen, strTitle, nMsgType, nBtnType, strMsg, nFocus, strCallScript, strMapId, nResult)
{
	var strPopupName = "MessagBox";
	var strUrl       = "/UTIL/messageBox";
//	
	var extraData = {
			CALLTYPE : 3,
			TITLE    : strTitle,
			MSG_TYPE : nMsgType,
			BTN_TYPE : nBtnType,
			MSG      : strMsg,
			FOCUS    : nFocus,
			CALLFUNC : strCallScript,
			MAPID    : strMapId,
			RESULT   : nResult
	};
	objScreen.loadportletpopup(strPopupName, strUrl, "MESSAGE_PORTLET", true, 0, 0, 0, 0, 0, true, true, false, extraData);
}