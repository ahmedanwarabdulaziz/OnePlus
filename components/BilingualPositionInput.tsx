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

interface BilingualPositionInputProps {
  positions: TranslatedText[];
  onChange: (positions: TranslatedText[]) => void;
}

export default function BilingualPositionInput({
  positions,
  onChange,
}: BilingualPositionInputProps) {
  const [enInput, setEnInput] = useState("");
  const [arInput, setArInput] = useState("");

  const handleAdd = () => {
    if (enInput.trim() || arInput.trim()) {
      onChange([
        ...positions,
        {
          en: enInput.trim() || arInput.trim(), // Use Arabic if English not provided
          ar: arInput.trim() || enInput.trim(), // Use English if Arabic not provided
        },
      ]);
      setEnInput("");
      setArInput("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(positions.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Positions
        <Typography
          component="span"
          variant="caption"
          sx={{ ml: 1, color: "text.secondary" }}
        >
          (At least one language per position)
        </Typography>
      </Typography>
      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
        {positions.map((pos, index) => (
          <Chip
            key={index}
            label={`${pos.en}${pos.ar ? ` / ${pos.ar}` : ""}`}
            onDelete={() => handleRemove(index)}
            size="small"
          />
        ))}
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={5}>
          <TextField
            size="small"
            label="Position (English)"
            value={enInput}
            onChange={(e) => setEnInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="e.g., Senior Trainer (optional)"
            fullWidth
            helperText="Enter English or Arabic"
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            size="small"
            label="Position (Arabic)"
            value={arInput}
            onChange={(e) => setArInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="مثال: مدرب أول (اختياري)"
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
