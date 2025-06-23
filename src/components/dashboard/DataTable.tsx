
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logCheckboxAction } from "@/services/checkboxService";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Calendar } from "lucide-react";
import type { DataRow, CheckboxState } from "./Dashboard";

interface DataTableProps {
  data: DataRow[];
  checkboxStates: Record<string, CheckboxState>;
  onCheckboxStateChange: (states: Record<string, CheckboxState>) => void;
  userEmail: string;
}

export const DataTable = ({ data, checkboxStates, onCheckboxStateChange, userEmail }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const { toast } = useToast();

  const handleCheckboxChange = async (rowId: string, checked: boolean) => {
    try {
      console.log(`Checkbox changed for row ${rowId}: ${checked}`);
      
      // Update local state immediately for responsive UI
      const newState: CheckboxState = {
        rowId,
        checked,
        lastUpdated: new Date().toISOString(),
      };
      
      const updatedStates = {
        ...checkboxStates,
        [rowId]: newState,
      };
      
      onCheckboxStateChange(updatedStates);
      
      // Log the action to backend
      await logCheckboxAction(userEmail, rowId, checked);
      
      console.log(`Successfully logged checkbox action for ${userEmail}, row ${rowId}`);
      
    } catch (error) {
      console.error('Error updating checkbox state:', error);
      
      // Revert the change if logging failed
      onCheckboxStateChange(checkboxStates);
      
      toast({
        title: "Error",
        description: "Failed to save checkbox state. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter data based on search and filters
  const filteredData = data.filter(row => {
    const matchesSearch = row.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         row.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || row.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || row.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get unique categories for filter
  const categories = Array.from(new Set(data.map(row => row.category)));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredData.length} of {data.length} records
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">Done</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {data.length === 0 ? "No data records found." : "No records match your filters."}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => {
                const isChecked = checkboxStates[row.id]?.checked || false;
                const lastUpdated = checkboxStates[row.id]?.lastUpdated;
                
                return (
                  <TableRow key={row.id} className={isChecked ? "bg-green-50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => handleCheckboxChange(row.id, checked as boolean)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{row.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(row.priority)}>
                        {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(row.dueDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {lastUpdated ? formatDate(lastUpdated) : "Never"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
