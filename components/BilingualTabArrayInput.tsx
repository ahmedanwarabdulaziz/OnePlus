"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  Typography,
} from "@mui/material";
import { TranslatedText } from "@/types/translations";

interface BilingualTabArrayInputProps {
  label: string;
  items: TranslatedText[];
  onChange: (items: TranslatedText[]) => void;
  placeholder?: string;
  lang: "en" | "ar";
}

export default function BilingualTabArrayInput({
  label,
  items,
  onChange,
  placeholder = "Enter text",
  lang,
}: BilingualTabArrayInputProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      // Ensure items is always an array
      const currentItems = Array.isArray(items) ? items : [];
      const newItems = [...currentItems];

      // Get the last item's values for the other language
      const lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;

      // Always create a new item - matching will be done by index
      const newItem: TranslatedText = {
        en: lang === "en" ? input.trim() : (lastItem?.en || ""),
        ar: lang === "ar" ? input.trim() : (lastItem?.ar || ""),
      };

      newItems.push(newItem);
      onChange(newItems);
      setInput("");
    }
  };

  const handleEdit = (index: number, newValue: string) => {
    // Ensure items is always an array
    const currentItems = Array.isArray(items) ? items : [];
    if (index < 0 || index >= currentItems.length) {
      console.error(`Invalid index ${index} for items array of length ${currentItems.length}`);
      return;
    }

    const newItems = [...currentItems];
    newItems[index] = {
      ...(newItems[index] || { en: "", ar: "" }),
      [lang]: newValue.trim(),
    };
    onChange(newItems);
  };

  const handleRemove = (index: number) => {
    // Ensure items is always an array
    const currentItems = Array.isArray(items) ? items : [];
    if (index < 0 || index >= currentItems.length) {
      console.error(`Invalid index ${index} for items array of length ${currentItems.length}`);
      return;
    }
    onChange(currentItems.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
        {lang === "ar" && (
          <Typography
            component="span"
            variant="caption"
            sx={{ ml: 1, color: "text.secondary" }}
          >
            (Optional - matches with English items by position)
          </Typography>
        )}
      </Typography>
      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
        {Array.isArray(items) && items.map((item, index) => {
          // Ensure item is a valid TranslatedText object
          const safeItem = item && typeof item === "object" ? item : { en: "", ar: "" };
          const displayText = lang === "en" ? safeItem.en || "" : safeItem.ar || "";
          const pairText = lang === "en" ? safeItem.ar : safeItem.en;
          return (
            <Chip
              key={index}
              label={
                displayText ||
                (pairText ? `[${pairText}]` : `Item ${index + 1}`)
              }
              onDelete={() => handleRemove(index)}
              size="small"
              color={displayText ? "primary" : "default"}
            />
          );
        })}
      </Box>
      <Box display="flex" gap={1}>
        <TextField
          size="small"
          label={`${label} (${lang === "en" ? "English" : "Arabic"})`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          fullWidth
          inputProps={{
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
        />
        <Button
          onClick={handleAdd}
          variant="outlined"
          size="small"
          sx={{ minWidth: "80px", height: "40px" }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
