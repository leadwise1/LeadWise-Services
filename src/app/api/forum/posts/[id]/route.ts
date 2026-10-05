import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth, admin } from '@/lib/firebase-admin';
import { z } from 'zod';

const replySchema = z.object({ content: z.string().trim().min(1).max(10000), author: z.string().trim().min(1).max(60) });
type Context = { params: Promise<{ id: string }> };

function postRef(id: string) {
  return adminDb!.collection('artifacts').doc('leadwise-web').collection('public').doc('data').collection('forumPosts').doc(id);
}

function serialize(doc: admin.firestore.DocumentSnapshot) {
  const data = doc.data()!;
  return {
    id: doc.id,
    title: data.title || '',
    content: data.content || '',
    author: data.author || 'LeadWise Learner',
    authorId: data.authorId || '',
    category: data.category || 'General Discussion',
    replies: data.replies || 0,
    upvotes: data.upvotes || 0,
    createdAtMillis: data.createdAt?.toMillis?.() || null,
  };
}

export async function GET(_request: NextRequest, { params }: Context) {
  if (!adminDb) return NextResponse.json({ error: 'Community unavailable' }, { status: 503 });
  const { id } = await params;
  try {
    const ref = postRef(id);
    const [post, replies] = await Promise.all([ref.get(), ref.collection('comments').orderBy('createdAt', 'asc').get()]);
    if (!post.exists) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ post: serialize(post), comments: replies.docs.map(serialize) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Discussion unavailable' }, { status: 503 });
  }
}

export async function POST(request: NextRequest, { params }: Context) {
  if (!adminDb || !adminAuth) return NextResponse.json({ error: 'Community unavailable' }, { status: 503 });
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return NextResponse.json({ error: 'Please reconnect to the community.' }, { status: 401 });
  let uid: string;
  try {
    uid = (await adminAuth.verifyIdToken(token)).uid;
  } catch {
    return NextResponse.json({ error: 'Please reconnect to the community.' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const ref = postRef(id);
    if (body.action === 'upvote') {
      await adminDb.runTransaction(async transaction => {
        const post = await transaction.get(ref);
        if (!post.exists) throw new Error('Post not found');
        transaction.update(ref, { upvotes: admin.firestore.FieldValue.increment(1) });
      });
      return NextResponse.json({ success: true });
    }
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Please include your name and reply.' }, { status: 400 });
    await adminDb.runTransaction(async transaction => {
      const post = await transaction.get(ref);
      if (!post.exists) throw new Error('Post not found');
      transaction.set(ref.collection('comments').doc(), { ...parsed.data, authorId: uid, createdAt: admin.firestore.FieldValue.serverTimestamp() });
      transaction.update(ref, { replies: admin.firestore.FieldValue.increment(1) });
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Your update could not be saved.' }, { status: 503 });
  }
}
