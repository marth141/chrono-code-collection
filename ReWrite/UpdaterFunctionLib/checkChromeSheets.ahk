chromeSheetCheck()
{
	IfWinActive, Chrono Inputs
	{
		ToolTip % "In Chrono Inputs.", 0, 0
		return
	}
	else
	{		
		while((IfWinNotActive, Chrono Inputs) = true)
		{					
			ToolTip % "Going to try activating Chrono Input", 0, 0
			try
			{
				ToolTip % "Activating CHrono Inputs", 0, 0
				WinActivate, Chrono Inputs
				Break
			}
			catch e
			{
				ToolTip % "Reopening Chrono Inputs", 0, 0
				run, %chronoInput%
				Break
			}			
		}
		return
	}
}

chromeTabLoading(backlogLink)
{
	IfWinActive, Untitled - Google Chrome
	{
		ToolTip % "Is Salesforce loading? I'll wait 30 seconds.", 0, 0
		Sleep, 30000
		IfWinActive, Untitled - Google Chrome
		{
			ToolTip % "Salesforce never loaded, skipping.", 0, 0
			Send, ^w   
			clipboard = ; Empty the clipboard 
			return false
		}
		else IfWinActive, Salesforce - Unlimited Edition - %backlogLink%
		{
			ToolTip % "Salesforce loaded!.", 0, 0
			return true
		}
	}
}