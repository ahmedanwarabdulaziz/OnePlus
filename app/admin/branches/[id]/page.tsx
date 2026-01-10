"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    TextField,
    FormControlLabel,
    Switch,
    Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageUpload from "@/components/ImageUpload";
import { BranchInput } from "@/types/branches";

// Initial empty state
const initialForm: BranchInput = {
    slug: "",
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    image: "",
    icon: "",
    color: "#0f1b4b",
    displayOrder: 0,
    isActive: true,
    isFeatured: false,
};

export default function BranchEditor() {
    const params = useParams();
    const router = useRouter();
    const isNew = !params?.id;

    const [form, setForm] = useState<BranchInput>(initialForm);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isNew && params.id) {
            fetchBranch(params.id as string);
        }
    }, [params.id, isNew]);

    const fetchBranch = async (id: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/branches/${id}`);
            const data = await res.json();
            if (data.success) {
                // Ensure all fields exist
                setForm({ ...initialForm, ...data.branch });
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof BranchInput, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleTranslatedChange = (field: 'name' | 'description', lang: 'en' | 'ar', value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value }
        }));
    };

    const generateSlug = () => {
        const slug = form.name.en
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        setForm(prev => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const url = isNew ? "/api/admin/branches" : `/api/admin/branches/${params.id}`;
            const method = isNew ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (data.success) {
                router.push("/admin/branches");
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <Box component="form" onSubmit={handleSubmit}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push("/admin/branches")}
                        >
                            Back
                        </Button>
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            {isNew ? "Create Branch" : "Edit Branch"}
                        </Typography>
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={saving}
                        size="large"
                        sx={{ bgcolor: "#701621" }}
                    >
                        {saving ? "Saving..." : "Save Branch"}
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 4, mb: 4 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Basic Information
                            </Typography>

                            <Grid container spacing={3}>
                                {/* Name - Side by Side */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Name (English)"
                                        fullWidth
                                        value={form.name.en}
                                        onChange={(e) => handleTranslatedChange("name", "en", e.target.value)}
                                        onBlur={() => isNew && !form.slug && generateSlug()}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Name (Arabic) / الاسم بالعربية"
                                        fullWidth
                                        value={form.name.ar}
                                        onChange={(e) => handleTranslatedChange("name", "ar", e.target.value)}
                                        dir="rtl"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="URL Slug"
                                        fullWidth
                                        value={form.slug}
                                        onChange={(e) => handleChange("slug", e.target.value)}
                                        helperText="Unique identifier for URL (e.g., medical-track)"
                                        required
                                    />
                                </Grid>

                                {/* Description - Side by Side */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Description (English)"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={form.description.en}
                                        onChange={(e) => handleTranslatedChange("description", "en", e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Description (Arabic) / الوصف بالعربية"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={form.description.ar}
                                        onChange={(e) => handleTranslatedChange("description", "ar", e.target.value)}
                                        dir="rtl"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Theme Color"
                                        fullWidth
                                        type="color"
                                        value={form.color}
                                        onChange={(e) => handleChange("color", e.target.value)}
                                        helperText="Used for backgrounds and accents"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Display Order"
                                        fullWidth
                                        type="number"
                                        value={form.displayOrder}
                                        onChange={(e) => handleChange("displayOrder", parseInt(e.target.value))}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 4, mb: 4 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Status & Media
                            </Typography>

                            <Box mb={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.isActive}
                                            onChange={(e) => handleChange("isActive", e.target.checked)}
                                        />
                                    }
                                    label={form.isActive ? "Active (Visible)" : "Inactive (Hidden)"}
                                />
                            </Box>

                            <Box mb={3}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={!!form.isFeatured}
                                            onChange={(e) => handleChange("isFeatured", e.target.checked)}
                                        />
                                    }
                                    label={form.isFeatured ? "Featured (Highlighted)" : "Standard"}
                                />
                            </Box>

                            <Box mb={4}>
                                <ImageUpload
                                    label="Hero Image (Wide)"
                                    imageType="hero"
                                    folder="branches"
                                    value={form.image}
                                    onChange={(url) => handleChange("image", url)}
                                />
                            </Box>

                            <Box>
                                <ImageUpload
                                    label="Icon / Logo (Square)"
                                    imageType="square"
                                    folder="branches"
                                    value={form.icon}
                                    onChange={(url) => handleChange("icon", url)}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
