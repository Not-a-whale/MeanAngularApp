import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Route, Router } from '@angular/router';

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
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
            };
          });
          return data;
        })
      )
      .subscribe((data) => {
        this.posts = data;
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };
    }
    /*     const post: Post = {
      id: id,
      title: title,
      content: content,
      imagePath: null,
    }; */
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((res) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: '',
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
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

  addPosts(title: string, contant: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', contant);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((response) => {
        const post: Post = {
          id: response.post.id,
          title: title,
          content: contant,
          imagePath: response.post.imagePath,
        };
        const postId = response.post.id;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPost(
    id: string
  ): Observable<{
    _id: string;
    title: string;
    content: string;
    imagePath: string;
  }> {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => {
          return post.id !== postId;
        });
        console.log(updatedPosts);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  constructor(private http: HttpClient, private router: Router) {}
}
