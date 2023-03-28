import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageStore } from './local-storage.service';

export const FILE_URL: any = 'http://10.228.193.236/';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  

  private baseUrl = 'http://8.130.13.156/nhuyy/webapp/'
  // private baseUrl = 'https://ydbg.yjglj.shanghai.gov.cn:8088/nhuyy/webapp/';

  // private baseUrl = 'http://172.26.1.71:8088/nhuajs/webapp/';
  // private baseUrl = 'http://10.228.193.236/nhuyy/webapp/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: LocalStorageStore,
  ) { }

  /**
   * postNoToken 方法 for login
   * @author 崔世康
   */
  public postNoToken(methodName: string, paramObj?: any) {
    return this.http.post(
      this.baseUrl + methodName,
      paramObj,
      {
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
        },
        observe: 'response',
        params: paramObj,
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      if (res.body.code === 200) {
        const token = res.body.data;
        this.storage.set('token', token);
      }
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }

  /**
   * get方法
   * @author 崔世康
   */
  public get(methodName: string, paramObj?: any) {
    const header = new HttpHeaders({
      accessToken: this.storage.get('token').toString(),
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.http.get(
      this.baseUrl + methodName,
      {
        headers: header,
        observe: 'response',
        params: paramObj,
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }

  /**
   * get方法图片
   * @author 崔世康
   */
  public getAgent(methodName: string, paramObj?: any) {
    const header = new HttpHeaders({
      accessToken: this.storage.get('token').toString(),
      agent: 'mobile',
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.http.get(
      this.baseUrl + methodName,
      {
        headers: header,
        observe: 'response',
        params: paramObj,
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }

  /**
   * get方法不传token
   * @author 崔世康
   */
  public getNoToken(methodName: string, paramObj?: any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.http.get(
      this.baseUrl + methodName,
      {
        headers: header,
        observe: 'response',
        params: paramObj,
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }

  /**
   * post方法
   * @author 崔世康
   */
  public post(methodName: string, paramObj?: any) {
    const header = new HttpHeaders({
      accessToken: this.storage.get('token').toString(),
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.http.post(
      this.baseUrl + methodName,
      paramObj,
      {
        headers: header,
        observe: 'response',
        params: {},
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      if (res.body.code === 401) {
        this.router.navigate(['login']);
      }
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }

  public upload(methodName: string, paramObj?: any, name?: string) {
    const header = new HttpHeaders({
      accessToken: this.storage.get('token').toString(),
      fileName: name,
      // 'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.http.post(
      this.baseUrl + methodName,
      paramObj,
      {
        headers: header,
        observe: 'response',
        responseType: 'json',
        withCredentials: true,
        reportProgress: true,
      }
    );
  }

  /**
   * put方法
   * @author 崔世康
   */
  public put(methodName: string, paramObj?: any) {
    const header = new HttpHeaders({
      accessToken: this.storage.get('token').toString(),
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.http.put(
      this.baseUrl + methodName,
      paramObj,
      {
        headers: header,
        observe: 'response',
        params: {},
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }

  /**
   * delete方法 删除方法 methodName 'delete/' + xxx.recId;
   * @author 崔世康
   */
  public delete(methodName: string) {
    const header = new HttpHeaders({
      accessToken: this.storage.get('token').toString(),
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.http.delete(
      this.baseUrl + methodName,
      {
        headers: header,
        observe: 'response',
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }


  /**
   * 获取token refreshToken
   * @author 崔世康
   */
  refreshToken(methodName: string, paramObj?: any) {
    const header = new HttpHeaders({
      accessToken: this.storage.get('token').toString(),
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.post4Token(methodName, paramObj, header);
  }

  /**
   * post4Token 方法 for refresh token
   * @author 崔世康
   */
  post4Token(methodName: string, paramObj: any, header: any) {
    return this.http.post(
      this.baseUrl + methodName,
      paramObj,
      {
        headers: header,
        observe: 'response',
        params: {},
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      if (res.body.code === 200) {
        const token = res.headers.get('token');
        this.storage.set('token', token);
      }
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }

  /**
   * 错误返回
   * @author 崔世康
   */
  public handleError(error: Response | any) {
    let msgs = '服务器异常，请求失败';
    let resCode = -1;
    if (error.status === 0) {
      msgs = '请求地址错误';
    } else if (error.status === 400) {
      msgs = '请求无效';
    } else if (error.status === 404) {
      msgs = '请求资源不存在';
    } else if (error.status === 401) { // 登陆token生效
      this.storage.clear();
      this.router.navigate(['login']);
      msgs = '登录过期';
    } else if (error.status === 449) { // 刷新token过期
      this.refreshToken('/refreshToken');
      resCode = 449;
    }
    return { code: resCode, msg: msgs, serviceError: true };
  }

  /**
   * 版本信息
   * @param url 
   * @param paramObj 
   */
  public getVersion(url: string, paramObj?: any) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    return this.http.post(
      url,
      paramObj,
      {
        headers: header,
        observe: 'response',
        params: {},
        responseType: 'json',
        withCredentials: true
      }
    ).toPromise().then((res: any) => {
      if (res.body.code === 401) {
        this.router.navigate(['login']);
      }
      return res.body;
    }).catch(
      error => this.handleError(error)
    );
  }
}
