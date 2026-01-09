"use client";

import { TextField, Grid } from "@mui/material";
import { TranslatedText, createTranslatedText } from "@/types/translations";

interface BilingualInputProps {
    label: string;
    value: TranslatedText | null | undefined;
    onChange: (value: TranslatedText) => void;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    maxLength?: number;
}

export default function BilingualInput({
    label,
    value,
    onChange,
    required = false,
    multiline = false,
    rows = 1,
    maxLength,
}: BilingualInputProps) {
    // Ensure we always have a valid object to work with, even if value is null/undefined
    const safeValue = value || createTranslatedText("", "");

    const handleChange = (lang: "en" | "ar", text: string) => {
        if (maxLength && text.length > maxLength) return;

        onChange({
            ...safeValue,
            [lang]: text,
        });
    };

    return (
        <Grid container spacing={2}>
            {/* English Input */}
            <Grid item xs={12} md={6}>
                <TextField
                    label={`${label} (English)`}
                    value={safeValue.en || ""}
                    onChange={(e) => handleChange("en", e.target.value)}
                    fullWidth
                    required={required}
                    multiline={multiline}
                    rows={rows}
                    inputProps={maxLength ? { maxLength } : {}}
                    dir="ltr"
                />
            </Grid>

            {/* Arabic Input */}
            <Grid item xs={12} md={6}>
                <TextField
                    label={`${label} (Arabic)`}
                    value={safeValue.ar || ""}
                    onChange={(e) => handleChange("ar", e.target.value)}
                    fullWidth
                    multiline={multiline}
                    rows={rows}
                    // Note: Arabic is usually optional if strict strict mode is off, 
                    // but visually it's good to key them together. 
                    // We won't force 'required' on Arabic unless specific business logic demands it.
                    inputProps={{
                        maxLength,
                        dir: "rtl"
                    }}
                    dir="rtl"
                />
            </Grid>
        </Grid>
    );
}
