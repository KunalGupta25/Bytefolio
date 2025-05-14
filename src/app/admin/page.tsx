
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Briefcase, Star, Award } from "lucide-react" 
import { getProjects, getSkills, getCertifications, getPageViews } from "@/lib/data";

export const dynamic = 'force-dynamic'; // Ensure data is fetched on each request

export default async function AdminDashboardPage() {
  // Fetch real data
  const projects = await getProjects();
  const skills = await getSkills();
  const certifications = await getCertifications();
  const pageViews = await getPageViews(); // Fetch page views

  const stats = [
    { title: "Total Projects", value: projects.length.toString(), icon: Briefcase, color: "text-blue-500" },
    { title: "Skills Listed", value: skills.length.toString(), icon: Star, color: "text-yellow-500" },
    { title: "Certifications", value: certifications.length.toString(), icon: Award, color: "text-green-500" },
    { title: "Page Views", value: pageViews.toLocaleString(), icon: BarChart3, color: "text-purple-500" }, 
    // Note: The mechanism to increment page views is not implemented in this update.
    // This value will be 0 unless manually set or incremented by another part of the application.
  ];

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin! Manage your portfolio content here.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Placeholder for recent updates or messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>- Project "AI Chatbot" updated.</li>
              <li>- New skill "Kubernetes" added.</li>
              <li>- Contact form submission from John Doe.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Navigate to common management tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><a href="/admin/projects" className="text-accent hover:underline">Manage Projects</a></p>
            <p><a href="/admin/skills" className="text-accent hover:underline">Update Skills</a></p>
            <p><a href="/admin/settings" className="text-accent hover:underline">Site Settings</a></p>
          </CardContent>
        </Card>
      </section>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>ByteFolio Admin Panel &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
