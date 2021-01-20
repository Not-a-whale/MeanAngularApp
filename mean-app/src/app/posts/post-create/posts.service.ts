import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    this.http
      .get<{ message: String; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, contant: string) {
    const post: Post = { title: title, content: contant };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        console.log(response);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  constructor(private http: HttpClient) {}
}
