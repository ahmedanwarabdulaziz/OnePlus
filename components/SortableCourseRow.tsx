import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow, TableCell, IconButton, Chip, Box, Typography } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Course } from "@/types/courses";
import { getText } from "@/types/translations";

interface SortableCourseRowProps {
    course: Course;
    branchNames?: string[];
    onEdit: (course: Course) => void;
    onDelete: (id: string) => void;
}

export default function SortableCourseRow({
    course,
    branchNames,
    onEdit,
    onDelete,
}: SortableCourseRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: course.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isDragging ? "#f5f5f5" : "inherit",
        cursor: "default",
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell width={50}>
                <IconButton {...attributes} {...listeners} size="small">
                    <DragHandleIcon />
                </IconButton>
            </TableCell>
            <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                    {getText(course.title, "en", true)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {getText(course.title, "ar", false)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {(Array.isArray(course.category) ? course.category : [course.category]).filter(c => c?.en || c?.ar).map((cat, idx) => (
                        <Chip
                            key={idx}
                            label={getText(cat, "en")}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                    ))}
                </Box>
            </TableCell>
            <TableCell>
                {branchNames && branchNames.length > 0 ? (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {branchNames.map((name, idx) => (
                            <Chip
                                key={idx}
                                label={name}
                                size="small"
                                sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontWeight: "bold" }}
                            />
                        ))}
                    </Box>
                ) : (
                    <Typography variant="caption" color="text.secondary">
                        -
                    </Typography>
                )}
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {(Array.isArray(course.targetAudience) ? course.targetAudience : [course.targetAudience]).map((aud) => (
                        <Chip
                            key={aud}
                            label={aud}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                        />
                    ))}
                </Box>
            </TableCell>
            <TableCell>
                <Chip
                    label={course.levels?.length || 0}
                    size="small"
                    variant="outlined"
                />
            </TableCell>
            <TableCell>
                <Chip
                    label={course.isActive ? "Active" : "Inactive"}
                    color={course.isActive ? "success" : "default"}
                    size="small"
                />
            </TableCell>
            <TableCell align="right">
                <IconButton onClick={() => onEdit(course)} color="primary" size="small">
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(course.id)} color="error" size="small">
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}
