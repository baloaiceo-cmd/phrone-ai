import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "wouter";
import { toast } from "sonner";

export default function AdminArticleEditor() {
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";
  const articleId = isNew ? null : Number(params.id);
  const [, setLocation] = useLocation();

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: existingArticle, isLoading: loadingArticle } = trpc.articles.byId.useQuery(
    { id: articleId! },
    { enabled: !!articleId }
  );

  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    categoryKey: "",
    titleZh: "",
    titleEn: "",
    excerptZh: "",
    excerptEn: "",
    contentZh: "",
    contentEn: "",
    author: "",
    image: "",
    readTime: 5,
    featured: false,
    published: true,
  });

  useEffect(() => {
    if (existingArticle && !isNew) {
      setForm({
        categoryKey: existingArticle.categoryKey,
        titleZh: existingArticle.titleZh,
        titleEn: existingArticle.titleEn,
        excerptZh: existingArticle.excerptZh,
        excerptEn: existingArticle.excerptEn,
        contentZh: existingArticle.contentZh || "",
        contentEn: existingArticle.contentEn || "",
        author: existingArticle.author,
        image: existingArticle.image || "",
        readTime: existingArticle.readTime,
        featured: existingArticle.featured,
        published: existingArticle.published,
      });
    }
  }, [existingArticle, isNew]);

  const createMutation = trpc.admin.createArticle.useMutation({
    onSuccess: () => {
      toast.success("Article created successfully");
      utils.articles.list.invalidate();
      setLocation("/admin/articles");
    },
    onError: (err) => toast.error(`Failed to create: ${err.message}`),
  });

  const updateMutation = trpc.admin.updateArticle.useMutation({
    onSuccess: () => {
      toast.success("Article updated successfully");
      utils.articles.list.invalidate();
      utils.articles.byId.invalidate({ id: articleId! });
      setLocation("/admin/articles");
    },
    onError: (err) => toast.error(`Failed to update: ${err.message}`),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryKey || !form.titleZh || !form.titleEn || !form.excerptZh || !form.excerptEn || !form.author) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (isNew) {
      createMutation.mutate(form);
    } else if (articleId) {
      updateMutation.mutate({ id: articleId, data: form });
    }
  };

  const updateField = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!isNew && loadingArticle) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isNew ? "New Article" : "Edit Article"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNew ? "Create a new article for Phrone AI." : `Editing article #${articleId}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.categoryKey} onValueChange={(v) => updateField("categoryKey", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Author *</Label>
                <Input
                  value={form.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  placeholder="Author name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Read Time (min)</Label>
                <Input
                  type="number"
                  value={form.readTime}
                  onChange={(e) => updateField("readTime", parseInt(e.target.value) || 5)}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* English content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">English Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title (EN) *</Label>
              <Input
                value={form.titleEn}
                onChange={(e) => updateField("titleEn", e.target.value)}
                placeholder="Article title in English"
              />
            </div>
            <div className="space-y-2">
              <Label>Excerpt (EN) *</Label>
              <Textarea
                value={form.excerptEn}
                onChange={(e) => updateField("excerptEn", e.target.value)}
                placeholder="Brief summary in English"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Content (EN)</Label>
              <Textarea
                value={form.contentEn}
                onChange={(e) => updateField("contentEn", e.target.value)}
                placeholder="Full article content in English (Markdown supported)"
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Chinese content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chinese Content (中文内容)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title (ZH) *</Label>
              <Input
                value={form.titleZh}
                onChange={(e) => updateField("titleZh", e.target.value)}
                placeholder="文章中文标题"
              />
            </div>
            <div className="space-y-2">
              <Label>Excerpt (ZH) *</Label>
              <Textarea
                value={form.excerptZh}
                onChange={(e) => updateField("excerptZh", e.target.value)}
                placeholder="中文摘要"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Content (ZH)</Label>
              <Textarea
                value={form.contentZh}
                onChange={(e) => updateField("contentZh", e.target.value)}
                placeholder="中文正文内容（支持Markdown）"
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Publishing options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Published</Label>
                <p className="text-xs text-muted-foreground">Make this article visible to readers</p>
              </div>
              <Switch
                checked={form.published}
                onCheckedChange={(v) => updateField("published", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Featured</Label>
                <p className="text-xs text-muted-foreground">Show in the hero section on homepage</p>
              </div>
              <Switch
                checked={form.featured}
                onCheckedChange={(v) => updateField("featured", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isNew ? "Create Article" : "Save Changes"}
          </Button>
          <Link href="/admin/articles">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
