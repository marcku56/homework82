import React, { useRef, useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';

interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    label: string;
}

const FileInput: React.FC<Props> = ({ onChange, name, label }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [filename, setFilename] = useState('');

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFilename(e.target.files[0].name);
        } else {
            setFilename('');
        }
        onChange(e);
    };

    const activateInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <>
            <input
                type="file"
                name={name}
                style={{ display: 'none' }}
                ref={inputRef}
                onChange={onFileChange}
            />
            <Grid sx={{spacing: 2, alignItems: "center"}}>
                <Grid size={{ xs: 8 }}>
                    <TextField
                        disabled
                        label={label}
                        value={filename}
                        onClick={activateInput}
                        fullWidth
                    />
                </Grid>
                <Grid size={{ xs: 4 }}>
                    <Button variant="contained" onClick={activateInput} fullWidth>
                        Browse
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default FileInput;