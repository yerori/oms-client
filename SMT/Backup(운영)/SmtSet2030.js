/*------------------------------------
* program id : SmtSet2030
* desc	   : 메일 발송 추적
* dev date   : 2024-10-16
* made by    : YELEE
*-------------------------------------*/
var ouCode;
var authScope;
var today = UT.getDate();
var baseDate;
var mailTitle;

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
	this.fnGetList();
}

/*
* 검색조건 초기화 및 세팅
*/
function fnDsSearchSet(){
	this.dsSearch.removeallrows();
	
    ouCode = INI.GV_OU_CODE;

    this.fldDateS.settext(today);
	baseDate = today;

   UT.gfnHrEditorStyle(this.comOu, "D");
}

/*
* 데이터셋 
*/
function fnDsSet(){
	UT.gfnGetOuCodes(this.dsOU);
	this.fnGetTitle();
}

/*
* 홀/짝 여부 조회하여
* 짝수는 0, 홀수는 1 반환
*/
function isOddOrEven(number) {
	if(number % 2 == 0) {
		return 0;
	}else return 1;
}

/*
* 데이터 조회시 필요한 파라미터 반환
*/
function fnGetSearchParam() {
	var vParam = "OU_CODE=" + ouCode;
    vParam += " BASE_DATE=" + baseDate;
	vParam += " MAIL_TITLE=" + mailTitle;
	return vParam;
}

/*
* dsList에 있어서
* 메일 수신자와 같은 가변 항목 (COL_로 시작하는)이 아닌 
* 날짜에 따라 행의 개수가 변하지 않는
* 고정 컬럼의 개수 반환
*/
function fnGetFixColumnCount() {
	var obj = this.dsList.getjson();
	var array = obj.column_name_arr;
	
	var headerLength = array.length;
	var res = [];
	
	for(j=0; j<headerLength; j++) {
		if(array[j].indexOf("COL_") != 0) {
			res.push(array[j]);
		}
	}
	
	return res.length;
}

function fnResetGridProp(fixColumCount) {
	var totalLength = this.grdList.getcolumncount();
	
	for(i=fixColumCount; i<totalLength; i++){
		this.grdList.setcolumnhidden(i,true);
	};
}

/*
* 필드 title 정보 데이터 가져오기.
* DB조회
*/
function fnGetTitle(){	
	var vParam = this.fnGetSearchParam();
		
	TRN.gfnTranDataSetHandle(this.screen , this.dsHeader , "NONE" , "CLEAR" ,  "" , "" , "TR_HEADER");	
	TRN.gfnCommonTransactionClear(this.screen, "TR_HEADER");
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_MAIL_TRACKING_HEADER" ,"" , "dsHeader", vParam);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT_RECIPIENT_HEADER" , true , true , false , "TR_HEADER");

	var dsLength = this.dsHeader.getrowcount();
	var isOddFistColumn = false;
	var colLength =  this.grdList.getcolumncount();
	var rowHeaderIndex = 0;
	var sLength = 0;
	var conditionByNumber = 0;
	
	var fixColLength = this.fnGetFixColumnCount();
		
	this.fnResetGridProp(fixColLength);
	
	for(i=0; i <colLength; i++) {
		// No, 메일 제목때문에 n씩 밀려남
		var colIndex = i + fixColLength;
		
		var dsType = this.dsHeader.getdatabyname(i, "DS_TYPE");
		var titleText = this.dsHeader.getdatabyname(i, "TITLE");
		
		var metaId = this.grdList.getheadermetaid(rowHeaderIndex, colIndex);
				
		// DS TYPE이 S인 행
		if(metaId == "LABEL00209" && dsType == "S") {
			this.grdList.setcolumnhidden(colIndex, false);
			this.grdList.setheadertext(rowHeaderIndex, colIndex, titleText);
			sLength++;
		}
		
		// DS TYPE이 D인 행
		else if(metaId == "LABEL01534") {
			var idx = this.dsHeader.getdatabyname(sLength, "COL_IDX");
			
			// 병합되는 행 시작되는 인덱스의 홀/짝 여부 체크
			if(idx == 1) {
				conditionByNumber = this.isOddOrEven(i);
			}
			
			var titleByNumber = this.dsHeader.getdatabyname(sLength, "TITLE");	
			var isHidden = this.grdList.ishiddencolumn(colIndex);
												
			this.grdList.setcolumnhidden(colIndex, false);
									
			if(!titleByNumber) {
				return;
			}

			if (i % 2 == conditionByNumber) {  
				this.grdList.setheadertext(rowHeaderIndex, colIndex, titleByNumber);   
				sLength++;
			} 
		} 
	}
}


function fnGetList() {
	var vParam = this.fnGetSearchParam();

	TRN.gfnTranDataSetHandle(this.screen , this.dsSearch , "ALL" , "NONE" ,  "" , "" , "TR_SEARCH");
	TRN.gfnTranDataSetHandle(this.screen , this.dsList , "NONE" , "CLEAR" ,  "" , "" , "TR_SEARCH");		
	TRN.gfnCommonTransactionClear(this.screen, "TR_SEARCH");	
	TRN.gfnCommonTransactionAddSearch(this.screen , "OmsSmtMapper.SELECT_SMT_MAIL_TRACKING_INFO" ,"dsSearch" , "dsList", "TR_SEARCH", vParam);
	TRN.gfnCommonTransactionRun(this.screen , "SELECT" , false , true , true , "TR_SEARCH");
}


/*
* 초기 컨트롤 속성 설정
*/
function fnSetInitControl()
{
	//초기화
    this.comOu.setselectedcodeex(ouCode,true,true); 

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
	    } else{
        	authScope = "PINFO";
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
	
	if(recv_userheader == "insertAndselect")
	{
		this.fnUpload();
	}
}

/*
* 공통 조회버튼 클릭시
* DB조회
*/
function btnCommonSearch_on_mouseup(objInst)
{
	if (!baseDate) {
		UT.alert(this.screen, "MSG524", "기준년을 입력하세요"); 
		return; 
	}
	
	this.fnGetTitle();
	this.fnGetList();
}


/*
* 페이지 공통 닫기 버튼
*/
function btnCommonClose_on_mouseup(objInst)
{
	INI.gfnMdiTabClose();
}

function comOu_on_itemchange(objInst, nprev_item, ncur_item, event_type)
{	
    ouCode = this.dsSearch.getdatabyname(this.dsSearch.getpos(),"OU_CODE");
}


/*
* 기준 일자 변경시
*/
function fldDateS_on_changed(objInst, prev_text, curr_text, event_type)
{
	baseDate = curr_text;
	this.dsList.removeallrows();	
}


function edtMailTitle_on_keydown(objInst, keycode, bctrldown, bshiftdown, baltdown, bnumpadkey)
{
	if(keycode==13){    // 엔터키값 조회 버튼 click call
		this.btnCommonSearch_on_mouseup();
	}
	return 0;
}