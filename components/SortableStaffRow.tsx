"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { StaffMember, StaffType } from "@/types/staff";
import { getText } from "@/types/translations";

interface SortableStaffRowProps {
  member: StaffMember;
  onEdit: (member: StaffMember) => void;
  onDelete: (id: string) => void;
  getTypeColor: (type: StaffType) => string;
}

export default function SortableStaffRow({
  member,
  onEdit,
  onDelete,
  getTypeColor,
}: SortableStaffRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const firstName = typeof member.firstName === "string"
    ? member.firstName
    : getText(member.firstName, "en");

  const lastName = typeof member.lastName === "string"
    ? member.lastName
    : getText(member.lastName, "en");

  return (
    <TableRow ref={setNodeRef} style={style} key={member.id}>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            {...attributes}
            {...listeners}
            size="small"
            sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
          >
            <DragHandleIcon />
          </IconButton>
          {firstName} {lastName}
        </Box>
      </TableCell>
      <TableCell>{member.email}</TableCell>

      <TableCell>{member.phone || "-"}</TableCell>
      <TableCell>
        <Chip
          label={member.isActive ? "Active" : "Inactive"}
          color={member.isActive ? "success" : "default"}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={() => onEdit(member)}
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(member.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
