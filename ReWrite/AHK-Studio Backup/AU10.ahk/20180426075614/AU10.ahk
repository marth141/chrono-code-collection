#Persistent
#Include %A_ScriptDir%\UpdaterFunctionLib\globals.ahk
#Include %A_ScriptDir%\UpdaterFunctionLib\runUpdate.ahk

AutoUpdate:
{
	SetTitleMatchMode, 3
	;ToolTip % "Running SQL", 0, 0
	;runSQLUpdate()
	ToolTip % "Checking if in Chrono Inputter", 0, 0
	IfWinNotActive, Chrono Inputs - Google Sheets - Google Chrome
	{
		ToolTip % "Opening Chrono Inputter", 0, 0
		run, %chronoInput%
	}
	else
	{		
		Sleep, 10000		
		Loop
		{
			ToolTip % "Running Updates", 0, 0
			runUpdate(southWestBacklogs)
			runUpdate(legionBacklogs)
			runUpdate(newEngBacklogs)
			runUpdate(gritBacklogs)
			runUpdate(northCaliBacklogs)
			runUpdate(southCaliBacklogs)
			runUpdate(nisBacklogs)
			runUpdate(dealerBacklogs)
			;runUpdate(westOldPermitBacklogs)
			;runUpdate(centralOldPermitBacklogs)
			;runUpdate(atlanticOldPermitBacklogs)
			runUpdate(vrAudit)
			runUpdate(cpQualityConBacklogs)
			runUpdate(permitQualityConBacklogs)
			runUpdate(qualityConPass)
			runUpdate(westCoastPermitBacklogs)
			runUpdate(eastCoastPermitBacklogs)
			runUpdate(electricalEscalations)
			runUpdate([structrualEscalations, structrualEscalationsNonFullProcess])
		}
	}
	return
}

^p::
{
	MsgBox, PAUSE
	return
}

^Esc::
{
	ExitApp
	Return
}
