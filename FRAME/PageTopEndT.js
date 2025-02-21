/*------------------------------------
* program id : PageTopEndT
* desc	   : 페이징 공통 닫기 버튼용
* dev date   : 2013-03-12
* made by    : LGH
*-------------------------------------*/

function btnCommonClose_on_mouseup(objInst)
{	
	
	SYSVar.SELECTED_MIDDLE_TAB = SYSVar.MIDDLE_TAB;
	var nFocusIdx = SYSVar.SELECTED_MIDDLE_TAB.gettabitemfocus();
	
	SYSVar.SELECTED_MIDDLE_TAB.deletetab(nFocusIdx);
	
//	var objParent = screen.getparent();
//
//	console.log("SYSVar.MIDDLE_TAB.gettabitemcount() : " + SYSVar.MIDDLE_TAB.gettabitemcount())
//	for(var i=0;i<SYSVar.MIDDLE_TAB.gettabitemcount();i++){			
//		var objScreenFrame = SYSVar.MIDDLE_TAB.getchildscreeninstance(i);
//		//var objScreenFrame = SYSVar.MIDDLE_TAB.getinstance(i)
//		if(!UT.isScreen(objScreenFrame)){
//			return;
//		}
//		
//		var objTab = objScreenFrame.getinstancebyname("tabBizScreen");
//		var objTabInScreen = objTab.getchildscreeninstance(0);
//				
//		if(objTabInScreen == objParent){
//			SYSVar.MIDDLE_TAB.deletetab(i);
//			break;
//		}
//	}
}



function screen_on_load()
{
	INI.initPopup(this.screen);	//팝업 공통 
}