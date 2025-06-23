
import { useEffect, useState } from "react";
import { DataTable } from "./DataTable";
import { getUserData } from "@/services/dataService";
import { getUserCheckboxStates } from "@/services/checkboxService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, CheckSquare, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  userEmail: string;
}

export interface DataRow {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  userEmail: string;
}

export interface CheckboxState {
  rowId: string;
  checked: boolean;
  lastUpdated: string;
}

export const Dashboard = ({ userEmail }: DashboardProps) => {
  const [data, setData] = useState<DataRow[]>([]);
  const [checkboxStates, setCheckboxStates] = useState<Record<string, CheckboxState>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log(`Loading data for user: ${userEmail}`);
        
        // Load user's data and checkbox states
        const [userData, userCheckboxStates] = await Promise.all([
          getUserData(userEmail),
          getUserCheckboxStates(userEmail)
        ]);
        
        console.log(`Loaded ${userData.length} data rows for ${userEmail}`);
        console.log(`Loaded ${Object.keys(userCheckboxStates).length} checkbox states`);
        
        setData(userData);
        setCheckboxStates(userCheckboxStates);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userEmail, toast]);

  const stats = {
    totalRows: data.length,
    checkedRows: Object.values(checkboxStates).filter(state => state.checked).length,
    highPriority: data.filter(row => row.priority === 'high').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRows}</div>
            <p className="text-xs text-muted-foreground">
              Data entries assigned to you
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkedRows}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalRows > 0 ? Math.round((stats.checkedRows / stats.totalRows) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPriority}</div>
            <p className="text-xs text-muted-foreground">
              Items requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Data Records</CardTitle>
          <CardDescription>
            Review and manage your assigned data entries. Check boxes to mark items as completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={data} 
            checkboxStates={checkboxStates}
            onCheckboxStateChange={setCheckboxStates}
            userEmail={userEmail}
          />
        </CardContent>
      </Card>
    </div>
  );
};
