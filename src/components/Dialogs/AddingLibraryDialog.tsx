import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { addLibrary } from '@/utils/Fetchers.ts';
import Logger from '@/logger.ts';
import VerticalStepper from '../VerticalStepper';

/**
 * A dialog component for adding a library.
 * @param onClose - A function to close the dialog.
 * @param openModal - A boolean value to determine if the dialog is open or not.
 * @returns A React component.
 */
export default function AddingLibraryDialog({ onClose, openModal }: {
	onClose: any,
	openModal: boolean,
}) {
	const [open, setOpen] = React.useState(openModal);
	const [provider, setProvider] = React.useState<any>("");
	const [name, setName] = React.useState<any>("");
	const [location, setLocation] = React.useState<any>("");
	const { t } = useTranslation();

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

	return (
		<div>
			<Dialog open={open} onClose={handleClose} fullWidth={true}
				maxWidth="md">
				<DialogTitle>{t("addLib")}</DialogTitle>
				<DialogContent>
					<Box
						component="form"
						sx={{
							marginTop: "10px",
							width: '100%',
						}}
						noValidate
						autoComplete="off"
					>
						<VerticalStepper steps={[
							{
								label: t("nameOfLib"),
								content: <TextField sx={{ width: "100%" }} id="namelocation" label={t("nameOfLib")} variant="outlined"
									onBlur={(event) => { setName(event.target.value); }}
								/>
							},
							{
								label: t("locationOnServer"),
								content: <TextField sx={{ width: "100%" }} id="locationa" label={t("locationOnServer")} variant="outlined"
									onBlur={(event) => { setLocation(event.target.value); }}
								/>
							},
							{
								label: t("selectAProvider"),
								content: <FormControl fullWidth
									sx={
										{
											width: "100%",
										}
									}
								>
									<InputLabel id="demo-simple-select-label">{t("selectAProvider")}</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										value={provider}
										label={t("selectAProvider")}
										onChange={async (provider: any) => {
											setProvider(provider.target.value);
										}}
									>
										<MenuItem value={1}>Marvel (Comics Marvel & Star Wars)</MenuItem>
										<MenuItem value={2}>Anilist (Manga)</MenuItem>
										<MenuItem value={3}>Open Library</MenuItem>
										<MenuItem value={4}>Google Books</MenuItem>
										<MenuItem value={0}>MANUAL</MenuItem>
									</Select>
								</FormControl>
							},
						]}
							onFinish={() => {
								addLibrary({ 'form': [name, location, provider] });
								Logger.debug("Adding library: " + name + " " + location + " " + provider);
							}
							}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t("cancel")}</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}