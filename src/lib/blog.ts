import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    author: string;
    category: string;
    image: string;
    imageAlt: string;
    content?: string;
}

export function getBlogPosts(): BlogPost[] {
    if (!fs.existsSync(BLOG_DIR)) return [];

    const files = fs.readdirSync(BLOG_DIR);
    const posts = files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
            const filePath = path.join(BLOG_DIR, file);
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const { data } = matter(fileContent);

            return {
                slug: file.replace(".mdx", ""),
                title: data.title,
                description: data.description,
                date: data.date,
                readTime: data.readTime,
                author: data.author || "Mascot Maker Team",
                category: data.category,
                image: data.image,
                imageAlt: data.imageAlt,
            } as BlogPost;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return null;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        readTime: data.readTime,
        author: data.author || "Mascot Maker Team",
        category: data.category,
        image: data.image,
        imageAlt: data.imageAlt,
        content,
    } as BlogPost;
}
