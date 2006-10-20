/*
 * See ../license.txt for licensing
 *
 * For further information visit:
 * 	http://kfm.verens.com/
 *
 * File Name: ga.js
 * 	Irish language file.
 *
 * File Authors:
 * 	kae@verens.com
 */

var kfm_lang=
{
Dir:
	"ltr", // language direction
ErrorPrefix:
	"earráid: ",
// what you see on the main page
Directories:
	"Comhadlannaí",
CurrentWorkingDir:
	"Comhadlann Oibre: \"%1\"",
Logs:
	"Loganna",
FileUpload:
	"Luchtaigh Comhad",
DirEmpty:
	"níl aon comhaidí in \"%1\"",

// right click menu item directory
// directory
CreateSubDir:
	"cruthaigh focomhadlann",
DeleteDir:
	"scrios",
RenameDir:
	"athainmnigh",

//file
DeleteFile:
	"scrios",
RenameFile:
	"athainmnigh",
RotateClockwise:
	"rothlóidh deiseal",
RotateAntiClockwise:
	"rothlóidh tuathal",
ResizeImage:
	"athraigh méid an pictiúr",
ChangeCaption:
	"athraigh scríobh",

// create a file
WhatFilenameToCreateAs:
	"Cad is ainm den comhad?",
AskIfOverwrite:
	"Tá comhad le ainm \"%1\" ann cheana. Forscríobh?",
NoForwardslash:
	"\nNíl cead '/' a usaid in ainm comhad",

// messages management
CreateDirMessage:
	"Cruthaigh focomhadlann i \"%1\":",
DelDirMessage:
	"An bhfuil tú cinnte gur mian leat an comhadlann \"%1\" a scrios?",
DelFileMessage:
	"An bhfuil tú cinnte gur mian leat an comhad \"%1\" a scrios?",
DelMultipleFilesMessage:
	"An bhfuil tú cinnte gur mian leat na comhaidí seo a scrios?\n\n'",
DownloadFileFromMessage:
	"Íosluchtaigh ó cén áit?",
FileSavedAsMessage:
	"Cad is mian leat an comhad a ainmniú?",

//resize file
CurrentSize:
	"Méid Reatha: \"%1\" x \"%2\"\n",
NewWidth:
	"Leithead Nua?",
NewWidthConfirmTxt:
	"Leithead Nua: \"%1\"\n",
NewHeight:
	"Airde Nua?",
NewHeightConfirmTxt:
	"Airde Nua: \"%1\"\n\nÁn bhfuil seo ceart?",

// log messages
RenamedFile:
	"ag ainmniú ó \"%1\" go \"%2\".",
DirRefreshed:
	"comhadlannaí úraighte.",
FilesRefreshed:
	"comhaidí úraighte.",
NotMoreThanOneFile:
	"earráid: ní féidir ach comhad amhain a roghnóidh ag ám amhain",
UnknownPanelState:
	"earráid: stáit panéil nach bhfuil fios faoi.",
//MissingDirWrapper:
//	"earráid: missing directory wrapper: \"kfm_directories%1\".",
SetStylesError:
	"earráid: ní féidir \"%1\" a cur mar \"%2\.",
NoPanel:
	"earráid: níl panéil \"%1\" ann.",
FileSelected:
	"comhad roghnóidhte: \"%1\"",
log_ChangeCaption:
	"ag aithrú scríobh ó \"%1\" go \"%2\"",
UrlNotValidLog:
	"earráid: cáthfaidh an URL tosaidh le \"http:\"",
MovingFilesTo:
	"ag bog comhaidí [\"%1\"] go \"%2\"",

// error messages
DirectoryNameExists:
	"tá comhadlann leis an ainm sin ann cheana.",
FileNameNotAllowd:
	"earráid: níl cead an ainm comhad sin",
CouldNotWriteFile:
	"earráid: ní bhféidir an comhad \"%1\" a cruthaigh.",
CouldNotRemoveDir:
	"ní bhféidir an comhadlann a chealaidh.\ncáthfaidh sé a bheith folamh",
UrlNotValid:
	"earráid: cáthfaidh an URL tosaidh le \"http:\"",
CouldNotDownloadFile:
	"earráid: ní féidir an comhad \"%1\" a íosluchtaigh.",
FileTooLargeForThumb:
	"earráid: tá \"%1\" ró-mhór chun thumbnail a cruthaigh. Cáthfaidh tú comhad níos beag a úsaid.",
CouldntReadDir:
	"earráid: ní féidir an comhadlann a léamh",
CannotRenameFile:
	"earráid: ní féidir \"%1\" a ainmniú mar \"%2\"",
FilenameAlreadyExists:
	"earráid: tá comhad leis an ainm sin ann cheana",

// new in 0.5
EditTextFile:
	"scríobh an comhad teacs",
CloseWithoutSavingQuestion:
	"An bhfuil tú cinnte gur mian leat an comhad a ndúnfaidh gán é a shábhail?",
CloseWithoutSaving:
	"Dún Gán Sábhail",
SaveThenClose:
	"Sábhail, agus Dún",
SaveThenCloseQuestion:
	"An bhfuil tú cinnte gur mian leat na aitruithe a shábhail?",

// new in 0.6
LockPanels:
	"oighreoidh na bpanéil",
UnlockPanels:
	"scaoilfidh na bpanéil",
CreateEmptyFile:
	"cruthaigh comhad folamh",
DownloadFileFromUrl:
	"Íosluchtaigh ó URL",
DirectoryProperties:
	"Airíonna Comhadlann",
SelectAll:
	"roghnóidh gach rud",
SelectNone:
	"roghnóidh dada",
InvertSelection:
	"freaschaidh an roghnú",
LoadingKFM:
	"ag luchtaigh KFM",
Name:
	"ainm",
FileDetails:
	"File Details",
Search:
	"Search",
IllegalDirectoryName:
	"illegal directory name \"%1\"",
RecursiveDeleteWarning:
	"\"%1\" is not empty\nAre you sure you want to delete it and all its contents?\n*WARNING* THIS IS NOT REVERSIBLE",
RmdirFailed:
	"failed to delete directory \"%1\"",
DirNotInDb:
	"directory not in database",
ShowPanel:
	"show panel \"%1\"",
ChangeCaption:
	"Change Caption",
NewDirectory:
	"New Directory",
Upload:
	"Upload",
NewCaptionIsThisCorrect:
	"New Caption:\n%1\n\nIs this correct?",
Close:
	"close",
Loading:
	"loading",
AreYouSureYouWantToCloseKFM:
	"Are you sure you want to close the KFM window?",
PleaseSelectFileBeforeRename:
	"Please select a file before you try to rename it",
RenameOnlyOneFile:
	"You can only rename one file at a time",
RenameFileToWhat:
	"Rename the file \"%1\" to what?",
NoRestrictions:
	"no restrictions",
Filename:
	"filename",
Maximise:
	"maximise",
Minimise:
	"minimise",
AllowedFileExtensions:
	"allowed file extensions",
Filesize:
	"filesize",
MoveDown:
	"move down",
Mimetype:
	"mimetype",
MoveUp:
	"move up",
Restore:
	"restore",
Caption:
	"caption"
}
