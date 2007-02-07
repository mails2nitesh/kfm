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
	"níl aon comhaid in \"%1\"",

// right click menu item directory
// directory
CreateSubDir:
	"cruthaigh focomhadlann",
DeleteDir:
	"scrios",
RenameDir:
	"athainmnigh",

// file
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
	"Tá comhad le hainm \"%1\" ann cheana. Forscríobh?",
NoForwardslash:
	"\nNíl cead '/' a úsáid in ainm comhad",

// messages management
CreateDirMessage:
	"Cruthaigh focomhadlann i \"%1\":",
DelDirMessage:
	"An bhfuil tú cinnte gur mian leat an comhadlann \"%1\" a scrios?",
DelFileMessage:
	"An bhfuil tú cinnte gur mian leat an comhad \"%1\" a scrios?",
DelMultipleFilesMessage:
	"An bhfuil tú cinnte gur mian leat na comhaid seo a scrios?\n\n'",
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
	"comhaid úraighte.",
NotMoreThanOneFile:
	"earráid: ní féidir ach comhad amháin a roghnóidh ag am amháin",
UnknownPanelState:
	"earráid: stáit painéil nach bhfuil fios faoi.",
SetStylesError:
	"earráid: ní féidir \"%1\" a cur mar \"%2\.",
NoPanel:
	"earráid: níl painéil \"%1\" ann.",
FileSelected:
	"comhad roghnóidhte: \"%1\"",
log_ChangeCaption:
	"ag aithrú scríobh ó \"%1\" go \"%2\"",
UrlNotValidLog:
	"earráid: is ga an URL a tosaigh le \"http:\"",
MovingFilesTo:
	"ag bog comhaid [\"%1\"] go \"%2\"",

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
	"earráid: tá \"%1\" rómhór chun thumbnail a cruthaigh. Is ga comhad níos beag a úsáid.",
CouldntReadDir:
	"earráid: ní féidir an chomhadlann a léamh",
CannotRenameFile:
	"earráid: ní féidir \"%1\" a ainmniú mar \"%2\"",
FilenameAlreadyExists:
	"earráid: tá comhad leis an ainm sin ann cheana",

// new in 0.5
EditTextFile:
	"scríobh an comhad teacs",
CloseWithoutSavingQuestion:
	"An bhfuil tú cinnte gur mian leat an comhad a ndúnfaidh gan é a shábhail?",
CloseWithoutSaving:
	"Dún Gan Sábhail",
SaveThenClose:
	"Sábhail, agus Dún",
SaveThenCloseQuestion:
	"An bhfuil tú cinnte gur mian leat na hathruithe a shábhail?",

// new in 0.6
LockPanels:
	"cur an phainéil faoi ghlas",
UnlockPanels:
	"scaoilfidh na painéil",
CreateEmptyFile:
	"cruthaigh comhad folamh",
DownloadFileFromUrl:
	"Íosluchtaigh ó URL",
DirectoryProperties:
	"Sonraí an Chomhadlann",
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
	"Sonraí an Chomhad",
Search:
	"Cuardaigh",
IllegalDirectoryName:
	"níl cead comhadlann le ainm \"%1\"",
RecursiveDeleteWarning:
	"níl \"%1\" folamh\nAn bhfuil tú cinnte gur mhaith leat é agus a ábhair a scriosaigh?\n*RABHADH* NÍ FÉIDIR É SEO A FREASCHUR",
RmdirFailed:
	"theip orm an chomhadlann \"%1\" a scriosaigh",
DirNotInDb:
	"níl an chomhadlann sa bhunachar sonraí",
ShowPanel:
	"taispeáin an phainéil \"%1\"",
ChangeCaption:
	"Athraigh an Cheannteideal",
NewDirectory:
	"Comhadlann Nua",
Upload:
	"Uasluchtaigh Comhad",
NewCaptionIsThisCorrect:
	"Ceannteideal Nua:\n%1\n\nAn bhfuil seo ceart?",
Close:
	"dún",
Loading:
	"ag oscailt",
AreYouSureYouWantToCloseKFM:
	"An bhfuil tú cinnte gur mhaith leat KFM a dhúnadh?",
PleaseSelectFileBeforeRename:
	"Roghnaigh comhad roimhe a athainmniú",
RenameOnlyOneFile:
	"Ní féidir ach comhad amháin a athainmniú ag aon am",
RenameFileToWhat:
	"Céard is mían leat \"%1\" a athainmniú?",
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
	"cur clibeanna le comhad(anna)",
RemoveTagsFromFiles:
	"tóg clibeanna ó comhad(anna)",
HowWouldYouLikeToRenameTheseFiles:
	"Conas ar mhaith leat na chomhaid a athainmniú?\n\ne.g.: ó \"images-***.jpg\" bainfidh tú \"images-001.jpg\", \"images-002.jpg\", ...",
YouMustPlaceTheWildcard:
	"Is ga leat an litir * a chur sa teimpléad",
YouNeedMoreThan:
	"Is ga níos mó ná %1 * litir a úsáid chun %2 ainm comhaid a dhéanamh",
NoFilesSelected:
	"níl aon chomhaid roghnaithe",
Tags:
	"clibeanna",
IfYouUseMultipleWildcards:
	"Má tá iolraí * úsáidte sa teimpléad, is ga na * a bheith le chéile",
NewCaption:
	"Scríobh Nua",
WhatMaximumSize:
	"Cén méid is mó is mian leat a chur ar ais?",
CommaSeparated:
	"scartha le camóg",
WhatIsTheNewTag:
	"Céard é an clib nua?\nLe clibeanna iolraithe a úsáid, idirscar le camóg.",
WhichTagsDoYouWantToRemove:
	"Cén clibeanna is mian leat a scrios?\nLe clibeanna iolraithe a scriosa, idirscar le camóg."
}
