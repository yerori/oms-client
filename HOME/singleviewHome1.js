function screen_on_load()
{
	SYSVar.HOME_SCREEN = this.screen;
	SYSVar.HOME_MEMBER = this.screen.getmembers();
	this.addScreenTab();	
}

/*
 * 화면을 탭에 추가한다.
 */
function addScreenTab()
{
	this.tabS1.addportlettab("TOPS1",0,0,"/INTRO/rnd_1","",true);
	this.tabS2.addportlettab("TOPS2",0,0,"/INTRO/sv_6","",true);
	//this.tabS3.addportlettab("MIDDLES1",0,0,"/INTRO/sv_3","",true);
	//this.tabS4.addportlettab("MIDDLES2",0,0,"/INTRO/sv_4","",true);
	//this.tabS5.addportlettab("BOTTOMS1",0,0,"/INTRO/sv_5","",true);
	//this.tabS6.addportlettab("BOTTOMS2",0,0,"/INTRO/sv_6","",true);
}

/*
 * 화면을 탭에 제거한다.
 */
function deleteScreenTab()
{
	this.tabS1.deletealltab(true,false);
	this.tabS2.deletealltab(true,false);
	//this.tabS3.deletealltab(true,false);
	//this.tabS4.deletealltab(true,false);
	//this.tabS5.deletealltab(true,false);
	//this.tabS6.deletealltab(true,false);
}