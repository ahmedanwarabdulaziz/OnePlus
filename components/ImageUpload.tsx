"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  imageType: "square" | "vertical" | "hero";
  folder?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  imageType,
  folder = "staff",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `${folder}/${imageType}`);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Use presignedUrl if available (for immediate access), otherwise use url or key
        const imageUrl = data.presignedUrl || data.url || data.key;
        console.log("Upload response:", {
          presignedUrl: !!data.presignedUrl,
          url: !!data.url,
          key: !!data.key,
          imageUrl: imageUrl?.substring(0, 50) + "..."
        });
        onChange(imageUrl);
      } else {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || "Failed to upload image";
        setError(errorMsg);
        console.error("Upload error:", data);
      }
    } catch (err: any) {
      setError(err.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Box display="flex" gap={2} alignItems="center">
        {value && (
          <Paper
            elevation={2}
            sx={{
              width: 120,
              height: imageType === "square" ? 120 : imageType === "vertical" ? 160 : 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 1,
              bgcolor: "grey.100",
            }}
          >
            {value ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={value}
                  alt={label}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    console.error("Image load error:", {
                      url: value,
                      urlLength: value?.length,
                      urlStart: value?.substring(0, 50),
                    });
                    setError(`Failed to load image preview`);
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully:", value?.substring(0, 50));
                    setError("");
                  }}
                />
              </div>
            ) : (
              <ImageIcon sx={{ color: "grey.400" }} />
            )}
          </Paper>
        )}
        <Box>
          <input
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            id={`upload-${imageType}`}
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor={`upload-${imageType}`}>
            <Button
              variant="outlined"
              component="span"
              startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
              disabled={uploading}
              size="small"
            >
              {uploading ? "Uploading..." : value ? "Change" : "Upload"}
            </Button>
          </label>
          {value && (
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => onChange("")}
              sx={{ ml: 1 }}
            >
              Remove
            </Button>
          )}
        </Box>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      {!value && !uploading && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          Recommended: {imageType === "square" ? "1:1 ratio" : imageType === "vertical" ? "3:4 ratio" : "16:9 ratio"}
        </Typography>
      )}
    </Box>
  );
}
