/**
 * UI 프레임 리사이징 등을 위한 공통모듈
 */

// 크기 변경 및 이동 상수 정의
var RESIZE = 0;		// 크기 변경
var MOVE = 1;	  	// 이동
var IMGRESIZE = 2; 	// 이미지 크기 변경	
var IMGMOVE = 3;  	 // 이미지 이동

// Resize/Move 처리 방향 정의
var HORZ = 0;	// 가로
var VERT = 1;	// 세로
var BOTH = 2;	// 가로 세로
var CNTR = 3;	// 세로

var m_arrLayout = [];

/**
 * @name  removeLayoutInformation
 * @param screenTarget : screen : delete 할 UI 프레임을 가진 화면
 * @remarks 컴퍼넌트 정보를 가진 array를 delete 해주는 함수
**/
function deleteScreenLayout(objScreen)
{
	var strWindowId = objScreen.getwindowid();
	m_arrLayout[strWindowId] = undefined;	
	delete m_arrLayout[strWindowId];

	return;
}

/**
 * 화면 크기 변경시 이동 또는 Resize 대상 컨트롤을 관리 Array에서 삭제
 * @param objScreen 화면 오브젝트
 * @param objComponent 대상 컴포넌트 오브젝트
 * @return
 *	true 성공
 *	false 실패
 */
function deleteLayout(objScreen, objComponent)
{
	if(factory.isobject(objScreen) == false) {
		return false;
	}
	
	if(factory.isobject(objComponent) == false) {
		return false;
	}
			
	var strComponentName = objComponent.getname();
		
	// 오브젝트를 포함하고 있는 화면의 인스턴스를 얻음
	var objScreen = objComponent.getparentscrinstance();
	
	// 화면의 윈도우 ID를 문자열로 변환
	var strWindowId = (objScreen.getwindowid()).toString(10);
	
	var arrScreenLayout = m_arrLayout[strWindowId];
	
	// 화면에 대한 레이아웃이 정의되지 않았다면 리턴
	if(arrScreenLayout == undefined) {
		return true;
	}	
	
	var arrObjectLayout = arrScreenLayout[2];
	if(arrObjectLayout == undefined) {
		return true;
	}
	
	var nItemCount = arrObjectLayout.length;
	for(var i = 0; i < nItemCount; i++) {
		var arrObjectLayoutItem = arrObjectLayout[i];
		if(arrObjectLayoutItem == undefined) {
			continue;
		}
		
		// 컴포넌트 이름 비교하여 같을 경우, 사용 여부 값을 false로 설정
		if(strComponentName == arrObjectLayoutItem[0]) {
			arrObjectLayout[i] = undefined;
			delete arrObjectLayout[i];
			return true;
		}
		
	}

	return false;
}

/**
 * 화면 크기 변경시 이동/크기변경 대상 컨트롤을 관리 Array 에 추가
 * @param objScreen 화면 오브젝트
 * @param objComponent 대상 컴포넌트 오브젝트
 * @param nDirection 이동방향
 * @return
 * 	true 성공
 *	 false 실패
 */
function addLayout(objScreen, objComponent, nMoveOrResize, nDirection)
{
	if(factory.isobject(objScreen) == false) {
		return false;
	}
	
	if(factory.isobject(objComponent) == false) {
		return false;
	}
	
	if(nDirection < 0 || nDirection > 3) {
		return false;
	}
	
	if(nMoveOrResize < 0 || nMoveOrResize > 3) {
		return false;
	}	
	
	// 화면 윈도우 ID를 문자열로 변환
	var strWindowId = (objScreen.getwindowid()).toString(10);
	
	var arrScreenLayout = null;
	var arrObjectLayout = null;
	
	arrScreenLayout = m_arrLayout[strWindowId];
	
	if(arrScreenLayout == undefined) {
		// 화면의 레이아웃을 저장할 어레이 생성
		arrScreenLayout = new Array();
		arrScreenLayout[0] = objScreen.getscreenwidth();
		arrScreenLayout[1] = objScreen.getscreenheight();
		
		// 화면의 오브젝트에 대한 Layout을 저장할 어레이 생성
		arrObjectLayout = new Array();
		arrScreenLayout[2] = arrObjectLayout;
		
		m_arrLayout[strWindowId] = arrScreenLayout;
	}
	else {
		arrObjectLayout = arrScreenLayout[2];
	}
	
	var arrObjectLayoutItem = new Array(objComponent.getname(), nMoveOrResize, nDirection, true);
	arrObjectLayout.push(arrObjectLayoutItem);

	return;
}



function fnTabInResize(objComponent){
	var iType = "";
			
	try{
		iType = objComponent.getcontrolkind();
	}catch(e){
		iType = -1;
	}
			
	if(iType == 7){
		var itemHeight = objComponent.gettabitemheight();
		
		for(var j=0;j<objComponent.gettabitemcount();j++){
			var objTabScreenFrame = objComponent.getchildscreeninstance(j);
	
			if(UT.isScreen(objTabScreenFrame)){	//스크린 객체면
	
				//objTabScreenFrame.setscreenwidth(objComponent.getwidth());
				//objTabScreenFrame.setscreenheight(objComponent.getheight());
				
				if(objTabScreenFrame.findscriptmethod(XFD_JAVASCRIPT , "screen_on_size")){
					var objMb = objTabScreenFrame.getmembers(XFD_JAVASCRIPT);
					objMb.screen_on_size(objComponent.getwidth() - 2 , objComponent.getheight() - itemHeight - 2);
				}
			}					
		}
	}
}

/**
 * 대상화면(scrResize) 사이즈 변동 시 같이 Resize/Move 되어야 할 arrItems에 
 * 저장된 컨트롤들을 해당 정보에 맞게 Resize/Move 처리한다.
 * 대상화면에 screen_on_size 이벤트가 등록 되어 있어야 하며, 이벤트 함수안에서 호출하기만 하면된다.
 * @param objScreen 화면 오브젝트
 * @param nWidth 변동된 화면의 가로크기 (차이아님)
 * @param nHeight 변동된 화면의 세로크기 (차이아님)
 */
function processSizeEvent(objScreen, nWidth, nHeight)
{
	var strWindowId = (objScreen.getwindowid()).toString(10);
	var arrScreenLayout = m_arrLayout[strWindowId];
	var arrObjectLayout = null;
	
	// 화면에 대한 레이아웃이 정의되지 않았다면 리턴
	if(arrScreenLayout == undefined) {
		return;
	}	
	
	var preWidth = arrScreenLayout[0]; 	// 변동전 width
	var preHeight = arrScreenLayout[1];    // 변동전 height
	var nWRate = nWidth / preWidth; 	   // 변동된 width 비율
	var nHRate = nHeight / preHeight;      // 변동된 height 비율
	var nWDiff = nWidth - preWidth;        // 변동된 width 차이
	var nHDiff = nHeight - preHeight;      // 변동된 height 차이
	
	//화면 사이즈가 변동되지 않았다면 리턴
	if(nWDiff == 0 && nHDiff == 0) { 
		return;
	}
	
	arrObjectLayout = arrScreenLayout[2];
	
	var nItemCount = arrObjectLayout.length;
	for(var i = 0; i < nItemCount; i++) {
		var arrObjectLayoutItem = arrObjectLayout[i];
		if(arrObjectLayoutItem == undefined) {
			continue;
		}
		
		var objComponent = objScreen.getinstancebyname(arrObjectLayoutItem[0]);
		if(factory.isobject(objComponent) == false) {
			continue;
		}
		
		var nProcType = arrObjectLayoutItem[1];
		var nDirection = arrObjectLayoutItem[2];
		var bUsed = arrObjectLayoutItem[3];		
		
		if(bUsed == false) {
			continue;
		}
		
		// 화면 사이즈가 변동되었다면..		
		if(nProcType == RESIZE) { 
			//fnTabInResize(objComponent);	//탭안의 리싸이징
			
			switch(nDirection) {
				case HORZ: //가로 - 오른쪽+변동된 차이
					objComponent.setrect(objComponent.getleft(), objComponent.gettop(), objComponent.getright() + nWDiff, objComponent.getbottom());
					break;
				case VERT: //세로 - 바닥+변동된 차이
					objComponent.setrect(objComponent.getleft(), objComponent.gettop(), objComponent.getright(), objComponent.getbottom() + nHDiff);
					break;
				case BOTH: //가로세로 - 오른쪽+변동된 차이, 바닥+변동된 차이
					objComponent.setrect(objComponent.getleft(), objComponent.gettop(), objComponent.getright() + nWDiff, objComponent.getbottom() + nHDiff);
					break;
				default:
					break;
			}
		}
		// 화면이 이동되었다면..		
		else if(nProcType == MOVE) {
			switch(nDirection) {
				case HORZ: //가로 - 왼쪽+변동된차이, 오른쪽+변동된차이
					objComponent.setrect(objComponent.getleft() + nWDiff, objComponent.gettop(), objComponent.getright() + nWDiff, objComponent.getbottom());
					break;
				case VERT: //세로 - 탑+변동된차이, 바닥+변동된차이
					objComponent.setrect(objComponent.getleft(), objComponent.gettop() + nHDiff, objComponent.getright(), objComponent.getbottom() + nHDiff);
					break;
				case BOTH: //가로세로 - 전체+변동된차이
					objComponent.setrect(objComponent.getleft() + nWDiff, objComponent.gettop() + nHDiff, objComponent.getright() + nWDiff, objComponent.getbottom() + nHDiff);
					break;
				case CNTR: //센터
					moveToCenter(objScreen, objComponent);
					break;					
				default:
					break;
			}
		} 		
		// 이미지 사이즈가 변동되었다면..		
		else if(nProcType == IMGRESIZE) {
			switch(nDirection) {
				case HORZ: //가로
					objComponent.setrect(objComponent.getleft(), objComponent.gettop(), objComponent.getright() + nWDiff * 0.6, objComponent.getbottom());
					break;
				case VERT: //세로
					objComponent.setrect(objComponent.getleft(), objComponent.gettop(), objComponent.getright(), objComponent.getbottom() + nHDiff * 0.6);
					break;
				case BOTH: //가로세로
					objComponent.setrect(objComponent.getleft(), objComponent.gettop(), objComponent.getright() + nWDiff * 0.6, objComponent.getbottom() + nHDiff * 0.6);
					break;
				default:
					break;
			}
		}
		// 이미지가 이동되었다면..
		else if (nProcType == IMGMOVE) {
			switch(nDirection) {
				case HORZ: //가로
					objComponent.setrect(objComponent.getleft() + nWDiff * 0.6, objComponent.gettop(), objComponent.getright() + nWDiff * 0.6, objComponent.getbottom());
					break;
				case VERT: //세로
					objComponent.setrect(objComponent.getleft(), objComponent.gettop() + nHDiff * 0.6, objComponent.getright(), objComponent.getbottom() + nHDiff * 0.6);
					break;
				case BOTH: //가로세로
					var nItemWidth = objComponent.getright() - objComponent.getleft();
					var nItemHeight = objComponent.getbottom() - objComponent.gettop();
					objComponent.setrect(objComponent.getleft() + nWDiff / 2, objComponent.gettop() + nHDiff / 2, objComponent.getright() + nWDiff / 2, objComponent.getbottom() + nHDiff / 2);
					break;
				default:
					break;
			}
		}		
	} 
	
	arrScreenLayout[0] = nWidth;
	arrScreenLayout[1] = nHeight;
	
	return;
}

/**
 * 오브젝트를 화면의 중앙으로 이동
 * @param objScreen 기존이 되는 화면 오브젝트
 * @param objTarget 화면 중앙으로 이동할 컴포넌트 오브젝트
 */
function moveToCenter(objScreen, objTarget)
{
	/*
	var nScreenWidth = objScreen.getscreenwidth();
	var nScreenHeight = objScreen.getscreenheight();
	*/
	// 화면의 윈도우 크기를 기준으로 변경한다. 윈도우 보더로 인해 보정값을 계산한다.
	var nGab = 6;
	var nScreenWidth = objScreen.getwindowwidth() - nGab;
	var nScreenHeight = objScreen.getwindowheight() - nGab;	
	
	var nObjWidth = objTarget.getwidth();
	var nObjHeight = objTarget.getheight();
	
	// 처리중 표시 패널 위치 변경
	var nXPos = parseInt((nScreenWidth / 2) - (nObjWidth / 2), 10);
	var nYPos = parseInt((nScreenHeight / 2) - (nObjHeight / 2), 10);
		
	objTarget.setrect(nXPos, nYPos, nXPos + nObjWidth, nYPos + nObjHeight);
}