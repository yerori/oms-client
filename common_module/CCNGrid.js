/**
 * 그리드에 로우를 맨 마지막에 추가한다.
 * @param objGrid 그리드 오브젝트
 * @param [bEditStart] 추가된 칼럼 에디트 모드 시작 여부 (Optional)
 * @return nRowIndex 추가된 로우 인덱스
 */
function addGridRow(objGrid, bEditStart)
{
	if(factory.isobject(objGrid) == false) {
		return;
	}
	
	if(bEditStart == undefined) {
		bEditStart = false;
	}

	var nRowIndex = objGrid.getrowcount();
		
	objGrid.insertitemtext(nRowIndex, 0, "");	
	objGrid.setselectitem(nRowIndex, 0);

	if(bEditStart == true) {
		var nColumnCount = objGrid.getcolumncount();
		var i;
		
		for(i = 0; i < nColumnCount; i++) {
			if(objGrid.getcolumneditable(i) == true) {
				objGrid.setitemeditstart(nRowIndex, i, true);
				break;
			}
		}
	}
	
	return nRowIndex;
}

/**
 * 
 * @param objGrid 대상 그리드
 * @param nColumn 대상 그리드의 컬럼
 * @return
*/
function getGridCellRight(objGrid, nColumn)
{
	var nGridLeft = objGrid.getwindowleft();
	var nCellLeft = (objGrid.getusecheckbox() ? 16 : 0);

	nCellLeft = (objGrid.isshowlinenumber() ? nCellLeft + 40 : nCellLeft);
	for(var i = 0; i <= nColumn; i++)
	{
		nCellLeft += objGrid.getcolumnwidth(i);
	}

	return nCellLeft;
}

/**
 * 
 * @param objGrid 대상 그리드
 * @param nRow 대상 그리드의 로우
 * @return
*/
function getGridCellBottom(objGrid, nRow)
{
	var nGridTop = objGrid.getwindowtop();
	var nCellTop = objGrid.gethorzheadercount() * objGrid.getheaderheight();
	var nFirstNonFixedVisibleRow = objGrid.getnonfixedtoprow();
	var nPhysicalRow = nRow - nFirstNonFixedVisibleRow;

	for(var i = 0; i <= nPhysicalRow; i++)
	{
		nCellTop += objGrid.getitemheight();
	}

	return nCellTop;
}

/**
 * 그리드 아이템의 입력 방식을 달력형식으로 변경한다.
 * @param objGrid 그리드 오브젝트
 * @param nRow 그리드 아이템 로우 인덱스 (Zero-Base)
 * @param nColumn 그리드 아이템 칼럼 인덱스 (Zero-Base)
 * @param strPattern 8자리의 날짜 패턴 (예: 9999-99-99, 9999/99/99)
 * @return 
 *	0 : Success
 *	1 : Invalid Parameter
 *	2 : Fail To Set Grid Item Input Type
 */
function setGridItemInputTypeToCalendar(objGrid, nRow, nColumn, strPattern, bEditable)
{
	// 파라미터 Validate
	if(factory.isobject(objGrid) == false) {
		return 1;
	}
	
    var nRowCount = objGrid.getrowcount();
    var nColumnCount = objGrid.getcolumncount();
	
    // 파라미터 Validate
    if(nRow >= nRowCount || nColumn >= nColumnCount) {
        return 1;
    }
	
    // 기존 입력 방식을 구하고, 동일한 경우 리턴
    var nPrevInputType = objGrid.getiteminputtype(nRow, nColumn);
    if(nPrevInputType == 3) {
        return 0;
    }

    // 그리드 아이템의 Input Type 설정
    var bResult = objGrid.setiteminputtype(nRow, nColumn, 3);
    if(bResult == false) {
        screen.alert("setiteminputtype Fail");
        return 2;
    }

    // 날짜 패턴을 설정
    grdNormal.setitempattern(nRow, nColumn, strPattern, 0);
	
    // 최대 입력 길이 설정
    grdNormal.setitemmaxlength(nRow, nColumn, 8);
		
    return 0;
} 