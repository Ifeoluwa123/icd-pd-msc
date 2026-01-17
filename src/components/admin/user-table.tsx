import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
}

interface UserTableProps {
  users: User[] | null;
}

export default function UserTable({ users }: UserTableProps) {
  if (!users || users.length === 0) {
    return <div className="p-6 text-center text-muted-foreground">No users found.</div>;
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead className="text-right">User ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.organization}</TableCell>
            <TableCell className="text-right">
                <Badge variant="outline" className="font-mono">{user.id}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
