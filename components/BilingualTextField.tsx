"use client";

import { TextField, Box, Typography, Grid } from "@mui/material";
import { TranslatedText } from "@/types/translations";

interface BilingualTextFieldProps {
  label: string;
  value: TranslatedText | string;
  onChange: (value: TranslatedText) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  helperText?: string;
}

export default function BilingualTextField({
  label,
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 1,
  maxLength,
  helperText,
}: BilingualTextFieldProps) {
  // Convert string to TranslatedText for backward compatibility
  const textValue: TranslatedText =
    typeof value === "string"
      ? { en: value, ar: "" }
      : value || { en: "", ar: "" };

  const handleEnChange = (en: string) => {
    onChange({ ...textValue, en });
  };

  const handleArChange = (ar: string) => {
    onChange({ ...textValue, ar });
  };

  const enLength = textValue.en?.length || 0;
  const arLength = textValue.ar?.length || 0;
  const showLength = maxLength !== undefined;

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
        <Typography
          component="span"
          variant="caption"
          sx={{ ml: 1, color: "text.secondary", fontWeight: "normal" }}
        >
          (At least one language required)
        </Typography>
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="English"
            value={textValue.en || ""}
            onChange={(e) => handleEnChange(e.target.value)}
            multiline={multiline}
            rows={rows}
            fullWidth
            inputProps={{ maxLength }}
            helperText={
              showLength
                ? `${enLength}/${maxLength} characters`
                : helperText || "Enter English text"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Arabic (العربية)"
            value={textValue.ar || ""}
            onChange={(e) => handleArChange(e.target.value)}
            multiline={multiline}
            rows={rows}
            fullWidth
            inputProps={{ maxLength }}
            sx={{
              "& .MuiInputBase-input": {
                direction: "rtl",
                textAlign: "right",
              },
            }}
            helperText={
              showLength
                ? `${arLength}/${maxLength} characters`
                : helperText || "Enter Arabic text (optional)"
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
