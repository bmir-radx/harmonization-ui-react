import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Database, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Users,
  FileText,
  Settings
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'error' | 'pending';
  records: number;
  lastSync: string;
}

interface HarmonizationJob {
  id: string;
  name: string;
  progress: number;
  status: 'running' | 'completed' | 'failed' | 'pending';
  sourceCount: number;
  mappedFields: number;
  quality: number;
}

export function DataHarmonizationDashboard() {
  const [dataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Customer Database',
      type: 'PostgreSQL',
      status: 'connected',
      records: 125000,
      lastSync: '2 hours ago'
    },
    {
      id: '2',
      name: 'Sales CRM',
      type: 'Salesforce',
      status: 'connected',
      records: 89000,
      lastSync: '1 hour ago'
    },
    {
      id: '3',
      name: 'Marketing Platform',
      type: 'HubSpot',
      status: 'error',
      records: 45000,
      lastSync: '1 day ago'
    },
    {
      id: '4',
      name: 'Support System',
      type: 'Zendesk',
      status: 'pending',
      records: 12000,
      lastSync: 'Never'
    }
  ]);

  const [harmonizationJobs] = useState<HarmonizationJob[]>([
    {
      id: '1',
      name: 'Customer Data Unification',
      progress: 85,
      status: 'running',
      sourceCount: 3,
      mappedFields: 24,
      quality: 92
    },
    {
      id: '2',
      name: 'Product Catalog Merge',
      progress: 100,
      status: 'completed',
      sourceCount: 2,
      mappedFields: 18,
      quality: 96
    },
    {
      id: '3',
      name: 'Financial Records Sync',
      progress: 45,
      status: 'running',
      sourceCount: 4,
      mappedFields: 31,
      quality: 88
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const totalRecords = dataSources.reduce((sum, source) => sum + source.records, 0);
  const connectedSources = dataSources.filter(source => source.status === 'connected').length;
  const overallQuality = Math.round(harmonizationJobs.reduce((sum, job) => sum + job.quality, 0) / harmonizationJobs.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Harmonization</h1>
          <p className="text-muted-foreground">
            Unify and standardize data across multiple sources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Database className="w-4 h-4 mr-2" />
            New Source
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedSources}/{dataSources.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((connectedSources / dataSources.length) * 100)}% connected
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallQuality}%</div>
            <p className="text-xs text-muted-foreground">
              +3% improvement
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {harmonizationJobs.filter(job => job.status === 'running').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="sources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="jobs">Harmonization Jobs</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Manage and monitor your connected data sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(source.status)}
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-muted-foreground">{source.type}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{source.records.toLocaleString()} records</p>
                        <p className="text-xs text-muted-foreground">Last sync: {source.lastSync}</p>
                      </div>
                      <Badge className={getStatusColor(source.status)}>
                        {source.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Harmonization Jobs</CardTitle>
              <CardDescription>
                Monitor data harmonization processes and their progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {harmonizationJobs.map((job) => (
                  <div key={job.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{job.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {job.sourceCount} sources • {job.mappedFields} mapped fields
                        </p>
                      </div>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Quality Score</span>
                      <span className="font-medium">{job.quality}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              <CardDescription>
                Configure how fields from different sources are mapped and transformed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Field mapping interface would be implemented here with drag-and-drop functionality
                    for mapping source fields to target schema.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Source Fields</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-blue-50 rounded">customer_id</div>
                      <div className="p-2 bg-blue-50 rounded">first_name</div>
                      <div className="p-2 bg-blue-50 rounded">last_name</div>
                      <div className="p-2 bg-blue-50 rounded">email_address</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Target Schema</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-green-50 rounded">id</div>
                      <div className="p-2 bg-green-50 rounded">firstName</div>
                      <div className="p-2 bg-green-50 rounded">lastName</div>
                      <div className="p-2 bg-green-50 rounded">email</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Quality Metrics</CardTitle>
                <CardDescription>
                  Overall health and quality of your harmonized data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Completeness</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Consistency</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <Progress value={89} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Accuracy</span>
                    <span className="text-sm font-medium">96%</span>
                  </div>
                  <Progress value={96} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Uniqueness</span>
                    <span className="text-sm font-medium">91%</span>
                  </div>
                  <Progress value={91} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quality Issues</CardTitle>
                <CardDescription>
                  Data quality issues that need attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Duplicate Records</span>
                    </div>
                    <Badge variant="destructive">245</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Missing Values</span>
                    </div>
                    <Badge variant="secondary">1,203</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Format Inconsistencies</span>
                    </div>
                    <Badge variant="secondary">89</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}