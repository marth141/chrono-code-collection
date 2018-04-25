errorImageSearch(image, clickNeeded:=false)
{
	found := false
	while (found = false)
	{
		CoordMode, Pixel, Screen
		ImageSearch, FoundX, FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, %image%
		CenterImgSrchCoords(image, FoundX, FoundY)
		If (ErrorLevel = 0 && clickNeeded = true) ;If found and click needed, click it.
		{
			Click, %FoundX%, %FoundY% Left, 1
			found = true
		}
		else If (ErrorLevel = 0 && clickNeeded = false) ;If not found and click not needed.
		{
			SoundPlay, -1, Wait
			found = true
		}
		else if (ErrorLevel = 1)
		{
			SoundPlay, *32, Wait
		}
		else if (ErrorLevel = 2)
		{
			SoundPlay, *16, Wait
		}
	}
}

CenterImgSrchCoords(File, ByRef CoordX, ByRef CoordY)
{
   static LoadedPic
   LastEL := ErrorLevel
   Gui, Pict:Add, Pic, vLoadedPic, %File%
   GuiControlGet, LoadedPic, Pict:Pos
   Gui, Pict:Destroy
   CoordX += LoadedPicW // 2
   CoordY += LoadedPicH // 2
   ErrorLevel := LastEL
}