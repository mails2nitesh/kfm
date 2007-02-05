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
	"ath-ainmnigh",

// file
DeleteFile:
	"scrios",
RenameFile:
	"ath-ainmnigh",
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

// resize file
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
// MissingDirWrapper:
// 	"earráid: missing directory wrapper: \"kfm_directories%1\".",
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
	"Sonraí an Comhad",
Search:
	"Cuardaigh",
IllegalDirectoryName:
	"níl cead comhadlann le ainm \"%1\"",
RecursiveDeleteWarning:
	"níl \"%1\" folamh\nAn bhfuil to cinnte gur mhaith leat é agus a abhair a scriosaigh?\n*RABHADH* NÍ FÉIDIR É SEO A FREASCHUR",
RmdirFailed:
	"theip orm an comhadlann \"%1\" a scriosaigh",
DirNotInDb:
	"níl an comhadlann sa bunachar sonraí",
ShowPanel:
	"show panel \"%1\"",
ChangeCaption:
	"Athraigh an Ceannteideal",
NewDirectory:
	"Comhadlann Nua",
Upload:
	"Cur Comhad Suas",
NewCaptionIsThisCorrect:
	"Ceannteideal Nua:\n%1\n\nAn bhfuil seo ceart?",
Close:
	"dún",
Loading:
	"ag oscailt",
AreYouSureYouWantToCloseKFM:
	"An bhfuil tú cinnte gur mhaith leat KFM a dhúnadh?",
PleaseSelectFileBeforeRename:
	"Roghnaigh comhad roimh é a ath-ainmniú",
RenameOnlyOneFile:
	"Ní féidir ach comhad amhain a ath-ainmniú ag aon am",
RenameFileToWhat:
	"Céard is mían leat \"%1\" a ath-ainmniú?",
NoRestrictions:
	"gan srianta",
Filename:
	"ainm an comhad",
Maximise:
	"uastaigh",
Minimise:
	"íostaigh",
AllowedFileExtensions:
	"aicmí comhad ceadaithe",
Filesize:
	"méid an comhad",
MoveDown:
	"bog síos",
Mimetype:
	"aicmí mime",
MoveUp:
	"bog suas",
Restore:
	"athbhunaigh",
Caption:
	"scríobh",
CopyFromURL:
	"Athscríobh ó URL",
ExtractZippedFile:
	"Bain as comhad Zip",

// new in 0.8
ViewImage:
	"breathnaigh ar pictiúr",
ReturnThumbnailToOpener:
	"tabhair ar ais pictiúr beag don oscailaitheoir",
AddTagsToFiles:
	"cur teaganna le comhad(anna)",
RemoveTagsFromFiles:
	"tóg teaganna ó comhad(anna)",
HowWouldYouLikeToRenameTheseFiles:
	"Conas ar mhaith leat na comhaid a ath-ainmniú?\n\ne.g.: ó \"images-***.jpg\" bainfidh tú \"images-001.jpg\", \"images-002.jpg\", ...",
YouMustPlaceTheWildcard:
	"Is gá leat an litir * a chur san templaid",
YouNeedMoreThan:
	"Is gá níos mó ná %1 * litrí a úsaid chun %2 ainm comhad a dhéanamh",
NoFilesSelected:
	"níl aon comhadanna roghnaithe",
Tags:
	"teaganna",
IfYouUseMultipleWildcards:
	"Má usaidíonn tú iolraí * san teamplaid, is gá na * a bheith le chéile",
NewCaption:
	"Scríobh Nua",
WhatMaximumSize:
	"Cén méid is mó is míon leat a chur ar ais?",
CommaSeparated:
	"scartha le camóg",
WhatIsTheNewTag:
	"Céard é an teag nua?\nLe teaganna iolraithe a úsaid, scarthaigh le camóg.",
WhichTagsDoYouWantToRemove:
	"Cén teaganna is míon leat a scrios?\nle teaganna iolraithe a scriosa, scarthaigh le camóg."
}
