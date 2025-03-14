/*------------------------------------
* program id : Pso1090
* desc	   : 부서별진도현황
* dev date   : 2023-08-25
* made by    : SEYUN
*-------------------------------------*/

var fvSelectedRow;	//그리드 선택된 row
var fvauthScope = "";

// 팝업화면으로 전달할 파라미터 설정
var objPopupExtraData = {
	P_DATA1: "",	      	// 팝업화면으로 전달할 데이터1
	P_DATA2: "",	      	// 팝업화면으로 전달할 데이터2
	P_DATA3: "",	      	// 팝업화면으로 전달할 데이터3
	P_DATA4: "",	      	// 팝업화면으로 전달할 데이터4
	P_DATA5: "",	      	// 팝업화면으로 전달할 데이터5
	P_DATA6: "",	      	// 팝업화면으로 전달할 데이터6
	P_DATA7: "",	      	// 팝업화면으로 전달할 데이터7
	P_DATA8: "",	      	// 팝업화면으로 전달할 데이터8
	RETURN_FUNCTION_NAME: "", // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
	clear: function(){
		this.P_DATA1 = "";
		this.P_DATA2 = "";
		this.P_DATA3 = "";
		this.P_DATA4 = "";
		this.P_DATA5 = "";
		this.P_DATA6 = "";
		this.P_DATA7 = "";
		this.P_DATA8 = "";
		this.RETURN_FUNCTION_NAME = "";
	}
};

// 파일첨부 팝업화면으로 전달할 파라미터 설정
var objPopupAttData = {
	P_REF_ID: "",      	   // 팝업화면으로 전달할 데이터1
	P_MODE: "",			   // 팝업화면으로 전달할 데이터1
	P_FILE_GUBUN: "",	     // 팝업화면으로 전달할 데이터2
	P_REF_NAME: "",	       // 팝업화면으로 전달할 데이터3
	P_DIR_TYPE: "",	       // 팝업화면으로 전달할 데이터4
	P_OU_CODE: "",	        // 팝업화면으로 전달할 데이터5
	RET_FUNC_NAME: "",  	  // 팝업화면에서 데이터를 전달받기 위해 사용할 함수명
	clear: function(){
		this.P_REF_ID = "";
		this.P_MODE = "";
		this.P_FILE_GUBUN = "";
		this.P_REF_NAME = "";
		this.P_DIR_TYPE = "";
		this.P_OU_CODE = "";
		this.RET_FUNC_NAME = "";
	}
};

/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.init(this.screen);  	// 모든 폼 Onload 최초 공통
	
	this.fnDeptCodeLoad();
	this.fnDsSearchSet();   	//검색조건 세팅	
	
//	if(INI.GV_USER_TYPE == "V"){
//		this.btnCommonSearch_on_mouseup();  //최초조회	
//	}
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	
	UT.gfnGetOuCodes(this.dsOuCode);					  // ou code set
	UT.gfnGetCommCodes(this.dsPsoGrade, "P007"); 	     // 개발착수등급구분
	UT.gfnTranceCodeSet(this.dsPsoGrade, "A");  	      // 전체추가
	UT.gfnGetCommCodes(this.dsProgGrade, "P013"); 	    // PSO진행등급구분
	UT.gfnTranceCodeSet(this.dsProgGrade, "A");  	     // 전체추가
	
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
	//초기화
    this.cboOuCode.setselectedcode(INI.GV_OU_CODE);
	//OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.cboOuCode.setenable( false );
    }
	
	this.chkOngoing.settext("Y");
	
	this.dtpMakePDateF.settext(UT.getDate("%Y") + "0101");
	this.dtpMakePDateT.settext(UT.getDate("%Y%M%D"));
//	//사용자 권한 Control
//    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
//        fvauthScope = "DEPT";
//    } else {
//		if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
//	    	fvauthScope = "EMP";  
//	    } else{
//        	fvauthScope = "PINFO";
//        }  
//    }
		
//	//사용자 유형 Control (외부사용자)
//	if(INI.GV_USER_TYPE == "V"){
//		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_CODE",INI.GV_VENDOR_CODE);
//		this.dsSearch.setdatabyname(this.dsSearch.getpos(),"VENDOR_NAME",INI.GV_VENDOR_NAME);
//		UT.gfnHrEditorStyle(this.edtVendorName, "D");
//		this.btnVendorNamePop.setenable(false);
//		
//		this.btnVendorChk.setenable(true);
//		this.btnChk.setenable(false);
//		this.btnAddRow.setenable(false);
//		this.btnDelRow.setenable(false);
//	} else {
//		this.btnVendorChk.setenable(false);
//		this.btnChk.setenable(true);
//		this.btnAddRow.setenable(true);
//		this.btnDelRow.setenable(true);
//	}
//	
}

/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "selectList")
	{		
		if(this.dsPsoList.getrowcount() == 0){
			UT.alert(screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			return;
		} else {
			UT.statMsg(screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsPsoList.getrowcount());	//하단메세지 처리
			
			var iCell = this.grdDeptList.getcolumn("AVG_GRADE");
			for(var i=0;i<this.dsPsoDeptList.getrowcount();i++){
				//등급:S,A(파랑), B,C,D(빨강)
				if( this.dsPsoDeptList.getdatabyname(i,"AVG_GRADE") == "S" || this.dsPsoDeptList.getdatabyname(i,"AVG_GRADE") == "A" ) {
					this.grdDeptList.setitemforecolor(i, iCell, factory.rgb(0,0,255));
				} else if ( this.dsPsoDeptList.getdatabyname(i,"AVG_GRADE") == "B" || this.dsPsoDeptList.getdatabyname(i,"AVG_GRADE") == "C" || this.dsPsoDeptList.getdatabyname(i,"AVG_GRADE") == "D") {
					this.grdDeptList.setitemforecolor(i, iCell, factory.rgb(255,0,0));
				} else {
					this.grdDeptList.setitemforecolor(i, iCell, factory.rgb(0,0,0));
				}
			}	
			this.grdDeptList.refresh();
			
			this.chartRate_on_libload();
		}

	}
	
//	if(recv_userheader == "insertAndselect")
//	{
//		UT.alert(this.screen , "MSG010" , "저장되었습니다.");	
//		UT.statMsg(this.screen , "MSG010" , "저장되었습니다.");
//		this.fnSearch();
//	}	
}

/*
* 담당부서 코드를 로드합니다
*/
function fnDeptCodeLoad(){
	
	var params = "";
	params = params + " OU_CODE=" + INI.GV_OU_CODE;
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoDept , "NONE" , "CLEAR" , "" , "" , "TR_SELECT_DEPT_CODE");
	
	TRN.gfnCommonTransactionClear(this.screen , "TR_SELECT_DEPT_CODE");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DELAY_DEPT" , "" , "dsPsoDept" , params);
	TRN.gfnCommonTransactionRun(this.screen , "selectLoadDept" , true , false , false , "TR_SELECT_DEPT_CODE");	

	UT.gfnTranceCodeSet(this.dsPsoDept, "N");  	     // 빈줄추가
}

/*
* 부서별진도현황 정보 데이터 가져오기.
* DB조회
*/
function fnSearch(){		
	
	//회사코드(OU_CODE)
	var ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	if(UT.isNull(ouCode) ){
	    UT.alert(this.screen , "MSG582" , "회사를 먼저 선택바랍니다.");
		this.cboOuCode.setfocus();
	    return;
	}
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoDeptList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsPsoList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");	

	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DEPT_PRO_RATE2" ,"dsSearch" , "dsPsoDeptList");	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsPsoMapper.SELECT_PSO_DEPT_PRO2" ,"dsSearch" , "dsPsoList");	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "selectList" , false , true , false , "TR_SEARCH");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}

/*
 * 엔터처리
 */
function fnEnter(keycode){
	if(keycode == 13){
		this.btnCommonSearch_on_mouseup();
	}	
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	var result = this.chartRate.clear();
	this.fnSearch();
}

function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

function cboOuCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtProjectCode_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function edtProjectCode_on_changed(objInst, prev_text, curr_text, event_type)
{
	if( event_type == 5 ){
		if (!curr_text) {
			this.edtProjectCode.settext("");
		} else {
			this.fnProjectCodePopupCall(this.edtProjectCode.gettext());
		}
	}
}

/*
* 프로젝정보 Callback
*/
function fnProjectCodeClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , aryHash["PROJECT_CODE"]);
	} else {
		this.dsSearch.setdatabyname(iRow , "PROJECT_CODE" , "");
	}
}

function btnProjectCodePop_on_click(objInst)
{
	this.fnProjectCodePopupCall("");
}

function fnProjectCodePopupCall(projectCode) {
	var strPopupName = UT.gfnGetMetaData("LABEL02628", "PSO 프로젝트 조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = projectCode;
	objPopupExtraData.P_DATA6 = fvauthScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnProjectCodeClosePopCallback";
	screen.loadportletpopup("ProjectCodeSelect", "/PSO/Pso1031", strPopupName, false, 0, 0, 0, 1196, 440, true, true, false, objPopupExtraData);
}

function cboDeptName_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function cboPsoGrade_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function dtpMakePDateF_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function dtpMakePDateF_on_change(objInst, event_type)
{
	var datelen = this.dtpMakePDateF.gettext();
	
	if(datelen.length == "8"){
		if(this.dtpMakePDateF.gettext() != "" && this.dtpMakePDateT.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.dtpMakePDateF , this.dtpMakePDateT , true);
			if(!rt){
				this.dtpMakePDateF.settext("");
				this.dtpMakePDateF.setfocus();
			}
			
		}
	} 
}

function dtpMakePDateT_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

function dtpMakePDateT_on_change(objInst, event_type)
{
	var datelen = this.dtpMakePDateT.gettext();
	
	if(datelen.length == "8"){
		if(this.dtpMakePDateF.gettext() != "" && this.dtpMakePDateT.gettext())
		{
			var rt = UT.gfnDateObjDiff(this.screen , this.dtpMakePDateF , this.dtpMakePDateT , true);
			if(!rt){
				this.dtpMakePDateT.settext("");
				this.dtpMakePDateT.setfocus();
			}
			
		}
	}
}

function cboProGrade_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	this.fnEnter(keycode);
	return 0;
}

// 차트 라이브러리가 모두 로드 되었을때 호출되는 이벤트
function chartRate_on_libload(objInst, chart_type)
{
	var chart_type;
	
	// 차트 타입 구하기
	chart_type = this.chartRate.getcharttype();
	// 차트 타입이 xy 차트인 경우, xy차트 생성 
	if(chart_type == 1){
		this.fnCreateXYChart();
	}
}

// xy차트 생성
function fnCreateXYChart(objInst)
{
	// 생성된 root 구하기
	var root = this.chartRate.getroot();
	
	// 루트에서 모든 요소를 ​​제거
	//root.container.children.clear();
	
	// Set themes
	// https://www.amcharts.com/docs/v5/concepts/themes/
	root.setThemes([
	  am5themes_Animated.new(root)
	]);
	
	// Create chart
	var chart = root.container.children.push(
	  am5xy.XYChart.new(root, {
	    panX: false,
	    panY: false
	    //panX: true,
	    //panY: true,
	    //wheelX: "panX",
	    //wheelY: "zoomX"
	  })
	);
	
	// Add cursor
	// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
	var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
	  //behavior: "zoomY"
	}));
//	cursor.lineX.set("visible", false);
	cursor.lineY.set("visible", false);

	
	// Create axes
	// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
	// var yRenderer = am5xy.AxisRendererY.new(root, { minGridDistance: 30 });
	// y축 간격 0으로 지정하여 y축 전체 라벨 조회 가능
	var yRenderer = am5xy.AxisRendererY.new(root, { minGridDistance: 0 });
	
	var yAxis = chart.yAxes.push(
	  am5xy.CategoryAxis.new(root, {
	    maxDeviation: 0.3,
	    categoryField: "PSO_DEPT_NAME",
	    renderer: yRenderer
	    //tooltip: am5.Tooltip.new(root, {})
	  })
	);
	
	var xAxis = chart.xAxes.push(
	  am5xy.ValueAxis.new(root, {
		min: 0,
		max: 100,
	    maxDeviation: 0.3,
	    renderer: am5xy.AxisRendererX.new(root, {})
	  })
	);
	
	// Create series
	// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
	var series = chart.series.push(
	  am5xy.ColumnSeries.new(root, {
	    name: "Series 1",
	    xAxis: xAxis,
	    yAxis: yAxis,
	    valueXField: "AVG_PRO_RATE",
		categoryYField: "PSO_DEPT_NAME",
	    sequencedInterpolation: true
		//tooltip: am5.Tooltip.new(root, {
		  //labelText: "{valueX}"
		  //pointerOrientation: "horizontal",
          //labelText: "{categoryY}: {valueX}"
		//})
	  })
	);
	
	series.columns.template.setAll({
	  height: am5.percent(70),
	  cornerRadiusTL: 5,
  	cornerRadiusTR: 5,
  	strokeOpacity: 0
	});
	
	series.columns.template.adapters.add("fill", (fill, target) => {
	  return chart.get("colors").getIndex(series.columns.indexOf(target));
	});
	
	series.columns.template.adapters.add("stroke", (stroke, target) => {
	  return chart.get("colors").getIndex(series.columns.indexOf(target));
	});
	
	// Add Label bullet
	series.bullets.push(function () {
	  return am5.Bullet.new(root, {
	    locationX: 1,
	    sprite: am5.Label.new(root, {
	      text: "{valueXWorking.formatNumber('#.##')}",
	      fill: root.interfaceColors.get("alternativeText"),
	      centerX: am5.p100,
		  centerY: am5.p50,
	      populateText: true
	    })
	  });
	});
		
	// Processor needs to be set before data (숫자데이터 자동변환)
	series.data.processor = am5.DataProcessor.new(root, {
	  numericFields: ["AVG_PRO_RATE"]
	});

	// Set data
//	var datalist = [];
//	
//	for(var i=0;i<this.dsPsoDeptList.getrowcount();i++){
//		var aryHash = [];
//		
//		for(var j=0;j<this.dsPsoDeptList.getcolumncount();j++){
//			var strColumn = this.dsPsoDeptList.getcolumnid(j);
//			if(strColumn=="AVG_PRO_RATE"){
//				aryHash[strColumn] = Number(this.dsPsoDeptList.getdatabyname(i , strColumn));
//			} else {
//				aryHash[strColumn] = this.dsPsoDeptList.getdatabyname(i , strColumn);
//			}
//		}
//		
//		datalist[i] = aryHash;
//	}
	var datalist = UT.gfnDsToAry(this.dsPsoDeptList);
	yAxis.data.setAll(datalist);
	series.data.setAll(datalist);
	
	// Make stuff animate on load
	// https://www.amcharts.com/docs/v5/concepts/animations/
	series.appear(1000);
	chart.appear(1000, 100);
}


	