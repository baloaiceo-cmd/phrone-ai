import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default function AdminCategories() {
  const { data: categories, isLoading } = trpc.categories.list.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-1">
          View and manage article categories. Categories are configured in the database.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((cat) => (
            <Card key={cat.key} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: cat.color + "20" }}
                >
                  <FolderOpen className="h-5 w-5" style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{cat.nameEn}</CardTitle>
                  <p className="text-xs text-muted-foreground">{cat.nameZh}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Key</span>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{cat.key}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slug</span>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{cat.slug}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sort Order</span>
                    <span>{cat.sortOrder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Color</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-mono">{cat.color}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
