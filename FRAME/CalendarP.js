var m_objCalendarButton = null;	// 날짜가 팝업을 띄운 부모 화면의 버튼 오브젝트
var m_objDateField = null;	 	// 날짜가 설정된 부모 화면의 필드 오브젝트
var m_objDateGrid = null;		  // 날짜가 설정될 부모 화면의 그리드 오브젝트
var m_fldCallBackFunction = null;	//

function objCalendarCtrl_on_selectdate(objInst, strDate)
{
	var objParentScreen = screen.getparent();
	
	if(factory.isobject(objParentScreen) == false) {
		screen.unload();
		return;
	}
	
	if(fldDateFieldName.gettext() != "") {
		var fldParentDateField = objParentScreen.getinstancebyname(fldDateFieldName.gettext());

		screen.unload();
		
		if(factory.isobject(fldParentDateField) == false) {
			return;
		}
		
		//fldParentDateField.settext(objCalendarCtrl.getdate());
		fldParentDateField.settext(strDate);
		fldParentDateField.setfocus();

		// 달력 부모화면에 날짜 선택 이벤트 발생
		var objParentScreenMember = objParentScreen.getmembers(XFD_JAVASCRIPT);
		
		if(UT.isNull(m_fldCallBackFunction)){
			if(objParentScreen.findscriptmethod(XFD_JAVASCRIPT, "on_calendar_selectdate")) {
				objParentScreenMember.on_calendar_selectdate(m_objCalendarButton, m_objDateField);
			}
		}else{
			if(objParentScreen.findscriptmethod(XFD_JAVASCRIPT, m_fldCallBackFunction)) {
				eval("objParentScreenMember." + m_fldCallBackFunction)(m_objCalendarButton, m_objDateField);	
			}
		}
	}
	else if(fldDateGridName.gettext() != "")
	{
		var objParentDateGrid = objParentScreen.getinstancebyname(fldDateGridName.gettext());
		var nRow = fldRow.gettext();
		var nColumn = fldColumn.gettext();

		screen.unload();
		
		if(factory.isobject(objParentDateGrid) == false) {
			return;
		}
		
		//objParentDateGrid.setitemtext(nRow, nColumn, objCalendarCtrl.getdate());
		objParentDateGrid.setitemtext(nRow, nColumn, strDate);
		objParentDateGrid.setfocus();

		// 달력 부모화면에 날짜 선택 이벤트 발생
		var objParentScreenMember = objParentScreen.getmembers(XFD_JAVASCRIPT);
		
		if(UT.isNull(m_fldCallBackFunction)){
			if(objParentScreen.findscriptmethod(XFD_JAVASCRIPT, "on_calendar_selectdate_forgrid")) {
				objParentScreenMember.on_calendar_selectdate_forgrid(m_objDateGrid, nRow, nColumn);
			}
		}else{
			if(objParentScreen.findscriptmethod(XFD_JAVASCRIPT, m_fldCallBackFunction)) {
				eval("objParentScreenMember." + m_fldCallBackFunction)(m_objDateGrid, nRow , nColumn);	
			}
		}
	}
	
	screen.unload();
}