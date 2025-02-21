/*-----------------------------------------------------------------------------------------------------------------

FV_IMG_ROW_COLUMN	:	그리드 이미지 사용시 컬럼명
FV_INSERT_IMG	:	그리드 추가 아이콘
FV_UPDATE_IMG	:	그리드 수정 아이콘
FV_DELETE_IMG	:	그리드 삭제 아이콘

gfnInsertRow(objScreen , objGrid , imgResult)	:	그리드 에서 줄추가시 자동으로 줄 이동
gfnDeleteRow(objScreen , objGrid , imgResult , iDRow)	:	그리드 에서 줄 삭제시 자동으로 다음 줄 이동
gfnGridImageTypeSetting(objScreen , objGrid)	:	그리드 이미지 타입 사용에서 이미지를 재 설정합니다
gfnGridImageDlClick(objScreen , objGrid, nDblClickRow, nDblClickColumn)	:	그리드 이미지 타입 사용에서 아이콘 더블클릭시 처리
gfnGridImageItemEditComplete(objScreen , objGrid , nRow)	:	그리드 이미지 타입 사용에서 데이터변경시 처리
gfnGridItemChangeResult(objScreen , objGrid , nRow , nColumn, strPrevItemText)	:	그리드 에서 데이터가 변경되었는지의 여부
gfnGrdImageSaveConfirm(objScreen , objDataset)	:	이미지 사용시 저장 컴펌
gfnCellAutoPit(objGrid)	:	그리드 넓이에 맞게 콜들을 재분배합니다

gfnGrdHandle(objGrid , aryHash , aryColumn , strHandleType , strTrueValue , strFalseValue)	:	그리드의 속성을 조작한다
gfnGrdCellHandle(objGrid , iRow , aryColumn , strHandleType , strValue)	:	그리드의 해당 줄의 속성을 조작한다.

gfnGrdAllCheckedRows(objGrd)	:	그리드 use_check true 의 체크된 줄들만을 반환합니다
gfnGrdRowIsChecked(objGrd , iRow)	:	그리드 use_check true 의 해당줄이 체크되어있는지의 여부를 반홥합니다
gfnGrdAllCheck(strColumn , objInst , iHeaderRow , iHeaderCol)	:	그리드의 show check 사용시(만든 체크박스시) 전체 체크박스 클릭 함수

gfnGetColumnNameAry(objGrid)	:	그리드의 컬럼 네임을 배열로 반환합니다
----------------------------------------------------------------------------------------------------------------- */


var FV_IMG_ROW_COLUMN = "ROW_STAT";						// 그리드 이미지 사용시 컬럼명
//var FV_INSERT_IMG = "/IMG/grid_plus.png";	  // 그리드 추가 아이콘	
//var FV_UPDATE_IMG = "/IMG/grid_modify.png";		// 그리드 수정 아이콘
//var FV_DELETE_IMG = "/IMG/grid_minus.png";		  // 그리드 삭제 아이콘
var FV_INSERT_IMG = "/grid_plus.png";	  // 그리드 추가 아이콘	
var FV_UPDATE_IMG = "/grid_modify.png";		// 그리드 수정 아이콘
var FV_DELETE_IMG = "/grid_minus.png";		  // 그리드 삭제 아이콘


/*
* 그리드 에서 줄추가시 자동으로 줄 이동
* objScreen  	  : (object) 스크린 객체
* objGrid		  : (object) 그리드 객체
* imgResult	    : (boolean) 이미지 그리드 사용여부
* iDirectInsertRow : (int) 직접 추가할줄
* [return] => (int) 추가된줄
*/
function gfnInsertRow(objScreen , objGrid , imgResult , iDirectInsertRow){
	if(UT.isNull(imgResult)){
		imgResult = false;
	}
			
	var objDataset = objGrid.getlinkxdataset();
	var iRow = objGrid.getrowcount();
	
	if(!UT.isNull(iDirectInsertRow)){
		iRow = iDirectInsertRow;
	}
	else{
		iRow = 0;
	}
	
	objDataset.insertrow(iRow);
	objDataset.moveat(iRow);	//grdList.setselectitem(iRow,1);

	if(imgResult){	//이미지 그리드 사용시
		var objDataset = objGrid.getlinkxdataset();
		var resultInt = objDataset.getcolumn(FV_IMG_ROW_COLUMN);	
		var colIndex = objGrid.getcolumn(FV_IMG_ROW_COLUMN);	
		
		objDataset.setdatabyname(iRow , FV_IMG_ROW_COLUMN , "I");
		objGrid.setitemimage(iRow , colIndex , FV_INSERT_IMG);
	}
	
	return iRow;
}

 
/*
* 그리드 에서 줄 삭제시 자동으로 다음 줄 이동
* objScreen  	 : (object) 스크린 객체
* objGrid		 : (object) 그리드 객체
* imgResult	   : (boolean) 이미지 그리드 사용여부
* iDRow	   	: (iRow) 직접 삭제호촐할 줄값
*/
function gfnDeleteRow(objScreen , objGrid , imgResult , iDRow){
	if(UT.isNull(imgResult)){
		imgResult = false;
	}
	
	var objDataset = objGrid.getlinkxdataset();
	var iRow = objGrid.getselectrow();

	if(!UT.isNull(iDRow)){
		iRow = iDRow
	}
	
	if(imgResult){	//이미지 그리드 사용시
		var objDataset = objGrid.getlinkxdataset();
		var resultInt = objDataset.getcolumn(FV_IMG_ROW_COLUMN);	
		var colIndex = objGrid.getcolumn(FV_IMG_ROW_COLUMN);	
		var rowType = objDataset.getrowoperation(iRow); 
		
		if(rowType == XFD_ROWOP_INSERT){
			objGrid.deleterow(iRow);
		}else{		
			objDataset.setdatabyname(iRow , FV_IMG_ROW_COLUMN , "D");
			objGrid.setitemimage(iRow , colIndex , FV_DELETE_IMG);
			objDataset.movenext();
		}
	}else{
		objGrid.deleterow(iRow);
	}
	
	return iRow;
}


/*
* 그리드 이미지 타입 사용에서 이미지를 재 설정합니다
* objScreen  	 : (object) 스크린 객체
* objGrid		 : (object) 그리드 객체
*/
function gfnGridImageTypeSetting(objScreen , objGrid){
	var objDataset = objGrid.getlinkxdataset();
	var resultInt = objDataset.getcolumn(FV_IMG_ROW_COLUMN);
	var colIndex = objGrid.getcolumn(FV_IMG_ROW_COLUMN);	
	
	if(resultInt == 0 && colIndex != -1){	//해당컬럼이 있으면 0 없으면 -1  해당 컬럼의 name 이 FV_IMG_ROW_COLUMN 인것
		for(var i=0;i<objDataset.getrowcount();i++){
			var rowType = objDataset.getrowoperation(i); 
			var strRowType = objDataset.getdatabyname(i , FV_IMG_ROW_COLUMN); 
			
			if(rowType == XFD_ROWOP_INSERT){
				objGrid.setitemimage(i , colIndex , FV_INSERT_IMG);
				objDataset.setdatabyname(i , FV_IMG_ROW_COLUMN , "I");
			}else if(rowType == XFD_ROWOP_UPDATE){
				if(strRowType == "N"){
					objGrid.setitemimage(i , colIndex , "");
				}else if(strRowType == "U"){
					objGrid.setitemimage(i , colIndex , FV_UPDATE_IMG);
					objDataset.setdatabyname(i , FV_IMG_ROW_COLUMN , "U");
				}else if(strRowType == "D"){
					objGrid.setitemimage(i , colIndex , FV_DELETE_IMG);
					objDataset.setdatabyname(i , FV_IMG_ROW_COLUMN , "D");
				}else{
					objGrid.setitemimage(i , colIndex , FV_UPDATE_IMG);
					objDataset.setdatabyname(i , FV_IMG_ROW_COLUMN , "U");
				}																
			}else if(rowType == XFD_ROWOP_NONE){
				objGrid.setitemimage(i , colIndex , "");
			}
		}
	}	
}


/*
* 그리드 이미지 타입 사용에서 아이콘 더블클릭시 처리
* objScreen  	 : (object) 스크린 객체
* objGrid		 : (object) 그리드 객체
* nDblClickRow	: (int) 해당 줄
* nDblClickColumn : (int) 해당 칸
*/
function gfnGridImageDlClick(objScreen , objGrid, nDblClickRow, nDblClickColumn){	
	var objDataset = objGrid.getlinkxdataset();
	var resultInt = objDataset.getcolumn(FV_IMG_ROW_COLUMN);
	var colIndex = objGrid.getcolumn(FV_IMG_ROW_COLUMN);	
	
	if(resultInt != -1 && colIndex == nDblClickColumn){	//해당컬럼이 있으면 0 없으면 -1
		var rowType = objDataset.getrowoperation(nDblClickRow); 
		var strRowType = objDataset.getdatabyname(nDblClickRow , FV_IMG_ROW_COLUMN); 
			
		if(rowType == XFD_ROWOP_INSERT){
			objGrid.deleterow(nDblClickRow);							
		}else if(rowType == XFD_ROWOP_UPDATE){
			if(strRowType == "N"){
				objDataset.setdatabyname(nDblClickRow , FV_IMG_ROW_COLUMN , "U");
				objGrid.setitemimage(nDblClickRow , colIndex , FV_UPDATE_IMG);
			}else{
				objDataset.setdatabyname(nDblClickRow , FV_IMG_ROW_COLUMN , "N");
				objGrid.setitemimage(nDblClickRow , colIndex , "");
			}				 
		}else if(rowType == XFD_ROWOP_NONE){
			if(strRowType == "D"){
				objDataset.setdatabyname(nDblClickRow , FV_IMG_ROW_COLUMN , "N");
				objGrid.setitemimage(nDblClickRow , colIndex , "");
			}
		}				
	}
}


/*
* 그리드 이미지 타입 사용에서 데이터변경시 처리
* objScreen  	 : (object) 스크린 객체
* objGrid		 : (object) 그리드 객체
* strInDataset	: (nRow) 해당 줄
*/
function gfnGridImageItemEditComplete(objScreen , objGrid , nRow){
	var objDataset = objGrid.getlinkxdataset();
	var resultInt = objDataset.getcolumn(FV_IMG_ROW_COLUMN);
	var colIndex = objGrid.getcolumn(FV_IMG_ROW_COLUMN);	
	var rowType = objDataset.getrowoperation(nRow); 
	var strRowType = objDataset.getdatabyname(nRow , FV_IMG_ROW_COLUMN);	
	
	if(resultInt != -1 && rowType != XFD_ROWOP_INSERT){	//해당컬럼이 있으면 0 없으면 -1
		objDataset.setdatabyname(nRow , FV_IMG_ROW_COLUMN , "U");
		objGrid.setitemimage(nRow , colIndex , FV_UPDATE_IMG);		
	}
}



/*
* 그리드 에서 데이터가 변경되었는지의 여부
* objScreen  	 : (object) 스크린 객체
* objGrid		 : (object) 그리드 객체
* nRow			: (int) 해당 줄
* nColumn   	  : (int) 해당 칸
* strPrevItemText : (string) 변경전값
* [return] => (boolean) 변경시 true 
*/
function gfnGridItemChangeResult(objScreen , objGrid , nRow , nColumn, strPrevItemText){
	var strNowText = objGrid.getitemtext(nRow , nColumn);
	if(strNowText == strPrevItemText){
		return false;
	}
	
	return true;
}


/*
* 그리드 에서 이지미 사용시 저장시 확인 함수
* objScreen  	 : (object) 스크린 객체
* objDataset	  : (object) 데이터셋 객체
* [return] => (boolean)  
*/
function gfnGrdImageSaveConfirm(objScreen , objDataset){
	if(!UT.isScreen(objScreen)){	
		//CCNConst.WIN_MAIN_SCREEN.alert("[gfnGrdImageSaveConfirm 개발자 오류] screen 객체를 넘겨주세요");
		UT.alert(SYSVar.WINMAIN_SCREEN , "" , "[gfnGrdImageSaveConfirm 개발자 오류] screen 객체를 넘겨주세요");
		return;	
	}	

	var resultInt = objDataset.getcolumn(FV_IMG_ROW_COLUMN);
	
	if(resultInt == 0){	//해당컬럼이 있으면 0 없으면 -1
		var iICnt = 0;
		var iUCnt = 0;
		var iDCnt = 0;
		
		for(var i=0;i<objDataset.getrowcount();i++){
			var rowStat = objDataset.getdatabyname(i,FV_IMG_ROW_COLUMN);
			if(rowStat == "I"){
				iICnt++;
			}else if(rowStat == "U"){
				iUCnt++;
			}else if(rowStat == "D"){
				iDCnt++;
			}
		}
		
		if(iICnt == 0 && iUCnt == 0 && iDCnt == 0){
			UT.alert(objScreen , "MSG011" , "저장할 데이터가 없습니다.");
			return false;
		}
		
		var strMsg = UT.gfnGetMetaData("MSG238" , "데이터를 저장하시겠습니까?");
		strMsg += "\n\n" + UT.gfnGetMetaData("MSG239" , "등록 : %%" , iICnt);
		strMsg += "\n" + UT.gfnGetMetaData("MSG240" , "수정 : %%" , iUCnt);
		strMsg += "\n" + UT.gfnGetMetaData("MSG241" , "삭제 : %%" , iDCnt);
		
		if(!UT.confirm(objScreen , "" , strMsg)){
			return false;
		}
		
		for(var i=objDataset.getrowcount()-1;i>-1;i--){
			var realRowStat = objDataset.getrowoperation(i); ;
			var rowStat = objDataset.getdatabyname(i,FV_IMG_ROW_COLUMN);
			
			if(realRowStat == XFD_ROWOP_UPDATE && (rowStat == "N" || UT.isNull(rowStat) ) ){
				objDataset.cancelrowoperation(i);	//수정 원복함
			}
			
			if(realRowStat == XFD_ROWOP_UPDATE && rowStat == "D"){
				objDataset.deleterow(i);			//실질적 줄삭제
			}
		}		
	}
	
	return true;
}


/*
* 그리드 에서 이미지 사용시 저장시 확인 함수
* objGrid  	 : (object) 그리드 객체
*/
function gfnCellAutoPit(objGrid){
	var iNowCellSumWidth = 0;
	
	for(var i=0;i<objGrid.getcolumncount();i++){
		iNowCellSumWidth += objGrid.getcolumnwidth(i);
	}
	
	for(var i=0;i<objGrid.getcolumncount();i++){
		var iVu = 100 * objGrid.getcolumnwidth(i);
		var iPer = iVu / iNowCellSumWidth;
		
		var iNewVu = objGrid.getwidth() * iPer;
		var iNewWidth = iNewVu / 100;
		
		objGrid.setcolumnwidth(i,iNewWidth - 1);
	}
}


/*
* 그리드에서 컬럼 네임들을 반환홥니다
* objGrid  	 : (object) 그리드 객체
* [return] => (array)
*/
function gfnGetColumnNameAry(objGrid){
	var aryColumn = [];
	for(var i=0;i<objGrid.getcolumncount();i++){
		aryColumn[aryColumn.length] = objGrid.getcolumnname(i);
	}
	
	return aryColumn;
}



/*
* 그리드의 속성을 조작한다
* objGrid  	 : (object) 그리드 객체
* aryHash  	 : (array) Hash형 배열 확인한 컬럼 및 값
* aryColumn     : (array) 처리할 컬럼들
* strHandleType : (string) 처리할 속성  =>  "forecolor" , "backcolor" , "editable" , "input_type" , "image" , "pattern"
* strTrueValue  : (string/boolean) TRUE 시 처리할 속성값
* strFalseValue : (string/boolean) FALSE시 처리할 속성값
* ex) var aryHash = [];
*	 aryHash["COLUMN_A"] = ["A" , "AA"]; 		
*	 aryHash["COLUMN_B"] = ["A" , "BB"]; 		
*     var aryColumn = ["COLUMN_A" , "COLUMN_C"];
*     gfnGrdHandle(objGrid , aryHash , aryColumn , "forecolor" , factory.rgb(255, 0, 0) , factory.rgb(0, 0, 0)); 
*/
function gfnGrdHandle(objGrid , aryHash , aryColumn , strHandleType , strTrueValue , strFalseValue){
	var aryKeys = UT.gfnGetSortHashKeys(aryHash);
	var objDs = objGrid.getlinkxdataset();
	
	for(var i=0;i<objDs.getrowcount();i++){
		var blResult =  false;
		var iSameCnt = 0;
		
		for(var j=0;j<aryKeys.length;j++){
			var strColumn = aryKeys[j];		
			var aryValue = aryHash[aryKeys[j]];
			var strDiffData = objDs.getdatabyname(i , strColumn);	//비교할 값
			var blCatch = false;
			
			for(var k=0;k<aryValue.length;k++){
				if(strDiffData == aryValue[k]){
					blCatch = true;
					break;
				}
			}
			
			if(blCatch){
				iSameCnt++;
			}
		}

		if(iSameCnt == aryKeys.length){
			gfnGrdCellHandle(objGrid , i , aryColumn , strHandleType , strTrueValue);
		}else if(!UT.isNull(strFalseValue)){
			gfnGrdCellHandle(objGrid , i , aryColumn , strHandleType , strFalseValue);	
		}
	}
}

/*
* 그리드의 해당줄의 속성을 조작한다
* objGrid  	 : (object) 그리드 객체
* iRow  	    : (int) 처리할 줄
* aryColumn     : (array) 처리할 컬럼들
* strHandleType : (string) 처리할 속성  =>  "forecolor" , "backcolor" , "editable" , "input_type", "image" , "pattern"
* strValue  	: (string/boolean) 처리할 속성값
*/
function gfnGrdCellHandle(objGrid , iRow , aryColumn , strHandleType , strValue){
	for(var i=0;i<aryColumn.length;i++){
		var iCell = objGrid.getcolumn(aryColumn[i]);
		
		if(strHandleType == "forecolor"){
			objGrid.setitemforecolor(iRow , iCell , strValue); 
		}else if(strHandleType == "backcolor"){
			objGrid.setitembackcolor(iRow , iCell , strValue);  
		}else if(strHandleType == "editable"){
			objGrid.setitemeditable(iRow , iCell , strValue);  
		}else if(strHandleType == "input_type"){
			objGrid.setiteminputtype(iRow , iCell , strValue);  		
		}else if(strHandleType == "image"){
			objGrid.setitemimage(iRow , iCell , strValue);  		
		}else if(strHandleType == "pattern"){			
			objGrid.setitempattern(iRow , iCell , strValue , 0);  		
		}
	}
}

/*
* 그리드의 해당줄의 속성을 조작한다
* objGrid  	 : (object) 그리드 객체
* iRow  	    : (int) 처리할 줄
* aryColumn     : (array) 처리할 컬럼들
* StyleType     :  일반 : General(G)     비활성 : disable(D)
*/
function gfnHrGrdCellHandle(objGrid , iRow , aryColumn , strStyleType){
	for(var i=0;i<aryColumn.length;i++){
		var iCell = objGrid.getcolumn(aryColumn[i]);
		
		if(!UT.isNull(strStyleType))
		{
			switch(strStyleType)
			{
				case "G" :
					objGrid.setitemeditable(iRow, iCell, true);
					objGrid.setitembackcolor(iRow, iCell, factory.rgb(255,255,255));
					break;
				case "D" :
					objGrid.setitemeditable(iRow, iCell, false);
					objGrid.setitembackcolor(iRow, iCell, factory.rgb(247,251,255));
					break;
			}
		}		
	}
}


/*
* 그리드 use_check true 의 체크된 줄들만을 반환합니다
* objGrid  	 : (object) 그리드 객체
* [return] => (array) 
*/
function gfnGrdAllCheckedRows(objGrd){
	var aryRow = [];
	var nCheckedRow = objGrd.getcheckedrow(0);

	// 체크된 숫자만큼 for 루프를돈다.
	for(var cnt = 0; cnt < objGrd.getcheckedrowcount(); cnt++)
	{
		aryRow[aryRow.length] = nCheckedRow;
		nCheckedRow= objGrd.getcheckedrow(nCheckedRow+1);
	}

	return aryRow;
}



/*
* 그리드 use_check true 의 해당줄이 체크되어있는지의 여부를 반홥합니다
* objGrid  	 : (object) 그리드 객체
* [return] => (boolean) 체크시 true
*/
function gfnGrdRowIsChecked(objGrd , iRow){
	var blChecked = false;
	var aryCheck = gfnGrdAllCheckedRows(objGrd);
	
	for(var i=0;i<aryCheck.length;i++){
		if(iRow == aryCheck[i]){
			blChecked = true;
			break;
		}
	}
	
	return blChecked;
}



/*
* 그리드의 show check 사용시(만든 체크박스시) 전체 체크박스 클릭 함수
* strColumn  	 : (string) 그리드 객체
* objInst  	   : (object) 그리드 객체
* iHeaderRow  	: (int) 그리드 객체
* iHeaderCol  	: (int) 그리드 객체
*/
function gfnGrdAllCheck(strColumn , objInst , iHeaderRow , iHeaderCol){
	if(objInst.getColumn(strColumn) == iHeaderCol){
		var iCheck = "Y";
		var objDs = objInst.getlinkxdataset();

		if(objInst.getheadercheck(iHeaderRow , iHeaderCol)){	//체드 되어있으면
			objInst.setheadercheck(iHeaderRow , iHeaderCol , true , false);
		}else{
			objInst.setheadercheck(iHeaderRow , iHeaderCol , false , false);	
			iCheck = "N";		
		}

		//objInst.refresh();
		
		for(var i=0;i<objInst.getrowcount();i++){
			var blEnable = objInst.getitemeditable(i , iHeaderCol);

			if(blEnable){
				objDs.setdatabyname(i , strColumn , iCheck);
			}
		}
	}
}	

/*
* 해당 그리드의 값이 중복되는지 확인하여 중복되는 행만 리턴
* objScreen      : (object) 스크린 객체
* objGrid		: (object) 그리드 객체
* arryColumn	 : (string[]) 컬럼   =>   [ "A" , "B" ]
* [return] 	=> (중복되는 행 배열, 중복 없으면 null)
*/
function gfnGrdDuplicateCheck(objScreen, objGrid, arryColumn){
	var resultArr = [];
	for(var i=0; i<objGrid.getrowcount(); i++){
		//기준값
		var checkArr = new Array();
		for(var x in arryColumn) {
			var vu = objGrid.getitemtextbyname(i, arryColumn[x]);
			checkArr[x] = vu;
		}
		//비교값
		for(var j=i+1; j<objGrid.getrowcount(); j++){
			var cntSame = 0;
			for(var x in arryColumn) {
				var vu = objGrid.getitemtextbyname(j, arryColumn[x]);
				if (checkArr[x] == vu) cntSame++;
			}

			if (cntSame == arryColumn.length) {
				resultArr.push(checkArr);
			}
		}
	}

	if (resultArr.length > 0) {
		return resultArr;
	} else {
		return null;
	}
}

/*
* 해당 그리드의 체크컬럼 값이 체크된 행만 리턴
* objScreen      : (object) 스크린 객체
* objGrid		: (object) 그리드 객체
* checkCol       : (string) 체크컬럼명
* arryColumn	 : (string[]) 컬럼   =>   [ "A" , "B" ]
* [return] 	=> (체크된 행에서 저정한 컬럼만 추출한 배열, 체크 행이 없으면 null)
*/
function gfnGetCheckedRow(objScreen, objGrid, checkCol, arryColumn){
	var resultArr = [];
	for(var i=0; i<objGrid.getrowcount(); i++){
		var chkVal = objGrid.getitemtextbyname(i, checkCol);
		if (chkVal == "Y" || chkVal == "1") {
			var checkArr = new Map();
			for(var x in arryColumn) {
				var vu = objGrid.getitemtextbyname(i, arryColumn[x]);
				checkArr.set(arryColumn[x], vu);
			}

			if (checkArr.size > 0) {
				resultArr.push(checkArr);
			}
		}
	}

	if (resultArr.length > 0) {
		return resultArr;
	} else {
		return null;
	}
}

/* 그리드 소계 추가 - 단일 */
function gfnGrdAddstatmidSingle(objInst, strTitle)
{
    var objForeColor = factory.rgb(0, 0, 0);
	var objBackColorLB = factory.rgb(230, 243, 255);	// 연파랑
	var objBackColorDB = factory.rgb(204, 230, 255);	// 진파랑

    // 0번째 칼럼을 기준으로 구별 소계를 추가한다.
	// 0번째 칼럼 인덱스에 소계 타이틀을 지정한다.
	objInst.addstatmid(XFD_GRID_MIDSTAT_SUM, "0", strTitle, 0, objForeColor, objBackColorDB);

    // 추가된 소계 정보로 소계가 나타나도록 refresh 함수 호출	
    objInst.refresh();	
}

/* 그리드 소계 추가 - 이중 */
function gfnGrdAddstatmidDouble(objInst, strTitleIn, strTitleOut)
{
    var objForeColor = factory.rgb(0, 0, 0);
	var objBackColorLB = factory.rgb(230, 243, 255);	// 연파랑
	var objBackColorDB = factory.rgb(204, 230, 255);	// 진파랑

    // 0번째 칼럼과 1번째 칼럼을 기준으로 구별 소계를 추가한다.
    // 1번째 칼럼 인덱스에 소계 타이틀을 지정한다.
	objInst.addstatmid(XFD_GRID_MIDSTAT_SUM, "0,1", strTitleIn, 1, objForeColor, objBackColorLB);

    // 0번째 칼럼을 기준으로 구별 소계를 추가한다.
	// 0번째 칼럼 인덱스에 소계 타이틀을 지정한다.
	objInst.addstatmid(XFD_GRID_MIDSTAT_SUM, "0", strTitleOut, 0, objForeColor, objBackColorDB);

    // 추가된 소계 정보로 소계가 나타나도록 refresh 함수 호출	
    objInst.refresh();	
}

/* 그리드 합계 타이블 폰트 수정 */
function gfnGrdSetstatrowitemfont(objInst)
{
	// 합계 타이블 폰트 지정 (맑은 고딕, 9, 굵게)
	objInst.setstatrowitemfont(0, 0, "맑은 고딕", 9, true, false, false);	
	
    // 수정된 속성이 반영되도록 refresh 함수 호출	
    objInst.refresh();	
}
