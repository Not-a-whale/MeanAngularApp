import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostsService {
  posts: any = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    this.http
      .get<{ message: String; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          let data = postData.posts.map((post) => {
            return { title: post.title, content: post.content, id: post._id };
          });
          return data;
        })
      )
      .subscribe((data) => {
        this.posts = data;
        this.postsUpdated.next([...this.posts]);
      });
  }

  /*   getPosts() {
    this.http
      .get<{ message: String; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return { title: post.title, content: post.content, id: post._id };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.posts;
        console.log(this.posts);
        this.postsUpdated.next([...this.posts]);
      });
  }
 */
  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, contant: string) {
    const post: Post = { title: title, content: contant };
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((response) => {
        const postId = response.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => {
          return post.id !== postId;
        });
        console.log(updatedPosts);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  constructor(private http: HttpClient) {}
}
