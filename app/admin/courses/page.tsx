"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Course, CourseInput, CourseAudience } from "@/types/courses";
import { Branch } from "@/types/branches";
import { createTranslatedText, TranslatedText } from "@/types/translations";
import BilingualInput from "@/components/BilingualInput";
import BilingualArrayTable from "@/components/BilingualArrayTable";
import CourseLevelEditor from "@/components/CourseLevelEditor";
import SortableCourseRow from "@/components/SortableCourseRow";
import ImageUpload from "@/components/ImageUpload";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const initialForm: CourseInput = {
        slug: "",
        branchIds: [],
        title: createTranslatedText("", ""),
        shortDescription: createTranslatedText("", ""),
        fullDescription: createTranslatedText("", ""),
        category: [],
        targetAudience: ["undergraduate"],
        isCertified: false,
        certificationDetails: createTranslatedText("", ""),
        levels: [],
        prerequisites: [],
        learningOutcomes: [],
        images: {},
        isActive: true,
        isFeatured: false,
        displayOrder: 0,
    };

    const [formData, setFormData] = useState<CourseInput>(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesRes, branchesRes] = await Promise.all([
                fetch("/api/admin/courses"),
                fetch("/api/admin/branches")
            ]);

            if (coursesRes.ok) {
                const data = await coursesRes.json();
                setCourses(data.courses || []);
            }
            if (branchesRes.ok) {
                const data = await branchesRes.json();
                setBranches(data.branches || []);
            }
        } catch (err) {
            setError("Error loading data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch("/api/admin/courses");
            if (response.ok) {
                const data = await response.json();
                setCourses(data.courses || []);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenDialog = (course?: Course) => {
        if (course) {
            setEditingCourse(course);

            const ensureTranslated = (val: any) =>
                typeof val === 'string' ? createTranslatedText(val, "") : (val || createTranslatedText("", ""));

            const ensureArray = (arr: any[]) =>
                (arr || []).map(item => ensureTranslated(item));

            setFormData({
                slug: course.slug || "",
                branchIds: course.branchIds || ((course as any).branchId ? [(course as any).branchId] : []),
                title: ensureTranslated(course.title),
                shortDescription: ensureTranslated(course.shortDescription),
                fullDescription: ensureTranslated(course.fullDescription),
                category: ensureArray(course.category || (course.category as any as TranslatedText ? [course.category as any] : [])),
                targetAudience: Array.isArray(course.targetAudience)
                    ? course.targetAudience
                    : (course.targetAudience ? [course.targetAudience as CourseAudience] : []),
                isCertified: course.isCertified,
                certificationDetails: ensureTranslated(course.certificationDetails),
                levels: course.levels || [],
                prerequisites: ensureArray(course.prerequisites || []),
                learningOutcomes: ensureArray(course.learningOutcomes || []),
                images: course.images || {},
                isActive: course.isActive,
                isFeatured: course.isFeatured,
                displayOrder: course.displayOrder,
            });
        } else {
            setEditingCourse(null);
            setFormData(initialForm);
        }
        setError("");
        setSuccess("");
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingCourse(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.title.en && !formData.title.ar) {
            setError("Title is required");
            return;
        }

        try {
            const url = editingCourse
                ? `/api/admin/courses/${editingCourse.id}`
                : "/api/admin/courses";
            const method = editingCourse ? "PUT" : "POST";

            // Auto-generate slug if missing
            const payload = { ...formData };
            if (!payload.slug && payload.title.en) {
                payload.slug = payload.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(
                    editingCourse ? "Course updated successfully!" : "Course created successfully!"
                );
                fetchCourses();
                setTimeout(() => {
                    handleCloseDialog();
                }, 1500);
            } else {
                setError(data.error || "Failed to save course");
            }
        } catch (err: any) {
            setError(err.message || "Error saving course");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const response = await fetch(`/api/admin/courses/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setSuccess("Course deleted successfully!");
                fetchCourses();
            } else {
                const data = await response.json();
                setError(data.error || "Failed to delete course");
            }
        } catch (err: any) {
            setError(err.message || "Error deleting course");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = courses.findIndex((item) => item.id === active.id);
            const newIndex = courses.findIndex((item) => item.id === over.id);

            const newCourses = arrayMove(courses, oldIndex, newIndex);
            setCourses(newCourses);

            const updates = newCourses.map((course, index) => ({
                id: course.id,
                displayOrder: index,
            }));

            try {
                await fetch("/api/admin/courses/reorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ updates }),
                });
            } catch (error) {
                console.error("Error updating order:", error);
                setError("Failed to update order");
                fetchCourses();
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" color="#0f1b4b">
                    Courses Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: "#0f1b4b", "&:hover": { bgcolor: "#0f1b4b" } }}
                >
                    Add Course
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
                    {success}
                </Alert>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width={50}></TableCell>
                                <TableCell>Course Title</TableCell>
                                <TableCell>Branch</TableCell>
                                <TableCell>Audience</TableCell>
                                <TableCell>Levels</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No courses found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <SortableContext
                                    items={courses.map((c) => c.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {courses.map((course) => {
                                        // Find branch names
                                        const courseBranchIds = course.branchIds || ((course as any).branchId ? [(course as any).branchId] : []);
                                        const branchNames = courseBranchIds
                                            .map(id => branches.find(b => b.id === id)?.name?.en)
                                            .filter(Boolean) as string[];

                                        return (
                                            <SortableCourseRow
                                                key={course.id}
                                                course={course}
                                                branchNames={branchNames}
                                                onEdit={handleOpenDialog}
                                                onDelete={handleDelete}
                                            />
                                        );
                                    })}
                                </SortableContext>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DndContext>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {editingCourse ? "Edit Course" : "Add New Course"}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>

                            {/* Basic Info */}
                            <Typography variant="h6" color="primary">Basic Information</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={8}>
                                    <BilingualInput
                                        label="Course Title"
                                        value={formData.title}
                                        onChange={(title) => setFormData({ ...formData, title })}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Branch / Track</InputLabel>
                                        <Select
                                            multiple
                                            value={formData.branchIds || []}
                                            label="Branch / Track"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    branchIds: typeof value === 'string' ? value.split(',') : value as string[]
                                                });
                                            }}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {(selected as string[]).map((value) => {
                                                        const branch = branches.find(b => b.id === value);
                                                        return (
                                                            <Chip key={value} label={branch?.name?.en} size="small" />
                                                        );
                                                    })}
                                                </Box>
                                            )}
                                        >
                                            {branches.map(branch => (
                                                <MenuItem key={branch.id} value={branch.id}>
                                                    {branch.name.en}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Target Audience</InputLabel>
                                        <Select
                                            multiple
                                            value={formData.targetAudience}
                                            label="Target Audience"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    targetAudience: typeof value === 'string' ? value.split(',') as CourseAudience[] : value as CourseAudience[]
                                                });
                                            }}
                                        >

                                            <MenuItem value="kids">Kids</MenuItem>
                                            <MenuItem value="undergraduate">Undergraduate</MenuItem>
                                            <MenuItem value="postgraduate">Postgraduate</MenuItem>
                                            <MenuItem value="corporate">Corporate</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BilingualArrayTable
                                        label="Categories"
                                        items={formData.category}
                                        onChange={(category) => setFormData({ ...formData, category })}
                                        placeholder="e.g. Soft Skills"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6} display="flex" alignItems="center">
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                color="primary"
                                            />
                                        }
                                        label="Active (Visible on Website)"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={!!formData.isFeatured}
                                                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                                color="warning"
                                            />
                                        }
                                        label="Featured (Highlighted)"
                                    />
                                </Grid>
                            </Grid>

                            {/* Description */}
                            <Typography variant="h6" color="primary">Description</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box>
                                        <Typography variant="caption" color="textSecondary">Slug (URL)</Typography>
                                        <input
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full p-2 border rounded"
                                            placeholder="auto-generated-if-empty"
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <BilingualInput
                                        label="Short Description (Card Summary)"
                                        value={formData.shortDescription}
                                        onChange={(shortDescription) => setFormData({ ...formData, shortDescription })}
                                        multiline
                                        rows={2}
                                        maxLength={200}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <BilingualInput
                                        label="Full Description"
                                        value={formData.fullDescription}
                                        onChange={(fullDescription) => setFormData({ ...formData, fullDescription })}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                            </Grid>

                            {/* Certification */}
                            <Typography variant="h6" color="primary">Certification</Typography>
                            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isCertified}
                                            onChange={(e) => setFormData({ ...formData, isCertified: e.target.checked })}
                                        />
                                    }
                                    label="This course offers a certificate"
                                />
                                {formData.isCertified && (
                                    <Box sx={{ mt: 2 }}>
                                        <BilingualInput
                                            label="Certification Details"
                                            value={formData.certificationDetails}
                                            onChange={(certificationDetails) => setFormData({ ...formData, certificationDetails })}
                                        />
                                    </Box>
                                )}
                            </Box>

                            {/* Images */}
                            <Typography variant="h6" color="primary">Images</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <ImageUpload
                                        label="Thumbnail Image (Card)"
                                        value={formData.images?.thumbnail}
                                        onChange={(url) => setFormData({
                                            ...formData,
                                            images: { ...formData.images, thumbnail: url }
                                        })}
                                        imageType="square"
                                        folder="courses"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <ImageUpload
                                        label="Hero Image (Detail Page)"
                                        value={formData.images?.hero}
                                        onChange={(url) => setFormData({
                                            ...formData,
                                            images: { ...formData.images, hero: url }
                                        })}
                                        imageType="hero"
                                        folder="courses"
                                    />
                                </Grid>
                            </Grid>

                            {/* Levels / Modules */}
                            <Typography variant="h6" color="primary">Course Structure</Typography>
                            <CourseLevelEditor
                                levels={formData.levels}
                                onChange={(levels) => setFormData({ ...formData, levels })}
                            />

                            {/* Extra Details */}
                            <Typography variant="h6" color="primary">Additional Info</Typography>
                            <BilingualArrayTable
                                label="Learning Outcomes"
                                items={formData.learningOutcomes}
                                onChange={(learningOutcomes) => setFormData({ ...formData, learningOutcomes })}
                                placeholder="e.g. Master public speaking"
                            />
                            <BilingualArrayTable
                                label="Prerequisites"
                                items={formData.prerequisites}
                                onChange={(prerequisites) => setFormData({ ...formData, prerequisites })}
                                placeholder="e.g. English Level 2"
                            />

                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: "#0f1b4b" }}>
                            {editingCourse ? "Update Course" : "Create Course"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div >
    );
}

