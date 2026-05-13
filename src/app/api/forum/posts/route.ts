import { NextRequest, NextResponse } from 'next/server';
import { db, FieldValue } from '@/lib/firebase-admin';

// GET all forum posts
export async function GET() {
  try {
    const postsRef = db.collection("forum_posts");
    // Sort by newest first
    const snapshot = await postsRef
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        author: data.author,
        category: data.category,
        replies: data.replies || 0,
        upvotes: data.upvotes || 0,
        hot: data.upvotes > 10,
        // Mocking timeAgo for simplicity; in a real app, calculate from createdAt
        timeAgo: "Just now", 
        createdAt: data.createdAt
      };
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

// CREATE a new forum post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, author } = body;

    if (!title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postsRef = db.collection("forum_posts");
    const newPost = {
      title,
      category,
      author: author || "Anonymous Learner",
      replies: 0,
      upvotes: 1,
      createdAt: FieldValue.serverTimestamp()
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
