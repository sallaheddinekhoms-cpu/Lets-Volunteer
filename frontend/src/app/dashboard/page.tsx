"use client"
import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import Head from 'next/head';
import { getAidsStats, getDashboardStats, getOppStats, getOrgStats, getParticipationStats, getVolunteerStats } from '@/data/admin/Stats';

// Define primary and secondary colors
const PRIMARY_COLOR = '#1E88E5';  // Primary blue
const SECONDARY_COLOR = '#26C6DA'; // Secondary teal
const COLORS = ['#1E88E5', '#26C6DA', '#7E57C2', '#66BB6A', '#FFA726'];

// Define types
interface StatItem {
  value: number;
  label: string;
}

interface ChartData {
  name: string;
  value?: number;
  count?: number;
  label?: string;
}

interface ChartSection {
  data: ChartData[];
  title: string;
}

interface DashboardData {
  total_volunteers: StatItem;
  total_organizations: StatItem;
  total_opportunities: StatItem;
  total_participations: StatItem;
  completed_participations: StatItem;
  total_volunteer_hours: StatItem;
  average_rating: StatItem;
}

interface StatsData {
  volunteers: {
    volunteers_by_wilaya: ChartSection;
    volunteers_by_skill: ChartSection;
    top_volunteers: ChartSection;
  };
  organizations: {
    organizations_by_wilaya: ChartSection;
    top_organizations: ChartSection;
  };
  opportunities: {
    opportunities_by_category: ChartSection;
    opportunities_by_status: ChartSection;
    remote_vs_onsite: ChartSection;
    urgent_vs_regular: ChartSection;
    geographic_distribution: ChartSection;
  };
  participations: {
    status_distribution: ChartSection;
    avg_rating: StatItem;
    total_hours: StatItem;
    participation_trends: ChartSection;
  };
  aids: {
    aid_by_type: ChartSection;
    aid_by_organization: ChartSection;
    aid_trends: ChartSection;
  };
}

const StatsDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all required data
        const [dashboardResponse, volunteersResponse, organizationsResponse, 
               opportunitiesResponse, participationsResponse, aidsResponse] = await Promise.all([
          getDashboardStats(),
          getVolunteerStats(),
          getOrgStats(),
          getOppStats(),
          getParticipationStats(),
          getAidsStats()
        ]);

        setDashboardData(dashboardResponse);
        setStatsData({
          volunteers: volunteersResponse ,
          organizations: organizationsResponse,
          opportunities: opportunitiesResponse,
          participations: participationsResponse,
          aids: aidsResponse
        });
      } catch (err) {
        console.error("Error fetching stats data:", err);
        setError("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadPDFReport = async () => {
    try {
      // Open in new tab to handle file download
      window.open('http://127.0.0.1:8000/api/stats/report/pdf/', '_blank');
    } catch (err) {
      console.error("Error downloading PDF report:", err);
      setError("حدث خطأ أثناء تحميل التقرير. يرجى المحاولة مرة أخرى.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-2">خطأ</h2>
          <p className="text-red-600">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData || !statsData) {
    return null;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Head>
        <title>لوحة إحصاءات التطوع | منصة تواصل</title>
        <meta name="description" content="إحصاءات وبيانات منصة تطوع تواصل" />
      </Head>

      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة الإحصائيات</h1>
            <p className="text-gray-600 mt-1">نظرة شاملة على أداء منصة التطوع</p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-secondary hover:bg-secondary/90" 
            onClick={downloadPDFReport}
          >
            <FileDown className="mr-2 h-4 w-4" />
            تحميل تقرير PDF
          </Button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(dashboardData).map(([key, item]) => (
          <Card key={key} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-4xl font-bold text-primary">{item.value}</div>
              <p className="text-gray-600 mt-2">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed Sections */}
      <Tabs dir='rtl' defaultValue="volunteers" className="mb-8">
        <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="volunteers">المتطوعين</TabsTrigger>
          <TabsTrigger value="organizations">المنظمات</TabsTrigger>
          <TabsTrigger value="opportunities">الفرص التطوعية</TabsTrigger>
          <TabsTrigger value="participations">المشاركات</TabsTrigger>
          <TabsTrigger value="aids">النشاطات الاجتماعية</TabsTrigger>
        </TabsList>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{statsData.volunteers.volunteers_by_wilaya.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={statsData.volunteers.volunteers_by_wilaya.data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="عدد المتطوعين" fill={PRIMARY_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{statsData.volunteers.volunteers_by_skill.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statsData.volunteers.volunteers_by_skill.data}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statsData.volunteers.volunteers_by_skill.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} متطوع`, 'عدد المتطوعين']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{statsData.volunteers.top_volunteers.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={statsData.volunteers.top_volunteers.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="participation_count" name="عدد المشاركات" fill={PRIMARY_COLOR} />
                    <Bar dataKey="hours_worked" name="ساعات التطوع" fill={SECONDARY_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Organizations Tab */}
        <TabsContent value="organizations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{statsData.organizations.organizations_by_wilaya.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={statsData.organizations.organizations_by_wilaya.data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="عدد المنظمات" fill={SECONDARY_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{statsData.organizations.top_organizations.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={statsData.organizations.top_organizations.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="opportunities_count" name="عدد الفرص" fill={PRIMARY_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{statsData.opportunities.opportunities_by_category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statsData.opportunities.opportunities_by_category.data}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statsData.opportunities.opportunities_by_category.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} فرصة`, 'عدد الفرص']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{statsData.opportunities.geographic_distribution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={statsData.opportunities.geographic_distribution.data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="عدد الفرص" fill={PRIMARY_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{statsData.opportunities.opportunities_by_status.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statsData.opportunities.opportunities_by_status.data}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statsData.opportunities.opportunities_by_status.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} فرصة`, 'عدد الفرص']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{statsData.opportunities.remote_vs_onsite.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statsData.opportunities.remote_vs_onsite.data}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill={PRIMARY_COLOR} />
                      <Cell fill={SECONDARY_COLOR} />
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} فرصة`, 'عدد الفرص']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Participations Tab */}
        <TabsContent value="participations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{statsData.participations.status_distribution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statsData.participations.status_distribution.data}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statsData.participations.status_distribution.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} مشاركة`, 'عدد المشاركات']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>إحصائيات المشاركات</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-primary/10 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-primary">
                      {statsData.participations.avg_rating.value}
                    </div>
                    <p className="text-gray-600 mt-2">
                      {statsData.participations.avg_rating.label}
                    </p>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-secondary">
                      {statsData.participations.total_hours.value}
                    </div>
                    <p className="text-gray-600 mt-2">
                      {statsData.participations.total_hours.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{statsData.participations.participation_trends.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={statsData.participations.participation_trends.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="عدد المشاركات" stroke={PRIMARY_COLOR} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aids Tab */}
        <TabsContent value="aids">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{statsData.aids.aid_by_type.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statsData.aids.aid_by_type.data}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statsData.aids.aid_by_type.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} مساعدة`, 'عدد النشاطات الاجتماعية']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{statsData.aids.aid_by_organization.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={statsData.aids.aid_by_organization.data.slice(0, 5)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="عدد النشاطات الاجتماعية" fill={SECONDARY_COLOR} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{statsData.aids.aid_trends.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={statsData.aids.aid_trends.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="عدد النشاطات الاجتماعية" stroke={SECONDARY_COLOR} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <footer className="text-center text-gray-500 py-6 mt-8 border-t">
        <p>© {new Date().getFullYear()} منصة تواصل للعمل التطوعي. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default StatsDashboard;