copy()
{
   found := false
   While(found = false)
   {
      Send, ^a
      Sleep, 800
      Send, ^c
      ClipWait, 2
      IfInString, Clipboard, Grand Totals
      {
         found := true
      }
   }
   Sleep, 500
   Send, ^w
   Sleep, 500
   Send, {F5}
   Sleep, 4250
}
