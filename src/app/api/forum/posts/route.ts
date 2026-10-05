import { NextRequest, NextResponse } from 'next/server';
import { adminDb, admin, adminAuth } from '@/lib/firebase-admin';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().max(10000).default(''),
  category: z.enum(['General Discussion', 'Announcements', 'Opportunities', 'Workshops', 'Networking']),
  author: z.string().trim().min(1).max(60),
});

// GET all forum posts
export async function GET() {
  if (!adminDb) {
    console.error("Forum API: adminDb is not initialized.");
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  try {
    const postsRef = adminDb.collection("artifacts").doc("leadwise-web").collection("public").doc("data").collection("forumPosts");
    // Sort by newest first
    const snapshot = await postsRef
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content || '',
        author: data.author,
        authorId: data.authorId || '',
        category: data.category,
        replies: data.replies || 0,
        upvotes: data.upvotes || 0,
        hot: data.upvotes > 10,
        timeAgo: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-US') : 'Just now',
        createdAtMillis: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
      };
    });

    return NextResponse.json({ success: true, data: posts }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

// CREATE a new forum post
export async function POST(request: NextRequest) {
  if (!adminDb || !adminAuth) {
    console.error("Forum API: adminDb is not initialized.");
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return NextResponse.json({ error: 'Please join the community before posting.' }, { status: 401 });
  let authorId: string;
  try {
    authorId = (await adminAuth.verifyIdToken(token)).uid;
  } catch {
    return NextResponse.json({ error: 'Please reconnect to the community.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Please check your title, name, and post details.' }, { status: 400 });
    const { title, content, category, author } = parsed.data;
    if (category !== 'General Discussion' && !content) return NextResponse.json({ error: 'Please include details for this update.' }, { status: 400 });

    const postsRef = adminDb.collection("artifacts").doc("leadwise-web").collection("public").doc("data").collection("forumPosts");
    const newPost = {
      title,
      content,
      category,
      author,
      authorId,
      replies: 0,
      upvotes: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await postsRef.add(newPost);

    return NextResponse.json({ 
      success: true, 
      data: { id: docRef.id, ...newPost, timeAgo: "Just now", hot: false } 
    });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
