"use client";

import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { TranslatedText, createTranslatedText } from "@/types/translations";

interface BilingualArrayTableProps {
    label: string;
    items: TranslatedText[] | null | undefined;
    onChange: (items: TranslatedText[]) => void;
    placeholder?: string;
}

export default function BilingualArrayTable({
    label,
    items,
    onChange,
    placeholder = "Enter text",
}: BilingualArrayTableProps) {
    // Ensure items is always an array
    const safeItems = Array.isArray(items) ? items : [];

    const handleAdd = () => {
        // Add a new empty row
        const newItem = createTranslatedText("", "");
        onChange([...safeItems, newItem]);
    };

    const handleChange = (index: number, lang: "en" | "ar", value: string) => {
        const newItems = [...safeItems];
        newItems[index] = {
            ...newItems[index],
            [lang]: value,
        };
        onChange(newItems);
    };

    const handleRemove = (index: number) => {
        onChange(safeItems.filter((_, i) => i !== index));
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" component="div" fontWeight="medium">
                    {label}
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    size="small"
                    variant="outlined"
                >
                    Add Item
                </Button>
            </Box>

            {safeItems.length === 0 ? (
                <Box
                    sx={{
                        p: 2,
                        border: '1px dashed #ccc',
                        borderRadius: 1,
                        textAlign: 'center',
                        bgcolor: '#f9f9f9',
                        color: 'text.secondary'
                    }}
                >
                    No items added. Click &quot;Add Item&quot; to start.
                </Box>
            ) : (
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                <TableCell width="45%">English</TableCell>
                                <TableCell width="45%">Arabic (العربية)</TableCell>
                                <TableCell width="10%" align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {safeItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={item.en || ""}
                                            onChange={(e) => handleChange(index, "en", e.target.value)}
                                            placeholder={placeholder}
                                            variant="standard"
                                            InputProps={{ disableUnderline: true }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={item.ar || ""}
                                            onChange={(e) => handleChange(index, "ar", e.target.value)}
                                            placeholder="النص العربي"
                                            variant="standard"
                                            dir="rtl"
                                            InputProps={{
                                                disableUnderline: true,
                                                style: { textAlign: 'right' }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => handleRemove(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
