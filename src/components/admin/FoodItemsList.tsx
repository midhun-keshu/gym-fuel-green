
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditIcon, TrashIcon, ImageIcon, CheckIcon, XIcon } from 'lucide-react';
import { FoodItem } from '@/types/food';

interface FoodItemsListProps {
  foodItems: FoodItem[];
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, currentStatus: boolean) => void;
}

const FoodItemsList = ({ foodItems, onEdit, onDelete, onToggleAvailability }: FoodItemsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Items List</CardTitle>
      </CardHeader>
      <CardContent>
        {foodItems.length === 0 ? (
          <div className="text-center py-6">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">No food items found. Add your first item above.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foodItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.image_url ? (
                        <div className="h-12 w-12 rounded overflow-hidden">
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.category ? (
                        <Badge variant="outline">{item.category}</Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Not set</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">₹{item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onToggleAvailability(item.id, item.available)}
                          title={item.available ? "Mark as unavailable" : "Mark as available"}
                        >
                          {item.available ? <XIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onEdit(item)}
                        >
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => onDelete(item.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodItemsList;
