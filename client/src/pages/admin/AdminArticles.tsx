import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, Eye, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: articles, isLoading } = trpc.articles.list.useQuery({ limit: 200 });
  const { data: categories } = trpc.categories.list.useQuery();

  const deleteMutation = trpc.admin.deleteArticle.useMutation({
    onSuccess: () => {
      toast.success("Article deleted successfully");
      utils.articles.list.invalidate();
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(`Failed to delete: ${err.message}`);
    },
  });

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories?.forEach((c) => {
      map[c.key] = c.nameEn;
    });
    return map;
  }, [categories]);

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.titleEn.toLowerCase().includes(q) ||
        a.titleZh.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
    );
  }, [articles, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground mt-1">
            Manage all articles in your CMS.
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Article
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead>Title (EN)</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Author</TableHead>
              <TableHead className="hidden lg:table-cell text-center">Views</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No articles found.
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-mono text-xs">{article.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {article.featured && <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                      <span className="font-medium text-sm truncate max-w-[300px]">
                        {article.titleEn}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {categoryMap[article.categoryKey] || article.categoryKey}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {article.author}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-center text-sm">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      {article.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        article.published
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {article.published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/articles/${article.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(article.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) deleteMutation.mutate({ id: deleteId });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
