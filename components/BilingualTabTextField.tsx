"use client";

import { TextField, Box, Typography } from "@mui/material";
import { TranslatedText } from "@/types/translations";

interface BilingualTabTextFieldProps {
  label: string;
  value: TranslatedText | string;
  onChange: (value: TranslatedText) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  lang: "en" | "ar";
}

export default function BilingualTabTextField({
  label,
  value,
  onChange,
  required = false,
  multiline = false,
  rows = 1,
  maxLength,
  lang,
}: BilingualTabTextFieldProps) {
  // Convert string to TranslatedText for backward compatibility
  const textValue: TranslatedText =
    typeof value === "string"
      ? { en: value, ar: "" }
      : value || { en: "", ar: "" };

  const handleChange = (newValue: string) => {
    if (lang === "en") {
      onChange({ ...textValue, en: newValue });
    } else {
      onChange({ ...textValue, ar: newValue });
    }
  };

  const currentValue = lang === "en" ? textValue.en || "" : textValue.ar || "";
  const currentLength = currentValue.length;

  return (
    <Box>
      <TextField
        label={label}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        required={required && lang === "en"} // Only require English
        multiline={multiline}
        rows={rows}
        fullWidth
        inputProps={{
          maxLength,
          dir: lang === "ar" ? "rtl" : "ltr"
        }}
        sx={
          lang === "ar"
            ? {
              "& .MuiInputBase-input": {
                textAlign: "right",
              },
            }
            : {}
        }
        helperText={
          maxLength
            ? `${currentLength}/${maxLength} characters`
            : lang === "ar"
              ? "Enter Arabic text (optional)"
              : "Enter English text"
        }
      />
    </Box>
  );
}
