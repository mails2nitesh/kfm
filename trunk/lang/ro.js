/*
 * See ../license.txt for licensing
 *
 * File Name: ru.js
 * 	Russian language file.
 *
 * File Authors:
 * 	
 */

var kfm_lang=
{
Dir:
	"ltr", // language direction
ErrorPrefix:
	"eroare: ",
// what you see on the main page
Directories:
	"Directorii",
CurrentWorkingDir:
	"Directorie curenta: \"%1\"",
Logs:
	"Log-uri",
FileUpload:
	"Încărcarea fişierului",
DirEmpty:
	"fişierele n-au fost găsite în \"%1\"",

// right click menu item directory
// directory
CreateSubDir:
	"crearea subdirectoriei",
DeleteDir:
	"ştergerea",
RenameDir:
	"schimbarea numelui",

//file
DeleteFile:
	"ştergerea",
RenameFile:
	"schimbarea numelui",
RotateClockwise:
	"rotarea drept",
RotateAntiClockwise:
	"rotarea stâng",
ResizeImage:
	"schimbarea mărimii imaginii",
ChangeCaption:
	"schimbarea titlului",

// create a file
WhatFilenameToCreateAs:
	"Fişierul va fi salvat ca?",
AskIfOverwrite:
	"Fişierul \"%1\" există. Rescrierea?",
NoForwardslash:
	"\nEste ilegal de utilizat '/' în numele fişierului",

// messages management
CreateDirMessage:
	"Crearea subdirectoriei în \"%1\":",
DelDirMessage:
	"De şters catalogul \"%1\"?",
DelFileMessage:
	"De şters fişierul \"%1\"",
DelMultipleFilesMessage:
	"De şters fişierele selectate?\n\n'",
DownloadFileFromMessage:
	"De la unde de încărcat fişierul?",
FileSavedAsMessage:
	"Cum va fi slvat fişierul?",

//resize file
CurrentSize:
	"Mărimea curentă: \"%1\" x \"%2\"\n",
NewWidth:
	"Laţime nouă?",
NewWidthConfirmTxt:
	"Laţime nouă: \"%1\"\n",
NewHeight:
	"Înalţime nouă?",
NewHeightConfirmTxt:
	"Înălţime nouă: \"%1\"\n\nIs this correct?",

// log messages
RenamedFile:
	"schimbarea numelui fişierului din \"%1\" în \"%2\".",
DirRefreshed:
	"directoriile au fost reînnoite.",
FilesRefreshed:
	"fişierele au fost reînnoite.",
NotMoreThanOneFile:
	"eroare: Dvs. nu puteţi să selectaţi decât un singur fişier odată",
UnknownPanelState:
	"eroare: starea panelului necunoscută.",
//MissingDirWrapper:
//	"error: missing directory wrapper: \"kfm_directories%1\".",
SetStylesError:
	"eroare: nu se poate de instalat \"%1\" în \"%2\.",
NoPanel:
	"eroare: panela \"%1\" nu există.",
FileSelected:
	"fişierul ales: \"%1\"",
log_ChangeCaption:
	"schimbarea titlului din \"%1\" în \"%2\"",
UrlNotValidLog:
	"Eroare: URL trebui să înceapă cu \"http:\"",
MovingFilesTo:
	"mutarea fişierului din [\"%1\"] în \"%2\"",

// error messages
DirectoryNameExists:
	"directorie cu această nume deja există.",
FileNameNotAllowd:
	"eroare: numele fişierului este blocată",
CouldNotWriteFile:
	"eroare: este imposibil de salvat fişierul \"%1\".",
CouldNotRemoveDir:
	"este imposibil de şters directorie.\npoate conţine fişieri active",
UrlNotValid:
	"eroare: URL trebuie să înceapă cu \"http:\"",
CouldNotDownloadFile:
	"eroare: este imposibil de încărcat fişierul \"%1\".",
FileTooLargeForThumb:
	"eroare: \"%1\" este prea mare pentru crearea etichetei. Schimbaţi fişierul al un alt cu o mărima mai mică",
CouldntReadDir:
	"eroare: este imposibil de citit directorie",
CannotRenameFile:
	"eroare: este imposibil de schimbat numele directoriei \"%1\" în \"%2\"",
FilenameAlreadyExists:
	"eroare: fişierul cu acelaşi nume deja există",

// new in 0.5
EditTextFile:
	"redactarea fişierului text",
CloseWithoutSavingQuestion:
	"OK pentru închiderea fără salvarea?",
CloseWithoutSaving:
	"Închidrea fără salvarea",
SaveThenClose:
	"Închide cu salvarea ",
SaveThenCloseQuestion:
	"Salvarea schimbărilor?",

// new in 0.6
LockPanels:
	"fixarea panelelor",
UnlockPanels:
	"scoaterea fixării panelelor",
CreateEmptyFile:
	"crearea fişierului gol",
DownloadFileFromUrl:
	"încărca din URL",
DirectoryProperties:
	"Caracteristicile directoriei",
SelectAll:
	"sublinia tot",
SelectNone:
	"anula subliniare",
InvertSelection:
	"invertirea sublinierii",
LoadingKFM:
	"încărcare KFM",
Name:
	"nume",
FileDetails:
	"Informaţie despre fişier",
Search:
	"Căutare",
IllegalDirectoryName:
	"numele directoriei este incorectă \"%1\"",
RecursiveDeleteWarning:
	"\"%1\" contine fişiere!\nOK pentru ştergerea directoriei şi tuturor fişierelor din ea?\n*ATENŢIE* PROCESUL ESTE INREVERSIBIL!",
RmdirFailed:
	"imposibil de şters directorie \"%1\"",
DirNotInDb:
	"directorie lipseşte în baza de date",
ShowPanel:
	"de vizualizat panelă \"%1\"",
ChangeCaption:
	"Schimbarea Titlului",
NewDirectory:
	"Directorie nouă",
Upload:
	"Încărcare",
NewCaptionIsThisCorrect:
	"Titlu nou:\n%1\n\nEste Corect?",
Close:
	"închide",
Loading:
	"se încarcă",
AreYouSureYouWantToCloseKFM:
	"OK pentru închide fereastră cu KFM?",
PleaseSelectFileBeforeRename:
	"Alegeţi un fişier pentru schimbarea numelui",
RenameOnlyOneFile:
	"Puteţi să schimbaţi numele numai a unui fişier odată",
RenameFileToWhat:
	"De schimba numele fişierului \"%1\" în ...?",
NoRestrictions:
	"nu-s restricţii",
Filename:
	"numele fişierului",
Maximise:
	"extinderea",
Minimise:
	"reducerea",
AllowedFileExtensions:
	"extensiile acceptabile a fişierului",
Filesize:
	"mărimea fişierului",
MoveDown:
	"neglijarea",
Mimetype:
	"tipul mime",
MoveUp:
	"ridicarea",
Restore:
	"restituirea",
Caption:
	"titlu",
CopyFromURL:
	"Copia din URL",
ExtractZippedFile:
	"UNZIP",


// new in 0.8
ViewImage:
	"view image",
ReturnThumbnailToOpener:
	"return thumbnail to opener",
AddTagsToFiles:
	"add tags to file(s)",
RemoveTagsFromFiles:
	"remove tags from file(s)",
HowWouldYouLikeToRenameTheseFiles:
	"How would you like to rename these files?\n\nexample: \"images-***.jpg\" will rename files to \"images-001.jpg\", \"images-002.jpg\", ...",
YouMustPlaceTheWildcard:
	"You must place the wildcard character * somewhere in the filename template",
YouNeedMoreThan:
	"You need more than %1 * characters to create %2 filenames",
NoFilesSelected:
	"no files selected",
Tags:
	"tags",
IfYouUseMultipleWildcards:
	"If you use multiple wildcards in the filename template, they must be grouped together",
NewCaption:
	"New Caption",
WhatMaximumSize:
	"What maximum size should be returned?",
CommaSeparated:
	"comma-separated",
WhatIsTheNewTag:
	"What is the new tag?\nFor multiple tags, separate by commas.",
WhichTagsDoYouWantToRemove:
	"Which tags do you want to remove?\nFor multiple tags, separate by commas."
}

