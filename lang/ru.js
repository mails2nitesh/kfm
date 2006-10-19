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
	"ошибка: ",
// what you see on the main page
Directories:
	"Каталоги",
CurrentWorkingDir:
	"Текущий рабочий каталог: \"%1\"",
Logs:
	"Логи",
FileUpload:
	"Загрузка файла",
DirEmpty:
	"не найдены файлы в \"%1\"",

// right click menu item directory
// directory
CreateSubDir:
	"создать подкаталог",
DeleteDir:
	"удалить",
RenameDir:
	"переименовать",

//file
DeleteFile:
	"удалить",
RenameFile:
	"переименовать",
RotateClockwise:
	"повернуть вправо",
RotateAntiClockwise:
	"повернуть влево",
ResizeImage:
	"изменить размер картинки",
ChangeCaption:
	"изменить подпись",

// create a file
WhatFilenameToCreateAs:
	"Файл будет сохранён, как?",
AskIfOverwrite:
	"Файл \"%1\" существует. Перезаписать?",
NoForwardslash:
	"\nНельзя использовать '/' в имени файла",

// messages management
CreateDirMessage:
	"Создать подкаталог в \"%1\":",
DelDirMessage:
	"Вы уверены, что хотите удалить каталог \"%1\"?",
DelFileMessage:
	"Вы уверены, что хотите удалить файл \"%1\"",
DelMultipleFilesMessage:
	"Вы уверены, что хотите удалить перечисленные файлы?\n\n'",
DownloadFileFromMessage:
	"Откуда закачивать файл?",
FileSavedAsMessage:
	"Как будет сохранён файл?",

//resize file
CurrentSize:
	"Текущий размер: \"%1\" x \"%2\"\n",
NewWidth:
	"Новая ширина?",
NewWidthConfirmTxt:
	"Новая ширина: \"%1\"\n",
NewHeight:
	"Новая высота?",
NewHeightConfirmTxt:
	"Новая высота: \"%1\"\n\nIs this correct?",

// log messages
RenamedFile:
	"переименование файла \"%1\" в \"%2\".",
DirRefreshed:
	"каталоги обновлены.",
FilesRefreshed:
	"файлы обновлены.",
NotMoreThanOneFile:
	"ошибка: нельзя выбрать больше одного файла за раз",
UnknownPanelState:
	"ошибка: неизвестное состояние панели.",
//MissingDirWrapper:
//	"error: missing directory wrapper: \"kfm_directories%1\".",
SetStylesError:
	"ошибка: нельзя установить \"%1\" в \"%2\.",
NoPanel:
	"ошибка: панель \"%1\" не существует.",
FileSelected:
	"выбран файл: \"%1\"",
log_ChangeCaption:
	"изменение подписи с \"%1\" на \"%2\"",
UrlNotValidLog:
	"Ошибка: URL должен начинаться с \"http:\"",
MovingFilesTo:
	"перемещение файла [\"%1\"] в \"%2\"",

// error messages
DirectoryNameExists:
	"каталог с таким именем уже существует.",
FileNameNotAllowd:
	"ошибка: имя файла запрещено",
CouldNotWriteFile:
	"ошибка: нельзя записать файл \"%1\".",
CouldNotRemoveDir:
	"нельзя удалить каталог.\nвозможно он не пуст",
UrlNotValid:
	"ошибка: URL должен начинаться с \"http:\"",
CouldNotDownloadFile:
	"ошибка: невозможно загрузить файл \"%1\".",
FileTooLargeForThumb:
	"ошибка: \"%1\" слишком большой чтобы сделать ярлык. Замените файл на меньший по размеру",
CouldntReadDir:
	"ошибка: невозможно прочитать каталог",
CannotRenameFile:
	"ошибка: нельзя переименовать \"%1\" в \"%2\"",
FilenameAlreadyExists:
	"ошибка: файл с таким именем уже существует",

// new in 0.5
EditTextFile:
	"редактирование текстового файла",
CloseWithoutSavingQuestion:
	"Уверены, что хотите закрыть без сохранения?",
CloseWithoutSaving:
	"Закрыть без сохранения",
SaveThenClose:
	"Сохранять, при закрытии",
SaveThenCloseQuestion:
	"Сохранить изменения?",

// new in 0.6
LockPanels:
	"закрепить панели",
UnlockPanels:
	"снять закрепление панелей",
CreateEmptyFile:
	"создать пустой файл",
DownloadFileFromUrl:
	"загрузить с URL",
DirectoryProperties:
	"Свойства каталога",
SelectAll:
	"выделить всё",
SelectNone:
	"снять выделение",
InvertSelection:
	"инвертировать выделение",
LoadingKFM:
	"загрузка KFM",
Name:
	"имя",
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
	"directory not in database"
}
