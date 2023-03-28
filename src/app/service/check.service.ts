import { Injectable } from '@angular/core';
import { ToastService } from 'ng-zorro-antd-mobile';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CheckService {

  constructor(
    private _toast: ToastService
  ) { }

  /**
   * 校验登陆信息
   * @author 崔世康
   */
  checkLoginMsg(loginMsg) {
    let flag = false;
    if (loginMsg !== null) {
      if (loginMsg.loginName !== '' && loginMsg.password !== '') {
        flag = true;
      }
    }
    return flag;
  }

  /**
   * 分页
   * @author 崔世康
   */
  getPageMsg() {
    const page = {
      offset: 0,
      limit: 10,
      total: 0,
      rows: [],
      orderBy: '',
      condition: {}
    };
    return page;
  }

  /**
   * 提示
   * @author 崔世康
   */
  commonToast(msg: string, durationTime?) {
    if (msg === null || msg === undefined) {
      msg = '未知错误';
    }
    const time = durationTime === undefined ? 4000 : durationTime;
    this._toast.info(msg, time, null, false);
  }

  /**
   * 非空校验
   * @author 崔世康
   */
  checkNonNull(value) {
    if (value === '' || value === undefined || value === null || value.length === 0) {
      return true;
    }
    return false;
  }

  /**
   * 密码格式校验
   * @author 崔世康
   */
  checkPass(pass) {
    const reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{6,}$/;
    if (!reg.test(pass)) {
      return true;
    }
    return false;
  }

  /**
   * 电话格式校验
   * @author 崔世康
   */
  checkPhoneNum(mobile) {
    const reg = /^$|^\d{11}$/;
    if (!reg.test(mobile)) {
      return true;
    }
    return false;
  }

  /**
   * 邮箱格式校验
   * @author 崔世康
   */
  checkEmail(email) {
    const reg = /^$|^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!reg.test(email)) {
      return true;
    }
    return false;
  }

  /**
   * 身份证、驾照格式校验
   * @author 崔世康
   */
  checkIDNum(idNum) {
    const reg = /^$|^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!reg.test(idNum)) {
      return true;
    }
    return false;
  }

  /**
   * 车牌号校验规则
   * @author 雷成
   */
  checkCarNum(carNum) {
    // tslint:disable-next-line:max-line-length
    const reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
    if (carNum !== '' && !reg.test(carNum)) {
      return true;
    }
    return false;
  }

  /**
   * 正数校验
   * @author 雷成
   */
  checkPositiveNum(num) {
    const reg = /^(0|[1-9][0-9]*)(\.\d+)?$/;
    if (num !== '' && !reg.test(num)) {
      return true;
    }
    return false;
  }

  /**
   * 日期范围校验
   * @author 崔世康
   */
  checkDateRange(begin, end, format) {
    begin = this.checkDateFormat(begin, end, format).begin;
    end = this.checkDateFormat(begin, end, format).end;
    if (begin.diff(end) > 0) {
      return true;
    }
    return false;
  }

  /**
   * 日期格式校验-依附checkDateRange
   * @author 崔世康
   */
  checkDateFormat(begin, end, format) {
    if (format === 'YYYY-MM-DD') {
      begin = moment(begin, 'YYYY-MM-DD');
      end = moment(end, 'YYYY-MM-DD');
    } else if (format === 'YYYYMMDDHH') {
      begin = moment(begin, 'YYYYMMDDHH');
      end = moment(end, 'YYYYMMDDHH');
    }
    return { begin, end };
  }

  /**
   * 转换证 2022年04月12日00时00分
   * @param value 日期
   */
  getDateTime(value: any) {
    if (value !== undefined && value !== '') {
      const date: Date = new Date(value);
      const dataTime = {
        yyyy: date.getFullYear(), // 年
        MM: this.repairZero(date.getMonth() + 1),                 // 月份
        dd: this.repairZero(date.getDate()),                    // 日
        hh: this.repairZero(date.getHours()),                   // 小时
        mm: this.repairZero(date.getMinutes()),                 // 分
        ss: this.repairZero(date.getSeconds()),                 // 秒
      };
      return dataTime.yyyy + '年' +
        dataTime.MM + '月' +
        dataTime.dd + '日' +
        dataTime.hh + '时' +
        dataTime.mm + '分';
    }
    return '';
  }

  /**
   * 日期补零
   * @param value 数据
   */
  repairZero(value: any) {
    if (value !== undefined) {
      if (value < 10) {
        value = '0' + value;
      }
    }
    return value;
  }
  /**
   * id
   */
  getGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:no-bitwise
      const r = Math.random() * 16 | 0;
      // tslint:disable-next-line:no-bitwise
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
