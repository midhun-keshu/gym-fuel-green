
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface User {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  created_at: string;
}

interface RecentUsersProps {
  users: User[];
  isLoading: boolean;
  formatDate: (dateString: string) => string;
}

const RecentUsers: React.FC<RecentUsersProps> = ({ users, isLoading, formatDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-900">Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-gym-600 border-r-transparent"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700">User ID</TableHead>
                  <TableHead className="text-gray-700">Name</TableHead>
                  <TableHead className="text-gray-700">Phone</TableHead>
                  <TableHead className="text-gray-700">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-gray-900">
                      #{user.id.substring(0, 8)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {user.full_name || 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {user.phone_number || 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatDate(user.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Registered users will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentUsers;
