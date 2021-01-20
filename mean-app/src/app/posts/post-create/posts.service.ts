import { Post } from './post.model';
import { Subject } from 'rxjs';

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, contant: string) {
    const post: Post = { title: title, content: contant };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
