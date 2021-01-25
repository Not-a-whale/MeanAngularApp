import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Route, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  posts: any = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: String; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
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
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }

  constructor(private http: HttpClient, private router: Router) {}
}
