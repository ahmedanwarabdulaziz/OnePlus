"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { TranslatedText } from "@/types/translations";

interface BilingualTabDropdownArrayInputProps {
  label: string;
  items: TranslatedText[];
  onChange: (items: TranslatedText[]) => void;
  placeholder?: string;
  lang: "en" | "ar";
  field: "specialties" | "certifications" | "areasOfExpertise" | "languages";
}

export default function BilingualTabDropdownArrayInput({
  label,
  items,
  onChange,
  placeholder = "Select or add new",
  lang,
  field,
}: BilingualTabDropdownArrayInputProps) {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<TranslatedText[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch existing options from API
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/staff/options?field=${field}`);
        const data = await response.json();
        if (data.success) {
          setOptions(data.options || []);
        }
      } catch (error) {
        console.error(`Error fetching ${field} options:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [field]);

  // Get display text for current language
  const getDisplayText = (item: TranslatedText): string => {
    if (lang === "en") {
      return item.en || item.ar || "";
    } else {
      return item.ar || item.en || "";
    }
  };

  // Filter options based on current language and input
  const filteredOptions = options.filter((option) => {
    const displayText = getDisplayText(option).toLowerCase();
    return displayText.includes(input.toLowerCase());
  });

  // Check if input matches an existing option
  const findMatchingOption = (text: string): TranslatedText | null => {
    const normalizedText = text.toLowerCase().trim();
    return (
      options.find(
        (opt) => getDisplayText(opt).toLowerCase().trim() === normalizedText
      ) || null
    );
  };

  const handleAdd = () => {
    if (!input.trim()) return;

    // Ensure items is always an array
    const currentItems = Array.isArray(items) ? items : [];
    const matchingOption = findMatchingOption(input);

    if (matchingOption) {
      // If it matches an existing option, add it if not already in items
      const exists = currentItems.some(
        (item) =>
          getDisplayText(item).toLowerCase().trim() ===
          getDisplayText(matchingOption).toLowerCase().trim()
      );

      if (!exists) {
        onChange([...currentItems, matchingOption]);
      }
    } else {
      // Create new item
      const newItem: TranslatedText = {
        en: lang === "en" ? input.trim() : "",
        ar: lang === "ar" ? input.trim() : "",
      };

      // Check if we need to match with existing item by index
      // For now, just add it
      onChange([...currentItems, newItem]);

      // Also add to options for future use (optimistic update)
      setOptions([...options, newItem].sort((a, b) => {
        const aText = getDisplayText(a).toLowerCase();
        const bText = getDisplayText(b).toLowerCase();
        return aText.localeCompare(bText);
      }));
    }

    setInput("");
  };

  const handleSelectOption = (option: TranslatedText | null) => {
    if (!option) return;

    // Ensure items is always an array
    const currentItems = Array.isArray(items) ? items : [];
    const exists = currentItems.some(
      (item) =>
        getDisplayText(item).toLowerCase().trim() ===
        getDisplayText(option).toLowerCase().trim()
    );

    if (!exists) {
      onChange([...currentItems, option]);
    }
    setInput("");
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
          const displayText = getDisplayText(safeItem);
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
        <Autocomplete
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          options={filteredOptions}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            return getDisplayText(option);
          }}
          loading={loading}
          inputValue={input}
          onInputChange={(event, newInputValue) => {
            setInput(newInputValue);
          }}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              // Handle string input (e.g. user typed and pressed enter but didn't select option)
              // Logic already handled by handleAdd via separate button/state, 
              // but if selection happens we should handle it.
              // For freeSolo, standard onChange might not trigger with string if not selected.
              // Actually, freeSolo + onChange with string happens on blur or enter with value.
              // Let's rely on handleAdd for custom additions usually, but if they pick a string?
              // Existing logic used handleSelectOption which expects TranslatedText.
              // If newValue is string, we can try to find match or treat as new.
              return;
            }
            if (newValue) {
              handleSelectOption(newValue);
            }
          }}
          freeSolo
          fullWidth
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label={`${label} (${lang === "en" ? "English" : "Arabic"})`}
              placeholder={placeholder}
              inputProps={{
                ...params.inputProps,
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
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Button
          onClick={handleAdd}
          variant="outlined"
          size="small"
          sx={{ minWidth: "80px", height: "40px" }}
          disabled={!input.trim()}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
