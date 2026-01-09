"use client";

import { Box, Button, Card, CardContent, Grid, IconButton, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { CourseLevel } from "@/types/courses";
import { createTranslatedText } from "@/types/translations";

interface CourseLevelEditorProps {
    levels: CourseLevel[];
    onChange: (levels: CourseLevel[]) => void;
}

export default function CourseLevelEditor({ levels, onChange }: CourseLevelEditorProps) {

    const handleAdd = () => {
        const newLevel: CourseLevel = {
            name: createTranslatedText("", ""),
            description: createTranslatedText("", ""),
            duration: "",
            price: "",
        };
        onChange([...(levels || []), newLevel]);
    };

    const handleChange = (index: number, field: keyof CourseLevel, value: any) => {
        const newLevels = [...levels];
        newLevels[index] = { ...newLevels[index], [field]: value };
        onChange(newLevels);
    };

    const handleTranslatedChange = (index: number, field: 'name' | 'description', lang: 'en' | 'ar', value: string) => {
        const newLevels = [...levels];
        newLevels[index] = {
            ...newLevels[index],
            [field]: {
                ...newLevels[index][field],
                [lang]: value
            }
        };
        onChange(newLevels);
    };

    const handleRemove = (index: number) => {
        onChange(levels.filter((_, i) => i !== index));
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" component="div" fontWeight="medium">
                    Course Levels & Modules
                </Typography>
                <Button
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    size="small"
                    variant="outlined"
                >
                    Add Level
                </Button>
            </Box>

            {(!levels || levels.length === 0) && (
                <Box
                    sx={{
                        p: 3,
                        border: '1px dashed #ccc',
                        borderRadius: 1,
                        textAlign: 'center',
                        bgcolor: '#f9f9f9',
                        color: 'text.secondary'
                    }}
                >
                    No levels added. Click &quot;Add Level&quot; to start.
                </Box>
            )}

            {levels?.map((level, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2, position: 'relative' }}>
                    <IconButton
                        onClick={() => handleRemove(index)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        color="error"
                        size="small"
                    >
                        <DeleteIcon />
                    </IconButton>

                    <CardContent>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Level {index + 1}
                        </Typography>

                        <Grid container spacing={2}>
                            {/* Names */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Level Name (English)"
                                    value={level.name?.en || ""}
                                    onChange={(e) => handleTranslatedChange(index, "name", "en", e.target.value)}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Level Name (Arabic)"
                                    value={level.name?.ar || ""}
                                    onChange={(e) => handleTranslatedChange(index, "name", "ar", e.target.value)}
                                    fullWidth
                                    size="small"
                                    dir="rtl"
                                />
                            </Grid>

                            {/* Details */}
                            <Grid item xs={6} md={3}>
                                <TextField
                                    label="Duration"
                                    value={level.duration || ""}
                                    onChange={(e) => handleChange(index, "duration", e.target.value)}
                                    fullWidth
                                    size="small"
                                    placeholder="e.g. 4 Weeks"
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <TextField
                                    label="Price"
                                    value={level.price || ""}
                                    onChange={(e) => handleChange(index, "price", e.target.value)}
                                    fullWidth
                                    size="small"
                                    placeholder="e.g. 2500 EGP"
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
