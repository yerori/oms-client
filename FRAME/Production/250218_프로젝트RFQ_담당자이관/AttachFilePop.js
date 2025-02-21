/*------------------------------------
* program id : AttachFilePop
* desc	   : 파일 관리
* dev date   : 2022-03-09
* made by    : seyun
*-------------------------------------*/

var fvAttId = "";		// 파일첨부 테이블 Unique key id
var fvRefId = "";		// 파일첨부 데이타와 본 테이블을 join 할수 있는 key id
var fvMode = "W";		// 모드(w - 첨부모드, R - 조회모드)
var fvFileGubun = "";	// 실행로직 분기용. 현재는 사원정보 사진인경우 EMPPIC, 그외는 화면명 사용
var fvRefName = "";	  // 첨부데이타 구분값. 사원정보 사진은 사번을 나머지는 경우에 따라 입력
var fvMaxCnt = 10;	//허용갯수
var fvMaxByte = 100000 * 1024;	//허용용량 100MBYTE = 1024*1024*100
	
var fvParentAttachDs;	// 부모창의 파일 저장 데이터셋 객체 
var fvAddFileAllSize = 0;
//sub DIR Path를 정하기위한 업무구분
var fvDirType;  
var fvFilePath;
var fvFileDBPath;
var fvOuCode;

var fvUploadCnt = 0;

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
	INI.initPopup(this.screen);	//팝업 공통   
	// 파일 업로드 대상 URL 지정
	this.uploader_basic.seturl(INI.GFV_SERVER_URL + "/fileUpLoad");
	
	this.fnScreenSet();
	this.fnPageSet();
}

/*
* 스크린 set
*/
function fnScreenSet(){
	
	if(fvMode == "W"){
		var iAddL = this.grdAttachFile.getright() + 2;
		var iAddT = this.grdAttachFile.gettop();
		var iAddR = this.grdAttachFile.getright() + 2 + this.btnFileAdd.getwidth();
		var iAddB = this.grdAttachFile.gettop() + this.btnFileAdd.getheight();
		
		this.btnFileAdd.setrect(iAddL , iAddT , iAddR , iAddB);
		this.btnFileDel.setrect(iAddL , iAddB + 3 , iAddR , iAddB + 3 + this.btnFileDel.getheight());
		this.btnFileDown.setrect(iAddL , this.btnFileDel.getbottom() + 3 , iAddR , this.btnFileDel.getbottom() + 3 + this.btnFileDown.getheight());
		this.btnFileDown.setenable(false);
		this.btnSave.setenable(false);
		this.btnPreView.setenable(false);
	}else{
		var iDownL = this.grdAttachFile.getright() + 2;
		var iDownT = this.grdAttachFile.gettop();
		//var iDownR = this.grdAttachFile.getright() + 2 + this.btnFileDel.getwidth();
		//var iDownB = this.grdAttachFile.gettop() + this.btnFileDel.getheight();
		var iDownR = this.grdAttachFile.getright() + 2 + this.btnFileDown.getwidth();
		var iDownB = this.grdAttachFile.gettop() + this.btnFileDown.getheight();
		
		//this.btnFileDel.setrect(iDownL , iDownT , iDownR , iDownB);
		//this.btnFileDown.setrect(iDownL , iDownB + 2 , iDownR , iDownB + 2 + this.btnFileDown.getheight());
		this.btnFileDown.setrect(iDownL , iDownT , iDownR , iDownB);
		this.btnPreView.setrect(iDownL , this.btnFileDown.getbottom() + 3 , iDownR , this.btnFileDown.getbottom() + 3 + this.btnPreView.getheight());
		this.btnClose.setrect(iDownL , this.btnPreView.getbottom() + 3 , iDownR , this.btnPreView.getbottom() + 3 + this.btnClose.getheight());
		this.btnSave.setvisible(false);
		this.btnPreView.setenable(false);
	}
}

/*
* 모드셋
*/
function fnPageSet(){
    //var aryHash = UT.gfnGetParentReciveDataAry(screen);
	var objAttData;
	
	// 팝업화면 열때 전달한 extra_data 얻기
    objAttData = this.screen.getextradata();
	if (objAttData !== null) {
		var strAttId = objAttData.P_ATT_ID;			// 파일첨부 table key id
		var strRefId = objAttData.P_REF_ID;			// 파일첨부 데이타와 본 테이블을 join 할수 있는 key id
		var strMode = objAttData.P_MODE;	   		// w - 첨부모드, R - 조회모드
		var strFileGubun = objAttData.P_FILE_GUBUN;	// 실행로직 분기용. 현재는 사원정보 사진인경우 EMPPIC, 그외는 화면명 사용
		var strRefName = objAttData.P_REF_NAME;	    // 첨부데이타 구분값. 사원정보 사진은 사번을 나머지는 경우에 따라 입력
		var strDirType = objAttData.P_DIR_TYPE;	    // 현재는 HR 나머지 모듈별로 구분하기 위함.
		var strOuCode = objAttData.P_OU_CODE;	 	 // 법인코드
	}
//	strObjId = aryHash["ObjId"];
//	strObjCl = aryHash["ObjCl"];
//	strFilId = aryHash["FilId"];
//	strFilObjVerId = aryHash["ObjId"];
//	strMode = aryHash["mode"];	
	var iMaxCnt = 10;

	//Default Directory 구분자 추가
	if(strDirType=="undefined" || strDirType == null || strDirType == "") {
		strDirType = "OMS";
	}
    
	if(strMode == "W"){
		this.btnFileAdd.setvisible(true);
		this.btnFileDel.setvisible(true);
		this.btnFileDown.setvisible(true);
		this.btnPreView.setenable(true);
	}else{
		this.btnFileAdd.setvisible(false);
		this.btnFileDel.setvisible(false);
		this.btnFileDown.setvisible(true);
		this.btnPreView.setenable(true);
	}
	
    //UT.alert(screen , "" , "ObjId:"+strObjId+" ObjCl:"+strObjCl+" mode:"+strMode+" dirType:"+strDirType);
	
	//iMaxByte = fvMaxByte * INI.GV_FILE_MAX_CPC;
    //UT.alert(screen , "" , iMaxByte +"iMaxByte");
    //UT.alert(screen , "" , INI.GV_FILE_MAX_CPC +"INI.GV_FILE_MAX_CPC");

//	fvParentAttachDs = objParentOrgDs;	//부모데이터셋 객체 저장
	fvAttId  = strAttId;
	fvRefId  = strRefId;	
	fvMode   = strMode;	//모드
	fvFileGubun = strFileGubun;
	fvRefName = strRefName;
	fvDirType = strDirType;  
	fvOuCode = strOuCode;
	fvMaxCnt = iMaxCnt;	//허용갯수
	//fvMaxByte = iMaxByte;	//허용용량
	//UT.alert(screen , "" , fvMaxByte +"fvMaxByte");
	
	this.fnScreenSet();	//재싸이징처리
	
	this.fnSearchList();	//조회시킴
}



/*
* 조회
*/
function fnSearchList(){
	//TRN.gfnTranDataSetHandle(this.screen , this.dsAttachFile , "NONE");	//데이터셋 인:NONE 아웃:NONE 정의	

	var param = "REF_ID=" + fvRefId;
	param += " FILE_GUBUN=" + fvFileGubun;
	param += " REF_NAME=" + fvRefName;
	param += " ATT_ID=" + fvAttId;
	
	var parampath = " CODE=" + fvDirType;
	
	TRN.gfnTranDataSetHandle(this.screen , this.dsAttachFile, "ALL" , "CLEAR","","","");
	TRN.gfnTranDataSetHandle(this.screen , this.dsAttachPath, "ALL" , "CLEAR","","","");
	TRN.gfnTranDataSetHandle(this.screen , this.dsDeleteFile, "ALL" , "CLEAR","","","");
	
	TRN.gfnCommonTransactionClear(this.screen);	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_SMT_ATCH_FILE" ,"" , "dsAttachFile" , param);	//조회만
	TRN.gfnCommonTransactionAddSearch(this.screen , "systemMapper.SELECT_ATCH_PATH" ,"" , "dsAttachPath" , parampath);	//조회만	

	// screen , "해당 로직 구분 명" , 싱크방식(true/false) , 싱크시 콜백함수 호출여부 (true/false) , 진행중보이기(true/false)
	TRN.gfnCommonTransactionRun(this.screen , "fileListselect" , true , true , false);	// recv_userheader 값에 select 반환   , 싱크 비동기  (screen_on_submitcomplete 자동호출됨)
}



/*
* 조회 완료시
*/
function screen_on_submitcomplete(mapid, result, recv_userheader, recv_code, recv_msg)
{
	if(recv_code != 0){
		UT.alert(this.screen , "" , recv_msg);
		return;
	}
	
	if(recv_userheader == "fileListselect"){
		if(!UT.isNullObj(fvParentAttachDs)){
			fvParentAttachDs.removeallrows();
			UT.gfnCopyDataSet(this.dsAttachFile, fvParentAttachDs);		//부모데이터셋에 정보 주기 로우상태 노멀	
		}
		
		if(INI.GFV_SERVER_TYPE=="LOCAL") {
			fvFilePath = "";
			fvFileDBPath = this.dsAttachPath.getdatabyname(0 , "REF_1");
		} else {
			fvFilePath = "/var/hsoms/" + INI.GFV_SERVER_TYPE;
			fvFileDBPath = this.dsAttachPath.getdatabyname(0 , "REF_1");
		}
		
		// 모든 업로드 대상 파일 삭제
		//this.uploader_basic.deleteallfile();
		//if(fvMode != "W"){
		//}
		this.fnDownListSet();
	}
	
	if(recv_userheader == "save"){
		this.dsAttachFile.removeallrows();
		this.dsTempAttachFile.removeallrows();
		this.btnSave.setenable(false);
		this.fnScreenSet();
		this.fnPageSet();
	}
	
	if(recv_userheader == "delete"){
		this.btnFileDown.setenable(false);
		this.btnSave.setenable(false);
		this.btnPreView.setenable(false);
	}
}

/*
* 다운로더 file list addfile
*/
function fnDownListSet(){
	var downloadUrlBase = INI.GFV_SERVER_URL + "/fileDownLoad";
	var commParam = "?GV_USER_ID=" + INI.GV_USER_ID;
	commParam += "&GV_OU_CODE=" + INI.GV_OU_CODE;
	commParam += "&LOG_K_CD=LOG003";
	//commParam += "&USER_IP_ADDR=" + factory.getlocalipaddress();
	commParam += "&USER_IP_ADDR=" + SYSVar.LOCAL_IP_ADDR;
	commParam += "&SERVER_TYPE=" + INI.GFV_SERVER_TYPE;
	commParam += "&LOG_OBJ_ID=" + fvRefId + "," + fvFileGubun;
	
	this.downloader_basic.deleteallfile();
	for(i=0; i<this.dsAttachFile.getrowcount();i++) {
		var strDownFileUrl = this.dsAttachFile.getdatabyname(i, "FILE_PATH");
		var strParam = "&ATT_ID=" + this.dsAttachFile.getdatabyname(i , "ATT_ID");	
		var strDownFileNm = this.dsAttachFile.getdatabyname(i , "ATTFILE_NM");
		
		this.downloader_basic.addfile(downloadUrlBase + commParam + strParam, strDownFileNm, false);
	}
	
	if(this.downloader_basic.getfilecount() > 0){
		this.btnFileDown.setenable(true);
		this.btnPreView.setenable(true);
		if(fvFileGubun=="EMP"||fvFileGubun=="SIGN"||fvFileGubun=="CORP"){
			if(this.downloader_basic.getfilecount() >= 1){
				this.btnFileAdd.setenable(false);
			}
		}
	}

	if(this.dsAttachFile.getrowcount() > 0){
		//기존 dataset copy
		UT.gfnCopyDataSet(this.dsAttachFile, this.dsTempAttachFile);
	}
}

/*
* 삭제 시
*/
function fnFilDelete(delPos){
	var parameter = "?FIL_OBJ_CL=" + fvObjCl;		
		parameter+= "&FIL_OBJ_ID=" + fvObjId;
		parameter+= "&DIR_TYPE=" + fvDirType;
		
	var strfileLocalPath = this.dsAttachFile.getdatabyname(delPos , "FIL_LOCAL_PATH");
	var strFileId = this.dsAttachFile.getdatabyname(delPos , "FIL_ID");
	var strStgPath = this.dsAttachFile.getdatabyname(delPos , "FIL_STG_PATH");
	 var fileName = this.dsAttachFile.getdatabyname(delPos , "FIL_NM");
	if(!UT.isNull(strfileLocalPath)) {  //추가된 파일에 대하여 웹파일 매니저에서 삭제
	    var strFileUrl = INI.GFV_SERVER_URL + "/fileUpLoad" + parameter;
		var upLoadFileUrl = strFileUrl  + "&FIL_ID=" + strFileId + "&FIL_STG_PATH=" + strStgPath;
		ctrlWebFileManager.deleteuploadlist( UT.gfnReplaceStr(strfileLocalPath , "\\\\", "/"), upLoadFileUrl);
	} else {  // 서버에 Upload된 파일 삭제
	    parameter+= "&GV_USER_ID=" + INI.GV_USER_ID;	
	    parameter+= "&GV_CO_ID=" + INI.GV_CO_ID;
		parameter+= "&LOG_K_CD=LOG007"; 
		//parameter+= "&USER_IP_ADDR=" + factory.getlocalipaddress();
		parameter += "&USER_IP_ADDR=" + SYSVar.LOCAL_IP_ADDR;
		parameter+= "&LOG_OBJ_ID=" + fvObjId + "," + fvObjCl;

	 	var strFileUrl = INI.GFV_SERVER_URL + "/fileDelete" + parameter;
		 var upLoadFileUrl = strFileUrl  + "&FIL_ID=" + strFileId + "&FIL_STG_PATH=" + strStgPath +  "&GV_LANG=" + INI.GV_LANG;
		 
		this.dsDeleteFile.insertrow(0);	
		this.dsDeleteFile.setdatabyname(this.dsDeleteFile.getpos, "FIL_ID",strFileId); 
		this.dsDeleteFile.setdatabyname(this.dsDeleteFile.getpos, "BASE_URL",upLoadFileUrl); 
	}
	
	this.btnSave.setenable(true);
	
}

/*
* 파일 드래그 추가시
*/
function grdAttachFile_on_dropfiles(objInst, arrayDropFiles, nDropFileCount)
{
	if(fvMode == "W"){
		// 드롭된 파일 오브젝트 배열을 업로드 대상에 추가
		this.uploader_basic.addfileobjectarray(arrayDropFiles);
		// 업다운로드 대상 파일 목록 정보를 그리드에 표시 및 데이터셋에 추가
		this.fnFileAdd();
	}	
}


/*
* 파일 추가 버튼 이벤트 처리
*/
function btnFileAdd_on_mouseup(objInst)
{	
	//this.uploader_basic.addfile();		
	this.fileControl.selectfiles();
}


/*
* 파일정보들을 데이터셋에 추가
*/
function fnFileAdd(){
	
	if(fvMode == "W"){
		
		var count, tempcnt, nFiles;
		
		//this.dsAttachFile.deleteallrows();
		count = this.uploader_basic.getfilecount();
		tempcnt = this.dsTempAttachFile.getrowcount();

		this.dsAttachFile.removeallrows();
		
		if(count > 1){
			if(fvFileGubun=="EMP"){
				UT.alert(this.screen , "" , "인사 사진등록은 하나의 파일만 가능합니다." + "\n" + "확인 바랍니다." , "");
				this.dsAttachFile.deleteallrows();
				this.uploader_basic.deleteallfile();
				return false;
			} else if(fvFileGubun=="SIGN"){
				UT.alert(this.screen , "" , "인사 Sign등록은 하나의 파일만 가능합니다." + "\n" + "확인 바랍니다." , "");
				this.dsAttachFile.deleteallrows();
				this.uploader_basic.deleteallfile();
				return false;
			} else if(fvFileGubun=="CORP"){
				UT.alert(this.screen , "" , "법인 인감등록은 하나의 파일만 가능합니다." + "\n" + "확인 바랍니다." , "");
				this.dsAttachFile.deleteallrows();
				this.uploader_basic.deleteallfile();
				return false;
			}
		}
		
//		for(var ii = 0; ii < this.uploader_basic.getfilecount(); ii++){
//			console.log("ii : " + ii);
//			console.log("filename : " + this.uploader_basic.getfilename(ii));
//		}
		
		for(nFiles = 0; nFiles < count; nFiles++){
			//현재 첨부되어 있는 파일 사이즈 계산
			this.fnAttachSize();
			
			if(fvAddFileAllSize + this.uploader_basic.getfilesize(nFiles) > fvMaxByte){				
				UT.alert(this.screen , "" , "파일 업로드 총 용량인 %%KByte를 초과 하였습니다." , Math.round(fvMaxByte / 1024 , 1));
				return false;
			} else {
//				//tempdata(다운로드파일)와 중복체크
//				if(tempcnt > 0){
//					var iSRow = UT.gfnGetCaseCount(this.dsTempAttachFile , "ATTFILE_NM", this.uploader_basic.getfilename(nFiles));
//					if(iSRow > 0){
//						UT.alert(this.screen , "MSG600" , "중복된 파일(%%)이 존재합니다." , this.uploader_basic.getfilename(nFiles));
//						this.uploader_basic.deletefilebyname(this.uploader_basic.getfilename(nFiles));
//						break;
//					}
//				}
				
				if(this.dsAttachFile.getrowcount() < fvMaxCnt){
					//this.dsAttachFile.insertrow(nFileIndex);
					this.dsAttachFile.insertrow(nFiles);
					//att id 구한다. (Random함수 이용)
					var strSysTime = factory.getsystemtime("%Y%M%D%h%m%s");
					var strRandom = Math.floor(Math.random()*9000)+1000;
					var strAttID = strSysTime + strRandom;
					var strFileName = this.uploader_basic.getfilename(nFiles);
					
					var strExt = strFileName.substring(strFileName.lastIndexOf("."));
					var strSaveFileNm = "";
					var strFilePath = "";
					var strFileDBPath = "";
					var strYYYYmm = UT.getDate().substr(0,6);
					
					if(fvFileGubun=="EMP"||fvFileGubun=="SIGN"||fvFileGubun=="CORP") {
						strSaveFileNm = fvRefName + strExt;   								  //ex) 사번.jpg
						//strFilePath = fvFilePath + "H" + fvOuCode + "/";                        // 저장 주소 : 저장 기본 디렉토리 + H + 법인코드
						strFilePath = fvFilePath + fvFileDBPath + fvOuCode + "/";                        // 저장 주소 : 저장 기본 디렉토리 + H + 법인코드
						strFileDBPath = fvFileDBPath + fvOuCode + "/";
					} else {
						strSaveFileNm = strAttID + "." + strFileName;   						//ex) 202203111717259007.test.png
						//strFilePath = fvFilePath + "H" + fvOuCode + "/" + strYYYYmm + "/";      // 저장 주소 : 저장 기본 디렉토리 + H + 법인코드 + YYYYMM
						strFilePath = fvFilePath + fvFileDBPath + fvOuCode + "/" + strYYYYmm + "/";      // 저장 주소 : 저장 기본 디렉토리 + H + 법인코드 + YYYYMM
						strFileDBPath = fvFileDBPath + fvOuCode + "/" + strYYYYmm + "/";
					}
					
					this.dsAttachFile.setdatabyname(nFiles, "ATT_ID" , strAttID);	  						 //파일첨부 테이블 Unique key id
					this.dsAttachFile.setdatabyname(nFiles, "ATTFILE_NM" , strFileName);						//파일명
					this.dsAttachFile.setdatabyname(nFiles, "SAVEFILE_NM" , strSaveFileNm);					 //서버저장 파일명
					this.dsAttachFile.setdatabyname(nFiles, "FILE_SIZE" , this.uploader_basic.getfilesize(nFiles));	//파일크기
					this.dsAttachFile.setdatabyname(nFiles, "FILE_SIZE_KB" , this.uploader_basic.getfilebriefsize(nFiles));	//파일크기 kbyte
					this.dsAttachFile.setdatabyname(nFiles, "SUBFOLDER" ,  strFileDBPath);					  //파일 서버 DB 경로
					this.dsAttachFile.setdatabyname(nFiles, "SUBFOLDER1" , strFilePath);					    //파일 서버 경로
					this.dsAttachFile.setdatabyname(nFiles, "FILE_GUBUN" , fvFileGubun);						//파일오브젝트분류값 (실행로직 분기용. 현재는 사원정보 사진인경우 EMPPIC, 그외는 화면명 사용)
					this.dsAttachFile.setdatabyname(nFiles, "REF_NAME" , fvRefName);						    //첨부데이타 구분값. 사원정보 사진은 사번을 나머지는 경우에 따라 입력
					this.dsAttachFile.setdatabyname(nFiles, "REF_ID" , fvRefId);						    	//파일첨부 데이타와 본 테이블을 join 할수 있는 key id
					this.dsAttachFile.setdatabyname(nFiles, "OU_CODE" , fvOuCode);						      //법인코드
					
					fvAddFileAllSize += this.uploader_basic.getfilesize(nFiles);
					
				} else {
					UT.alert(this.screen , "MSG346" , "파일 업로드 제한 갯수 %%를 초과 하였습니다." , fvMaxCnt);
				}
			}
		}
		//tempdata(다운로드파일)가 있을경우 원복
		if(tempcnt > 0 ){
			UT.gfnCopyDataSet(this.dsTempAttachFile, this.dsAttachFile, "ALL", true);
		}
				
		if(count > 0 && nFiles > 0){
			this.btnSave.setenable(true);
		}
	} 
}

/*
* 삭제버튼시
*/
function btnFileDel_on_mouseup(objInst)
{
//	if(fvMode=="W"){
//		// 모든 업로드 대상 파일 삭제
//		this.uploader_basic.deleteallfile();
//	} else {
//		// 모든 다운로드 대상 파일 삭제
//		this.downloader_basic.deleteallfile();
//		this.dsAttachFile.deleteallrows();
//		this.fnTran("delete");
//	}	
	
	// 모든 업로드/다운로드 대상 파일 삭제
	if(this.dsAttachFile.getrowcount() > 0){
		for(i=0; i<this.dsAttachFile.getrowcount();i++) {
			var strAttIDs = this.dsAttachFile.getdatabyname(i, "ATT_ID");
			var strAttfileNM = this.dsAttachFile.getdatabyname(i , "ATTFILE_NM");	
			
			this.dsDeleteFile.insertrow(0);
			this.dsDeleteFile.setdatabyname(this.dsDeleteFile.getpos(),"ATT_ID", strAttIDs);
			this.dsDeleteFile.setdatabyname(this.dsDeleteFile.getpos(),"ATTFILE_NM", strAttfileNM);
		}
		
		this.dsAttachFile.deleteallrows();
		this.dsAttachFile.setallrowoperation(XFD_ROWOP_DELETE);
		this.fnTranDelete();
	}
	
	this.dsAttachFile.removeallrows();
	this.dsTempAttachFile.removeallrows();
	
	this.uploader_basic.deleteallfile();
	this.downloader_basic.deleteallfile();	
	
	if(!this.btnFileAdd.getenable()){
		this.btnFileAdd.setenable(true);
	}	
	
	//this.fnScreenSet();
	//this.fnPageSet();
}



/*
* 파일 다운로드
*/
function btnFileDown_on_mouseup(objInst)
{
	this.downloader_basic.startdownload();
}

/*
*/
function fnAttachSize() {
    fvAddFileAllSize = 0;
    for(var i = 0; i < this.dsAttachFile.getrowcount(); i++) {		// 다운로드 대상 목록 추가
			
		var fileSize = this.dsAttachFile.getdatabyname(i , "FILE_SIZE");

		fvAddFileAllSize = fvAddFileAllSize + Number(fileSize);
	}
}

/* 저장 후 닫기
   파일 삭제 ==> 저장시 실제 물리적 파일 삭제되도록 추가
   파일 추가 ==> 파일 추가할때 저장하던것을 저장 버튼 클릭시 파일 및 DB 저장
*/
function btnSave_on_mouseup(objInst)
{
		
	if(fvMode=="W") {
		if(this.uploader_basic.getfilecount()>=1) {
			for(i=0;i<this.dsAttachFile.getrowcount();i++){
				var strFileUrl = INI.GFV_SERVER_URL + "/fileUpLoad";
				var strSaveFileNm = this.dsAttachFile.getdatabyname(i , "SAVEFILE_NM");
				//var strFilePath = this.dsAttachFile.getdatabyname(i , "SUBFOLDER");
				var strFilePath = this.dsAttachFile.getdatabyname(i , "SUBFOLDER1");
				var upLoadFileUrl = strFileUrl  + "?SAVEFILE_NM=" + strSaveFileNm + "&SUBFOLDER=" + strFilePath;
				this.uploader_basic.setfileurl(i, upLoadFileUrl);
			}
			
			//uploader_basic.seturl(base_url);
			
			//Upload 처리
			this.uploader_basic.startupload();
		} else {
			this.screen.alert("업로드대상 항목이 없습니다.\n확인후 재작업 바랍니다.");
		}
	}
	
	
    
    //fnTran("save");
//	TRN.gfnTranDataSetHandle(this.screen , this.dsAttachFile ,"ALL", "NONE" , "TRANSACITON_SAVE");
//    TRN.gfnCommonTransactionClear(this.screen,"TRANSACITON_SAVE");	//트랜젝션 데이터셋 초기화 (필수)	
//    TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_ATCH_FILE" , "" , "systemMapper.DELETE_SMT_ATCH_FILE" , "dsAttachFile");	//파일	
//    TRN.gfnCommonTransactionRun(this.screen , "save" , true , false , false, "TRANSACITON_SAVE");	

//	var aryHash = [];
//
//	if ( dsAttachFile.getrowcount() > 0 )
//	{
//	  aryHash["attachFlag"] = "Y";
//	  aryHash["fileNm"] = dsAttachFile.getdatabyname(dsAttachFile.getpos(),"FIL_NM");
//	  aryHash["fileId"] = dsAttachFile.getdatabyname(dsAttachFile.getpos(),"FIL_ID");
//	}else{
//	  aryHash["attachFlag"] = "N";
//	}
//
//	//UT.alert(screen,"",aryHash["CODE"]);
//	UT.gfnClosePopup(screen , aryHash);	//닫기 처리
}

/*
*/
function fnAttachResult(nFileIndex) 
{
    var uploadCheckN = 0;
    var AttReeultN = this.uploader_basic.getfileresult(nFileIndex);
    var strAttResultMsg = this.uploader_basic.getfileresultmsg(nFileIndex);
	
	fvUploadCnt = AttReeultN;
	if(AttReeultN == 1){
		this.dsAttachFile.setdatabyname(nFileIndex , "ATTACH_RESULT" , AttReeultN);
		this.dsAttachFile.setdatabyname(nFileIndex , "ATTACH_RESULT_MSG" , strAttResultMsg);
	} else {
		this.dsAttachFile.setdatabyname(nFileIndex , "ATTACH_RESULT" , AttReeultN);
		this.dsAttachFile.setdatabyname(nFileIndex , "ATTACH_RESULT_MSG" , strAttResultMsg);
		uploadCheckN++;
	}
	
    // 업로드 실패한 내역이 있으면 저장버튼을 비활성화 시킨다
    if(uploadCheckN == 0){
        this.btnSave.setenable(true);
		// 제일 마지막 uploadfile일때 db저장
		var cnt = this.uploader_basic.getfilecount();
		if(nFileIndex == cnt - 1) {
			this.fnTran("save");
		}		
    }
    else{
        this.btnSave.setenable(false);
        this.screen.alert("업로드에 실패한 항목이 있습니다.\n실패 항목을 삭제해야 저장이 가능합니다.");
    }	
}

/*
* 트랜젝션 처리
*/
function fnTranDelete(){

	TRN.gfnTranDataSetHandle(this.screen , this.dsDeleteFile ,"ALL", "NONE" , "", "", "TRANSACITON_DELETE");	
	TRN.gfnCommonTransactionClear(this.screen,"TRANSACITON_DELETE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddInsert(this.screen , "systemMapper.DELETE_SMT_ATCH_FILE" , "dsDeleteFile", "");	//파일	
	TRN.gfnCommonTransactionRun(this.screen , "delete" , true , true , false, "TRANSACITON_DELETE");
  
}

/*
* 트랜젝션 처리
*/
function fnTran(strLogicName){

	TRN.gfnTranDataSetHandle(this.screen , this.dsAttachFile ,"ALL", "NONE" , "", "", "TRANSACITON_SAVE");	
	TRN.gfnCommonTransactionClear(this.screen,"TRANSACITON_SAVE");	//트랜젝션 데이터셋 초기화 (필수)	
	TRN.gfnCommonTransactionAddSave(this.screen , "systemMapper.INSERT_SMT_ATCH_FILE" , "" , "systemMapper.UPDATE_SMT_ATCH_FILE" , "dsAttachFile", "");	//파일	
	TRN.gfnCommonTransactionRun(this.screen , strLogicName , true , true , false, "TRANSACITON_SAVE");
  
}

function fnDownResult(nFileIndex) 
{
    var downloadCheckN = 0;
    var DownReeultN = this.downloader_basic.getfileresult(nFileIndex);
    var strDownResultMsg = this.downloader_basic.getfileresultmsg(nFileIndex);
	
	if(DownReeultN == 1){
		this.dsAttachFile.setdatabyname(nFileIndex , "ATTACH_RESULT" , DownReeultN);
		this.dsAttachFile.setdatabyname(nFileIndex , "ATTACH_RESULT_MSG" , strDownResultMsg);
	} else {
		this.dsAttachFile.setdatabyname(nFileIndex , "ATTACH_RESULT" , DownReeultN);
		this.dsAttachFile.setdatabyname(nFileIndex , "ATTACH_RESULT_MSG" , strDownResultMsg);
		downloadCheckN++;
	}
	
    // 업로드 실패한 내역이 있으면 저장버튼을 비활성화 시킨다
    if(downloadCheckN != 0){
        this.screen.alert("다운로드에 실패한 항목이 있습니다.\n확인 바랍니다.");
    }	
}

/*닫기*/
function btnClose_on_mouseup(objInst)
{
	//this.screen.unload();
	var aryHash = []; //UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	
	aryHash["ATTACH_RESULT"] = fvUploadCnt;
	aryHash["ATTFILE_NM"] = this.dsAttachFile.getdatabyname(0,"ATTFILE_NM");
	//aryHash = UT.gfnDsRowToAry(this.dsAttachFile , 0);
	
	var objExtraData;
	// 팝업화면 열때 전달한 extra_data 얻기
	objAttData = this.screen.getextradata();
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objAttData);
}

/*미리보기*/
function btnPreView_on_mouseup(objInst)
{
	var attFileID = this.dsAttachFile.getdatabyname(this.dsAttachFile.getpos(),"ATT_FILE_ID");
	if( UT.isNull(attFileID) ){
		UT.alert(this.screen , "" , "업로드 이후 미리보기 할 수 있습니다." + "\n" +
		                            "확인 바랍니다." );
		return;
	}
	
	var p_fid = this.dsAttachFile.getdatabyname(this.dsAttachFile.getpos(),"ATT_FILE_ID");
	var p_filepath = this.dsAttachFile.getdatabyname(this.dsAttachFile.getpos(),"SUBFOLDER");
	var p_savefilenm = this.dsAttachFile.getdatabyname(this.dsAttachFile.getpos(),"SAVEFILE_NM");
	
	var p_encodedURL = encodeURIComponent(INI.GFV_SERVER_URL + p_filepath + p_savefilenm);
	
	var v_requestUrl = INI.GV_DOC_VIEW_SERVER_URL;
	v_requestUrl += "?fid=" + p_fid;
	v_requestUrl += "&filePath=" + p_encodedURL;
	v_requestUrl += "&convertType=" + INI.GV_DOC_VIEW_CONVERT_TYPE;
	v_requestUrl += "&fileType=" + "URL";
	v_requestUrl += "&sync=" + "true";
	
	var open_option = "titlebar=no, location=no, status=no, toolbar=no, scrollorbars=no, menubar=no";
	
	screen.httpgotourlpost(v_requestUrl,"",true,open_option);

}

function screen_on_destroy()
{
    //this.screen.unload();
	var aryHash = []; //UT.gfnDsRowToAry(this.dsList , this.dsList.getpos());
	
	aryHash["ATTACH_RESULT"] = fvUploadCnt;
	aryHash["ATTFILE_NM"] = this.dsAttachFile.getdatabyname(0,"ATTFILE_NM");
	//aryHash = UT.gfnDsRowToAry(this.dsAttachFile , 0);
	
	var objExtraData; 
	// 팝업화면 열때 전달한 extra_data 얻기
	objAttData = this.screen.getextradata();
	// 값 전달 및 팝업닫기
	this.ReturnClosePopup(aryHash, objAttData);
	
	return 1;
}

/**
 * 계산 결과를 부모화면으로 전달 후 팝업을 닫는다.
 * @param aryHash 부모화면으로 전달할 결과값
 * @param objAttData 부모화면에서 전달된 extra 데이터
 */
function ReturnClosePopup(aryHash, objAttData) 
{
	var srcParent, scrParentMember;

	//UT.alert(this.screen,"",objExtraData.RETURN_FUNCTION_NAME);
	//console.log("funcname : " + objAttData.RET_FUNC_NAME);
	// 리턴받는데 사용할 함수명을 전달한 경우
	if (objAttData != null && objAttData.RET_FUNC_NAME !== "") {
		// 부모화면 screen 구하고 유효성 처리
		srcParent = this.screen.getparent();
		if (factory.isobject(srcParent)) {
			// 부모화면의 멤버 오브젝트 구하기
			scrParentMember = srcParent.getmembers();
			if (factory.isobject(scrParentMember) == true) {
				if (factory.isfunction(scrParentMember[objAttData.RET_FUNC_NAME])) {
					// 부모화면의 함수를 통하여 값 전달
					scrParentMember[objAttData.RET_FUNC_NAME](aryHash);
				}
			}
		}
	}

	// 팝업화면 닫기
	this.screen.unloadpopup(aryHash);
}

//// 파일 업로드 컴포넌트 업로드 대상 목록 변경 이벤트 처리
//function uploader_basic_on_listupdate(objInst)
//{
//	// 업다운로드 대상 파일 목록 정보를 그리드에 표시 및 데이터셋에 추가
//	this.fnFileAdd();
//}

// 파일 업로드 컴포넌트 개별 파일 럽로드 완료 이벤트 처리
function uploader_basic_on_filecomplete(objInst, nFileIndex, strFileName)
{
	this.fnAttachResult(nFileIndex);
}

// 파일 업로드 컴포넌트 개별 파일 업로드 진행 상태 이벤트 처리
function uploader_basic_on_fileprogress(objInst, nFileIndex, strFileName, nPos)
{	
	this.grdAttachFile.setitemtext(nFileIndex,2,nPos);
}

// 한 파일에 대한 다운로드 진행 상태 변경 이벤트 처리
function downloader_basic_on_fileprogress(objInst, nFileIndex, strFileName, nPos)
{
	this.grdAttachFile.setitemtext(nFileIndex,2,nPos);
}

// 한 파일에 대한 다운로드 완료 이벤트 처리
function downloader_basic_on_filecomplete(objInst, nFileIndex, strFileName)
{
	this.fnDownResult(nFileIndex);
}


function fileControl_on_selectfiles(objInst, arrFiles)
{
	if (!arrFiles){
		return;
	} 	
	this.uploader_basic.addfileobjectarray(arrFiles);
	// 업다운로드 대상 파일 목록 정보를 그리드에 표시 및 데이터셋에 추가
	this.fnFileAdd();
}

function uploader_basic_on_uploadcomplete(objInst)
{
	this.uploader_basic.deleteallfile();
	for(var i=0; i < this.grdAttachFile.getrowcount(); i++){
		this.grdAttachFile.setitemtext(i,2,0);
		this.grdAttachFile.setitemtext(i,3,"");
	}
}