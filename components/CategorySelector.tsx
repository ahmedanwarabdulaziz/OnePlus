"use client";

import { useState, useEffect } from "react";
import {
    Autocomplete,
    TextField,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TranslatedText, createTranslatedText } from "@/types/translations";
import BilingualInput from "./BilingualInput";

interface CategorySelectorProps {
    value: TranslatedText[];
    onChange: (categories: TranslatedText[]) => void;
    label?: string;
}

interface CategoryOption {
    id?: string;
    name: TranslatedText;
    isNew?: boolean;
}

export default function CategorySelector({
    value,
    onChange,
    label = "Categories",
}: CategorySelectorProps) {
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState<TranslatedText>(
        createTranslatedText("", "")
    );
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/categories");
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories.map((cat: any) => ({ id: cat.id, name: cat.name })));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNewCategory = async () => {
        if (!newCategoryName.en && !newCategoryName.ar) {
            alert("Please enter at least English or Arabic name");
            return;
        }

        try {
            setSaving(true);
            const response = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newCategoryName }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Add to local categories list
                const newCategory = { id: data.category.id, name: newCategoryName };
                setCategories([...categories, newCategory]);

                // Add to selected values
                onChange([...value, newCategoryName]);

                // Close dialog and reset
                setOpenNewDialog(false);
                setNewCategoryName(createTranslatedText("", ""));
            } else {
                alert(data.error || "Failed to create category");
            }
        } catch (error) {
            console.error("Error creating category:", error);
            alert("Error creating category");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (event: any, newValue: CategoryOption[]) => {
        // Extract the TranslatedText from selected options
        const selectedCategories = newValue.map((option) => option.name);
        onChange(selectedCategories);
    };

    // Convert current value to options for display
    const selectedOptions: CategoryOption[] = value.map((cat) => ({
        name: cat,
    }));

    return (
        <>
            <Box>
                <Typography variant="subtitle2" gutterBottom>
                    {label}
                </Typography>
                <Box display="flex" gap={1} alignItems="flex-start">
                    <Autocomplete
                        multiple
                        fullWidth
                        loading={loading}
                        options={categories}
                        value={selectedOptions}
                        onChange={handleChange}
                        getOptionLabel={(option) => option.name.en || option.name.ar || "Unnamed"}
                        isOptionEqualToValue={(option, value) =>
                            option.name.en === value.name.en && option.name.ar === value.name.ar
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={value.length === 0 ? "Select or add categories" : ""}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                                <Chip
                                    label={option.name.en || option.name.ar}
                                    {...getTagProps({ index })}
                                    key={index}
                                    color="primary"
                                    size="small"
                                />
                            ))
                        }
                        renderOption={(props, option) => (
                            <li {...props} key={option.id || `${option.name.en}-${option.name.ar}`}>
                                <Box>
                                    <Typography variant="body2">{option.name.en}</Typography>
                                    {option.name.ar && (
                                        <Typography variant="caption" color="text.secondary">
                                            {option.name.ar}
                                        </Typography>
                                    )}
                                </Box>
                            </li>
                        )}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenNewDialog(true)}
                        sx={{ minWidth: "auto", whiteSpace: "nowrap" }}
                    >
                        New
                    </Button>
                </Box>
            </Box>

            {/* Add New Category Dialog */}
            <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent>
                    <Box pt={1}>
                        <BilingualInput
                            label="Category Name"
                            value={newCategoryName}
                            onChange={setNewCategoryName}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewDialog(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddNewCategory}
                        variant="contained"
                        disabled={saving || (!newCategoryName.en && !newCategoryName.ar)}
                    >
                        {saving ? "Adding..." : "Add Category"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
