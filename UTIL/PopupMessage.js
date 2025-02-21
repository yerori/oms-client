var extData = {};
function screen_on_load()
{
	extData = screen.getextradata();
	var strTitle = extData.TITLE;
	//strTitle ??= "";
	
	if(strTitle === "") strTitle = SYSVar.MESSAGE_POP_TITLE[extData.TYPE];
	capScreenTitle.settext(strTitle);
	
	createButton();
}

function _btnMessagePopClose_on_mouseup(objInst)
{
	this.screen.unloadpopup();
}

function createButton()
{
	
	let tableViewSize = 0;
	let buttonSizeArr = [];
	let colSizeArr = [];
	
	let DEFAULT_OPTION_INFO = 
	{
		top_margin    : 5
		,left_margin   : 5
		,right_margin  : 5
		,bottom_margin : 5
		,posInterval   : 8
		,height : 30
		,font : "돋움체"
		,font_size:10
	}
	
	extData.CONFIRM_BUTTONS.forEach(function(item, index, array)
	{
		let strText = item["TEXT"];
		let clsFont = {
			szfontname : DEFAULT_OPTION_INFO.font
			,nfontsize : DEFAULT_OPTION_INFO.font_size
			,bfontbold : false
			,bfontitalic : false
			,bfontunderline : false
			,bfontstrikeout : false
		};
		
		let clsSize = factory.gettextdrawsize(clsFont, strText);
		if(clsSize != null) {
			buttonSizeArr.push(clsSize.ncx+8);
			colSizeArr.push(clsSize.ncx+8 + DEFAULT_OPTION_INFO.posInterval);
			tableViewSize += (clsSize.ncx+8 + DEFAULT_OPTION_INFO.posInterval);
		}
	},this);
	
	let objectInfo = 
		{
			row_count : 1
			, anchor : 3
			, column_count : extData.CONFIRM_BUTTONS.length
			, width: tableViewSize
			, height: DEFAULT_OPTION_INFO.height
			, row_height : DEFAULT_OPTION_INFO.height+":px"
			, y : DEFAULT_OPTION_INFO.top_margin
			, right : DEFAULT_OPTION_INFO.right_margin
			, column_width : colWidth
			, cell_line_vertstyle:0
			, cell_line_horzstyle:0
			, border :0
			//, hidden : true
		}
		let ContainTableViewObj = screen.createobjectex(XFD_CTRLKIND_TABLEVIEW,objectInfo);
		
		extData.CONFIRM_BUTTONS.forEach(function(item, index, array)
		{
			let clsProp = 
			{
				anchor : 6
				,style : ""
				,id : "btn_"+item.VALUE
				,text : item["TEXT"]
				,width : buttonSizeArr[index]
				,height : DEFAULT_OPTION_INFO.height
				,on_mouseup : "popbtn_on_mouseup"
			}
			let createdBtn = ContainTableViewObj.createobjectex(0,index,XFD_CTRLKIND_PUSHBUTTON,clsProp);
			createdBtn.setcustomprop("_RETURN",item.VALUE);
			ContainTableViewObj.setitembackcolor(0, index, -1, true,100);
			
		},this);
		
	ContainTableViewObj.setvisible(true);
}

function popbtn_on_mouseup(objInst)
{
	let rtnValue = objInst.getcustomprop("_RETURN");
	screen.unloadpopup(rtnValue);
}