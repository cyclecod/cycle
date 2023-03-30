import { Pipe, PipeTransform, InjectionToken, Inject, Injectable, Optional, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Pipe({ name: 'stringLength' })
export class StringLengthPipe implements PipeTransform {
    transform(value: string, exponent?: number): number {
        return value.length;
    }
}

/**
 * 日期格式化
 */
@Pipe({ name: 'phDateTime' })
export class DateTimePipe implements PipeTransform {
    transform(value: any, type: string): string {
        let dataTime = '';
        if (typeof(value) === 'string') {
            value = value.trim();
        }
        if (value === null || value === undefined || value === '') {
            return dataTime;
        }
        if (type === 'YYYY-MM-DD HH:mm:ss') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
        }
        if (type === 'YYYY-MM-DD HH:mm') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm');
        }
        if (type === 'YYYY-MM-DD HH') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH');
        }
        if (type === 'YYYY-MM-DD') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD');
        }
        if (type === 'YYYY-MM') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('YYYY-MM');
        }
        if (type === 'YYYY') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('YYYY');
        }
        if (type === 'HH:mm:ss') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('HH:mm:ss');
        }
        if (type === 'MM') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('MM');
        }
        if (type === 'DD') {
            dataTime = moment(value, 'YYYYMMDDHHmmss').format('DD');
        }
        return dataTime;
    }
}

@Pipe({ name: 'phDateFormat' })
export class DateFormatPipe implements PipeTransform {
    transform(value: any, type: string): string {
        let dataTime = '';
        if (typeof(value) === 'string') {
            value = value.trim();
        }
        if (value === null || value === undefined || value === '') {
            return dataTime;
        }
        if (type === 'YYYYMMDDHHmmss') {
            dataTime = moment(value).format('YYYYMMDDHHmmss');
        }
        if (type === 'YYYYMMDDHHmm') {
            dataTime = moment(value).format('YYYYMMDDHHmm');
        }
        if (type === 'YYYYMMDDHH') {
            dataTime = moment(value).format('YYYYMMDDHH');
        }
        if (type === 'YYYYMMDD') {
            dataTime = moment(value).format('YYYYMMDD');
        }
        if (type === 'YYYYMM') {
            dataTime = moment(value).format('YYYYMM');
        }
        if (type === 'YYYY') {
            dataTime = moment(value).format('YYYY');
        }
        return dataTime;
    }
}

/**
 * 小代码值转换
 */
@Pipe({ name: 'codeValue' })
export class SmallCodeValuePipe implements PipeTransform {
    transform(value: string, list: any[]): string {
        if (list === undefined) {
            return '';
        }
        for (const key of list) {
            if (key['itemCode'] === value) {
                value = key['itemCname'];
            }
        }
        return value;
    }
}

@Pipe({
        name: 'statePipe'
    })
    export class StatePipe implements PipeTransform {
        transform(data: string, list: any) {
        
            return list[data];
        
        }
        
    }
