/*
 * @Author: 九阳
 * @Date: 2022-07-26 15:05:17
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-02 08:55:27
 */
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'ph-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class PHLoginComponent implements OnDestroy {
  loginObject: any = {
    loginName: '',
    passWord: '',
  };
  loginNameError: any = false;
  passwordError: any = false;
  loginNameErrorMsg: any = '';
  passwordErrorMsg: any = '';
  loginDisabled = true;
  isSaveLoading = false;
  constructor(
    private router: Router,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService,
    private loadingService: LoadingService
  ) {
    this.storage.clear();
  }

  submit(): void {
    this.loginNameError = false;
    this.passwordError = false;
    this.loginNameErrorMsg = '';
    this.passwordErrorMsg = '';
    if (this.loginObject.loginName === '') {
      this.loginNameError = true;
      // this.loginNameCross = false;
      this.loginNameErrorMsg = '用户名不能为空!';
    } else if (this.loginObject.passWord === '') {
      this.passwordError = true;
      // this.loginPasswordCross = false;
      this.passwordErrorMsg = '密码不能为空!';
    } else {
      this.gotoLogin(this.loginObject);
    }
  }


  /**
     * 调用登录接口
     * @author 倪攀
     */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  gotoLogin(loginObject: any) {
    const methodName = 'login';
    this.loadingService.loading(true);
    this.http.postNoToken(methodName, loginObject).then((res: any) => {
      if (res.code === 200) {
        this.storage.set('loginUser', loginObject);
        this.getMyInformation(loginObject);
        this.loadingService.loading(false);
      } else {
        this.loginNameError = true;
        this.loadingService.loading(false);
        this.loginNameErrorMsg = res.msg;
        // this.checkService.commonToast(res.msg);
      }
    });
  }

  /**
   * 获取我的信息
   * @author 崔世康
   */
  getMyInformation(loginObject: any) {
    const methodName = 'getUserInfo';
    this.http.post(methodName, { userId: loginObject.loginName }).then((res: any) => {
      if (res.code === 200) {
        this.storage.set('userMsg', res.data);
        this.router.navigate(['tabs']);
      } else {
        this.checkService.commonToast(res.msg);
      }
    });
  }

  ngOnDestroy(): void {
  }
}
