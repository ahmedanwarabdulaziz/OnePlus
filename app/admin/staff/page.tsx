"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Grid,
  FormHelperText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DragHandleIcon from "@mui/icons-material/DragHandle";
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
import ImageUpload from "@/components/ImageUpload";
import SortableStaffRow from "@/components/SortableStaffRow";
import { StaffMember, StaffInput, StaffType } from "@/types/staff";
import { TranslatedText, createTranslatedText, getText } from "@/types/translations";
import BilingualInput from "@/components/BilingualInput";
import BilingualArrayTable from "@/components/BilingualArrayTable";

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState<StaffInput>({
    firstName: createTranslatedText("", ""),
    lastName: createTranslatedText("", ""),
    email: "",
    phone: "",
    type: "coach",
    title: createTranslatedText("", ""),
    positions: [],
    bio: createTranslatedText("", ""),
    shortBio: createTranslatedText("", ""),
    images: {},
    specialties: [],
    certifications: [],
    experience: [],
    education: [],
    achievements: [],
    areasOfExpertise: [],
    languages: [],
    socialLinks: {},
    isActive: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/staff");
      if (response.ok) {
        const data = await response.json();
        setStaff(data.staff || []);
      } else {
        setError("Failed to fetch staff");
      }
    } catch (err) {
      setError("Error loading staff");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (member?: StaffMember) => {
    if (member) {
      setEditingStaff(member);
      // Convert TranslatedText or string to TranslatedText
      const bio = typeof member.bio === "string"
        ? createTranslatedText(member.bio, "")
        : member.bio || createTranslatedText("", "");

      const shortBio = typeof member.shortBio === "string"
        ? createTranslatedText(member.shortBio, "")
        : member.shortBio || createTranslatedText("", "");

      const positions = member.positions?.map(pos =>
        typeof pos === "string"
          ? createTranslatedText(pos, "")
          : pos
      ) || [];

      // Convert firstName and lastName to TranslatedText if they're strings
      const firstName = typeof member.firstName === "string"
        ? createTranslatedText(member.firstName, "")
        : member.firstName || createTranslatedText("", "");

      const lastName = typeof member.lastName === "string"
        ? createTranslatedText(member.lastName, "")
        : member.lastName || createTranslatedText("", "");

      const title = typeof member.title === "string"
        ? createTranslatedText(member.title, "")
        : member.title || createTranslatedText("", "");

      setFormData({
        firstName,
        lastName,
        email: member.email,
        phone: member.phone || "",
        type: member.type,
        title,
        positions,
        bio,
        shortBio,
        images: member.images || {},
        specialties: (member.specialties || []).map(s =>
          typeof s === "string" ? createTranslatedText(s, "") : s
        ),
        certifications: (member.certifications || []).map(c =>
          typeof c === "string" ? createTranslatedText(c, "") : c
        ),
        experience: Array.isArray(member.experience)
          ? member.experience.map(e => typeof e === "string" ? createTranslatedText(e, "") : e)
          : member.experience && typeof member.experience === "object" && !Array.isArray(member.experience)
            ? [member.experience] // Convert old single experience to array
            : [],
        education: member.education || [],
        achievements: member.achievements || [],
        areasOfExpertise: member.areasOfExpertise || [],
        languages: member.languages || [],
        socialLinks: member.socialLinks || {},
        isActive: member.isActive,
      });
    } else {
      setEditingStaff(null);
      setFormData({
        firstName: createTranslatedText("", ""),
        lastName: createTranslatedText("", ""),
        email: "",
        phone: "",
        type: "coach",
        title: createTranslatedText("", ""),
        positions: [],
        bio: createTranslatedText("", ""),
        shortBio: createTranslatedText("", ""),
        images: {},
        specialties: [],
        certifications: [],
        experience: [],
        education: [],
        achievements: [],
        areasOfExpertise: [],
        languages: [],
        socialLinks: {},
        isActive: true,
      });
    }
    setError("");
    setSuccess("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStaff(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Ensure bio and shortBio are TranslatedText objects first
    const bio: TranslatedText = typeof formData.bio === "string"
      ? createTranslatedText(formData.bio, "")
      : formData.bio || createTranslatedText("", "");

    const shortBio: TranslatedText = typeof formData.shortBio === "string"
      ? createTranslatedText(formData.shortBio, "")
      : formData.shortBio || createTranslatedText("", "");

    // Validate short bio length (check both languages)
    const shortBioEn = shortBio.en || "";
    const shortBioAr = shortBio.ar || "";

    if (shortBioEn.length > 200 || shortBioAr.length > 200) {
      setError("Short bio must be 200 characters or less in each language");
      return;
    }

    // Validate that at least one language is provided for bio and shortBio
    const bioEn = bio.en || "";
    const bioAr = bio.ar || "";
    if ((!shortBioEn && !shortBioAr) || (!bioEn && !bioAr)) {
      setError("Bio and short bio must have at least English or Arabic text");
      return;
    }

    // Ensure positions are TranslatedText objects
    const positions: TranslatedText[] = formData.positions?.map(pos =>
      typeof pos === "string"
        ? createTranslatedText(pos, "")
        : pos
    ) || [];

    // Ensure other array fields are properly formatted
    const specialties: TranslatedText[] = formData.specialties?.map(s =>
      typeof s === "string"
        ? createTranslatedText(s, "")
        : s
    ) || [];

    const certifications: TranslatedText[] = formData.certifications?.map(c =>
      typeof c === "string"
        ? createTranslatedText(c, "")
        : c
    ) || [];

    const education: TranslatedText[] = formData.education?.map(e =>
      typeof e === "string"
        ? createTranslatedText(e, "")
        : e
    ) || [];

    const achievements: TranslatedText[] = formData.achievements?.map(a =>
      typeof a === "string"
        ? createTranslatedText(a, "")
        : a
    ) || [];

    const areasOfExpertise: TranslatedText[] = formData.areasOfExpertise?.map(a =>
      typeof a === "string"
        ? createTranslatedText(a, "")
        : a
    ) || [];

    const languages: TranslatedText[] = formData.languages?.map(l =>
      typeof l === "string"
        ? createTranslatedText(l, "")
        : l
    ) || [];

    // Ensure experience is TranslatedText array
    const experience: TranslatedText[] = Array.isArray(formData.experience)
      ? formData.experience.map(e =>
        typeof e === "string"
          ? createTranslatedText(e, "")
          : e
      )
      : [];

    try {
      const url = editingStaff
        ? `/api/admin/staff/${editingStaff.id}`
        : "/api/admin/staff";
      const method = editingStaff ? "PUT" : "POST";

      // Ensure title is TranslatedText
      const title: TranslatedText = typeof formData.title === "string"
        ? createTranslatedText(formData.title, "")
        : formData.title || createTranslatedText("", "");

      // Prepare submit data with all properly formatted fields
      const submitData: StaffInput = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        type: formData.type,
        title,
        positions,
        bio,
        shortBio,
        images: formData.images,
        specialties,
        certifications,
        experience,
        education,
        achievements,
        areasOfExpertise,
        languages,
        socialLinks: formData.socialLinks,
        isActive: formData.isActive,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          editingStaff ? "Staff member updated successfully!" : "Staff member created successfully!"
        );
        fetchStaff();
        setTimeout(() => {
          handleCloseDialog();
        }, 1500);
      } else {
        setError(data.error || "Failed to save staff member");
      }
    } catch (err: any) {
      setError(err.message || "Error saving staff member");
    }
  };

  const handleDelete = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/staff/${staffId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Staff member deleted successfully!");
        fetchStaff();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete staff member");
      }
    } catch (err: any) {
      setError(err.message || "Error deleting staff member");
    }
  };

  const getTypeColor = (type: StaffType) => {
    return type === "coach" ? "primary" : "default";
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = staff.findIndex((item) => item.id === active.id);
      const newIndex = staff.findIndex((item) => item.id === over.id);

      const newStaff = arrayMove(staff, oldIndex, newIndex);
      setStaff(newStaff);

      // Update displayOrder for all items
      const updates = newStaff.map((member, index) => ({
        id: member.id,
        displayOrder: index,
      }));

      try {
        await fetch("/api/admin/staff/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        });
        setSuccess("Order updated successfully");
      } catch (error) {
        console.error("Error updating order:", error);
        setError("Failed to update order");
        fetchStaff(); // Revert on error
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
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: "#0f1b4b", "&:hover": { bgcolor: "#0f1b4b" } }}
        >
          Add Staff Member
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
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>

                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No staff members found
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={staff.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {staff.map((member) => (
                    <SortableStaffRow
                      key={member.id}
                      member={member}
                      onEdit={handleOpenDialog}
                      onDelete={handleDelete}
                      getTypeColor={getTypeColor}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DndContext>

      {/* Add/Edit Staff Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled={!!editingStaff}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={formData.type}
                      label="Type"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as StaffType,
                        })
                      }
                      required
                    >
                      <MenuItem value="coach">Coach</MenuItem>
                      <MenuItem value="employee">Employee</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* Images Section - Shared between tabs */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Images (Shared)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ImageUpload
                    label="Square Image (Profile)"
                    value={formData.images?.square}
                    onChange={(url) =>
                      setFormData({
                        ...formData,
                        images: { ...formData.images, square: url },
                      })
                    }
                    imageType="square"
                    folder="staff"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ImageUpload
                    label="Vertical Image"
                    value={formData.images?.vertical}
                    onChange={(url) =>
                      setFormData({
                        ...formData,
                        images: { ...formData.images, vertical: url },
                      })
                    }
                    imageType="vertical"
                    folder="staff"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <ImageUpload
                    label="Hero Image"
                    value={formData.images?.hero}
                    onChange={(url) =>
                      setFormData({
                        ...formData,
                        images: { ...formData.images, hero: url },
                      })
                    }
                    imageType="hero"
                    folder="staff"
                  />
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.isActive ? "active" : "inactive"}
                      label="Status"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.value === "active",
                        })
                      }
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Personal Information */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Personal Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Enter names and titles side-by-side.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <BilingualInput
                    label="First Name"
                    value={formData.firstName}
                    onChange={(firstName) =>
                      setFormData({ ...formData, firstName })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <BilingualInput
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(lastName) =>
                      setFormData({ ...formData, lastName })
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <BilingualInput
                    label="Title"
                    value={formData.title}
                    onChange={(title) =>
                      setFormData({ ...formData, title })
                    }
                  />
                </Grid>

                {/* Biography */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 3, mb: 1 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Biography
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <BilingualInput
                    label="Short Bio"
                    value={formData.shortBio}
                    onChange={(shortBio) =>
                      setFormData({ ...formData, shortBio })
                    }
                    required
                    multiline
                    rows={2}
                    maxLength={200}
                  />
                </Grid>
                <Grid item xs={12}>
                  <BilingualInput
                    label="Full Bio"
                    value={formData.bio}
                    onChange={(bio) => setFormData({ ...formData, bio })}
                    required
                    multiline
                    rows={6}
                  />
                </Grid>

                {/* Professional Details */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 3, mb: 1 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Professional Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage lists for both languages side-by-side.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <BilingualArrayTable
                    label="Positions"
                    items={formData.positions}
                    onChange={(positions) =>
                      setFormData({ ...formData, positions })
                    }
                    placeholder="e.g., Senior Trainer"
                  />
                </Grid>

                <Grid item xs={12}>
                  <BilingualArrayTable
                    label="Areas of Expertise"
                    items={formData.areasOfExpertise}
                    onChange={(areasOfExpertise) =>
                      setFormData({ ...formData, areasOfExpertise })
                    }
                    placeholder="e.g., Strategic Planning"
                  />
                </Grid>

                <Grid item xs={12}>
                  <BilingualArrayTable
                    label="Specialties"
                    items={formData.specialties}
                    onChange={(specialties) =>
                      setFormData({ ...formData, specialties })
                    }
                    placeholder="e.g., Leadership Training"
                  />
                </Grid>

                <Grid item xs={12}>
                  <BilingualArrayTable
                    label="Experience"
                    items={formData.experience}
                    onChange={(experience) =>
                      setFormData({ ...formData, experience })
                    }
                    placeholder="e.g., 5 years in leadership training"
                  />
                </Grid>

                <Grid item xs={12}>
                  <BilingualArrayTable
                    label="Education"
                    items={formData.education}
                    onChange={(education) =>
                      setFormData({ ...formData, education })
                    }
                    placeholder="e.g., MBA in Business Administration"
                  />
                </Grid>

                <Grid item xs={12}>
                  <BilingualArrayTable
                    label="Certifications"
                    items={formData.certifications}
                    onChange={(certifications) =>
                      setFormData({ ...formData, certifications })
                    }
                    placeholder="e.g., PMP Certified"
                  />
                </Grid>

                <Grid item xs={12}>
                  <BilingualArrayTable
                    label="Achievements"
                    items={formData.achievements}
                    onChange={(achievements) =>
                      setFormData({ ...formData, achievements })
                    }
                    placeholder="e.g., Published Author"
                  />
                </Grid>

                <Grid item xs={12}>
                  <BilingualArrayTable
                    label="Languages"
                    items={formData.languages}
                    onChange={(languages) =>
                      setFormData({ ...formData, languages })
                    }
                    placeholder="e.g., English (Fluent)"
                  />
                </Grid>
              </Grid>

              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  {success}
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: "#0f1b4b" }}>
              {editingStaff ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
