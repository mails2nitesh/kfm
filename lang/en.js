/*
 * See ../license.txt for licensing
 *
 * For further information visit:
 * 	http://kfm.verens.com/
 *
 * File Name: en.js
 * 	English language file.
 *
 * File Authors:
 * 	kae@verens.com
 */

var kfm_lang=
{
Dir:
	"ltr", // language direction
ErrorPrefix:
	"error: ",
// what you see on the main page
Directories:
	"Directories",
CurrentWorkingDir:
	"Current Working Directory: \"%1\"",
Logs:
	"Logs",
FileUpload:
	"File Upload",
DirEmpty:
	"no files found in \"%1\"",

// right click menu item directory
// directory
CreateSubDir:
	"create sub-directory",
DeleteDir:
	"delete",
RenameDir:
	"rename",

// file
DeleteFile:
	"delete",
RenameFile:
	"rename",
RotateClockwise:
	"rotate clock-wise",
RotateAntiClockwise:
	"rotate anti-clockwise",
ResizeImage:
	"resize image",
ChangeCaption:
	"change caption",

// create a file
WhatFilenameToCreateAs:
	"What should the file be created as?",
AskIfOverwrite:
	"The file \"%1\" already exists. Overwrite?",
NoForwardslash:
	"\nYou may not use '/' in the filename",

// messages management
CreateDirMessage:
	"Create a sub-directory of \"%1\":",
DelDirMessage:
	"Are you sure you want to delete the directory \"%1\"?",
DelFileMessage:
	"Are you sure you want to delete the file \"%1\"",
DelMultipleFilesMessage:
	"Are you sure you want to delete the following files?\n\n",
DownloadFileFromMessage:
	"Download file from where?",
FileSavedAsMessage:
	"What should the file be saved as?",

// resize file
CurrentSize:
	"Current Size: \"%1\" x \"%2\"\n",
NewWidth:
	"New Width?",
NewWidthConfirmTxt:
	"New Width: \"%1\"\n",
NewHeight:
	"New Height?",
NewHeightConfirmTxt:
	"New Height: \"%1\"\n\nIs this correct?",

// log messages
RenamedFile:
	"renaming file \"%1\" to \"%2\".",
DirRefreshed:
	"directories refreshed.",
FilesRefreshed:
	"files refreshed.",
NotMoreThanOneFile:
	"error: you cannot choose more than one file at a time",
UnknownPanelState:
	"error: unknown panel state.",
// MissingDirWrapper:
// 	"error: missing directory wrapper: \"kfm_directories%1\".",
SetStylesError:
	"error: cannot set \"%1\" to \"%2\.",
NoPanel:
	"error: panel \"%1\" doesn\'t exist.",
FileSelected:
	"file selected: \"%1\"",
log_ChangeCaption:
	"changing caption of \"%1\" to \"%2\"",
UrlNotValidLog:
	"error: URL must begin with \"http:\"",
MovingFilesTo:
	"moving files [\"%1\"] to \"%2\"",

// error messages
DirectoryNameExists:
	"a directory of that name already exists.",
FileNameNotAllowd:
	"error: filename not allowed",
CouldNotWriteFile:
	"error: could not write file \"%1\".",
CouldNotRemoveDir:
	"cannot remove directory.\nplease make sure it is empty",
UrlNotValid:
	"error: URL must begin with \"http:\"",
CouldNotDownloadFile:
	"error: could not download file \"%1\".",
FileTooLargeForThumb:
	"error: \"%1\" is too large to make a thumbnail. Please replace the file with a smaller version.",
CouldntReadDir:
	"error: couldn't read directory",
CannotRenameFile:
	"error: cannot rename \"%1\" to \"%2\"",
FilenameAlreadyExists:
	"error: a file of that name already exists",

// new in 0.5
EditTextFile:
	"edit text file",
CloseWithoutSavingQuestion:
	"Are you sure you want to close without saving?",
CloseWithoutSaving:
	"Close Without Saving",
SaveThenClose:
	"Save, then Close",
SaveThenCloseQuestion:
	"Are you sure you want to save the changes you made?",

// new in 0.6
LockPanels:
	"lock panels",
UnlockPanels:
	"unlock panels",
CreateEmptyFile:
	"create empty file",
DownloadFileFromUrl:
	"download file from URL",
DirectoryProperties:
	"Directory Properties",
SelectAll:
	"select all",
SelectNone:
	"select none",
InvertSelection:
	"invert selection",
LoadingKFM:
	"loading KFM",
Name:
	"name",
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
	"caption",
CopyFromURL:
	"Copy from URL",
ExtractZippedFile:
	"Extract zipped file"
}
