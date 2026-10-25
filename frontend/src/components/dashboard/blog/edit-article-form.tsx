import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type ArticleFormProps = {
  initialData?: {
    title: string;
    desc: string;
    content?: string;
    video?: string;
  };
  onSubmit: (data: any) => void;
};

export default function EditArticleForm({ initialData, onSubmit }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    desc: initialData?.desc || "",
    content: initialData?.content || "",
    video: initialData?.video || "",
    hasVideo: !!initialData?.video,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoToggle = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      hasVideo: checked,
      video: checked ? prev.video : ""
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    


    const formDataSent = new FormData();
    formDataSent.append("title", formData.title);
    formDataSent.append("desc", formData.desc);
    formDataSent.append("content", formData.content);
    
    if (formData.hasVideo) {
      formDataSent.append("video", formData.video);
    }
  
    const imageInput = document.getElementById("image") as HTMLInputElement;
    if (imageInput.files?.length) {
      formDataSent.append("article_image", imageInput.files[0]);
    }
  
    onSubmit(formDataSent);
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>إضافة مقال جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان المقال</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="desc">وصف مختصر</Label>
            <Textarea
              id="desc"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              required
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">محتوى المقال</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasVideo"
                checked={formData.hasVideo}
                onCheckedChange={handleVideoToggle}
              />
              <Label htmlFor="hasVideo">إضافة فيديو</Label>
            </div>
          </div>
          
          {formData.hasVideo && (
            <div className="space-y-2">
              <Label htmlFor="video">رابط الفيديو</Label>
              <Input
                id="video"
                name="video"
                value={formData.video}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="image">صورة المقال</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="text-white" type="submit">حفظ المقال</Button>
        </CardFooter>
      </Card>
    </form>
  );
}