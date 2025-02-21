/*------------------------------------
* program id : Oms2010
* desc	   : 중장기계획 분석
* dev date   : 2023-07-06
* made by    : SEYUN
*-------------------------------------*/
var ouCode;
var authScope;
var fvSelectedRow;	//그리드 선택된 row
var authScope;

// 등록 화면으로 전달할 파라미터 설정
var objRegExtraData = {
	P_DATA1: "",	      	// 등록 화면으로 전달할 데이터1
	P_DATA2: "",	      	// 등록 화면으로 전달할 데이터2
	P_DATA3: "",	      	// 등록 화면으로 전달할 데이터3
	P_DATA4: "",	      	// 등록 화면으로 전달할 데이터4	
};
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

/*
* 페이지 온로드
*/
function screen_on_load()
{	
	INI.init(this.screen);  	 // 모든 폼 Onload 최초 공통
	this.fnDsSearchSet();   //검색조건 세팅	
	this.fnDsSet();              // DATASET 세팅
    this.fnSetInitControl();     // 초기 컨트롤 속성 설정	
	//this.btnCommonSearch_on_mouseup();
}



/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	var iRow = this.dsSearch.getrowcount();
	this.dsSearch.insertrow(iRow);
	
    ouCode = INI.GV_OU_CODE;

	//기준년
	var today = new Date();
	var dateS=Number(today.getFullYear())
    this.fldDateS.settext(dateS);

   UT.gfnHrEditorStyle(this.comOu, "D");
}
/*
* 데이터셋 
*/
function fnDsSet(){

	UT.gfnGetOuCodes(this.dsOU);	// ou code set
		
	UT.gfnGetCommCodes(this.dsActStatus, "O015");		
	UT.gfnGetCommCodes(this.dsCustGroup, "O014");	 //고객그룹(O014)		
	UT.gfnGetCommCodes(this.dsProGroup, "O007");	  //제품군 (O007)		
	UT.gfnGetCommCodes(this.dsImportance, "O017");	//중요도 코드(O017)				
	UT.gfnGetCommCodes(this.dsDetailStatus, "O016");	//Detail Status Code(O016)				
	UT.gfnGetCommCodes(this.dsCustNa, "O005");	//D고객국가(O005)
	var rowConnt = this.dsDetailStatus.getrowcount();
	for(  var iRow = 0; iRow < rowConnt ; iRow++) {
		var code = this.dsDetailStatus.getdatabyname(iRow,"CODE");
	   if(code == "D10"){	
	   	this.dsDetailStatus.removerow( iRow );
	   }
	}
	this.fnSearchExchange();
	this.fnSetTitle();		
}

/*
* 버젼 정보 데이터 가져오기.
* DB조회
*/
function fnSearchExchange(){		
	var pamrams = "";
	params = "OU_CODE=" + ouCode;
	params = params + " BASE_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"BASE_YEAR");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsExchange , "NONE" , "CLEAR" ,  "" , "" , "TR_EXCHANGE");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_EXCHANGE");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmeAnalysisMapper.SELECT_EXCHANGE" ,"" , "dsExchange", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_EXCHANGE" , true , true , false , "TR_EXCHANGE");;	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}
/*
* 필드 title 정보 데이터 가져오기.
* DB조회
*/
function fnSetTitle(){		
	var pamrams = "";
	params = "OU_CODE=" + ouCode;
	params = params + " BASE_YEAR=" + this.dsSearch.getdatabyname(this.dsSearch.getpos(),"BASE_YEAR");
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsMonth , "NONE" , "CLEAR" ,  "" , "" , "TR_MONTH");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_MONTH");	//트랜젝션 데이터셋 초기화 (필수)
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmeAnalysisMapper.SELECT_MONTH" ,"" , "dsMonth", params);	//조회만	
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_MONTH" , true , true , false , "TR_MONTH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
    var qty = UT.gfnGetMetaData("LABEL02667", "수량"); 
    var price = UT.gfnGetMetaData("LABEL02668", "단가"); 
    var amt = UT.gfnGetMetaData("LABEL01089", "금액"); 
    var amt_ex = UT.gfnGetMetaData("LABEL02670", "금액(환율적용)"); 
    this.grdList.setheadertext(0, 33, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M1")+" "+qty);
    this.grdList.setheadertext(0, 34, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M2")+" "+qty);
    this.grdList.setheadertext(0, 35, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M3")+" "+qty);
    this.grdList.setheadertext(0, 36, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M4")+" "+qty);
    this.grdList.setheadertext(0, 37, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M5")+" "+qty);
    this.grdList.setheadertext(0, 38, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M6")+" "+qty);
    this.grdList.setheadertext(0, 39, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M7")+" "+qty);
    this.grdList.setheadertext(0, 40, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M8")+" "+qty);
    this.grdList.setheadertext(0, 41, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M9")+" "+qty);
    this.grdList.setheadertext(0, 42, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M10")+" "+qty);
    this.grdList.setheadertext(0, 43, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M11")+" "+qty);
    this.grdList.setheadertext(0, 44, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M12")+" "+qty);
    this.grdList.setheadertext(0, 45, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y1")+" "+qty);
    this.grdList.setheadertext(0, 46, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y2")+" "+qty);
    this.grdList.setheadertext(0, 47, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y3")+" "+qty);
    this.grdList.setheadertext(0, 48, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y4")+" "+qty);
    this.grdList.setheadertext(0, 49, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y5")+" "+qty);
    this.grdList.setheadertext(0, 50, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y6")+" "+qty);
    this.grdList.setheadertext(0, 51, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y7")+" "+qty);
    this.grdList.setheadertext(0, 52, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y8")+" "+qty);
    this.grdList.setheadertext(0, 53, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y9")+" "+qty);
    this.grdList.setheadertext(0, 54, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y10")+" "+qty);
    this.grdList.setheadertext(0, 55, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y11")+" "+qty);
    this.grdList.setheadertext(0, 56, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y12")+" "+qty);
    this.grdList.setheadertext(0, 57, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y13")+" "+qty);
    this.grdList.setheadertext(0, 58, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y14")+" "+qty);

    this.grdList.setheadertext(0, 59, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M1")+" "+price);
    this.grdList.setheadertext(0, 60, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M2")+" "+price);
    this.grdList.setheadertext(0, 61, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M3")+" "+price);
    this.grdList.setheadertext(0, 62, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M4")+" "+price);
    this.grdList.setheadertext(0, 63, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M5")+" "+price);
    this.grdList.setheadertext(0, 64, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M6")+" "+price);
    this.grdList.setheadertext(0, 65, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M7")+" "+price);
    this.grdList.setheadertext(0, 66, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M8")+" "+price);
    this.grdList.setheadertext(0, 67, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M9")+" "+price);
    this.grdList.setheadertext(0, 68, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M10")+" "+price);
    this.grdList.setheadertext(0, 69, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M11")+" "+price);
    this.grdList.setheadertext(0, 70, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M12")+" "+price);
    this.grdList.setheadertext(0, 71, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y1")+" "+price);
    this.grdList.setheadertext(0, 72, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y2")+" "+price);
    this.grdList.setheadertext(0, 73, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y3")+" "+price);
    this.grdList.setheadertext(0, 74, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y4")+" "+price);
    this.grdList.setheadertext(0, 75, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y5")+" "+price);
    this.grdList.setheadertext(0, 76, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y6")+" "+price);
    this.grdList.setheadertext(0, 77, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y7")+" "+price);
    this.grdList.setheadertext(0, 78, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y8")+" "+price);
    this.grdList.setheadertext(0, 79, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y9")+" "+price);
    this.grdList.setheadertext(0, 80, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y10")+" "+price);
    this.grdList.setheadertext(0, 81, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y11")+" "+price);
    this.grdList.setheadertext(0, 82, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y12")+" "+price);
    this.grdList.setheadertext(0, 83, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y13")+" "+price);
    this.grdList.setheadertext(0, 84, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y14")+" "+price);


    this.grdList.setheadertext(0, 85, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M1")+" "+amt);
    this.grdList.setheadertext(0, 86, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M2")+" "+amt);
    this.grdList.setheadertext(0, 87, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M3")+" "+amt);
    this.grdList.setheadertext(0, 88, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M4")+" "+amt);
    this.grdList.setheadertext(0, 89, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M5")+" "+amt);
    this.grdList.setheadertext(0, 90, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M6")+" "+amt);
    this.grdList.setheadertext(0, 91, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M7")+" "+amt);
    this.grdList.setheadertext(0, 92, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M8")+" "+amt);
    this.grdList.setheadertext(0, 93, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M9")+" "+amt);
    this.grdList.setheadertext(0, 94, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M10")+" "+amt);
    this.grdList.setheadertext(0, 95, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M11")+" "+amt);
    this.grdList.setheadertext(0, 96, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M12")+" "+amt);
    this.grdList.setheadertext(0, 97, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y1")+" "+amt);
    this.grdList.setheadertext(0, 98, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y2")+" "+amt);
    this.grdList.setheadertext(0, 99, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y3")+" "+amt);
    this.grdList.setheadertext(0, 100, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y4")+" "+amt);
    this.grdList.setheadertext(0, 101, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y5")+" "+amt);
    this.grdList.setheadertext(0, 102, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y6")+" "+amt);
    this.grdList.setheadertext(0, 103, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y7")+" "+amt);
    this.grdList.setheadertext(0, 104, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y8")+" "+amt);
    this.grdList.setheadertext(0, 105, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y9")+" "+amt);
    this.grdList.setheadertext(0, 106, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y10")+" "+amt);
    this.grdList.setheadertext(0, 107, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y11")+" "+amt);
    this.grdList.setheadertext(0, 108, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y12")+" "+amt);
    this.grdList.setheadertext(0, 109, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y13")+" "+amt);
    this.grdList.setheadertext(0, 110, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y14")+" "+amt);


    this.grdList.setheadertext(0, 113, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M1")+" "+amt_ex);
    this.grdList.setheadertext(0, 114, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M2")+" "+amt_ex);
    this.grdList.setheadertext(0, 115, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M3")+" "+amt_ex);
    this.grdList.setheadertext(0, 116, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M4")+" "+amt_ex);
    this.grdList.setheadertext(0, 117, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M5")+" "+amt_ex);
    this.grdList.setheadertext(0, 118, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M6")+" "+amt_ex);
    this.grdList.setheadertext(0, 119, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M7")+" "+amt_ex);
    this.grdList.setheadertext(0, 120, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M8")+" "+amt_ex);
    this.grdList.setheadertext(0, 121, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M9")+" "+amt_ex);
    this.grdList.setheadertext(0, 122, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M10")+" "+amt_ex);
    this.grdList.setheadertext(0, 123, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M11")+" "+amt_ex);
    this.grdList.setheadertext(0, 124, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"M12")+" "+amt_ex);
    this.grdList.setheadertext(0, 125, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y1")+" "+amt_ex);
    this.grdList.setheadertext(0, 126, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y2")+" "+amt_ex);
    this.grdList.setheadertext(0, 127, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y3")+" "+amt_ex);
    this.grdList.setheadertext(0, 128, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y4")+" "+amt_ex);
    this.grdList.setheadertext(0, 129, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y5")+" "+amt_ex);
    this.grdList.setheadertext(0, 130, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y6")+" "+amt_ex);
    this.grdList.setheadertext(0, 131, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y7")+" "+amt_ex);
    this.grdList.setheadertext(0, 132, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y8")+" "+amt_ex);
    this.grdList.setheadertext(0, 133, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y9")+" "+amt_ex);
    this.grdList.setheadertext(0, 134, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y10")+" "+amt_ex);
    this.grdList.setheadertext(0, 135, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y11")+" "+amt_ex);
    this.grdList.setheadertext(0, 136, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y12")+" "+amt_ex);
    this.grdList.setheadertext(0, 137, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y13")+" "+amt_ex);
    this.grdList.setheadertext(0, 138, this.dsMonth.getdatabyname(this.dsMonth.getpos(),"Y14")+" "+amt_ex);

}
/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화
    this.comOu.setselectedcodeex(ouCode,true,true); 


    
//    this.fldLatestDegree.settext("Y"); 
 
    //OU변경 권한을 가진 자 만 활성
    if( INI.GV_AT_OU != "Y"){
	   this.comOu.setenable( false );
    }


    //내부 사용자인지 확인
    //내부 사용자이면 협력업체 변경 가능
    //협력업체이면 고정
    var userType;
    if( INI.GV_USER_TYPE == "U"){   //유저사용자유형 (내부사용자:U, 외부사용자:V)
	   userType = "INNER"; //INNER: 내부사용자 
    } else{
	   userType = "OUTER"; //INNER: 내부사용자 
    }
    
    
    
    //사용자 변경권한 
    if(INI.gfnIsAuthDeptEtc(this.screen,"AT_DEPT")) {         
        authScope = "DEPT";
    } else {
        if( INI.gfnIsAuthDeptEtc(this.screen,"AT_EMP") ){
	    	authScope = "EMP";  
//	        this.comSite.setenable( false );
 //         this.fldDeptName.setenable(false);
 //           this.btnDeptPop.setvisible(false);
	    } else{
        	authScope = "PINFO";
             //개인권한은 수정할 수 없도록 막음
//	        this.comSite.setenable( false );
/*            this.fldDeptName.setenable(false);
            this.btnDeptPop.setvisible(false);
            this.fldEmpName.setenable(false);
            this.btnEmpNamePop.setvisible(false);
            this.fldEmpNo.setenable(false);
            this.btnEmpNoPop.setvisible(false); */
        }  
    
   }

}



/*
* 페이지 비동기 트랜젝션 호출
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	UT.gfnWaitDestroy(this.screen);
	
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "SELECT") 
	{		
		if(this.dsList.getrowcount() == 0){
			UT.alert(this.screen , "MSG001" , "검색 결과가 없습니다.");	//경고창 처리
			UT.statMsg(this.screen , "MSG001" , "검색 결과가 없습니다.");
			return;
		} else {
			UT.statMsg(this.screen , "MSG003" , "%% 건의 데이터가 조회되었습니다." , this.dsList.getrowcount());	//하단메세지 처리
		}
	}
	if(recv_userheader == "SELECT_EXCHANGE") 
	{		
		var rowConnt = this.dsExchange.getrowcount();
		for(  var iRow = 0; iRow < rowConnt ; iRow++) {
			var name = this.dsExchange.getdatabyname(iRow,"NAME");
		   if(name == "사업계획환율"){	
			var code = this.dsExchange.getdatabyname(iRow,"CODE");
			this.dsSearch.setdatabyname(this.dsSearch.getpos(),"EXCHNAGE_CODE",code );
			//this.ComExchange.setselectedcodeex(code,true,true); 
		   }
		}
	}
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{

	var year = this.fldDateS.gettext();

	if (! year ) {
		UT.alert(this.screen, "MSG524", "기준년을 입력하세요"); 
		return; 
	}

    var exchangeCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"EXCHNAGE_CODE");
	if ( UT.isNull( exchangeCode) ) {
		var strMetaData = UT.gfnGetMetaData("LABEL02666", "*환율버젼"); 
	    UT.alert(this.screen , "MSG004" , "환율버젼은(는) 필수입력항목입니다.",strMetaData);
		this.ComExchange.setfocus();
		return; 
	}
	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");		
	
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmeAnalysisMapper.SELECT_LONG_PLAN_ANALYSIS" ,"dsSearch" , "dsList", "TR_SEARCH");	//조회만		
	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	//진행중이 보이려면 싱크 방식을 false로 해야됨. false , true , true 로 설정 
	// screen_on_submitcomplete 힘수에 UT.gfnWaitDestroy(screen); 코딩 들어 있는지 확인 
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , false , true , true , "TR_SEARCH");	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}


function screen_on_messagebox(messagebox_id, result)
{

}




function screen_on_size(window_width, window_height)
{
	INI.gfnPageIniProcessor(this.screen);	
}



function grdMaster_on_itemdblclick(objInst, nDblClickRow, nDblClickColumn, bBtnClick)
{
	this.btnView_on_mouseup();
}

/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

/*
* 업체정보 Callback
*/
function fnVendorClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , aryHash["VENDOR_CODE"]);
		this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , aryHash["VENDOR_NAME"]);
	}else {
        this.dsSearch.setdatabyname(iRow , "VENDOR_CODE" , "");
        this.dsSearch.setdatabyname(iRow , "VENDOR_NAME" , "");	
    }
}

function btnVendorPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("", "협력업체정보조회"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	objPopupExtraData.P_DATA2 = "";
	objPopupExtraData.P_DATA3 = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"VENDOR_NAME");
	objPopupExtraData.P_DATA6 = authScope;	  //권한
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnVendorClosePopCallback";
	screen.loadportletpopup("VendorNameSelect", "/FRAME/popupVendor", "협력업체정보조회", false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
}

/*
* 기준날짜에서 nDayGap일만큼 지난 년월일을 8자리 년월일 형태로 반환한다.
* strDate : (string) YYYYMMDD 형태의 날짜 strDate 기준 날짜 년월일
* nDayGap : (int) YYYYMMDD 형태의 날짜 nDayGap 현재일을 기준으로 날 차이, 음수는 이전 날자
* [return] => (string) 계산된 년월일(YYYY-MM-DD)
*/
function fnGetDateByDayGap(strDate, nDayGap)
{
	try {
		if(UT.gfnIsYYYYMMDD(strDate) == false) {
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

		nCalcMM = nCalcMM < 10 ? UT.gfnLpad("" + nCalcMM, "0" , 2) : nCalcMM; 	// 달이 10보다 적으면 앞에 0 붙이기
		
		var nCalcDD = objTempDate.getDate(); //날짜 가져오기
		nCalcDD = nCalcDD < 10 ? UT.gfnLpad("" + nCalcDD, "0" , 2) : nCalcDD; 	// 날짜가 10보다 작으면 앞에 0 붙이기

		var strCalcDate = nCalcYYYY.toString(10)+"-" + nCalcMM.toString(10)+"-"+ nCalcDD.toString(10); 
		return strCalcDate; 
	}
	catch(EXCEP) {
		return "";
	}
}

function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{	
    ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
	//UT.gfnGetUserSiteCodes(this.dsSite,ouCode,INI.GV_USER_ID);	
    //  this.comSite.setselectedindex(0);   	
}



function grdList_on_itemclick(objInst, nClickRow, nClickColumn, bBtnClick, nImgIndex, strImgUrl)
{
	this.grdList.setcheckedrow(nClickRow, true);
}


function btnCustomerPop_on_click(objInst)
{
	var strPopupName = UT.gfnGetMetaData("LABEL02401", "고객정보"); 
	objPopupExtraData.clear();
	objPopupExtraData.P_DATA1 = ouCode;
	//objPopupExtraData.P_DATA2 = this.dsProject.getdatabyname(this.dsProject.getpos(),"CUSTOMER_NAME");
	objPopupExtraData.P_DATA3 = "";
	objPopupExtraData.RETURN_FUNCTION_NAME = "fnPopupCustClosePopCallback";
	screen.loadportletpopup(strPopupName, "/FRAME/popupCust", strPopupName, false, 0, 0, 0, 686, 410, true, true, false, objPopupExtraData);
	
}
/*
* 고객정보 Callback
*/
function fnPopupCustClosePopCallback(aryHash) 
{ 
	var iRow = this.dsSearch.getpos();
	if (UT.gfnGetAryHashCount(aryHash) != 0) {
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_NAME" , aryHash["CUSTOMER_NAME"]);
		this.dsSearch.setdatabyname(iRow , "CUSTOMER_ID" , aryHash["CUSTOMER_ID"]);
	}
}

function edtCustomerName_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "CUSTOMER_ID" , "");
	return 0;
}




function btnDownLoad_on_mouseup(objInst)
{
	var excel_file_name, is_show_option, is_save_onerow,
	is_include_pattern, is_include_header, is_include_statdata,
	is_include_border, is_include_align, is_include_backcolor, 
	is_include_font, is_include_forecolor, is_include_itemstyle, 
	is_include_itemmerge, is_include_linenumber, is_include_masking, 
	file_download_type, convert_number_type, is_checkrow_only,
	is_save_onerow_mergedata, excel_password;
	var day = UT.getDate();
	excel_file_name = "planAnalytics_"+day+".xlsx";
	is_show_option = false;
	is_save_onerow = true;
	is_include_pattern = true;
	is_include_header = true;
	is_include_statdata = true;
	is_include_border = true;
	is_include_align = true;
	is_include_backcolor = true;
	is_include_font = true;
	is_include_forecolor = true;
	is_include_itemstyle = true;
	is_include_itemmerge = true;
	is_include_linenumber = true;
	is_include_masking = true;
	file_download_type = 0;		// 0: local download, 1: server_save_only
	convert_number_type = 0;
	is_checkrow_only = false;
	is_save_onerow_mergedata = true;
	excel_password = "";
	
	this.grdList.downloadexcelex(excel_file_name, is_show_option, is_save_onerow,
		is_include_pattern, is_include_header, is_include_statdata,
		is_include_border, is_include_align, is_include_backcolor, 
		is_include_font, is_include_forecolor, is_include_itemstyle, 
		is_include_itemmerge, is_include_linenumber, is_include_masking, 
		file_download_type, convert_number_type, is_checkrow_only,
		is_save_onerow_mergedata, excel_password);	
		
/*	var file_name, 
		is_include_pattern, is_include_header, is_after_close_wnd, 
		is_after_open_file, is_prompt_overwrite, is_show_option,
		data_delimiter, is_check_data, is_include_statdata, is_save_onerow, 
		is_save_file, save_callbakc_func, is_include_masking;
	
	file_name = "planAnalytics.csv";
	is_include_pattern = true;
	is_include_header = true;
	is_after_close_wnd = true;
	is_after_open_file = false;
	is_prompt_overwrite = true;
	is_show_option = true;
	data_delimiter = ",";
	is_check_data = true;
	is_include_statdata = true;
	is_save_onerow = false;
	is_save_file = true;
	save_callbakc_func = null;
	is_include_masking = false;
	
	this.grdList.savecsvex(file_name, 
		is_include_pattern, is_include_header, is_after_close_wnd,
		is_after_open_file, is_prompt_overwrite, is_show_option,
		data_delimiter, is_check_data, is_include_statdata, is_save_onerow, 
		is_save_file, save_callbakc_func, is_include_masking);	*/	
}

function fldDateS_on_changed(objInst, prev_text, curr_text, event_type)
{
    this.fnSearchExchange();
	this.dsList.removeallrows();
	this.fnSetTitle();		
}

function ComCustGroup_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "CUSTOMER_GROUP" , "");
	return 0;

}

function ComProductGroup_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "PRODUCT_GROUP_CODE" , "");	
	return 0;
}

function ComImportance_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "IMPORTANCE_CODE" , "");		
	return 0;
}

function ComCustNa_on_prekeydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	var iRow = this.dsSearch.getpos();
	this.dsSearch.setdatabyname(iRow , "CUSTOMER_NATION_CODE" , "");		
	return 0;
}