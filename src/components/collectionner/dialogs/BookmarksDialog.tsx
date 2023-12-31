import * as React from 'react';
import {useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useTranslation} from 'react-i18next';
import {currentProfile, PDP} from '@/utils/Common.ts';
import {getFromDB} from '@/utils/Fetchers.ts';
import {openBOOKM} from '@/utils/utils.ts';
import {Block} from '@mui/icons-material';

export default function BookmarksDialog({onClose, openModal}: {
    onClose: any,
    openModal: boolean,
}) {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(openModal);
    const [bookmarks, setBookmarks] = React.useState<any[]>([]);

    // This is used to update the state of the dialog when the parent component changes the value of openModal.
    useEffect(() => {
        if (openModal !== open) {
            setOpen(openModal);
        }
    }, [openModal, open]);

    // This is used to update the state of the parent component when the dialog is closed.
    const handleClose = () => {
        setOpen(false);
        onClose();
    };


    /**
     * Gets the bookmarks from the database.
     */
    const listBM = async () => {
        const option = {
            method: 'GET', headers: {
                'Content-Type': 'application/json', "token": currentProfile.getToken,
            }
        };
        fetch(PDP + "/BM/getBM", option).then((response) => {
            return response.json();
        }).then(function (info) {
            info.forEach((file: any) => {
                getFromDB("Books", "URLCover,NOM FROM Books WHERE ID_BOOK = '" + file["BOOK_ID"] + "'").then(async (resa: any) => {
                    const jsonResa = JSON.parse(resa);
                    console.log(jsonResa);
                    setBookmarks(bookmarks => [...bookmarks, {
                            URLCover: jsonResa[0].URLCover,
                            page: file["page"],
                            path: file["PATH"],
                            title: jsonResa[0].NOM
                        }]
                    );
                });
            });
        }).catch(function (error) {
            console.log(error);
        });
    };

    React.useLayoutEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        listBM();
    }, []);

    return (
        <div>
            <Dialog open={open} onClose={handleClose}
                    fullWidth={true}
                    maxWidth="md"
            >
                <DialogTitle>{t("Bookmark")}</DialogTitle>
                <DialogContent>
                    <div id="bookmarkContainer" style={{textAlign: "center"}}>
                        {
                            bookmarks.length > 0 ?
                                bookmarks.map((bookmark: any, index: number) => {
                                    console.log(bookmark);
                                    return (
                                        <div key={index}>
                                            <img src={bookmark.URLCover} onError={(e: any) => {
                                                e.target.src = "Images/fileDefault.webp";
                                            }} alt={bookmark.title} width={"auto"} height={150}/>
                                            <Button
                                                onClick={() => {
                                                    openBOOKM(bookmark.path, bookmark.page);
                                                }
                                                }
                                            >
                                                {
                                                    t("Seethepage") + " " + bookmark.page + " " + t("of") + " " + bookmark.title
                                                }
                                            </Button>
                                        </div>
                                    );
                                }) : <div><Block/></div>
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t("cancel")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}