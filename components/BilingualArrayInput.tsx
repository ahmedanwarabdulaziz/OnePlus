"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { TranslatedText } from "@/types/translations";

interface BilingualArrayInputProps {
  label: string;
  items: TranslatedText[];
  onChange: (items: TranslatedText[]) => void;
  placeholderEn?: string;
  placeholderAr?: string;
}

export default function BilingualArrayInput({
  label,
  items,
  onChange,
  placeholderEn = "Enter English text",
  placeholderAr = "Enter Arabic text",
}: BilingualArrayInputProps) {
  const [enInput, setEnInput] = useState("");
  const [arInput, setArInput] = useState("");

  const handleAdd = () => {
    if (enInput.trim() || arInput.trim()) {
      onChange([
        ...items,
        {
          en: enInput.trim() || arInput.trim(),
          ar: arInput.trim() || enInput.trim(),
        },
      ]);
      setEnInput("");
      setArInput("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
        <Typography
          component="span"
          variant="caption"
          sx={{ ml: 1, color: "text.secondary" }}
        >
          (At least one language per item)
        </Typography>
      </Typography>
      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
        {items.map((item, index) => (
          <Chip
            key={index}
            label={`${item.en}${item.ar && item.ar !== item.en ? ` / ${item.ar}` : ""}`}
            onDelete={() => handleRemove(index)}
            size="small"
          />
        ))}
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={5}>
          <TextField
            size="small"
            label={`${label} (English)`}
            value={enInput}
            onChange={(e) => setEnInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={placeholderEn}
            fullWidth
            helperText="Enter English or Arabic"
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            size="small"
            label={`${label} (Arabic)`}
            value={arInput}
            onChange={(e) => setArInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={placeholderAr}
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                direction: "rtl",
                textAlign: "right",
              },
            }}
            helperText="Enter Arabic or English"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            onClick={handleAdd}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ height: "40px" }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
