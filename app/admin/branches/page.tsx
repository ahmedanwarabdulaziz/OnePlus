"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Branch } from "@/types/branches";

export default function AdminBranchesPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await fetch("/api/admin/branches");
            const data = await res.json();
            if (data.success) {
                setBranches(data.branches);
            }
        } catch (error) {
            console.error("Failed to fetch branches", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will not delete associated courses, but they will be orphaned.")) return;

        try {
            const res = await fetch(`/api/admin/branches/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchBranches();
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                    Course Branches (Tracks)
                </Typography>
                <Link href="/admin/branches/new">
                    <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#701621" }}>
                        Add New Branch
                    </Button>
                </Link>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Slug</strong></TableCell>
                            <TableCell><strong>Color</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} align="center">Loading...</TableCell></TableRow>
                        ) : branches.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center">No branches found. Create one!</TableCell></TableRow>
                        ) : (
                            branches.map((branch) => (
                                <TableRow key={branch.id}>
                                    <TableCell>
                                        <div>{branch.name.en}</div>
                                        <div style={{ color: "grey", fontSize: "0.85em" }}>{branch.name.ar}</div>
                                    </TableCell>
                                    <TableCell>{branch.slug}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box
                                                width={20}
                                                height={20}
                                                borderRadius="50%"
                                                bgcolor={branch.color || "#0f1b4b"}
                                                border="1px solid #ccc"
                                            />
                                            {branch.color}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={branch.isActive ? "Active" : "Inactive"}
                                            color={branch.isActive ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link href={`/admin/branches/${branch.id}`}>
                                            <IconButton color="primary" size="small">
                                                <EditIcon />
                                            </IconButton>
                                        </Link>
                                        <IconButton color="error" size="small" onClick={() => handleDelete(branch.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
